var dndCanvas = new fabric.CanvasEx("drop-canvas");
var dropObj = null;
var targetObj = null;
var targetBox = null;
var radius = 50;
var border = 2;
var effectDepth = 2;
var elementColor = "rgba(255,255,255,.8)";
var bLineCircleOpacity = 1;

dndCanvas.selectionColor = 'rgba(0,0,0,0)';
dndCanvas.selectionBorderColor = 'white';
dndCanvas.selectionLineWidth = 2;
dndCanvas.selectionDashArray = [5, 5];
dndCanvas.selection = false;

fabric.Object.prototype.set({
    objectCaching: false
});
fabric.Object.prototype.transparentCorners = false;

window.addEventListener("message", dragDropHandler, false);

$(document).ready(function(){
    dndCanvas.setWidth(window.innerWidth);
    dndCanvas.setHeight(window.innerHeight);

    $(document).on({
        mouseup: function(){
            if (dropObj){
                parent.postMessage({action: "object:drop"}, '*');
                dropObj = null;
            }
        }
    });

    loadFrame();
});

dndCanvas.on("object:moving", function(e){
    var object = e.target;
    if (object.class == "element"){
        object.newPoint.set({
            left: object.left,
            top: object.top - object.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
        }).setCoords();
        object.tickButton.set({
            left: object.left + object.scaleX * radius,
            top: object.top - object.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
        }).setCoords();
        if (e.e.pageX < 0 || e.e.pageX > window.innerWidth || e.e.pageY < 0 || e.e.pageY > window.innerHeight) {
            parent.postMessage({action: "object:drag", itemText: object._objects[1].text.trim(), itemClass: object.category, itemID: object.id, itemX: e.e.pageX, itemY: e.e.pageY}, '*');
            object.set({
                opacity: 0
            });
            object.newPoint.set({
                opacity: 0
            });
            object.tickButton.set({
                opacity: 0
            });
            targetObj = object;
        } else {
            parent.postMessage({action: "object:drag:cancel"}, '*');
            object.set({
                opacity: 1
            });
            object.newPoint.set({
                opacity: 1
            });
            object.tickButton.set({
                opacity: 1
            });
        }
    } else if (object.class == "tickbox") {
        object.topText.set({
            left: object.left,
            top: object.top - 15
        });
        object.rightText.set({
            left: object.left + object.scaleX * object.width + 15,
            top: object.top
        });
        object.leftText.set({
            left: object.left - 15,
            top: object.top + object.scaleY * object.height
        });
        object.bottomText.right = object.left + object.width;
        object.bottomText.set({
            left: object.bottomText.right - object.bottomText.width,
            top: object.top + object.scaleY * object.height + 5
        });
        object.topText.setCoords();
        object.rightText.setCoords();
        object.leftText.setCoords();
        object.bottomText.setCoords();
        dndCanvas.renderAll();
    }
});

dndCanvas.on("object:scaling", function(e){
    var object = e.target, event = e.e;
    if (object != null) {
        if (object.class == "tickbox"){
            object.set({
                scaleX: 1,
                scaleY: 1
            });
            if (event.pageX < object.left + object.width / 4) {
                object.set({
                    left: event.pageX,
                    width: object.width - event.movementX
                });
            } else if (event.pageX > object.left + 3 * object.width / 4) {
                object.set({
                    width: event.pageX - object.left
                })
            }
            if (event.pageY < object.top + object.height / 4) {
                object.set({
                    top: event.pageY,
                    height: object.height - event.movementY
                });
            } else if (event.pageY > object.top + 3 * object.height / 4) {
                object.set({
                    height: event.pageY - object.top
                })
            }
            object.setCoords();
            if (object.height <= 20 && object.width <= 20) {
                dndCanvas.remove(object.topText, object.rightText, object.leftText, object.bottomText, object);
            }
            dndCanvas.renderAll();
        }
    }
});

dndCanvas.on("mouse:up", function(e){
    if (targetBox != null){
        addBoundary(targetBox.left, targetBox.top, e.e.pageX, e.e.pageY, targetBox);
        targetBox = null;
        dndCanvas.renderAll();
    }
    saveFrame();
});

dndCanvas.on("mouse:down", function(e){
    var object = e.target;
    if (object != null) {
        if (object.class == "boundary-text") {
            object.set("opacity", 1);
        }
    }
});

dndCanvas.on("mouse:move", function(e){
    var event = e.e;
    if (targetBox != null){
        if (targetBox.origX > event.pageX){
            targetBox.set({
                left: event.pageX
            });
        } else {
            targetBox.set({
                left: targetBox.origX
            });
        }
        if (targetBox.origY > event.pageY){
            targetBox.set({
                top: event.pageY
            });
        } else {
            targetBox.set({
                top: targetBox.origY
            });
        }
        targetBox.set({
            width: Math.abs(event.pageX - targetBox.origX),
            height: Math.abs(event.pageY - targetBox.origY)
        }).setCoords();
        dndCanvas.renderAll();
    }
});

dndCanvas.on("mouse:dblclick", function(e){
    if (e.target == null){
        targetBox = addTickBox(e.e.pageX, e.e.pageY, 0, 0);
        targetBox.set({
            origX: e.e.pageX,
            origY: e.e.pageY
        });
        showNotification("Drag area of box.");
        setTimeout(hideNotification, 2000);
    }
});

dndCanvas.on("text:changed", function(e){
    var object = e.target;
    if (object.class == "boundary-text") {
        var newText = "";
        $.each(object._textLines, function(i, line){
            newText += line;
        });
        object.text = newText;
        dndCanvas.renderAll();

        if (object.right != null) {
            object.set("left", object.right - object.width);
            object.setCoords();
        }
    }
});

function dragDropHandler(message){
    switch (message.data.action){
        case "object:drag":
            if (dropObj == null || dropObj.id != message.data.itemID) {
                dropObj = addNewElement(message.data.itemID, message.data.itemClass, message.data.itemText);
            }
            dropObj.set({
                left: message.data.itemX,
                top: message.data.itemY
            }).setCoords();
            dropObj.newPoint.set({
                left: dropObj.left,
                top: dropObj.top - dropObj.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
            }).setCoords();
            if (dropObj.tickButton) {
                dropObj.tickButton.set({
                    left: dropObj.left + dropObj.scaleX * radius,
                    top: dropObj.top - dropObj.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
                }).setCoords();
            }
            dndCanvas.renderAll();
            break;
        case "object:drag:cancel":
            if (dropObj) {
                dndCanvas.remove(dropObj);
                dndCanvas.remove(dropObj.newPoint, dropObj.tickButton);
                dropObj = null;
            }
            break;
        case "object:drop":
            if (targetObj){
                dndCanvas.remove(targetObj);
                dndCanvas.remove(targetObj.newPoint, targetObj.tickButton);
                targetObj = null;
                saveFrame();
            }
            break;
    }
}

function saveFrame(){
    var elements = dndCanvas.getObjects(), el, info, result = [];
    for (var i = 0; i < elements.length; i ++){
        el = elements[i];
        switch (el.class){
            case "element":
                info = {
                    id: el.id,
                    class: "element",
                    category: el.category,
                    text: el._objects[1].text.trim(),
                    left: el.left,
                    top: el.top
                };
                result.push(info);
                break;
            case "tickbox":
                info = {
                    class: "tickbox",
                    left: el.left,
                    top: el.top,
                    width: el.width,
                    height: el.height,
                    leftText: el.leftText.text,
                    topText: el.topText.text,
                    rightText: el.rightText.text,
                    bottomText: el.bottomText.text
                };
                result.push(info);
                break;
        }
    }

    $.ajax({
        url: "../action.php",
        type: "POST",
        data: {
            action: "save-drop-frame",
            data: JSON.stringify(result)
        },
        success: function(res){

        }
    });
}

function loadFrame(){
    $.ajax({
        url: "../action.php",
        type: "POST",
        data: {
            action: "load-drop-frame"
        },
        success: function(res){
            if (res == "fail" || res == "no_content") return;
            dndCanvas.clear();

            var elems = $.parseJSON(res);
            $.each(elems, function(i, el){
                switch (el.class){
                    case "element":
                        var elem = addNewElement(el.id, el.category, el.text);
                        elem.set({
                            left: el.left,
                            top: el.top
                        }).setCoords();
                        break;
                    case "tickbox":
                        var tickBox = addTickBox(el.left, el.top, el.width, el.height);
                        addBoundary(el.left, el.top, el.left + el.width, el.top + el.height, tickBox, el.topText, el.rightText, el.leftText, el.bottomText);
                        break;
                }
            });
        }
    });
}

function addNewElement(id, objCategory, objText){
    if (objCategory == "circle"){
        var circle1 = new fabric.Circle({radius: Math.sqrt(3) * (radius - border / 2) / 2, fill: elementColor, opacity:.5});

        var text1 = new fabric.Text(objText, {
            fontSize: 12,
            textAlign: "center",
            left: Math.sqrt(3) * radius / 2,
            top: Math.sqrt(3) * radius / 2,
            lineHeight: 12,
            originX: "center",
            originY: "center",
            fontFamily: 'VagRounded',
            fontWeight: 'bold',
            fill: '#FFF',
            opacity:1
        });

        var formatted = wrapCanvasText(text1, dndCanvas, radius, radius, 'center');

        var element = new fabric.Group([circle1, formatted], {
            left: 7 * radius,
            top: parseInt(Math.sqrt(3) * 5 * radius / 2),
            class: 'element',
            cornerStyle: 'circle',
            cornerColor: 'white',
            cornerSize: 10,
            category: 'circle',
            originX: "center",
            originY: "center",
            id: id,
            position: '4-1',
            hasBorders: false,
            //hasControls: false,
            //hasRotatingPoint: false,
            perPixelTargetFind: true
        });
        element.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            tr: false,
            tl: false,
            br: false,
            bl: false
        });
        dndCanvas.add(element);
    } else if (objCategory == "hexagon"){
        var points = regularPolygonPoints(6, radius - border / 2);
        var myPoly = new fabric.Polygon(points, {
            stroke: 'rgba(255,255,255,.2)',
            left: 0,
            top: 0,
            strokeWidth: 0,
            strokeLineJoin: 'bevil',
            opacity:.5,
            fill: elementColor
        }, false);

        var text = new fabric.IText(objText, {
            fontSize: 12,
            //left: 30,
            //top: Math.sqrt(3) * radius / 2 - 10,
            left: radius,
            top: Math.round(Math.sqrt(3) * radius / 2),
            originX: 'center',
            originY: 'center',
            lineHeight: 1,
            fill: '#FFF',
            fontFamily: 'VagRounded',
            fontWeight: 'bold'
        });

        var formatted = wrapCanvasText(text, dndCanvas, radius, radius, 'center');

        var element = new fabric.Group([myPoly, formatted], {
            left: radius,
            top: Math.sqrt(3) * radius / 2,
            originX: "center",
            originY: "center",
            cornerStyle: 'circle',
            cornerColor: 'white',
            cornerSize: 10,
            class: 'element',
            category: 'hexagon',
            position: '0-0',
            id: id,
            hasBorders: false,
            //hasControls: false,
            //hasRotatingPoint: true,
            perPixelTargetFind: true
        });
        element.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            tr: false,
            tl: false,
            br: false,
            bl: false
        });

        dndCanvas.add(element);
    }
    fabric.Image.fromURL("../assets/images/icons/check-o-gray-16.png", function(oImg) {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: 10,
            height: 10,
            fill: 'transparent',
            strokeWidth: 2
        });
        // scale image down, and flip it, before adding it onto canvas
        oImg.set({left: 0, top: 0, width: 16, height: 16, angle: 0});
        var tickButton = new fabric.Group([rect, oImg], {
            left: element.left + radius,
            top: element.top - Math.sqrt(3) * (radius - border / 2) / 2,
            class: 'element-tick-button',
            originX: 'center',
            originY: 'center',
            checked: false,
            selectable: false,
            draggable: false,
            hoverCursor: 'pointer',
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        element.tickButton = tickButton;
        dndCanvas.add(tickButton);
    });

    var newPoint = new fabric.Circle({
        left: element.left,
        top: element.top - Math.sqrt(3) * (radius - border / 2) / 2,
        class: 'new-bezier-point',
        hoverCursor: 'pointer',
        strokeWidth: 1,
        stroke: 'white',
        radius: 3,
        originX: 'center',
        originY: 'center',
        selectable: false,
        opacity: bLineCircleOpacity,
        fill: 'transparent'
    });

    dndCanvas.add(newPoint);
    element.bringForward();
    newPoint.bringForward();
    element.newPoint = newPoint;
    newPoint.master = element;

    return element;
}

function addTickBox(left, top, width, height){
    var tickBox = new fabric.Rect({
        left: left,
        top: top,
        width: width,
        height: height,
        selectable: true,
        hasRotatingPoint: false,
        cornerSize: 7,
        hasBorders: true,
        class: "tickbox",
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [1, 2]
    });

    tickBox.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        tr: true,
        tl: true,
        br: true,
        bl: true
    });

    dndCanvas.add(tickBox);
    tickBox.sendToBack();

    return tickBox;
}

function addBoundary(x1, y1, x2, y2, tickBox, text1, text2, text3, text4) {
    text1 = text1==undefined?"Label":text1;
    text2 = text2==undefined?"Label":text2;
    text3 = text3==undefined?"Label":text3;
    text4 = text4==undefined?"Label":text4;
    var boundaryText1 = new fabric.IText(text1, {
        fontSize: 10,
        left: x1,
        top: y1 - 15,
        width: tickBox.width + 20,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: false,
        class: 'boundary-text',
        category: 'top',
        opacity: 0,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText2 = new fabric.IText(text2, {
        fontSize: 10,
        left: x2 + 15,
        top: y1,
        angle: 90,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: false,
        class: 'boundary-text',
        category: 'right',
        opacity: 0,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText3 = new fabric.IText(text3, {
        fontSize: 10,
        left: x1 - 15,
        top: y2,
        angle: -90,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: false,
        class: 'boundary-text',
        category: 'left',
        opacity: 0,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText4 = new fabric.IText(text4, {
        fontSize: 10,
        top: y2 + 5,
        textAlign: "right",
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: false,
        class: 'boundary-text',
        category: 'bottom',
        opacity: 0,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    boundaryText4.set({
        left: x2 - boundaryText4.width,
        right: x2
    });

    tickBox.set({
        topText: boundaryText1,
        rightText: boundaryText2,
        leftText: boundaryText3,
        bottomText: boundaryText4
    });

    dndCanvas.add(boundaryText1, boundaryText2, boundaryText3, boundaryText4);
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

function showNotification(msg){
    $("#notification").show().find(".content").html(msg);
}

function hideNotification(){
    $("#notification").hide();
}