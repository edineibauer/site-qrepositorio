$(function () {
    if (typeof form === "object" && typeof form.id === "number" && !isNaN(form.id) && form.id > 0) {

        getTemplates().then(tpl => {
            $("#previewQrRepositorio").append(Mustache.render(tpl.howToQrForm, {id: form.id}));
        });

        let qr = new QRCode(document.getElementById("previewQrRepositorio"), {
            text: HOME + "howto/" + form.id,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        var intervalo = setInterval(function () {
            if ($("#previewQrRepositorio").find("img").length) {
                $(".btnqr").attr("href", $("#previewQrRepositorio").find("img").attr("src"));
                clearInterval(intervalo);
            }
        }, 100);
    }
});