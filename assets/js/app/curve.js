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

    var p0 = makeCurveCircle(500, 300, line, p1, "p0");
    canvas.add(p0);

    var p2 = makeCurveCircle(700, 300, line, p1, "p2");
    canvas.add(p2);

    adjustLine(p0, "p0");
    adjustLine(p2, "p2");
}

function makeCurveCircle(left, top, line, point, name) {
    var c = new fabric.Circle({
        left: left,
        top: top,
        class: 'b-point',
        name: name,
        strokeWidth: 0,
        radius: Math.sqrt(3) * (radius - border / 2) / 2,
        originX: 'center',
        originY: 'center',
        fill: elementColor,
        opacity:.5
    });

    c.hasBorders = c.hasControls = false;

    c.line = line;
    point[name] = c;
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

function adjustLine(point, category){
    var line = point.line, control = point.control, distance, angle, factor = 1;

    distance = Math.sqrt((point.left - control.left) * (point.left - control.left) + (point.top - control.top) * (point.top - control.top));
    if (control.top < point.top){
        factor = -1;
    }
    angle = factor * Math.atan((control.left - point.left) / (control.top - point.top));
    if (category == "p0") {
        // Starting point
        line.path[0][1] = control.left - (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
        line.path[0][2] = control.top - factor * (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);
    } else {
        // Ending point
        line.path[1][3] = control.left - (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
        line.path[1][4] = control.top - factor * (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);
    }

    canvas.renderAll();
}