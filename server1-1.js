const http = require('http');

const server = http.createServer((req,res) => {
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
   res.write('<h1>server 1-1!</h1>');    // 컨텐츠 body
   res.end('<h1>end!</h1>');             // res.end : 인수가 있다면 그것까지 보낸 후 응답종료
});

// 서버연결
server.listen(8081);

// 서버에 이벤트 연결
server.on('listening',()=>{
    console.log('8081서버 대기중');
});
server.on('error',(err)=>{
    console.error(err);
});


