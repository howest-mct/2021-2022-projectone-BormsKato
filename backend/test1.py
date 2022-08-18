import serial
import time
import string
import pynmea2

while True:
	port="/dev/ttyS0"
	ser=serial.Serial(port, baudrate=9600, timeout=0.5)
	newdata=ser.readline()
	# print(newdata)
	properdata = newdata.decode('utf-8').replace('b','').replace('$','').replace('\r','').replace('\n','')
	# print(properdata)

	if properdata[0:5] == "GNGGA":
		print(properdata)

