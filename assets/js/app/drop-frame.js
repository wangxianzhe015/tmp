var dndCanvas = new fabric.CanvasEx("drop-canvas");
var dropObj = null;
var radius = 50;
var border = 2;
var effectDepth = 2;
var elementColor = "rgba(255,255,255,.8)";
var bLineCircleOpacity = 1;

dndCanvas.selectionColor = 'rgba(0,0,0,0)';
dndCanvas.selectionBorderColor = 'white';
dndCanvas.selectionLineWidth = 2;
dndCanvas.selectionDashArray = [5, 5];

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
    })
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
            }
            break;
    }
}

function addNewElement(id, objClass, objText){
    if (objClass == "circle"){
        var circle1 = new fabric.Circle({radius: Math.sqrt(3) * (radius - border / 2) / 2, fill: elementColor, opacity:.5});

        var text1 = new fabric.Text('Anant Jadhav ANANT dfds sdss sd dfd dfds sdss sd dfd ANANT dfds sdss dfdffsd ', {
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
    } else if (objClass == "hexagon"){
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
            fill: 'black',
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

    dndCanvas.add(element);
    dndCanvas.add(newPoint);
    element.bringForward();
    newPoint.bringForward();
    element.newPoint = newPoint;
    newPoint.master = element;

    return element;
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
