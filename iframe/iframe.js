window.addEventListener("message", messageHandler, false);
var isNew = true;
var changed = false;

$(document).ready(function(){
    $(document).on({
        keyup: function(){
            changed = true;
        }
    });

    $("#close-btn").on("click", function(){
        if (!changed) {
            parent.window.postMessage({action: "close-iframe", isChanged: changed}, '*');
            return;
        }
        if (isNew) {
            $.ajax({
                url: "../process.php",
                type: "POST",
                data: {
                    action: "save-app",
                    data: JSON.stringify($("#table-container").handsontable('getData'))
                },
                success: function (res) {
                    parent.window.postMessage({action: "close-iframe", isChanged: changed, isNew: isNew, time: res}, '*');
                }
            });
        } else {
            $.ajax({
                url: "../process.php",
                type: "POST",
                data: {
                    action: "save-app",
                    name: $("#table-container").data("name"),
                    data: JSON.stringify($("#table-container").handsontable('getData'))
                },
                success: function (res) {
                    parent.window.postMessage({action: "close-iframe", isChanged: changed, isNew: isNew, time: res}, '*');
                }
            });
        }
    });
});

function messageHandler(message){
    var action = message.data.action;

    switch (action){
        case "app-name":
            var name = message.data.name;
            if (name == ""){
                isNew = true;
                $("#table-container").handsontable({
                    data: [["", "", "", "", ""],
                        ["", "", "", "", ""],
                        ["", "", "", "", ""],
                        ["", "", "", "", ""]],
                    startRows: 4,
                    startCols: 5,
                    minRows: 4,
                    minCols: 5,
                    rowHeaders: true,
                    colHeaders: true,
                    filters: true,
                    contextMenu: true
                });
            } else {
                isNew = false;
                $.ajax({
                    url: "../process.php",
                    type: "POST",
                    data: {
                        action: "get-app",
                        name: name
                    },
                    success: function (res) {
                        $("#table-container").handsontable({
                            data: $.parseJSON(res),
                            rowHeaders: true,
                            colHeaders: true,
                            contextMenu: true
                        }).data("name", name);
                    }
                });
            }
            break;
    }
}