;(function(document, $) {
    var taggerContainerClassName = "tagger-icons-container",
        taggerIconPath = {
            "paste": "/assets/images/icons/paste-24.png",
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
            class: "tagger-icon tagger-icon-paste",
            title: "Paste",
            src: path + taggerIconPath.paste
        }).on("click", function(){
            hideTaggerIcons();
        }).appendTo("."+taggerContainerClassName);

        $("<img/>",{
            class: "tagger-icon tagger-icon-cut",
            title: "Cut",
            src: path + taggerIconPath.cut
        }).on("click", function(){
            hideTaggerIcons();
        }).appendTo("."+taggerContainerClassName);

        $("<img/>",{
            class: "tagger-icon tagger-icon-inverse",
            title: "Inverse selection",
            src: path + taggerIconPath.inverse
        }).on("click", function(){
            hideTaggerIcons();
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
        }).appendTo("."+taggerContainerClassName);
    }

    function showTaggerIcons(posX, posY){
        var clipboardData = getClipboardData();
        if (clipboardData == ""){
            $(".tagger-icon-paste").hide();
        } else {
            $(".tagger-icon-paste").show();
        }
        $(".tagger-icons-container").css({
            left: posX,
            top: posY
        }).show();
    }

    function hideTaggerIcons(){
        $(".tagger-icons-container").hide();
    }

    function getClipboardData(){
        return "test";
    }

    function unhighlightAll(target){
        var $obj = $("#" + target);
        $obj.find(".tagger-highlight-save-icon").remove();
        $obj.find(".tagger-highlight-text").each(function(i, el){
            $(el).replaceWith($(el).html());
        });
    }

    $.fn.textTagger = function(options) {
        if ($(".tagger-icons-container").length == 0){
            addTaggerIcons($(this).attr("id"));
        }
        $(this).textillate({
            loop: false,
            initialDelay: 0,
            autoStart: true,
            in: {
                effect: 'fadeInLeftBig',
                delayScale: 1.5,
                delay: 50,
                sync: true
            },
            out: {
                effect: 'hinge',
                delayScale: 1.5,
                delay: 50,
                sync: false,
                shuffle: false,
                reverse: false,
                callback: function () {}
            }
        });
        return this.on("mouseup", function(event) {
            if (window.getSelection().toString() == "")return false;
            var top = event.originalEvent.clientY - 60<0?event.originalEvent.clientY + 60:event.originalEvent.clientY - 60;
            var left = event.originalEvent.clientX + parseInt($(".tagger-icons-container").css("width")) + 20>parseInt(window.scrollX + window.innerWidth)?window.scrollX+window.innerWidth-parseInt($(".tagger-icons-container").css("width")-20):event.originalEvent.clientX;
            showTaggerIcons(left, top);
            //showTaggerIcons($(this).css("left"), $(this).css("top"));
        }).on("mousedown", function(){
            hideTaggerIcons();
        }).on("paste", function(e){
            var selectedText = window.getSelection();
            if ( selectedText.toString() == "")return false;
            var clipboardData = (e.originalEvent || e).clipboardData.getData("text/plain");
            window.document.execCommand("insertText", false, clipboardData);

            var obj = window.getSelection().baseNode.parentNode, $obj = $(obj).parents("[class^=word]"),
                anchorOffset = selectedText.anchorOffset,
                extentOffset = selectedText.extentOffset,
                focusOffset = selectedText.focusOffset,
                wholeText = $obj.text(),
                highlightTag = $("<span></span>", {
                    id: "highlighted-word-" + parseInt(Math.random() * 1000000000),
                    class: "tagger-highlight-text",
                    html: clipboardData
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
            console.log(obj);
            console.log($obj);
            console.log(wholeText);
            $obj.html("")
                .append($("<span></span>",{
                    class: "tagger-text-hinge",
                    html: wholeText.substring(0,anchorOffset)
                }))
                .append(highlightTag)
                .append($("<span></span>",{
                    class: "tagger-text-hinge",
                    html: wholeText.substring(extentOffset > focusOffset? extentOffset:focusOffset, wholeText.length)
                }));

            $(this).textillate('out');
        });
    };

}(document, jQuery));