var socket = io();

$(function () {
    var $imageSelector = $('#imageSelector');
    var $previewImage = $('#preview');
    var $modal = $('#modal');
    var $save = $('#save');
    var $images = $('#images');

    $imageSelector.on('change', function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            var blob = new Blob([e.target.result]);
            $previewImage[0].src = URL.createObjectURL(blob);
            $modal.modal('show');
        };
        if ($imageSelector[0].files.length) {
            reader.readAsArrayBuffer($imageSelector[0].files[0]);
            $imageSelector.val('');
        } else {
            console.log('No file chosen.');
        }
    });

    var croppedCanvas;

    $modal.on('shown.bs.modal', function () {
        $previewImage.cropper({
            autoCropArea: 1,
            aspectRatio: 1/1,
            // cropBoxResizable: false,
            // zoomable: false
        });
    });

    $save.on('click', function () {
        croppedCanvas = $previewImage.cropper('getCroppedCanvas');
        var compressedCanvas = croppedCanvas.toDataURL('image/jpeg', 0.7);
        socket.emit('sendPhoto', {base64: compressedCanvas});
        $previewImage.cropper('destroy');
        $modal.modal('hide');
    });

    socket.on('fetchPhoto', function (data) {
        $images.prepend('<div class="col-md-3 col-sm-6"><div class="thumbnail"><img src="' + '/uploads/' + data.path + '"></div></div>');
    });

});