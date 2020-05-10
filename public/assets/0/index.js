var loginFree = !0, webQr = null;

function login() {
    exeLogin($("#email").val(), $("#senha").val(), $("#g-recaptcha-response").val());
}

function exeLogin(email, senha, recaptcha) {
    if (loginFree) {
        $("#login").loading();
        loginFree = !1;
        post('login', 'login', {email: email, pass: senha, recaptcha: recaptcha}, function (g) {
            if (typeof g === "string") {
                loginFree = !0;
                navigator.vibrate(100);
                if (g !== "no-network")
                    toast(g, 3000, "toast-warning")
            } else {
                toast("Bem-vindo ao " + SITENAME, 15000, "toast-success");
                setCookieUser(g).then(() => {
                    let destino = "index";
                    if(g.setor !== "clientes")
                        destino = "dashboard";
                    if (getCookie("redirectOnLogin") !== "") {
                        destino = getCookie("redirectOnLogin");
                        setCookie("redirectOnLogin", 1, -1);
                    }
                    location.href = destino;
                })
            }
        });
    }
}

var googleLogin = 0;
function onSignIn(googleUser) {
    if(googleLogin === 0) {
        gapi.auth2.getAuthInstance().signOut();

    } else {
        var profile = googleUser.getBasicProfile();
        getJSON(HOME + "app/find/clientes/email/" + profile.getEmail()).then(r => {
            if (!isEmpty(r.clientes)) {
                exeLogin(profile.getEmail(), profile.getId())
            } else {
                db.exeCreate("clientes", {
                    nome: profile.getName(),
                    email: profile.getEmail(),
                    imagem_url: profile.getImageUrl(),
                    senha: profile.getId(),
                    ativo: 1
                }).then(result => {
                    if (result.db_errorback === 0)
                        exeLogin(result.email, profile.getId())
                })
            }
        });
    }
}

function isMobileAndTabletCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function closeQrCode() {
    setTimeout(function () {
        $("#qrcode-div").css("display", "none");
        $("#qrcode-block-opacity-0").css("display", "block");
        $("#qrcode-block-opacity-0").css("opacity", 1);
    }, 500);
    $("#qrcode-header").css("transform", "translateY(-60px)");
    $(".qrcode-block-opacity, #qrcode-block-opacity-header").css("opacity", 0);
    webQr.stop();
}

$(function () {
    $('#apresentacao .owl-carousel').owlCarousel({
        loop: false,
        margin: 10,
        nav: false,
        autoplay: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
        }
    });

    /** QR CODE */
    webQr = new WebCodeCamJS("canvas");
    $("#webcodecam-canvas").css({"width": window.innerHeight * 1.2 + "px", "height": window.innerHeight - 55 + "px"});

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
        beep: VENDOR + 'site-qrepositorio/public/assets/libs/beep.mp3',                 // string, audio file location
        decoderWorker: VENDOR + 'site-qrepositorio/public/assets/libs/DecoderWorker.js',   // string, DecoderWorker file location
        brightness: 5,                          // int
        autoBrightnessValue: false,             // functional when value autoBrightnessValue is int
        grayScale: false,                       // boolean
        contrast: 7,                            // int
        threshold: 0,                           // int
        sharpness: [],      // to On declare matrix, example for sharpness ->  [0, -1, 0, -1, 5, -1, 0, -1, 0]
        resultFunction: function (result) {
            closeQrCode();
            $('#abrir-menu').trigger("click");
            $("#qrcodeInput").val(result.code);
            openCadastro();

            webQr.stop();
        },
        cameraSuccess: function (stream) {           //callback funtion to camera success
            $("#qrcode-block-opacity-0").css("opacity", 0);
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

    function openQr() {
        if(isMobileAndTabletCheck())
            webQr.buildSelectMenu('#camera-select', 'environment|back');

        webQr.init(options).play();
        $("#qrcode-div").css("display", "block");
        setTimeout(function () {
            $("#qrcode-header").css("transform", "translateY(0)");
            $(".qrcode-block-opacity, #qrcode-block-opacity-header").css("opacity", 1);
        }, 10);
    }

    $("#close-qr").off("click").on("click", function () {
        closeQrCode();
    });

    // Go to the next item
    var owl = $('.owl-carousel');
    owl.owlCarousel();

    owl.on('translated.owl.carousel', function (e) {
        $('.btn-proximo').prop('disabled', true);
        if (e.page.count === e.page.index + 1) {
            $('.btn-proximo').prop('disabled', false).text('Ler QR Code').off("click").on('click', function () {
                openQr();
            });
        } else {
            $('.btn-proximo').prop('disabled', false).text('Próximo').off("click").on("click", function () {
                owl.trigger('next.owl.carousel');
            });
        }
    });

    $('.btn-proximo').off("click").on("click", function () {
        owl.trigger('next.owl.carousel');
    });

    /**
     * Login
     */
    if (getCookie("token") !== "" && getCookie("token") !== "0")
        location.href = HOME + "dashboard";

    $("#app").off("keyup", "#email, #senha").on("keyup", "#email, #senha", function (e) {
        if (e.which === 13)
            login()

    }).on("click", ".abcRioButtonContentWrapper", function() {
        googleLogin = 1;
    });
});