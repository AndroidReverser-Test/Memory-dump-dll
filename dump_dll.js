rpc.exports = {
    dump:function(){
        let results = [];
        let sizes = [];
        let size=0;
        let snumber=0;
        let pattern = "50 45 00 00";
        let max_size = 0x61A8000;//默认dll的最大值为100m
        send("searching");
        Process.enumerateRanges('r--').forEach(function (range) {
            try {
                Memory.scanSync(range.base, range.size,pattern).forEach(function (match) {
                    if(match.address.add(0x18).readShort()==0x10b){
                        snumber = match.address.add(0x6).readShort();
                        size = 0x180;
                        for(let k=0;k<snumber;k++){
                            size += match.address.add(0xf8).add(16).add(k*0x28).readInt();
                        }
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


