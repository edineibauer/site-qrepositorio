function closeModal() {
    $("#app").off("mouseup");
    $("#modalHowTo, #core-overlay").removeClass("active");
    $("#modalContent").html("");
}

function getContent(type, repo) {
    let $content = "";
    if(type === 1) {
        //imagem
        $content = repo.preview;
    } else if(type === 2) {
        //video
        $content = "<video height='700' controls><source src='" + repo.url + "' type='" + repo.fileType + "'></video>";
    } else {
        //pdf
        $content = $("<iframe/>").attr("src", "http://docs.google.com/gview?embedded=true&url=" + repo.url).attr("frameborder", "0").css({width: "100%", height: "99%", "min-height": (window.innerHeight - 200) + "px"});
    }
    return $content;
}

$(function() {
    getTemplates().then(tpl => {
        db.exeRead("repositorio", parseInt(FRONT.VARIAVEIS[0])).then(repo => {
            if(!isEmpty(repo.anexos)) {
                for(let i in repo.anexos) {
                    repo.anexos[i].isImage = repo.anexos[i].isImage === "true";
                    if(repo.anexos[i].isImage)
                        repo.anexos[i].preview = repo.anexos[i].preview.replace("class='left", "class='");
                    repo.anexos[i].isVideo = /^video\//.test(repo.anexos[i].fileType);
                    repo.anexos[i].isPdf = "application/pdf" === repo.anexos[i].fileType;
                    repo.anexos[i].isDownload = !repo.anexos[i].isPdf && !repo.anexos[i].isVideo && !repo.anexos[i].isImage;
                    repo.anexos[i].isType = repo.anexos[i].isImage ? 1 : (repo.anexos[i].isVideo ? 2 : 3);
                }
            }

            $(".r-howto").append(Mustache.render(tpl.howTo, repo, {svgFiles: tpl.svgFiles, howToCard: tpl.howToCard}));

            $(".modal-open").off("click").on("click", function() {
                $("#core-overlay").css("background-color", "rgba(0,0,0,.5)");
                $("#core-overlay, #modalHowTo").addClass("active");
                $("#app").on("mouseup", function (e) {
                    if ($(".closeModal").is(e.target) || $(".closeModal > i").is(e.target) || (!$("#modalHowTo").is(e.target) && $("#modalHowTo").has(e.target).length === 0))
                        closeModal()
                });
                db.exeRead("repositorio", parseInt($(this).attr("data-id"))).then(repo => {
                    let name = $(this).attr("data-name");
                    let type = parseInt($(this).attr("data-type"));
                    for(let i in repo.anexos) {
                        if(repo.anexos[i].name === name) {
                            $("#modalTitle").html(repo.anexos[i].nome);
                            $("#modalContent").html(getContent(type, repo.anexos[i]));
                            if(type === 2)
                                $("video")[0].play();
                            return !1;
                        }
                    }
                });
            });

            $("#modalHowTo").css("margin-left", ((window.innerWidth - $("#modalHowTo").width()) / 2) + "px");
            window.addEventListener("resize", function () {
                $("#modalHowTo").css("margin-left", ((window.innerWidth - $("#modalHowTo").width()) / 2) + "px");
            });
        })
    });
});