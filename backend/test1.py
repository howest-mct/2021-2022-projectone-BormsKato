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
		latitude= properdata[16:26]
		Dlat= latitude[0:2]
		Mlat = latitude[2:4]
		Slat =latitude[5:7]
		latitudeWaarde = int(Dlat) + (int(Mlat)/60) + (int(Slat)/3600)
		print(latitudeWaarde)
		longitude= properdata[31:40]
		Dlong= longitude[0:1]
		Mlong = longitude[1:3]
		Slong =longitude[4:6]
		longitudeWaarde = int(Dlong) + (int(Mlong)/60) + (int(Slong)/3600)
		print(longitudeWaarde)



