;(function(document, $) {
    var taggerContainerClassName = "tagger-icons-container",
        taggerIconPath = {
            "cut": "/assets/images/icons/cut-24.png",
            "inverse": "/assets/images/icons/invert-selection-24.png",
            "unhighlight": "/assets/images/icons/highlight-24.png",
            "tick": "/assets/images/icons/check-24.png",
            "save": "/assets/images/icons/save-full-24.png"
        },
        keywords = ["keyword01", "keyword02", "keyword03"];

    function addTaggerIcons(target){
        var path = "";
        if (window.location.href.lastIndexOf("/") < 10) {
            path = window.location.href;
        } else {
            path = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        }
        $("<div></div>",{
            class: taggerContainerClassName,
            "data-target": target
        }).appendTo("body");

        $("<img/>",{
            class: "tagger-icon tagger-icon-cut",
            title: "Cut",
            src: path + taggerIconPath.cut
        }).on("click", function(){
            hideTaggerIcons();
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
            class: "tagger-icon tagger-icon-inverse",
            title: "Inverse selection",
            src: path + taggerIconPath.inverse
        }).on("click", function(){
            hideTaggerIcons();
            $("#" + $(this).parent().attr("data-target")).html(window.getSelection().getRangeAt(0).cloneContents());
        }).appendTo("."+taggerContainerClassName);

        $("<img/>",{
            class: "tagger-icon tagger-icon-unhightlight",
            title: "Unhighlight all",
            src: path + taggerIconPath.unhighlight
        }).on("click", function(){
            hideTaggerIcons();
            unhighlightAll($(this).parent().attr("data-target"));
        }).appendTo("."+taggerContainerClassName);

        $("<img/>",{
            class: "tagger-icon tagger-icon-tick",
            title: "Confirm",
            src: path + taggerIconPath.tick
        }).on("click", function(){
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
            hideTaggerIcons();

            var keyword = $("#tagger-keyword-select").val();
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection(), range, data, highlightTag;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        range = sel.getRangeAt(i);
                        data = range.extractContents();
                        highlightTag = $("<span></span>", {
                            id: "highlighted-word-" + parseInt(Math.random() * 1000000000),
                            class: "tagger-highlight-text",
                            "data-keyword": keyword,
                            html: data
                        }).prepend($("<span></span>",{
                            class: "tagger-highlight-keyword",
                            text: keyword
                        }).on({
                            click: function(){
                                $(this).addClass("selected");
                            },
                            dblclick: function(){
                                $(this).parent().attr("data-keyword","");
                                $(this).remove();
                            }
                        }));

                        range.insertNode(highlightTag.get(0));
                        range.insertNode(document.createElement("br"));

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
    }

    function showTaggerIcons(posX, posY){
        $(".tagger-icons-container").css({
            left: posX,
            top: posY
        }).show();
    }

    function hideTaggerIcons(){
        $(".tagger-icons-container").hide();
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
        if ($(".tagger-icons-container").length == 0){
            addTaggerIcons($(this).attr("id"));
        }
        return this.on("mouseup", function(event) {
            if (window.getSelection().toString() == "")return false;
            var top = event.originalEvent.clientY - 60<0?event.originalEvent.clientY + 60:event.originalEvent.clientY - 60;
            var left = event.originalEvent.clientX + parseInt($(".tagger-icons-container").css("width")) + 20>parseInt(window.scrollX + window.innerWidth)?window.scrollX+window.innerWidth-parseInt($(".tagger-icons-container").css("width")-20):event.originalEvent.clientX;
            showTaggerIcons(left, top);
            //showTaggerIcons($(this).css("left"), $(this).css("top"));
        }).on("mousedown", function(){
            hideTaggerIcons();
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