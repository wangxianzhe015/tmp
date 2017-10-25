function drawElements(){
    draw1();
    draw2();
    draw3();
    draw4();
    draw5();
    draw6();
    canvas.renderAll();
}

function draw1() {
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

    var text = new fabric.IText('Honey1', {
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

    var formatted = wrapCanvasText(text, canvas, radius, radius, 'center');

    var element = new fabric.Group([myPoly, formatted], {
        left: radius,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        cornerStyle: 'circle',
        cornerColor: 'white',
        class: 'element',
        category: 'hexagon',
        position: '0-0',
        id: 'tooltip 6',
        hasBorders: false,
        //hasControls: false,
        //hasRotatingPoint: true,
        perPixelTargetFind: true,
        link: 'http://yahoo.com',
        //opacity: 0,
        progress: '50',
        tags: [],
        cluster: '',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: '<h3>Title</h3>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s '
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

    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    }
}

function draw2() {
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

    var text = new fabric.IText('Honey2', {
        fontSize: 12,
        left: radius,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        lineHeight: 1,
        fontFamily: 'VagRounded',
        fontWeight: 'bold',
        fill: 'rgba(231,41,225,.2)'
    });

    var formatted = wrapCanvasText(text, canvas, radius, radius, 'center');

    var element = new fabric.Group([myPoly, formatted], {
        left: 5 * radius / 2,
        top: Math.round(Math.sqrt(3) * radius),
        cornerStyle: 'circle',
        cornerColor: 'white',
        id: 'tooltip 5',
        class: 'element',
        category: 'hexagon',
        position: '1-0',
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        //hasControls: false,
        //hasRotatingPoint: true,
        //opacity: 0,
        perPixelTargetFind: true,
        link: 'http://yahoo.com',
        progress: '70',
        tags: [],
        cluster: '',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: '<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>'
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

    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    }
}

function draw3() {
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

    var text = new fabric.Text('Anant Jadhav Anant', {
        fontSize: 12,
        textAlign: "center",
        left: radius,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        lineHeight: 1,
        fontFamily: 'VagRounded',
        fontWeight: 'bold',
        fill: '#FFF',
        opacity:.5
    });

    var formatted = wrapCanvasText(text, canvas, radius, radius, 'center');

    var element = new fabric.Group([myPoly, formatted], {
        left: radius,
        top: Math.sqrt(3) * 5 * radius / 2,
        originX: "center",
        originY: "center",
        cornerStyle: 'circle',
        cornerColor: 'white',
        class: 'element',
        category: 'hexagon',
        id: 'tooltip 4',
        hasBorders: false,
        //hasControls: false,
        //hasRotatingPoint: true,
        position: '0-2',
        //opacity: 0,
        perPixelTargetFind: true,
        link: 'http://yahoo.com',
        progress: '30',
        tags: [],
        cluster: '',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: '<p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p><a href="http://www.google.com">Click here</a>'
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
    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    }
}

function draw4() {
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

    var text = new fabric.Text('Anant Jadhav ANANT dfds sdss sd dfd dfds sdss sd dfd ANANT dfds sdss sd ', {
        fontSize: 12,
        textAlign: "center",
        left: radius,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        lineHeight: 12,
        fontFamily: 'VagRounded',
        fontWeight: 'bold',
        fill: '#FFF',
        opacity:.5
    });

    var formatted = wrapCanvasText(text, canvas, radius, radius, 'center');

    var element = new fabric.Group([myPoly, formatted], {
        left: 4 * radius,
        top: Math.sqrt(3) * 5 * radius / 2,
        class: 'element',
        cornerStyle: 'circle',
        cornerColor: 'white',
        category: 'hexagon',
        originX: "center",
        originY: "center",
        id: 'tooltip 3',
        position: '2-2',
        hasBorders: false,
        //hasControls: false,
        //hasRotatingPoint: false,
        perPixelTargetFind: true,
        link: 'http://yahoo.com',
        progress: '80',
        tags: [],
        cluster: '',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: '<p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>'
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
    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    }
}

function draw5() {
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

    var formatted = wrapCanvasText(text1, canvas, radius, radius, 'center');

    var element = new fabric.Group([circle1, formatted], {
        left: 7 * radius,
        top: parseInt(Math.sqrt(3) * 5 * radius / 2),
        class: 'element',
        cornerStyle: 'circle',
        cornerColor: 'white',
        category: 'circle',
        originX: "center",
        originY: "center",
        id: 'tooltip 1',
        position: '4-1',
        hasBorders: false,
        //hasControls: false,
        //hasRotatingPoint: false,
        perPixelTargetFind: true,
        link: 'http://yahoo.com',
        progress: '50',
        tags: [],
        cluster: '',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'
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
    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    }
}

function draw6() {

    var circle2 = new fabric.Circle({
        radius: Math.sqrt(3) * (radius - border / 2) / 2,
        //originX: "center",
        //originY: "center",
        fill: elementColor,
        opacity:.5
    });

    var text2 = new fabric.Text('Anant Jadhav ANANT dfds sdss sd dfd dfds sdss sd dfd ANANT dfds sdss sdasd asdasdsadasd dfds sdss sdasd asdasdsadasd ', {
        fontSize: 12,
        textAlign: "center",
        left: Math.sqrt(3) * radius / 2,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        lineHeight: 12,
        fontFamily: 'VagRounded',
        fontWeight: 'bold',
        fill: '#FFF',
        opacity: 1
    });

    var formatted = wrapCanvasText(text2, canvas, radius, radius, 'center');

    var element = new fabric.Group([circle2, formatted], {
        left: 10 * radius,
        top: Math.sqrt(3) * 3 * radius / 2,
        id: 'tooltip 2',
        class: 'element',
        category: 'circle',
        cornerStyle: 'circle',
        cornerColor: 'white',
        position: '6-1',
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        //hasControls: false,
        //hasRotatingPoint: false,
        perPixelTargetFind: true,
        link: 'http://yahoo.com',
        progress: '100',
        tags: [],
        cluster: '',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: '"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"'
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
    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    }
}

function getElementName(type){
    var input = document.createElement('input');
    input.type = "text";
    input.id = "new-element-name";
    input.placeholder = "Input New Element Name";
    input.onkeyup = function(event){
        if (event.keyCode == "13") {
            var name = $("#new-element-name").val(),names = name.split(',');
            if (name == '') {
                return false;
            }
            clusters['temp'] = [];
            names.forEach(function(o,index){
                if (type == 'hex') {
                    clusters['temp'][index] = addNewHexagon(o,index);
                } else if (type == 'circle') {
                    clusters['temp'][index] = addNewCircle(o,index);
                }
            });
            $("#new-element-div").hide();
            clusterElements('temp');
        }
    };

    $("#new-element-content").html(input);
    $("#new-element-div").css({
        'left': downPoint.x + 80,
        'top': downPoint.y
    }).show();
}

function addNewHexagon(name,index){
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

    var text = new fabric.IText(name, {
        fontSize: 12,
        textAlign: "center",
        left: radius,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        lineHeight: 12,
        fontFamily: 'VagRounded',
        fontWeight: 'bold',
        fill: '#FFF',
        opacity:1
    });

    var formatted = wrapCanvasText(text, canvas, radius, radius, 'center');

    var element = new fabric.Group([myPoly, formatted], {
        left: downPoint.x,
        top: downPoint.y + Math.sqrt(3) * radius * index,
        width: 2* radius,
        height: 2* radius,
        cornerStyle: 'circle',
        cornerColor: 'white',
        originX: "center",
        originY: "center",
        hasBorders: false,
        class: "element",
        category: "hexagon",
        id: nameElement('new',canvas.getObjects().length),
        progress: '100',
        tags: [],
        cluster: 'temp',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: 'Edit'
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
    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    };

    return element.id;
}

function addNewCircle(name,index){
    var myCircle = new fabric.Circle({radius: Math.sqrt(3) * (radius - border / 2) / 2, fill: elementColor, opacity:.5});

    var text = new fabric.IText(name, {
        fontSize: 12,
        textAlign: "center",
        left: Math.sqrt(3) * radius / 2,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        lineHeight: 12,
        fontFamily: 'VagRounded',
        fontWeight: 'bold',
        fill: '#FFF',
        opacity:1
    });

    var formatted = wrapCanvasText(text, canvas, radius, radius, 'center');

    var element = new fabric.Group([myCircle, formatted], {
        left: downPoint.x,
        top: downPoint.y + Math.sqrt(3) * radius * index,
        originX: "center",
        originY: "center",
        hasBorders: false,
        cornerStyle: 'circle',
        cornerColor: 'white',
        class: "element",
        category: "circle",
        id: nameElement('new',canvas.getObjects().length),
        progress: '100',
        tags: [],
        cluster: 'temp',
        comments: [],
        checklistLabel: [],
        checklistCheckbox: [],
        jsonObjects: [],
        datatext: 'Edit'
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

    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    };

    return element.id;
}

function addOneElement(object){
    var element = constructElement(object);
    canvas.add(element);

    elementsInfo[element.id] = {
        x: element.left,
        y: element.top
    };
    return element;
}

function addElements(newElements){
    var oldElements = [];
    canvas.forEachObject(function(object){
        if (object.class == 'group' || object.class == 'element' || (object.class == 'button' && !object.isTemporary)){
            oldElements.push(object);
        }
    });
    var element;
    while(element = oldElements.pop()){
        var check = false;
        newElements.forEach(function(newElement,index){
            if (element.id == newElement.id){
                check = true;
                if (element.class != "group") {
                    element.position = newElement.position;
                    element.link = newElement.link;
                    element.progress = newElement.progress;
                    element.tags = newElement.tags;
                    element.cluster = newElement.cluster;
                    element.comments = newElement.comments;
                    element.checklistLabel = newElement.checklistLabel;
                    element.checklistCheckbox = newElement.checklistCheckbox;
                    element.jsonObjects = newElement.jsonObjects;
                    element.datatext = newElement.datatext;
                    element.beatTab = newElement.beatTab;
                    element.beatTabText = newElement.beatTabText;
                    if (newElement.category == "custom"){
                        replacePolyWithImage(element,newElement.url);
                    }
                    setTimeout(tweenElement(element, newElement), 1000);
                }
                newElements.splice(index,1);
            }
        });
        if (!check){
            canvas.remove(element);
            // remove information from $elementsInfo
            delete elementsInfo[element.id];
        }
    }
    newElements.forEach(function(object){
        if (object.class == 'element') {
            tweenElement(addOneElement(object), object);
        } else if ( object.class == 'group') {
            var children = [];
            object.children.forEach(function(child){
                children.push(constructElement(child));
            });
            var target = new fabric.Group(children);
            target.clone(
                function (newgroup) {
                    //canvas.discardActiveGroup();
                    children.forEach(function (obj) {
                        canvas.remove(obj);
                    });
                    newgroup.id = object.id;
                    newgroup.class = 'group';
                    newgroup.left = object.left;
                    newgroup.top = object.top;
                    newgroup.expanded = false;
                    newgroup.perPixelTargetFind = true;

                    newgroup.setControlsVisibility({
                        mt: false,
                        mb: false,
                        ml: false,
                        mr: false,
                        tr: false,
                        tl: false,
                        br: false,
                        bl: false
                    });
                    newgroup.hasRotatingPoint = false;
                    newgroup.borderColor = "white";

                    canvas.add(newgroup);
                    if (!object.expanded) {
                        collapseGroup(newgroup);
                    }
                },
                ['class', 'id', 'category', 'status', 'cornerStyle', 'cornerColor', 'isParent', 'datatext', 'progress', 'tags', 'comments', 'cluster', 'checklistLabel', 'checklistCheckbox', 'position', 'beatTab', 'beatTabText', 'jsonObjects']
            );
        } else if (object.class == 'canvas'){
            document.body.className = object.backgroundColor;
            $("#app-theme").val(object.backgroundColor);
            elementColor = object.elementColor;
            $("#background-pattern").val(object.pattern);
            if (object.pattern == "" || !object.isPatternApply){
                //canvas.backgroundColor = "rgba(0,0,0,0)";
                $("#background-image").hide();
            } else {
                $("#background-image").attr("src", object.pattern).show();
                //canvas.backgroundColor = new fabric.Pattern({source: $("#background-pattern").val()});
            }
        } else if (object.class == 'views'){
            views = object.data;
        }
    });
    var objects = canvas.getObjects(),countObjects = objects.length;
    for (var index = countObjects; index > 0; index -- ){
        if (objects[index - 1].class == "element") {
            objects[index - 1].item(0).setFill(elementColor);
        }
    }
    canvas.renderAll();
}

function cloneElement(object){
    var poly;
    if (object.category == "circle") {
        poly = new fabric.Circle({
            radius: object._objects[0].radius,
            fill: object._objects[0].fill,
            opacity: object._objects[0].opacity,
            left: object._objects[0].left,
            top: object._objects[0].top
        });
    } else {
        var points = regularPolygonPoints(6, radius - border / 2);
        poly = new fabric.Polygon(points, {
            stroke: object._objects[0].stroke,
            left: object._objects[0].left,
            top: object._objects[0].top,
            strokeWidth: object._objects[0].strokeWidth,
            strokeLineJoin: object._objects[0].strokeLineJoin,
            opacity:object._objects[0].opacity,
            fill: object._objects[0].fill
        }, false);
    }

    var text1 = new fabric.Text(object._objects[1].text, {
        fontSize: object._objects[1].fontSize,
        textAlign: object._objects[1].textAlign,
        left: object._objects[1].left,
        top: object._objects[1].top,
        lineHeight: object._objects[1].lineHeight,
        originX: object._objects[1].originX,
        originY: object._objects[1].originY,
        fontFamily: object._objects[1].fontFamily,
        fontWeight: object._objects[1].fontWeight,
        fill: object._objects[1].fill,
        opacity:object._objects[1].opacity
    });

    var formatted = wrapCanvasText(text1, canvas, radius, radius, 'center');

    var newID = nameElement('clone',object.id);
    var element = new fabric.Group([poly, formatted], {
        left: object.left,
        top: object.top + Math.sqrt(3) * radius,
        class: object.class,
        cornerStyle: object.cornerStyle,
        cornerColor: object.cornerColor,
        category: object.category,
        originX: object.originX,
        originY: object.originY,
        id: newID,
        position: object.position,
        hasBorders: object.hasBorders,
        //hasControls: false,
        //hasRotatingPoint: false,
        perPixelTargetFind: object.perPixelTargetFind,
        link: object.link,
        progress: object.progress,
        tags: object.tags,
        cluster: object.cluster,
        comments: object.comments,
        checklistLabel: object.checklistLabel,
        checklistCheckbox: object.checklistCheckbox,
        jsonObjects: object.jsonObjects,
        datatext: object.datatext
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

    canvas.add(element);

    elementsInfo[newID] = {
        x: element.left,
        y: element.top
    }
}

function addJSONElement(newElement){
    newElements.forEach(function(object){
        if (object.class == 'element') {
            tweenElement(addOneElement(object), object);
        } else if ( object.class == 'group') {
            var children = [];
            object.children.forEach(function(child){
                children.push(constructElement(child));
            });
            var target = new fabric.Group(children);
            target.clone(
                function (newgroup) {
                    //canvas.discardActiveGroup();
                    children.forEach(function (obj) {
                        canvas.remove(obj);
                    });
                    newgroup.id = object.id;
                    newgroup.class = 'group';
                    newgroup.left = object.left;
                    newgroup.top = object.top;
                    newgroup.expanded = false;
                    newgroup.perPixelTargetFind = true;

                    newgroup.setControlsVisibility({
                        mt: false,
                        mb: false,
                        ml: false,
                        mr: false,
                        tr: false,
                        tl: false,
                        br: false,
                        bl: false
                    });
                    newgroup.hasRotatingPoint = false;
                    newgroup.borderColor = "white";

                    canvas.add(newgroup);
                    if (!object.expanded) {
                        collapseGroup(newgroup);
                    }
                },
                ['class', 'id', 'category', 'status', 'cornerStyle', 'cornerColor', 'isParent', 'datatext', 'progress', 'tags', 'comments', 'cluster', 'checklistLabel', 'checklistCheckbox', 'position', 'beatTab', 'beatTabText', 'jsonObjects']
            );
        } else if (object.class == 'canvas'){
            document.body.className = object.backgroundColor;
            $("#app-theme").val(object.backgroundColor);
            elementColor = object.elementColor;
            $("#background-pattern").val(object.pattern);
            if (object.pattern == "" || !object.isPatternApply){
                canvas.backgroundColor = "rgba(0,0,0,0)";
            } else {
                canvas.backgroundColor = new fabric.Pattern({source: $("#background-pattern").val()});
            }
        } else if (object.class == 'views'){
            views = object.data;
        }
    });
    var objects = canvas.getObjects(),countObjects = objects.length;
    for (var index = countObjects; index > 0; index -- ){
        if (objects[index - 1].class == "element") {
            objects[index - 1].item(0).setFill(elementColor);
        }
    }
    canvas.renderAll();
}

function tweenElement(element, newElement){
    element.animate({
        opacity: 1,
        top: newElement.top,
        left: newElement.left
    }, {
        duration: 5000,
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeInOutQuad
    })
}

function paintElement(obj){
    if (obj.class == "element" || obj.class == "parent") {
        obj.item(0).setFill(elementColor);
    } else if (obj.class == "group") {
        var objectsInGroup = obj.getObjects();
        objectsInGroup.forEach(function(obj){
            paintElement(obj);
        });
    }
}

function splitElement(group) {
    var result = [];
    var left = group.left, top = group.top;
    var items = group._objects;
    //group._restoreObjectsState();
    //canvas.remove(group);
    for (var i = 0; i < items.length; i++) {
        items[i].set({
            left: left + items[i].left,
            top: top + items[i].top,
            class: 'temp-edit',
            hasBorder: true
        });
        result.push(items[i]);
        //canvas.add(items[i]);
    }
    // if you have disabled render on addition
    //canvas.renderAll();
    return result;
}

function deconstructElement(object,expanded){
    var oneData = {};
    oneData.id = object.id;
    if (expanded) {
        oneData.left = object.left;
        oneData.top = object.top;
    } else {
        oneData.left = object.originLeft;
        oneData.top = object.originTop;
    }
    oneData.class = object.class;
    oneData.category = object.category;
    oneData.isParent = object.isParent;
    oneData.position = object.position;
    oneData.link = object.link;
    oneData.progress = object.progress;
    oneData.datatext = object.datatext;
    oneData.tags = object.tags;
    oneData.checklistLabel = object.checklistLabel;
    oneData.checklistCheckbox = object.checklistCheckbox;
    oneData.jsonObjects = object.jsonObjects;
    oneData.cluster = object.cluster;
    oneData.comments = object.comments;
    oneData.beatTab = object.beatTab;
    oneData.beatTabText = object.beatTabText;
    var children = object.getObjects();
    if (object.category == 'circle') {
        oneData.poly = {};
        oneData.poly.radius = children[0].radius;
        oneData.poly.fill = children[0].fill;
        oneData.poly.opacity = children[0].opacity;

    } else if (object.category == 'hexagon') {
        oneData.poly = {};
        oneData.poly.fill = children[0].fill;

    } else if (object.category == 'custom'){
        oneData.url = children[0]._originalElement.currentSrc;
    }
    oneData.text = {};
    if (children[1].originalText){
        oneData.text.text = children[1].originalText;
    } else {
        oneData.text.text = eatSpace(children[1].getText());
    }
    oneData.text.fontSize = children[1].fontSize;
    oneData.text.left = children[1].left;
    oneData.text.top = children[1].top;
    oneData.text.fill = children[1].fill;
    oneData.text.opacity = children[1].opacity;

    return oneData;
}

function constructElement(object){
    var points = regularPolygonPoints(6, radius - border / 2);
    var poly, textLeft, element;
    if (object.category == 'circle') {
        poly = new fabric.Circle({
            radius: object.poly.radius,
            //originX: "center",
            //originY: "center",
            fill: object.poly.fill,
            opacity:.5
            //opacity: object.poly.opacity
        });
        textLeft = Math.sqrt(3)*radius / 2;
    } else if (object.category == 'hexagon') {

        poly = new fabric.Polygon(points, {
            stroke: 'rgba(255,255,255,.2)',
            left: 0,
            top: 0,
            strokeWidth: 0,
            strokeLineJoin: 'bevil',
            opacity:.5,
            fill: object.poly.fill
        }, false);
        textLeft = radius;
    } else if (object.category == 'custom') {
        fabric.Image.fromURL(object.url, function(oImg) {
            oImg.set({
                originX: 'center',
                originY: 'center',
                left: 0,
                top: 0,
                opacity:.5
            });
            poly = oImg;
        });
    }

    var text = new fabric.IText(object.text.text, {
        fontSize: object.text.fontSize,
        textAlign: "center",
        //left: object.text.left,
        //top: object.text.top,
        left: textLeft,
        top: Math.sqrt(3) * radius / 2,
        originX: "center",
        originY: "center",
        lineHeight: 12,
        fontFamily: 'Roboto Condensed',
        fontWeight: 'bold',
        fill: object.text.fill,
        opacity: object.text.opacity
    });

    var formatted = wrapCanvasText(text, canvas, radius, radius, 'center');

    element = new fabric.Group([poly, formatted], {
        id: object.id,
        class: object.class,
        category: object.category,
        position: object.position,
        top: object.top,
        left: object.left,
        cornerStyle: 'circle',
        cornerColor: 'white',
        originX: 'center',
        originY: 'center',
        isParent: object.isParent,
        hasBorders: false,
        //hasControls: false,
        //hasRotatingPoint: false,
        link: 'http://yahoo.com',
        progress: object.progress,
        tags: object.tags,
        cluster: object.cluster,
        comments: object.comments,
        checklistLabel: object.checklistLabel,
        checklistCheckbox: object.checklistCheckbox,
        object: object.object,
        datatext: object.datatext,
        beatTab: object.beatTab,
        beatTabText: object.beatTabText
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

    return element;
}

function replacePolyWithImage(element, url){
    fabric.Image.fromURL(url, function(oImg) {
        if (oImg._element != null) {
            targetElement = element;
            targetElement.category = "custom";
            editElement();
            oImg.set({
                originX: 'center',
                originY: 'center',
                left: tempPoly.left,
                top: tempPoly.top,
                width: radius,
                height: radius
            });
            canvas.remove(tempPoly);
            tempPoly = oImg;
            initTargetElement();
        }
    });
}

function toggleElements(){
    var visible = elementsStatus=='show';
    canvas.forEachObject(function(el){
        if (el.class == 'element' || el.class == 'group'){
            el.setVisible(visible);
        }
    });
    canvas.renderAll();
}

function nameElement(type, original){
    var newName;
    if (type == 'new'){
        newName = parseInt(original + 1);
        do {
            newName ++;
        } while (elementsInfo.hasOwnProperty('element-' + newName))

        return 'element-' + newName;
    } else if (type == 'clone'){
        newName = original;
        do {
            newName += '-clone';
        } while (elementsInfo.hasOwnProperty(newName))

        return newName;
    }
}

/**
 * Animates an element to a state
 * @param element
 * @param left
 * @param top
 * @param opacity
 * @param easing
 * @param duration
 */
function animateElement(element, left, top, opacity, easing, duration){
    element.animate({
        opacity: opacity,
        top: top,
        left: left
    }, {
        duration: duration,
        onChange: canvas.renderAll.bind(canvas),
        easing: easing
    });
}

function removeElements() {
    var objects = canvas.getObjects();
    for (var index = 0; index < objects.length; index ++){
        if (objects[index].class == 'element'){
            canvas.remove(objects[index]);
            index --;
        }
    }
    //canvas.forEachObject(function (element) {
    //    console.log(element);
    //    if ("element" == element.class) {
    //        element.animate({
    //            top: 0,
    //            left: 0
    //        }, {
    //            duration: 500,
    //            onChange: canvas.renderAll.bind(canvas),
    //            onComplete: function () {
    //                canvas.remove(element);
    //            }
    //        });
    //    }
    //});
}

function checkOtherElement(grid,obj){
    var check = false;
    var elements = canvas.getObjects();
    elements.forEach(function(element){
        if (element.id != obj.id && grid.id == element.position){
            check = true;
        }
    });
    return check;
}