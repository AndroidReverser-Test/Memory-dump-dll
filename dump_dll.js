rpc.exports = {
    dump:function(){
        let result = [];
        let start;
        let end=0;
        let size;
        let jiange = 0x186A000;
        let pattern = "50 45 00 00 4C 01 03 00";
        send("searching");
        Process.enumerateRanges('r--').forEach(function (range) {
            try {
                Memory.scanSync(range.base, range.size,pattern).forEach(function (match) {
                    if(match.address>0x6000000000){
                        result.push(match.address);
                    }
                });
            } catch (e) {
            }
        });

        for(let i=0;i<result.length;i++){
            send("dumping");
            start = result[i].sub(0x80);
            if(start<end){
                start = end;
            }
            end = result[i].add(jiange);
    
            size = parseInt(end.sub(start).toString(),16);
            Memory.protect(start,size,"rwx");
            try{
                send("bytes",start.readByteArray(size));
            }
            catch(e){
                send("出现错误，请退出游戏后重试");
                break;
            }
        }
    }
}