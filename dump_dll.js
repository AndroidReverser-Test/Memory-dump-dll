rpc.exports = {
    dump:function(){
        let results = [];
        let sizes = [];
        let size=0;
        let s0,s1,s2;
        let pattern = "50 45 00 00";
        let max_size = 0x61A8000;//默认dll的最大值为100m
        send("searching");
        Process.enumerateRanges('r--').forEach(function (range) {
            try {
                Memory.scanSync(range.base, range.size,pattern).forEach(function (match) {
                    if(get_hex_str(match.address.add(0x18).readByteArray(2)).indexOf("0b01")!=-1){
                        size = 0x180;
                        s0 = match.address.add(0xf8).add(16).readInt();
                        s1 = match.address.add(0x120).add(16).readInt();
                        s2 = match.address.add(0x148).add(16).readInt();
                        size = size+s0+s1+s2;
                        if(size>0 && size<max_size){
                            results.push(match.address);
                            sizes.push(size);
                        }
                    }
                });
            } catch (e) {
            }
        });

        for(let i=0;i<results.length;i++){
            send("dumping:"+(i+1)+"/"+results.length);
            Memory.protect(results[i],sizes[i],"rwx");
            try{
                send("bytes",results[i].readByteArray(sizes[i]));
            }
            catch(e){
                send("出现错误，请退出游戏后重试");
                break;
            }
        }
    }
}


function get_hex_str(arrayBuffer){
        let il_str = "";
        let ilArray = Array.prototype.slice.call(new Uint8Array(arrayBuffer));
        let byt;
        for(let i=0;i<ilArray.length;i++){
            byt = ilArray[i]
            if(byt<16){
                il_str += "0";
            }
            il_str += byt.toString(16);
        }
        return il_str;
    }
