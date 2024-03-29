import spidev
spi = spidev.SpiDev()
class MCPclass:
    def __init__(self,bus=0,device=0):
        global spi
        spi.open(bus,device)
        spi.max_speed_hz = 10 ** 5

    def read_channel(self,channel):
        spidata = spi.xfer2([1,(8|channel)<<4,0])
        return ((spidata[1] & 3) << 8) | spidata[2]

    def closespi(self):
        global spi
        spi.close()