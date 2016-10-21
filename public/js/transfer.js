var socket = io();

document.getElementById('imageSelector').addEventListener('change', function () {
    var imageFiles = document.getElementById('imageSelector').files;
    for (var i = 0; i < imageFiles.length; i++) {
        var reader = new FileReader();
        reader.onload = function (e) {
            socket.emit('sendPhoto', {base64: e.target.result});
        };

        reader.readAsDataURL(imageFiles[i]);
    }
    document.getElementById('imageSelector').value = '';
});

socket.on('fetchPhoto', function (data) {
    document.getElementById('images').innerHTML +=
            '<div class="col-md-4 col-sm-6"><div class="thumbnail"><img src="' + '/uploads/' + data.path + '"></div></div>'
});