;(function(document, $) {
    var taggerContainerClassName = "tagger-icons-container",
        taggerIconPath = {
            "cut": "../assets/images/icons/cut-black-24.png",
            "unhighlight": "../assets/images/icons/highlight-black-24.png",
            "tick": "../assets/images/icons/check-24-black.png"
        },
        keywords = ["Fact", "Hint", "Metadata"];

    function addTaggerIcons(target){
        $("<div></div>",{
            class: taggerContainerClassName,
            "data-target": target
        }).insertBefore($("#"+target).parents(".playground"));

        $("<img/>",{
            class: "tagger-icon tagger-icon-cut",
            title: "Cut",
            src: taggerIconPath.cut
        }).on("click", function(){
            document.execCommand('copy');
            $("#tagger-keyword-div").hide();

            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection(), range, data, textTag;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        range = sel.getRangeAt(i);
                        data = range.extractContents();
                        textTag = document.createElement("span");
                        textTag.className = "textillate-in-span";
                        range.insertNode(textTag);

                        if (window.getSelection) {
                            if (window.getSelection().empty) {  // Chrome
                                window.getSelection().empty();
                            } else if (window.getSelection().removeAllRanges) {  // Firefox
                                window.getSelection().removeAllRanges();
                            }
                        } else if (document.selection) {  // IE?
                            document.selection.empty();
                        }

                        $(textTag).html(data).textillate({
                            loop: false,
                            initialDelay: 0,
                            autoStart: true,
                            in: {
                                effect: 'fadeIn',
                                delayScale: 0,
                                delay: 0,
                                sync: true,
                                callback: function(){
                                    $(".textillate-in-span").textillate('out');
                                }
                            },
                            out: {
                                effect: 'hinge',
                                delayScale: 1.5,
                                delay: 0,
                                sync: true,
                                callback: function () {
                                    $(".textillate-in-span").removeClass("textillate-in-span").addClass("textillate-out-span");
                                }
                            }
                        });
                    }
                }
            }
        }).appendTo("."+taggerContainerClassName).hide();

        $("<img/>",{
            class: "tagger-icon tagger-icon-unhightlight",
            title: "Unhighlight all",
            src: taggerIconPath.unhighlight
        }).on("click", function(){
            unhighlightAll($(this).parent().attr("data-target"));
        }).appendTo("."+taggerContainerClassName).hide();

        $("<img/>",{
            class: "tagger-icon tagger-icon-tick",
            title: "Confirm",
            src: taggerIconPath.tick
        }).on("click", function(){
            if (window.getSelection().toString() == "")return false;
            $("#tagger-keyword-div").show();
        }).appendTo("."+taggerContainerClassName).hide();

        $("<div></div>", {
            id: "tagger-keyword-div"
        }).appendTo("." + taggerContainerClassName);

        $("<select></select>", {
            id: "tagger-keyword-select"
        }).on("change", function(){
            var keyword = $(this).val();
            $(this).val("");
            if (keyword == "") return false;
            $(this).parent().hide();
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection(), $obj = $(sel.baseNode).parents(".tagger-highlight-text");
                //if ($obj.attr("data-keyword") != ""){
                //    $obj = $(sel.anchorNode).parents(".tagger-highlight-text");
                //}
                var wordID = $obj.attr("data-word-id");
                var oldKeyword = $obj.attr("data-keyword"), oldCheck = true;
                $obj.attr("data-keyword", keyword);
                $(".tagger-highlight-text").each(function(i,el){
                    if ($(el).attr("data-word-id") !== wordID && $(el).attr("data-keyword") === oldKeyword){
                        if ($(el).attr("data-keyword") == oldKeyword) oldCheck = false;
                    }
                });
                if (oldCheck){
                    $("#" + oldKeyword + "-keyword").removeClass("selected");
                }
                //$("#" + $obj.attr("id") + "-keyword").html(keyword);
            }
            $("#" + keyword + "-keyword").addClass("selected");

            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }

        }).appendTo("#tagger-keyword-div");

        $("<option></option>", {
            value: "",
            text: "-- Select keyword --"
        }).appendTo("#tagger-keyword-select");

        keywords.forEach(function(word){
            $("<option></option>", {
                value: word,
                text: word
            }).appendTo("#tagger-keyword-select");
        });

        $("<span></span>", {
            id: "tagger-unhighlight-btn",
            text: "X"
        }).on("click", function(e){
            $("#tagger-keyword-div").hide();
            var sel = window.getSelection(), data = sel.toString(), $obj = $(sel.baseNode).parents(".tagger-highlight-text"), $container = $obj.parents(".tagger-content");
            if (data != "") {
                $("#" + $obj.attr("id") + "-keyword").remove();
                $obj.replaceWith(data);
                $container.html($container.html());

                if (window.getSelection) {
                    if (window.getSelection().empty) {  // Chrome
                        window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {  // Firefox
                        window.getSelection().removeAllRanges();
                    }
                } else if (document.selection) {  // IE?
                    document.selection.empty();
                }
            }

        }).appendTo("#tagger-keyword-div");

    }

    function unhighlightAll(target){
        var $obj = $("#" + target);
        var hiddens = $obj.find(".textillate-out-span");
        hiddens.each(function(i,el){
            $(el).replaceWith($(el).find(".texts").text());
        });
        while( $obj.find(".tagger-highlight-text").length > 0) {
            $obj.find(".tagger-highlight-text").each(function (i, el) {
                $(el).replaceWith($(el).html());
            });
        }
        $obj.html($obj.html());
    }

    function updateTaggerApps($obj){
        $.ajax({
            url: "action.php",
            type: "POST",
            data: {
                action: "load-tagger-names"
            },
            success: function(res){
                if (res != "fail") {
                    var names = $.parseJSON(res);
                    $obj.next().html("");
                    names.forEach(function (name) {
                        if (name != "." && name != ".." && name != ".gitignore") {
                            $("<option></option>", {
                                text: name,
                                value: name
                            }).appendTo($obj.next());
                        }
                    });
                    $obj.next().show();
                }
            }
        });
    }

    $.fn.textTagger = function(options) {
        var playground = $("<div></div>", {
            class: "playground"
        }).insertBefore($(this));

        $(this).addClass("tagger-container").appendTo(playground);

        var rightPanel = $("<div></div>", {
            class: "tagger-keyword-right-panel"
        });
        var leftPanel = $("<div></div>", {
            class: "tagger-keyword-left-panel"
        });
        playground.append(rightPanel).prepend(leftPanel);

        keywords.forEach(function(word){
            $("<div></div>",{
                id: word + "-keyword",
                class: "tagger-highlight-keyword",
                text: word
            }).appendTo(leftPanel);
        });

        $("<div></div>", {
            class: "tagger-notification-panel"
        }).insertAfter(playground);

        $("<div></div>", {
            class: "tagger-button-panel"
        }).append($("<input/>", {
            type: "text",
            id: "tagger-app-name",
            placeholder: "App Name"
        })).append($("<img/>", {
            src: taggerIconPath.tick,
            class: "image-btn"
        }).on("click", function(){
            //var hintCheck = false;
            //$(".tagger-highlight-keyword").each(function(i, obj){
            //    if ($(obj).html() == "Hint") hintCheck = true;
            //});
            var app_name = $("#tagger-app-name").val();
            if (app_name == ""){
                $(".tagger-notification-panel").html("Input App Name!!!");
                setTimeout(function(){
                    $(".tagger-notification-panel").html("");
                }, 3000);
                return false;
            }
            $(this).prev().val("");
            if (!$("#Hint-keyword").hasClass("selected")){
                $(".tagger-notification-panel").html("Hint Not Checked!!!");
                setTimeout(function(){
                    $(".tagger-notification-panel").html("");
                }, 3000);
                return false;
            }
            var data = {}, wordID = "", tmp, wordIDs = [], list = [];
            $(".tagger-highlight-text").each(function(i, el){
                wordID = $(el).attr("data-word-id").toString();
                if (data[wordID] == undefined) {
                    wordIDs.push(wordID);
                    data[wordID] = {
                        text: $(el).text(),
                        keyword: $(el).attr("data-keyword")
                    }
                } else {
                    tmp = data[wordID].text;
                    data[wordID] = {
                        text: tmp + $(el).text(),
                        keyword: $(el).attr("data-keyword")
                    }
                }
            });
            wordIDs.forEach(function(id){
                list.push(data[id]);
            });
            $.ajax({
                url: "../action.php",
                data: {
                    "action": "save-tagger",
                    data: {"json": list, "full": $(this).parent().prev().find(".tagger-content").html()},
                    name: app_name
                },
                type: "POST",
                success: function(){
                    $(".tagger-notification-panel").html("Saved Successfully!");
                    setTimeout(function(){
                        $(".tagger-notification-panel").html("");
                    }, 3000);
                }
            });
            $(".tagger-icon-cut").show();
        }).hide()).append($("<button></button>", {
            class: "tagger-app-init-btn"
        }).on("click", function(){
            var playground = $(this).parent().prev();
            playground.find(".tagger-content").html('By pressing Ctrl + V, you can input text here. You need to point where to paste by clicking with mouse. Or you can open saved one by clicking "Open" button.').addClass("init");
            playground.find(".tagger-loading-div").show();
            playground.find(".tagger-keyword-left-panel").find(".tagger-highlight-keyword").removeClass("selected");
            $(this).parent().find(".image-btn").hide();
        }).hide()).insertAfter(playground);

        var taggerLoadingDiv = $("<div></div>", {
            class: "tagger-loading-div"
        }).appendTo($(this));

        $("<button></button>", {
            class: "btn",
            text: "Open"
        }).on("click", function(){
            updateTaggerApps($(this));
        }).appendTo(taggerLoadingDiv);

        $("<select></select>", {
            class: "tagger-apps-select"
        }).on("click", function(){
            $(this).next().show();
        }).appendTo(taggerLoadingDiv);

        $("<button></button>", {
            class: "btn tagger-app-load-confirm",
            text: "Confirm"
        }).on("click", function(){
            var appName = $(this).prev().val();
            var that = $(this);
            $.ajax({
                url: "action.php",
                type: "POST",
                data: {
                    action: "load-tagger-app",
                    name: appName
                },
                success: function(res){
                    var text = $.parseJSON(res).full, obj = that.parents(".tagger-loading-div").prev();
                    that.hide().prev().hide().parent().fadeOut();
                    that.parents(".playground").next().find(".image-btn").show();
                    obj.removeClass("init").html(text);
                    obj.find("code").each(function(i, tag){
                        $("#"+$(tag).attr("data-keyword")+"-keyword").addClass("selected");
                        $(tag).on({
                            click: function(){
                                $("#"+$(this).attr("data-keyword")+"-keyword").addClass("selected");
                                $("#tagger-keyword-div").attr("data-target", $(this).attr("id")).css({
                                    left: this.getBoundingClientRect().left,
                                    top: this.getBoundingClientRect().bottom
                                }).show();
                            },
                            mouseover: function(e){
                                if (window.getSelection().toString() != "") return false;
                                var $objects = $.merge($(e.originalEvent.target), $(e.originalEvent.target).parents("code"), $(e.originalEvent.target).find("code")), $obj;
                                $objects.each(function(i,el){
                                    $obj = $("#"+$(el).attr("data-keyword")+"-keyword");
                                    //if ($obj.html() == "") return false;
                                    $obj.addClass("hover");
                                });
                            },
                            mouseout: function(e){
                                var $objects = $.merge($(e.originalEvent.target), $(e.originalEvent.target).parents("code"), $(e.originalEvent.target).find("code")), $obj;
                                $objects.each(function(i,el){
                                    $obj = $("#"+$(el).attr("data-keyword")+"-keyword");
                                    //if ($obj.html() == "") return false;
                                    $obj.removeClass("hover");
                                });
                            }
                        });
                    });
                }
            });
        }).appendTo(taggerLoadingDiv);

        if ($(this).find(".tagger-icons-container").length == 0){
            addTaggerIcons($(this).attr("id"));
        }
        return this.on("mouseup", function(event) {
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection(), range, data, children, highlightTag, keywordTag, isSecond = false;
                if (sel.toString() == "" || $(sel.baseNode).parents(".tagger-highlight-text").attr("data-keyword") == "")return false;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        range = sel.getRangeAt(i);
                        data = range.cloneContents();
                        children = $(data).children();
                        children.each(function(i,el){
                            if ($(el).parents(".second").length > 0){
                                isSecond = true;
                            }
                        });
                        if (isSecond) return false;
                        range.deleteContents();
                        var randomId = "word" + parseInt(Math.random() * 1000000000);
                        highlightTag = $("<code></code>", {
                            "data-word-id": randomId,
                            class: "tagger-highlight-text",
                            "data-keyword": "",
                            html: data
                        }).on({
                            click: function(){
                                $("#"+$(this).attr("data-keyword")+"-keyword").addClass("selected");
                                $("#tagger-keyword-div").attr("data-target", $(this).attr("id")).css({
                                    left: this.getBoundingClientRect().left,
                                    top: this.getBoundingClientRect().bottom
                                }).show();
                            },
                            mouseover: function(e){
                                if (window.getSelection().toString() != "") return false;
                                var $objects = $.merge($(e.originalEvent.target), $(e.originalEvent.target).parents("code"), $(e.originalEvent.target).find("code")), $obj;
                                $objects.each(function(i,el){
                                    $obj = $("#"+$(el).attr("data-keyword")+"-keyword");
                                    //if ($obj.html() == "") return false;
                                    $obj.addClass("hover");
                                });
                            },
                            mouseout: function(e){
                                var $objects = $.merge($(e.originalEvent.target), $(e.originalEvent.target).parents("code"), $(e.originalEvent.target).find("code")), $obj;
                                $objects.each(function(i,el){
                                    $obj = $("#"+$(el).attr("data-keyword")+"-keyword");
                                    //if ($obj.html() == "") return false;
                                    $obj.removeClass("hover");
                                });
                            }
                        });
                        //keywordTag = $("<div></div>",{
                        //    id: randomId + "-keyword",
                        //    class: "tagger-highlight-keyword",
                        //    "data-target": randomId,
                        //    text: ""
                        //}).on({
                        //    dblclick: function(){
                        //        $("#"+$(this).attr("data-target")).attr("data-keyword","");
                        //        $(this).remove();
                        //    }
                        //});

                        //if (children.length > 0){
                        //    $(keywordTag).appendTo($(this).parents(".playground").find(".tagger-keyword-right-panel"));
                        //    highlightTag.addClass("second");
                        //    //range.insertNode(document.createElement("br"));
                        //    range.insertNode(highlightTag.get(0));
                        //} else {
                        //    $(keywordTag).appendTo($(this).parents(".playground").find(".tagger-keyword-left-panel"));
                            highlightTag.addClass("first");
                            range.insertNode(highlightTag.get(0));
                            //range.insertNode(document.createElement("br"));
                        //}
                        sel.addRange(range);
                    }
                }
                $("#tagger-keyword-div").css({
                    left: range.getBoundingClientRect().left,
                    top: range.getBoundingClientRect().bottom
                }).show();
            }
        }).on("mousedown", function(){
            $("#tagger-keyword-div").attr("data-target", "").hide();
        }).on("paste", function(e){
            var clipboardData = (e.originalEvent || e).clipboardData.getData("text/plain");
            window.document.execCommand("insertText", false, clipboardData);
            if (clipboardData == "") return false;
            $(this).parents(".playground").next().find(".image-btn").show();
            if ($(this).find(".tagger-content").hasClass("init")){
                $(this).find(".tagger-content").html(clipboardData).removeClass("init");
                $(this).find(".tagger-loading-div").fadeOut();
                return;
            }
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection(), range;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        range = sel.getRangeAt(i);
                        range.insertNode(document.createTextNode(clipboardData));
                    }
                }
            }

            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }

            //$(this).html($(this).html());
        });
    };

}(document, jQuery));