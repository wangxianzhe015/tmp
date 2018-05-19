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
                    data: generateData(30, 26),
                    minRows: 1,
                    minCols: 1,
                    rowHeaders: true,
                    colHeaders: true,
                    filters: true,
                    dropdownMenu: true,
                    contextMenu: true,
                    licenseKey: "63ae9-00dfe-0b600-f450d-35624"
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
                            minRows: 1,
                            minCols: 1,
                            rowHeaders: true,
                            colHeaders: true,
                            filters: true,
                            dropdownMenu: true,
                            contextMenu: true,
                            licenseKey: "63ae9-00dfe-0b600-f450d-35624"
                        }).data("name", name);
                    }
                });
            }
            break;
    }
}

function generateData(rows, cols){
    var res = [], row = [];
    for (var i = 0; i < rows; i ++){
        row = [];
        for (var j = 0; j < cols; j ++){
            row.push("");
        }
        res.push(row);
    }
    return res;
}