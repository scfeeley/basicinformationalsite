const http = require('http');
const path = require('path');
const fs = require('fs');

//create server

const server = http.createServer((req,res) => {
    //build file path 
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 
    'index.html' : req.url);
    console.log('requrl: ' + req.url);
    
    //extension of file 
    let extname = path.extname(filePath);
    if(extname === ''){
        extname = '.html';
        filePath += '.html';
    }

    //Initial Content type 
    let contentType = 'text/html';

    //Check ext and set content type 
    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType ='application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        
    };

    //Read file 
    fs.readFile(filePath, (err, content) =>{
        if(err){
            if(err.code === 'ENOENT'){
                //Page not found 
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err,content)=>{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf8');
                });
            }else{
                //Some Server Error 
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        }else{
           //Success
           console.log(contentType);
           res.writeHead(200, {'Content-Type': contentType});
           res.end(content, 'utf8');
        }
    });
});


//create PORT -> look for environment variable 
const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));