function modalClose(obj){
    $(obj).fadeOut();
    $("body").css("overflow","auto");
}

function alert(header, content){
    var obj = $("#alert");
    obj.find(".dialog-header").html(header);
    obj.find(".dialog-content").html(content);
    $("body").css("overflow","hidden");
    obj.fadeIn();
}

function showNotification(content){
    $("#message").html(content);
    $("#notification").show();
    setTimeout(removeNotifiation,3000);
}

function removeNotifiation(){
    $("#notification").hide();
    addingTextCell = false;
}

function wrapCanvasText(t, canvas, maxW, maxH, justify) {
    if (typeof maxH === "undefined") {
        maxH = 0;
    }
    var formatted = '';

    // This works only with monospace fonts
    justify = justify || 'left';

    // clear newlines
    var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/gm," ");
    var words = sansBreaks.split(" ");
    // calc line height
    var lineHeight = parseInt(new fabric.Text(sansBreaks, {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize
    }).height);

    // adjust for vertical offset
    var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
    var context = canvas.getContext("2d");


    context.font = t.fontSize + "px " + t.fontFamily;
    var currentLine = '';
    var breakLineCount = 0;

    n = 0;
    while (n < words.length) {
        var isNewLine = currentLine == "";
        var testOverlap = currentLine + ' ' + words[n];

        // are we over width?
        var w = context.measureText(testOverlap).width;

        if (w < maxW) { // if not, keep adding words
            if (currentLine != '') currentLine += ' ';
            currentLine += words[n];
            // formatted += words[n] + ' ';
        } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
                var wordOverlap = "";

                // test word length until its over maxW
                for (var i = 0; i < words[n].length; ++i) {

                    wordOverlap += words[n].charAt(i);
                    var withHypeh = wordOverlap + "-";


                    if (context.measureText(withHypeh).width >= maxW) {

                        // add hyphen when splitting a word
                        withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                        // update current word with remainder
                        words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                        //formatted += withHypeh; // add hypenated word
                        currentLine += withHypeh; // add hypenated word
                        break;
                    }
                }
            }
            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
                currentLine = ' ' + currentLine;

            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
                currentLine = ' ' + currentLine + ' ';

            formatted += currentLine + '\n';
            breakLineCount++;
            currentLine = "";

            continue; // restart cycle
        }
        if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            currentLine = "";
            break;
        }
        n++;
    }

    if (currentLine != '') {
        while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
            currentLine = ' ' + currentLine;

        while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
            currentLine = ' ' + currentLine + ' ';

        formatted += currentLine + '\n';
        breakLineCount++;
        currentLine = "";
    }

    // get rid of empy newline at the end
    formatted = formatted.substr(0, formatted.length - 1);

    return new fabric.IText(formatted, { // return new text-wrapped text obj
        left: t.left,
        top: t.top,
        fill: t.fill,
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        originX: t.originX,
        originY: t.originY,
        angle: t.angle

    });

}

function getWrappedCanvasText(t, canvas, maxW, maxH, justify){
    if (typeof maxH === "undefined") {
        maxH = 0;
    }
    var formatted = '';

    // This works only with monospace fonts
    justify = justify || 'left';

    // clear newlines
    var sansBreaks = t.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/gm," ");
    var words = sansBreaks.split(" ");
    // calc line height
    var lineHeight = parseInt(new fabric.Text(sansBreaks, {
        fontFamily: 'SanFrancisco',
        fontSize: 12
    }).height);

    // adjust for vertical offset
    var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
    var context = canvas.getContext("2d");


    context.font = "12px " + "SanFrancisco";
    var currentLine = '';
    var breakLineCount = 0;

    n = 0;
    while (n < words.length) {
        var isNewLine = currentLine == "";
        var testOverlap = currentLine + ' ' + words[n];

        // are we over width?
        var w = context.measureText(testOverlap).width;

        if (w < maxW) { // if not, keep adding words
            if (currentLine != '') currentLine += ' ';
            currentLine += words[n];
            // formatted += words[n] + ' ';
        } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
                var wordOverlap = "";

                // test word length until its over maxW
                for (var i = 0; i < words[n].length; ++i) {

                    wordOverlap += words[n].charAt(i);
                    var withHypeh = wordOverlap + "-";


                    if (context.measureText(withHypeh).width >= maxW) {

                        // add hyphen when splitting a word
                        withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                        // update current word with remainder
                        words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                        //formatted += withHypeh; // add hypenated word
                        currentLine += withHypeh; // add hypenated word
                        break;
                    }
                }
            }
            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
                currentLine = ' ' + currentLine;

            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
                currentLine = ' ' + currentLine + ' ';

            formatted += currentLine + '\n';
            breakLineCount++;
            currentLine = "";

            continue; // restart cycle
        }
        if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            currentLine = "";
            break;
        }
        n++;
    }

    if (currentLine != '') {
        while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
            currentLine = ' ' + currentLine;

        while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
            currentLine = ' ' + currentLine + ' ';

        formatted += currentLine + '\n';
        breakLineCount++;
        currentLine = "";
    }

    // get rid of empy newline at the end
    formatted = formatted.substr(0, formatted.length - 1);
    return formatted;
}

function regularPolygonPoints(sideCount,radius){
    var sweep=Math.PI*2/sideCount;
    var cx=radius;
    var cy=radius;
    var points=[];
    for(var i=0;i<sideCount;i++){
        var x=cx+radius*Math.cos(i*sweep);
        var y=cy+radius*Math.sin(i*sweep);
        points.push({x:x,y:y});
    }
    return(points);
}

function getObjPosition (e) {
    // Get dimensions of object
    if(e== null)
    {
        $('#imageDialog').remove();
        return false;
    }
    // We have the bounding box for rect... Now to get the canvas position
    var offset = canvas.calcOffset();
    // Do the math - offset is from $(body)
    var left,top;
    if (e.originX == "left") {
        left = offset._offset.left + e.getLeft();
    } else if (e.originX == "center"){
        left = offset._offset.left + e.getLeft() - e.getWidth() / 2;
    }
    if (e.originY == "top") {
        top = offset._offset.top + e.getTop();
    } else if (e.originY == "center"){
        top = offset._offset.top + e.getTop() - e.getHeight() / 2;
    }
    var bottom = top + e.getHeight();
    var right = left + e.getWidth();

    return {left: left, top: top, right: right, bottom: bottom};
}

function isPointInLocation(x,y,e){
    return (e.left <= x && x <= e.right && e.top <= y && y <= e.bottom);
}

function nearPosition(x, y){
    var min = canvas.width,dist;
    grid.forEach(function(point,index){

        dist = Math.sqrt(Math.pow(point.left - x, 2) + Math.pow(point.top - y, 2));
        if (dist < min){
            min = dist;
            nearPointIndex = index;
        }
    });
    return grid[nearPointIndex];
}

function saveElements(fileName){
    var data = [];
    var canvasData = {};
    canvasData.width = canvas.getWidth();
    canvasData.height = canvas.getHeight();
    canvasData.class = 'canvas';
    canvasData.backgroundColor = document.body.className;
    canvasData.elementColor = elementColor;
    canvasData.isPatternApply = $("#pattern-apply-check").prop('checked');
    canvasData.pattern = $("#background-pattern").val();
    data.push(canvasData);

    var viewData = {};
    viewData.class = 'views';
    viewData.data = views;
    data.push(viewData);

    canvas.forEachObject(function(object){
        if (object.class != 'grid' && (object.class != 'button' || !object.isTemporary)) {
            var oneData = {};
            if (object.class == 'element') {
                oneData = deconstructElement(object, true);
            } else if (object.class == 'button') {
                oneData.left = object.left;
                oneData.top = object.top;
                oneData.class = object.class;
                oneData.url = object._objects[1]._originalElement.currentSrc.split(object._objects[1]._originalElement.baseURI)[1];
            } else if (object.class == 'group') {
                oneData.left = object.left;
                oneData.top = object.top;
                oneData.class = object.class;
                oneData.expanded = object.expanded;
                var componentData = [], tempData;
                object.forEachObject(function(el){
                    tempData = deconstructElement(el,object.expanded);
                    componentData.push(tempData);
                });
                oneData.children = componentData;
            }
            oneData.id = object.id;
            data.push(oneData);
        }
    });
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "save",
            "elements": JSON.stringify(data),
            "fileName": fileName
        },
        success: function(res){
            if (currentFile == ''){
                currentFile = fileName;
            }
            $("#save").fadeOut();
            $("body").css("overflow","auto");
            alert('Success', res);
        }
    });
}

function loadElements(file){
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load",
            "fileName": file
        },
        success: function(res){
            var objects = $.parseJSON(res);
            //removeElements();
            $("#load").fadeOut();
            $("body").css("overflow","auto");
            addElements(objects);
            currentFile = file;
        }
    });
}

function loadFileNames(){
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-file-names"
        },
        success: function(res){
            $("#load").fadeIn();
            $("body").css("overflow","hidden");
            var names = $.parseJSON(res);
            $("#load-file-name").html('');
            names.forEach(function(name){
                if (name != '.' && name != '..' && name != '.gitignore') {
                    var option = document.createElement('option');
                    $(option).attr('value', name.split('.json')[0]).html(name.split('.json')[0]);
                    $("#load-file-name").append(option);
                }
            });
        }
    });
}

function eatSpace(data){
    return data.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/gm, " ");
}

function iframeHandler(e){
    var obj = $(e).contents();
    obj.find(".info").html("");

    // Callback part
    $.ajax({
        url: 'action.php',
        type: 'POST',
        data: {
            action: 'load-callback-names'
        },
        success: function(res){
            var callbacks = $.parseJSON(res);
            callbacks.forEach(function(callback){
                if (callback != '.' && callback != '..' && callback != '.gitignore') {
                    $("<div></div>",{
                        data: callback
                    }).addClass('form-control').appendTo(obj.find("#iframe-callback").find(".info"));
                }
            });
        }
    });
    // End of callback part
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
                        "data-hidden": word['hidden']
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

function makeTextFile(name,text) {
    var data = new Blob([text], {type: 'text/plain'});

    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(data, name);
    } else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(data);
        elem.download = name + ".json";
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function showLeftSidebar(){
    if (leftbar == null) {
        leftbar = $("#left-sidebar");
        leftbar.animate({left: 0});
    }
}

function hideLeftSidebar(){
    if (leftbar != null) {
        leftbar.animate({left: "-50px"});
        leftbar = null;
    }
}

function showTopSidebar(){
    if (topbar == null){
        topbar = $("#top-sidebar");
        topbar.animate({top: 0});
    }
}

function hideTopSidebar(){
    if (topbar != null){
        topbar.stop().animate({top: "-150px"});
        topbar = null;
    }
}

function showRightSidebar(){
    if (rightbar == null){
        rightbar = $("#right-sidebar");
        rightbar.animate({right: 0});
    }
}

function hideRightSidebar(){
    if (rightbar != null){
        rightbar.stop().animate({right: "-50px"});
        rightbar = null;
    }
}

function hideLoadingDiv(){
    $("#loading").fadeOut(500);
    setTimeout(function(){
        $("#pattern-tint-check").click();
    },500);
}