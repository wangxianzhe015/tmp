function showRing(){
    var ringRadius = window.innerWidth / 2;

    makeOneRing("100%", ringRadius, 5, 0.25);
    makeOneRing("99%", ringRadius * 0.85, 30, 0.25, [5,5]);
    makeOneRing("95%", ringRadius * 0.75, 5, 0.25);
    makeOneRing("90%", ringRadius * 0.5, 3, 0.5);
    makeOneRing("85%", ringRadius * 0.45, 1, 0.25);
    makeOneRing("80%", ringRadius * 0.35, 2, 0.25);

    $("<select></select>", {
        id: "ring-tags"
    }).on("change", function(){
        selectedRing._objects[1].text = $(this).val();
        canvas.renderAll();
        $(this).hide();
        selectedRing = null;
    }).appendTo("body");

    $("<img/>", {
        id: "ring-tween-btn",
        src: "./assets/images/icons/ring-24.png",
        "data-status": "tween"
    }).on({
        click: function(){
            var elements = [];
            if ($(this).attr("data-status") == "tween"){
                positionBeforeRing = {};
                canvas.forEachObject(function(obj){
                    if (obj.class == "element"){
                        elements.push(obj);
                    }
                });
                // First process rings with "%"
                rings.forEach(function(ring){
                    var tag = ring._objects[1].text, count = 0;
                    if (parseInt(tag) + "%" == tag){
                        for (var j = elements.length - 1; j >= 0; j --){
                            var element = elements[j];
                            if (element.progress == parseInt(tag)){
                                positionBeforeRing[element.id] = {left: element.left, top: element.top};
                                element.animate({
                                    scaleX: 0.75,
                                    scaleY: 0.75,
                                    top: ring.top - Math.cos(ring.angleUnit * (count + 1)) * ring._objects[0].radius,
                                    left: ring.left + Math.sin(ring.angleUnit * (count + 1)) * ring._objects[0].radius
                                }, {
                                    duration: 1000,
                                    onChange: canvas.renderAll.bind(canvas),
                                    easing: fabric.util.ease.easeOutCirc
                                });
                                elements.splice(j, 1);
                                count ++;
                            }
                        }
                    }
                });
                // Next process rings with tag
                rings.forEach(function(ring){
                    var tag = ring._objects[1].text, count = 0;
                    if (parseInt(tag) + "%" != tag){
                        for (var j = elements.length - 1; j >= 0; j --){
                            var element = elements[j];
                            if (element.tags.indexOf(tag) > -1){
                                positionBeforeRing[element.id] = {left: element.left, top: element.top};
                                element.animate({
                                    scaleX: 0.75,
                                    scaleY: 0.75,
                                    top: ring.top - Math.cos(ring.angleUnit * (count + 1)) * ring._objects[0].radius,
                                    left: ring.left + Math.sin(ring.angleUnit * (count + 1)) * ring._objects[0].radius
                                }, {
                                    duration: 1000,
                                    onChange: canvas.renderAll.bind(canvas),
                                    easing: fabric.util.ease.easeOutCirc
                                });
                                elements.splice(j, 1);
                                count ++;
                            }
                        }
                    }
                });
                $(this).attr("data-status", "untween");
            } else {
                canvas.forEachObject(function(obj){
                    if (obj.class == "element"){
                        elements.push(obj);
                    }
                });
                elements.forEach(function(element){
                    element.animate({
                        scaleX: 1,
                        scaleY: 1,
                        top: positionBeforeRing[element.id].top,
                        left: positionBeforeRing[element.id].left
                    }, {
                        duration: 1000,
                        onChange: canvas.renderAll.bind(canvas),
                        easing: fabric.util.ease.easeOutCirc
                    });
                });
                positionBeforeRing = null;
                $(this).attr("data-status", "tween");
            }
        }
    }).css({
        left: window.innerWidth,
        top: window.innerHeight
    }).appendTo("body");
}

function makeOneRing(title, ringRadius, width, opacity, dashPattern){
    dashPattern = typeof dashPattern !== 'undefined' ? dashPattern : [1, 0];

    var myCircle = new fabric.Circle({
        radius: ringRadius,
        fill: "transparent",
        opacity: opacity,
        strokeWidth: width,
        stroke: "white",
        strokeDashArray: dashPattern});

    var text = new fabric.IText(title, {
        fontSize: 12,
        textAlign: "center",
        left: ringRadius,
        top: 0,
        originX: "center",
        originY: "center",
        class: "ring-text",
        lineHeight: 12,
        fontFamily: "Helvetica",
        fontWeight: 'bold',
        fill: '#FFF',
        opacity:1
    });

    var ring = new fabric.Group([myCircle, text], {
        originX: "center",
        originY: "center",
        hasBorders: false,
        selectable: false,
        perPixelTargetFind: true,
        class: "ring",
        left: window.innerWidth,
        top: window.innerHeight,
        id: "ring-1"
    });

    ring.angleUnit = 1.5 * radius / ringRadius;

    rings.push(ring);
    canvas.add(ring);
    canvas.sendBackwards(ring);

}
