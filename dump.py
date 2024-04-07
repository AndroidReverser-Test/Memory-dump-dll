import frida
import os



def read_frida_js_source():
    with open("dump_dll.js", "r",encoding="utf-8") as f:
        return f.read()

def on_message(message, data):
    if message["type"] == "send":
        if message["payload"] == "bytes":
            result.append(data)
        else:
            print(message["payload"])

def get_dll(rls):
    count = 1
    dos_str = "4D5A90000300000004000000FFFF0000B800000000000000400000000000000000000000000000000000000000000000000000000000000000000000800000000E1FBA0E00B409CD21B8014CCD21546869732070726F6772616D2063616E6E6F742062652072756E20696E20444F53206D6F64652E0D0D0A2400000000000000"
    if os.path.exists("dump") == False:
        os.mkdir("dump")
    for item in rls:
        with open("./dump/"+str(count)+".dll","wb") as f:
            f.write(bytes.fromhex(dos_str))
            f.write(item)
            count += 1

if __name__ == "__main__":
    result = []
    device: frida.core.Device = frida.get_device_manager().add_remote_device('127.0.0.1:2346')
    pid = device.get_frontmost_application().pid
    session: frida.core.Session = device.attach(pid)
    script = session.create_script(read_frida_js_source())
    script.on('message', on_message)
    script.load()
    script.exports.dump()

    get_dll(result)
    print("done")
    

    


