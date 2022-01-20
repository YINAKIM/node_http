const http = require('http');

http.createServer((req,res) => {
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
   res.write('<h1>hello!</h1>');    // 컨텐츠 body
   res.end('<h1>bye!</h1>');        // res.end : 인수가 있다면 그것까지 보낸 후 응답종료
})
    .listen(8080,()=>{ // 서버연결
       console.log('8080번 포트에서 서버 대기중');
    });

