'use strict';

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var exphbs = require('express-handlebars');
var PORT = process.env.PORT || 3000;

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res, next) {
    fs.readdir(__dirname + '/public/uploads/', function (err, files) {
        if (err) return next(err);
        res.render('index', {images: files.reverse()});
    });
});

io.on("connection", function(socket){

    socket.on('sendPhoto', function (data) {
        var guess= data.base64.match(/^data:image\/(png|jpeg);base64,/)[1];
        var ext = '';
        switch (guess) {
            case 'png': ext = '.png'; break;
            case 'jpeg': ext = '.jpg'; break;
            default: ext = '.bin'; break;
        }
        var savedFilename = moment().format('MMMM-Do-YYYY-h-mm-ss-') + randomString(5) + ext;
        fs.writeFile(__dirname + '/public/uploads/' + savedFilename, getBase64Image(data.base64), 'base64', function (err) {
            if (err) return console.log(err);
            io.emit('fetchPhoto', {path: savedFilename});
        });
    });
});

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getBase64Image(imgData) {
    return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
}

http.listen(PORT, function () {
    console.log('Server has started on port ' + PORT);
});