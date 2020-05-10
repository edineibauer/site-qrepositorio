<nav class="sidebar z-depth-2 collapse color-gray-light no-select dashboard-nav space-header"
     id="mySidebar">
    <div class="container row padding-4" style="background-color: #e9e9e9">
        <div id="dashboard-sidebar-imagem" class="col" style="height: 60px; width: 60px"></div>
        <div class="rest padding-left padding-bottom">
            <strong class="col padding-top no-select" id="dashboard-sidebar-nome"></strong>

            <div class="col">
                <span class="btn-edit-perfil left pointer padding-small color-gray-light opacity hover-opacity-off hover-shadow radius">
                    <i class="material-icons left font-large">edit</i>
                </span>
            </div>
        </div>
    </div>
    <hr style="margin:0 0 10px 0;border-top: solid 1px #ddd;">
    <div class="bar-block" id="dashboard-menu"></div>
</nav>

<div class="main dashboard-main animate-left">
    <div id="dashboard" class="dashboard-tab container row">
        <div class="col padding-left padding-bottom padding-right">
            <h4 class="color-text-gray-dark left padding-24">histórico</h4>

            <a href="readQr" data-animation="forward" class="btn margin-top theme radius padding-large right">
                <svg id="svgQr" style="display: inline;float:left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z" /></svg>
                <div style="padding-left: 7px;display: inline">Ler QR code</div>
            </a>
        </div>

        <div class="col padding-left padding-bottom padding-right">

            <div class="col" id="historico"></div>
        </div>
    </div>
</div>