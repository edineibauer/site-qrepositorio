$(function() {
   if(typeof form === "object" && typeof form.id === "number" && !isNaN(form.id) && form.id > 0) {

       getTemplates().then(tpl => {
           $("#previewQrRepositorio").append(Mustache.render(tpl.howToQrForm, {id: form.id}));
       });

       new QRCode(document.getElementById("previewQrRepositorio"), {
           text: HOME + "howto/" + form.id,
           width: 150,
           height: 150,
           colorDark : "#000000",
           colorLight : "#ffffff",
           correctLevel : QRCode.CorrectLevel.H
       });
   }
});