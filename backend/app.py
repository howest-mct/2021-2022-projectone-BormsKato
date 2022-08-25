import time
import serial
from RPi import GPIO
from helpers.klasseknop import Button
from helpers.klasseMCP import MCPclass
import threading
import smbus
from smbus import SMBus
from subprocess import check_output
from logging import shutdown
import os
from datetime import datetime

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
import socket
from flask import Flask, jsonify
from repositories.DataRepository import DataRepository
from repositories.Database import Database


from selenium import webdriver


# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
ledPinR = 21
btnPinR = Button(20)
ledPinL = 24
btnPinL = Button(23)
startbtn = Button(26)
stopbtn = Button(19)

inputwaardeldr = 70

klasseMCP = MCPclass()
ledPinV = 16

i2c = SMBus()  
i2c.open(1) 

vorigelatitude = 0.0
vorigelongitude = 0.0

globalid = "0"

port="/dev/ttyS0"

# Code voor Hardware
def setup_gpio():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(ledPinR, GPIO.OUT)
    GPIO.output(ledPinR, GPIO.LOW)
    GPIO.setup(ledPinL, GPIO.OUT)
    GPIO.output(ledPinL, GPIO.LOW)
    GPIO.setup(ledPinV, GPIO.OUT)
    GPIO.output(ledPinV, GPIO.LOW)
    
    btnPinR.on_press(pinkR)
    btnPinL.on_press(pinkL)
    stopbtn.on_press(Shutter)
    startbtn.on_press(startroute)


def pinkR(pin):
    print("rechts pink")
    for i in range(1,10):
        GPIO.output(ledPinR, 1)
        time.sleep(0.5)
        GPIO.output(ledPinR, 0)
        time.sleep(0.5)
        i +=1

def pinkL(pin):
    print("links pink")
    for i in range(1,10):
        GPIO.output(ledPinL, 1)
        time.sleep(0.5)
        GPIO.output(ledPinL, 0)
        time.sleep(0.5)
        i +=1

def ldr():
    while True:
        ldrdata = klasseMCP.read_channel(1)
        print(ldrdata)
        waardeldr = 100 - (ldrdata/1023 *100)
        print(waardeldr)
        global inputwaardeldr
        print(f'Input ldr ingesteld = {inputwaardeldr}')
        if waardeldr < inputwaardeldr:
            GPIO.output(ledPinV, 1)
        else:
            GPIO.output(ledPinV, 0)
        # DataRepository.create_log_meethistoriek(4,1,datetime.now(),waardeldr, "ldr meting")
        socketio.emit('LightData', {'light': f'{ "%.0f" % waardeldr}'})
        time.sleep(20)
        
def gps():
    while True:
        ser=serial.Serial(port, baudrate=9600, timeout=0.5)
        newdata=ser.readline()
        # print(newdata)
        properdata = newdata.decode('utf-8').replace('b','').replace('$','').replace('\r','').replace('\n','')

        if properdata[0:5] == "GNRMC":
            global vorigelatitude, vorigelongitude
            print(properdata)
            latitude= properdata[18:28]
            Dlat= latitude[0:2]
            Mlat = latitude[2:4]
            Slat =latitude[5:10]
            print(Slat)
            Slatproper = Slat[0:2] + "." + Slat[2:7]
            print(Slatproper)
            latitudeWaarde = float(Dlat) + (float(Mlat)/60) + (float(Slatproper)/3600)
            print(latitudeWaarde)
            longitude= properdata[33:42]
            Dlong= longitude[0:1]
            Mlong = longitude[1:3]
            Slong =longitude[4:9]
            Slongproper = Slong[0:2] + "." + Slong[2:7]
            longitudeWaarde = float(Dlong) + (float(Mlong)/60) + (float(Slongproper)/3600)
            if latitudeWaarde != vorigelatitude and longitudeWaarde != vorigelongitude:
                socketio.emit('gpsdata', {'latitudeWaarde': f'{latitudeWaarde}','longitudeWaarde': f'{longitudeWaarde}'})
            print(longitudeWaarde)
            str_gps = str(latitudeWaarde) + str(longitudeWaarde)
            # DataRepository.create_log_meethistoriek(2,3,datetime.now(),str_gps, "gps meting")
            vorigelatitude = latitudeWaarde
            vorigelongitude = longitudeWaarde
            time.sleep(1)

#LCD

I2C_ADDR  = 0x27 # I2C device address
LCD_WIDTH = 16   # Maximum characters per line

# Define some device constants
LCD_CHR = 1 # Mode - Sending data
LCD_CMD = 0 # Mode - Sending command

LCD_LINE_1 = 0x80 # LCD RAM address for the 1st line
LCD_LINE_2 = 0xC0 # LCD RAM address for the 2nd line

LCD_BACKLIGHT  = 0x08  # On 0X08 / Off 0x00

ENABLE = 0b00000100 # Enable bit

E_PULSE = 0.0005
E_DELAY = 0.0005

bus = smbus.SMBus(1) # Rev 2 Pi uses 1

counter=0

def lcd_init():
  lcd_byte(0x33,LCD_CMD) # 110011 Initialise
  lcd_byte(0x32,LCD_CMD) # 110010 Initialise
  lcd_byte(0x06,LCD_CMD) # 000110 Cursor move direction
  lcd_byte(0x0C,LCD_CMD) # 001100 Display On,Cursor Off, Blink Off
  lcd_byte(0x28,LCD_CMD) # 101000 Data length, number of lines, font size
  lcd_byte(0x01,LCD_CMD) # 000001 Clear display
  time.sleep(E_DELAY)

def lcd_byte(bits, mode):

  bits_high = mode | (bits & 0xF0) | LCD_BACKLIGHT
  bits_low = mode | ((bits<<4) & 0xF0) | LCD_BACKLIGHT

  bus.write_byte(I2C_ADDR, bits_high)
  lcd_toggle_enable(bits_high)

  bus.write_byte(I2C_ADDR, bits_low)
  lcd_toggle_enable(bits_low)

def lcd_toggle_enable(bits):
  time.sleep(E_DELAY)
  bus.write_byte(I2C_ADDR, (bits | ENABLE))
  time.sleep(E_PULSE)
  bus.write_byte(I2C_ADDR,(bits & ~ENABLE))
  time.sleep(E_DELAY)

def lcd_string(message,line):
  message = message.ljust(LCD_WIDTH," ")
  lcd_byte(line, LCD_CMD)
  for i in range(LCD_WIDTH):
    lcd_byte(ord(message[i]),LCD_CHR)

def show_ip():
    global ip
    lcd_string("",LCD_LINE_1)
    lcd_string("",LCD_LINE_2)
    time.sleep(0.3)
    lcd_string("WIFI:",LCD_LINE_1)
    lcd_string(ip,LCD_LINE_2)

class MPU6050:
    def __init__(self, address):
        self.addr = address
        self.setup()

    def setup(self):
        # schaalfactor accelerometer
        self.__write_byte(0x1C, 0x00)
        # schaalfactor gyroscoop
        self.__write_byte(0x1B, 0x00)
        # sensor uit slaapstand
        self.__write_byte(0x6B, 0x01)
      

    def print_data(self):
        while True:
            print("***")
            print('De temperatuur is {}°C'.format(self.read_temp()))
            temp = self.read_temp()
            # DataRepository.create_log_meethistoriek(3,2,datetime.now(),temp, "temp meting")
            socketio.emit('TempData', {'temp': f'{ "%.0f" % temp}'})
            accel = self.read_accel()
            str_accel = str(accel)
            # DataRepository.create_log_meethistoriek(6,5,datetime.now(),str_accel, "accel meting")
            print('Accel: x = {0}, y = {1}, z = {2}'.format(
                accel[0], accel[1], accel[2]))
            gyro = self.read_gyro()
            str_gyro = str(gyro)
            # DataRepository.create_log_meethistoriek(5,4,datetime.now(),str_gyro, "gyro meting")
            print('Gyro : x = {0}°/s, y = {1}°/s, z = {2}°/s'.format(
                gyro[0], gyro[1], gyro[2]))
            print()
            time.sleep(10)

    @staticmethod
    def combine_bytes(msb, lsb):
        value = msb << 8 | lsb
        if value & 0x8000:
            value -= 65536  # 2^n, n=16
        return value

    def read_temp(self):
        values = self.__read_data(0x41, 2)
        return round(values[0] / 340 + 36.53, 2)

    def read_accel(self):
        values = self.__read_data(0x3B, 6)
        for i in range(len(values)):
            values[i] = round(values[i] / 16384, 2)
        return values

    def read_gyro(self):
        values = self.__read_data(0x43, 6)
        for i in range(len(values)):
            values[i] = round(values[i] / 250, 2)
        return values

    def __write_byte(self, register, value):
        i2c.write_byte_data(self.addr, register, value)

    def __read_data(self, register, count):
        arr = i2c.read_i2c_block_data(self.addr, register, count)
        values = []
        for i in range(0, count, 2):
            byte = self.combine_bytes(arr[i], arr[i+1])
            values.append(byte)
        return values

def Shutter(btn):
    # DeviceID=5
    # ActieID=2
    # Datum=datetime.now()
    # Waarde=float(temperatuur)
    # Commentaar='Shutdown'
    # DataRepository.create_log(DeviceID,ActieID,Datum,Waarde,Commentaar)
    lcd_string("Shutting Down",LCD_LINE_1)
    lcd_string("Goodbye!",LCD_LINE_2)
    time.sleep(2)
    i2c.close()
    GPIO.cleanup()
    lcd_string("",LCD_LINE_1)
    lcd_string("",LCD_LINE_2)
    os.system("sudo shutdown -h now")

def sending_lightvalue():
    while True:
        global inputwaardeldr
        socketio.emit('lightdata', {'light': inputwaardeldr})
        time.sleep(1)

def toonduurtijdroute(start):
    print("in toonduurtijd")
    print("start" + str(start))
    startdata = str(start)
    socketio.emit('startdata', {'start': str(start)})


# Code voor Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'geheim!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False,
                    engineio_logger=False, ping_timeout=1)

CORS(app)


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)


# API ENDPOINTS
endpoint = '/api/v1'

@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

@app.route(endpoint + '/horses/', methods=['GET'])
def read_horses():
    print('Get horses')
    result = DataRepository.read_horses()
    return jsonify(result)

@app.route(endpoint + '/latestroutes/', methods=['GET'])
def read_history():
    print('Get history')
    # result = DataRepository.read_history()
    # return jsonify(result)
    # dropdownhistoriek()
    global globalid
    print(f"geslecteerde paard id: {globalid}")
    if globalid == "0":
        result = DataRepository.read_history()
        print("in id 0")
        return jsonify(result)
    else:
        result = DataRepository.read_history_filtered(globalid)
        print("in id andere")
        return jsonify(result)

@app.route(endpoint + '/index/', methods=['GET'])
def read_horsename():
    print('Get horsename')
    result = DataRepository.read_horsename()
    return jsonify(result)


#SocketIO
@socketio.on('connect')
def initial_connection():
    print('A new client connected')

@socketio.on('F2B_shutdown')
def shutter():
        print('Shutdown')
        Shutter()

@socketio.on('F2B_light')
def Lightpercentage(light):
    global inputwaardeldr
    socketio.emit('B2F_status_licht', {'light': light})
    print(f'ingestelde lichtsterkte: {light}')
    inputwaardeldr = int(light)

@socketio.on('F2B_newhorse')
def newhorse(naam, leeftijd):
    print(f'nieuw paard: {naam} {leeftijd}')
    DataRepository.add_horse(naam, leeftijd)

@socketio.on('F2B_dropdownhistoriek')
def dropdownhistoriek(id):
    global globalid
    globalid = id

@socketio.on('F2B_deletehorse')
def deletehorse(paard):
    print(f"verwijderd paard: {paard}")
    DataRepository.delete_horse(paard)
        
@socketio.on('F2B_startroute')
def startroute(hallo):
    print("route gestart!!!!!!")
    starttijd = datetime.now()
    print(starttijd)
    toonduurtijdroute(starttijd)



# START een thread op. Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# werk enkel met de packages gevent en gevent-websocket.
def start_chrome_kiosk():
    import os

    os.environ['DISPLAY'] = ':0.0'
    options = webdriver.ChromeOptions()
    # options.headless = True
    # options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36")
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-running-insecure-content')
    options.add_argument("--disable-extensions")
    # options.add_argument("--proxy-server='direct://'")
    options.add_argument("--proxy-bypass-list=*")
    options.add_argument("--start-maximized")
    options.add_argument('--disable-gpu')
    # options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    options.add_argument('--kiosk')
    # chrome_options.add_argument('--no-sandbox')         
    # options.add_argument("disable-infobars")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    driver = webdriver.Chrome(options=options)
    driver.get("http://localhost")
    while True:
        pass


def start_chrome_thread():
    print("**** Starting CHROME ****")
    chromeThread = threading.Thread(target=start_chrome_kiosk, args=(), daemon=True)
    chromeThread.start()

def start_mpu_thread():
    print("**** Starting mpu ****")
    ThreadData = threading.Thread(target=mpu.print_data, args=(), daemon=True)
    ThreadData.start()

def start_ldr_thread():
    print("**** Starting ldr ****")
    Threadldr = threading.Thread(target=ldr, args=(), daemon=True)
    Threadldr.start()

def start_gps_thread():
    print("**** Starting gps ****")
    Threadgps = threading.Thread(target=gps, args=(), daemon=True)
    Threadgps.start()

def send_lightingesteld_thread():
    print("sending lightvalue")
    Threadlightvalue = threading.Thread(target=sending_lightvalue, args=(), daemon=True)
    Threadlightvalue.start()

if __name__ == '__main__':
    lcd_init()
    setup_gpio()
    ip=''
    start_chrome_thread()
    print("**** Starting APP ****")
    try:
        mpu = MPU6050(0x68)
        lcd_string("Looking for IP ",LCD_LINE_1)
        lcd_string("Loading...",LCD_LINE_2)
        # blabla = Database.get_rows("SELECT * FROM horses ")
        # print(blabla)
        
        while len(ip)< 7 and ip[0:1] != 1:
            ipfull=str(check_output(['ip','a']))
            # min=int(ipfull.find('172.30.252'))
            min=int(ipfull.find('192.168.1.'))
            ip=str(ipfull[min:min +13])
            # print(ip)
            time.sleep(1)
        if len(ip)>7:
            lcd_string("Welcome! ",LCD_LINE_1)
            lcd_string("TrackPack",LCD_LINE_2)
            print("bij lcd")
            time.sleep(2)
            show_ip()
            start_mpu_thread()
            start_ldr_thread()
            start_gps_thread()
            send_lightingesteld_thread()
            time.sleep(1)
            socketio.run(app, debug=False, host='0.0.0.0')
        
        
    except KeyboardInterrupt:
        print ('KeyboardInterrupt exception is caught')
    finally:
        i2c.close()
        lcd_string("Bye!",LCD_LINE_1)
        lcd_string("",LCD_LINE_2)
        time.sleep(2)
        lcd_string("",LCD_LINE_1)
        GPIO.cleanup()
