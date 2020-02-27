function closeModal() {
    $("#app").off("mouseup");
    $("#modalHowTo, #core-overlay").removeClass("active");
    $("#modalContent").html("");
}

function getContent(type, repo) {
    let $content = "";
    if(type === 1) {
        //imagem
        $content = "<img src='" + repo.url + "' class='col' title='" + repo.nome + "' alt='imagem para " + repo.nome + "' />";
    } else if(type === 2) {
        //video
        $content = "<video height='700' controls><source src='" + repo.url + "' type='" + repo.fileType + "'></video>";
    } else if(type === 3) {
        //document
        $content = $("<iframe/>").attr("src", "https://docs.google.com/gview?embedded=true&url=" + repo.url).attr("frameborder", "0").css({width: "100%", height: "99%", "min-height": (window.innerHeight - 200) + "px"});
    } else if(type === 4) {
        //audio
        $content = "<audio controls><source src='" + repo.url + "' type='" + repo.fileType + "'></audio>";
    }
    return $content;
}

$(function() {
    getTemplates().then(tpl => {
        getJSON(HOME + "app/search/repositorios/id/" + FRONT.VARIAVEIS[0]).then(repo => {
            if(!isEmpty(repo) && !isEmpty(repo.repositorios) && !isEmpty(repo.repositorios[0])) {
                console.log(repo);
                repo = repo.repositorios[0];
                if(!isEmpty(repo.anexos)) {
                    if(typeof repo.anexos === "string" && isJson(repo.anexos))
                        repo.anexos = JSON.parse(repo.anexos);

                    for(let i in repo.anexos) {
                        repo.anexos[i].isImage = repo.anexos[i].isImage === "true";
                        if(repo.anexos[i].isImage)
                            repo.anexos[i].preview = repo.anexos[i].preview.replace("class='left", "class='");
                        repo.anexos[i].isVideo = /^video\//.test(repo.anexos[i].fileType);
                        repo.anexos[i].isAudio = /^audio\//.test(repo.anexos[i].fileType);
                        repo.anexos[i].isDoc = ["txt", "doc", "docx", "dot", "dotx", "dotm", "ppt", "pptx", "pps", "potm", "potx", "pdf", "xls", "xlsx", "xltx", "rtf", "html", "css", "scss", "js", "tpl", "json", "xml", "md", "sql", "dll"].indexOf(repo.anexos[i].type) > -1;
                        repo.anexos[i].isDownload = !repo.anexos[i].isDoc && !repo.anexos[i].isVideo && !repo.anexos[i].isImage && !repo.anexos[i].isAudio;
                        repo.anexos[i].isType = repo.anexos[i].isImage ? 1 : (repo.anexos[i].isVideo ? 2 : (repo.anexos[i].isDoc ? 3 : (repo.anexos[i].isAudio ? 4 : 5)));
                    }
                }

                $(".r-howto").append(Mustache.render(tpl.howTo, repo, {svgFiles: tpl.svgFiles, howToCard: tpl.howToCard}));

                $(".modal-open").off("click").on("click", function() {
                    $("#core-overlay").css("background-color", "rgba(0,0,0,.8)");
                    $("#core-overlay, #modalHowTo").addClass("active");
                    $("#app").on("mouseup", function (e) {
                        if ($(".closeModal").is(e.target) || $(".closeModal > i").is(e.target) || (!$("#modalHowTo").is(e.target) && $("#modalHowTo").has(e.target).length === 0))
                            closeModal()
                    });

                    let name = $(this).attr("data-name");
                    let type = parseInt($(this).attr("data-type"));
                    for(let i in repo.anexos) {
                        if(repo.anexos[i].name === name) {
                            let file = repo.anexos[i];
                            $("#modalTitle").html((!file.isImage ? file.preview : "") + file.nome);
                            $("#modalContent").html(getContent(type, file));
                            $(".downloadModal").attr("href", file.url)
                            if(type === 2)
                                $("#modalContent video")[0].play();
                            else if(type === 4)
                                $("#modalContent audio")[0].play();
                            return !1;
                        }
                    }
                });

                $("#modalHowTo").css("margin-left", ((window.innerWidth - $("#modalHowTo").width()) / 2) + "px");
                window.addEventListener("resize", function () {
                    $("#modalHowTo").css("margin-left", ((window.innerWidth - $("#modalHowTo").width()) / 2) + "px");
                });

                if(USER.setor === "clientes") {
                    db.exeCreate("historico", {
                        repositorio: FRONT.VARIAVEIS[0],
                        titulo: repo.nome,
                        cliente: USER.id,
                        data_de_acesso: moment().format("YYYY-MM-DD HH:mm:ss")
                    });
                }
            }
        })
    });
});