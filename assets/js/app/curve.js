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
        strokeWidth: 1,
        stroke: 'white',
        radius: 3,
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
        //if (leftElement[0].tagName != "TD") return false;
        //leftElement = leftElement.parents("tr");
        //leftElement.data("text-cell", leftElement.parents(".image-tooltip").attr("id"));
        leftElement.data("text-cell", leftElement.attr("id"));
        startX = leftElement.offset().left;
        startY = leftElement.offset().top;
    } else {
        startX = leftElement.left;
        startY = leftElement.top;
    }

    if ( rightElement instanceof jQuery ){
        //if (rightElement[0].tagName != "TD") return false;
        //rightElement = rightElement.parents("tr");
        if (rightElement[0].tagName == "TD") {
            rightElement = rightElement.parents("tr");
            rightElement.data("text-cell", rightElement.parents(".image-tooltip").attr("id"));
        } else {
            rightElement = rightElement.parents(".image-tooltip");
            rightElement.data("text-cell", rightElement.parents(".image-tooltip").attr("id"));
        }
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
        strokeWidth: 1,
        stroke: 'white',
        radius: 3,
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
        strokeWidth: 1,
        stroke: 'white',
        radius: 3,
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
        if (leftElement.hasClass("image-tooltip")) {
            lines = leftElement.data("lines");
            lines.push(bLine);
            leftElement.data("lines", lines);
        } else {
            lines = leftElement.parents(".image-tooltip").data("lines");
            lines.push(bLine);
            leftElement.parents(".image-tooltip").data("lines", lines);
        }
    } else {
        leftElement.lines.push(bLine);
    }

    if ( rightElement instanceof jQuery ){
        if (rightElement.hasClass("image-tooltip")) {
            lines = rightElement.data("lines");
            lines.push(bLine);
            rightElement.data("lines", lines);
        } else {
            lines = rightElement.parents(".image-tooltip").data("lines");
            lines.push(bLine);
            rightElement.parents(".image-tooltip").data("lines", lines);
        }
    } else {
        rightElement.lines.push(bLine);
    }

    adjustLine(bLine);
}

function adjustLine(line){
    var control = line.control, point, $textCell, distance, angle, factor = 1, tmpX, tmpY, newPoint, overlap = false, angleOffset, toggleDirection = 1, actualRadius = Math.sqrt(3) * (radius - border / 2) / 2, lines, offset, tooltipOffset, width, height, groupX = 0, groupY = 0;

    // Starting point
    if ( line.leftElement instanceof jQuery ) {
        $textCell = $("#" + line.leftElement.data("text-cell"));
        //if ($textCell.hasClass("expanded")){
        //    point = line.leftElement;
        //    offset = point.offset();
        //    tooltipOffset = $textCell.offset();
        //    width = parseInt($textCell.css("width"));
        //    height = parseInt(point.css("height"));
        //    tmpY = offset.top + height / 2;
        //    if (offset.left + width / 2 > line.rightCircle.left) {
        //        tmpX = tooltipOffset.left;
        //    } else {
        //        tmpX = tooltipOffset.left + width;
        //    }
        //    if (tmpY < tooltipOffset.top){
        //        tmpY = tooltipOffset.top;
        //    } else if (tmpY > tooltipOffset.top + $textCell.innerHeight()) {
        //        tmpY = tooltipOffset.top + $textCell.innerHeight();
        //    }
        //} else {
            point = $textCell;
            offset = point.offset();
            width = parseInt(point.css("width"));
            height = parseInt(point.css("height"));
            if (offset.left > control.left) {
                tmpX = offset.left;
                //if (offset.top > control.top){
                //    tmpY = offset.top;
                //} else if (offset.top < control.top && offset.top + height > control.top){
                if (offset.top + height > control.top){
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
        //}
        line.path[0][1] = tmpX;
        line.path[0][2] = tmpY;
        line.leftCircle.set({
            left: tmpX,
            top: tmpY
        });
        line.leftCircle.setCoords();
    } else {
        point = line.leftElement;
        if (groupTarget != null){
            groupTarget._objects.forEach(function(obj){
                if (obj.id == line.leftElement.id){
                    groupX = groupTarget.left + groupTarget.width / 2;
                    groupY = groupTarget.top + groupTarget.height / 2;
                }
            });
        }
        distance = Math.sqrt(Math.pow(point.left - control.left + groupX, 2) + Math.pow(point.top - control.top + groupY, 2));
        if (control.top < point.top + groupY) {
            factor = -1;
        }
        angle = factor * Math.atan((control.left - point.left - groupX) / (control.top - point.top - groupY));
        tmpX = control.left - (distance - point.scaleX * Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
        tmpY = control.top - factor * (distance - point.scaleX * Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);
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
                left: groupX + point.left + point.scaleX * toggleDirection * Math.sin(angleOffset) * actualRadius,
                top: groupY + point.top - point.scaleX * Math.cos(angleOffset) * actualRadius
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
        if (line.rightElement.hasClass("image-tooltip")) {
            $textCell = line.rightElement;
        } else {
            $textCell = $("#" + line.rightElement.data("text-cell"));
        }
        //if ($textCell.hasClass("expanded")){
        //    point = line.rightElement;
        //    offset = point.offset();
        //    tooltipOffset = $textCell.offset();
        //    width = parseInt($textCell.css("width"));
        //    height = parseInt(point.css("height"));
        //    tmpY = offset.top + height / 2;
        //    if (offset.left + width / 2 > line.leftCircle.left) {
        //        tmpX = tooltipOffset.left;
        //    } else {
        //        tmpX = tooltipOffset.left + width;
        //    }
        //    if (tmpY < tooltipOffset.top){
        //        tmpY = tooltipOffset.top;
        //    } else if (tmpY > tooltipOffset.top + $textCell.innerHeight()) {
        //        tmpY = tooltipOffset.top + $textCell.innerHeight();
        //    }
        //} else {
            point = $textCell;
            offset = point.offset();
            width = parseInt(point.css("width"));
            height = parseInt(point.css("height"));
            if (offset.left > control.left) {
                tmpX = offset.left;
                //if (offset.top > control.top) {
                //    tmpY = offset.top;
                //} else if (offset.top < control.top && offset.top + height > control.top) {
                if (offset.top + height > control.top) {
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
        //}
        line.path[1][3] = tmpX;
        line.path[1][4] = tmpY;
        line.rightCircle.set({
            left: tmpX,
            top: tmpY
        });
        line.rightCircle.setCoords();
    } else {
        point = line.rightElement;
        groupX = 0;
        groupY = 0;
        if (groupTarget != null){
            groupTarget._objects.forEach(function(obj){
                if (obj.id == line.rightElement.id){
                    groupX = groupTarget.left + groupTarget.width / 2;
                    groupY = groupTarget.top + groupTarget.height / 2;
                }
            });
        }
        factor = 1;
        distance = Math.sqrt(Math.pow(point.left - control.left + groupX, 2) + Math.pow(point.top - control.top + groupY, 2));
        if (control.top < point.top + groupY) {
            factor = -1;
        }
        angle = factor * Math.atan((control.left - point.left - groupX) / (control.top - point.top - groupY));
        tmpX = control.left - (distance - point.scaleX * Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
        tmpY = control.top - factor * (distance - point.scaleX * Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);
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
                left: groupX + point.left + point.scaleX * toggleDirection * Math.sin(angleOffset) * actualRadius,
                top: groupY + point.top - point.scaleX * Math.cos(angleOffset) * actualRadius
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

function bPointClickHandler(object, event) {
    rmBezierLine = object.master;
    $("<img/>").attr({
        class: "bezier-line-control-btn",
        src: "./assets/images/icons/cancel-24.png"
    }).on("click", function () {
        var lines = [], $textCell;
        if (rmBezierLine != null) {
            if (rmBezierLine.leftElement instanceof jQuery) {
                if (rmBezierLine.leftElement.hasClass("image-tooltip")) {
                    $textCell = rmBezierLine.leftElement;
                } else {
                    $textCell = rmBezierLine.leftElement.parents(".image-tooltip");
                }
                lines = $textCell.data("lines");
                lines.forEach(function (line, i) {
                    if (line.id == rmBezierLine.id) {
                        lines.splice(i, 1);
                    }
                });
                $textCell.data("lines", lines);
            } else {
                rmBezierLine.leftElement.lines.forEach(function (line, i) {
                    if (line.id == rmBezierLine.id) {
                        rmBezierLine.leftElement.lines.splice(i, 1);
                    }
                });
            }
            if (rmBezierLine.rightElement instanceof jQuery) {
                if (rmBezierLine.rightElement.hasClass("image-tooltip")) {
                    $textCell = rmBezierLine.rightElement;
                } else {
                    $textCell = rmBezierLine.rightElement.parents(".image-tooltip");
                }
                lines = $textCell.data("lines");
                lines.forEach(function (line, i) {
                    if (line.id == rmBezierLine.id) {
                        lines.splice(i, 1);
                    }
                });
                $textCell.data("lines", lines);
            } else {
                rmBezierLine.rightElement.lines.forEach(function (line, i) {
                    if (line.id == rmBezierLine.id) {
                        rmBezierLine.rightElement.lines.splice(i, 1);
                    }
                });
            }
            canvas.remove(rmBezierLine.leftCircle);
            canvas.remove(rmBezierLine.rightCircle);
            canvas.remove(rmBezierLine);
            rmBezierLine = null;
            canvas.renderAll();
        }
        $(".bezier-line-control-btn").remove();
    }).css({
        left: event.pageX + 20,
        top: event.pageY,
        position: "absolute"
    }).appendTo("body");

    $("<img/>").attr({
        class: "bezier-line-control-btn",
        src: "./assets/images/icons/line-type-24.png"
    }).on("click", function () {
        if (rmBezierLine != null) {
            if (rmBezierLine.type == "dashed") {
                rmBezierLine.strokeDashArray = [1, 0];
                rmBezierLine.type = "solid";
            } else {
                rmBezierLine.strokeDashArray = [5, 5];
                rmBezierLine.type = "dashed";
            }
            rmBezierLine = null;
            canvas.renderAll();
        }
        $(".bezier-line-control-btn").remove();
    }).css({
        left: event.pageX + 54,
        top: event.pageY,
        position: "absolute"
    }).appendTo("body");

    setTimeout(function () {
        $(".bezier-line-control-btn").remove();
        rmBezierLine = null;
    }, 2000);
}