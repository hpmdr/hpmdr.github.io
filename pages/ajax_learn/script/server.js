const http = require('http');
const fs = require('fs');
const zlib = require('zlib');

http.createServer(function (request, response) {
    console.log(request.url);
    console.log(request.headers);

    switch (request.url) {
        case '/':
            const html = fs.readFileSync('../index.html');
            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Set-Cookie': ['id=10000;max-age=3', 'num=10003;HttpOnly'],
                'Content-Encoding': 'gzip'
            });
            response.end(zlib.gzibSync(html));
            break;
        case '/img1.png':
        case '/img2.png':
        case '/img3.png':
        case '/img4.png':
        case '/img5.png':
        case '/img6.png':
        case '/img7.png':
        case '/img8.png':
            const img = fs.readFileSync('../res/app.png');
            response.writeHead(200, {
                "Content-Type": 'image/png'
            });
            response.end(img);
            break;
    }

}).listen(8888);

console.log('server start,listening 8888');