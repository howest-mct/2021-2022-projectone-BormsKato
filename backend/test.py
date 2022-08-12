import time
from RPi import GPIO
from helpers.klasseknop import Button
from helpers.klasseMCP import MCPclass
import threading
import smbus
from smbus import SMBus
from subprocess import check_output

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, jsonify
from repositories.DataRepository import DataRepository
from repositories.Database import Database


from selenium import webdriver


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


if __name__ == '__main__':
    lcd_init()
    ip=''
    print("**** Starting APP ****")
    try:
        lcd_string("Looking for IP ",LCD_LINE_1)
        lcd_string("Loading...",LCD_LINE_2)
        # blabla = Database.get_rows("SELECT * FROM horses ")
        # print(blabla)
        
        while len(ip)< 7 and ip[0:1] != 1:
            ipfull=str(check_output(['ip','a']))
            # min=int(ipfull.find('172.30.252'))
            min=int(ipfull.find('192.168.143.'))
            ip=str(ipfull[min:min +13])
            # print(ip)
            time.sleep(1)
        if len(ip)>7:
            lcd_string("Welcome! ",LCD_LINE_1)
            lcd_string("TrackPack",LCD_LINE_2)
            print("bij lcd")
            time.sleep(2)
            show_ip()
          
        
        
    except KeyboardInterrupt:
        print ('KeyboardInterrupt exception is caught')
    finally:
        lcd_string("Bye!",LCD_LINE_1)
        lcd_string("",LCD_LINE_2)
        time.sleep(2)
        lcd_string("",LCD_LINE_1)