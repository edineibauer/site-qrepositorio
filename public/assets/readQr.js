$(function () {
    if (typeof webQr !== "undefined")
        webQr.stop();
    getTemplates().then(tpl => {

        $(".r-readQr").append(Mustache.render(tpl.readQr));

        /** QR CODE */
        var webQr = new WebCodeCamJS("canvas");
        let width = window.innerWidth < 900 ? window.innerWidth : 900;
        $("#webcodecam-canvas").css({"width": width + "px", "height": width * 0.77 + "px"});

        /* -------------------------------------- Available parameters --------------------------------------*/
        var options = {
            DecodeQRCodeRate: 5,                    // null to disable OR int > 0 !
            DecodeBarCodeRate: 5,                   // null to disable OR int > 0 !
            successTimeout: 500,                    // delay time when decoding is succeed
            codeRepetition: true,                   // accept code repetition true or false
            tryVertical: true,                      // try decoding vertically positioned barcode true or false
            frameRate: 24,                          // 1 - 25
            width: window.innerWidth,               // canvas width
            height: window.innerHeight,             // canvas height
            constraints: {                          // default constraints
                video: {
                    mandatory: {
                        maxWidth: 720,
                        maxHeight: 720
                    },
                    optional: [{
                        sourceId: true
                    }]
                },
                audio: false
            },
            flipVertical: false,                    // boolean
            flipHorizontal: false,                  // boolean
            zoom: -1,                               // if zoom = -1, auto zoom for optimal resolution else int
            beep: 'public/assets/libs/beep.mp3',                 // string, audio file location
            decoderWorker: 'public/assets/libs/DecoderWorker.js',   // string, DecoderWorker file location
            brightness: 5,                          // int
            autoBrightnessValue: false,             // functional when value autoBrightnessValue is int
            grayScale: false,                       // boolean
            contrast: 7,                            // int
            threshold: 0,                           // int
            sharpness: [],      // to On declare matrix, example for sharpness ->  [0, -1, 0, -1, 5, -1, 0, -1, 0]
            resultFunction: function (result) {
                webQr.stop();
                pageTransition(result.code, "route", "forward");
            },
            cameraSuccess: function (stream) {
            },
            canPlayFunction: function () {               //callback funtion to can play
                console.log('canPlayFunction');
            },
            getDevicesError: function (error) {          //callback funtion to get Devices error
                console.log(error);
            },
            getUserMediaError: function (error) {        //callback funtion to get usermedia error
                console.log(error);
            },
            cameraError: function (error) {              //callback funtion to camera error
                console.log(error);
            }
        };

        webQr.init(options).play();

        $("a, .menu-li").one("click", function () {
            if (typeof webQr !== "undefined")
                webQr.stop();
        })
    });
});
