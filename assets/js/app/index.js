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

    $('.dropzone').dropper({
        action: "process.php"
    }).on({
        "start.dropper": function(e, files){

        },
        "fileComplete.dropper": function(e, file, response){
            var $obj = $(e.target).find(".upload-check");
            $obj.fadeIn("fast");
            setTimeout(function () {
                $obj.fadeOut();
            }, 3000);
        },
        mouseover: function(){
            $(this).find(".button").fadeIn("fast");
        },
        mouseleave: function(){
            $(this).find(".button").fadeOut("fast");
        }
    }).find(".button").on("click", function(){
        $(this).parent().find(".dropper-dropzone").click();
    });

    window.addEventListener("dragover",function(e){
        e = e || event;
        e.preventDefault();
    },false);
    window.addEventListener("drop",function(e){
        e = e || event;
        e.preventDefault();
    },false);

    $("#plus-button").on("click", function(){
        loadIframe();
    });

    $(".dialog-close").on("click", function(){
        $($(this).attr('dismiss')).fadeOut();
        $("body").css("overflow", "auto");
    });

    $("#save-confirm").on("click", function(){
        var newName = $("#save-file-name").val().trim();
        var oldName;

        if ($targetButton.data("renamed")){
            oldName = $targetButton.text() + "--" + $targetButton.data("time");
        } else {
            oldName = "--" + $targetButton.data("time");
        }

        $.ajax({
            url: "process.php",
            type: "POST",
            data: {
                action: "rename-app",
                oldName: oldName,
                newName: newName + "--" + $targetButton.data("time")
            },
            success: function(){
                $targetButton.text(newName).data("renamed", true);
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

function addButton(name){
    var text = name.split("--")[0].trim();

    $("<button></button>", {
        text: text==""?timeConverter(name.split("--")[1]):text,
        class: "normal-btn app-btn"
    }).data({
        time: name.split("--")[1],
        renamed: text!=""
    }).on({
        click: function(){
            var name;
            if ($(this).data("renamed")){
                name = $(this).text() + "--" + $(this).data("time");
            } else {
                name = "--" + $(this).data("time");
            }
            loadIframe(name, $(this).text());
        }
    }).appendTo("#buttons");
}

function loadIframe(name, text){
    if (name == undefined){
        name = "";
    }

    var iframeContainer = $("#iframe-container"), iframe = iframeContainer.find("iframe"), frameWin = iframe[0].contentWindow;
    iframe.attr("src", window.location.href + "/iframe/").off("load").on({
        load: function(){
            frameWin.postMessage({action: 'app-name', name: name, text: text}, '*');
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
                addButton("--" + message.data.time);
            }
            break;
    }
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = (a.getMonth() + 1).toString();
    month = month.length == 1? "0" + month: month;
    //var month = months[a.getMonth()];
    var date = a.getDate().toString();
    date = date.length == 1? "0" + date: date;
    var hour = a.getHours().toString();
    hour = hour.length == 1? "0" + hour: hour;
    var min = a.getMinutes().toString();
    min = min.length == 1? "0" + min: min;
    var sec = a.getSeconds().toString();
    sec = sec.length == 1? "0" + sec: sec;
    return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
}