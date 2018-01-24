function group(activeObject){
    var objects;
    if (activeObject.type == 'group') {
        objects = activeObject.getObjects();
    } else {
        objects = activeObject;
    }
    if (objects.length < 2){
        return;
    }
    removeThreeDots();
    var target = new fabric.Group(objects);
    target.clone(
        function (newgroup) {
            canvas.discardActiveGroup();
            objects.forEach(function (object) {
                canvas.remove(object);
            });
            newgroup.id = 'group' + groups.length;
            newgroup.class = 'group';
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

            var randomAngle = (Math.round(Math.random() * 20) + 5) * Math.pow(-1,Math.round(Math.random()));
            newgroup.setAngle(randomAngle);
            canvas.add(newgroup);
            collapseGroup(newgroup);
            groups.push(newgroup);
        },
        ['class', 'id', 'category', 'status', 'cornerStyle', 'cornerColor', 'isParent', 'datatext', 'progress', 'tags', 'comments', 'checklistLabel', 'checklistCheckbox', 'position', 'beatTab', 'beatTabText', 'jsonObjects', 'lines', 'newPoint']
    );
}

function unGroup(activeObject){
    var items = activeObject._objects,
        offsetX = activeObject.left + activeObject.width / 2,
        offsetY = activeObject.top + activeObject.height / 2;
    activeObject._restoreObjectsState();
    canvas.remove(activeObject);
    ungroupedObjects = [];
    for(var i = 0; i < items.length; i++) {
        items[i].opacity = 1;
        items[i].hasBorders = false;
        items[i].setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            tr: false,
            tl: false,
            br: false,
            bl: false
        });
        if (items[i].class == 'element'){
            items[i].hasRotatingPoint = true;
        } else {
            items[i].hasRotatingPoint = false;
        }
        if (activeObject.expanded == false) {
            items[i].left = offsetX + items[i].originLeft;
            items[i].top = offsetY + items[i].originTop;
        }
        canvas.add(items[i]);
        ungroupedObjects.push(items[i]);
    }
}

function collapseGroup(obj){
    var top,left;
    obj.forEachObject(function(el){
       if(el.isParent){
            top = el.top;
            left = el.left;
        }
    });
    obj.forEachObject(function(el){
        el.originLeft = el._originalLeft;
        el.originTop = el._originalTop;

       if(el.isParent) {
            el.animate('opacity',1,{
                duration: 500,
                onChange: canvas.renderAll.bind(canvas)
            })
        } else {
            el.status = "";
            el.animate({
                top: top,
                left: left,
                opacity: 0
           },{
                duration: 500,
                onChange: canvas.renderAll.bind(canvas),
                onComplete: function () {
                }
            });
        }
    });
    obj.expanded = false;
}

function expandGroup(obj){
    obj.forEachObject(function(el) {
        el.animate({
            top: el.originTop,
            left: el.originLeft,
            opacity: 1
        }, {
            duration: 500,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function () {
            }
        });
    });
    obj.expanded = true;

}

function addThreeDots(obj){
    if (threeDots != null){
        removeThreeDots();
    }
    var left={x:0,y:0},right={x:0,y:0}, angle = obj.angle % 360, coords = obj.oCoords;
    left.x = coords.tl.x;
    left.y = coords.tl.y;
    right.x = coords.tr.x;
    right.y = coords.tr.y;
    //if (angle >= 0 && 90 > angle){
    //    left.x = coords.tl.x;
    //    left.y = coords.tl.y;
    //    right.x = coords.tr.x;
    //    right.y = coords.tr.y;
    //} else if (angle >= 90 && 180 > angle){
    //    left.x = coords.bl.x;
    //    left.y = coords.bl.y;
    //    right.x = coords.tl.x;
    //    right.y = coords.tl.y;
    //} else if (angle >= 180 && 270 > angle){
    //    left.x = coords.br.x;
    //    left.y = coords.br.y;
    //    right.x = coords.bl.x;
    //    right.y = coords.bl.y;
    //} else {
    //    left.x = coords.tr.x;
    //    left.y = coords.tr.y;
    //    right.x = coords.br.x;
    //    right.y = coords.br.y;
    //}
    var dot1 = new fabric.Circle({
        class: "dot",
        id: "dot1",
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        left: (left.x + right.x) / 2 + 20 * Math.sin(Math.PI * angle / 180) - 20 * Math.sin(Math.PI * (90 - angle) / 180),
        top: (left.y + right.y) / 2 - 20 * Math.cos(Math.PI * angle / 180) - 20 * Math.cos(Math.PI * (90 - angle) / 180),
        radius: 5,
        fill: "white",
        opacity:.5
    });
    var dot2 = new fabric.Circle({
        class: "dot",
        id: "dot2",
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        left: (left.x + right.x) / 2 + 20 * Math.sin(Math.PI * angle / 180),
        top: (left.y + right.y) / 2 - 20 * Math.cos(Math.PI * angle / 180),
        radius: 5,
        fill: "white",
        opacity:.5
    });
    var dot3 = new fabric.Circle({
        class: "dot",
        id: "dot3",
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        left: (left.x + right.x) / 2 + 20 * Math.sin(Math.PI * angle / 180) + 20 * Math.sin(Math.PI * (90 - angle) / 180),
        top: (left.y + right.y) / 2 - 20 * Math.cos(Math.PI * angle / 180) + 20 * Math.cos(Math.PI * (90 - angle) / 180),
        radius: 5,
        fill: "white",
        opacity:.5
    });
    //var dots = new fabric.Group([dot1,dot2,dot3],{
    //    class: "dot",
    //    hasBorders: false,
    //    hasControls: false,
    //    hasRotatingPoint: false,
    //    top: obj.top - 20
    //});
    //dots.left = obj.left + obj.width / 2 - dots.width / 2;
    canvas.add(dot1);
    canvas.add(dot2);
    canvas.add(dot3);
    threeDots = [dot1, dot2, dot3];
    groupTarget = obj;
    canvas.renderAll();
}

function moveThreeDots(obj){
    //removeThreeDots();
    //addThreeDots(obj);
    var left={x:0,y:0},right={x:0,y:0}, angle = obj.angle % 360, coords = obj.oCoords;
    left.x = coords.tl.x;
    left.y = coords.tl.y;
    right.x = coords.tr.x;
    right.y = coords.tr.y;

    threeDots.forEach(function(dot, index){
        dot.set({
            top: (left.y + right.y) / 2 - 20 * Math.cos(Math.PI * angle / 180) + (index - 1) * 20 * Math.cos(Math.PI * (90 - angle) / 180),
            left: (left.x + right.x) / 2 + 20 * Math.sin(Math.PI * angle / 180) + (index - 1) * 20 * Math.sin(Math.PI * (90 - angle) / 180)
        });
        dot.setCoords();
    });
    canvas.renderAll();
}

function removeThreeDots(){
    if (threeDots != null) {
        threeDots.forEach(function (dot) {
            canvas.remove(dot);
        });
        //threeDots = null;
        canvas.renderAll();
    }
}

function addDotTooltip(e){
    if (groupTarget != null) {
        var tip = document.createElement("div");
        tip.id = "dot-tooltip";
        if (e.id == "dot1") {
            if (groupTarget.class == "group" && groupTarget.expanded) {
                tip.innerHTML = "Shrink";
                $("body").append(tip);
            } else if (groupTarget.class == "group" && !groupTarget.expanded) {
                tip.innerHTML = "Expand";
                $("body").append(tip);
            }
        } else if (e.id == "dot2") {
            if (groupTarget.class == "group") {
                tip.innerHTML = "Ungroup";
                $("body").append(tip);
            } else {
                var check = false, objects;
                if (groupTarget.type == "group"){
                    objects = groupTarget.getObjects();
                } else {
                    objects = groupTarget;
                }
                objects.forEach(function(el){
                    if (el.class == "group"){
                        check = true;
                    }
                });
                if (check){
                    tip.innerHTML = "Merge into Group";
                } else {
                    tip.innerHTML = "Group";
                }
                $("body").append(tip);
            }
        } else if (e.id == "dot3") {
            if (groupTarget.class == "group") {
                tip.innerHTML = "Rotate/Resize";
                $("body").append(tip);
            }
        }
        tip.style.left = e.left - $(tip).css("width").split("px")[0] / 2 + "px";
        tip.style.top = e.top - $(tip).css("height").split("px")[0] - 30 + "px";
    }
}

function removeDotTooltip(){
    $("#dot-tooltip").remove();
}

function highlightGroup(){
    var top, easing;
    if (groupTarget.type == "group") {
        groupTarget.forEachObject(function (el) {
            el.status = "highlighted";
            if (el.direction == null || el.direction == "down") {
                el.direction = "up";
                top = el.top - 10;
                easing = fabric.util.ease.easeOutQuart
            } else {
                el.direction = "down";
                top = el.top + 10;
                easing = fabric.util.ease.easeInQuart;
            }
            el.animate('top', top, {
                duration: 500,
                onChange: canvas.renderAll.bind(canvas),
                easing: easing
            });
        });
    } else {
        for (var i = 0; i < groupTarget.length; i ++){
            groupTarget[i].status = "highlighted";
            if (groupTarget[i].direction == null || groupTarget[i].direction == "down") {
                groupTarget[i].direction = "up";
                top = groupTarget[i].top - 10;
                easing = fabric.util.ease.easeOutQuart
            } else {
                groupTarget[i].direction = "down";
                top = groupTarget[i].top + 10;
                easing = fabric.util.ease.easeInQuart;
            }
            groupTarget[i].animate('top', top, {
                duration: 500,
                onChange: canvas.renderAll.bind(canvas),
                easing: easing
            });
        }
    }
}

function unhighlightGroup(){
    if (groupTargetClock != 0){
        clearInterval(groupTargetClock);
        groupTargetClock = 0;
    }
    if (groupTarget.type == 'group') {
        groupTarget.forEachObject(function (el) {
            el.status = "";
        });
    } else {
        for (var i = 0; i < groupTarget.length; i ++){
            groupTarget[i].status = "";
        }
    }
    canvas.renderAll();
}