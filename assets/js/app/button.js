function addLeftBarButtons(){
    addBrowseButton();
    addChildButtons();
    addSearchButton();
    addHideButton();
    addUploadButton();
    addChipButton();
    addUserButton();
    addCalendarButton();
    addIntegrationButton();
    addTimelineButton();
}

function addRightBarButtons(){
    addExchangeButton();
    addFeedButton();
    addRingButton();
    addBLineCircleButton();
    //addTweenButton();
    //addFishEyeButton();
    //addDownloadJSONButton();
    //addLineSaveButton();
    //addLineLoadButton();
    addEmlButton();
    addMapperButton();
}

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
        class: "icon-button",
        "data-status": "hidden"
    }).on("click", function(){
        $("html, body").animate({
            scrollLeft: window.innerWidth / 2,
            scrollTop: window.innerHeight / 2
        });

        if (rings.length == 0) {
            showRing();
            $(this).attr("data-status", "shown");
        } else {
            if ($(this).attr("data-status") == "hidden"){
                $(this).attr("data-status", "shown");
                $("#ring-tween-btn").show();
                rings.forEach(function(ring){
                    ring.set("opacity", 1);
                });
            } else {
                $(this).attr("data-status", "hidden");
                $("#ring-tween-btn").hide();
                rings.forEach(function(ring){
                    ring.set("opacity", 0);
                });
            }
            canvas.renderAll();
        }
        removeImageTools(true);
    }).appendTo("#right-sidebar");
}

function addTweenButton(){
    $("<img/>", {
        id: "tween-button",
        src: "./assets/images/icons/sign-in-24.png",
        class: "icon-button"
    }).on("click", function(){
        var tickBox = null;
        canvas.forEachObject(function(obj){
            if (obj.class == "tickbox"){
                tickBox = obj;
            }
        });
        if (tickBox == null) return false;
        var top, left;
        canvas.forEachObject(function(obj){
            if (obj.class == "element" && obj.tickButton.checked){
                top = tickBox.top + Math.random() * (tickBox.height - radius) + radius / 2;
                left = tickBox.left + Math.random() * (tickBox.width - radius) + radius / 2;
                obj.animate({
                    scaleX: 0.5,
                    scaleY: 0.5,
                    top: top,
                    left: left
                }, {
                    duration: 1000,
                    onChange: canvas.renderAll.bind(canvas),
                    easing: fabric.util.ease.easeOutCirc
                });
                obj.newPoint.animate({
                    left: left,
                    top: top - Math.sqrt(3) * (radius - border / 2) / 4
                }, {
                    duration: 1000,
                    onChange: canvas.renderAll.bind(canvas),
                    easing: fabric.util.ease.easeOutCirc
                });
                obj.tickButton.animate({
                    scaleX: 0.5,
                    scaleY: 0.5,
                    left: left + radius / 2,
                    top: top - Math.sqrt(3) * (radius - border / 2) / 4
                }, {
                    duration: 1000,
                    onChange: function(){
                        obj.lines.forEach(function(line){
                            adjustLine(line);
                        });
                        canvas.renderAll.bind(canvas);
                    },
                    easing: fabric.util.ease.easeOutCirc
                });
            }
        });
        removeImageTools(true);
    }).appendTo("#right-sidebar");
}

function addFishEyeButton(){
    $("<img/>", {
        id: "fish-eye-button",
        src: "./assets/images/icons/fish-24.png",
        class: "icon-button"
    }).on("click", function(){
        $("#right-sidebar").hide();
        var $obj = $("#pattern-parallax-check");
        if ($obj.prop("checked")){
            $obj.click();
        }
        fisheyeHandler();
    }).appendTo("#right-sidebar");
}

function addDownloadJSONButton(){
    $("<img/>", {
        id: "download-json-button",
        src: "./assets/images/icons/curly-bracket-24.png",
        class: "icon-button"
    }).on("mouseover", showJsonUrlTooltip).appendTo("#right-sidebar");
}

function addLineSaveButton(){
    $("<img/>", {
        id: "line-save-button",
        src: "./assets/images/icons/line-save-24.png",
        class: "icon-button"
    }).on("click", function(){
        $("body").css("overflow","hidden");
        $("#save-target").val("line");
        $("label[for='save-file-name']").text("Name");
        $("#save").fadeIn();
    }).appendTo("#right-sidebar");
}

function addLineLoadButton(){
    $("<img/>", {
        id: "line-load-button",
        src: "./assets/images/icons/line-load-24.png",
        class: "icon-button"
    }).on("click", function(){
        loadLineFileNames();
    }).appendTo("#right-sidebar");
}

function addEmlButton(){
    $("<img/>", {
        id: "eml-load-button",
        src: "./assets/images/icons/envelop-open-24.png",
        class: "icon-button"
    }).on("click", function(){
        loadEml();
    }).appendTo("#right-sidebar");
}

function addMapperButton(){
    $("<img/>", {
        id: "mapper-show-button",
        src: "./assets/images/icons/translate-24.png",
        class: "icon-button"
    }).on("click", function(){
        showMapperFrame();
    }).appendTo("#right-sidebar");
}

function addBLineCircleButton(){
    $("<img/>", {
        id: "bline-circle-button",
        src: "./assets/images/icons/linkify-24.png",
        class: "icon-button"
    }).on("click", function(){
        bLineCircleOpacity = (bLineCircleOpacity + 1) % 2;
        canvas.forEachObject(function(obj){
            if (obj.class == "new-bezier-point" || obj.class == "bezier-start-point" || obj.class == "bezier-end-point" || obj.class == "element-tick-button") {
                obj.set("opacity", bLineCircleOpacity);
            }
        });
        canvas.renderAll();
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

function addChildButtons() {
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
        $("#save-target").val("element");
        $("label[for='save-file-name']").text("Workspace");
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
    var boxImgSrc = "./assets/images/icons/box-24.png";
    var lineImgSrc = "./assets/images/icons/line-24.png";
    var textboxImgSrc1 = "./assets/images/icons/textbox-24.png";
    var textboxImgSrc2 = "./assets/images/icons/textbox2-24.png";

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

    fabric.Image.fromURL(boxImgSrc, function(oImg) {
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
            left: left + 120,
            top: top,
            id: 'add-new-box',
            class: 'button',
            isTemporary: true,
            category: 'box',
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

    fabric.Image.fromURL(lineImgSrc, function(oImg) {
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
            left: left + 160,
            top: top,
            id: 'add-new-line',
            class: 'button',
            isTemporary: true,
            category: 'line',
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

    fabric.Image.fromURL(textboxImgSrc1, function(oImg) {
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
            left: left + 200,
            top: top,
            id: 'add-new-background-textbox',
            class: 'button',
            isTemporary: true,
            category: 'line',
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

    fabric.Image.fromURL(textboxImgSrc2, function(oImg) {
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
            left: left + 240,
            top: top,
            id: 'add-new-divider-textbox',
            class: 'button',
            isTemporary: true,
            category: 'line',
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

function addCropButton(left, top, parent){
    fabric.Image.fromURL("./assets/images/icons/crop-24.png", function (oImg) {
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
            left: left,
            top: top,
            id: 'crop-image',
            class: 'button',
            originX: 'center',
            originY: 'center',
            scaleX: 2 / 3,
            scaleY: 2 / 3,
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        parent.cropButton = btn;
        btn.target = parent;
        canvas.add(btn);
        canvas.renderAll();
    });
}

function addMoveButton(left, top, parent){
    fabric.Image.fromURL("./assets/images/icons/move-24.png", function (oImg) {
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
            left: left,
            top: top,
            id: 'move-image',
            class: 'button',
            originX: 'center',
            originY: 'center',
            scaleX: 2 / 3,
            scaleY: 2 / 3,
            selectable: true,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        parent.moveButton = btn;
        btn.target = parent;
        canvas.add(btn);
        canvas.renderAll();
    });
}

function addExchangeButton(){
    $("<img/>", {
        id: "settings-button",
        src: "./assets/images/icons/exchange-24.png",
        class: "icon-button child"
    }).on("mouseover", function(){
        if ($("#drop-frame-div").data("status") != "shown") {
            removeImageTools();
            showDropFrame();
            hideRightSidebar();
        }
    }).appendTo("#right-sidebar");
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
    $obj.find("iframe").attr("src", window.location.href + "/tagger/");
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
        if (obj.visible){
            obj.set({
                visible: false,
                temp_disabled: true
            })
        }
    });
    canvas.renderAll();
    $("#calendar-iframe").show().find("iframe").attr("src", window.location.href + "/calendar/");
}

function hideCalendarFrame(){
    $(".sidebar").show();
    canvas.forEachObject(function(obj){
        if (obj.temp_disabled){
            obj.set({
                temp_disabled: undefined,
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
    $("#integration-iframe").show().find("iframe").attr("src", window.location.href + "/aa/");
}

function hideIntegrationFrame(){
    $(".sidebar").show();
    $("#integration-iframe").hide().find("iframe").attr("src", "");
}

function showTimelineFrame(){
    removeImageTools(true);
    $(".sidebar").hide();
    $("#timeline-iframe").show().find("iframe").attr("src", window.location.href + "/timeline/");
}

function hideTimelineFrame(){
    $(".sidebar").show();
    $("#timeline-iframe").hide().find("iframe").attr("src", "");
}

function showMapperFrame(){
    removeImageTools(true);
    $(".sidebar").hide();
    $("#mapper-iframe").show().find("iframe").attr("src", window.location.href + "/word-mapper/");
}

function hideMapperFrame(){
    $(".sidebar").show();
    $("#mapper-iframe").hide().find("iframe").attr("src", "");
}
