;(function(document, $) {
    var taggerContainerClassName = "tagger-icons-container",
        randomValue = "qu8SyShOm1nLyo3UCYxnv5o3IJXNeI34",
        taggerIconPath = {
            "cut": "/assets/images/icons/cut-24.png",
            "inverse": "/assets/images/icons/invert-selection-24.png",
            "unhighlight": "/assets/images/icons/highlight-24.png",
            "tick": "/assets/images/icons/check-24.png",
            "save": "/assets/images/icons/save-full-24.png"
        };

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
                        //console.log($(data).children().find("img"));
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
            hideTaggerIcons();

            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection(), range, data, highlightTag;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        range = sel.getRangeAt(i);
                        data = range.extractContents();
                        highlightTag = $("<code></code>", {
                            id: "highlighted-word-" + parseInt(Math.random() * 1000000000),
                            class: "tagger-highlight-text",
                            html: data
                        }).prepend($("<img/>",{
                            class: "tagger-highlight-save-icon",
                            src: "." + taggerIconPath.save
                        }).on({
                            click: function(){
                                $(this).addClass("selected");
                            },
                            dblclick: function(){
                                $(this).remove();
                            }
                        }));

                        range.insertNode(highlightTag.get(0));

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

        }).appendTo("."+taggerContainerClassName);
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