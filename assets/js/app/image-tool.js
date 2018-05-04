function showImageTools (e, parent) {
    mouseOverElement = true;

    var labelList = $("#label-list").val().split(',');
    $("#checklist-select").html("");
    labelList.forEach(function(label){
        $("#checklist-select").append("<option value='" + label + "'>" + label + "</option>")
    });

    var dialog = $("#imageDialog"),txt;
    dialog.find(".top.tab-menu").find("li:first-child").find("a").click();
    dialog.find("#new-comment").html("");
    if (e.class == "group") {
        var parentObject = null;
        e.forEachObject(function (obj) {
            if (obj.isParent) {
                parentObject = obj;
            }
        });
        txt = parentObject == null ? e.item(0) : parentObject;
    } else {
        txt = e;
    }
    tooltipObject = txt;

    dialog.find("#shape-heading").val(eatSpace(txt.item(1).getText()));
    dialog.find("#shape-datatext").val(txt.datatext);
    dialog.find("#bar").css('width',txt.progress+'%');

    if (tooltipObject.category == "rect"){
        dialog.addClass("second");
    } else {
        dialog.removeClass("second");
    }

    composeTagsTab(txt);

    composeChecklistTab(txt);

    composePreviewTab(txt);

    if (txt.beatTab == null){
        dialog.find(".bottom.tab-menu").find("li.enable").removeClass("enable");
        for (var ii = 1; ii < 6; ii ++){
            dialog.find(".bottom.tab-menu").find("li:nth-child(" + ii + ")").find("a").html("Tab"+ii);
            $("#tab" + ii + "-name").val("Tab"+ii);
            $("#tab" + ii + "-text").val("");
        }
    } else {
        txt.beatTab.forEach(function(tab,index){
            dialog.find(".bottom.tab-menu").find("li:nth-child(" + (index + 1)+ ")").addClass("enable");
            dialog.find(".bottom.tab-menu").find("li:nth-child(" + (index + 1)+ ")").find("a").html(tab);
            $("#tab" + (index + 1) + "-name").val(tab);
            $("#tab" + (index + 1) + "-text").val(txt.beatTabText[index]);
        });
    }
    $("#cluster-key").val(txt.cluster);
    if (txt.item(0).fill.indexOf("#") < 0) {
        dialog.find("#element-color").val(txt.item(0).fill);
        dialog.find("#rgb-color-input").val("").hide();
    } else {
        dialog.find("#element-color").val("custom");
        dialog.find("#rgb-color-input").val(txt.item(0).fill).show();
    }
    $("#object-tags").html("");
    $("#object-tag").val("");
    $("#json-object").val("");
    $("#add-object-btn").html("Add Object");
    isNewObject = true;
    if (txt.jsonObjects != undefined) {
        txt.jsonObjects.forEach(function (obj, index) {
            var liTag = document.createElement("li"),
                aTag = document.createElement("a");
            aTag.className = "tag";
            aTag.innerHTML = obj.tag;
            $(aTag).attr('object-id', index);
            $(aTag).on("click", function () {
                $(".tag.active").removeClass("active");
                $(this).addClass("active");
                loadObject($(this).attr('object-id'));
            });
            $(liTag).append(aTag);
            $("#object-tags").append(liTag);
        });
    }

    if (txt.category == "custom"){
        dialog.find("#element-image").val(txt.item(0)._originalElement.currentSrc);
    } else {
        dialog.find("#element-image").val("");
    }
    var obj = dialog.find("#element-comments");
    obj.html("");
    if (txt.comments.length > 0){
        txt.comments.forEach(function(c){
            obj.append("<h3>" + c.date + " : " + c.comment + "</h3>");
        });
    }

    dialog.show();

    moveImageTools(dialog,e,parent);
}

function showSettingTooltip(){
    $('.image-tooltip').hide();
    tooltipObject = null;
    mouseOverElement = true;
    var dialog = $("#settingDialog");
    var top = window.scrollY + 50;
    var left = window.scrollX + 50;
    dialog.css({
        top: top > 0 ? top : 0,
        left: left
    }).show();
}

function showTagTooltip(){
    $('.image-tooltip').hide();

    mouseOverElement = true;
    var viewList = $("#view-list");
    viewList.html("");
    views.forEach(function(view,index){
        var item = document.createElement("p");
        if (currentView == index){
            $(item).addClass("active");
        }
        $(item).html(view.name).attr("data-id",index).on("click",function(){
            viewList.find("p").removeClass("active");
            $(this).addClass("active");
            currentView = $(this).attr("data-id");
            loadView($(this).attr("data-id"));
        });
        viewList.append(item);
    });

    clusters = [];
    $("#cluster-list").html("");
    canvas.forEachObject(function(obj){
        if (obj.class == 'element' && obj.cluster != ''){
            if (clusters.hasOwnProperty(obj.cluster)) {
                clusters[obj.cluster].push(obj.id);
            } else {
                clusters[obj.cluster] = [obj.id];
            }
        }
    });
    for (var key in clusters){
        if (clusters.hasOwnProperty(key)) {
            $('<li></li>', {
                text: key + " (" + clusters[key].length + ")",
                'data-key': key
            }).on("click", function(){
                clusterElements($(this).attr('data-key'));
                removeImageTools(true);
            }).appendTo("#cluster-list");
        }
    }

    var dialog = $("#tagDialog");
    var top = window.scrollY + 50;
    var left = window.scrollX + 50;
    dialog.css({
        top: top,
        left: left
    }).show();
}

function moveImageTools (dialog,e,parent) {
    //var dialog = $('#imageDialog');
    var w = dialog.width();
    var h = dialog.height();

    //var e = canvas.getActiveObject();
    //var e = canvas._setCursorFromEvent();
    var coords = getObjPosition(e);

    if(getObjPosition(e)=='null')
    {
        return false;
    }
    // -1 because we want to be inside the selection body
    var top,bottom,left,right;

    if (parent){
        var parentWidth = parent.width, parentHeight = parent.height;
        top = coords.top + e.getHeight() / 2 - h / 2 - 11 + parent.top + parentHeight / 2;
        bottom = top + h + 50;
        left = coords.right + parent.left + parentWidth / 2;
        right = left + w;
    } else {
        top = coords.top + e.getHeight() / 2 - h / 2 - 11;
        bottom = top + h + 50;
        left = coords.right;
        right = left + w;
    }
    if (bottom > window.innerHeight + window.scrollY){
        top=window.innerHeight + window.scrollY - h - 80;
    }
    if(top < window.scrollY) {
        top = window.scrollY;
    }
    if (right > window.innerWidth + window.scrollX){
        if (parent){
            left = coords.left + parent.left + parentWidth / 2 - w;
        } else {
            left = coords.left - w;
        }
    }
    dialog.show().css({top: top, left: left});
}

function removeImageTools(param){
    if (!param && mouseOverElement){
        return false;
    }
    if ($('.temp-textarea').length > 0) {
        $('#ttip-exit').click();
    }
    //$('#imageDialog').hide();
    $('.image-tooltip:not(.text)').hide();
    $('.image-tooltip.text').show().removeClass("hover");
    $('#ui-datepicker-div').hide();
    $(".search-tooltip-object").removeClass("search-tooltip-object");
    tooltipObject = null;

    $(".temp-input").remove();
}

function composeTagsTab(obj){
    // Tag section
    var tagList = $("#tags-list").val().split(","), tagSelect = $("#multi-select"), curTagList=[], existing, tag;
    obj.tags.forEach(function(tag){curTagList.push(tag)});
    tagSelect.html("");
    tagList.forEach(function(el){
        tag = el.trim();
        if (tag != '') {
            existing = false;
            curTagList.forEach(function (el, index) {
                if (tag == el) {
                    existing = true;
                    curTagList.splice(index, 1);
                }
            });
            if (existing) {
                tagSelect.append("<option value='" + tag + "' selected>" + tag + "</option>");
            } else {
                tagSelect.append("<option value='" + tag + "'>" + tag + "</option>");
            }
        }
    });
    curTagList.forEach(function(tag){
        tagSelect.append("<option value='" + tag + "' selected>" + tag + "</option>");
    });
    tagSelect.multipleSelect('refresh');
    // End of Tag section
}

function composeChecklistTab(obj){
    var labelPane = $("#checklist-labels"),list;
    labelPane.html("");
    if (obj.checklistLabel.length == 0){
        var checklist = $("#label-list").val().split(",");
        checklist.forEach(function(el,index){
            list = el.trim();
            var row = document.createElement("div"),
                closeBtn = document.createElement("span"),
                closeDiv = document.createElement("div"),
                labelSpan = document.createElement("span"),
                labelDiv = document.createElement("div"),
                textDiv = document.createElement("div"),
                iconDiv = document.createElement("div"),
                isDate = /[dD][aA][tT][eE]/.test(list);
            row.className = "row";
            closeBtn.className = "remove-checklist";
            $(closeBtn).html("x").on("click",function(){
                $(this).parent().parent().remove();
                updateChecklist();
            });
            closeDiv.className = "column one padding";
            $(closeDiv).append(closeBtn);
            labelDiv.className = "column three padding";
            $(labelSpan).attr("class","label").html(list);
            $(labelDiv).append(labelSpan);
            textDiv.className = "column eight";
            var inputTag = document.createElement("input");
            $(textDiv).append(inputTag);
            if (isDate){
                $(inputTag).attr("readonly", true).datepicker({
                    showOn: "button",
                    buttonImage: "assets/images/icons/calendar-white.png",
                    buttonImageOnly: true,
                    buttonText: "Select date"
                }).on("change", updateChecklist);
            }else{
                inputTag.placeholder = "<Type>";
                $(inputTag).on("focus keyup", function(){
                    var list = $("#checklist").find(".suggest-list").css('top',$(this).position().top + parseInt($(this).css('height')) + 5).css('left',$(this).position().left).show().find("li"), data = $(this).val();
                    list.each(function(i,str){
                        if ($(str).html().indexOf(data.substring(data.lastIndexOf(',')+1)) < 0){
                            $(this).hide();
                        } else {
                            $(this).show();
                        }
                    });
                    activeSuggestInput = $(this);
                }).on("change", updateChecklist);
            }
            $(row).attr('data-id', index).append(closeDiv).append(labelDiv).append(textDiv).append(iconDiv);
            labelPane.append(row);
        });
    } else {
        obj.checklistLabel.forEach(function(list,index){
            var row = document.createElement("div"),
                closeBtn = document.createElement("span"),
                closeDiv = document.createElement("div"),
                labelSpan = document.createElement("span"),
                labelDiv = document.createElement("div"),
                textDiv = document.createElement("div"),
                iconDiv = document.createElement("div"),
                isDate = /[dD][aA][tT][eE]/.test(list.label);
            row.className = "row";
            closeBtn.className = "remove-checklist";
            $(closeBtn).html("x").on("click",function(){
                $(this).parent().parent().remove();
                updateChecklist();
            });
            closeDiv.className = "column one padding";
            $(closeDiv).append(closeBtn);
            labelDiv.className = "column three padding";
            $(labelSpan).attr("class","label").html(list.label);
            $(labelDiv).append(labelSpan);
            textDiv.className = "column eight";
            var inputTag = document.createElement("input");
            $(inputTag).val(list.text);
            $(textDiv).append(inputTag);
            if (isDate){
                $(inputTag).attr("readonly", true).datepicker({
                    showOn: "button",
                    buttonImage: "assets/images/icons/calendar-white.png",
                    buttonImageOnly: true,
                    buttonText: "Select date"
                }).on("change", updateChecklist);
            }else{
                inputTag.placeholder = "<Type>";
                $(inputTag).on("focus keyup", function(){
                    var list = $("#checklist").find(".suggest-list").css('top',this.getBoundingClientRect().bottom).css('left',this.getBoundingClientRect().left).show().find("li"), data = $(this).val();
                    list.each(function(i,str){
                        if ($(str).html().indexOf(data.substring(data.lastIndexOf(',')+1)) < 0){
                            $(this).hide();
                        } else {
                            $(this).show();
                        }
                    });
                    activeSuggestInput = $(this);
                }).on("change", updateChecklist);
            }
            $(row).attr('data-id', index).append(closeDiv).append(labelDiv).append(textDiv).append(iconDiv);
            labelPane.append(row);
        });
    }

    $("#checklist-input").val("").attr("placeholder", foreignText);
    $("#checklist-checkbox-list").html("");
    if (obj.checklistCheckbox.length > 0){
        obj.checklistCheckbox.forEach(function(el,index){
            var row = document.createElement("div"),
                checkBox = document.createElement("input"),
                labelTag = document.createElement("label");
            $(checkBox).attr("type","checkbox").attr("data-id",index).on("click",function(){
                var id=$(this).attr("data-id"),checked = this.checked;
                if (checked){
                    tooltipObject.checklistCheckbox[id].checked = "yes";
                }else{
                    tooltipObject.checklistCheckbox[id].checked = "no";
                }
            });
            if (el.checked == "yes"){
                $(checkBox).attr("checked", true);
            }
            labelTag.innerHTML = el.label;
            row.className = "form-group width-half";
            $(row).append(checkBox).append(labelTag);
            $("#checklist-checkbox-list").append(row);
        });
    }

    $("#checklist").find(".suggest-list").html("").hide();

    var suggestWords = $("#auto-suggest").val().split(","),word;
    suggestWords.forEach(function(str){
        word = str.trim();
        if (word != ""){
            var liTag = document.createElement("li");
            $(liTag).html(word).on("click", function(){
                //var obj = $("#checklist-input");
                activeSuggestInput.val(activeSuggestInput.val().substr(0,activeSuggestInput.val().lastIndexOf(",")+1)+$(this).html());
                $("#checklist").find(".suggest-list").hide().find("li").show();
                activeSuggestInput = null;
                updateChecklist();
            });
            $("#checklist").find(".suggest-list").append(liTag);
        }
    });

}

function updateChecklist(){
    var list = $("#checklist-labels").find(".row");
    tooltipObject.checklistLabel = [];
    list.each(function(i,obj){
        var el = {label: "", text: ""};
        el.label = $(obj).find(".label").html();
        el.text = $(obj).find("input").val();
        tooltipObject.checklistLabel.push(el);
    });
}

function loadObject(index){
    var object = tooltipObject.jsonObjects[index];
    $("#object-tag").val(object.tag);
    $("#json-object").val(object.json);
    isNewObject = false;
}

function composePreviewTab(e){
    $("#document-list").html("");
    var documents = [], validFormat = true;
    if (e.jsonObjects) {
        e.jsonObjects.forEach(function (obj) {
            if (obj.tag == 'documents') {
                try {
                    documents = $.parseJSON(obj.json);
                } catch (err) {
                    validFormat = false;
                }
            }
        });
    }
    var liTag,typeImage,nameSpan;
    documents.forEach(function(doc, index){
        if (doc.hasOwnProperty('DocumentName') &&
            doc.hasOwnProperty('DocumentPreviewURLs') &&
            doc.hasOwnProperty('DocumentType') &&
            doc.hasOwnProperty('DocumentDownloadURL') &&
            validFormat){

            liTag = $("<li></li>").appendTo("#document-list");
            typeImage = $("<img>").appendTo(liTag);
            if (doc.DocumentType.toLowerCase().indexOf('doc') > -1){
                typeImage.attr("src", "assets/images/icons/word-24.png");
            } else if (doc.DocumentType.toLowerCase().indexOf('pdf') > -1){
                typeImage.attr("src", "assets/images/icons/pdf-24.png");
            } else {
                typeImage.attr("src", "assets/images/icons/file-24.png");
            }
            nameSpan = $("<span></span>",{
                text: doc.DocumentName,
                "document-id": index
            }).on("mouseover", function(){
                showPreviewBox($(this).attr("document-id"));
            }).appendTo(liTag);
        } else {
            validFormat = false;
        }
    });

    $("#current-preview-image").val(1);

    if (validFormat) {
        $("#document-message").html("");
    } else {
        $("#document-list").html("");
        $("#document-message").html("A JSON object saved as 'Documents' must define the Document values of DocumentName:DocumentPreviewURLs:DocumentType:DocumentDownloadURL")
    }
}

function showUploadDiv(){
    $('.image-tooltip').hide();
    mouseOverElement = true;
    var obj = $("#uploadDialog");
    var top = window.scrollY + 50;
    var left = window.scrollX + 50;
    obj.css({
        top: top,
        left: left
    }).show();
}

function addTextTooltip(left, top, defaultText){
    var $tooltip = $("<div></div>", {
        class: "image-tooltip second text",
        id: "text-box-" + parseInt(Math.random() * 10000000000)
    }).data({
        "lines": [],
        "width": 0,
        "height": 0
    }).on("mouseover", function(e){
        clearInterval(textCellScrollTimer);
        if (newBezierLine != null){
            newBezierLine.set("stroke", "white");
            canvas.renderAll();
        }
        $(this).addClass("expanded").attr("data-hidden", false);
        if ($(this).data("width") != ""){
            $(this).css({
                width: parseInt($(this).data("width")),
                height: parseInt($(this).data("height")),
                "min-width": 0,
                "min-height": 0
            })
        }
        if (newBezierLine != null){
            var $obj = $(this).find(".ttip");
            if (e.originalEvent.pageY < $(this).offset().top + 50){
                textCellScrollTimer = setInterval(function(){
                    $obj.stop().animate({scrollTop: $obj.scrollTop() - 20}, 500);
                }, 500);
            } else if ( e.originalEvent.pageY > $(this).offset().top + $(this).innerHeight() - 50){
                textCellScrollTimer = setInterval(function(){
                    $obj.stop().animate({scrollTop: $obj.scrollTop() + 20}, 500);
                }, 500);
            }
        }
        $(this).data("lines").forEach(function(line){
            adjustLine(line);
        });
    }).on("mouseleave", function(){
        clearInterval(textCellScrollTimer);
        if (resizeTooltip != "") return;
        if (newBezierLine != null){
            newBezierLine.set("stroke", "gray");
            canvas.renderAll();
        }
        var that = "#" + $(this).attr("id");
        $(this).attr("data-hidden", true);
        setTimeout(function() {
            if ($(that).attr("data-hidden") == "true") {
                $(that).removeClass("expanded").css({
                    width: "",
                    height: "",
                    "min-height": "",
                    "min-width": ""
                }).find(".ttip").animate({scrollTop: 0, scrollLeft: 0}, 500);
                var clk = setInterval(function(){
                    if ($(that).length > 0) {
                        $(that).data("lines").forEach(function (line) {
                            adjustLine(line);
                        });
                    }
                },100);
                setTimeout(function(){
                    //$(that).data("lines").forEach(function(line){
                    //    adjustLine(line);
                    //});
                    clearInterval(clk);
                }, 1000);
            }
        }, 10000);
    }).on("mouseup", function(e){
        if (newBezierLine != null){
            addBezierLine(newBezierLine.startElement, $(e.originalEvent.target));
            canvas.discardActiveObject();
        }
        canvas.renderAll();

    }).on("drag", function(){
        $(this).data("newPoint").set({
            left: $(this).offset().left,
            top: $(this).offset().top
        }).setCoords();
        $(this).data("lines").forEach(function(line){
            adjustLine(line);
        });
        canvas.renderAll();
    }).append($("<div></div>", {
        class: "ttip"
    }).append($("<input/>", {
        type: "text",
        class: "form-control no-margin no-padding",
        value: "Text"
    }).css("font-size", "1.2em")).append($("<h3></h3>", {
        class: "white"
    })).append($("<textarea></textarea>",{
        class: "default-textarea",
        text: defaultText==undefined?"Some Text":defaultText
    }).on("paste", function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).addClass("pasting");
        var clipboardData = (e.originalEvent || e).clipboardData.getData("text/plain");
        window.document.execCommand("insertText", false, clipboardData);
        if (clipboardData == "") {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            if (items.length > 0) {
                for (var index = 0; index < items.length; index++) {
                    var item = items[index];
                    if (item.kind === 'file') {
                        var blob = item.getAsFile();
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            var target = $("textarea.pasting").parents(".image-tooltip");
                            fabric.Image.fromURL(event.target.result, function (oImg) {
                                oImg.set({
                                    class: "image-thumbnail",
                                    left: target.offset().left,
                                    top: target.offset().top,
                                    angle: 0,
                                    hasRotatingPoint: false,
                                    cornerSize: 7,
                                    resized: false,
                                    prevScaleX: imageThumbnailSize.width / oImg.width,
                                    prevScaleY: imageThumbnailSize.width / oImg.width,
                                    scaleX: imageThumbnailSize.width / oImg.width,
                                    scaleY: imageThumbnailSize.width / oImg.width
                                });

                                canvas.add(oImg);

                                fabric.Image.fromURL("./assets/images/icons/remove-24.png", function (tImg) {
                                    var rect = new fabric.Rect({
                                        left: 0,
                                        top: 0,
                                        width: buttonSize * 0.8,
                                        height: buttonSize * 0.8,
                                        fill: buttonColor,
                                        strokeWidth: 2
                                    });
                                    // scale image down, and flip it, before adding it onto canvas
                                    tImg.set({left: 0, top: 0, angle: 0});
                                    var btn = new fabric.Group([rect, tImg], {
                                        left: oImg.left - buttonSize,
                                        top: oImg.top,
                                        id: 'close-image',
                                        class: 'button',
                                        originX: 'center',
                                        originY: 'center',
                                        scaleX: 0.8,
                                        scaleY: 0.8,
                                        selectable: false,
                                        draggable: false,
                                        hasBorders: false,
                                        hasControls: false,
                                        hasRotatingPoint: false
                                    });

                                    oImg.closeButton = btn;
                                    btn.target = oImg;
                                    canvas.add(btn);
                                    canvas.renderAll();
                                });

                                fabric.Image.fromURL("./assets/images/icons/sign-in-24.png", function (tImg) {
                                    var rect = new fabric.Rect({
                                        left: 0,
                                        top: 0,
                                        width: buttonSize,
                                        height: buttonSize,
                                        fill: buttonColor,
                                        strokeWidth: 2
                                    });
                                    // scale image down, and flip it, before adding it onto canvas
                                    tImg.set({left: 0, top: 0, angle: 0});
                                    var btn = new fabric.Group([rect, tImg], {
                                        left: oImg.left - buttonSize,
                                        top: oImg.top + 1.5 * buttonSize,
                                        id: 'convert-image',
                                        class: 'button',
                                        originX: 'center',
                                        originY: 'center',
                                        selectable: false,
                                        draggable: false,
                                        hasBorders: false,
                                        hasControls: false,
                                        hasRotatingPoint: false
                                    });

                                    oImg.convertButton = btn;
                                    btn.target = oImg;
                                    canvas.add(btn);
                                    canvas.renderAll();
                                });

                            });
                        };
                        reader.readAsDataURL(blob);
                    }
                }
                setTimeout(function(){
                    var target = $("textarea.pasting").parents(".image-tooltip");
                    removeTextCell(target);
                }, 300);
            } else {
                $("textarea.pasting").removeClass("pasting");
            }
        } else {
            var rows = clipboardData.split("\n"), elements, header = [], dataSet = [], box, eTop = top, eLeft = left + 500;
            for (var i = 0; i < rows.length; i ++) {
                elements = rows[i].trim().split("\t");
                if (elements.length < 2) {
                    rows = clipboardData.split("\r\n\r\n");
                    if (rows.length > 1) {
                        $(this).parents(".image-tooltip").removeClass("expanded").attr("data-hidden", true);
                        $("body").css("overflow", "hidden");

                        var boxes = [], line;
                        for (var j = 0; j < rows.length; j ++) {
                            if (rows[j].trim() != "") {
                                box = addSubTextTooltip(eLeft, eTop, rows[j].trim(), $(this).parents(".image-tooltip").attr("id"));
                                boxes.push(box);
                                eTop += parseInt(box.css("height")) + 20;
                            }
                        }
                        for (j = 1; j < boxes.length; j ++) {
                            line = addBezierLine(boxes[j - 1], boxes[j]);
                            line.set({
                                strokeDashArray: [1, 0]
                            })
                        }
                    }
                    $(this).val(clipboardData);
                    canvas.renderAll();
                    return;
                }
                if (i == 0) {
                    $.each(elements, function (j, elem) {
                        header.push({title: elem})
                    });
                } else if (elements != "") {
                    dataSet.push(elements);
                }
            }

            var $table = $('<table></table>');
            $(this).replaceWith($table);
            $table.DataTable({
                bAutoWidth: false,
                data: dataSet,
                columns: header,
                "columnDefs": [{"defaultContent": "-", "targets": "_all"}]
            });

            $table.find("th").css("max-width", parseInt($table.parents(".ttip").css("width")) / header.length);
        }

    }))).append($("<div></div>", {
        class: "image-tooltip-resize"
    }).on({
        mousedown: function(){
            $(this).parent().draggable("disable");
            resizeTooltip = $(this).parent().attr("id");
        }
    })).append($("<div></div>", {
        class: "text-cell-buttons"
    }).append($("<img/>", {
        src: "./assets/images/icons/remove-24.png"
    }).on("click", function(){
        showConfirmBox("Are you sure to remove this text cell?", "remove-text-cell", $(this).parents(".image-tooltip").attr("id"));
    }))).draggable().css({
        left: left,
        top: top,
        position: "absolute"
    }).delegate("td", "click", function(){
        var  i= 0, elem = this, $table = $(this).parents("table"), $ttip = $(this).parents(".ttip");
        while((elem=elem.previousSibling)!=null) ++i;
        if ($(this).hasClass("hover-td")){
            $table.find("th").css({
                "max-width": parseInt($ttip.css("width")) / $table.find("thead").find("th").length - 10,
                "min-width": parseInt($ttip.css("width")) / $table.find("thead").find("th").length - 10
            });
            $(this).css("height", "");
            $(".hover-td").removeClass("hover-td");
        } else {
            $(".hover-td").css("height", "").removeClass("hover-td");
            $(this).css("height", parseInt($ttip.css("height")) * 0.7).addClass("hover-td");

            var tmpW = parseInt($ttip.css("width")) * 0.3 / $table.find("thead").find("th").length - 10 < 0? 0 : parseInt($ttip.css("width")) * 0.3 / $table.find("thead").find("th").length - 10;
            $table.find("th").css({
                "max-width": tmpW,
                "min-width": tmpW
            });
            $($table.find("th")[i]).css({
                "max-width": parseInt($ttip.css("width")) * 0.7,
                "min-width": parseInt($ttip.css("width")) * 0.7
            });
            $ttip.stop().animate({scrollTop: $(this).position().top - 20, scrollLeft: $(this).position().left - 20}, 1000);
        }
    }).appendTo("body").show();

    var newPoint = new fabric.Circle({
        left: left,
        top: top,
        class: 'new-bezier-point',
        hoverCursor: 'pointer',
        strokeWidth: 1,
        stroke: 'white',
        radius: 3,
        originX: 'center',
        originY: 'center',
        selectable: false,
        opacity: bLineCircleOpacity,
        fill: 'transparent'
    });

    canvas.add(newPoint);
    newPoint.bringForward();
    $tooltip.data("newPoint", newPoint);
    newPoint.master = $tooltip;

    return $tooltip;
}

function addSubTextTooltip(left, top, defaultText, parent){
    var groupDivs = $(".text-cell-group"), groupBox;
    for (var i = 0; i < groupDivs.length; i ++){
        if ($(groupDivs[i]).data("group") == parent){
            groupBox = $(groupDivs[i]);
            break;
        }
    }
    if (groupBox == undefined){
        groupBox = $("<div></div>", {
            class: "text-cell-group",
            id: "text-cell-group-" + parseInt(Math.random() * 100000000)
        }).on({
            scroll: function(e){
                var offsetX = $(this).prop("scrollLeft"), offsetY = $(this).prop("scrollTop"), left, top;
                $.each($(this).find(".image-tooltip"), function(i, tooltip){
                    $.each($(tooltip).data("lines"), function(i, line){
                        if (line.control.oLeft == undefined || line.control.oTop == undefined){
                            line.control.set({
                                oLeft: line.control.left,
                                oTop: line.control.top
                            })
                        }
                        left = line.control.oLeft - offsetX;
                        top = line.control.oTop - offsetY;
                        line.control.set({
                            left: left,
                            top: top
                        });
                        line.path[1][1] = left;
                        line.path[1][2] = top;

                        adjustLine(line);
                    });
                });
                canvas.renderAll();
            },
            drag: function(e){
                //var $groupDiv;
                //if ($(e.originalEvent.target).prop("nodeName") == "IMG") {
                //    $.each($(this).find(".image-tooltip"), function (i, tooltip) {
                //        $.each($(tooltip).data("lines"), function (i, line) {
                //            $groupDiv = line.leftElement.parents(".text-cell-group");
                //            adjustLine(line);
                //            if (line.leftCircle.left < parseInt($groupDiv.css("left")) ||
                //                line.leftCircle.left > parseInt($groupDiv.css("left")) + $groupDiv.innerWidth() ||
                //                line.leftCircle.top < parseInt($groupDiv.css("top")) ||
                //                line.leftCircle.top > parseInt($groupDiv.css("top")) + $groupDiv.innerHeight() ||
                //                line.rightCircle.left < parseInt($groupDiv.css("left")) ||
                //                line.rightCircle.left > parseInt($groupDiv.css("left")) + $groupDiv.innerWidth() ||
                //                line.rightCircle.top < parseInt($groupDiv.css("top")) ||
                //                line.rightCircle.top > parseInt($groupDiv.css("top")) + $groupDiv.innerHeight() ){
                //                line.set("opacity", 0);
                //                line.leftCircle.set("opacity", 0);
                //                line.rightCircle.set("opacity", 0);
                //            } else {
                //                line.set("opacity", 1);
                //                line.leftCircle.set("opacity", 1);
                //                line.rightCircle.set("opacity", 1);
                //                line.path[1][1] = (line.path[0][1] + line.path[1][3]) / 2;
                //                line.path[1][2] = (line.path[0][2] + line.path[1][4]) / 2;
                //            }
                //        });
                //    });
                //    canvas.renderAll();
                //}
            }
        }).data({
            "group": parent
        }).append($("<div></div>", {
            class: "text-cell-buttons"
        }).append($("<img/>", {
            src: "./assets/images/icons/remove-24.png"
        }).on("click", function(){
            showConfirmBox("Are you sure to remove this text cell group?", "remove-text-cell-group", $(this).parents(".text-cell-group").attr("id"));
        }))
        //    .append($("<img/>", {
        //    src: "./assets/images/icons/move-24.png"
        //}))
        ).appendTo("body");

        if (canvas.height - top < 400){
            groupBox.css("height", canvas.height - top);
        }
    }
    var $tooltip = $("<div></div>", {
        class: "image-tooltip second text expanded",
        id: "sub-text-box-" + parseInt(Math.random() * 10000000000)
    }).data({
        lines: [],
        "group": parent,
        hidden: false
    }).on({
        drag: function(){
            $.each($(this).data("lines"), function(i, line){
                adjustLine(line);
            });
        }
    }).css({
        left: window.innerWidth / 2 - 200,
        top: top
    }).append($("<div></div>", {
        class: "ttip"
    }).append($("<textarea></textarea>",{
        class: "default-textarea",
        text: defaultText==undefined?"Some Text":defaultText
    }))).append($("<div></div>", {
        class: "text-cell-buttons inside"
    }).append($("<img/>", {
        src: "assets/images/icons/recycle-24.png",
        title: "Toggle"
    }).on({
        click: function(){
            var $parent = $(this).parents(".image-tooltip");
            if ($parent.hasClass("expanded")){
                $parent.removeClass("expanded");
                $parent.data("height", $parent.css("height"));
                $parent.css("height", "");
            } else {
                $parent.addClass("expanded");
                $parent.css("height", $parent.data("height"));
            }
            var clk = setInterval(function(){
                $parent.data("lines").forEach(function (line) {
                    adjustLine(line);
                });
            },100);
            setTimeout(function(){
                clearInterval(clk);
            }, 1000);
        }
    })).append($("<img/>", {
        src: "./assets/images/icons/remove-24.png",
        title: "Remove"
    }).on("click", function(){
        showConfirmBox("Are you sure to remove this text cell?", "remove-text-cell-in-group", $(this).parents(".image-tooltip").attr("id"));
    })).append($("<img/>", {
        src: "./assets/images/icons/caret-up-24.png",
        title: "Merge up"
    }).on({
        click: function(){
            mergeUpTextCell($(this).parents(".image-tooltip"));
        }
    })).append($("<img/>", {
        src: "./assets/images/icons/caret-down-24.png",
        title: "Merge down"
    }).on({
        click: function(){
            mergeDownTextCell($(this).parents(".image-tooltip"));
        }
    }))).appendTo(groupBox).show().draggable();

    var $textarea = $tooltip.find("textarea");
    $textarea.css("height", "5px");
    $tooltip.css("height", $textarea.prop("scrollHeight") + 22 + "px");
    $textarea.css("height", $textarea.prop("scrollHeight") + "px");

    return $tooltip;
}

function removeTextCell($cell){
    var lines, $elem, i;
    for (var j = $cell.data("lines").length; j > 0; j --){
        var line = $cell.data("lines")[j - 1];
        if (line.rightElement instanceof jQuery){
            if (line.rightElement.hasClass("image-tooltip")){
                $elem = line.rightElement;
            } else {
                $elem = line.rightElement.parents(".image-tooltip");
            }
            if ($elem.attr("id") != $cell.attr("id").substr(1)) {
                lines = $elem.data("lines");
                for (i = lines.length; i > 0; i--) {
                    if (line.id == lines[i - 1].id) {
                        lines.splice(i - 1, 1);
                    }
                }
                $elem.data("lines", lines);
            }
        } else {
            lines = line.rightElement.lines;
            for (i = lines.length; i > 0; i --){
                if (line.id == lines[i - 1].id) {
                    line.rightElement.lines.splice(i - 1, 1);
                }
            }
        }
        if (line.leftElement instanceof jQuery) {
            if (line.leftElement.hasClass("image-tooltip")){
                $elem = line.leftElement;
            } else {
                $elem = line.leftElement.parents(".image-tooltip");
            }
            if ($elem.attr("id") != $cell.attr("id").substr(1)) {
                lines = $elem.data("lines");
                for (i = lines.length; i > 0; i--) {
                    if (line.id == lines[i - 1].id) {
                        lines.splice(i - 1, 1);
                    }
                }
                $elem.data("lines", lines);
            }
        } else {
            lines = line.leftElement.lines;
            for (i = lines.length; i > 0; i --){
                if (line.id == lines[i - 1].id) {
                    line.leftElement.lines.splice(i - 1, 1);
                }
            }
        }
        canvas.remove(line.leftCircle);
        canvas.remove(line.rightCircle);
        canvas.remove(line.control);
        canvas.remove(line);
    }
    canvas.remove($cell.data("newPoint"));
    $cell.remove();
    canvas.renderAll();
}

function mergeUpTextCell($cell){
    if ($cell.data("lines").length == 1 && $cell.data("lines")[0].leftElement.attr("id") == $cell.attr("id")){
        return false;
    }
    var leftElem, rightElem;
    var lines = $cell.data("lines"), lines2, j;
    for (var i = 0; i < lines.length; i ++){
        if (lines[i].leftElement.attr("id") == $cell.attr("id")) {
            rightElem = lines[i].rightElement;
            lines2 = rightElem.data("lines");
            for (j = 0; j < lines2.length; j ++){
                if (lines2[j].id == lines[i].id) {
                    lines2.splice(j, 1);
                }
            }
            rightElem.data("lines", lines2);
        } else if (lines[i].rightElement.attr("id") == $cell.attr("id")){
            leftElem = lines[i].leftElement;
            lines2 = leftElem.data("lines");
            for (j = 0; j < lines2.length; j ++){
                if (lines2[j].id == lines[i].id) {
                    lines2.splice(j, 1);
                }
            }
            leftElem.data("lines", lines2);
        }
        canvas.remove(lines[i].leftCircle, lines[i].rightCircle, lines[i]);
    }
    leftElem.find("textarea").val(leftElem.find("textarea").val() + "\r\n\r\n" + $cell.find("textarea").val());
    leftElem.find("textarea").css("height", "5px");
    leftElem.css("height", leftElem.find("textarea").prop("scrollHeight") + 22);
    leftElem.find("textarea").css("height", leftElem.find("textarea").prop("scrollHeight"));
    $cell.remove();
    addBezierLine(leftElem, rightElem).set({
        strokeDashArray: [1]
    });
    canvas.renderAll();
}

function mergeDownTextCell($cell){
    if ($cell.data("lines").length == 1 && $cell.data("lines")[0].rightElement.attr("id") == $cell.attr("id")){
        return false;
    }
    var leftElem, rightElem;
    var lines = $cell.data("lines"), lines2, j;
    for (var i = 0; i < lines.length; i ++){
        if (lines[i].leftElement.attr("id") == $cell.attr("id")) {
            rightElem = lines[i].rightElement;
            lines2 = rightElem.data("lines");
            for (j = 0; j < lines2.length; j ++){
                if (lines2[j].id == lines[i].id) {
                    lines2.splice(j, 1);
                }
            }
            rightElem.data("lines", lines2);
        } else if (lines[i].rightElement.attr("id") == $cell.attr("id")){
            leftElem = lines[i].leftElement;
            lines2 = leftElem.data("lines");
            for (j = 0; j < lines2.length; j ++){
                if (lines2[j].id == lines[i].id) {
                    lines2.splice(j, 1);
                }
            }
            leftElem.data("lines", lines2);
        }
        canvas.remove(lines[i].leftCircle, lines[i].rightCircle, lines[i]);
    }
    rightElem.find("textarea").val($cell.find("textarea").val() + "\r\n\r\n" + rightElem.find("textarea").val());
    rightElem.find("textarea").css("height", "5px");
    rightElem.css({
        height: rightElem.find("textarea").prop("scrollHeight") + 22,
        top: $cell.css("top")
    });
    rightElem.find("textarea").css("height", rightElem.find("textarea").prop("scrollHeight"));
    $cell.remove();
    addBezierLine(leftElem, rightElem).set({
        strokeDashArray: [1]
    });
    canvas.renderAll();
}

function removeTextCellInGroup($cell){
    var leftElem, rightElem;
    var lines = $cell.data("lines"), lines2, j;
    for (var i = 0; i < lines.length; i ++){
        if (lines[i].leftElement.attr("id") == $cell.attr("id")) {
            rightElem = lines[i].rightElement;
            lines2 = rightElem.data("lines");
            for (j = 0; j < lines2.length; j ++){
                if (lines2[j].id == lines[i].id) {
                    lines2.splice(j, 1);
                }
            }
            rightElem.data("lines", lines2);
        } else if (lines[i].rightElement.attr("id") == $cell.attr("id")){
            leftElem = lines[i].leftElement;
            lines2 = leftElem.data("lines");
            for (j = 0; j < lines2.length; j ++){
                if (lines2[j].id == lines[i].id) {
                    lines2.splice(j, 1);
                }
            }
            leftElem.data("lines", lines2);
        }
        canvas.remove(lines[i].leftCircle, lines[i].rightCircle, lines[i]);
    }
    $cell.remove();
    addBezierLine(leftElem, rightElem).set({
        strokeDashArray: [1]
    });
    canvas.renderAll();
}

function removeTextCellGroup($div){
    $.each($div.find(".image-tooltip"), function(i, tooltip){
        $.each($(tooltip).data("lines"), function(i, line){
            canvas.remove(line.leftCircle, line.rightCircle, line);
        });
    });
    $div.remove();
    $("body").css("overflow", "");
    canvas.renderAll();
}

function showJsonUrlTooltip(){
    removeImageTools(true);
    mouseOverElement = true;

    $("#json-url-tooltip").show();
}