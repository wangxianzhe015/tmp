var buttonRemoveFlag = false;

function addBrowseButton(){
    var browseImgSrc = "./assets/images/icons/browser-40.png",left,top;
    if (browseButton == null){
        left = 50;
        top = window.innerHeight - 60;
    } else {
        left = browseButton.left;
        top = browseButton.top;
    }
    fabric.Image.fromURL(browseImgSrc, function(oImg) {
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: 40,
            height: 40,
            //fill: '#248784',
            fill: 'rgba(0,0,0,0)',
            //opacity:.2,
            strokeWidth: 2
        });
        // scale image down, and flip it, before adding it onto canvas
        oImg.set({left: 0, top: 0, angle: 0});
        browseButton = new fabric.Group([rect, oImg], {
            left: left,
            top: top,
            id: 'browse',
            class: 'button',
            isTemporary: false,
            originX: 'center',
            originY: 'center',
            selectable: true,
            draggable: true,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(browseButton);
    });
}

function addSearchButton(){
    var searchImgSrc = "./assets/images/icons/search-40.png",left,top;
    if (searchButton == null){
        left = 50;
        top = window.innerHeight - 120;
    } else {
        left = searchButton.left;
        top = searchButton.top;
    }

    fabric.Image.fromURL(searchImgSrc, function(oImg) {
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
        searchButton = new fabric.Group([rect, oImg], {
            left: left,
            top: top,
            id: 'search',
            class: 'button',
            isTemporary: false,
            originX: 'center',
            originY: 'center',
            selectable: true,
            draggable: true,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(searchButton);
    });

}

function addHideButton(){
    var hideImgSrc = "./assets/images/icons/hide-40.png",left,top;
    if (hideButton == null){
        left = 50;
        top = window.innerHeight - 180;
    } else {
        left = hideButton.left;
        top = hideButton.top;
    }

    fabric.Image.fromURL(hideImgSrc, function(oImg) {
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
        hideButton = new fabric.Group([rect, oImg], {
            left: left,
            top: top,
            id: 'hide',
            class: 'button',
            isTemporary: false,
            originX: 'center',
            originY: 'center',
            selectable: true,
            draggable: true,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(hideButton);
    });

}

function addUploadButton(){
    var uploadImgSrc = "./assets/images/icons/upload-40.png",left,top;
    if (uploadButton == null){
        left = 50;
        top = window.innerHeight - 240;
    } else {
        left = uploadButton.left;
        top = uploadButton.top;
    }

    fabric.Image.fromURL(uploadImgSrc, function(oImg) {
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
        uploadButton = new fabric.Group([rect, oImg], {
            left: left,
            top: top,
            id: 'upload',
            class: 'button',
            isTemporary: false,
            originX: 'center',
            originY: 'center',
            selectable: true,
            draggable: true,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(uploadButton);
    });

}

function addBackButton(){
    var backImgSrc = "./assets/images/icons/back-40.png",left,top;
    if (backButton == null){
        left = 50;
        top = 50;
    } else {
        left = backButton.left;
        top = backButton.top;
    }

    fabric.Image.fromURL(backImgSrc, function(oImg) {
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
        backButton = new fabric.Group([rect, oImg], {
            left: left,
            top: top,
            id: 'uncluster',
            class: 'button',
            isTemporary: false,
            originX: 'center',
            originY: 'center',
            selectable: true,
            draggable: true,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false
        });

        canvas.add(backButton);
    });

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
