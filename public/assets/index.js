$(function () {
    getTemplates().then(tpl => {

        $('.r-index').append(Mustache.render(tpl.viewIndex, {home: HOME, vendor: VENDOR, sitename: SITENAME}));

        $('body').on('click', function (e) {
            $('#wrapper.toggled').removeClass('toggled')
        });
        $("#menu-toggle").click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $("#wrapper").addClass("toggled")
        });
        $('#wrapper').on('click', function (e) {
            e.stopPropagation()
        });
        $(window).resize(function (e) {
            if ($(window).width() <= 768) {
                $("#wrapper").removeClass("toggled")
            } else {
                $("#wrapper").addClass("toggled")
            }
        });

        $('body').on('click', function (e) {
            $('#wrapper.toggled').removeClass('toggled')
        });
        $("#menu-toggle").click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $("#wrapper").addClass("toggled")
        });
        $('#wrapper').on('click', function (e) {
            e.stopPropagation()
        });
        $(window).resize(function (e) {
            if ($(window).width() <= 768) {
                $("#wrapper").removeClass("toggled")
            } else {
                $("#wrapper").addClass("toggled")
            }
        });
        $('#inicio .owl-carousel').owlCarousel({
            autoplay: !1,
            loop: !0,
            stopOnHover: !1,
            margin: 10,
            nav: !1,
            dots: !0,
            navigationText: ["", ""],
            autoHeight: !1,
            items: 1
        });
        $('#banner-inicio .owl-carousel').owlCarousel({
            autoplay: !0,
            loop: !0,
            stopOnHover: !1,
            margin: 10,
            nav: !1,
            dots: !0,
            navigationText: ["", ""],
            autoHeight: !1,
            items: 1
        });
        $('#abasteca .owl-carousel').owlCarousel({
            autoplay: !0,
            loop: !0,
            stopOnHover: !1,
            margin: 10,
            nav: !1,
            dots: !0,
            navigationText: ["", ""],
            autoHeight: !1,
            items: 2
        });
        $('#servico .owl-carousel').owlCarousel({
            autoplay: !0,
            loop: !0,
            stopOnHover: !1,
            margin: 10,
            nav: !1,
            dots: !0,
            navigationText: ["", ""],
            autoHeight: !1,
            items: 1
        });

        var tapCount = 0;
        var doubleTapCount = 0;
        var longTapCount = 0;
        var swipeCount = 0;
        var blackCount = 0;
        window.SwipeMenu.init();

        function exeLogin(user, pass) {
            post('login', 'login', {email: user, pass: pass}, function (g) {
                if (typeof g === "string") {
                    navigator.vibrate(100);
                    loginFree = !0;
                    if (g !== "no-network")
                        toast(g, 3000, "toast-warning")
                } else {
                    toast("Olá " + g.nome + "!", 3000, "toast-success");
                    setCookieUser(g).then(() => {
                        location.href = HOME + "dashboard";
                    })
                }
            })
        }

        function closeQrCode() {
            setTimeout(function () {
                $("#qrcode-div").css("display", "none");
                $("#qrcode-block-opacity-0").css("display", "block");
                $("#qrcode-block-opacity-0").css("opacity", 1);
            }, 500);
            $("#qrcode-header").css("transform", "translateY(-60px)");
            $("#qrcode-actions .btn").css("transform", "translateY(60px)");
            $(".qrcode-block-opacity, #qrcode-block-opacity-header").css("opacity", 0);
            webQr.stop();
        }

        /** QR CODE */
        var webQr = new WebCodeCamJS("canvas");
        let width = window.innerWidth < 900 ? window.innerWidth : 900;
        $("#webcodecam-canvas").css({"width": width + "px", "height": width + "px"});

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

        $(".formulario-cadastro").submit(function (e) {
            e.preventDefault();
            var tipo = $(this).data('tipo');
            var actionurl = e.currentTarget.action;
            if (tipo == 'cadastro') {
            } else if (tipo == 'cadastro' || tipo == 'cadastro-carro') {
            }
            $.ajax({
                url: actionurl, type: 'post', data: values, success: function (data) {
                    $("#retorno").html(data);
                    habilita()
                }, error: function () {
                    $("#retorno").html('Erro ao enviar.');
                    habilita()
                }
            })
        });

        function openCadastro() {
            $(".form-control").removeAttr("disabled readonly");
            $("#cadastrese").removeClass("hide");
            $("#bem-vindo-fields").addClass("hide");
        }

        $('#abrir-menu').on('click', function (e) {
            e.preventDefault();
            $(".form-control-login").removeAttr("disabled readonly");
            $("#cadastrese").addClass("hide");
            $("#bem-vindo-fields").removeClass("hide");
            window.SwipeMenu.open($(this).data('element'));
        });

        $(".lembra-senha").on("click", "[data-target='#recoverypassModal']", function () {
            $("#emailRecovery").focus();
        });

        $("#cadastre").off("click").on("click", function () {
            openCadastro();
        });

        $("#entrar").off("click").on("click", function () {
            $(".form-control-login").removeAttr("disabled readonly");
            $("#cadastrese").addClass("hide");
            $("#bem-vindo-fields").removeClass("hide");
        });

        $("#open-qr").off("click").on("click", function () {
            webQr.buildSelectMenu('#camera-select', ($("#camera-select option").length > 1 ? 'environment|back' : 'user|front')).init(options).play();
            $("#qrcode-div").css("display", "block");
            setTimeout(function () {
                $("#qrcode-actions .btn").css("transform", "translateY(0)");
                $("#qrcode-header").css("transform", "translateY(0)");
                $(".qrcode-block-opacity, #qrcode-block-opacity-header").css("opacity", 1);
            }, 10);
        });

        $("#close-qr").off("click").on("click", function () {
            closeQrCode();
        });

        $("#cadastrar-se").off("click").on("click", function () {
            let user = {
                nome: $("#nomeInput").val(),
                email: $("#emailInput").val(),
                senha: $("#senhaInput").val(),
                ativo: 1,
                data_de_cadastro: moment().format("YYYY-MM-DD HH:mm:ss")
            };

            if (navigator.onLine) {
                if (user.nome.length < 3) {
                    toast((user.nome.length === 0 ? "Informe seu Nome" : "Nome muito curto"), 2000, "toast-warning");
                    $("#nomeInput").focus();
                } else if (user.email.length < 7) {
                    toast("Email Inválido", 2000, "toast-warning");
                    $("#emailInput").focus();
                } else if (user.senha.length < 1) {
                    toast("Preencha a senha", 2000, "toast-warning");
                    $("#senhaInput").focus();
                } else {
                    $(".form-cadastro").loading();
                    db.exeCreate("empresas", user).then(userReturn => {
                        if (userReturn && typeof userReturn === "object" && userReturn.db_errorback === 0 && typeof userReturn.db_action === "string" && userReturn.db_action === "create") {
                            $("#modal-content-cadastro-sucesso").loading();
                            $("#cadastro-sucedido").trigger("click");
                            exeLogin(user.email, user.senha);
                        } else if (userReturn.db_errorback === 1) {
                            for (let i in userReturn) {
                                if (i !== "db_errorback") {
                                    toast(userReturn[i], 2000, "toast-warning");
                                    $("#" + i + "Input").focus();
                                    break;
                                }
                            }
                        }
                    }).catch(e => {
                        for (let i in e.clientes) {
                            $("#" + i + "Input").focus();
                            toast(e.clientes[i], 3000, "toast-warning");
                        }
                    });
                }
            }
        });

        var loginFree = !0;
        $("#botao-principal-login").off("click").on("click", function () {
            if (loginFree) {

                $("#bem-vindo-fields").loading();
                toast("Validando dados!", 15000);
                loginFree = !1;

                exeLogin($("#email").val(), $("#senha").val());
            }
        });

        $("#senha").off("keydown").on("keydown", function (e) {
            if (e.keyCode === 13)
                $("#botao-principal-login").trigger("click");
        });
    });
});

window.SwipeMenu = {
    init: function () {
        $('.menu-swipe').addClass('close');
        $.each($('.menu-swipe'), function (i, v) {
            swipeMenuEvent($(v))
        })
    }, open: function (idMenu) {
        idMenu = idMenu === 'undefined' ? '' : idMenu;
        $(idMenu + '.menu-swipe').removeClass('close').addClass('open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
            $(idMenu + '.menu-swipe').removeClass('moving close')
        })
    }, close: function () {
        idMenu = idMenu === 'undefined' ? '' : idMenu;
        $(idMenu + '.menu-swipe').removeClass('close').addClass('open')
    },
};

function swipeMenuEvent($menu) {
    if(window.innerWidth < 900) {
        let height = $menu.height();
        $menu.swipe({
            swipe: function (event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                if (!$menu.hasClass('open') || typeof event.targetTouches === "undefined")
                    return;

                if ($(".form-control").is(":focus"))
                    $(".form-control").blur();

                if (direction == 'start')
                    $menu.removeClass('close').addClass('moving');

                if (direction == 'move') {
                    if (direction == 'down') {
                        $menu.css({bottom: -Math.abs(distance)})
                    } else {
                        if (direction == 'up') {
                            $menu.css({bottom: Math.abs(distance)})
                        }
                    }
                }
                if ((direction == 'end' || direction == 'cancel')) {
                    if (direction == 'down') {
                        var bottomStatus = $menu.css('bottom').replace(/[^-\d\.]/g, '');
                        if ((Math.abs(parseInt(bottomStatus))) > height / 2) {
                            $menu.removeClass('moving open').addClass('close')
                        } else {
                            $menu.removeClass('moving close').addClass('open')
                        }
                        $menu.css({bottom: ''})
                    } else {
                        $menu.css({bottom: 0})
                    }
                }
            }, swipeStatus: function (event, phase, direction, distance) {
                if (!$menu.hasClass('open') || typeof event.targetTouches === "undefined" || (event.targetTouches.length === 1 && !$(event.targetTouches[0].target).hasClass("tit")))
                    return;

                if (typeof event.targetTouches !== "undefined" && event.targetTouches.length === 1 && !$(event.targetTouches[0].target).hasClass("form-control") && $(".form-control").is(":focus"))
                    $(".form-control").blur();

                if (phase == 'start')
                    $menu.removeClass('close').addClass('moving');

                if (phase == 'move') {
                    if (direction == 'up') {
                        let up = Math.abs(distance);
                        $menu.css({bottom: up > 100 ? 100 : up})
                    } else {
                        $menu.css({bottom: -Math.abs(distance)})
                    }
                }
                if ((phase == 'end' || phase == 'cancel')) {
                    if (direction == 'down') {
                        var bottomStatus = $menu.css('bottom').replace(/[^-\d\.]/g, '');
                        if ((Math.abs(parseInt(bottomStatus))) > height / 2) {
                            $menu.removeClass('moving open').addClass('close')
                        } else {
                            $menu.removeClass('moving close').addClass('open')
                        }
                        $menu.css({bottom: ''})
                    } else {
                        $menu.css({bottom: 0})
                    }
                }
            }
        });
    }
}