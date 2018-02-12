function drawQuadratic() {

    var p0 = makeCurveCircle(500, 300);
    canvas.add(p0);

    var p1 = makeCurveCircle(700, 300);
    canvas.add(p1);

    var p2 = makeCurveCircle(900, 300);
    canvas.add(p2);

    var p3 = makeCurveCircle(1100, 300);
    canvas.add(p3);
}

/**
 *
 * @param x
 * @param y
 * @param leftControl
 * @param rightControl
 * @returns {fabric.Circle}
 */
function makeCurveCircle(x, y) {
    var c = new fabric.Circle({
        left: x,
        top: y,
        class: 'b-circle',
        strokeWidth: 0,
        radius: Math.sqrt(3) * (radius - border / 2) / 2,
        originX: 'center',
        originY: 'center',
        perPixelTargetFind: true,
        lines: [],
        fill: elementColor,
        opacity:.5
    });

    c.hasBorders = c.hasControls = false;

    var newPoint = new fabric.Circle({
        left: x,
        top: y - Math.sqrt(3) * (radius - border / 2) / 2,
        class: 'new-bezier-point',
        hoverCursor: 'pointer',
        strokeWidth: 2,
        stroke: 'white',
        radius: 5,
        originX: 'center',
        originY: 'center',
        selectable: false,
        fill: 'transparent'
    });

    canvas.add(newPoint);
    newPoint.bringForward();
    c.newPoint = newPoint;
    newPoint.master = c;

    return c;
}

/**
 *
 * @param x
 * @param y
 * @param line
 * @returns {fabric.Circle}
 */
function makeCurvePoint(x, y, line) {
    var c = new fabric.Circle({
        left: x,
        top: y,
        class: 'b-point',
        strokeWidth: 2,
        radius: 5,
        originX: 'center',
        originY: 'center',
        fill: '#fff',
        opacity: 0,
        stroke: '#f00'
    });

    c.hasBorders = c.hasControls = false;

    c.line = line;
    line.control = c;

    return c;
}

function addBezierLine(leftElement, rightElement){
    var startX, startY, endX, endY;

    if ( leftElement instanceof jQuery){
        if (leftElement[0].tagName != "TD") return false;
        leftElement = leftElement.parents("tr");
        startX = leftElement.offset().left;
        startY = leftElement.offset().top;
    } else {
        startX = leftElement.left;
        startY = leftElement.top;
    }

    if ( rightElement instanceof jQuery ){
        if (rightElement[0].tagName != "TD") return false;
        rightElement = rightElement.parents("tr");
        endX = rightElement.offset().left;
        endY = rightElement.offset().top;
    } else {
        endX = rightElement.left;
        endY = rightElement.top;
    }

    var bLine = new fabric.Path('M ' + startX + ' ' + startY + ' Q ' + (startX + endX) / 2 + ' ' + (startY + endY) / 2 + ' ' + endX + ' ' + endY, {
        fill: '',
        stroke: 'white',
        opacity: .5,
        selectable: false,
        strokeDashArray: [7, 3],
        type: "dashed",
        class: "line",
        id: "bezier-line-" + parseInt(Math.random() * 1000000000000),
        leftElement: leftElement,
        rightElement: rightElement,
        objectCaching: false,
        perPixelTargetFind: true
    });

    canvas.add(bLine);

    var leftCircle = new fabric.Circle({
        class: 'bezier-start-point',
        hoverCursor: 'pointer',
        strokeWidth: 2,
        stroke: 'white',
        radius: 5,
        originX: 'center',
        originY: 'center',
        selectable: false,
        fill: 'transparent'
    });
    canvas.add(leftCircle);
    leftCircle.setCoords();
    bLine.leftCircle = leftCircle;
    leftCircle.master = bLine;

    var rightCircle = new fabric.Circle({
        class: 'bezier-end-point',
        hoverCursor: 'pointer',
        strokeWidth: 2,
        stroke: 'white',
        radius: 5,
        originX: 'center',
        originY: 'center',
        selectable: false,
        fill: 'transparent'
    });
    canvas.add(rightCircle);
    rightCircle.setCoords();
    bLine.rightCircle = rightCircle;
    rightCircle.master = bLine;

    var controlPoint = makeCurvePoint((startX + endX) / 2, (startY + endY) / 2, bLine);
    canvas.add(controlPoint);

    var lines;
    if ( leftElement instanceof jQuery ){
        lines = leftElement.parents(".image-tooltip").data("lines");
        lines.push(bLine);
        leftElement.parents(".image-tooltip").data("lines", lines);
    } else {
        leftElement.lines.push(bLine);
    }

    if ( rightElement instanceof jQuery ){
        lines = rightElement.parents(".image-tooltip").data("lines");
        lines.push(bLine);
        rightElement.parents(".image-tooltip").data("lines", lines);
    } else {
        rightElement.lines.push(bLine);
    }

    adjustLine(bLine);
}

function adjustLine(line){
    var control = line.control, point, distance, angle, factor = 1, tmpX, tmpY, newPoint, overlap = false, angleOffset, toggleDirection = 1, actualRadius = Math.sqrt(3) * (radius - border / 2) / 2, lines, offset, tooltipOffset, width, height;

    // Starting point
    if ( line.leftElement instanceof jQuery ) {
        if (line.leftElement.parents(".image-tooltip").hasClass("expanded")){
            point = line.leftElement;
            offset = point.offset();
            tooltipOffset = point.parents(".image-tooltip").offset();
            width = parseInt(point.parents(".image-tooltip").css("width"));
            height = parseInt(point.css("height"));
            tmpY = offset.top + height / 2;
            if (offset.left + width / 2 > line.rightCircle.left) {
                tmpX = tooltipOffset.left;
            } else {
                tmpX = tooltipOffset.left + width;
            }
            if (offset.top + height < tooltipOffset.top){
                tmpY = tooltipOffset.top;
            } else if (offset.top > tooltipOffset.top + point.parents(".image-tooltip").innerHeight()) {
                tmpY = tooltipOffset.top + point.parents(".image-tooltip").innerHeight;
            }
        } else {
            point = line.leftElement.parents(".image-tooltip");
            offset = point.offset();
            width = parseInt(point.css("width"));
            height = parseInt(point.css("height"));
            if (offset.left > control.left) {
                tmpX = offset.left;
                if (offset.top > control.top){
                    tmpY = offset.top;
                } else if (offset.top < control.top && offset.top + height > control.top){
                    tmpY = offset.top + height / 2;
                } else {
                    tmpY = offset.top + height;
                }
            } else if (offset.left < control.left && offset.left + width > control.left) {
                tmpX = offset.left + width / 2;
                if (offset.top + height / 2 > control.top){
                    tmpY = offset.top;
                } else {
                    tmpY = offset.top + height;
                }
            } else {
                tmpX = offset.left + width;
                if (offset.top > control.top){
                    tmpY = offset.top;
                } else if (offset.top < control.top && offset.top + height > control.top){
                    tmpY = offset.top + height / 2;
                } else {
                    tmpY = offset.top + height;
                }
            }
        }
        line.path[0][1] = tmpX;
        line.path[0][2] = tmpY;
        line.leftCircle.set({
            left: tmpX,
            top: tmpY
        });
        line.leftCircle.setCoords();
    } else {
        point = line.leftElement;
        distance = Math.sqrt((point.left - control.left) * (point.left - control.left) + (point.top - control.top) * (point.top - control.top));
        if (control.top < point.top) {
            factor = -1;
        }
        angle = factor * Math.atan((control.left - point.left) / (control.top - point.top));
        tmpX = control.left - (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
        tmpY = control.top - factor * (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);
        line.path[0][1] = tmpX;
        line.path[0][2] = tmpY;
        line.leftCircle.set({
            left: tmpX,
            top: tmpY
        });
        line.leftCircle.setCoords();

        newPoint = point.newPoint;
        point.lines.forEach(function (line) {
            if (line.leftCircle.intersectsWithObject(newPoint) || line.rightCircle.intersectsWithObject(newPoint)) {
                overlap = true;
                angleOffset = 0;
            }
        });
        lines = point.lines;
        while (overlap) {
            angleOffset += 5 / actualRadius;
            toggleDirection *= -1;
            newPoint.set({
                left: point.left + toggleDirection * Math.sin(angleOffset) * actualRadius,
                top: point.top - Math.cos(angleOffset) * actualRadius
            });
            newPoint.setCoords();
            overlap = false;
            lines.forEach(function (line) {
                if (line.leftCircle.intersectsWithObject(newPoint) || line.rightCircle.intersectsWithObject(newPoint)) {
                    overlap = true;
                }
            });
        }
    }

    // Ending point
    if ( line.rightElement instanceof jQuery ){
        if (line.rightElement.parents(".image-tooltip").hasClass("expanded")){
            point = line.rightElement;
            offset = point.offset();
            tooltipOffset = point.parents(".image-tooltip").offset();
            width = parseInt(point.parents(".image-tooltip").css("width"));
            height = parseInt(point.css("height"));
            tmpY = offset.top + height / 2;
            if (offset.left + width / 2 > line.leftCircle.left) {
                tmpX = tooltipOffset.left;
            } else {
                tmpX = tooltipOffset.left + width;
            }
            if (offset.top + height < tooltipOffset.top){
                tmpY = tooltipOffset.top;
            } else if (offset.top > tooltipOffset.top + point.parents(".image-tooltip").innerHeight()) {
                tmpY = tooltipOffset.top + point.parents(".image-tooltip").innerHeight;
            }
        } else {
            point = line.rightElement.parents(".image-tooltip");
            offset = point.offset();
            width = parseInt(point.css("width"));
            height = parseInt(point.css("height"));
            if (offset.left > control.left) {
                tmpX = offset.left;
                if (offset.top > control.top) {
                    tmpY = offset.top;
                } else if (offset.top < control.top && offset.top + height > control.top) {
                    tmpY = offset.top + height / 2;
                } else {
                    tmpY = offset.top + height;
                }
            } else if (offset.left < control.left && offset.left + width > control.left) {
                tmpX = offset.left + width / 2;
                if (offset.top + height / 2 > control.top) {
                    tmpY = offset.top;
                } else {
                    tmpY = offset.top + height;
                }
            } else {
                tmpX = offset.left + width;
                if (offset.top > control.top) {
                    tmpY = offset.top;
                } else if (offset.top < control.top && offset.top + height > control.top) {
                    tmpY = offset.top + height / 2;
                } else {
                    tmpY = offset.top + height;
                }
            }
        }
        line.path[1][3] = tmpX;
        line.path[1][4] = tmpY;
        line.rightCircle.set({
            left: tmpX,
            top: tmpY
        });
        line.rightCircle.setCoords();
    } else {
        point = line.rightElement;
        factor = 1;
        distance = Math.sqrt((point.left - control.left) * (point.left - control.left) + (point.top - control.top) * (point.top - control.top));
        if (control.top < point.top) {
            factor = -1;
        }
        angle = factor * Math.atan((control.left - point.left) / (control.top - point.top));
        tmpX = control.left - (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
        tmpY = control.top - factor * (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);
        line.path[1][3] = tmpX;
        line.path[1][4] = tmpY;
        line.rightCircle.set({
            left: tmpX,
            top: tmpY
        });
        line.rightCircle.setCoords();

        newPoint = point.newPoint;
        point.lines.forEach(function (line) {
            if (line.leftCircle.intersectsWithObject(newPoint) || line.rightCircle.intersectsWithObject(newPoint)) {
                overlap = true;
                angleOffset = 0;
            }
        });
        lines = point.lines;
        while (overlap) {
            angleOffset += 5 / actualRadius;
            toggleDirection *= -1;
            newPoint.set({
                left: point.left + toggleDirection * Math.sin(angleOffset) * actualRadius,
                top: point.top - Math.cos(angleOffset) * actualRadius
            });
            newPoint.setCoords();
            overlap = false;
            lines.forEach(function (line) {
                if (line.leftCircle.intersectsWithObject(newPoint) || line.rightCircle.intersectsWithObject(newPoint)) {
                    overlap = true;
                }
            });
        }
    }

    canvas.renderAll();
}