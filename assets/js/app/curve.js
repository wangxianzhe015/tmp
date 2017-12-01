function drawQuadratic() {

    var line = new fabric.Path('M 500 300 Q 600 400, 700, 300', {
        fill: '',
        stroke: 'black',
        selectable: false,
        class: "line",
        objectCaching: false
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
