function addBrowseButton(){
    $("<img/>", {
        id: "browse-button",
        src: "./assets/images/icons/browser-40.png",
        class: "icon-button parent"
    }).on("mouseover", function(){
        showChildButtons();
    }).on("mouseleave", function(){
        setTimeout(hideChildButtons,500);
    }).appendTo("#left-sidebar");
}

function addSearchButton(){
    $("<img/>", {
        id: "search-button",
        src: "./assets/images/icons/search-40.png",
        class: "icon-button"
    }).on("mouseover", function(){
        removeImageTools();
        setTimeout(showTagTooltip,100);
    }).on("mouseleave", function(){
        setTimeout(removeImageTools,500);
    }).appendTo("#left-sidebar");
}

function addHideButton(){
    $("<img/>", {
        id: "hide-button",
        src: "./assets/images/icons/hide-40.png",
        class: "icon-button"
    }).on("mouseover", function(){
        removeImageTools(true);
    }).on("click", function(){
        if (elementsStatus == 'show') {
            elementsStatus = 'hide';
            $(this).attr("src", "./assets/images/icons/unhide-40.png");
        } else {
            elementsStatus = 'show';
            $(this).attr("src", "./assets/images/icons/hide-40.png");
        }
        toggleElements();
    }).appendTo("#left-sidebar");
}

function addUploadButton(){
    $("<img/>", {
        id: "upload-button",
        src: "./assets/images/icons/upload-40.png",
        class: "icon-button"
    }).on("mouseover", function(){
        showUploadDiv();
    }).on("mouseleave", function(){
        setTimeout(removeImageTools, 500);
    }).appendTo("#left-sidebar");
}

function addChipButton(){
    $("<img/>", {
        id: "microchip-button",
        src: "./assets/images/icons/microchip-40.png",
        class: "icon-button"
    }).on("mouseover", function(){
        removeImageTools(true);
    }).on("click", function(){
        showTaggerFrame();
    }).appendTo("#left-sidebar");
}

function addTimelineButton(){
    $("<img/>", {
        id: "timeline-button",
        src: "./assets/images/icons/timeline-40.png",
        class: "icon-button"
    }).on("mouseover", function(){
        removeImageTools(true);
    }).on("click", function(){
        showTimelineFrame();
    }).appendTo("#left-sidebar");
}

function addCalendarButton(){
    $("<img/>", {
        id: "calendar-button",
        src: "./assets/images/icons/calendar-white.png",
        class: "icon-button"
    }).on("mouseover", function(){
        removeImageTools(true);
    }).on("click", function(){
        showCalendarFrame();
    }).appendTo("#left-sidebar");
}

function addIntegrationButton(){
    $("<img/>", {
        id: "integration-button",
        src: "./assets/images/icons/plus-40.png",
        class: "icon-button"
    }).on("mouseover", function(){
        removeImageTools(true);
    }).on("click", function(){
        showIntegrationFrame();
    }).appendTo("#left-sidebar");
}

function addFeedButton(){
    $("<img/>", {
        id: "feed-button",
        src: "./assets/images/icons/feed-24.png",
        class: "icon-button"
    }).on("mouseover", function(){
        removeImageTools(true);
        showFeedDiv();
    }).on("mouseleave", function(){
        mouseOverElement = false;
        setTimeout(hideFeedDiv, 500);
    }).appendTo("#right-sidebar");
}

function addRingButton(){
    $("<img/>", {
        id: "ring-button",
        src: "./assets/images/icons/ring-24.png",
        class: "icon-button"
    }).on("click", function(){
        if (rings.length > 0) return false;
        removeImageTools(true);
        showRing();
    }).appendTo("#right-sidebar");
}

function addUserButton(){
    $("<img/>", {
        id: "user-button",
        src: "./assets/images/icons/user-40.png",
        class: "icon-button"
    }).on("mouseover", function(){
        mouseOverElement = true;
        removeImageTools();
        showPeopleListDiv();
    }).on("mouseleave", function(){
        mouseOverElement = false;
        setTimeout(hidePeopleListDiv, 500);
    }).appendTo("#left-sidebar");
}

function addBackButton(){
    $("<img/>", {
        id: "back-button",
        src: "./assets/images/icons/back-40.png",
        class: "icon-button"
    }).on("click", function(){
        unClusterElements();
    }).appendTo("#left-sidebar");
}

function addButtons() {
    $("<img/>", {
        id: "toggle-lock-button",
        src: "./assets/images/icons/lock-24.png",
        class: "icon-button child"
    }).on("click", function(){
        if (snapToGrid){
            snapToGrid = false;
            $(this).attr("src","./assets/images/icons/lock-24.png");
            snapStatus = 'lock';
        } else {
            snapToGrid = true;
            $(this).attr("src","./assets/images/icons/unlock-24.png");
            snapStatus = 'unlock';
        }
    }).on("mouseover", function(){
        mouseOverElement = true;
    }).on("mouseleave", function(){
        mouseOverElement = false;
        setTimeout(hideChildButtons, 500);
    }).appendTo("#left-sidebar");

    $("<img/>", {
        id: "external-button",
        src: "./assets/images/icons/external-24.png",
        class: "icon-button child"
    }).on("mouseover", function(){
        mouseOverElement = true;
    }).on("mouseleave", function(){
        mouseOverElement = false;
        setTimeout(hideChildButtons, 500);
    }).on("click", function(){

    }).appendTo("#left-sidebar");

    $("<img/>", {
        id: "save-button",
        src: "./assets/images/icons/save-24.png",
        class: "icon-button child"
    }).on("click", function(){
        $("#save-file-name").val(currentFile);
        $("body").css("overflow","hidden");
        $("#save").fadeIn();
    }).on("mouseover", function(){
        mouseOverElement = true;
    }).on("mouseleave", function(){
        mouseOverElement = false;
        setTimeout(hideChildButtons, 500);
    }).appendTo("#left-sidebar");

    $("<img/>", {
        id: "open-button",
        src: "./assets/images/icons/folder-open-24.png",
        class: "icon-button child"
    }).on("click", function(){
        loadFileNames();
    }).on("mouseover", function(){
        mouseOverElement = true;
    }).on("mouseleave", function(){
        mouseOverElement = false;
        setTimeout(hideChildButtons, 500);
    }).appendTo("#left-sidebar");

    $("<img/>", {
        id: "settings-button",
        src: "./assets/images/icons/settings-24.png",
        class: "icon-button child"
    }).on("mouseover", function(){
        mouseOverElement = true;
        removeImageTools();
        setTimeout(showSettingTooltip,100);
        setTimeout(hideChildButtons, 500);
    }).on("mouseleave", function(){
        mouseOverElement = false;
        setTimeout(removeImageTools,500);
        setTimeout(hideChildButtons, 500);
    }).appendTo("#left-sidebar");
}

function addAddButtons(left, top) {
    var plusImgSrc = "./assets/images/icons/plus-24.png";
    var circleImgSrc = "./assets/images/icons/circle-24.png";
    var textImgSrc = "./assets/images/icons/text-24.png";

    fabric.Image.fromURL(plusImgSrc, function(oImg) {
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
        var addButton = new fabric.Group([rect, oImg], {
            left: left,
            top: top,
            id: 'add-new-shape',
            class: 'button',
            isTemporary: true,
            category: 'hexagon',
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(addButton);
        setTimeout(function(){
            canvas.remove(addButton);
            canvas.renderAll();

            $(".regex-search-box.empty").remove();
        }, 2000);
    });

    fabric.Image.fromURL(circleImgSrc, function(oImg) {
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
        var addButton = new fabric.Group([rect, oImg], {
            left: left + 40,
            top: top,
            id: 'add-new-shape',
            class: 'button',
            isTemporary: true,
            category: 'circle',
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(addButton);
        setTimeout(function(){
            canvas.remove(addButton);
            canvas.renderAll();
        }, 2000);
    });

    fabric.Image.fromURL(textImgSrc, function(oImg) {
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
        var addButton = new fabric.Group([rect, oImg], {
            left: left + 80,
            top: top,
            id: 'add-new-text',
            class: 'button',
            isTemporary: true,
            category: 'text',
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(addButton);
        setTimeout(function(){
            canvas.remove(addButton);
            canvas.renderAll();
        }, 2000);
    });

}

function showChildButtons(){
    $("#left-sidebar").find(".child").show();
}

function hideChildButtons(){
    if (!mouseOverElement){
        $("#left-sidebar").find(".child").hide();
    }
}

function showTaggerFrame(){
    removeImageTools(true);
    var $obj = $("#tagger-iframe");
    $obj.css({
        top: window.scrollY + 150,
        left: window.scrollX + (window.innerWidth - parseInt($obj.css("width"))) / 2
    }).show();
}

function showFeedDiv(){
    $("#custom-accordion-div").show();
}

function hideFeedDiv(){
    if (!mouseOverElement){
        $("#custom-accordion-div").hide();
    }
}

function showPeopleListDiv(){
    removeImageTools(true);
    $("#contactDiv").show();
}

function hidePeopleListDiv(){
    if (!mouseOverElement){
        $("#contactDiv").hide();
    }
}

function showCalendarFrame(){
    removeImageTools(true);
    $(".sidebar").hide();
    canvas.forEachObject(function(obj){
        if (obj.class == "element" && obj.visible){
            obj.set({
                visible: false,
                class: "temp-disabled"
            })
        }
    });
    canvas.renderAll();
    $("#calendar-iframe").show().find("iframe").attr("src", "calendar");
}

function hideCalendarFrame(){
    $(".sidebar").show();
    canvas.forEachObject(function(obj){
        if (obj.class == "temp-disabled"){
            obj.set({
                class: "element",
                visible: true
            })
        }
    });
    canvas.renderAll();
    $("#calendar-iframe").hide().find("iframe").attr("src","");
}

function showIntegrationFrame(){
    removeImageTools(true);
    $(".sidebar").hide();
    $("#integration-iframe").show();
}

function hideIntegrationFrame(){
    $(".sidebar").show();
    $("#integration-iframe").hide();
}

function showTimelineFrame(){
    removeImageTools(true);
    $(".sidebar").hide();
    $("#timeline-iframe").show();
}

function hideTimelineFrame(){
    $(".sidebar").show();
    $("#timeline-iframe").hide();
}

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

    $("<button></button>", {
        id: "ring-tween-btn",
        text: "Tween"
    }).on({
        click: function(){
            var elements = [];
            if ($(this).text() == "Tween"){
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
                $(this).text("Untween");
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
                $(this).text("Tween");
            }
        }
    }).css({
        left: window.innerWidth,
        top: window.innerHeight,
        transform: "translateX(-50%) translateY(-50%)"
    }).appendTo("body");

    $("html, body").animate({
        scrollLeft: window.innerWidth / 2,
        scrollTop: window.innerHeight / 2
    });
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

    ring.angleUnit = 2 * radius / ringRadius;

    rings.push(ring);
    canvas.add(ring);
    canvas.sendBackwards(ring);

}
