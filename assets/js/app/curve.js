function drawQuadratic() {

    var line1 = new fabric.Path('M 500 300 Q 600 300 700 300', {
        fill: '',
        stroke: 'white',
        opacity: .5,
        selectable: true,
        strokeDashArray: [5, 5],
        class: "line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var line2 = new fabric.Path('M 700 300 Q 800 300 900 300', {
        fill: '',
        stroke: 'white',
        opacity: .5,
        selectable: true,
        strokeDashArray: [3, 7],
        class: "line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var line3 = new fabric.Path('M 900 300 Q 1000 300 1100 300', {
        fill: '',
        stroke: 'white',
        opacity: .5,
        selectable: true,
        strokeDashArray: [7, 3],
        class: "line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    canvas.add(line1);
    canvas.add(line2);
    canvas.add(line3);

    var control1 = makeCurvePoint(600, 300, line1);
    control1.name = "control-1";
    line1.control = control1;
    canvas.add(control1);

    var control2 = makeCurvePoint(800, 300, line2);
    control2.name = "control-2";
    line2.control = control2;
    canvas.add(control2);

    var control3 = makeCurvePoint(1000, 300, line3);
    control3.name = "control-3";
    line3.control = control3;
    canvas.add(control3);

    var p0 = makeCurveCircle(500, 300, null, control1);
    canvas.add(p0);

    var p1 = makeCurveCircle(700, 300, control1, control2);
    canvas.add(p1);

    var p2 = makeCurveCircle(900, 300, control2, control3);
    canvas.add(p2);

    var p3 = makeCurveCircle(1100, 300, control3, null);
    canvas.add(p3);

    adjustLine(line1);
    adjustLine(line2);
    adjustLine(line3);
}

/**
 *
 * @param x
 * @param y
 * @param leftControl
 * @param rightControl
 * @returns {fabric.Circle}
 */
function makeCurveCircle(x, y, leftControl, rightControl) {
    var c = new fabric.Circle({
        left: x,
        top: y,
        class: 'b-circle',
        strokeWidth: 0,
        radius: Math.sqrt(3) * (radius - border / 2) / 2,
        originX: 'center',
        originY: 'center',
        fill: elementColor,
        opacity:.5
    });

    c.hasBorders = c.hasControls = false;

    c.leftControl = leftControl;
    c.rightControl = rightControl;

    if (leftControl != null) {
        leftControl.rightCircle = c;
    }
    if (rightControl != null) {
        rightControl.leftCircle = c;
    }

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
        leftCircle: null,
        rightCircle: null,
        fill: '#fff',
        opacity: 0,
        stroke: '#f00'
    });

    c.hasBorders = c.hasControls = false;

    c.line = line;

    return c;
}

function adjustLine(line){
    var control = line.control, point, distance, angle, factor = 1;

    // Starting point
    point = control.leftCircle;
    distance = Math.sqrt((point.left - control.left) * (point.left - control.left) + (point.top - control.top) * (point.top - control.top));
    if (control.top < point.top) {
        factor = -1;
    }
    angle = factor * Math.atan((control.left - point.left) / (control.top - point.top));
    line.path[0][1] = control.left - (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
    line.path[0][2] = control.top - factor * (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);

    // Ending point
    point = control.rightCircle;
    factor = 1;
    distance = Math.sqrt((point.left - control.left) * (point.left - control.left) + (point.top - control.top) * (point.top - control.top));
    if (control.top < point.top) {
        factor = -1;
    }
    angle = factor * Math.atan((control.left - point.left) / (control.top - point.top));
    line.path[1][3] = control.left - (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.sin(angle);
    line.path[1][4] = control.top - factor * (distance - Math.sqrt(3) * (radius - border / 2) / 2) * Math.cos(angle);

    canvas.renderAll();
}