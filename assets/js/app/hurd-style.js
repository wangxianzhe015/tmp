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
    var vLine1 = new fabric.Line([150, 0, 150, canvas.height], {
        fill: '',
        stroke: '#DDD',
        strokeWidth: .5,
        opacity: .5,
        selectable: false,
        class: "v-line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var vLine2 = new fabric.Line([180, 0, 180, canvas.height], {
        fill: '',
        stroke: '#DDD',
        strokeWidth: .5,
        opacity: .5,
        selectable: false,
        class: "v-line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var vLine3 = new fabric.Line([210, 0, 210, canvas.height], {
        fill: '',
        stroke: '#DDD',
        strokeWidth: .5,
        opacity: .5,
        selectable: false,
        class: "v-line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var vLine4 = new fabric.Line([900, 0, 900, canvas.height], {
        fill: '',
        stroke: '#DDD',
        strokeWidth: .5,
        opacity: .5,
        selectable: false,
        class: "v-line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var vLine5 = new fabric.Line([950, 0, 950, canvas.height], {
        fill: '',
        stroke: '#DDD',
        strokeWidth: .5,
        opacity: .5,
        selectable: false,
        class: "v-line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var hLine1 = new fabric.Line([0, 500, canvas.width, 500], {
        fill: '',
        stroke: '#DDD',
        strokeWidth: .5,
        opacity: .5,
        selectable: false,
        class: "v-line",
        objectCaching: false,
        perPixelTargetFind: true
    });

    var text1 = new fabric.IText(dummyText, {
        fontSize: 12,
        left: 10,
        top: 10,
        selectable: true,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        opacity: .8,
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var backRect1 = new fabric.Rect({
        top: 0,
        left: 0,
        width: text1.width + 20,
        height: text1.height + 20,
        rx: 5,
        ry: 5,
        fill: '#333',
        selectable: false,
        //strokeWidth: 1,
        //stroke: '#EEE',
        opacity:.4
    });

    var textBox1 = new fabric.Group([text1, backRect1], {
        left: 300,
        top: 200,
        selectable: false
    });

    var text2 = new fabric.IText(dummyText, {
        fontSize: 10,
        left: 10,
        top: 10,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        opacity: .6,
        fontFamily: 'SanFrancisco',
        fontWeight: 'bold'
    });

    var backRect2 = new fabric.Rect({
        top: 0,
        left: 0,
        width: text2.width + 20,
        height: text2.height + 20,
        rx: 5,
        ry: 5,
        fill: '#333',
        selectable: false,
        //strokeWidth: 1,
        //stroke: '#EEE',
        opacity:.4
    });

    var textBox2 = new fabric.Group([text2, backRect2], {
        left: 200,
        top: 300,
        selectable: false
    });

    var text3 = new fabric.IText(dummyText, {
        fontSize: 8,
        left: 10,
        top: 10,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        opacity: .5,
        fontFamily: 'SanFrancisco',
        fontWeight: 'bold'
    });

    var backRect3 = new fabric.Rect({
        top: 0,
        left: 0,
        width: text3.width + 20,
        height: text3.height + 20,
        rx: 5,
        ry: 5,
        fill: '#333',
        selectable: false,
        //strokeWidth: 1,
        //stroke: '#EEE',
        opacity:.4
    });

    var textBox3 = new fabric.Group([text3, backRect3], {
        left: 230,
        top: 100,
        selectable: false
    });

    var text4 = new fabric.IText(dummyText, {
        fontSize: 8,
        left: 10,
        top: 10,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        opacity: .5,
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var topLine1 = new fabric.Line([0, 0, text4.width + 20, 0], {
        selectable: false,
        strokeWidth: 1,
        stroke: '#EEE',
        opacity:.4
    });

    var bottomLine1 = new fabric.Line([0, text4.height + 20, text4.width + 20, text4.height + 20], {
        selectable: false,
        strokeWidth: 1,
        stroke: '#EEE',
        opacity:.4
    });

    var textBox4 = new fabric.Group([text4, topLine1, bottomLine1], {
        left: 980,
        top: 300,
        selectable: false
    });

    var text5 = new fabric.IText(dummyText, {
        fontSize: 8,
        left: 10,
        top: 10,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        opacity: .5,
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var topLine2 = new fabric.Line([0, 0, text5.width + 20, 0], {
        selectable: false,
        strokeWidth: 1,
        stroke: '#EEE',
        opacity:.4
    });

    var bottomLine2 = new fabric.Line([0, text5.height + 20, text5.width + 20, text5.height + 20], {
        selectable: false,
        strokeWidth: 1,
        stroke: '#EEE',
        opacity:.4
    });

    var textBox5 = new fabric.Group([text5, topLine2, bottomLine2], {
        left: 980,
        top: 330 + textBox4.height,
        selectable: false
    });

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

    tickBox = new fabric.Rect({
        top: 200,
        left: 600,
        width: 200,
        height: 200,
        selectable: false,
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [1, 2]
    });

    var boundaryText1 = new fabric.IText("Lorem Ipsum is simply dummy text of the printing.", {
        fontSize: 10,
        left: 20,
        top: 0,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText2 = new fabric.IText("Lorem Ipsum is simply dummy text of the printing.", {
        fontSize: 10,
        left: 230,
        top: 20,
        angle: 90,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText3 = new fabric.IText("Lorem Ipsum is simply dummy text of the printing.", {
        fontSize: 10,
        left: 0,
        top: 230,
        angle: -90,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundaryText4 = new fabric.IText("Lorem Ipsum is simply dummy text of the printing.", {
        fontSize: 10,
        left: 20,
        top: 220,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var boundary = new fabric.Group([boundaryText1, boundaryText2, boundaryText3, boundaryText4], {
        left: 585,
        top: 185,
        selectable: false,
        draggable: false,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        perPixelTargetFind: true
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

    addCrosshairLine("vertical", 400);
    addCrosshairLine("horizontal", 550);

    canvas.add(vLine1, vLine2, vLine3, vLine4, vLine5);
    canvas.add(hLine1);
    canvas.add(textBox5, textBox4, textBox3, textBox2, textBox1);
    canvas.add(rect1, rect2);
    canvas.add(tickBox);
    canvas.add(boundary);
    canvas.add(dashedBox1, dashedBox2);

    canvas.renderAll();
}

function addCrosshairLine(type, offset){
    var crosshairLine = new fabric.IText("+", {
        fontSize: 12,
        selectable: false,
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    if (type == "vertical"){
        crosshairLine.set({
            top: 0,
            left: offset,
            angle: 90
        });
    } else {
        crosshairLine.set({
            left: 0,
            top: offset
        });
    }

    var count = 0;
    if (type == "vertical"){
        count = canvas.height / crosshairLine.width;
    } else {
        count = canvas.width / crosshairLine.width;
    }

    for (var i = 0; i < count; i ++){
        crosshairLine.text = crosshairLine.text + " +";
    }

    canvas.add(crosshairLine);
}