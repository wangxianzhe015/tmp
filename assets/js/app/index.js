var $targetButton;

window.addEventListener("message", parentMessageHandler, false);

$(document).ready(function(){
    $.ajax({
        url: "process.php",
        type: "POST",
        data: {
            "action": "get-all-apps"
        },
        success: function(res){
            var files = $.parseJSON(res);
            for (var i = 0; i < files.length; i ++){
                addButton(files[i]);
            }
        }
    });

    $("#plus-button").on("click", function(){
        loadIframe();
    });

    $(".dialog-close").on("click", function(){
        $($(this).attr('dismiss')).fadeOut();
        $("body").css("overflow", "auto");
    });

    $("#save-confirm").on("click", function(){
        var newName = $("#save-file-name").val().trim();
        $.ajax({
            url: "process.php",
            type: "POST",
            data: {
                action: "rename-app",
                oldName: $targetButton.text() + "-" + $targetButton.data("time"),
                newName: newName + "-" + $targetButton.data("time")
            },
            success: function(){
                $targetButton.text(newName);
                $("#change-name").fadeOut();
                $("#save-file-name").val("");
            }
        });
    });

    $(document).contextmenu({
        menu: [
            {title: "Rename", cmd: "rename", uiIcon: "ui-icon-copy"}
            //{title: "----"},
            //{title: "More", children: [
            //    {title: "Sub 1", cmd: "sub1"},
            //    {title: "Sub 2", cmd: "sub1"}
            //]}
        ],
        beforeOpen: function(event, ui){
            if ($(ui.target).hasClass("app-btn")){
                $targetButton = $(ui.target);
            } else {
                return false;
            }
        },
        select: function(event, ui) {
            //alert("select " + ui.cmd + " on " + ui.target.text());
            switch (ui.cmd){
                case "rename":
                    $("#change-name").fadeIn();
                    $("body").css("overflow", "hidden");
                    break;
            }
        }
    });
});

function addButton(text){
    $("<button></button>", {
        text: text.split("-")[0],
        class: "normal-btn app-btn"
    }).data({
        time: text.split("-")[1]
    }).on({
        click: function(){
            loadIframe($(this).text() + "-" + $(this).data("time"));
        }
    }).appendTo("#buttons");
}

function loadIframe(name){
    if (name == undefined){
        name = "";
    }

    var iframeContainer = $("#iframe-container"), iframe = iframeContainer.find("iframe"), frameWin = iframe[0].contentWindow;
    iframe.attr("src", window.location.href + "/iframe/").off("load").on({
        load: function(){
            frameWin.postMessage({action: 'app-name', name: name}, '*');
        }
    });

    iframeContainer.fadeIn();
}

function parentMessageHandler(message){
    var action = message.data.action;
    switch (action){
        case "close-iframe":
            $("#iframe-container").fadeOut();
            if (!message.data.isChanged){
                break;
            }
            if (message.data.isNew) {
                addButton("data-" + message.data.time);
            }
            break;
    }
}