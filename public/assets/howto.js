function closeModal() {
    $("#app").off("mouseup");
    $("#modalHowTo, #core-overlay").removeClass("active");
    $("#modalContent").html("");
}

function getContent(type, repo) {
    let $content = "";
    if (type === 1) {
        //imagem
        $content = "<img src='" + repo.url + "' class='col' title='" + repo.nome + "' alt='imagem para " + repo.nome + "' />";
    } else if (type === 2) {
        //video
        $content = "<video height='700' controls><source src='" + repo.url + "' type='" + repo.fileType + "'></video>";
    } else if (type === 3) {
        //document
        $content = $("<iframe/>").attr("src", "https://docs.google.com/gview?embedded=true&url=" + repo.url).attr("frameborder", "0").css({
            width: "100%",
            height: "99%",
            "min-height": (window.innerHeight - 200) + "px"
        });
    } else if (type === 4) {
        //audio
        $content = "<audio controls><source src='" + repo.url + "' type='" + repo.fileType + "'></audio>";
    }
    return $content;
}

function resizeControl() {
    $("#modalHowTo").css("margin-left", ((window.innerWidth - $("#modalHowTo").width()) / 2) + "px");
    window.addEventListener("resize", function () {
        $("#modalHowTo").css("margin-left", ((window.innerWidth - $("#modalHowTo").width()) / 2) + "px");
    });
}

function openQr(qrContent, fullpage) {
    if (!isEmpty(qrContent)) {
        fullpage = typeof fullpage !== "undefined";
        /**
         * Overlay
         */
        $("#core-overlay").css("background-color", (fullpage ? "rgba(0,0,0,1)" : "rgba(0,0,0,.8)"));
        $("#core-overlay, #modalHowTo").addClass("active");

        /**
         * Modal Content
         */
        $("#modalTitle").html((!qrContent.isImage ? qrContent.preview : "") + qrContent.nome);
        $("#modalContent").html(getContent(qrContent.isType, qrContent));
        $(".downloadModal").attr("href", qrContent.url);
        if (qrContent.isType === 2)
            $("#modalContent video")[0].play();
        else if (qrContent.isType === 4)
            $("#modalContent audio")[0].play();

        /**
         * Close modal
         */
        $("#app").off("mouseup").on("mouseup", function (e) {
            if ($(".closeModal").is(e.target) || $(".closeModal > i").is(e.target) || (!$("#modalHowTo").is(e.target) && $("#modalHowTo").has(e.target).length === 0)) {
                if (fullpage)
                    history.back();
                else
                    closeModal()
            }
        });
    }
}

$(function () {
    getTemplates().then(tpl => {
        db.exeRead("qr_code", FRONT.VARIAVEIS[0]).then(repo => {
            if (!isEmpty(repo)) {
                if (!isEmpty(repo.anexos)) {
                    for (let i in repo.anexos) {
                        repo.anexos[i].isImage = repo.anexos[i].isImage === "true";
                        if (repo.anexos[i].isImage)
                            repo.anexos[i].preview = repo.anexos[i].preview.replace("class='left", "class='");
                        repo.anexos[i].isVideo = /^video\//.test(repo.anexos[i].fileType);
                        repo.anexos[i].isAudio = /^audio\//.test(repo.anexos[i].fileType);
                        repo.anexos[i].isDoc = ["txt", "doc", "docx", "dot", "dotx", "dotm", "ppt", "pptx", "pps", "potm", "potx", "pdf", "xls", "xlsx", "xltx", "rtf", "html", "css", "scss", "js", "tpl", "json", "xml", "md", "sql", "dll"].indexOf(repo.anexos[i].type) > -1;
                        repo.anexos[i].isDownload = !repo.anexos[i].isDoc && !repo.anexos[i].isVideo && !repo.anexos[i].isImage && !repo.anexos[i].isAudio;
                        repo.anexos[i].isType = repo.anexos[i].isImage ? 1 : (repo.anexos[i].isVideo ? 2 : (repo.anexos[i].isDoc ? 3 : (repo.anexos[i].isAudio ? 4 : 5)));
                    }
                    repo.one = repo.anexos.length === 1;

                    /**
                     * Renderiza a tela
                     */
                    $(".r-howto").append(Mustache.render(tpl.howTo, repo, {
                        svgFiles: tpl.svgFiles,
                        howToCard: tpl.howToCard
                    }));

                    if (repo.anexos.length === 1) {
                        repo.anexos[0].nome = repo.titulo;
                        openQr(repo.anexos[0], 1);

                    } else {

                        /**
                         * Função de click nos cards
                         */
                        $(".modal-open").off("click").on("click", function () {
                            let name = $(this).attr("data-name");
                            openQr(repo.anexos.find(s => s.name === name));
                        });

                        resizeControl();
                    }

                    if (USER.setor === "clientes") {
                        db.exeCreate("historico", {
                            repositorio: FRONT.VARIAVEIS[0],
                            titulo: repo.nome,
                            cliente: USER.id,
                            data_de_acesso: moment().format("YYYY-MM-DD HH:mm:ss")
                        });
                    }
                }
            }
        })
    });
});