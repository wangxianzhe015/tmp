function addHurdStyle(){
    var dummyText = "Lorem Ipsum is simply dummy text of the \n" +
        "printing and typesetting industry. Lorem Ipsum \n" +
        "has been the industrys standard dummy text \n" +
        "ever since the 1500s\n" +
        "Lorem Ipsum is simply dummy text of the \n" +
        "printing and typesetting industry. Lorem Ipsum \n" +
        "has been the industrys standard dummy text \n" +
        "ever since the 1500s\n" +
        "Lorem Ipsum is simply dummy text of the \n" +
        "printing and typesetting industry. Lorem Ipsum \n" +
        "has been the industrys standard dummy text \n" +
        "ever since the 1500s";

    var rect1 = new fabric.Rect({
        top: 400,
        left: 1000,
        width: 250,
        height: 250,
        fill: '#DDD',
        selectable: false,
        //strokeWidth: 1,
        //stroke: '#EEE',
        opacity:.2
    });

    var rect2 = new fabric.Rect({
        top: 0,
        left: 1000,
        width: 200,
        height: 150,
        fill: '#DDD',
        selectable: false,
        //strokeWidth: 1,
        //stroke: '#EEE',
        opacity:.2
    });

    var dashedBox1 = new fabric.Rect({
        top: 520,
        left: 500,
        width: 100,
        height: 100,
        class: "dashedbox",
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [5, 5]
    });

    var dashedBox2 = new fabric.Rect({
        top: 520,
        left: 610,
        width: 100,
        height: 100,
        class: "dashedbox",
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [5, 5]
    });

    //addBackgroundTextBox(200, 200, dummyText, 200, 200, "VagRounded", 10);
    //addBackgroundTextBox(300, 250, dummyText, 200, 200, "SanFrancisco", 8);
    //addBackgroundTextBox(250, 300, dummyText, 200, 200, "SanFrancisco", 12);

    drawTickBox(200, 200, 500, 500);

    //addDividerTextBox(930, 200, dummyText, 200, 200, "VagRounded", 10);
    //addDividerTextBox(930, 350, dummyText, 200, 200, "VagRounded", 10);

    addCrosshairLine("vertical", 150, "thin");
    addCrosshairLine("vertical", 180, "thin");
    addCrosshairLine("vertical", 210, "thin");
    addCrosshairLine("vertical", 900, "thin");
    addCrosshairLine("vertical", 950, "thin");
    addCrosshairLine("horizontal", 500, "thin");
    addCrosshairLine("vertical", 400);
    addCrosshairLine("horizontal", 550);

    canvas.add(rect1, rect2);
    //canvas.add(dashedBox1, dashedBox2);

    canvas.renderAll();
}

function addCrosshairLine(direction, offset, type){
    type = type==undefined?"cross":type;
    var tempTextObj = new fabric.Text("+ ", {
        fontSize: 12,
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });
    var unitWidth = tempTextObj.width, unitHeight = tempTextObj.height;
    var count = 600 / unitWidth;
    //if (direction == "vertical"){
    //    count = canvas.height / unitWidth;
    //} else {
    //    count = canvas.width / unitWidth;
    //}

    var text = "";
    for (var i = 0; i < count; i ++){
        text += "+ ";
    }

    var crosshairText = new fabric.Text(text, {
        fontSize: 12,
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold',
        opacity: type=="cross"?0.5:0
    });

    //var thinLine = new fabric.Line([0, unitHeight / 2, direction=="vertical"?canvas.height:canvas.width, unitHeight / 2], {
    var thinLine = new fabric.Line([0, unitHeight / 2, 600, unitHeight / 2], {
        fill: '',
        stroke: '#DDD',
        strokeWidth: .5,
        opacity: type=="cross"?0:0.5,
        selectable: false,
        objectCaching: false,
        perPixelTargetFind: true
    });

    var crosshairLine = new fabric.Group([crosshairText, thinLine], {
        id: "crosshair-line-" + parseInt(Math.random() * 10000000000000000000),
        selectable: false,
        hasRotatingPoint: false,
        class: "crosshair-line",
        crossPoints: [],
        intersectLines: [],
        hoverCursor: "pointer"
    });

    crosshairLine.setControlsVisibility({
        mt: false,
        mb: false,
        ml: true,
        mr: true,
        tr: false,
        tl: false,
        br: false,
        bl: false
    });

    if (direction == "vertical"){
        crosshairLine.set({
            category: "vertical",
            top: 0,
            left: offset,
            angle: 90,
            right: crosshairLine.width
        });
    } else {
        crosshairLine.set({
            category: "horizontal",
            left: 0,
            top: offset,
            right: crosshairLine.width
        });
    }

    crosshairLine.setCoords();
    canvas.add(crosshairLine);

    addCrossPoints(crosshairLine);
}

function changeCrosshairLine(object){
    var target = object.target;
    if (target != null){
        //var text = targetHudLine.text;
        //if (text.indexOf("+") > -1){
        //    targetHudLine.text = text.replace(/[+\s]/g, "--");
        //} else {
        //    targetHudLine.text = text.replace(/[-]{2}/g, "+ ");
        //}
        if (target._objects[0].opacity == 0) {
            target._objects[0].opacity = 0.5;
            target._objects[1].opacity = 0;
            target.crossPoints.forEach(function(point){
                point.set("opacity", Math.min(point.verticalLine._objects[1].opacity, point.horizontalLine._objects[1].opacity));
            });
        } else {
            target._objects[0].opacity = 0;
            target._objects[1].opacity = 0.5;
            target.crossPoints.forEach(function(point){
                point.set("opacity", Math.min(point.verticalLine._objects[1].opacity, point.horizontalLine._objects[1].opacity));
            });
        }
        canvas.remove(object);
        target.changeButton = null;
    }
}

function addCrossPoints(crosshairLine) {
    canvas.forEachObject(function(obj){
        if (obj.class == "crosshair-line" && obj.category != crosshairLine.category && (crosshairLine.intersectsWithObject(obj) || obj.intersectsWithObject(crosshairLine)) && crosshairLine.intersectLines.indexOf(obj.id) < 0){
            var circle = new fabric.Circle({radius: 8, stroke: '#DDD', strokeWidth: 1, fill: 'transparent', opacity:.3});
            var point = new fabric.Circle({radius: 2, fill: '#DDD', opacity:.5, left: 6, top: 6});
            var crossPoint = new fabric.Group([circle, point], {
                selectable: false,
                originX: "center",
                originY: "center",
                class: "cross-point",
                opacity: Math.min(obj._objects[1].opacity, crosshairLine._objects[1].opacity)
            });
            if (obj.category == "vertical") {
                crossPoint.set({
                    left: obj.left - obj.height / 2,
                    top: crosshairLine.top + crosshairLine.height / 2,
                    verticalLine: obj,
                    horizontalLine: crosshairLine
                });
            } else {
                crossPoint.set({
                    left: crosshairLine.left - crosshairLine.height / 2,
                    top: obj.top + obj.height / 2,
                    verticalLine: crosshairLine,
                    horizontalLine: obj
                });
            }
            obj.crossPoints.push(crossPoint);
            obj.intersectLines.push(crosshairLine.id);
            crosshairLine.crossPoints.push(crossPoint);
            crosshairLine.intersectLines.push(obj.id);
            canvas.add(crossPoint);
        }
    });
}

function crossPointHandler(cLine){
    var vLine, hLine;
    cLine.crossPoints.forEach(function(point){
        vLine = point.verticalLine;
        hLine = point.horizontalLine;
        if (vLine.intersectsWithObject(hLine) || hLine.intersectsWithObject(vLine)){
            point.set({
                left: vLine.left - vLine.height / 2,
                top: hLine.top + hLine.height / 2
            });
            point.setCoords();
        } else {
            if (vLine.intersectLines.indexOf(hLine.id) > -1) {
                $.each(vLine.crossPoints, function (i, p) {
                    if (point == p) {
                        delete vLine.crossPoints[i];
                    }
                });
                $.each(hLine.crossPoints, function (i, p) {
                    if (point == p) {
                        delete hLine.crossPoints[i];
                    }
                });
                delete vLine.intersectLines[vLine.intersectLines.indexOf(hLine.id)];
                delete hLine.intersectLines[hLine.intersectLines.indexOf(vLine.id)];
                canvas.remove(point).renderAll();
            }
        }
    });
    addCrossPoints(cLine);
}

function drawTickBox(x1, y1, x2, y2){
    var tickBox = new fabric.Rect({
        left: x1,
        top: y1,
        width: x2 - x1,
        height: y2 - y1,
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

    addBoundary(x1, y1, x2, y2, tickBox);

    canvas.add(tickBox);
    tickBox.sendToBack();
}

/**
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param tickBox
 * @param text1 is text of TOP boundary
 * @param text2 is text of RIGHT boundary
 * @param text3 is text of LEFT boundary
 * @param text4 is text of BOTTOM boundary
 */
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

    canvas.add(boundaryText1, boundaryText2, boundaryText3, boundaryText4);
}

function addDividerTextBox(x1, y1, text, width, height, fontName, fontSize){
    text = text==undefined?"Edit text":text;
    width = width==undefined?200:width;
    height = height==undefined?200:height;
    fontName = fontName==undefined?"VagRounded":fontName;
    fontSize = fontSize==undefined?12:fontSize;
    var textBox = new fabric.IText(text, {
        fontSize: fontSize,
        lineHeight: 1,
        fill: 'white',
        fontFamily: fontName,
        fontWeight: 'bold'
    });

    var formatted = wrapCanvasText(textBox, canvas, width, height, 'left');

    formatted.set({
        left: x1 + 10,
        top: y1 + 10,
        id: "default-textbox-" + parseInt(Math.random() * 10000),
        class: "divider-textbox",
        hasRotatingPoint: false,
        hasBorders: false,
        hasControls: false,
        lineHeight: 1,
        fill: 'white',
        opacity: .5
    });

    var backRect = new fabric.Rect({
        top: y1,
        left: x1,
        width: formatted.width + 20,
        height: formatted.height + 20,
        strokeDashArray: [formatted.width + 20, formatted.height + 20],
        class: "divider-textbox-back",
        fill: 'transparent',
        selectable: false,
        strokeWidth: 1,
        stroke: '#EEE',
        opacity: .4
    });

    formatted.backgroundBox = backRect;

    canvas.add(backRect, formatted);

    return formatted;
}

function addBackgroundTextBox(x1, y1, obj, width, height, fontName, fontSize) {
    var text = [];
    text['simple'] = obj!=undefined?obj['simple']!=undefined?obj['simple']:"Not found":"No words!";
    text['full'] = obj!=undefined?obj['full']!=undefined?obj['full']:"Edit Text":"Edit text";
    var mode = $("#json-object-toggle-btn").data("mode");
    width = width==undefined?200:width;
    height = height==undefined?500:height;
    fontName = fontName==undefined?"VagRounded":fontName;
    fontSize = fontSize==undefined?12:fontSize;
    var textBox = new fabric.IText(text[mode], {
        fontSize: fontSize,
        lineHeight: 1,
        fill: 'white',
        fontFamily: fontName,
        fontWeight: 'bold'
    });

    var formatted = wrapCanvasText(textBox, canvas, width, height, 'left');

    formatted.set({
        left: x1 + 10,
        top: y1 + 10,
        id: "default-textbox-" + parseInt(Math.random() * 10000),
        class: "background-textbox",
        hasRotatingPoint: false,
        hasControls: false,
        hasBorders: false,
        lineHeight: 1,
        fill: 'white',
        opacity: .5,
        fontFamily: fontName,
        fontWeight: 'bold'
    });

    var backRect = new fabric.Rect({
        top: y1,
        left: x1,
        width: formatted.width + 20,
        height: formatted.height + 20,
        rx: 5,
        ry: 5,
        fill: '#333',
        selectable: false,
        //strokeWidth: 1,
        //stroke: '#EEE',
        opacity:.4
    });

    formatted.set({
        simpleText: text['simple'],
        fullText: text['full'],
        backgroundBox: backRect
    });
    canvas.add(backRect, formatted);

    return formatted;
}

function drawTextboxFromPgJSON(start, end){
    removeAllTextbox();
    if (pgJsonObjects == null) return;
    var left = 50, top = 50, count = 0, firstValue = "", obj = [], i, j;
    for (i = start; i <= end; i ++){
        if (pgJsonObjects[i] && pgJsonObjects[i].hasOwnProperty('text_found') && pgJsonObjects[i]['text_found'] == 1) {
            obj['simple'] = pgJsonObjects[i]['simple_text'];
        }
        for (j in pgJsonObjects[i]) {
            if (j != 'simple_text') {
                if (pgJsonObjects[i].hasOwnProperty(j)) {
                    if (count == 0) {
                        firstValue = pgJsonObjects[i][j];
                        obj['full'] = pgJsonObjects[i][j];
                    } else {
                        obj['full'] = obj['full'] + ", " + pgJsonObjects[i][j];
                    }
                }
                count++;
            }
        }
        var box = addBackgroundTextBox(left, top, obj, 200, 500);
        count = 0;
        obj = [];
        left += 250;
        if (left > window.innerWidth * 2) {
            left = 50;
            top += 250;
        }
        if (top > window.innerHeight * 2) {
            left = 25;
            top = 25;
        }
        //box.id = obj.split(",")[0];
        box.id = firstValue;
        var $listObj = $("#json-object-id-list");
        $listObj.val($listObj.val() + box.id + "\n");
    }
}

function removeAllTextbox(){
    var objects = canvas.getObjects();
    for (var i = objects.length - 1; i >= 0; i --) {
        if (objects[i] != null && objects[i].class == "background-textbox") {
            canvas.remove(objects[i].backgroundBox);
            canvas.remove(objects[i]);
        }
        if (objects[i] != null && objects[i].class == "textbox-group") {
            var boxes = objects[i]._objects;
            for ( var j = 0; j < boxes.length; j ++ ) {
                canvas.remove(boxes[j].backgroundBox);
            }
            canvas.remove(objects[i]);
        }
    }
}

function addTextboxGroup(array, left, top){
    var objects = [], box, level = 0, perRow = parseInt((canvas.width - left) / 250);
    for (var i = 0; i < array.length; i ++ ) {
        box = addBackgroundTextBox(250 * (i % perRow), level * 250, array[i]);
        objects[i] = box;
        canvas.remove(box);
    }
    canvas.add(new fabric.Group(objects, {
        class: "textbox-group",
        left: left,
        top: top,
        originX: "center",
        originY: "center",
        hasControls: false,
        hasRotatingPoint: false,
        perPixelTargetFind: true
    }));
    for (var i = 0; i < objects.length; i ++){
        box = objects[i];
        box.backgroundBox.set({
            left: left + box.left - 10,
            top: top + box.top - 10
        });
    }
    canvas.renderAll();
}

function addTextGroupNameButton(value){
    var groupName = value.toLowerCase().replace(" ", "-");
    var $container = $("#json-object-button-container");
    if ($container.find(".json-group-btn.json-group-" + groupName).length == 0) {
        $("<button></button>", {
            class: "normal-btn json-group-btn json-group-" + groupName,
            text: value
        }).data({
            originName: value
        }).on({
            mouseover: function(){
                var $that = $(this);
                setTimeout(function(){
                    $that.prop("contentEditable", true).click();
                }, 1000);
            },
            mouseleave: function(){
                $(this).attr("contentEditable", false);
            },
            keyup: function(e){
                e.preventDefault();
                if ($("#group-name-change-btn").length > 0) return;
                $("<button></button>", {
                    id: "group-name-change-btn",
                    class: "confirm",
                    text: "Confirm"
                }).css({
                    left: $(this).offset().left,
                    top: $(this).offset().top - 30,
                    position: "absolute"
                }).data({
                    target: $(this)
                }).on("click", function(){
                    var $target = $(this).data("target"), $loader = $(".loader-container");
                    $loader.fadeIn();
                    changeTextGroupName($target);
                    $loader.fadeOut();
                    $(this).remove();
                }).appendTo("body");
            },
            click: function() {
                if ($(this).prop("contentEditable")) return;
                var objects = [], check;
                for (var i = 0; i < pgJsonObjects.length; i++) {
                    check = false;
                    $.each(pgJsonObjects[i], function (key) {
                        if (key == pgJsonGroupKey) {
                            check = true;
                        }
                    });
                    if (check) {
                        objects.push(pgJsonObjects[i]);
                    }
                }
                addTextboxGroup(objects, 50, 0);
            }
        }).appendTo($container);
    }

}

function changeTextGroupName($object) {
    var originName = $object.data("originName"), changedName = $object.text();
    for (var i = 0; i < pgJsonObjects.length; i ++) {
        $.each(pgJsonObjects[i], function(key, value) {
            if (key == pgJsonGroupKey && value == originName) {
                pgJsonObjects[i][key] = changedName;
            }
        });
    }
}

function addBringForwardButton(x, y, parent){
    fabric.Image.fromURL("assets/images/icons/external-24.png", function(oImg) {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: buttonSize,
            height: buttonSize,
            fill: buttonColor,
            strokeWidth: 2
        });
        // scale image down, and flip it, before adding it onto canvas
        oImg.set({left: 0, top: 0, angle: 0});
        var bringButton = new fabric.Group([rect, oImg], {
            left: x,
            top: y,
            id: 'textbox-bring-button',
            class: 'button',
            isTemporary: true,
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        parent.bringButton = bringButton;
        bringButton.master = parent;

        canvas.add(bringButton);
        setTimeout(function(){
            canvas.remove(bringButton);
            delete bringButton.master.bringButton;
            canvas.renderAll();
        }, 2000);
    });

}

function addCloseButton(x, y, parent){
    fabric.Image.fromURL("assets/images/icons/remove-24.png", function(oImg) {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: buttonSize,
            height: buttonSize,
            fill: buttonColor,
            strokeWidth: 2
        });
        // scale image down, and flip it, before adding it onto canvas
        oImg.set({left: 0, top: 0, angle: 0, scaleX: 0.6, scaleY: 0.6});
        var closeButton = new fabric.Group([rect, oImg], {
            left: x,
            top: y,
            id: 'textbox-close-button',
            class: 'button',
            isTemporary: true,
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        parent.closeButton = closeButton;
        closeButton.master = parent;

        canvas.add(closeButton);
        setTimeout(function(){
            canvas.remove(closeButton);
            delete closeButton.master.closeButton;
            canvas.renderAll();
        }, 2000);
    });

}

function addTickButton(x, y, parent){
    fabric.Image.fromURL("assets/images/icons/check-24.png", function(oImg) {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: buttonSize,
            height: buttonSize,
            fill: buttonColor,
            strokeWidth: 2
        });
        // scale image down, and flip it, before adding it onto canvas
        oImg.set({left: 0, top: 0, angle: 0});
        var tickButton = new fabric.Group([rect, oImg], {
            left: x,
            top: y,
            id: 'textbox-tick-button',
            class: 'button',
            isTemporary: true,
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        parent.tickButton = tickButton;
        tickButton.master = parent;

        canvas.add(tickButton);
        setTimeout(function(){
            canvas.remove(tickButton);
            delete tickButton.master.tickButton;
            canvas.renderAll();
        }, 2000);
    });

}

function addConvertButton(x, y, parent){
    fabric.Image.fromURL("assets/images/icons/recycle-24.png", function(oImg) {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: buttonSize,
            height: buttonSize,
            fill: buttonColor,
            strokeWidth: 2
        });
        // scale image down, and flip it, before adding it onto canvas
        oImg.set({left: 0, top: 0, angle: 0});
        var convertButton = new fabric.Group([rect, oImg], {
            left: x,
            top: y,
            id: 'textbox-convert-button',
            class: 'button',
            isTemporary: true,
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        parent.tickButton = convertButton;
        convertButton.master = parent;

        canvas.add(convertButton);
        setTimeout(function(){
            canvas.remove(convertButton);
            delete convertButton.master.convertButton;
            canvas.renderAll();
        }, 2000);
    });

}


function textboxTickHandler(object, dBox) {
    if (object.master.bringButton != null) {
        canvas.remove(object.master.bringButton);
    }
    if (object.master.closeButton != null) {
        canvas.remove(object.master.closeButton);
    }
    var idTag;
    if (object.master.class == "textbox-group") {
        var boxes = object.master._objects;
        for (var j = 0; j < boxes.length; j ++) {
            idTag = new fabric.IText(boxes[j].id, {
                left: boxes[j].left + object.left,
                top: boxes[j].top + object.top,
                lineHeight: 1,
                fill: 'white',
                fontSize: 12,
                fontFamily: 'SanFransisco',
                hasRotatingPoint: false,
                hasControls: false
            });
            canvas.add(idTag);
            if (dBox != null) {
                idTag.animate({
                    top: dBox.top + Math.random() * (dBox.height - idTag.height),
                    left: dBox.left + Math.random() * (dBox.width - idTag.width)
                }, {
                    duration: 2000,
                    onChange: canvas.renderAll.bind(canvas),
                    easing: fabric.util.ease.easeOutCirc
                });
            }
            canvas.remove(boxes[j].backgroundBox).renderAll();
        }
        canvas.remove(object.master, object);
    } else if (object.master.class == "background-textbox" || object.master.class == "divider-textbox") {
        idTag = new fabric.IText(object.master.id, {
            left: object.left,
            top: object.top,
            lineHeight: 1,
            fill: 'white',
            fontSize: 12,
            fontFamily: 'SanFransisco',
            hasRotatingPoint: false,
            hasControls: false
        });
        canvas.add(idTag);
        if (dBox != null) {
            idTag.animate({
                top: dBox.top + Math.random() * (dBox.height - idTag.height),
                left: dBox.left + Math.random() * (dBox.width - idTag.width)
            }, {
                duration: 2000,
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease.easeOutCirc
            });
        }
        canvas.remove(object.master.backgroundBox, object.master, object).renderAll();
    }

}

function saveLineAndBox(name){
    var objects = [], jsonData;
    canvas.forEachObject(function(obj){
        if (obj.class == "crosshair-line") {
            jsonData = obj.toJSON("selectable", "hasControls", "hasRotatingPoint");
            jsonData.class = obj.class;
            jsonData.category = obj.category;
            jsonData.id = obj.id;
            objects.push(jsonData);
        } else if (obj.class == "tickbox") {
            jsonData = obj.toJSON("class");
            jsonData.topText = obj.topText.text;
            jsonData.bottomText = obj.bottomText.text;
            jsonData.leftText = obj.leftText.text;
            jsonData.rightText = obj.rightText.text;
            objects.push(jsonData);
        }
    });
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "save-line",
            "objects": JSON.stringify(objects),
            "fileName": name
        },
        success: function(res){
            $("#save").fadeOut();
            $("body").css("overflow","auto");
            alert('Success', res);
        },
        complete: function(){
            $(".loader-container").hide();
        }
    });
}

function loadLineFileNames(){
    $(".loader-container").show();
    $("#load-target").val("line");
    $("label[for='load-file-name']").text("Choose Name");
    $(".load-extra-option").hide();
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-line-file-names"
        },
        success: function(res){
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
            $("#load").fadeIn();
        },
        complete: function(){
            $(".loader-container").hide();
        }
    });
}

function loadLineAndBox(file){
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-line",
            "fileName": file
        },
        success: function(res){
            var objects = $.parseJSON(res);
            var currentObjects = canvas.getObjects();
            for (var i = currentObjects.length - 1; i >= 0; i --) {
                if (currentObjects[i] != null && (currentObjects[i].class == "crosshair-line" || currentObjects[i].class == "tickbox" || currentObjects[i].class == "cross-point" || currentObjects[i].class == "boundary-text")) {
                    canvas.remove(currentObjects[i]);
                }
            }
            fabric.util.enlivenObjects(objects, function(objs) {
                var origRenderOnAddRemove = canvas.renderOnAddRemove;
                canvas.renderOnAddRemove = false;

                objs.forEach(function(o) {
                    canvas.add(o);
                    if (o.class == "crosshair-line") {
                        o.set({
                            selectable: false,
                            hasRotatingPoint: false,
                            crossPoints: [],
                            intersectLines: [],
                            hoverCursor: "pointer"
                        });
                        o.setControlsVisibility({
                            mt: false,
                            mb: false,
                            ml: true,
                            mr: true,
                            tr: false,
                            tl: false,
                            br: false,
                            bl: false
                        });
                        addCrossPoints(o);
                    } else if (o.class == "tickbox") {
                        o.set({
                            selectable: true,
                            hasRotatingPoint: false,
                            cornerSize: 7,
                            hasBorders: false
                        });
                        addBoundary(o.left, o.top, o.left + o.width, o.top + o.height, o, o.topText, o.bottomText, o.leftText, o.rightText);
                    }
                });

                canvas.renderOnAddRemove = origRenderOnAddRemove;
                canvas.renderAll();
            });
            $("#load").fadeOut();
            $("body").css("overflow","auto");
        },
        complete: function(){
            hideSpinner();
        }
    });
}
