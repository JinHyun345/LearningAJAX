const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.static('data'));
app.use(function (request, response, next) {
    fs.readdir('./data', function (err, data) {
        request.list = data;
        next();
    });
})
app.use(function(request, response, next){
    var list = '<ol>';
    var i = 0;
    while (i < request.list.length) {
        list += `
        <li><a
            onclick="fetch('${request.list[i]}').then(function(response){response.text().then(function(text){document.querySelector('article').innerHTML=text;})})">${request.list[i]}</a>
        </li>
        `
        i += 1;
    }
    list += '</ol>';
    request.filelist = list;
    next();
})
app.get('/', function (request, response) {
    var template = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>fatch experiment</title>
    </head>

    <body>
        <h1>fetch experiment</h1>
        ${request.filelist}
        <article></article>
    </body>

    </html>
    `;
    response.send(template)
});

app.listen(port, function () { });