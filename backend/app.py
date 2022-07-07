import time
from RPi import GPIO
from helpers.klasseknop import Button
from helpers.klasseMCP import MCPclass
import threading

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, jsonify
from repositories.DataRepository import DataRepository


from selenium import webdriver

# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
ledPinR = 21
btnPinR = Button(20)
ledPinL = 24
btnPinL = Button(23)

klasseMCP = MCPclass()
ledPinV = 16


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
    ldrdata = klasseMCP.read_channel(1)
    print(ldrdata)
    waardeldr = 100 - (ldrdata/1023 *100)
    print(waardeldr)
    if waardeldr < 80:
        GPIO.output(ledPinV, 1)
    else:
        GPIO.output(ledPinV, 0)



if __name__ == '__main__':
    try:
        setup_gpio()
        print("**** Starting APP ****")
        # socketio.run(app, debug=False, host='0.0.0.0')
        while True:
            ldr()
            time.sleep(3)
    except KeyboardInterrupt:
        print ('KeyboardInterrupt exception is caught')
    finally:
        GPIO.cleanup()
