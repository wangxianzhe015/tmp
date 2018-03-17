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
        "ever since the 1500s\n";
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
        left: 300,
        top: 200,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'VagRounded',
        fontWeight: 'bold'
    });

    var text2 = new fabric.IText(dummyText, {
        fontSize: 10,
        left: 200,
        top: 300,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'SanFrancisco',
        fontWeight: 'bold'
    });

    var text3 = new fabric.IText("<h3 style='text-transform: uppercase'>Example header</h3>" + dummyText, {
        fontSize: 10,
        left: 200,
        top: 300,
        selectable: false,
        //originX: 'center',
        //originY: 'center',
        lineHeight: 1,
        fill: 'white',
        fontFamily: 'SanFrancisco',
        fontWeight: 'bold'
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

    var dotBox1 = new fabric.Rect({
        top: 520,
        left: 500,
        width: 100,
        height: 100,
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [5, 5]
    });

    var dotBox2 = new fabric.Rect({
        top: 520,
        left: 610,
        width: 100,
        height: 100,
        fill: 'transparent',
        strokeWidth: 1,
        stroke: '#EEE',
        strokeDashArray: [5, 5]
    });

    canvas.add(vLine1);
    canvas.add(vLine2);
    canvas.add(vLine3);
    canvas.add(vLine4);
    canvas.add(vLine5);
    vLine1.sendToBack();
    vLine2.sendToBack();
    vLine3.sendToBack();
    vLine4.sendToBack();
    vLine5.sendToBack();

    canvas.add(hLine1);
    hLine1.sendToBack();

    canvas.add(text1);
    canvas.add(text2);
    canvas.add(text3);
    text1.sendToBack();
    text2.sendToBack();
    text3.sendToBack();

    canvas.add(rect1);
    canvas.add(rect2);
    rect1.sendToBack();
    rect2.sendToBack();

    canvas.add(dotBox1);
    canvas.add(dotBox2);
    dotBox1.sendToBack();
    dotBox2.sendToBack();

    canvas.renderAll();
}