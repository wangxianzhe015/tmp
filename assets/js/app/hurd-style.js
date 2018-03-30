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
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [5, 5]
    });

    addBackgroundTextBox(200, 200, dummyText, 200, 200, "VagRounded", 10);
    addBackgroundTextBox(300, 250, dummyText, 200, 200, "SanFrancisco", 8);
    addBackgroundTextBox(250, 300, dummyText, 200, 200, "SanFrancisco", 12);

    addDividerTextBox(930, 200, dummyText, 200, 200, "VagRounded", 10);
    addDividerTextBox(930, 350, dummyText, 200, 200, "VagRounded", 10);

    addCrosshairLine("vertical", 150, "thin");
    addCrosshairLine("vertical", 180, "thin");
    addCrosshairLine("vertical", 210, "thin");
    addCrosshairLine("vertical", 900, "thin");
    addCrosshairLine("vertical", 950, "thin");
    addCrosshairLine("horizontal", 500, "thin");
    addCrosshairLine("vertical", 400);
    addCrosshairLine("horizontal", 550);

    canvas.add(rect1, rect2);
    canvas.add(dashedBox1, dashedBox2);

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

function addCrossPoints(crosshairLine) {
    canvas.forEachObject(function(obj){
        if (obj.class == "crosshair-line" && obj.category != crosshairLine.category && (crosshairLine.intersectsWithObject(obj) || obj.intersectsWithObject(crosshairLine)) && crosshairLine.intersectLines.indexOf(obj.id) < 0){
            var circle = new fabric.Circle({radius: 8, stroke: '#DDD', strokeWidth: 1, fill: 'transparent', opacity:.3});
            var point = new fabric.Circle({radius: 2, fill: '#DDD', opacity:.5, left: 6, top: 6});
            var crossPoint = new fabric.Group([circle, point], {
                selectable: false,
                originX: "center",
                originY: "center",
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
        hasBorders: false,
        class: "tickbox",
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [1, 2]
    });

    var boundaryText1 = new fabric.IText("This is top boundary text. Double-click and edit text.", {
        fontSize: 10,
        left: x1,
        top: y1 - 15,
        width: tickBox.width + 20,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: true,
        class: 'boundary-text',
        opacity: 0,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText2 = new fabric.IText("This is right boundary text. Double-click and edit text.", {
        fontSize: 10,
        left: x2 + 15,
        top: y1,
        angle: 90,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: true,
        class: 'boundary-text',
        opacity: 0,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText3 = new fabric.IText("This is left boundary text. Double-click and edit text.", {
        fontSize: 10,
        left: x1 - 15,
        top: y2,
        angle: -90,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: true,
        class: 'boundary-text',
        opacity: 0,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText4 = new fabric.IText("This is bottom boundary text. Double-click and edit text.", {
        fontSize: 10,
        top: y2 + 5,
        textAlign: "right",
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: true,
        class: 'boundary-text',
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

    tickBoxes.push(tickBox);

    canvas.add(boundaryText1, boundaryText2, boundaryText3, boundaryText4, tickBox);
    tickBox.sendToBack();
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
}

function addBackgroundTextBox(x1, y1, text, width, height, fontName, fontSize) {
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

    formatted.backgroundBox = backRect;
    canvas.add(backRect, formatted);
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