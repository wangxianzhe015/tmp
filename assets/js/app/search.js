function addSearchBox() {
    regexSearchCount++;
    var box = $('<div/>', {
        id: 'regex-search-box-' + regexSearchCount,
        'class': 'regex-search-box empty'
    }).css({
        top: downPoint.y + 40,
        left: downPoint.x
    }).appendTo('body');

    $('<span></span>', {
        class: 'remove-regex-search',
        text: 'x',
        title: 'Remove RegEx search'
    }).css({
        position: 'absolute',
        top: '25px',
        left: '-10px',
        cursor: 'pointer',
        color: 'white'
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
    }).appendTo(box).hide();

    $('<input/>', {
        type: 'text',
        class: 'regex-search-input',
        id: 'regex-search-input-' + regexSearchCount
    }).on('keyup', function (e) {
        $(this).parent().removeClass('empty');
        $(this).parent().find(".remove-regex-search").show();
        if (parseInt($(this).parent().css("left")) + parseInt($(this).css("width")) + 20 < canvas.getWidth()) {
            $(this).css("width", ($(this).val().length + 1) * 20 + "px");
        }
        if (e.keyCode === 13) {
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
                $(this).parent().find(".suggest-list").remove();
            }
        } else {
            var txt = $(this).val().trim().toUpperCase(), parent = '#' + $(this).parent().attr('id');
            if (txt.indexOf("SQL:") == 0) return;
            if (regexTimer) {
                clearTimeout(regexTimer);
            }
            regexTimer = setTimeout(function () {
                regexSearch(parent, txt);
            }, 300);
            $(this).parent().find(".suggest-list").hide();
        }
    }).appendTo(box).focus();

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

function sqlSearch(obj, input){
    var host = $("#sql-server").val();
    var port = $("#sql-port").val();
    var db = $("#sql-dbname").val();
    var user = $("#sql-username").val();
    var pwd = $("#sql-password").val();

    if (host == "" || db == "" || user == "") {
        alert("Error", "Provide Connection Settings!<br/>You can enter information on \"SQL\" Tab of Setting dialog.");
        return;
    }

    $(".loader-container").fadeIn();
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            action: "load-json-from-sql",
            query: input.substr(4).trim(),
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
        complete: function () {
            $(".loader-container").fadeOut();
        }
    });

}

