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
    if os.path.exists("dump") == False:
        os.mkdir("dump")
    with open("dump/dump.bin","wb") as f:
        for item in rls:
            f.write(item)

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
    print("sucess")
    

    


