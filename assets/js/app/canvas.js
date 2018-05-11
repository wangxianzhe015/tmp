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
        targetHudLine.timer = setTimeout(function () {
            if (targetHudLine != null) {
                targetHudLine.set("selectable", true);
                canvas.setActiveObject(targetHudLine);
            }
        }, 2000);
    } else if (e.target != null && e.target.class == "tickbox") {
        removeImageTools(true);
        mouseOverElement = true;
        $("#json-object-id-tooltip").css({
            "left": e.target.left + e.target.width,
            "top": e.target.top
        }).show();
    } else if (e.target != null && e.target.class == "image-thumbnail") {
        //if (!e.target.resized) {
        //    e.target.set({
        //        scaleX: 1,
        //        scaleY: 1
        //    });
        //    e.target.setCoords();
        //    canvas.renderAll();
        //}
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
    } else if (e.target != null && e.target.class == "image-thumbnail") {
        //if (!e.target.resized) {
        //    e.target.set({
        //        scaleX: imageThumbnailSize.width / e.target.width,
        //        scaleY: imageThumbnailSize.height / e.target.height
        //    });
        //    e.target.setCoords();
        //}
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
        activeObject.bottomText.right = activeObject.left + activeObject.width;
        activeObject.bottomText.set({
            left: activeObject.bottomText.right - activeObject.bottomText.width,
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
    var object = e.target, event = e.e;
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
            } else if (object.id == 'add-new-background-textbox') {
                showNotification("Point where to put textbox.");
                nextAction = 'add-new-background-textbox';
            } else if (object.id == 'add-new-divider-textbox') {
                showNotification("Point where to put textbox.");
                nextAction = 'add-new-divider-textbox';
            } else if (object.id == 'textbox-bring-button') {
                object.master.backgroundBox.bringToFront();
                object.master.bringToFront();
            } else if (object.id == 'textbox-close-button') {
                if (object.master.bringButton != null) {
                    canvas.remove(object.master.bringButton);
                }
                if (object.master.tickButton != null) {
                    canvas.remove(object.master.tickButton);
                }
                if (object.master.class == "textbox-group") {
                    var boxes = object.master._objects;
                    for (var i = 0; i < boxes.length; i ++ ) {
                        canvas.remove(boxes[i].backgroundBox);
                        canvas.remove(boxes[i]);
                    }
                } else {
                    canvas.remove(object.master.backgroundBox, object.master, object).renderAll();
                }
            } else if (object.id == 'textbox-tick-button') {
                showNotification("Select a box!");
                nextAction = "textbox-tick";
                actionValue = object;
            } else if (object.id == 'textbox-convert-button') {
                if (object.master.mode == "simple") {
                    object.master.text = object.master.fullText;
                    object.master.mode = "full";
                } else {
                    object.master.text = object.master.simpleText;
                    object.master.mode = "simple";
                }
            } else if (object.id == 'change-hud-line') {
                changeCrosshairLine(object);
            } else if (object.id == 'close-image') {
                canvas.remove(object.target.convertButton, object.target.cropButton, object.target.moveButton, object.target, object);
                if (object.target.iframe instanceof jQuery) {
                    object.target.iframe.remove();
                }
                canvas.renderAll();
            } else if (object.id == 'crop-image') {
                var $iframeBody = object.target.iframe.contents().find("body"),
                    images = $iframeBody.find(".cropped-image-div"), $img, imageOffset,
                    parentOffset = object.target.iframe.offset(),
                    id, $annotationDiv, $newAnnotation;
                for (var i = 0; i < images.length; i++) {
                    $img = $(images[i]).find(".cropped-image");
                    imageOffset = $img.offset();

                    id = "cropped-image-" + parseInt(Math.random() * 1000000000000);

                    $annotationDiv = $(images[i]).find(".image-annotation");
                    if ($annotationDiv.length > 0) {
                        if ($annotationDiv.text().trim() != "") {
                            $newAnnotation = $("<div></div>", {
                                class: "cropped-image-annotation",
                                text: $annotationDiv.text(),
                                contentEditable: "true"
                            }).data({
                                target: id
                            }).css({
                                left: parentOffset.left + $annotationDiv.offset().left,
                                top: parentOffset.top + $annotationDiv.offset().top
                            }).draggable().on({
                                mousedown: function(e){
                                    if (e.originalEvent.which == 3) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }
                                    $(this).draggable("destroy");
                                    $(this).attr('contenteditable','false');
                                },
                                mouseup: function(){
                                    $(this).draggable();
                                    $(this).attr('contenteditable','true');
                                }
                            })
                            //    .draggable().click(function(){
                            //    if ( $(this).is('.ui-draggable-dragging') ) {
                            //        return;
                            //    }
                            //    $(this).draggable( "option", "disabled", true );
                            //    $(this).attr('contenteditable','true');
                            //})
                            //    .blur(function(){
                            //        $(this).draggable( 'option', 'disabled', false);
                            //        $(this).attr('contenteditable','false');
                            //    })
                                .appendTo("body");
                        } else {
                            $newAnnotation = undefined;
                        }
                    }

                    fabric.Image.fromURL($img.attr("src"), function (oImg) {
                        canvas.add(oImg);
                        oImg.setShadow({
                            color: '#000',
                            blur: 25,
                            offsetX: 0,
                            offsetY: 0,
                            opacity: 0.4
                        });

                        fabric.Image.fromURL("./assets/images/icons/remove-24.png", function (tImg) {
                            tImg.set({
                                left: oImg.left - buttonSize,
                                top: oImg.top,
                                id: 'close-cropped-image',
                                class: 'button',
                                scaleX: 2 / 3,
                                scaleY: 2 / 3,
                                selectable: false,
                                draggable: false,
                                hasBorders: false,
                                hasControls: false,
                                hasRotatingPoint: false
                            });

                            oImg.closeButton = tImg;
                            tImg.target = oImg;
                            canvas.add(tImg);
                            canvas.renderAll();
                        });


                        fabric.Image.fromURL("./assets/images/icons/external-24.png", function (tImg) {
                            tImg.set({
                                left: oImg.left - buttonSize,
                                top: oImg.top + buttonSize,
                                id: 'open-original-image',
                                class: 'button',
                                scaleX: 2 / 3,
                                scaleY: 2 / 3,
                                selectable: false,
                                draggable: false,
                                hasBorders: false,
                                hasControls: false,
                                hasRotatingPoint: false
                            });

                            oImg.originalButton = tImg;
                            tImg.target = object.target;
                            canvas.add(tImg);
                            canvas.renderAll();
                        });

                    },
                    {
                        left: parentOffset.left + imageOffset.left,
                        top: parentOffset.top + imageOffset.top,
                        width: $img.innerWidth(),
                        height: $img.innerHeight(),
                        class: "cropped-image",
                        id: id,
                        annotation: $newAnnotation,
                        strokeWidth: 1,
                        stroke: 'gray',
                        hasRotatingPoint: false,
                        hasBorders: false,
                        hasControls: false,
                        selectable: true
                    });
                }
                object.target.iframe.hide();
                object.target.closeButton.set({
                    visible: false
                });
                object.target.moveButton.set({
                    visible: false
                });
                object.set({
                    visible: false
                });
            } else if (object.id == 'close-cropped-image') {
                if (object.target.annotation) {
                    object.target.annotation.remove();
                }
                canvas.remove(object.target.originalButton, object.target, object);
                canvas.renderAll();
            } else if (object.id == 'open-original-image') {
                object.target.closeButton.set({
                    visible: true
                });
                object.target.cropButton.set({
                    visible: true
                });
                object.target.moveButton.set({
                    visible: true
                });
                object.target.iframe.contents().find(".cropped-image-div").remove();
                object.target.iframe.show();
            } else if (object.id =='convert-image') {
                if (object.target.iframe instanceof jQuery){
                    object.target.iframe.show();
                } else {
                    var id = "thumbnail-iframe-" + parseInt(Math.random() * 100000000);
                    var src = object.target._element.currentSrc;
                    var $iframe = $("<iframe></iframe>", {
                        src: window.location.href + "/image-marker/",
                        class: "thumbnail-iframe",
                        id: id
                    }).css({
                        left: object.target.left,
                        top: object.target.top,
                        width: object.target.width * object.target.scaleX,
                        height: object.target.height * object.target.scaleY
                    }).on({
                        load: function () {
                            var $that = $(this);
                            $(this).contents().find("img").attr("src", src);
                            setTimeout(function () {
                                $that[0].contentWindow.$("body").trigger("mousedown");
                            }, 500);
                        }
                    }).appendTo("body");

                    object.set({
                        visible: false
                    });
                    object.target.set({
                        visible: false
                    });

                    addCropButton(object.left, object.top, object.target);
                    addMoveButton(object.left, object.top + 1.5 * buttonSize, object.target);

                    object.target.iframe = $iframe;
                    canvas.renderAll();
                }
            }
        } else if (object.class == 'element') {
            elementDownHandler(object);
        } else if (object.class == "grid") {
            initTargetElement();
        } else if (object.class == "dot") {
            dotTooltipHandler(object);
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
            newBezierLine.startElement = object.master;
            canvas.add(newBezierLine);
            canvas.renderAll();
        } else if (object.class == "bezier-start-point" || object.class == "bezier-end-point") {
            bPointClickHandler(object, event);
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
            if (canvas.getActiveObject() == object || targetHudLine.changeButton != null) return;
            fabric.Image.fromURL("./assets/images/icons/plug-24.png", function (oImg) {
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

                targetHudLine.changeButton = btn;
                btn.target = targetHudLine;
                canvas.add(btn);
                setTimeout(function () {
                    canvas.remove(btn);
                    btn.target.changeButton = null;
                    canvas.renderAll();
                }, 2000);
            });
        } else if (object.class == "cross-point") {
            object.set({
                opacity: ((object.opacity * 2 + 1) % 2) / 2
            })
        } else if (object.class == "background-textbox" || object.class == "divider-textbox") {
            if (object.bringButton == null) addBringForwardButton(object.left + object.width + buttonSize, object.top - buttonSize, object);
            if (object.closeButton == null) addCloseButton(object.left + object.width + buttonSize + 5, object.top + 3, object);
            if (object.tickButton == null) addTickButton(object.left + object.width + buttonSize, object.top + buttonSize, object);
            //if (object.convertButton == null && object.simpleText != "") addConvertButton(object.left + object.width + buttonSize, object.top + 2 * buttonSize, object);
        } else if (object.class == "tickbox") {
            if (nextAction == "textbox-tick") {
                textboxTickHandler(actionValue, object);
                nextAction = "";
                actionValue = "";
            }
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
        } else if (nextAction == 'add-new-background-textbox') {
            addBackgroundTextBox(downPoint.x, downPoint.y);
            nextAction = '';
        } else if (nextAction == 'add-new-divider-textbox') {
            addDividerTextBox(downPoint.x, downPoint.y);
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

    var object = e.target;
    if (mouseDrag && object == null) {
        var upPoint = {x: e.e.pageX, y: e.e.pageY};
        if (nextAction == 'add-tickbox') {
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
                addSearchBox();
            }
        }
    }

    if (object != null && object.class == "textbox-group") {
        if (object.closeButton == null) {
            addCloseButton(object.left + object.width / 2 + buttonSize + 5, object.top - buttonSize, object);
        }
        if (object.tickButton == null) {
            addTickButton(object.left + object.width / 2 + buttonSize, object.top, object);
        }
    }

    setTimeout(function(){
        $(".regex-search-box.empty").remove();
    }, 2000);

    if (object != null && object.class == 'dot'){
        object.setOpacity(0);
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
        //e.target.set("opacity", 0);
        //canvas.renderAll();
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

    var object = e.target;
    object.setCoords();
    if (object == tempPoly || object == tempText){
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
    if (object.class == 'element' && (object.category == 'circle' || object.category == 'hexagon')) {
        var pos = nearPosition(e.e.offsetX, e.e.offsetY), isInTickbox = false, tickBoxes = [];
        if (snapToGrid) {
            object.set({
                left: pos.left,
                top: pos.top,
                position: pos.id
            });

        } else {
            object.set({
                position: pos.id
            });
        }
        elementsInfo[object.id].x = object.left;
        elementsInfo[object.id].y = object.top;

        canvas.forEachObject(function(obj) {
            if (obj.class == "tickbox") {
                tickBoxes.push(obj);
            }
        });

        tickBoxes.forEach(function(tickBox){
            if (object.tickButton.checked && (object.intersectsWithObject(tickBox) || tickBox.intersectsWithObject(object))){
                isInTickbox = true;
            }
        });
        if (!isInTickbox){
            object.set({
                scaleX: 1,
                scaleY: 1
            });
            object.tickButton.set({
                scaleX: 1,
                scaleY: 1
            });
        } else {
            object.set({
                scaleX:.5,
                scaleY:.5
            });
            object.tickButton.set({
                scaleX:.5,
                scaleY:.5
            });
        }

        object.newPoint.set({
            left: object.left,
            top: object.top - object.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
        });
        object.newPoint.setCoords();
        object.tickButton.set({
            left: object.left + object.scaleX * radius,
            top: object.top - object.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
        });
        object.tickButton.setCoords();
        object.lines.forEach(function(line){
            adjustLine(line);
        });
        canvas.discardActiveObject();

        canvas.renderAll();
    } else if (object.class == 'group' || object == canvas.getActiveGroup()){
        var obj = object.class == 'group'? object: canvas.getActiveGroup(), offsetX = obj.left + obj.width / 2, offsetY = obj.top + obj.height / 2;
        moveThreeDots(obj);
        obj._objects.forEach(function(shape){
            if (shape.class == "element") {
                shape.newPoint.set({
                    left: offsetX + shape.left,
                    top: offsetY + shape.top - object.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
                });
                shape.newPoint.setCoords();
                shape.tickButton.set({
                    left: offsetX + shape.left + object.scaleX * radius,
                    top: offsetY + shape.top - object.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
                });
                shape.tickButton.setCoords();
                shape.lines.forEach(function (line) {
                    adjustLine(line);
                });
            }
        });
    } else if (object.class == "b-point") {

        if (object.line) {
            object.line.path[1][1] = object.left;
            object.line.path[1][2] = object.top;
        }
        adjustLine(object.line);
    } else if (object.class == "crosshair-line") {
        if (object.category == "vertical") {
            object.set("right", object.top + object.width);
        } else {
            object.set("right", object.left + object.width);
        }
        crossPointHandler(object);
    } else if (object.class == "divider-textbox" || object.class == "background-textbox") {
        object.backgroundBox.set({
            left: object.left - 10,
            top: object.top - 10
        });
        object.backgroundBox.setCoords();
        if (object.bringButton != null) {
            object.bringButton.set({
                left: object.left + object.width + buttonSize,
                top: object.top - buttonSize
            });
            object.bringButton.setCoords();
        }
        if (object.closeButton != null) {
            object.closeButton.set({
                left: object.left + object.width + buttonSize + 5,
                top: object.top + 3
            });
            object.closeButton.setCoords();
        }
        if (object.tickButton != null) {
            object.tickButton.set({
                left: object.left + object.width + buttonSize,
                top: object.top + buttonSize
            });
            object.tickButton.setCoords();
        }
    } else if (object.class == "textbox-group") {
        object.forEachObject(function(obj){
            obj.backgroundBox.set({
                left: obj.left + object.left - 10,
                top: obj.top + object.top - 10
            });
            obj.backgroundBox.setCoords();
        });
        if (object.closeButton != null){
            object.closeButton.set({
                left: object.left + object.width / 2 + buttonSize + 5,
                top: object.top - buttonSize
            });
        }
        if (object.tickButton != null) {
            object.tickButton.set({
                left: object.left + object.width / 2 + buttonSize,
                top: object.top
            });
        }
    } else if (object.class == "image-thumbnail") {
        object.closeButton.set({
            left: object.left - buttonSize,
            top: object.top
        }).setCoords();
        object.convertButton.set({
            left: object.left - buttonSize,
            top: object.top + 1.5 * buttonSize
        }).setCoords();
        if (object.cropButton) {
            object.cropButton.set({
                left: object.left - buttonSize,
                top: object.top + 1.5 * buttonSize
            }).setCoords();
        }
        if (object.moveButton) {
            object.moveButton.set({
                left: object.left - buttonSize,
                top: object.top + 3 * buttonSize
            }).setCoords();
        }
    } else if (object.class == "cropped-image") {
        object.closeButton.set({
            left: object.left -buttonSize,
            top: object.top
        }).setCoords();
        object.originalButton.set({
            left: object.left -buttonSize,
            top: object.top + buttonSize
        }).setCoords();
        if (object.annotation) {
            object.annotation.css({
                left: parseInt(object.annotation.css("left")) + e.e.movementX,
                top: parseInt(object.annotation.css("top")) + e.e.movementY
            });
        }
    } else if (object.class == "button" && object.id == "move-image") {
        object.target.set({
            left: object.left + buttonSize,
            top: object.top - 3 * buttonSize
        }).setCoords();
        object.target.closeButton.set({
            left: object.left,
            top: object.top - 3 * buttonSize
        }).setCoords();
        object.target.cropButton.set({
            left: object.left,
            top: object.top - 1.5 * buttonSize
        }).setCoords();
        object.target.iframe.css({
            left: object.left + buttonSize,
            top: object.top - 3 * buttonSize
        });
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
    var object = e.target, event = e.e;
    if (object.class == "tickbox") {
        object.set({
            scaleX: 1,
            scaleY: 1
        });
        if (event.pageX < object.left + object.width / 4) {
            object.set({
                left: event.pageX,
                width: object.width - event.movementX
            });
        } else if (event.pageX > object.left + 3 * object.width / 4) {
            object.set({
                width: event.pageX - object.left
            })
        }
        if (event.pageY < object.top + object.height / 4) {
            object.set({
                top: event.pageY,
                height: object.height - event.movementY
            });
        } else if (event.pageY > object.top + 3 * object.height / 4) {
            object.set({
                height: event.pageY - object.top
            })
        }
        object.setCoords();
        if (object.height <= 20 && object.width <= 20) {
            canvas.remove(object.topText, object.rightText, object.leftText, object.bottomText, object);
        }
        canvas.renderAll();
    } else if (object.class == "crosshair-line") {
        var unitWidth = new fabric.Text("+ ", {
            fontSize: 12,
            fontFamily: 'VagRounded',
            fontWeight: 'bold'
        }).width, width = object.width;
        if (object.category == "vertical") {
            if (object.top + width / 2 > event.pageY){
                object.set({
                    top: event.pageY,
                    width: object.right - event.pageY
                });
            } else if (object.top + width / 2 < event.pageY) {
                object.set({
                    width: event.pageY - object.top,
                    right: event.pageY
                });
            }
        } else {
            if (object.left + width / 2 > event.pageX){
                object.set({
                    left: event.pageX,
                    width: object.right - event.pageX
                });
            } else if (object.left + width / 2 < event.pageX) {
                object.set({
                    width: event.pageX - object.left,
                    right: event.pageX
                });
            }
        }
        object._objects[1].set({
            width: object.width,
            left: - object.width / 2
        });
        var text = "+";
        for (var i = 0; i <= parseInt(object.width/ unitWidth); i ++){
            text += " +";
        }
        object._objects[0].set({
            text: text,
            left: - object.width / 2
        });
        object.set("scaleX", 1);
        canvas.renderAll();
    } else if (object.class == "image-thumbnail") {
        //object.resized = true;
        var scale;
        if (object.prevScaleX < object.scaleX || object.prevScaleY < object.scaleY){
            scale = Math.max(object.scaleX, object.scaleY);
        } else {
            scale = Math.min(object.scaleX, object.scaleY);
        }
        object.set({
            scaleX: scale,
            scaleY: scale
        }).setCoords();
        object.closeButton.set({
            left: object.left - buttonSize,
            top: object.top
        }).setCoords();
        object.convertButton.set({
            left: object.left - buttonSize,
            top: object.top + 1.5* buttonSize
        }).setCoords();
        object.prevScaleX = object.scaleX;
        object.prevScaleY = object.scaleY;
        canvas.renderAll();
    }
});

canvas.on('selection:created', function(e){

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
    var object = e.target;
    if (object.class == "boundary-text") {
        var newText = "";
        $.each(object._textLines, function(i, line){
            newText += line;
        });
        object.text = newText;
        canvas.renderAll();

        if (object.right != null) {
            object.set("left", object.right - object.width);
            object.setCoords();
        }

    }
    //} else if (e.target.class == "background-textbox") {
    //    e.target.backgroundBox.set({
    //        width: e.target.width + 20,
    //        height: e.target.height + 20
    //    });
    //} else if (e.target.class == "divider-textbox") {
    //    e.target.backgroundBox.set({
    //        width: e.target.width + 20,
    //        height: e.target.height + 20,
    //        strokeDashArray: [e.target.width + 20, e.target.height + 20]
    //    });
    //}
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
