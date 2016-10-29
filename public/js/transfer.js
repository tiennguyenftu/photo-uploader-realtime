var socket = io();

$(function () {
    var $imageSelector = $('#imageSelector');
    var $modal = $('#modal');
    var $modalBody = $('.modal-body');
    var $save = $('#save');
    var $images = $('#images');
    var count = 0;

    $imageSelector.on('change', function () {
        if ($imageSelector[0].files.length) {
            for (var i = 0; i < $imageSelector[0].files.length; i++) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    count++;
                    var blob = new Blob([e.target.result]);
                    var src = URL.createObjectURL(blob);

                    $modalBody.append('<div class="thumbnail preview"><img src="' + src + '" id="' + count + '"></div>');
                };

                reader.readAsArrayBuffer($imageSelector[0].files[i]);
            }

            $modal.modal('show');
            $imageSelector.val('');

        }
    }).on('hidden.bs.modal', function () {
        $modalBody.empty();
    });

    var cropBoxData;

    $modal.on('shown.bs.modal', function () {
        var $preview = $('.preview > img');

        $preview.cropper({
            autoCropArea: 1,
            aspectRatio: 1/1,
            multiple: true,
            built: function () {
                for (var i = 1; i <= count; i++) {
                    $('#' + i).cropper('setCropBoxData', cropBoxData);
                }
            }
        });

    });

    $save.on('click', function () {

        // cropBoxData = $('#1').cropper('getCropBoxData');
        // canvasData = $('#1').cropper('getCanvasData');

        for (var i = 1; i <= count; i++) {
            var croppedCanvas = $('#' + i).cropper('getCroppedCanvas');
            var compressedCanvas = croppedCanvas.toDataURL('image/jpeg', 0.7);
            socket.emit('sendPhoto', {base64: compressedCanvas});
        }

        count = 0;
        $modalBody.empty();
        $modal.modal('hide');
    });

    socket.on('fetchPhoto', function (data) {
        $images.prepend('<div class="col-md-3 col-sm-6"><div class="thumbnail"><img src="' + '/uploads/' + data.path + '"></div></div>');
    });

});