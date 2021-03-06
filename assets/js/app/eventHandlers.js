function initHandlers(){
    window.addEventListener("message", objectDropHandler, false);

    $(window).on("scroll", function(){
        /**
         * Parallax Scrollig
         */
        if ($("#pattern-apply-check").prop("checked")) {
            var el = document.getElementById("background-image");
            if ($("#pattern-parallax-check").prop("checked")) {
                el.style.left = "-" + window.pageXOffset / 2 + "px";
                el.style.top = "-" + window.pageYOffset / 2 + "px";
            } else {
                el.style.left = "-" + window.pageXOffset + "px";
                el.style.top = "-" + window.pageYOffset + "px";
            }
        }
    }).on("load", function(){
        setTimeout(hideLoadingDiv, 2000);
    }).on("keyup", function(e){
        var obj = canvas.getActiveObject();
        if (obj != null) {
            if (obj.class == "background-textbox") {
                obj.backgroundBox.set({
                    width: obj.width + 20,
                    height: obj.height + 20
                });
            } else if (obj.class == "divider-textbox") {
                obj.backgroundBox.set({
                    width: obj.width + 20,
                    height: obj.height + 20,
                    strokeDashArray: [obj.width + 20, obj.height + 20]
                });
            } else if (obj.class == "boundary-text" && e.originalEvent.keyCode == 13) {
                canvas.deactivateAll();
            } else if (obj.class == "cropped-image" && e.originalEvent.keyCode == 46) {
                canvas.forEachObject(function(object){
                    if (object.class == "cropped-image-annotation" && object.target == obj.id){
                        canvas.remove(object);
                    }
                });
                canvas.remove(obj).renderAll();
            }
        }

    });

    $(document).on("mousemove", function(e){
        cursorPosition.x = e.originalEvent.pageX;
        cursorPosition.y = e.originalEvent.pageY;

        if (resizeTooltip != ""){
            e.preventDefault();
            var $obj = $("#" + resizeTooltip);
            $obj.css({
                width: e.originalEvent.pageX < $obj.position().left + 200?200:e.originalEvent.pageX - $obj.position().left + 5,
                height: e.originalEvent.pageY < $obj.position().top + 36?36:e.originalEvent.pageY - $obj.position().top + 5,
                transition: "none",
                "min-height": 0,
                "min-width": 0
            });
            if ($obj.hasClass("text")) {
                $obj.data("lines").forEach(function (line) {
                    adjustLine(line);
                });
            }
        }
        if ($(e.originalEvent.target).find("iframe").length > 0 || $(".text-cell-group").length > 0){
            return;
        }
        if (e.clientX < 50){
            setTimeout(showLeftSidebar,100);
            setTimeout(hideRightSidebar,100);
        } else if (window.innerWidth - e.clientX < 50) {
            setTimeout(hideLeftSidebar, 100);
            setTimeout(showRightSidebar, 100);
        } else if (!mouseOverElement){
            setTimeout(hideLeftSidebar,100);
            setTimeout(hideRightSidebar,100);
        }
        if (e.clientY < 150 && e.clientX > 50 && window.innerWidth - e.clientX > 50 && !mouseOverElement){
            setTimeout(showTopSidebar, 100);
        } else {
            setTimeout(hideTopSidebar, 100);
        }
    }).on("mouseup", function(e){
        if (resizeTooltip != ""){
            var $obj = $("#" + resizeTooltip);
            $obj.css({
                width: e.originalEvent.pageX < $obj.position().left + 200?200:e.originalEvent.pageX - $obj.position().left + 5,
                height: e.originalEvent.pageY < $obj.position().top + 36?36:e.originalEvent.pageY - $obj.position().top + 5,
                transition: ""
            }).data({
                width: $obj.css("width"),
                height: $obj.css("height")
            });
            resizeTooltip = "";
            if ($obj.hasClass("ui-draggable")) {
                $obj.draggable("enable");
            }
        }
    }).on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.originalEvent.dataTransfer.types.indexOf("Files") == -1) return;
        showUploadDiv();
    }).on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.originalEvent.dataTransfer.types.indexOf("Files") == -1) return;
        showUploadDiv();
        var dropZone = $('#dropzone'),
            timeout = window.dropZoneTimeout;
        if (timeout) {
            clearTimeout(timeout);
        } else {
            dropZone.addClass('in');
        }
        var hoveredDropZone = $(e.target).closest(dropZone);
        dropZone.toggleClass('hover', hoveredDropZone.length);
        window.dropZoneTimeout = setTimeout(function () {
            window.dropZoneTimeout = null;
            dropZone.removeClass('in hover');
        }, 100);
    });

    $(document).contextmenu({
        delegate: "body",
        //delegate: ".upper-canvas",
        menu: [
            {title: "Move", cmd: "move", uiIcon: "ui-icon-arrow-4"},
            {title: "----"},
            {title: "Expand", cmd: "expand", uiIcon: "ui-icon-arrow-4-diag"},
            {title: "Collapse", cmd: "collapse", uiIcon: "ui-icon-arrow-4-diag"},
            {title: "Grouping", children: [
                {title: "Group", cmd: "group", uiIcon: "custom-icon-group"},
                {title: "Ungroup", cmd: "ungroup", uiIcon: "custom-icon-ungroup"}
            ]}
        ],
        beforeOpen: function (event, ui) {
            return false;
            //var clickPoint = new fabric.Point(event.offsetX, event.offsetY);
            if (!showContextMenu) {
                return false;
            }
            if (null == canvas.getActiveGroup()){
                //$(document).contextmenu("enableEntry", "move", false);
                $(document).contextmenu("showEntry", "group", false);
                $(document).contextmenu("showEntry", "ungroup", true);
                if (canvas.getActiveObject().expanded){
                    $(document).contextmenu("showEntry", "expand", false);
                    $(document).contextmenu("showEntry", "collapse", true);
                } else {
                    $(document).contextmenu("showEntry", "expand", true);
                    $(document).contextmenu("showEntry", "collapse", false);
                }
            } else {
                $(document).contextmenu("showEntry", "group", true);
                $(document).contextmenu("showEntry", "ungroup", false);
                $(document).contextmenu("showEntry", "expand", false);
                $(document).contextmenu("showEntry", "collapse", false);
            }
            showContextMenu = false;
        },
        select: function(event, ui) {
            //alert("select " + ui.cmd + " on " + ui.target.text());
            switch (ui.cmd){
                case 'group':
                    var activeObject = canvas.getActiveGroup();
                    group(activeObject);
                    canvas.renderAll();
                    break;
                case 'ungroup':
                    var activeObject = canvas.getActiveObject();
                    if(activeObject.class=="group"){
                        unGroup(activeObject);
                        canvas.renderAll();
                    }
                    break;
                case 'expand':
                    var obj = canvas.getActiveObject();
                    expandGroup(obj);
                    canvas.renderAll();
                    break;
                case 'collapse':
                    var el = canvas.getActiveObject();
                    collapseGroup(el);
                    canvas.renderAll();
                    break;
            }
        }
    });

    $(".image-tooltip-resize").on("mousedown", function(){
        $(this).parent().draggable("disable");
        resizeTooltip = $(this).parent().attr("id");
    });

    downloadCSVFile();
    $("#csv-file-path").on("change", function(){
        downloadCSVFile();
    });

    $("#tagger-iframe").draggable();

    $("#close-top-sidebar").on("click", function(){
        $("#top-sidebar").remove();
    });

    $(".image-tooltip").on("mouseover", function(event){
        mouseOverElement = true;
    }).on("mouseleave", function(event){
        mouseOverElement = false;
    });

    $("#imageDialog .tab-menu>li>a").on("click", function(){
        $("#ttip-exit").click();
        if ($(this).attr("data-edit") == "true"){
            $("#ttip-edit").show();
        } else {
            $("#ttip-edit").hide();
        }
        $("#preview-box").hide();
    });

    $(".tab-menu>li>a").on("click", function(event){
        event.preventDefault();
        $(this).parent().parent().parent().find(".tab-menu>li").removeClass("active");
        $(this).parent().addClass("active");
        $(this).parent().parent().parent().find(".tab-pane").removeClass("active");
        $($(this).attr("data-tab")).addClass("active");
    });

    $("#imageDialog #ttip-edit").on("click", function(){
        var activeObject = $("#imageDialog .tab-pane.active"), text=activeObject.html();
        activeObject.removeClass("active").addClass("temp-target");
        var tempTextArea = document.createElement("textarea");
        tempTextArea.className="temp-textarea";
        tempTextArea.innerHTML=text;
        $(tempTextArea).attr('data-target',activeObject.attr('id'));
        $(".ttip").append(tempTextArea);
        tempTextArea.focus();
        $(this).hide();
        $("#ttip-exit").show();
    });

    $("#ttip-exit").on("click", function(){
        var tempTextArea = $(".temp-textarea"),text=tempTextArea.val(),target=tempTextArea.attr('data-target');
        tempTextArea.remove();
        if (text != null) {
            if (target == "datatext") {
                tooltipObject.set({
                    datatext: text
                });
            } else if (target == "workflow") {
                tooltipObject.set({
                    workflow: text
                });
            } else if (target == "digest") {
                tooltipObject.set({
                    digest: text
                });
            } else if (target == "integrations") {
                tooltipObject.set({
                    integrations: text
                });
            }
            $(".tab-pane.temp-target").html(text).removeClass("temp-target").addClass("active");
        }
        $(this).hide();
        $("#ttip-edit").show();
    });

    $("#confirm-btn").on("click", function(){
        var $actionTag = $("#confirm-next-action"), $valueTag = $("#confirm-next-value"), action = $actionTag.val();
        $(this).next().click();
        if (action == "remove-text-cell"){
            var $cell = $("#" + $valueTag.val());
            removeTextCell($cell);
        } else if (action == "remove-tooltip") {
            $("#" + $valueTag.val()).remove();
        } else if (action == "remove-text-cell-group"){
            $("#save-target").val("text-cell-group:" + $valueTag.val());
            $("label[for='save-file-name']").text("Name");
            $("#save").fadeIn();
        } else if (action == "remove-text-cell-in-group"){
            removeTextCellInGroup($("#" + $valueTag.val()));
        }
        $actionTag.val("");
        $valueTag.val("");
    });

    $(".dialog-close").on("click", function(){
        modalClose($(this).attr('dismiss'));
    });

    $("#view-save").on("click", function(){
        var viewNameInput = $("#view-name");
        if (viewNameInput.val() == ""){
            alert("Error","View name cannot be empty.");
            viewNameInput.focus();
            return false;
        }
        saveView();
    });

    $("#multi-select").multipleSelect({
        placeholder: "Choose tags",
        onCheckAll: function() {
            tooltipObject.tags = [];
            var tags = $("#multi-select").find('option');
            tags.each(function(index,tag){
                tooltipObject.tags.push($(tag).attr('value'));
            });
        },
        onUncheckAll: function() {
            tooltipObject.tags = [];
        },
        onClick: function(view){
            if (tooltipObject != null) {
                if (view.checked){
                    tooltipObject.tags.push(view.value);
                } else {
                    tooltipObject.tags.forEach(function (tag, index) {
                        if (view.value == tag) tooltipObject.tags.splice(index,1);
                    });
                }
            }
        },
        isOpen: true,
        keepOpen: true
    });

    //$("#imageDialog").find(".ms-parent").on("click", function(e){
    //    e.preventDefault();
    //    return false;
    //}).find(".ms-choice").on("click", function(e){
    //    e.preventDefault();
    //    return false;
    //});

    $("#tags").on("change", function(){
        var keywords = $(this).val();
        canvas.forEachObject(function(obj){
            var check = false;
            if (obj.class == "element"){
                obj.setOpacity(1);
                if (keywords.length > 0) {
                    keywords.forEach(function (word) {
                        if (obj.datatext.toUpperCase().indexOf(word.toUpperCase()) > -1) {
                            check = true;
                        }
                    });
                    if (!check) {
                        obj.setOpacity(0);
                    }
                }
            }
        });
        canvas.renderAll();
    });

    $("#save-confirm").on("click", function(){
        showSpinner();
        var fileName = $("#save-file-name").val();
        var saveTarget = $("#save-target").val();
        if (fileName == ''){
            $("#save").fadeOut();
            alert('Error', 'Nothing to save!');
            return false;
        } else {
            save(fileName, saveTarget);
        }
    });
    $("#load-confirm").on("click", function(){
        showSpinner();
        var fileName = $("#load-file-name").val();
        var loadTarget = $("#load-target").val();
        if (fileName == ''){
            $("#save").fadeOut();
            alert('Error', 'Nothing to load!');
            return false;
        } else {
            if (loadTarget == "element") {
                var workSpaceSave = $("#save-current-workspace").prop('checked');
                if (workSpaceSave && currentFile != '') {
                    saveElements(currentFile);
                }
                loadElements(fileName);
            } else if (loadTarget == "line") {
                loadLineAndBox(fileName);
            } else if (loadTarget == "text-cell") {
                loadTextCell(fileName);
            }
        }
    });

    updateTagSelect();
    $(".datepicker").datepicker();

    $("#add-new-hex-btn").on("click", function(e){
        getElementName('hex', e.originalEvent.clientX, e.originalEvent.clientY);
    });

    $("#add-new-circle-btn").on("click", function(e){
        getElementName('circle', e.originalEvent.clientX, e.originalEvent.clientY);
    });

    $("#add-new-text").on("click", function(e){
        //addTextTooltip(window.scrollX + e.originalEvent.clientX, window.scrollY + e.originalEvent.clientY);
        showNotification("Click where to put text cell.");
        addingTextCell = true;
    });

    $("#app-theme").on("change", function(){
        var value = $(this).val();
        document.body.className = value;
        switch (value){
            case "default":
                elementColor = "rgba(255,255,255,.8)";
                break;
            case "fresh-and-vermillon":
                elementColor = "#Fc4a1A";
                break;
            case "tangerine-and-teal":
                elementColor = "#E37222";
                break;
            case "dusty-and-lavendar":
                elementColor = "#96858F";
                break;
            case "powder-and-peach":
                elementColor = "#FEDcD2";
                break;
            case "storm-and-cloud":
                elementColor = "#494E6B";
                break;
            case "evening-and-sunset":
                elementColor = "#985e6d";
                break;
            case "clown-and-bright":
                elementColor = "#F53240";
                break;
            case "blueberry-and-apricot":
                elementColor = "#f7882f";
                break;
            case "denim-and-gold":
                elementColor = "#f7ce3e";
                break;
            case "smoke-and-blush":
                elementColor = "#EEB6B7";
                break;
            case "cotton-and-healing":
                elementColor = "#99CED4";
                break;
            case "watermelon-and-blackberry":
                elementColor = "#FF6A5C";
                break;
            case "lagoon-and-beach":
                elementColor = "#1Fb58F";
                break;
            case "petal-and-shrub":
                elementColor = "#0E8044";
                break;
            case "coral-and-romance":
                elementColor = "#E14658";
                break;
            case "cucumber-and-kiwi":
                elementColor = "#3CC47C";
                break;
            case "eggplant-and-grape":
                elementColor = "#94618E";
                break;
            case "apricot-and-citrus":
                elementColor = "#F7C331";
                break;
            case "sailor-and-coral":
                elementColor = "#FF5330";
                break;
            case "marine-and-sky":
                elementColor = "#8EAEBD";
                break;
            case "indigo-and-crimson":
                elementColor = "#Cf6766";
                break;
            case "joker":
                elementColor = "#88D317";
                break;
            case "dark-joker":
                elementColor = "#88D317";
                break;
            case "ice-and-water":
                elementColor = "#99D3DF";
                break;
            case "honey-and-cerulean":
                elementColor = "#DCAE1D";
                break;
            case "sunshine-and-ocean":
                elementColor = "#333A56";
                break;
        }
        var objects = canvas.getObjects(),countObjects = objects.length;
        for (var index = countObjects; index > 0; index -- ){
            paintElement(objects[index - 1]);
        }
        canvas.renderAll();
    });

    $("#tags-list").on("change", function(){
        updateTagSelect();
    });

    $("#background-pattern").on("keyup", function(){
        var check = $("#pattern-apply-check").prop('checked');
        var imgURL = $(this).val();
        if (check && imgURL != ""){
            try {
                $('#background-image').attr('src', imgURL).show();
                if ($('#pattern-tint-apply').prop('checked')) {
                    $('.canvas-container').css('background-color', 'rgba(45, 46, 47, 0.43)');
                }
            } catch (e) {
                console.log(e);
            }
            //fabric.util.loadImage(imgURL, function (img) {
            //    canvas.backgroundColor = new fabric.Pattern({source: img});
            //    canvas.renderAll();
            //});
        } else {
            $('#background-image').hide();
            $('.canvas-container').css('background-color', '');
            //canvas.backgroundColor = "rgba(0,0,0,0)";
            //canvas.renderAll();
        }

    });

    $("#pattern-apply-check").on("click", function(){
        var check = $(this).prop('checked');
        var imgURL = $("#background-pattern").val();
        if (check && imgURL != ""){
            try {
                $('#background-image').attr('src', imgURL).show();
                if ($('#pattern-tint-check').prop('checked')) {
                    $('.canvas-container').css('background-color', 'rgba(45, 46, 47, 0.43)');
                }
            } catch (e){
                console.log(e);
            }
            //fabric.util.loadImage(imgURL, function (img) {
            //    canvas.backgroundColor = new fabric.Pattern({source: img});
            //    canvas.renderAll();
            //});
        } else {
            $('#background-image').hide();
            $('.canvas-container').css('background-color', '');
            //canvas.backgroundColor = "rgba(0,0,0,0)";
            //canvas.renderAll();
        }

    }).click();

    $("#pattern-tint-check").on("click", function(){
        if ($(this).prop('checked')){
            $('.canvas-container').css('background-color', 'rgba(45, 46, 47, 0.43)');
        } else {
            $('.canvas-container').css('background-color', '');
        }
    });

    $("#pattern-parallax-check").on("click", function(){
        var el = document.getElementById("background-image");
        if ($(this).prop('checked')){
            $("#background-image").css({
                width: 1.5 * window.innerWidth,
                height: 1.5 * window.innerHeight
            });
            el.style.left = "-" + window.pageXOffset / 2 + "px";
            el.style.top = "-" + window.pageYOffset / 2 + "px";
        } else {
            $("#background-image").css({
                width: 2 * window.innerWidth,
                height: 2 * window.innerHeight
            });
            el.style.left = "-" + window.pageXOffset + "px";
            el.style.top = "-" + window.pageYOffset + "px";
        }
    }).click();

    $("#element-resizable-check").on("click", function(){
        resizable = $(this).prop("checked");
        if (canvas.getActiveObject()){
            canvas.getActiveObject().setControlsVisibility({
                mt: resizable,
                mb: resizable,
                ml: resizable,
                mr: resizable,
                tr: resizable,
                tl: resizable,
                br: resizable,
                bl: resizable
            });
            canvas.renderAll();
        }
    });

    $("#element-rotatable-check").on("click", function(){
        rotatable = $(this).prop("checked");
        if (canvas.getActiveObject()){
            canvas.getActiveObject().set("hasRotatingPoint", rotatable);
            canvas.renderAll();
        }
    }).click();

    $("#toggle-always-visible-menu").on("click", function(){
        $("#always-visible-menu").toggle();
    }).click();

    $("#grid-show-check").on("click", function(){
        var check = $(this).prop('checked');
        if (check){
            showGrid();
        } else {
            hideGrid();
        }
    });

    $("#shape-heading").on("blur", function(){
        if (tooltipObject != null) {
            if (tooltipObject.category == "rect"){
                tooltipObject.item(1).text = getWrappedCanvasText($(this).val(), canvas, radius, radius, 'center');
            } else {
                tooltipObject.item(1).text = getWrappedCanvasText($(this).val(), canvas, radius, radius, 'center');
            }
            canvas.renderAll();
        }
    });

    $("#shape-datatext").on("blur", function(){
        if (tooltipObject != null) {
            tooltipObject.datatext = $(this).val();
        }
    });

    $("#add-comment").on("click", function(){
        var obj = $("#new-comment"),comment = obj.val();
        if (comment == "") return false;
        var now = new Date();
        var date = now.toLocaleString('en-US',{year:'numeric', month: '2-digit', day:'2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/,'$3-$1-$2');
        //var time = now.getHours() + ":" + now.getMinutes();

        tooltipObject.comments.push({date:date, comment: comment});
        $("#element-comments").append("<h3>"+ date + " : " + comment + "</h3>");
        obj.val("");
    });

    $("#progress-plus-btn").on("click", function(){
        if (parseInt(tooltipObject.progress) + 5 >= 100){
            tooltipObject.progress = 100;
        } else {
            tooltipObject.progress = parseInt(tooltipObject.progress) + 5;
        }
        $("#bar").css("width", tooltipObject.progress+"%");
    });

    $("#progress-minus-btn").on("click", function(){
        if (tooltipObject.progress - 5 < 0){
            tooltipObject.progress = 0;
        } else {
            tooltipObject.progress -= 5;
        }
        $("#bar").css("width", tooltipObject.progress+"%");
    });

    $("#checklist-checkbox-add").on("click", function(){
        var obj = $("#checklist-input"),labelList = obj.val(),newLabel;
        //var type = $("#checklist-select").val();
        //var datePicker = $("#date-picker"), date=datePicker.val();
        if (labelList == "") return false;
        obj.val("");
        //datePicker.val("");
        labelList.split(",").forEach(function(el){
            newLabel = el.trim();
            if (newLabel != "") {
                var row = document.createElement("div"),
                    checkBox = document.createElement("input"),
                    labelTag = document.createElement("label");
                $(checkBox).attr("type","checkbox").attr("data-id",tooltipObject.checklistCheckbox.length).on("click",function(){
                    var id=$(this).attr("data-id"),checked = this.checked;
                    if (checked){
                        tooltipObject.checklistCheckbox[id].checked = "yes";
                    }else{
                        tooltipObject.checklistCheckbox[id].checked = "no";
                    }
                });
                labelTag.innerHTML = newLabel;
                row.className = "form-group width-half";
                $(row).append(checkBox).append(labelTag);
                $("#checklist-checkbox-list").append(row);

                tooltipObject.checklistCheckbox.push({
                    label: newLabel,
                    checked: "no"
                    //type: type,
                    //date: date
                });
            }
        });
    });

    $("#cluster-key").on("keyup", function(){
        tooltipObject.cluster = $(this).val();
    });

    $("#show-trash-element").on("click", function(){
        $(".ext-info").hide();
        $("#trash-panel").show();
    });

    $("#trash-element").on("click", function(){
        var check = $("input[name='confirm-trash']:checked").val();
        switch (check) {
            case 'yes':
                delete elementsInfo[tooltipObject.id];
                canvas.remove(tooltipObject);
                mouseOverElement = false;
                removeImageTools();
                tooltipObject = null;
                canvas.renderAll();
                break;
            case 'no':
                $("#trash-panel").hide();
                break;
        }
    });

    $("#move-element").on("click", function(){
        $(".ext-info").hide();
        $.ajax({
            url: "action.php",
            type: "POST",
            data: {
                "action": "load-file-names"
            },
            success: function(res){
                var obj = $("#move-element-workspace-select");
                obj.html("");
                var names = $.parseJSON(res);
                names.forEach(function(name){
                    if (name != '.' && name != '..' && name != '.gitignore') {
                        var option = document.createElement('option');
                        $(option).attr('value', name.split('.json')[0]).html(name.split('.json')[0]);
                        obj.append(option);
                    }
                });
                $("#move-panel").show();
            }
        });
    });

    $("#move-element-confirm").on("click", function(){
        var fileName = $("#move-element-workspace-select").val();
        if (fileName == "" || tooltipObject.class != "element") return false;

        $.ajax({
            url: "action.php",
            type: "POST",
            data: {
                "action": "load",
                "fileName": fileName
            },
            success: function(res){
                var objects = $.parseJSON(res);
                var obj = deconstructElement(tooltipObject,true);
                obj.id = "moved-" + tooltipObject.id;
                objects.push(obj);
                $.ajax({
                    url: "action.php",
                    type: "POST",
                    data: {
                        "action": "save",
                        "elements": JSON.stringify(objects),
                        "fileName": fileName
                    },
                    success: function(){
                        $("#move-panel").hide();
                        mouseOverElement = false;
                        removeImageTools();
                        canvas.remove(tooltipObject);
                        tooltipObject = null;
                    }
                });
            }
        });

    });

    $("#move-element-cancel").on("click", function(){
        $(".ext-info").hide();
    });

    $("#clone-element").on("click", function(){
        if (tooltipObject.class == "element"){
            //var newElement = fabric.util.object.clone(tooltipObject);
            cloneElement(tooltipObject);
            canvas.renderAll();
        }
    });

    $("#export-element").on("click", function(){
        var res = deconstructElement(tooltipObject, true);
        makeTextFile(tooltipObject.id, JSON.stringify(res));
    });

    $("#beat-element").on("click", function(){
        var obj = $(".bottom.tab-menu").find("li:not(.enable)");
        if (obj.length > 0){
            var beatTab = tooltipObject.beatTab==null?[]:tooltipObject.beatTab;
            var beatTabText = tooltipObject.beatTabText==null?[]:tooltipObject.beatTabText;
            beatTab.push("Tab"+(6-obj.length));
            beatTabText.push("");
            tooltipObject.beatTab = beatTab;
            tooltipObject.beatTabText = beatTabText;
            $(".bottom-tab-text").val("");
            $(obj[0]).addClass('enable');

            var tabName = $(obj[0]).find("a").attr("data-tab");
            var inputTag = document.createElement("input");
            $(inputTag).attr("type","text");
            inputTag.className = "temp-input";
            $(tabName).append(inputTag);
        }
    });

    $(".ttip").delegate("mousedown", ".temp-input", function(e){
        var obj = e.target;
        $(obj).addClass("target");
        e.preventDefault();
        e.stopPropagation();
        tempInputMoving = true;

        var inputTag = document.createElement("input");
        $(inputTag).attr("type","text").attr("id","temp-moving-input")
            .css({
                position: "absolute",
                top: window.pageYOffset + e.clientY,
                left: window.pageXOffset + e.clientX
            });
        $("body").append(inputTag);
    });

    $("body").on("mousemove", function(e){
        if (tempInputMoving){
            $("#temp-moving-input").css({
                position: "absolute",
                top: window.pageYOffset + e.clientY,
                left: window.pageXOffset + e.clientX
            });
        }
    }).on("mouseup", function(e){
        if (tempInputMoving){
            tempInputMoving = false;
            $("#temp-moving-input").remove();
            var divTag = document.createElement("div");
            divTag.className = "permanent-input-box";

            var closeBtn = document.createElement("span");
            closeBtn.innerHTML = "x";
            closeBtn.className = "remove-dragged-input";
            $(closeBtn).on("click", function(){
                $(this).parent().remove();
            });

            $(divTag).appendTo("body").css({
                position: "absolute",
                top: window.pageYOffset + e.clientY,
                left: window.pageXOffset + e.clientX
            }).append(closeBtn);

            $(".temp-input.target").detach().appendTo(divTag).removeClass("target").removeClass("temp-input").addClass("permanent-input");
            //TODO: Calculate position of temp-input if in dialog or not
        }
    });

    $(".bottom-tab-name").on("keyup", function(){
        var name = $(this).val(), id=$(this).attr("data-id");
        if (name != null){
            $(".bottom.tab-menu").find("li.enable.active").find("a").html(name);
            tooltipObject.beatTab[id] = name;
        }
    });

    $(".bottom-tab-text").on("keyup", function(){
        var text = $(this).val(), id = $(this).attr("data-id");
        if (text != null){
            tooltipObject.beatTabText[id] = text;
        }
    });

    $("#show-set-color").on("click", function(){
        $(".ext-info").hide();
        $("#color-panel").show();
    });

    $("#element-color").on("change", function(){
        if ($(this).val() == "custom"){
            $("#rgb-color-input").show();
        } else {
            $("#rgb-color-input").hide();
        }
    });

    $("#rgb-color-input").on("keypress", function(e){
        if (e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 65) || ( e.keyCode > 70 && e.keyCode < 97) || e.keyCode > 102){
            return false;
        }
        if ($(this).val().length > 5){
            return false;
        }
    });

    $("#set-color").on("click", function(){
        var colorValue = $("#element-color").val();
        if (colorValue == 'custom'){
            colorValue = "#" + $("#rgb-color-input").val();
        }

        if (tooltipObject.class == "group"){
            var parentObject=null;
            tooltipObject.forEachObject(function(obj){
                if (obj.isParent){
                    parentObject = obj;
                }
            });
            parentObject.item(0).setFill(colorValue);
        } else if (tooltipObject.class == "element") {
            tooltipObject.item(0).setFill(colorValue);
        }
        canvas.renderAll();
        $(".ext-info").hide();
    });

    $("#show-render-element").on("click", function(){
        $(".ext-info").hide();
        $("#image-panel").show();
    });

    $("#element-image").on("focus", function(){
        $(this).val("http://");
    });

    $("#render-element").on("click", function(){
        var url = $("#element-image").val();
        if (url=="") return false;
        replacePolyWithImage(tooltipObject,url);
    });

    $("#new-object-btn").on("click", function(){
        $("#object-tag").val("");
        $("#json-object").val("");
        $(".tag.active").removeClass("active");
        isNewObject = true;
    });

    $("#add-object-btn").on("click", function(){
        var tagObj = $("#object-tag"), tag = tagObj.val(), objectObj = $("#json-object"), object = objectObj.val();
        if (tag == ""){
            tagObj.focus();
            return false;
        }
        if (object == ""){
            objectObj.focus();
            return false;
        }
        var step = $(this).html();
        if (step == "OK"){
            var index = $(".tag.active").attr('object-id');
            tooltipObject.jsonObjects[index] = {
                tag: tag,
                json: object
            };
            $(".tag.active").html(tag);
            $(this).html("Add Object");
        } else {
            var liTag = document.createElement("li"),
                aTag = document.createElement("a");
            aTag.className = "tag";
            aTag.innerHTML = tag;
            if (tooltipObject.jsonObjects == undefined){
                tooltipObject.jsonObjects = [];
            }
            $(aTag).attr('object-id', tooltipObject.jsonObjects.length);
            $(aTag).on("click", function () {
                $(".tag.active").removeClass("active");
                $(this).addClass("active");
                loadObject($(this).attr('object-id'));
            });
            $(liTag).append(aTag);
            $("#object-tags").append(liTag);
            tooltipObject.jsonObjects.push({
                tag: tag,
                json: object
            });
        }
        tagObj.val("");
        objectObj.val("");
        $(".tag.active").removeClass("active");

        if (tag == 'documents'){
            composePreviewTab(tooltipObject);
        }
    });

    $("#object-tag").on("keyup", function(){
        if (!isNewObject) {
            $("#add-object-btn").html("OK");
        }
    });

    $("#json-object").on("keyup", function(){
        if (!isNewObject) {
            $("#add-object-btn").html("OK");
        }
    });

    $("#idea-img").on("mouseover", function(){
        var msgObj = $("#document-message");
        if (msgObj.html() != ""){
            msgObj.css({
                top: $(this).position().top - 40
            }).show();
        }
    }).on("mouseout", function(){
        $("#document-message").hide();
    });

    $("#preview-box").on("mouseleave", function(){
        setTimeout(function(){
            $("#preview-box").hide();
        }, 500);
    });

    $("#prev-preview-image").on("click", function(){
        var index = parseInt($("#current-preview-image").val()) - 1;
        if (index > 0) {
            $(".preview-image").hide();
            $(".preview-image[order=" + (index - 1) + "]").show();
            $("#current-preview-image").val(index);
        }
    });

    $("#next-preview-image").on("click", function(){
        var index = parseInt($("#current-preview-image").val()) + 1;
        if (index <= $("#total-preview-images").html()) {
            $(".preview-image").hide();
            $(".preview-image[order=" + (index - 1) + "]").show();
            $("#current-preview-image").val(index);
        }
    });

    $("#save-document-image").on("click", function(){
        //window.open($(this).attr('data-url'), '_blank');
        var link = document.createElement('a');
        link.href = $(this).attr('data-url');
        link.download = $(this).attr('data-title');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    $("#test").on("click", function(){
        $("#iframe-panel").find("iframe").attr("src","assets/templates/accordion.html").on("load", function(){
            iframeHandler($(this));
            $("#iframe-panel").show();
        });
    });

    $(".close-iframe").on("click", function(){
        if ($(this).parents("#calendar-iframe").length > 0){
            hideCalendarFrame();
            return;
        }
        if ($(this).parents("#integration-iframe").length > 0){
            hideIntegrationFrame();
            return;
        }
        if ($(this).parents("#timeline-iframe").length > 0){
            hideTimelineFrame();
            return;
        }
        if ($(this).parents("#drop-frame-div").length > 0){
            hideDropFrame();
            return;
        }
        if ($(this).parents("#mapper-iframe").length > 0){
            hideMapperFrame();
            return;
        }
        $(this).parents(".image-tooltip").hide();
        $(this).parents(".third-image-tooltip").hide();
        if ($(this).parents("#tagger-iframe").length > 0){
            $(this).parents("#tagger-iframe").find("iframe").contents().find(".tagger-app-init-btn").click();
        }
    });

    $("#tagger-file-upload-button").on("click", function () {
        $("#tagger-file-upload").click();
    });

    $("#tagger-file-upload").on("change", function(){
        var file_data = $(this).prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('action', 'tagger-file-upload');
        $.ajax({
            url: 'action.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(res){
                if (res == "Success"){
                    alert("Success", "File upload succeeded.");
                } else {
                    alert("Error", res);
                }
            }
        });
    });

    $("#tagger-files-load-btn").on("click", function () {
        var $that = $(this);
        $("#tagger-files").html("<option value=''>Select...</option>");
        $.ajax({
            url: "action.php",
            type: "post",
            data: {
                action: "get-tagger-file-names"
            },
            success: function(res){
                if (res == "fail") {
                    alert("Error", "Cannot open files");
                    return;
                }
                var files = $.parseJSON(res);
                files.forEach(function(file){
                    if (file != "." && file != ".." && file != ".gitignore"){
                        $("#tagger-files").append($("<option></option>",{
                            text: file,
                            value: file
                        }));
                    }
                });
                $("#tagger-files").show();
            }
        });
    });

    $("#tagger-files").on("change", function(){
        var fileName = $(this).val(), $that = $(this), extension = fileName.split(".")[fileName.split(".").length - 1];
        $.ajax({
            url: "action.php",
            type: "post",
            data: {
                action: "get-tagger-file",
                file: fileName
            },
            success: function(res){
                var result = "";
                if (res == "fail"){
                    alert("Error", "Cannot open the file.");
                    return;
                }
                if (extension == "html" || extension == "htm"){
                    //var $doc = $("<html></html>", {
                    //    html: res
                    //});
                    //$doc.find("script").remove();
                    //$doc.find("style").remove();
                    //$doc.find("title").remove();
                    //$doc.find("meta").remove();
                    //$doc.find("link").remove();
                    //$doc.find("input").remove();
                    //$doc.find("select").remove();
                    //$doc.find("textarea").remove();
                    //$doc.find("datalist").remove();
                    //$doc.find("output").remove();
                    //$doc.find("button").each(function(i, btn){
                    //    $(btn).replaceWith("<p>" + btn.innerText + "</p>");
                    //});
                    //$doc.find("a").attr("href", "");
                    //res = $doc.html();
                    var $doc = $.parseHTML(res);
                    $doc.forEach(function(tag){
                        if (tag.nodeName == "P"){
                            result += tag.outerHTML;
                        } else if (tag.nodeName.toLowerCase() != "script" && tag.nodeName.toLowerCase() != "style" && tag.nodeName.toLowerCase() != "link" && tag.nodeName.toLowerCase() != "meta") {
                            result += $(tag).text();
                        }
                    });
                } else {
                    result = res;
                }
                var $iframeContent = $that.parents("#tagger-iframe").find("iframe").contents();
                $iframeContent.find(".playground").next().find(".image-btn").show();
                $iframeContent.find(".tagger-content").html(result).removeClass("init");

                $("#tagger-files").hide();
            }
        });
    });

    $("#tagger-app-load-btn").on("click", function(){
        $.ajax({
            url: "./action.php",
            type: "POST",
            data: {
                action: "load-tagger-names"
            },
            success: function(res){
                if (res != "fail") {
                    var names = $.parseJSON(res), $select = $("#tagger-apps");
                    $select.html("<option value=''>Select</option>");
                    names.forEach(function (name) {
                        if (name != "." && name != ".." && name != ".gitignore") {
                            $("<option></option>", {
                                text: name,
                                value: name
                            }).appendTo($select);
                        }
                    });
                    $select.show();
                }
            }
        });
    });

    $("#tagger-apps").on("change", function () {
        var $that = $(this);
        $.ajax({
            url: "./action.php",
            type: "POST",
            data: {
                action: "load-tagger-app",
                name: $that.val()
            },
            success: function(res){
                $that.hide();
                var text = $.parseJSON(res).full, obj = $that.parents("#tagger-iframe").find("iframe").contents().find(".tagger-content");
                obj.parents(".playground").next().find(".image-btn").show();
                obj.parents(".playground").find(".tagger-highlight-keyword").removeClass("selected");
                obj.removeClass("init").html(text);
                obj.find("code").each(function(i, tag){
                    obj.parents(".playground").find("#"+$(tag).attr("data-keyword")+"-keyword").addClass("selected");
                    $(tag).on({
                        click: function(){
                            $("#tagger-iframe").find("iframe").contents().find("#"+$(this).attr("data-keyword")+"-keyword").addClass("selected");
                            $("#tagger-iframe").find("iframe").contents().find("#tagger-keyword-div").attr("data-target", $(this).attr("id")).css({
                                left: this.getBoundingClientRect().left,
                                top: this.getBoundingClientRect().bottom
                            }).show();
                        },
                        mouseover: function(e){
                            if (window.getSelection().toString() != "") return false;
                            var $objects = $.merge($(e.originalEvent.target), $(e.originalEvent.target).parents("code"), $(e.originalEvent.target).find("code")), $obj;
                            $objects.each(function(i,el){
                                $obj = $("#tagger-iframe").find("iframe").contents().find("#"+$(el).attr("data-keyword")+"-keyword");
                                //if ($obj.html() == "") return false;
                                $obj.addClass("hover");
                            });
                        },
                        mouseout: function(e){
                            var $objects = $.merge($(e.originalEvent.target), $(e.originalEvent.target).parents("code"), $(e.originalEvent.target).find("code")), $obj;
                            $objects.each(function(i,el){
                                $obj = $("#tagger-iframe").find("iframe").contents().find("#"+$(el).attr("data-keyword")+"-keyword");
                                //if ($obj.html() == "") return false;
                                $obj.removeClass("hover");
                            });
                        }
                    });
                });
            }
        });
    });

    $("#tagger-app-load-json-btn").on("click", function(){
        $.ajax({
            url: "./action.php",
            type: "POST",
            data: {
                action: "load-tagger-names"
            },
            success: function(res){
                if (res != "fail") {
                    var names = $.parseJSON(res), $select = $("#tagger-json-apps");
                    $select.html("<option value=''>Select</option>");
                    names.forEach(function (name) {
                        if (name != "." && name != ".." && name != ".gitignore") {
                            $("<option></option>", {
                                text: name,
                                value: name
                            }).appendTo($select);
                        }
                    });
                    $select.show();
                }
            }
        });
    });

    $("#tagger-json-apps").on("change", function () {
        var $that = $(this);
        $.ajax({
            url: "./action.php",
            type: "POST",
            data: {
                action: "load-tagger-app",
                name: $that.val()
            },
            success: function(res){
                $that.hide();
                var text = JSON.stringify($.parseJSON(res).json), obj = $that.parents("#tagger-iframe").find("iframe").contents().find(".tagger-content");
                obj.parents(".playground").next().find(".image-btn").show();
                obj.parents(".playground").find(".tagger-highlight-keyword").removeClass("selected");
                obj.removeClass("init").html(text);
            }
        });
    });

    $("#tagger-app-save-btn").on("click", function(){
        var $obj = $(this).parents("#tagger-iframe").find("iframe").contents();
        var app_name = $obj.find("#tagger-app-name").val();
        if (app_name == ""){
            $obj.find(".tagger-notification-panel").html("Input App Name!!!");
            setTimeout(function(){
                $obj.find(".tagger-notification-panel").html("");
            }, 3000);
            return false;
        }
        if (!$obj.find("#Hint-keyword").hasClass("selected")){
            $obj.find(".tagger-notification-panel").html("Hint Not Checked!!!");
            setTimeout(function(){
                $obj.find(".tagger-notification-panel").html("");
            }, 3000);
            return false;
        }
        $obj.find("#tagger-app-name").val("").css("right", 0);
        var data = {}, wordID = "", tmp, wordIDs = [], list = [];
        $obj.find(".tagger-highlight-text").each(function(i, el){
            wordID = $(el).attr("data-word-id").toString();
            if (data[wordID] == undefined) {
                wordIDs.push(wordID);
                data[wordID] = {
                    text: $(el).text(),
                    keyword: $(el).attr("data-keyword")
                }
            } else {
                tmp = data[wordID].text;
                data[wordID] = {
                    text: tmp + $(el).text(),
                    keyword: $(el).attr("data-keyword")
                }
            }
        });
        wordIDs.forEach(function(id){
            list.push(data[id]);
        });
        $.ajax({
            url: "./action.php",
            data: {
                "action": "save-tagger",
                data: {"json": list, "full": $obj.find(".tagger-content").html()},
                name: app_name
            },
            type: "POST",
            success: function(){
                $obj.find(".tagger-notification-panel").html("Saved Successfully!");
                setTimeout(function(){
                    $obj.find(".tagger-notification-panel").html("");
                }, 3000);
            }
        });
    });

    $("#test-draggable").on("click", function(){
        var obj = $("#iframe-draggable");
        obj.find("iframe").attr("src","assets/templates/accordion.html").on("load",function(){
            iframeHandler($(this));
            $("#iframe-draggable").css("left",(window.innerWidth - parseInt(obj.css('width'))) / 2).show();
        });
    });

    $("#iframe-draggable").draggable();

    $("#add-callback-btn").on("click", function(){
        var name = $("#callback-name").val(),content = $("#callback").val();
        if (name == ""){
            alert("error","Please make sure that you entered name of callback!");
            $("#callback-name").focus();
            return false;
        }
        if (content == ""){
            alert("error","Please make sure that you entered content of callback!");
            $("#callback").focus();
            return false;
        }
        $.ajax({
            url: "action.php",
            type: "POST",
            data: {
                "action": "save-callback",
                "name": name,
                "callback": content
            },
            success: function(){
                var liTag = document.createElement("li"),
                    aTag = document.createElement("a");
                aTag.className = "tag";
                aTag.innerHTML = name.split('.txt')[0];
                $(aTag).attr('object-name', name.split('.txt')[0]);
                $(aTag).on("click", function(){
                    $(".tag.active").removeClass("active");
                    $(this).addClass("active");
                    loadCallback($(this).attr('object-name'));
                });
                $(liTag).append(aTag);
                $("#callback-tags").append(liTag);

            }
        });
    });

    $("#reload-callback-btn").on("click", function(){
        loadAllCallbacks();
    });

    $("#run-callback-btn").on("click", function(){
        var fileName = $("#callback-tags").find(".tag.active").attr("object-name");
        $.getScript("data/callback/" + fileName + ".txt",function(){});
    });

    $("#sql-setting-btn").on("click", function(){
        saveSQLSetting();
    });

    $("#add-people-btn").on("click", function(){
        $.ajax({
            url: "action.php",
            type: "POST",
            data: {
                "action": "save-people",
                "data": $("#people-list").val()
            },
            success: function (res) {
                if (res == "fail"){
                    alert("Fail", "Save failed.");
                } else {
                    alert("Success", res);
                    $("#people-invite-all-btn").show();
                    loadPeople();
                }
            }
        });
    });

    $("#message-date").datepicker();
    $("#message-cc-select").multipleSelect({
        placeholder: "Bcc"
    });

    $("#message-send-btn").on("click", function(){
        var message = {};
        message.to = $("#message-to-address").val();
        message.date = $("#message-date").val();
        message.subject = $("#message-subject").val();
        message.bcc = [];
        message.content = $("#message-body").val();
        var cc_list_tags = $("#message-cc-select").next().find("li.selected").find("input");
        cc_list_tags.each(function(i,el){
            message.bcc.push($(el).val());
        });
        $.ajax({
            url: "action.php",
            type: "POST",
            data: {
                action: "send-email",
                data: message
            },
            success: function(res){
                if (res == "success"){
                    alert("Success", "Sending E-mail succeeded");
                } else {
                    alert("Fail", res);
                }
            }
        });
    });

    $(".upload-plus").on("click", function(){
        $(this).parent().find("input[type='file']").click();
    });

    $(".upload-cancel").on("click", function(){
        $(this).parent().find(".cancel").click();
    });

    $(".upload-start").on("click", function(){
        $(this).parent().find(".start").click();
    });

    $("#add-element-from-search").on("click", function(){
        //var obj = $("#" + $("#searchTooltip").attr("data-target")).find(".search-tooltip-object"), name = obj.find(".regex-search-head").text(), text = obj.find(".regex-search-tagline").text();
        var dialog = $("#searchTooltip"), obj = $("#" + dialog.attr("data-target")).find(".search-tooltip-object"), name = dialog.find(".tab-menu").find("a").text(), text = dialog.find("#search-result-description").val();
        addNewRectangle(name, "", 0, dialog.offset().left + 75 + dialog.innerWidth() / 2, dialog.offset().top + 15, text);
        mouseOverElement = false;
        removeImageTools();
    });

    $("#show-text-from-search").on({
        click: function(){
            var $obj = $("#text-from-search");
            $obj.find(".loading").show();
            $obj.find("#text-from-search-content").html("");
            $obj.show();
            $.ajax({
                url: "action.php",
                type: "POST",
                data: {
                    action: "get-text-from-url",
                    id: $("#search-result-id").val()
                },
                success: function(res){
                    $obj.find(".loading").hide();
                    if (res == "fail"){
                        $obj.find("#text-from-search-content").html("No Content");
                    } else {
                        var objs = $.parseHTML(res), result = "";
                        objs.forEach(function(obj){
                            if (obj.nodeName == "P"){
                                result += obj.outerHTML;
                            } else if (obj.nodeName.toLowerCase() != "script" && obj.nodeName.toLowerCase() != "style" && obj.nodeName.toLowerCase() != "link" && obj.nodeName.toLowerCase() != "meta") {
                                result += obj.wholeText;
                            }
                        });
                        $obj.find("#text-from-search-content").html(result);
                    }
                }
            });
        }
    });

    $("#download-link-from-search").on("click", function(){
        $.ajax({
            url: "action.php",
            type: "POST",
            data: {
                action: "get-file-from-url",
                id: $("#search-result-id").val()
            },
            success: function(res){
                if (res != "fail"){
                    downloadFileFromURI(res, "File");
                }
            }
        });
    });

    $("#text-from-search").on("mouseleave", function(){
        $(this).hide();
    });

    $(".custom-accordion-add-btn").on("click", function(){
        $("<h1></h1>", {
            class: "custom-accordion-header"
        }).on("click", function(e){
            e.preventDefault();
            if (e.originalEvent.target.className == "custom-accordion-remove-btn"){
                $(this).addClass("status-remove");
                $(this).next().addClass("status-remove");
                setTimeout(function(){
                    $(".status-remove").remove();
                    saveAccordion();
                }, 1000);
                return;
            }
            if ($(this).hasClass("status-open")){
                $(".status-open").removeClass("status-open");
            } else {
                $(".status-open").removeClass("status-open");
                $(this).addClass("status-open");
                $(this).next().addClass("status-open");
            }
            if ($(this).parent().find(".status-open").length == 0){
                $(this).parents(".image-tooltip").css("height", "50%");
            } else {
                $(this).parents(".image-tooltip").css("height", "90%");
            }
        }).append($("<span></span>", {
            class: "custom-accordion-title",
            text: "New Key"
        }).on("mouseover", function(){
            replaceCustomInput($(this));
        })).append($("<span></span>", {
            class: "custom-accordion-remove-btn",
            html: "&times;"
        }).on("click", function(){
            $(this).parent().addClass("status-remove");
            $(this).parent().next().addClass("status-remove");
            setTimeout(function(){
                $(".status-remove").remove();
                saveAccordion();
            }, 1000);
        })).appendTo($(this).parent().parent().find(".custom-accordion-data-panel"));

        $("<div></div>", {
            class: "custom-accordion-content"
        }).append($("<img/>", {
            src: "assets/images/icons/hexagon-24.png",
            title: "Convert into hexagon"
        }).on("click", function(){
            var obj = $(this).parent();
            obj.removeClass("status-open").css("transform", "translateX(-"+ obj.css("width") + ")").addClass("status-remove");
            obj.prev().removeClass("status-open").css("transform", "translateX(-"+ obj.prev().css("width") + ")").addClass("status-remove");
            addNewHexagon(obj.prev().find(".custom-accordion-title").text(), "", 0, obj.prev().offset().left - radius, obj.prev().offset().top + radius, obj.find(".custom-accordion-text").val());
            setTimeout(function(){
                $(".status-remove").remove();
            }, 500);
        })).append($("<img/>", {
            src: "assets/images/icons/circle-24.png",
            title: "Convert into circle"
        }).on("click", function(){
            var obj = $(this).parent();
            obj.removeClass("status-open").css("transform", "translateX(-"+ obj.css("width") + ")").addClass("status-remove");
            obj.prev().removeClass("status-open").css("transform", "translateX(-"+ obj.prev().css("width") + ")").addClass("status-remove");
            addNewCircle(obj.prev().find(".custom-accordion-title").text(), "", 0, obj.prev().offset().left - radius, obj.prev().offset().top + radius, obj.find(".custom-accordion-text").val());
            setTimeout(function(){
                $(".status-remove").remove();
            }, 500);
        })).append($("<textarea></textarea>", {
            text: "New value",
            class: "custom-accordion-text default-textarea"
        }).on("keyup", function(){
            saveAccordion();
        })).appendTo($(this).parent().parent().find(".custom-accordion-data-panel"));

        saveAccordion();
    });

    $(".custom-accordion-scroll-up-btn").on("click", function(){
        var $obj = $(this).parent().parent().find(".custom-accordion-data-panel");
        $obj.animate({scrollTop: $obj.scrollTop() - 50}, 500);
    });

    $(".custom-accordion-scroll-down-btn").on("click", function(){
        var $obj = $(this).parent().parent().find(".custom-accordion-data-panel");
        $obj.animate({scrollTop: $obj.scrollTop() + 50}, 500);
    });

    //TODO: this is temporary code. this should be removed later
    for (var i = 1; i <= 5; i ++){
        $(".custom-accordion-add-btn").trigger("click");
    }

    $("#json-url-btn").on("click", function(){
        $(this).parents(".image-tooltip").hide();
        var urls = $("#json-url").val();
        if (urls == "") return;
        $(".loader-container").fadeIn();
        $.ajax({
            url: "action.php",
            type: "POST",
            accepts: {
                json: "application/json, text/javascript"
            },
            data: {
                action: "load-json-from-url",
                url: urls
            },
            success: function(res){
                try {
                    var left = 50, top = 50, text = "", firstKey;
                    var objs = $.parseJSON(res), order = 0;
                    $.each(objs, function(i, obj){
                        $.each(obj["books"], function(i, data){
                            $.each(data, function(key, value){
                                if (order == 0) {
                                    text = value;
                                    firstKey = value;
                                } else {
                                    text = text + ", " + value;
                                }
                                order ++;
                            });
                            var box = addBackgroundTextBox(left, top, text, 200, 500);
                            box.id = firstKey;
                            var $listObj = $("#json-object-id-list");
                            $listObj.val($listObj.val() + box.id + "\n");
                            text = "";
                            order = 0;
                            left += 250;
                            if (left > window.innerWidth * 2){
                                left = 50;
                                top += 250;
                            }
                            if (top > window.innerHeight * 2) {
                                left = 25;
                                top = 25;
                            }
                        });
                    });
                } catch (e) {
                    console.log(e);
                }
            },
            complete: function(){
                $(".loader-container").fadeOut();
            }
        });
    });

    $("#json-object-prev-btn").on("click", function(e){
        var $target = $(this);
        if (pgJsonObjects == null) return;
        var currentPage = $target.data("current-page") - 1;
        var perPage = $target.data("per-page");
        if (currentPage < 0) currentPage = Math.cell(pgJsonObjects.length / perPage);
        var start = currentPage * perPage;
        $target.data("current-page", currentPage);
        drawTextboxFromPgJSON(start, Math.min(start + perPage - 1, pgJsonObjects.length));
    });

    $("#json-object-next-btn").on("click", function(e){
        var $target = $(this);
        if (pgJsonObjects == null) return;
        var currentPage = $target.data("current-page") + 1;
        var perPage = $target.data("per-page");
        if (pgJsonObjects.length < currentPage * perPage) currentPage = 0;
        var start = currentPage * perPage;
        $target.data("current-page", currentPage);
        drawTextboxFromPgJSON(start, Math.min(start + perPage - 1, pgJsonObjects.length));
    });

    $("#json-object-close-btn").on("click", function(){
        $('#json-object-button-div').hide();
        $('.canvas-container').css('background-image', '');
        removeAllTextbox();
    });

    $("#json-object-toggle-btn").on("click", function(){
        var mode = $(this).data("mode");
        if (mode == "simple") {
            $(this).data("mode", "full");
        } else {
            $(this).data("mode", "simple");
        }
        canvas.forEachObject(function(obj){
            if (obj.class == "background-textbox") {
                if (mode == "simple") {
                    obj.text = getWrappedCanvasText(obj.fullText, canvas, 200);
                } else if (obj.mode == "full") {
                    obj.text = getWrappedCanvasText(obj.simpleText, canvas, 200);
                }
                obj.setCoords();
                canvas.renderAll();
                obj.backgroundBox.set({
                    width: obj.width + 20,
                    height: obj.height + 20
                });
            }
        });
        canvas.renderAll();
    });

    $(document).keyup(function(e){
        e.preventDefault();
        if (e.keyCode == "27"){
            $("#new-element-div").hide();

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
        }
    });

}

function loadCallback(name){
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-callback",
            "name": name
        },
        success: function(res){
            $("#callback-name").val(name);
            $("#callback").val(res);
            $("#run-callback-btn").css("opacity",1);
        }
    });
}

function loadAllCallbacks(){
    $("#callback-name").val("");
    $("#callback").val("");
    $("#run-callback-btn").css("opacity",0);
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-callback-names"
        },
        success: function(res){
            var names = $.parseJSON(res);
            $("#callback-tags").html("");
            names.forEach(function(name){
                if (name != '.' && name != '..' && name != '.gitignore') {
                    var liTag = document.createElement("li"),
                        aTag = document.createElement("a");
                    aTag.className = "tag";
                    aTag.innerHTML = name.split('.txt')[0];
                    $(aTag).attr('object-name', name.split('.txt')[0]);
                    $(aTag).on("click", function(){
                        $(".tag.active").removeClass("active");
                        $(this).addClass("active");
                        loadCallback($(this).attr('object-name'));
                    });
                    $(liTag).append(aTag);
                    $("#callback-tags").append(liTag);
                }
            });
        }
    });
}

function loadPeople(){
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-people"
        },
        success: function(res){
            if (res == "fail") {

            } else if (res == ""){
                $("#people-list").val("");
                $("#message-cc-select").html("");
                //alert("Notification", "People Empty");
            } else {
                var list = $.parseJSON(res), txt = "", line = "";
                $("#people-list-div").html("");
                var ulTag = $("<ul></ul>", {
                    class: "people-list"
                }).appendTo("#people-list-div");
                $("#message-cc-select").html("");
                list.forEach(function(person){
                    // Add People tab on Setting dialog
                    line = person[0] + " " + person[1] + " " + person[2] + "\r\n";
                    txt += line;
                    // Message CC List
                    $("#message-cc-select").append($("<option></option>", {
                        text: person[0],
                        value: person[0]
                    }));
                    // People list div
                    $("<li></li>", {

                    }).append($("<p></p>", {
                        text: person[1],
                        class: "contact-person-email"
                    }).append($("<img/>", {
                        src: "./assets/images/icons/suitcase-24.png"
                    })).append($("<img/>", {
                        src: "./assets/images/icons/pen-24.png"
                    }))).append($("<span></span>", {
                        text: person[0],
                        class: "contact-person-name"
                    }).on("click", function(){
                        var div = $(this).parents("#contactDiv");
                        $("#messageDiv").css("left", parseInt(div.css("width")) + 310).css("top", 150).show();
                        $("#message-to-address").val($(this).text());

                    })).append($("<span></span>", {
                        text: person[2],
                        class: "contact-person-slack"
                    }).on("click", function(){
                        var div = $(this).parents("#contactDiv");
                        $("#messageDiv").css("left", parseInt(div.css("width")) + 310).css("top", 150).show();
                    }))
                    .appendTo(ulTag);
                });
                $("#people-list").val(txt);
                $("#message-cc-select").multipleSelect("refresh");
            }
        }
    });
}

function saveAccordion(){
    var $obj = $("#custom-accordion-div");
    var $keyObjects = $obj.find(".custom-accordion-header");
    var result = [];
    $keyObjects.each(function(i,el){
        result[i] = {
            key: $(el).find(".custom-accordion-title").text(),
            value: $(el).next().find("textarea").val()
        }
    });
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            action: "save-accordion",
            data: result
        },
        success: function(res){
            console.log("custom accordion save " + res);
        }
    });
}

function replaceCustomInput($obj){
    var $newObj = $("<input/>", {
        value: $obj.html(),
        type: "text",
        class: "custom-accordion-title-text"
    }).on("blur mouseleave", function(){
        replaceCustomTitle($(this));
        saveAccordion();
    }).on("click", function(e){
        e.preventDefault();
        return false;
    });
    $obj.replaceWith($newObj);
    $newObj.focus();
}

function replaceCustomTitle($obj){
    $obj.replaceWith($("<span></span>", {
        class: "custom-accordion-title",
        text: $obj.val()
    }).on("mouseover", function(){
        replaceCustomInput($(this));
    }));
}

$(function () {
    'use strict';

    var obj = $('#fileupload');
    obj.fileupload({
        url: 'upload/',
        dropZone: $("body"),
        disableImageLoad: true,
        disableImageResize: true
    });

    // Load existing files:
    obj.addClass('fileupload-processing');
    $.ajax({
        url: obj.fileupload('option', 'url'),
        dataType: 'json',
        context: obj[0]
    }).always(function () {
        $(this).removeClass('fileupload-processing');
    }).done(function (result) {
        $(this).fileupload('option', 'done')
            .call(this, $.Event('done'), {result: result});
    });

});

$(function () {
    'use strict';

    var obj = $('#message-fileupload');
    obj.fileupload({
        url: 'attachment/',
        disableImageLoad: true,
        disableImageResize: true,
        autoUpload: true
    });

    obj.addClass('fileupload-processing');
    $.ajax({
        url: obj.fileupload('option', 'url'),
        dataType: 'json',
        context: obj[0]
    }).always(function () {
        $(this).removeClass('fileupload-processing');
    }).done(function (result) {
        $(this).fileupload('option', 'done')
            .call(this, $.Event('done'), {result: result});
    });

});

function objectDropHandler(message){
    switch (message.data.action){
        case "object:drag":
            if (!interactionMode) {
                interactionMode = true;
                if (message.data.itemClass == "circle") {
                    targetElement = addNewCircle(message.data.itemText, "", 0, cursorPosition.x, cursorPosition.y, "");
                } else if (message.data.itemClass == "hexagon") {
                    targetElement = addNewHexagon(message.data.itemText, "", 0, cursorPosition.x, cursorPosition.y, "");
                }
            } else {
                targetElement.set({
                    left: $("#drag-drop-frame").offset().left + message.data.itemX,
                    top: $("#drag-drop-frame").offset().top + message.data.itemY
                }).setCoords();
                targetElement.newPoint.set({
                    left: targetElement.left,
                    top: targetElement.top - targetElement.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
                }).setCoords();
                if (targetElement.tickButton) {
                    targetElement.tickButton.set({
                        left: targetElement.left + targetElement.scaleX * radius,
                        top: targetElement.top - targetElement.scaleX * Math.sqrt(3) * (radius - border / 2) / 2
                    }).setCoords();
                }
                canvas.renderAll();
            }
            break;
        case "object:drag:cancel":
            if (interactionMode && targetElement != null){
                interactionMode = false;
                canvas.remove(targetElement, targetElement.newPoint, targetElement.tickButton);
                canvas.renderAll();
            }
    }
}