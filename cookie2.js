const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

// TODO : 'mycookie=mine;yourcookie=yours;name=yina' 라는 string을 parseCookie()함수에 넣는다면?
const parseCookies = (cookie = '') =>        // default function parameter로 (파라미터가 없을때만) 빈문자열을 받는다.

    cookie                                          // 함수의 파라미터로 받은 문자열을

                                                    // TODO: Array.prototype.split() : 문자열을 받아서 그 문자열을 구분자로 활용, host문자열을 구분자로 분리한 결과를 요소로 하는 배열을 return
        .split(';')                        // split함수의 파라미터(split함수에서 구분자로 쓰임)';'로 split한 결과는?   ['mycookie=mine','yourcookie=yours','name=yina']

                                                    // TODO: Array.prototype.map() : 배열을 받아서 "각각의 요소에 대해 한번씩 순서대로 불러" 함수내부로직이 적용된 "새로운"배열을 반환한다.
        .map(v => v.split('='))            // map()안에서 split을 했으니까 return타입은 배열이 된다.
        // ['mycookie', 'mine'], ['yourcookie', 'yours']

        .reduce((acc, [k, v]) => {  // TODO: reduce() :   메서드는 배열의 각 요소에 대해 주어진 리듀서(reducer) 함수를 실행하고, 하나의 결과값을 반환 / 리듀서 함수의 반환 값은 누산기(*acc인데 {})에 할당되고, 누산기는 순회 중 유지되므로 결국 최종 결과는 하나의 값이 됩니다.
                                                     /***********************************************************************************************************************************
                                                      * acc인데 {} 가 무슨말 ?
                                                      * reduce함수의 첫번째 인자로 callback함수를 받는데, 이 함수가 4가지 인자를 받는다.
                                                      * 1. 누적값 : 기본적으로 이 누적값은 콜백함수의반환값을 return,
                                                      *           그런데!
                                                      *           콜백의 첫번째 호출이면 => initialValue가 있으면 initialValue,
                                                      *
                                                     ************************************************************************************************************************************/

            acc[k.trim()]                            // k.trim() : 키값을 trim하여 앞뒤공백을 제거한 문자열을 속성명으로 하고,
                = decodeURIComponent(v);             // 특수문자가 이스케이프시퀀스처리된URI(예:Asia%2FSeoul)에서 각각의 escape시퀀스를 문자열로 바꾼값(Asia/Seoul)을 속성값으로 하여 ====> decodeURIComponent('Asia%2FSeoul'); --> 'Asia/Seoul'
            // acc는 초기값으로 {}타입이 주어졌기때문에 쿠키이름=쿠키값의 쌍이 속성명:속성값 형태의 객체리터럴로 표현될 수 있도록 누적되어
            // 배열순회가 완료되면 누적완료된 객체를 반환한다.

            return acc;
        }, {});


http.createServer(async (req, res) => {           // async가 붙은 함수는 반드시 프라미스를 반환하고, 프라미스가 아닌 것은 프라미스로 감싸 반환한다.
    const cookies = parseCookies(req.headers.cookie); // { mycookie: 'test' }
    // 주소가 /login으로 시작하는 경우
    if (req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);                                       // url.parse()는 url의 쿼리부분을 js객체로 분해하여 object를 리턴한다.
                                                                                    // query이라는 이름의 속성명을 가진 값은 const query 에 할당하고(구조분해할당)
        const { name } = qs.parse(query);                                           // qs를 parse()하여 object를 리턴하는데 name이라는 이름의 속성명을 가진 값은 name이라는 const로 할당하고(구조분해할당)

        const expires = new Date();                                                 // expires라는 상수에 new Date객체를 할당하고
                                                                                    /***************************************************************************************
                                                                                     * Date() : 함수로 호출할 경우 new Date().toString()과 동일하게 현재 날짜와 시간을 나타내는 문자열을 반환
                                                                                     * new Date() : 생성자로 호출할 경우 새로운 Date 객체를 반환
                                                                                    ****************************************************************************************/

       expires.setMinutes(expires.getMinutes() + 5);                           // 쿠키 유효 시간을 현재시간 + 5분으로 설정하고
        res.writeHead(302, {                                     // ServerResponse객체에 헤더값을 설정하는 함수에 첫번째인자로 httpStatus 302, headers객체를 인자로 넣는데
            Location: '/',                                                          // 302이기때문에 Location을 설정하고
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,    //  encodeURIComponent('이나'); --> '%EC%9D%B4%EB%82%98' 이스케이프시퀀스처리한name값을 표현식으로 할당,
                                                                                                                     // 쿠키의 구분자인 ; 으로 구분하여 name, Expires, HttpOnly, Path 의 쿠키값들을 Set-Cookie했다.
                                                                                                                     // 근데 여기서 특수문자 이스케이프시퀀스를 안하고 백틱안에 템플릿문자열로 처리
        });

        res.end(); // 값이 없는 응답을 보내고 요청을 종료한다.


    // name이라는 쿠키가 있는 경우
    } else if (cookies.name) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요`);
    } else {
        try {
            const data = await fs.readFile('./cookie2.html');   //  await는 async 함수 안에서만 동작, 자바스크립트는 await 키워드를 만나면 프라미스가 처리(settled)될 때까지 기다리기때문에 (결과는 그 이후 반환)
                                                                      // async가 붙은 createServer의 콜백함수가 전부 처리된 후 실행된다. 즉, 파일을 미리 불러오는것이 아니라 콜백함수 전체 실행 후 else에 해당될 때 비로소 html파일을 readFile한다는 것
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);                                                                          // 파일시스템모듈로 읽어온 cookie2.html파일을 응답데이터로 실어보낸 후, 요청을 종료한다.

        } catch (err) {                                                                             // cookie2.html파일을 읽는데 문제가 생겼을 경우, err객체를 받아서
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);                                                                   // 응답데이터로 err객체릐 message를 실어보낸 후, 요청을 종료한다.
        } // => fs모듈은 파일이 없을 경우를 대비하여 err처리를 해야하기 때문에 try catch로 실행
                                                                                                    /****************************************************************************
                                                                                                     * node.js의 파일시스템모듈
                                                                                                     * 동기적(async) 읽기 방식을 사용하면 파일을 읽으면서 다른 작업을 동시에 할 수 없습니다.
                                                                                                     * 비동기적(await)으로 읽으면 파일을 읽으면서 다른 작업도 동시에 수행할 수 있고,
                                                                                                     *   -> 파일을 다 읽으면 매개변수 callback으로 전달한 함수가 호출됩니다. 비동기 형식은 항상 마지막 인수가 수행 완료 시 호출할 콜백 함수로 작성되어야 합니다.
                                                                                                     *
                                                                                                     *   fs.readFile(filename, [options], callback) :
                                                                                                     *   filename의 파일을 [options]의 방식으로 읽은 후 callback으로 전달된 함수를 호출
                                                                                                     *   => 그런데 promise가 실행된 후 동기적으로 실행되도록 했음
                                                                                                     *
                                                                                                     *   ( https://nodejs.org/api/fs.html#fspromisesreadfilepath-options )
                                                                                                     *   // 파일 읽기 예외처리를 try catch로 하지않고 콜백함수의 매개변수err로 받는 방법
                                                                                                         * fs.readFile('notexist.txt', 'utf8', function(err, data) { // 존재하지 않는 파일 읽기
                                                                                                         *     if (err) {
                                                                                                         *         console.log(err); // 읽기 실패
                                                                                                         *     }
                                                                                                         *     else {
                                                                                                         *         console.log(data); // 읽기 성공
                                                                                                         *     }
                                                                                                         * });
                                                                                                     *
                                                                                                     ****************************************************************************/
    }
})
    .listen(8084, () => {
        console.log('8084번 포트에서 서버 대기 중입니다!');
    });
