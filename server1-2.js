const http = require('http');

http.createServer((req,res) => {
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.write('<h1>hello!</h1>');
    res.end('<h1>bye!</h1>');
})
    .listen(8080,()=>{
        console.log('8080번 포트에서 서버 대기중');
    });

const http = require('http');

http.createServer((req,res) => {
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.write('<h1>hello!</h1>');
    res.end('<h1>bye!</h1>');
})
    .listen(8082,()=>{
        console.log('8082번 포트에서 서버 대기중');
    });

