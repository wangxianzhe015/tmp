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

function showConfirmBox(content, next, value){
    var $obj =$("#confirm-box");
    $obj.find(".dialog-content").html(content);
    $("#confirm-next-action").val(next);
    $("#confirm-next-value").val(value);
    $obj.fadeIn();
}

function showNotification(content){
    $("#message").html(content);
    $("#notification").show();
    setTimeout(removeNotifiation,3000);
}

function removeNotifiation(){
    $("#notification").hide();
    nextAction = "";
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

    var n = 0;
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

function save(name, target){
    if (target == "element") {
        saveElements(name);
    } else if (target == "line") {
        saveLineAndBox(name);
    }
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

function loadFileNames(){
    $(".loader-container").fadeIn();
    $("#load-target").val("element");
    $("label[for='save-file-name']").text("Workspace");
    $(".load-extra-option").show();
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
        },
        complete: function(){
            $(".loader-container").fadeOut();
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

function downloadCSVFile() {
    $.ajax({
        url: 'action.php',
        type: 'POST',
        data: {
            action: 'download-csv',
            path: $("#csv-file-path").val()
        },
        success: function(r){
            console.log(r);
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

function downloadFileFromURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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