//canvas.selection = false;

canvas.fireEventForObjectInsideGroup = true;
canvas.selectionColor = 'rgba(0,0,0,0)';
canvas.selectionBorderColor = 'white';
canvas.selectionLineWidth = 2;
canvas.selectionDashArray = [5, 5];

canvas.on('mouse:over', function(e) {
    if (tempInputMoving){
        return false;
    }
    if (e.target != null && e.target.class == "element") {
        if (tooltipObject != null && tooltipObject.id == e.target.id){
            return false;
        }
        if (newBezierLine != null){
            newBezierLine.set("stroke", "white");
            return false;
        }

        var coords = getObjPosition(e.target);
        // This is because of rotating point hovering prevent
        if (e.target.status != "highlighted") {
            if (coords.right > e.e.offsetX && coords.left < e.e.offsetX && coords.top < e.e.offsetY && coords.bottom > e.e.offsetY) {
                showImageTools(e.target);
            } else {
                setTimeout(removeImageTools,500);
            }
        } else {
            setTimeout(removeImageTools,500);
        }
        canvas.renderAll();
    } else if (e.target != null && e.target.class == "group") {
        if (!e.target.expanded) {
            showImageTools(e.target);
        } else {
            var mousePos = canvas.getPointer(e.e);
            var groupPos = getObjPosition(e.target), groupWidth = e.target.width, groupHeight = e.target.height;
            var objPos;
            e.target.forEachObject(function(el){
                objPos = getObjPosition(el);
                if (isPointInLocation(mousePos.x,mousePos.y,
                        {
                            left: groupPos.left + groupWidth / 2 + objPos.left,
                            right: groupPos.left + groupWidth / 2 + objPos.right,
                            top: groupPos.top + groupHeight / 2 + objPos.top,
                            bottom: groupPos.top + groupHeight / 2 + objPos.bottom
                        }
                    ))
                {
                    showImageTools(el, e.target);
                }
            });
        }
    } else if (e.target != null && e.target.class == "dot") {
        removeDotTooltip();
        addDotTooltip(e.target);
    } else if (e.target != null && e.target.class == "crosshair-line") {
        targetHudLine = e.target;
        targetHudLine.timer = setTimeout(function(){
            if (targetHudLine != null) {
                targetHudLine.set("selectable", true);
                canvas.setActiveObject(targetHudLine);
            }
        }, 2000);
    } else {
        setTimeout(removeImageTools,500);
        removeDotTooltip();
    }
});

canvas.on('mouse:out', function(e){
    if (e.target!= null){
        mouseOverElement = false;
    }
    if (e.target != null && e.target.class == "element") {
        if (newBezierLine != null){
            newBezierLine.set("stroke", "gray");
        }
    } else if (e.target != null && e.target.class == "crosshair-line") {
        clearTimeout(targetHudLine.timer);
        targetHudLine.set("selectable", false);
        canvas.deactivateAll();
    }
    canvas.renderAll();
});

canvas.on('mouse:move',function(moveEventOptions){
    if (tempInputMoving){
        return false;
    }

    if (mouseDown){
        mouseDrag = true;
    }

    if (newBezierLine != null){
        canvas.selectionBorderColor = 'transparent';
        var xPos = moveEventOptions.e.pageX, yPos = moveEventOptions.e.pageY, startX, startY, startElement = newBezierLine.startElement, distance, angle, factor = yPos>startElement.top?-1:1;
        if (startElement instanceof jQuery){
            startX = startElement.offset().left;
            startY = startElement.offset().top;
            newBezierLine.set({
                x1: startX,
                y1: startY,
                x2: xPos,
                y2: yPos
            });
        } else {
            startX = startElement.left;
            startY = startElement.top;
            distance = Math.sqrt(Math.pow(xPos - startX, 2) + Math.pow(yPos - startY, 2));
            angle = Math.acos((xPos - startX) / distance);
            var circleRadius = Math.sqrt(3) * (radius - border / 2) / 2;
            newBezierLine.set({
                x1: startX + circleRadius * Math.cos(angle) * startElement.scaleX,
                y1: startY - circleRadius * Math.sin(angle) * factor * startElement.scaleX,
                x2: xPos,
                y2: yPos
            });
        }
        canvas.renderAll();
        return false;
    } else {
        canvas.selectionBorderColor = 'white';
    }

    if (moveEventOptions.target != null && moveEventOptions.target.class == "group") {
        var mousePos = canvas.getPointer(moveEventOptions.e);
        var groupPos = getObjPosition(moveEventOptions.target), groupWidth = moveEventOptions.target.width, groupHeight = moveEventOptions.target.height;
        var objPos;
        moveEventOptions.target.forEachObject(function(el){
            objPos = getObjPosition(el);
            if (isPointInLocation(mousePos.x,mousePos.y,
                    {
                        left: groupPos.left + groupWidth / 2 + objPos.left,
                        right: groupPos.left + groupWidth / 2 + objPos.right,
                        top: groupPos.top + groupHeight / 2 + objPos.top,
                        bottom: groupPos.top + groupHeight / 2 + objPos.bottom
                    }
                ))
            {
                showImageTools(el, moveEventOptions.target);
            }
        });

    }
    if (moveEventOptions.target != null && moveEventOptions.target.class == "element") {
        //moveImageTools(moveEventOptions.target);
        //showImageTools(moveEventOptions.target);
    } else if (moveEventOptions.target != null && moveEventOptions.target.class != "dot") {
        removeDotTooltip();
    } else {
        setTimeout(removeImageTools,500);
    }
    var activeObject = canvas.getActiveObject();
    if (activeObject != null && activeObject.class == "tickbox" && mouseDrag) {
        activeObject.topText.set({
            left: activeObject.left,
            top: activeObject.top - 15
        });
        activeObject.rightText.set({
            left: activeObject.left + activeObject.scaleX * activeObject.width + 15,
            top: activeObject.top
        });
        activeObject.leftText.set({
            left: activeObject.left - 15,
            top: activeObject.top + activeObject.scaleY * activeObject.height
        });
        activeObject.bottomText.set({
            left: activeObject.left - 15,
            top: activeObject.top + activeObject.scaleY * activeObject.height + 5
        });
        activeObject.topText.setCoords();
        activeObject.rightText.setCoords();
        activeObject.leftText.setCoords();
        activeObject.bottomText.setCoords();
        canvas.renderAll();
    }
});

canvas.on('mouse:down',function(e){

    mouseDown = true;
    downPoint = {x: e.e.pageX, y: e.e.pageY};
    $("#new-element-div").hide();
    $("#ring-tags").hide();
    $("#tagger-files").hide();
    $("#tagger-json-apps").hide();
    $("#tagger-apps").hide();
    selectedRing = null;
    var object = e.target;
    if (object != null) {
        if (object.class == 'button') {
            if (object.id == 'add-new-shape') {
                if (object.category == 'hexagon') {
                    getElementName('hex', object.left, object.top);
                } else if (object.category == 'circle'){
                    getElementName('circle', object.left, object.top);
                }
            } else if (object.id == 'add-new-text') {
                showNotification("Click where to put text cell.");
                nextAction = 'add-text-cell'
            } else if (object.id == 'add-new-box') {
                showNotification("Drag where to put text box.");
                nextAction = 'add-tickbox';
            } else if (object.id == 'add-new-line') {
                showNotification("Point where to put line and direction.");
                nextAction = 'add-new-line';
            } else if (object.id == 'change-hud-line') {
                if (targetHudLine != null){
                    //var text = targetHudLine.text;
                    //if (text.indexOf("+") > -1){
                    //    targetHudLine.text = text.replace(/[+\s]/g, "--");
                    //} else {
                    //    targetHudLine.text = text.replace(/[-]{2}/g, "+ ");
                    //}
                    if (targetHudLine._objects[0].opacity == 0) {
                        targetHudLine._objects[0].opacity = 0.5;
                        targetHudLine._objects[1].opacity = 0;
                    } else {
                        targetHudLine._objects[0].opacity = 0;
                        targetHudLine._objects[1].opacity = 0.5;
                    }
                }
            }
        } else if (object.class == 'element') {
            if (resizable){
                object.setControlsVisibility({
                    mt: true,
                    mb: true,
                    ml: true,
                    mr: true,
                    tr: true,
                    tl: true,
                    br: true,
                    bl: true
                });
            } else {
                object.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                    tr: false,
                    tl: false,
                    br: false,
                    bl: false
                });
            }
            if (rotatable){
                object.set("hasRotatingPoint", true);
            } else {
                object.set("hasRotatingPoint", false);
            }
            if (targetElement == null) { // New Click
                if (tempPoly == null && tempText == null) {
                    //clockID = setInterval(holdElement, 1);
                    //targetElement = object;
                }
            } else {
                if (tempPoly != null && tempText != null) { // Another object is in edit mode
                    if (object != targetElement && object != tempPoly && object != tempText) {
                        initTargetElement();
                    }
                } else {                                    // object was just clicked
                    //clockID = setInterval(holdElement, 1);
                    //targetElement = object;
                }
            }
            if (object.status == "highlighted"){
                unhighlightGroup();

                if (ungrouping){
                    if (object.isParent){
                        showNotification("You cannot ungroup a parent.");
                    } else {
                        var targetIndex = 0;
                        for (var i = 0; i < ungroupedObjects.length; i++) {
                            if (ungroupedObjects[i].id == object.id) {
                                //ungroupedObjects[i].set({
                                //    top: ungroupedObjects[i].top
                                //});
                                targetIndex = i;
                                break;
                            }
                        }
                        ungroupedObjects.splice(targetIndex, 1);
                    }
                    group(ungroupedObjects);
                    ungroupedObjects = [];
                    groupTarget = null;
                    ungrouping = false;
                } else {
                    if (groupTarget.type == "group"){
                        groupTarget.forEachObject(function(el){
                            el.isParent = false;
                        });
                    } else {
                        for (var j = 0; j < groupTarget.length; j ++){
                            groupTarget[j].isParent = false;
                        }
                    }
                    object.isParent = true;
                    group(groupTarget);
                }
            }
        } else if (object.class == "grid") {
            initTargetElement();

        } else if (object.class == "dot") {
            if (object.id == "dot1") {
                if (groupTarget != null && groupTarget.class == "group") {
                    if (groupTarget.expanded) {
                        collapseGroup(groupTarget);
                    } else {
                        expandGroup(groupTarget);
                    }
                }
            } else if (object.id == "dot2") {
                if (groupTarget != null && groupTarget.class == "group") {
                    unGroup(groupTarget);
                    if (groupTargetClock == 0) {
                        groupTargetClock = setInterval(highlightGroup, 600);
                    }
                    showNotification("Select an element to ungroup or <span id='ungroup-all'>Ungroup All</span>");
                    $("#ungroup-all").on("click", function () {
                        unhighlightGroup();
                        ungrouping = false;
                    });
                    ungrouping = true;
                } else {
                    var objects;
                    if (groupTarget.type == "group") {
                        objects = groupTarget.getObjects();
                    } else {
                        objects = groupTarget;
                    }
                    groupTarget = [];
                    objects.forEach(function (el) {
                        if (el.class != "group") {
                            groupTarget.push(el);
                            el.set({
                                status: ""
                            });
                        } else {
                            el.forEachObject(function (ell) {
                                ell.set({
                                    status: ""
                                });
                                groupTarget.push(ell);
                            });
                            unGroup(el);
                        }
                    });
                    if (groupTargetClock == 0) {
                        groupTargetClock = setInterval(highlightGroup, 600);
                    }
                    showNotification("Select an element to be parent");
                }
            } else if (object.id == "dot3") {
                if (groupTarget != null && groupTarget.class == "group") {
                    groupTarget.cornerStyle = 'circle';
                    groupTarget.cornerColor = 'white';
                    groupTarget.setControlsVisibility({
                        mt: true,
                        mb: true,
                        ml: true,
                        mr: true,
                        tr: true,
                        tl: true,
                        br: true,
                        bl: true
                    });
                    groupTarget.hasRotatingPoint = true;
                    setTimeout(function () {
                        groupTarget.setControlsVisibility({
                            mt: false,
                            mb: false,
                            ml: false,
                            mr: false,
                            tr: false,
                            tl: false,
                            br: false,
                            bl: false
                        });
                        groupTarget.hasRotatingPoint = false;
                        canvas.renderAll();
                    }, 5000);
                    expandGroup(groupTarget);
                    canvas.setActiveObject(groupTarget);
                    canvas.renderAll();
                    //unGroup(groupTarget);
                }
            }
            removeDotTooltip();
            removeThreeDots();
            canvas.renderAll();
        } else if (object.class == "ring") {
            //var textPos = {left: object.left + object._objects[1].left, top: object.top + object._objects[1].top};
            selectedRing = object;
            var $select = $("#ring-tags");
            $select.html("<option>Select tag</option>");
            $("#tags-list").val().split(",").forEach(function (word) {
                $("#ring-tags").append($("<option></option>", {
                    text: word.trim(),
                    value: word.trim()
                }));
            });
            $select.css({
                left: object.left - 30,
                top: object.top + object._objects[1].top - 10
            }).show();
        } else if (object.class == "new-bezier-point") {
            newBezierLine = new fabric.Line([downPoint.x, downPoint.y, downPoint.x, downPoint.y], {
                fill: 'gray',
                stroke: 'gray',
                strokeWidth: 2,
                selectable: false,
                opacity: 0.5
            });
            newBezierLine.startElement = e.target.master;
            canvas.add(newBezierLine);
            canvas.renderAll();
        } else if (object.class == "bezier-start-point" || object.class == "bezier-end-point") {
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
                left: e.e.pageX + 20,
                top: e.e.pageY,
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
                left: e.e.pageX + 54,
                top: e.e.pageY,
                position: "absolute"
            }).appendTo("body");

            setTimeout(function () {
                $(".bezier-line-control-btn").remove();
                rmBezierLine = null;
            }, 2000);
        } else if (object.class == 'element-tick-button') {
            if (object.checked) {
                object._objects[1].setSrc("assets/images/icons/check-o-gray-16.png");
                object._objects[1].set({width: 16, height: 16, angle: 0});
                object.checked = false;
            } else {
                object._objects[1].setSrc("assets/images/icons/check-o-16.png");
                object._objects[1].set({width: 16, height: 16, angle: 0});
                object.checked = true;
            }
        } else if (object.class == 'crosshair-line') {
            if (canvas.getActiveObject() == object) return;
            fabric.Image.fromURL("./assets/images/icons/plug-24.png", function(oImg) {
                var rect = new fabric.Rect({
                    left: 0,
                    top: 0,
                    width: buttonSize,
                    height: buttonSize,
                    fill: buttonColor,
                    strokeWidth: 2
                });
                // scale image down, and flip it, before adding it onto canvas
                oImg.set({left: 0, top: 0, angle: 0});
                var btn = new fabric.Group([rect, oImg], {
                    left: downPoint.x + 30,
                    top: downPoint.y - 30,
                    id: 'change-hud-line',
                    class: 'button',
                    isTemporary: true,
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    draggable: false,
                    hasBorders: false,
                    hasControls: false,
                    hasRotatingPoint: false
                });

                canvas.add(btn);
                setTimeout(function(){
                    canvas.remove(btn);
                    canvas.renderAll();
                }, 2000);
            });
        } else {
            if (canvas.getActiveGroup() == object || canvas.getActiveObject() == object) {
                showContextMenu = true;
            }
        }

    } else {
        initTargetElement();
        if (groupTargetClock > 0){
            clearInterval(groupTargetClock);
            groupTargetClock = 0;
            if (ungrouping){
                group(groupTarget);
                ungrouping = false;
            } else {
                groupTarget.forEach(function(el){
                    el.set({
                        status: ""
                    });
                });
            }
        }

        if (nextAction == 'add-text-cell'){
            addTextTooltip(downPoint.x, downPoint.y);
            nextAction = '';
        }
    }
});

canvas.on('mouse:up',function(e){
    mouseDown = false;

    if (newBezierLine != null){
        if (e.target != null){
            if (e.target.class == 'element' && newBezierLine.startElement != e.target){
                addBezierLine(newBezierLine.startElement, e.target);
                canvas.discardActiveObject();
            }
        }
        canvas.remove(newBezierLine);
        newBezierLine = null;
        canvas.renderAll();
        return false;
    }

    if (mouseDrag && e.target == null){
        var upPoint = {x: e.e.pageX, y: e.e.pageY};
        if (nextAction == 'add-tickbox'){
            var x1 = downPoint.x > upPoint.x ? upPoint.x : downPoint.x;
            var x2 = downPoint.x < upPoint.x ? upPoint.x : downPoint.x;
            var y1 = downPoint.y > upPoint.y ? upPoint.y : downPoint.y;
            var y2 = downPoint.y < upPoint.y ? upPoint.y : downPoint.y;
            drawTickBox(x1, y1, x2, y2);
            nextAction = '';
            return;
        } else if (nextAction == 'add-new-line') {
            var offsetX = Math.abs(upPoint.x - downPoint.x), offsetY = Math.abs(upPoint.y - downPoint.y), direction = offsetX > offsetY ? "horizontal" : "vertical";
            addCrosshairLine(direction, offsetX > offsetY ? downPoint.y : downPoint.x);
            nextAction = '';
            return;
        }
        if (canvas.getActiveGroup() == null && canvas.getActiveObject() == null) {
            if (Math.abs(downPoint.x - upPoint.x) < 20 && Math.abs(downPoint.y - upPoint.y) < 20) {
                window.scrollTo(downPoint.x - window.innerWidth / 2, downPoint.y - window.innerHeight / 2);
            } else if (Math.abs(downPoint.x - upPoint.x) > 20 && Math.abs(downPoint.y - upPoint.y) > 20) {
                window.scrollTo(downPoint.x - window.innerWidth / 2, downPoint.y - window.innerHeight / 2);
                addAddButtons(downPoint.x, downPoint.y);

                regexSearchCount++;
                var box = $('<div/>', {
                    id: 'regex-search-box-'+regexSearchCount,
                    'class': 'regex-search-box empty'
                }).css({
                    top: downPoint.y + 40,
                    left: downPoint.x
                }).appendTo('body');

                $('<span></span>', {
                    class: 'remove-regex-search',
                    text: 'x',
                    title: 'Remove RegEx search'
                }).css({
                    position: 'absolute',
                    top: '25px',
                    left: '-10px',
                    cursor: 'pointer',
                    color: 'white'
                }).on("click", function(){
                    $(this).parent().remove();
                    canvas.forEachObject(function (obj) {
                        if (obj.class === 'element') {
                            obj.setVisible(true);
                            obj.newPoint.setVisible(true);
                            obj.lines.forEach(function(line){
                                line.setVisible(true);
                                line.leftCircle.setVisible(true);
                                line.rightCircle.setVisible(true);
                            });
                            $(".regex-search-input").each(function(i,el){
                                var regexExp = new RegExp($(el).val().toUpperCase(), "g");
                                if (!regexExp.test(obj.datatext.toUpperCase()) && !regexExp.test(obj.item(1).getText().toUpperCase()) && !regexExp.test(obj.id.toString().toUpperCase())) {
                                    obj.setVisible(false);
                                    obj.newPoint.setVisible(false);
                                    obj.lines.forEach(function(line){
                                        line.setVisible(false);
                                        line.leftCircle.setVisible(false);
                                        line.rightCircle.setVisible(false);
                                    });
                                }
                            });
                        }
                    });
                    canvas.renderAll();
                    regexSearchCount--;
                }).appendTo(box).hide();

                $('<input/>',{
                    type: 'text',
                    class: 'regex-search-input',
                    id: 'regex-search-input-'+regexSearchCount
                }).on('keyup', function(e){
                    $(this).parent().removeClass('empty');
                    $(this).parent().find(".remove-regex-search").show();
                    if (parseInt($(this).parent().css("left")) + parseInt($(this).css("width")) + 20 < canvas.getWidth()) {
                        $(this).css("width", ($(this).val().length + 1) * 20 + "px");
                    }
                    if (e.keyCode === 13) {
                        var regexExp = new RegExp($(this).val().toUpperCase(), "g");
                        canvas.forEachObject(function (obj) {
                            if (obj.class === 'element') {
                                //obj.setVisible(true);
                                if (!regexExp.test(obj.datatext.toUpperCase()) && !regexExp.test(obj.item(1).getText().toUpperCase()) && !regexExp.test(obj.id.toString().toUpperCase())) {
                                    obj.setVisible(false);
                                    obj.newPoint.setVisible(false);
                                    obj.lines.forEach(function(line){
                                        line.setVisible(false);
                                        line.leftCircle.setVisible(false);
                                        line.rightCircle.setVisible(false);
                                    });
                                }
                            }
                        });
                        canvas.renderAll();
                        $(this).attr('readonly', true);
                        $(this).parent().find(".suggest-list").remove();
                    } else {
                        var txt = $(this).val(),parent='#'+$(this).parent().attr('id');
                        if (regexTimer){
                            clearTimeout(regexTimer);
                        }
                        regexTimer = setTimeout(function(){regexSearch(parent,txt);}, 300);
                        $(this).parent().find(".suggest-list").hide();
                    }
                }).appendTo(box).focus();

                $('<ul></ul>', {
                    'class': 'suggest-list'
                }).appendTo(box);

                //var list = $("#auto-suggest").val().split(',');
                //list.forEach(function(word){
                //    if (word !== ''){
                //        $('<li></li>',{
                //            text: word
                //        }).on("click", function(){
                //            $("#regex-search").val($(this).html());
                //            $("#regex-search-box").find(".suggest-list").hide().find("li").show();
                //        }).appendTo("#regex-search-box > .suggest-list");
                //    }
                //});
            }
        }
    }

    setTimeout(function(){
        $(".regex-search-box.empty").remove();
    }, 2000);

    var obj = e.target;
    if (obj != null && obj.class == 'dot'){
        obj.setOpacity(0);
    }
    mouseDrag = false;

    canvas.renderAll();
});

canvas.on('mouse:dblclick', function (e) {
    var object = e.target;
    if (object != null) {
        if (object.class == 'element') {
            return;
            targetElement = object;
            editElement();
        }
    }
});

canvas.on('before:selection:cleared', function(e){
    if (e.target != null && e.target.class == "b-point") {
        if (e.target.name == "p0" || e.target.name == "p2") {
            e.target.control.animate('opacity', '0', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas)
            });
            e.target.control.selectable = false;
        }
        else if (e.target.name == "p1") {
            e.target.animate('opacity', '0', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas)
            });
            e.target.selectable = false;
        }
    } else if (e.target != null && e.target.class == 'boundary-text') {
        e.target.set("opacity", 0);
        canvas.renderAll();
    }
});

canvas.on('object:selected', function(e){
    var obj = null;
    if (e.target.class == "group"){
        e.target.borderDashArray = [5, 5];
        addThreeDots(e.target);
    } else if (e.target.class == "b-point") {
        if (e.target.name == "p0" || e.target.name == "p2") {
            e.target.control.animate('opacity', '1', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas)
            });
            e.target.control.selectable = true;
        }
    } else if (e.target.class == "boundary-text") {
        e.target.set("opacity", 1);
        canvas.renderAll();
    } else if (e.target.class != "group"){
        obj = canvas.getActiveGroup();
        if (obj != null){
            var isElementGroup = true;
            obj._objects.forEach(function(_obj){
                if (_obj.class != "element") {
                    isElementGroup = false;
                }
            });
            if (!isElementGroup) {
                canvas.deactivateAll();
                return;
            }
            obj.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                tr: false,
                tl: false,
                br: false,
                bl: false
            });

            obj.hasRotatingPoint = false;
            obj.borderColor = "white";
            obj.borderDashArray = [5, 5];
            addThreeDots(obj);
        }
    }
});

canvas.on('object:moving', function(e){

    e.target.setCoords();
    if (e.target == tempPoly || e.target == tempText){
        var polyPos = getObjPosition(tempPoly);
        var textPos = getObjPosition(tempText);
        if (polyPos.left > textPos.left){
            tempText.set({
                left: polyPos.left+tempText.getWidth() / 2
            });
        }
        if (polyPos.right < textPos.right){
            tempText.set({
                left: polyPos.right-tempText.getWidth() / 2
            });
        }
        if (polyPos.top > textPos.top){
            tempText.set({
                top: polyPos.top+tempText.getHeight() / 2
            });
        }
        if (polyPos.bottom < textPos.bottom){
            tempText.set({
                top: polyPos.bottom-tempText.getHeight() / 2
            });
        }
        canvas.renderAll();
    }
    if (e.target.class == 'element') {
        var pos = nearPosition(e.e.offsetX, e.e.offsetY), isInTickbox = false;
        if (snapToGrid) {
            e.target.set({
                left: pos.left,
                top: pos.top,
                position: pos.id
            });

        } else {
            e.target.set({
                position: pos.id
            });
        }
        elementsInfo[e.target.id].x = e.target.left;
        elementsInfo[e.target.id].y = e.target.top;

        tickBoxes.forEach(function(tickBox){
            if (e.target.tickButton.checked && !(e.target.intersectsWithObject(tickBox) || tickBox.intersectsWithObject(e.target))){
                isInTickbox = true;
            }
        });
        if (isInTickbox){
            e.target.set({
                scaleX: 1,
                scaleY: 1
            });
            e.target.tickButton.set({
                scaleX: 1,
                scaleY: 1
            });
        }

        e.target.newPoint.set({
            left: e.target.left,
            top: e.target.top - e.target.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
        });
        e.target.newPoint.setCoords();
        e.target.tickButton.set({
            left: e.target.left + e.target.scaleX * radius,
            top: e.target.top - e.target.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
        });
        e.target.tickButton.setCoords();
        e.target.lines.forEach(function(line){
            adjustLine(line);
        });
        canvas.discardActiveObject();

        canvas.renderAll();
    } else if (e.target.class == 'group' || e.target == canvas.getActiveGroup()){
        var obj = e.target.class == 'group'? e.target: canvas.getActiveGroup(), offsetX = obj.left + obj.width / 2, offsetY = obj.top + obj.height / 2;
        moveThreeDots(obj);
        obj._objects.forEach(function(shape){
            if (shape.class == "element") {
                shape.newPoint.set({
                    left: offsetX + shape.left,
                    top: offsetY + shape.top - e.target.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
                });
                shape.newPoint.setCoords();
                shape.tickButton.set({
                    left: offsetX + shape.left + e.target.scaleX * radius,
                    top: offsetY + shape.top - e.target.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
                });
                shape.tickButton.setCoords();
                shape.lines.forEach(function (line) {
                    adjustLine(line);
                });
            }
        });
    } else if (e.target.class == "b-point") {

        if (e.target.line) {
            e.target.line.path[1][1] = e.target.left;
            e.target.line.path[1][2] = e.target.top;
        }
        adjustLine(e.target.line);
    } else if (e.target.class == "crosshair-line") {
        if (e.target.category == "vertical") {
            e.target.set("top", 0);
        } else {
            e.target.set("left", 0);
        }
    }
    if (e.e.offsetY > window.scrollY + window.innerHeight){
        window.scrollTo(window.scrollX, window.scrollY + Math.sqrt(3) * radius / 2);
    }
    if (e.e.offsetX > window.scrollX + window.innerWidth - 30) {
        window.scrollTo(window.scrollX + radius, window.scrollY);
    }
    if (e.e.offsetY < window.scrollY){
        window.scrollTo(window.scrollX, window.scrollY - Math.sqrt(3) * radius / 2);
    }
    if (e.e.offsetX < window.scrollX + 30) {
        window.scrollTo(window.scrollX - radius, window.scrollY);
    }
    removeImageTools(true);
});

canvas.on('object:scaling', function(e){
    if (e.target.class == "tickbox") {
        e.target.set({
            scaleX: 1,
            scaleY: 1
        });
        if (e.e.pageX < e.target.left + e.target.width / 4) {
            e.target.set({
                left: e.e.pageX,
                width: e.target.width - e.e.movementX
            });
        } else if (e.e.pageX > e.target.left + 3 * e.target.width / 4) {
            e.target.set({
                width: e.e.pageX - e.target.left
            })
        }
        if (e.e.pageY < e.target.top + e.target.height / 4) {
            e.target.set({
                top: e.e.pageY,
                height: e.target.height - e.e.movementY
            });
        } else if (e.e.pageY > e.target.top + 3 * e.target.height / 4) {
            e.target.set({
                height: e.e.pageY - e.target.top
            })
        }
        e.target.setCoords();
        canvas.renderAll();
    }
});

canvas.on('selection:created', function(e){
    console.log(e);
});

canvas.on('selection:cleared', function(e){
    if (threeDots != null){
        removeThreeDots();
    }
    groupTarget = null;
    if (e.target != null && e.target.class == 'group'){
        e.target.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            tr: false,
            tl: false,
            br: false,
            bl: false
        });
        e.target.hasRotatingPoint = false;
        canvas.renderAll();
    }
});

canvas.on('text:changed', function(e){
    if (e.target.class == "boundary-text"){
        var text = e.target.text, newText = "";
        text.split("\n").forEach(function(txt, i){
            if (i > 0) {
                newText = newText + " " + txt;
            } else {
                newText = txt;
            }
        });
        e.target.text = newText;
    }
});

function initTargetElement(){
    if (tempPoly != null && tempText != null) {
        //tempPoly.set({
        //    scaleX:1,
        //    scaleY:1
        //});
        //tempText.set({
        //    scaleX:1,
        //    scaleY:1,
        //    //fontSize: tempText.fontSize / 2
        //});
        var formatted = wrapCanvasText(tempText, canvas, radius, radius, 'center');

        var element = new fabric.Group([tempPoly, formatted], {
            left: tempPoly.left,
            top: tempPoly.top,
            id: targetElement.id,
            class: targetElement.class,
            category: targetElement.category,
            tags: targetElement.tags,
            checklistLabel: targetElement.checklistLabel,
            checklistCheckbox: targetElement.checklistCheckbox,
            comments: targetElement.comments,
            cornerStyle: 'circle',
            cornerColor: 'white',
            originX: 'center',
            originY: 'center',
            //scaleX:.5,
            //scaleY:.5,
            hasBorders: false,
            link: targetElement.link,
            datatext: targetElement.datatext
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
        canvas.remove(tempText);
        canvas.remove(tempPoly);
        canvas.renderAll();
    }
    targetElement = null;
    tempText = null;
    tempPoly = null;

}

function editElement(){
    canvas.remove(targetElement);
    var objects = splitElement(targetElement);
    tempPoly = objects[0];
    tempText = objects[1];
    //tempPoly = targetElement.getObjects()[0];
    //tempText = targetElement.getObjects()[1];
    tempPoly.set({
        left: targetElement.left,
        top: targetElement.top,
        originX: 'center',
        originY: 'center',
        //scaleX: 2,
        //scaleY: 2,
        //hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false
    });
    canvas.add(tempPoly);

    //var tempTextArea = document.createElement('textarea');
    //tempTextArea.className = 'temp';
    //tempTextArea.innerText = tempText.text;
    //$(tempTextArea).css('left',targetElement.left-radius).css('top',targetElement.top-radius);
    //$('body').append(tempTextArea);
    //canvas.remove(tempText);
    //$("textarea.temp").focus();


    tempText.set({
        //left: tempText.left,
        //top: tempText.top,
        //originX: 'center',
        //originY: 'center',
        //scaleX: 2,
        //scaleY: 2,
        //hasBorders: false,
        //fontSize: 2 * tempText.fontSize,
        hasControls: false,
        hasRotatingPoint: false
    });
    canvas.add(tempText);

    //canvas.add(new fabric.IText(tempText.getText(),{
    //    left: tempText.left,
    //    top: tempText.top,
    //    lineHeight: 1,
    //    originX: 'center',
    //    originY: 'center',
    //    fontFamily: tempText.fontFamily,
    //    //fontSize: 20,
    //    fontSize: tempText.fontSize,
    //    fill: tempText.fill
    //}));
    canvas.renderAll();

    //tempText.enterEditing();
    //tempText.hiddenTextarea.focus();
    //tempText.off('editing:exited');
    //tempText.on('editing:exited', function () {
    //    initTargetElement();
    //});

}
//function holdElement(){
//    holdTime ++;
//    if (holdTime > 200){
//        clearInterval(clockID);
//        if (targetElement.class == "element"){
//
//            canvas.remove(targetElement);
//            unGroup(targetElement);
//            tempPoly = targetElement.getObjects()[0];
//            tempText = targetElement.getObjects()[1];
//            tempPoly.set({
//                left: targetElement.left,
//                top: targetElement.top,
//                originX: 'center',
//                originY: 'center',
//                //scaleX: 2,
//                //scaleY: 2,
//                //hasBorders: false,
//                hasControls: false,
//                hasRotatingPoint: false
//            });
//            tempText.set({
//                left: targetElement.left,
//                top: targetElement.top,
//                originX: 'center',
//                originY: 'center',
//                //scaleX: 2,
//                //scaleY: 2,
//                //hasBorders: false,
//                hasControls: false,
//                hasRotatingPoint: false
//            });
//            canvas.renderAll();
//            tempText.off('editing:exited');
//            tempText.on('editing:exited', function () {
//                initTargetElement();
//            });
//        }
//    }
//}
