function addBrowseButton(){
    $("<img/>", {
        id: "browse-button",
        src: "./assets/images/icons/browser-40.png",
        class: "icon-button parent"
    }).on("mouseover", function(){

    }).on("mouseleave", function(){

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
        mouseOverElement = false;
        removeImageTools();
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

function addBackButton(){
    $("<img/>", {
        id: "back-button",
        src: "./assets/images/icons/back-40.png",
        class: "icon-button"
    }).on("click", function(){

    }).appendTo("#left-sidebar");
}

function removeButtons(){
    if (buttonRemoveFlag) {
        buttons.forEach(function (button) {
            canvas.remove(button);
        });
        buttons = [];
        buttonRemoveFlag = false;
    }
}

function addButtons(left, top) {
    //var hideImgSrc;
    var lockImgSrc;
    //var groupImgSrc;
    var externalImgSrc = "./assets/images/icons/external-24.png";
    var saveImgSrc = "./assets/images/icons/save-24.png";
    var openImgSrc = "./assets/images/icons/folder-open-24.png";
    var settingsImgSrc = "./assets/images/icons/settings-24.png";
    //if (gridStatus == 'hide') {
    //    hideImgSrc = "./assets/images/icons/hide-24.png";
    //} else {
    //    hideImgSrc = "./assets/images/icons/unhide-24.png";
    //}
    if (snapStatus == 'lock') {
        lockImgSrc = "./assets/images/icons/lock-24.png";
    } else {
        lockImgSrc = "./assets/images/icons/unlock-24.png";
    }

    //var activeObject = canvas.getActiveGroup();
    //if (activeObject != null){
    //    groupImgSrc = "./assets/images/icons/object-group-24.png";
    //} else {
    //    groupImgSrc = "./assets/images/icons/object-ungroup-24.png";
    //}

    fabric.Image.fromURL(lockImgSrc, function(oImg) {
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
        var button = new fabric.Group([rect, oImg], {
            left: left + 40,
            top: top,
            id: 'toggle-snap',
            class: 'button',
            isTemporary: true,
            category: snapStatus,
            originX: 'center',
            originY: 'center',
            selectable: false,
            draggable: false,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(button);
        buttons.push(button);
    });

    fabric.Image.fromURL(externalImgSrc, function(oImg) {
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
        var exButton = new fabric.Group([rect, oImg], {
            left: left + 80,
            top: top,
            id: 'external',
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

        canvas.add(exButton);
        buttons.push(exButton);
    });

    fabric.Image.fromURL(saveImgSrc, function(oImg) {
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
        var saveButton = new fabric.Group([rect, oImg], {
            left: left + 120,
            top: top,
            id: 'save',
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

        canvas.add(saveButton);
        buttons.push(saveButton);
    });

    fabric.Image.fromURL(openImgSrc, function(oImg) {
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
        var openButton = new fabric.Group([rect, oImg], {
            left: left + 160,
            top: top,
            id: 'folder-open',
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

        canvas.add(openButton);
        buttons.push(openButton);
    });

    fabric.Image.fromURL(settingsImgSrc, function(oImg) {
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
        var settingsButton = new fabric.Group([rect, oImg], {
            left: left + 200,
            top: top,
            id: 'settings',
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

        canvas.add(settingsButton);
        buttons.push(settingsButton);
    });
}

function addAddButtons(left, top) {
    var plusImgSrc = "./assets/images/icons/plus-24.png";
    var circleImgSrc = "./assets/images/icons/circle-24.png";

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

}

function moveButtons(left, top){
    buttons.forEach(function(button,index){
        button.set({
            left: left + (index + 1) * 40,
            top: top
        });
    });
    canvas.renderAll();
}
