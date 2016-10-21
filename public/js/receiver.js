var socket;

window.onload = function () {
    socket = io();
    socket.on('receivePhoto', function (data) {
        console.log(data.path);
    });
};