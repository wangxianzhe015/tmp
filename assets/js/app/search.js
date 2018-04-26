function addSearchBox() {
    regexSearchCount++;
    var box = $('<div/>', {
        id: 'regex-search-box-' + regexSearchCount,
        'class': 'regex-search-box empty'
    }).css({
        top: downPoint.y + 40,
        left: downPoint.x
    }).appendTo('body');

    var buttonDiv = $('<div/>', {
        class: 'regex-search-buttons'
    }).appendTo(box);

    $('<span></span>', {
        class: 'remove-regex-search',
        text: 'x',
        title: 'Remove RegEx search'
    }).css({
        opacity: 0
    }).on("click", function () {
        $(this).parent().remove();
        canvas.forEachObject(function (obj) {
            if (obj.class === 'element') {
                obj.setVisible(true);
                obj.newPoint.setVisible(true);
                obj.tickButton.setVisible(true);
                obj.lines.forEach(function (line) {
                    line.setVisible(true);
                    line.leftCircle.setVisible(true);
                    line.rightCircle.setVisible(true);
                });
                $(".regex-search-input").each(function (i, el) {
                    var regexExp = new RegExp($(el).val().toUpperCase(), "g");
                    if (!regexExp.test(obj.datatext.toUpperCase()) && !regexExp.test(obj.item(1).getText().toUpperCase()) && !regexExp.test(obj.id.toString().toUpperCase())) {
                        obj.setVisible(false);
                        obj.newPoint.setVisible(false);
                        obj.tickButton.setVisible(false);
                        obj.lines.forEach(function (line) {
                            line.setVisible(false);
                            line.leftCircle.setVisible(false);
                            line.rightCircle.setVisible(false);
                        });
                    }
                });
            }
        });
        canvas.renderAll();
        regexSearchCount--;
    }).appendTo(buttonDiv);

    $('<img/>', {
        class: 'regex-negative-search-btn',
        src: 'assets/images/icons/random-8.png'
    }).on("click", function() {
        var box = $(this).parents(".regex-search-box");
        box.find(".regex-search-input-negative").css("opacity", 1);
        box.find("hr").css("opacity", 0.5);
    }).appendTo(buttonDiv);

    var inputDiv = $('<div/>', {
        class: 'regex-search-inputs'
    }).appendTo(box);

    $('<input/>', {
        type: 'text',
        class: 'regex-search-input',
        id: 'regex-search-input-' + regexSearchCount
    }).on('keyup', function (e) {
        var box = $(this).parents(".regex-search-box");
        box.removeClass('empty');
        box.find(".remove-regex-search").css("opacity", 1);
        if (parseInt(box.css("left")) + parseInt($(this).css("width")) + 20 < canvas.getWidth()) {
            $(this).css("width", ($(this).val().length + 1) * 20 + "px");
        }
        if (e.keyCode === 13) {
            $('.canvas-container').css('background-image', 'url(assets/images/subtle-carbon.png)');
            var input = $(this).val().trim(), $that = $(this);
            if (input.toUpperCase().indexOf("SQL:") == 0) {
                sqlSearch($that, input);
            } else {
                var regexExp = new RegExp(input.toUpperCase(), "g");
                canvas.forEachObject(function (obj) {
                    if (obj.class === 'element') {
                        //obj.setVisible(true);
                        if (!regexExp.test(obj.datatext.toUpperCase()) && !regexExp.test(obj.item(1).getText().toUpperCase()) && !regexExp.test(obj.id.toString().toUpperCase())) {
                            obj.setVisible(false);
                            obj.newPoint.setVisible(false);
                            obj.tickButton.setVisible(false);
                            obj.lines.forEach(function (line) {
                                line.setVisible(false);
                                line.leftCircle.setVisible(false);
                                line.rightCircle.setVisible(false);
                            });
                        }
                    }
                });
                canvas.renderAll();
                $(this).attr('readonly', true);
                box.find(".suggest-list").remove();
            }
        } else {
            var txt = $(this).val().trim().toUpperCase(), parent = '#' + box.attr('id');
            if (txt.indexOf("SQL:") == 0) {
                box.find(".suggest-list").remove();
                return;
            }
            if (regexTimer) {
                clearTimeout(regexTimer);
            }
            regexTimer = setTimeout(function () {
                regexSearch(parent, txt);
            }, 300);
            $(this).parent().find(".suggest-list").hide();
        }
    }).appendTo(inputDiv).focus();

    $('<hr/>').css('opacity', 0).appendTo(inputDiv);

    $('<input/>', {
        type: 'text',
        class: 'regex-search-input-negative'
    }).css('opacity', 0).appendTo(inputDiv);

    $('<ul></ul>', {
        'class': 'suggest-list'
    }).appendTo(box);
}

function regexSearch(parent,txt){
    var suggestList = $(parent).find('.suggest-list');

    $.ajax({
        url: 'action.php',
        type: 'POST',
        data: {
            action: 'regex-search',
            text: txt
        },
        success: function(res){
            var list = $.parseJSON(res);
            if (list.length > 0) {
                suggestList.html("").show();
            }

            if (list.length < 6){
                suggestList.css({
                    'overflow-y': 'hidden',
                    'margin-left': '-5px'
                });
            } else {
                suggestList.css({
                    'overflow-y': 'scroll',
                    'margin-left': '-13px'
                });
            }
            var liTag;
            list.forEach(function(word){
                if (word !== ''){
                    liTag = $('<li></li>',{
                        "data-hidden": word['hidden'],
                        "data-id": word['id']
                    }).on("click", function(){
                        $(parent).find(".regex-search-input").val($(this).find(".regex-search-head").html()).focus();
                        $(parent).find(".suggest-list").hide().find("li").show();
                        removeImageTools(true);
                    }).on("mouseover", function(){
                        $(this).parent().find(".search-tooltip-object").removeClass("search-tooltip-object");
                        $(this).addClass("search-tooltip-object");
                        mouseOverElement = true;
                        var dialog = $("#searchTooltip");
                        dialog.find(".tab-menu").find("a").text($(this).find(".regex-search-head").text());
                        dialog.find("#search-result-description").val($(this).find(".regex-search-tagline").text().split(" | ")[0] + ", " + $(this).find(".regex-search-tagline").text().split(" | ")[1]);
                        dialog.find("#search-result-id").val($(this).attr("data-id"));
                        var top = window.scrollY + window.innerHeight - dialog.innerHeight() - 150;
                        var left;
                        if (dialog.innerWidth() < $(this).offset().left - window.scrollX){
                            left = $(this).offset().left - dialog.innerWidth();
                        } else {
                            left = $(this).offset().left + $(this).innerWidth();
                        }
                        dialog.find("#search-result-text").html("");
                        var hidden = $(this).attr("data-hidden").split(' | ');
                        dialog.find("#search-result-text").append($("<p></p>",{
                            html: $(this).find(".regex-search-tagline").text().split(" | ")[2]
                        }));
                        dialog.find("#search-result-text").append($("<p></p>",{
                            html: $(this).attr("data-hidden").split(" | ")[0]
                        }));
                        dialog.find("#search-result-text").append($("<p></p>",{
                            html: $(this).attr("data-hidden").split(" | ")[1]
                        }));
                        dialog.css({
                            top: top > 0 ? top : 0,
                            left: left
                        }).attr("data-target", $(this).parents(".regex-search-box").attr("id")).show();
                    }).on("mouseleave", function(){
                        mouseOverElement = false;
                        setTimeout(function(){
                            if (!mouseOverElement) {
                                $("#searchTooltip").attr("data-target", "");
                                removeImageTools(false);
                                //$("#" + target).find(".search-tooltip-object").removeClass("search-tooltip-object");
                            }
                        }, 1000);
                    }).appendTo(suggestList);
                    $('<p></p>', {
                        text: word.head,
                        class: 'regex-search-head'
                    }).appendTo(liTag);
                    $('<p></p>',{
                        text: word.tag,
                        class: 'regex-search-tagline'
                    }).appendTo(liTag);
                    $('<p></p>',{
                        text: word.extra,
                        class: 'regex-search-tagline'
                    }).appendTo(liTag);
                }
            });
            $(parent).find(".remove-suggest-list").show();

        }
    });
}

function loadSQLSetting(){
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            action: "load-sql-setting"
        },
        success: function(res){
            if (res == "" || res == "fail") return;
            var array = $.parseJSON(res);
            $("#sql-server").val(array.host);
            $("#sql-port").val(array.port);
            $("#sql-dbname").val(array.db);
            $("#sql-username").val(array.user);
            $("#sql-password").val(array.pwd);
            $("#sql-secure-key").val(array.key.replace(/./g, "X"));
        }
    });
}

function saveSQLSetting(){
    var host = $("#sql-server").val();
    var port = $("#sql-port").val();
    var db = $("#sql-dbname").val();
    var user = $("#sql-username").val();
    var pwd = $("#sql-password").val();
    var key = $("#sql-secure-key").val();

    if (host == "" || db == "" || user == "") {
        alert("Error", "Input all values!");
        return;
    }

    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            action: "save-sql-setting",
            host: host,
            db: db,
            port: port,
            user: user,
            pwd: pwd,
            key: key
        },
        success: function(res){
            alert("Success", res);
        }
    });
}

function sqlSearch(obj, input){
    var host = $("#sql-server").val();
    var port = $("#sql-port").val();
    var db = $("#sql-dbname").val();
    var user = $("#sql-username").val();
    var pwd = $("#sql-password").val();
    var queryString = input.substr(4).trim();
    if (queryString.split(":").length != 2) {
        alert("Alert", "Input exact query!\nQuery format is 'sql:[custom function]:query'.");
        return false;
    }
    var custom = queryString.split(":")[0].trim()!="";

    if (host == "" || db == "" || user == "") {
        alert("Error", "Provide Connection Settings!<br/>You can enter information on \"Data Bank\" Tab of Setting dialog.");
        return;
    }

    $(".loader-container").fadeIn();
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            action: "load-json-from-sql",
            query: queryString,
            host: host,
            port: port,
            db: db,
            user: user,
            pwd: pwd
        },
        success: function (res) {
            if (res == "connection_fail") {
                alert("Alert", "Connection failed.");
            } else if (res == "query_fail") {
                alert("Alert", "Query failed.");
            } else if (res == "invalid_string") {
                alert("Alert", "Query format is wrong.");
            } else {
                pgJsonObjects = $.parseJSON(res);
                var $obj = $("#json-object-next-btn");
                $obj.data("current-page", 0);
                drawTextboxFromPgJSON(0, Math.min($obj.data("per-page") - 1, pgJsonObjects.length));
                $("#json-object-button-div").show();
                obj.parent().remove();
                regexSearchCount--;

                for (var i = 0; i < pgJsonObjects.length; i ++) {
                    $.each(pgJsonObjects[i], function (key, value) {
                        if (key == pgJsonGroupKey) {
                            addTextGroupNameButton(value);
                        }
                    });
                }
            }
        },
        error: function(){
            alert("Alert", "Unknown error!");
        },
        complete: function () {
            $(".loader-container").fadeOut();
        }
    });

}

