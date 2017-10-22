;(function(document, $) {
    var taggerContainerClassName = "tagger-icons-container",
        taggerIconPath = {
            "cut": "./assets/images/icons/cut-24.png",
            "unhighlight": "./assets/images/icons/highlight-24.png",
            "tick": "./assets/images/icons/check-24.png"
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
        }).appendTo("."+taggerContainerClassName);

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
        }).appendTo("."+taggerContainerClassName);

        $("<div></div>", {
            id: "tagger-keyword-div"
        }).appendTo("." + taggerContainerClassName);

        $("<select></select>", {
            id: "tagger-keyword-select"
        }).appendTo("#tagger-keyword-div");

        keywords.forEach(function(word){
            $("<option></option>", {
                value: word,
                text: word
            }).appendTo("#tagger-keyword-select");
        });

        $("<button></button>", {
            id: "tagger-keyword-set-btn",
            class: "btn",
            text: "Set"
        }).on("click", function(){
            $("#tagger-keyword-div").hide();

            var keyword = $("#tagger-keyword-select").val();
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection(), range, data, children, highlightTag, keywordTag, isSecond = false;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        range = sel.getRangeAt(i);
                        data = range.cloneContents();
                        children = $(data).children();
                        children.each(function(i,el){
                            console.log($(el));
                            if ($(el).parents(".second").length > 0){
                                isSecond = true;
                            }
                        });
                        if (isSecond) return false;
                        range.deleteContents();
                        var randomId = "highlighted-word-" + parseInt(Math.random() * 1000000000);
                        highlightTag = $("<code></code>", {
                            id: randomId,
                            class: "tagger-highlight-text",
                            "data-keyword": keyword,
                            html: data
                        }).on({
                            click: function(){
                                $("#"+$(this).attr("id")+"-keyword").addClass("selected");
                            },
                            mouseover: function(){
                                var $obj = $("#"+$(this).attr("id")+"-keyword");
                                if (!$obj.hasClass("selected")) {
                                    $obj.show();
                                }
                            },
                            mouseleave: function(){
                                var $obj = $("#"+$(this).attr("id")+"-keyword");
                                if (!$obj.hasClass("selected")) {
                                    $obj.hide();
                                }
                            }
                        });
                        keywordTag = $("<p></p>",{
                            id: randomId + "-keyword",
                            class: "tagger-highlight-keyword",
                            "data-target": randomId,
                            text: keyword
                        }).on({
                            dblclick: function(){
                                $("#"+$(this).attr("data-target")).attr("data-keyword","");
                                $(this).remove();
                            }
                        });

                        if (children.length > 0){
                            $(keywordTag).appendTo($(this).parents(".tagger-icons-container").next().find(".tagger-keyword-right-panel"));
                            highlightTag.addClass("second");
                            //range.insertNode(document.createElement("br"));
                            range.insertNode(highlightTag.get(0));
                        } else {
                            $(keywordTag).appendTo($(this).parents(".tagger-icons-container").next().find(".tagger-keyword-left-panel"));
                            highlightTag.addClass("first");
                            range.insertNode(highlightTag.get(0));
                            //range.insertNode(document.createElement("br"));
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
                    }
                }
            }

        }).appendTo("#tagger-keyword-div");

        $("<button></button>", {
            text: "Cancel",
            class: "btn"
        }).on("click", function(){
            $("#tagger-keyword-div").hide();
        }).appendTo("#tagger-keyword-div");
    }

    function unhighlightAll(target){
        var $obj = $("#" + target);
        $obj.find(".tagger-highlight-save-icon").remove();
        $obj.find("br").remove();
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

    $.fn.textTagger = function(options) {
        var playground = $("<div></div>", {
            class: "playground"
        }).insertBefore($(this));

        $(this).addClass("tagger-container").appendTo(playground);

        playground.append($("<div></div>", {
            class: "tagger-keyword-right-panel"
        })).prepend($("<div></div>", {
            class: "tagger-keyword-left-panel"
        }));

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
            var hintCheck = false;
            $(".tagger-highlight-keyword").each(function(i, obj){
                if ($(obj).html() == "Hint") hintCheck = true;
            });
            if (hintCheck){
                console.log("Hint Checked!!!");
            } else {
                console.log("Hint Not Checked!!!");
                return false;
            }
            //TODO: save app
            console.log("App Save");
        })).insertAfter(playground);

        if ($(this).find(".tagger-icons-container").length == 0){
            addTaggerIcons($(this).attr("id"));
        }
        return this.on("mouseup", function(event) {
            if (window.getSelection().toString() == "")return false;
        }).on("mousedown", function(){
        }).on("paste", function(e){
            var clipboardData = (e.originalEvent || e).clipboardData.getData("text/plain");
            window.document.execCommand("insertText", false, clipboardData);

            $(this).find(".tagger-instruction").remove();
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

            $(this).html($(this).html());
        });
    };

}(document, jQuery));