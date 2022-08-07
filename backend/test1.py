import serial
import time

try:
  while True:
    ser = serial.Serial('/dev/serial0',baudrate=9600,timeout=3.0)
    time.sleep(2)
    ser.write(b'Hello')
    a=ser.readline()
    print(a)
    ser.close()
except KeyboardInterrupt as e:
  print(e)
finally:
  print("Script stopped")