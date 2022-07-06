import spidev
import time
 
spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz = 10 ** 5
 
def read_spi(channel):
  spidata = spi.xfer2([1,(8|channel)<<4,0])
  return ((spidata[1] & 3) << 8) | spidata[2]
 
try:
  while True:
    potdata = read_spi(0)
    waardepot = potdata/1023 *3.3
    print("Waarde potentiometer= {} Volt".format(round(waardepot,2)))
    time.sleep(1)
    ldrdata = read_spi(1)
    waardeldr = 100 - (ldrdata/1023 *100)
    print("Waarde ldr= {} %".format(round(waardeldr,2)))
    time.sleep(1)

 
except KeyboardInterrupt:
  spi.close()
finally:
  print("Script gestopt")