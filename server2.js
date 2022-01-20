const http = require('http');
const fs = require('fs').promises;

http.createServer(async (req,res) => {

    try{

        const data = await fs.readFile('../html/server2.html');  //동기처리(promise리턴)
        res.writeHead(200,{'':''});

    }catch(err){

    }


})
    .listen(8081,()=>{ // 서버연결
       console.log('8081번 포트에서 서버 대기중');
    });

