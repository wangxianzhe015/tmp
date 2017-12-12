function drawQuadratic() {

    var line = new fabric.Path('M 500 300 Q 600 400, 700, 300', {
        fill: '',
        stroke: 'white',
        opacity: .5,
        selectable: true,
        class: "line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    canvas.add(line);

    var p1 = makeCurvePoint(600, 400, line);
    p1.name = "p1";
    canvas.add(p1);

    var p0 = makeCurveCircle(500, 300, line, p1);
    p0.name = "p0";
    canvas.add(p0);

    var p2 = makeCurveCircle(700, 300, line, p1);
    p2.name = "p2";
    canvas.add(p2);

    clipPath(p0, p2);

}

function makeCurveCircle(left, top, line, point) {
    var c = new fabric.Circle({
        left: left,
        top: top,
        class: 'b-point',
        strokeWidth: 0,
        radius: Math.sqrt(3) * (radius - border / 2) / 2,
        originX: 'center',
        originY: 'center',
        fill: elementColor,
        opacity:.5
    });

    c.hasBorders = c.hasControls = false;

    c.line = line;
    c.control = point;

    return c;
}

function makeCurvePoint(left, top, line) {
    var c = new fabric.Circle({
        left: left,
        top: top,
        class: 'b-point',
        strokeWidth: 2,
        radius: 5,
        originX: 'center',
        originY: 'center',
        fill: '#fff',
        stroke: '#f00'
    });

    c.hasBorders = c.hasControls = false;

    c.line = line;

    return c;
}

function clipPath(p0, p2){
    var leftPoint, rightPoint,
        distance, angle, startAngle, endAngle, stepAngle = 10,
        line = p0.line, control = p0.control, tmpLine,
        edgePoint, points = [];
    if (p0.left < p2.left){
        leftPoint = p0;
        rightPoint = p2;
    } else {
        leftPoint = p2;
        rightPoint = p0;
    }

    distance = Math.sqrt((control.left - leftPoint.left) * (control.left - leftPoint.left) + (control.top - leftPoint.top) * (control.top - leftPoint.top));
    tmpLine = new fabric.Line([0, 0, distance, 0],{
        left: control.left,
        top: control.top,
        stroke: 'black',
        selectable: true
    });
    canvas.add(tmpLine);
    startAngle = Math.asin((leftPoint.top - control.top) / distance) * 180 / Math.PI - 180;
    endAngle = startAngle + 100;
    for (angle = startAngle; angle < endAngle; angle += stepAngle){
        console.log(angle);
        //tmpLine = new fabric.Path(
        //    'M ' +
        //    Math.cos(angle) * Math.sqrt(3) * (radius - border / 2) / 2 + p0.left +
        //    ' ' +
        //    Math.sin(angle) * Math.sqrt(3) * (radius - border / 2) / 2 + p0.top +
        //    ' L ' +
        //    control.left +
        //    ' ' +
        //    control.top +
        //    ' Z', {
        //        opacity: 1,
        //        stroke: "black",
        //        selectable: true,
        //        objectCaching: false,
        //        perPixelTargetFind: true
        //    });
        tmpLine.set('angle', angle);
        console.log(line.intersectsWithObject(tmpLine));
        if (tmpLine.intersectsWithObject(line)) break;
    }
    console.log(tmpLine);
    //line.set({
    //    clipTo: function(ctx) {
    //        ctx.arc(0, 0, Math.sqrt(3) * (radius - border / 2) / 2, 0, Math.PI * 2, true);
    //    }
    //});

    canvas.renderAll();
}