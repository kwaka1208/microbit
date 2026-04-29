from microbit import *
import radio
import os

radio.on()
list = []
command = {}

#
# creating network
#
def start():
    list = os.uname("machine")
    command["micronet"]= {"command":"create"}
    radio.send()

def micronet():
    if ( radio.receive_bytes_into(buffer) != None)
        json = ujson.loads(buffer)
        if buffer in {'create'}
            command["micronet"]= {"command":"join", "id":os.uname("machine")}
            radio.send(command)
        if buffer in {'join'}
            radio.send("join:"+os.uname("machine"))

while True:
    micronet()
  
