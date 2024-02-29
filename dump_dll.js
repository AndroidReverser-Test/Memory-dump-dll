rpc.exports = {
    dump:function(){
        let range_result = [];
        let range_size = [];
        let start;
        let size;
        let max_size = 0x61A8000;
        let pattern = "50 45 00 00 4C 01 03 00";
        let chishu;
        send("searching");
        Process.enumerateRanges('r--').forEach(function (range) {
            try {
                Memory.scanSync(range.base, range.size,pattern).forEach(function (match) {
                    if(match.address>0x6000000000){
                        if(!range_result.includes(range.base)){
                            range_result.push(range.base);
                            range_size.push(range.size);
                        }
                    }
                });
            } catch (e) {
            }
        });

        for(let i=0;i<range_result.length;i++){
            send("dumping range,addr:"+range_result[i]+",size:"+range_size[i]);
            start = range_result[i];
            size = range_size[i];
            Memory.protect(start,size,"rwx");
            try{
                if(size<=max_size){
                    send("bytes",start.readByteArray(size));
                }
                else{
                    chishu = Math.floor(size/max_size);
                    for(let k=0;k<chishu;k++){
                        send("bytes",start.add(k*max_size).readByteArray(max_size));
                    }
                    send("bytes",start.add(chishu*max_size).readByteArray(size-chishu*max_size));
                }
            }
            catch(e){
                send("出现错误，请退出游戏后重试");
                break;
            }
        }
    }
}