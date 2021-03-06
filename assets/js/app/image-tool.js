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
                                    prevScaleX: 1,
                                    prevScaleY: 1
                                    //resized: false,
                                    //prevScaleX: imageThumbnailSize.width / oImg.width,
                                    //prevScaleY: imageThumbnailSize.width / oImg.width,
                                    //scaleX: imageThumbnailSize.width / oImg.width,
                                    //scaleY: imageThumbnailSize.width / oImg.width
                                });

                                canvas.add(oImg);

                                fabric.Image.fromURL("./assets/images/icons/remove-24.png", function (tImg) {
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
                                        top: oImg.top,
                                        id: 'close-image',
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
                                        scaleX: 2 / 3,
                                        scaleY: 2 / 3,
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
            var rows = clipboardData.split("\n"), elements, header = [], dataSet = [];
            for (var i = 0; i < rows.length; i ++) {
                elements = rows[i].trim().split("\t");
                if (i == 0) {
                    $.each(elements, function (j, elem) {
                        header.push({title: elem});
                    });
                    if (elements.length < 2) {
                        $(this).val(clipboardData);
                        return;
                    }
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
        src: "./assets/images/icons/remove-24.png",
        title: "Remove cell"
    }).on("click", function(){
        showConfirmBox("Are you sure to remove this text cell?", "remove-text-cell", $(this).parents(".image-tooltip").attr("id"));
    })).append($("<img/>", {
        src: "./assets/images/icons/random-24.png",
        title: "Split text"
    }).on("click", function(){
        splitText($(this).parents(".image-tooltip"));
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
    //for (var i = 0; i < groupDivs.length; i ++){
    //    if ($(groupDivs[i]).data("group") == parent){
    //        groupBox = $(groupDivs[i]);
    //        break;
    //    }
    //}
    if (groupDivs.length > 0){
        groupBox = $(groupDivs[0]);
        if (groupBox.data("groups").indexOf(parent) < 0) {
            groupBox.data("group-count", 1 + groupBox.data("group-count"));
            groupBox.data("groups", groupBox.data("groups").concat(parent));
        }
    }

    if (groupBox == undefined){
        $("body").css("overflow", "hidden");
        groupBox = $("<div></div>", {
            class: "text-cell-group",
            id: "text-cell-group-" + parseInt(Math.random() * 100000000)
        }).on({
            scroll: function(e){
                if (lineInGroup) {
                    var $tooltips = $(this).find(".image-tooltip"), lines, line;
                    for (var i = 0; i < $tooltips.length; i++) {
                        lines = $($tooltips[i]).data("lines");
                        for (var j = 0; j < lines.length; j++) {
                            line = lines[j];
                            adjustCellLines(line);
                        }
                    }

                    canvas.renderAll();
                }
            }
        }).data({
            "group-count": 1,
            "groups": [parent],
            "step": 0
        }).append($("<div></div>", {
            class: "text-cell-buttons"
        }).append($("<img/>", {
            src: "./assets/images/icons/remove-24.png"
        }).on("click", function(){
            showConfirmBox("Are you sure to remove this text cell group?", "remove-text-cell-group", $(this).parents(".text-cell-group").attr("id"));
        })).append($("<img/>", {
            src: "./assets/images/icons/plus-40.png"
        }).on("click", function(){
            addTextTooltip(groupBox.data("group-count") * 420 + 30, 20);
        })).append($("<img/>", {
            src: "./assets/images/icons/save-40.png"
        }).on("click", function(){
            $("#save-target").val("text-cell");
            $("label[for='save-file-name']").text("Name");
            $("#save").fadeIn();
        })).append($("<img/>", {
            src: "./assets/images/icons/folder-open-40.png"
        }).on("click", function(){
            loadTextCells();
        })).append($("<img/>", {
            src: "./assets/images/icons/hide-24.png"
        }).on("click", function(){
                var $cells = $(this).parents(".text-cell-group").find(".image-tooltip");
                lineInGroup = !lineInGroup;
                $.each($cells, function(i, cell){
                    $.each($(cell).data("lines"), function(i, line){
                        adjustCellLines(line);
                        line.set({
                            opacity: lineInGroup?1:0
                        });
                    });
                });
                canvas.renderAll();
                $(this).attr("src", lineInGroup?"./assets/images/icons/hide-24.png":"./assets/images/icons/unhide-24.png");
        })).append($("<img/>", {
            src: "./assets/images/icons/balance-24.png"
        }).on("click", function(){
            handleTextCells($(this).parents(".text-cell-group"));
        }))
        ).appendTo("body");

        if (canvas.height - top < 400){
            groupBox.css("height", canvas.height - top);
        }
    }
    var $tooltip = $("<div></div>", {
        class: "image-tooltip second text expanded text-group-" + parent,
        id: "sub-text-box-" + parseInt(Math.random() * 10000000000)
    }).data({
        lines: [],
        "group": parent,
        hidden: false
    }).on({
        drag: function(){
            if (lineInGroup) {
                $.each($(this).data("lines"), function (i, line) {
                    adjustCellLines(line);
                });
                canvas.renderAll();
            }
        }
    }).css({
        left: left==0?(groupBox.data("group-count") - 1) * 420 + 30:left,
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
    })).append($("<img/>", {
        src: "./assets/images/icons/external-24.png",
        title: "Extract selection"
    }).on("click", function(){
        var parent = $(this).parents(".image-tooltip"), obj = parent.find("textarea")[0], text = $(obj).val().substr(obj.selectionStart, obj.selectionEnd - obj.selectionStart), box, groupBoxes, lines, offsetY;
        if (text != ""){
            $(obj).val($(obj).val().substr(0,obj.selectionStart - 1) + $(obj).val().substr(obj.selectionEnd));
            box = addSubTextTooltip(parent.offset().left, $(".text-cell-group").prop("scrollTop") + parent.offset().top + parent.innerHeight() + 20, text, parent.data("group"));
            parent.after(box);
            offsetY = box.innerHeight() + 20;
            lines = parent.data("lines");
            for (var i = 0; i < lines.length; i ++){
                if (lines[i].leftElement.attr("id") == parent.attr("id")){
                    lines[i].rightElement = box;
                    box.data("lines", [lines[i]]);
                    if (lineInGroup) {
                        adjustCellLines(lines[i]);
                    }
                }
            }
            lines = box.next().data("lines");
            for (i = 0; i < lines.length; i ++){
                if (lines[i].rightElement.attr("id") == box.next().attr("id").substr(1)){
                    lines.splice(i, 1);
                }
            }
            box.next().data("lines", lines);
            var newLine = addBezierLine(box, box.next());
            newLine.set({
                strokeDashArray: [1, 0],
                opacity: lineInGroup?1:0
            });
            newLine.leftCircle.set({
                opacity: 0
            });
            newLine.rightCircle.set({
                opacity: 0
            });
            groupBoxes = box.nextAll();
            for (i = 0; i < groupBoxes.length; i ++){
                if (!$(groupBoxes[i]).hasClass("group-move-div") && parent.data("group") == $(groupBoxes[i]).data("group")){
                    $(groupBoxes[i]).css({
                        top: $(".text-cell-group").prop("scrollTop") + $(groupBoxes[i]).offset().top + box.innerHeight() + 20
                    });
                    if (lineInGroup) {
                        $(groupBoxes[i]).data("lines")[0].path[0][2] += offsetY;
                        $(groupBoxes[i]).data("lines")[0].path[1][2] += offsetY;
                        $(groupBoxes[i]).data("lines")[0].path[1][4] += offsetY;
                        if ($(groupBoxes[i]).data("lines")[1]) {
                            $(groupBoxes[i]).data("lines")[1].path[0][2] += offsetY;
                            $(groupBoxes[i]).data("lines")[1].path[1][2] += offsetY;
                            $(groupBoxes[i]).data("lines")[1].path[1][4] += offsetY;
                        }
                    }
                }
            }
            canvas.renderAll();
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
    var line = addBezierLine(leftElem, rightElem);
    line.set({
        strokeDashArray: [1, 0],
        opacity: lineInGroup?1:0
    });
    line.leftCircle.set({
        opacity: 0
    });
    line.rightCircle.set({
        opacity: 0
    });
    if (lineInGroup) {
        lines = leftElem.data("lines");
        for (i = 0; i < lines.length; i++) {
            adjustCellLines(lines[i]);
        }
    }
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
    var line = addBezierLine(leftElem, rightElem);
    line.set({
        strokeDashArray: [1, 0],
        opacity: lineInGroup?1:0
    });
    line.leftCircle.set({
        opacity: 0
    });
    line.rightCircle.set({
        opacity: 0
    });
    if (lineInGroup) {
        lines = rightElem.data("lines");
        for (i = 0; i < lines.length; i++) {
            adjustCellLines(lines[i]);
        }
    }
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
    if (leftElem && rightElem) {
        addBezierLine(leftElem, rightElem).set({
            strokeDashArray: [1, 0],
            opacity: 1
        });
    }
    canvas.renderAll();
}

function removeTextCellGroup($div){
    $.each($div.find(".image-tooltip"), function(i, tooltip){
        if ($(tooltip).attr("id").indexOf("sub-text") > -1 ) {
            $.each($(tooltip).data("lines"), function (i, line) {
                canvas.remove(line.leftCircle, line.rightCircle, line);
            });
        } else {
            $(tooltip).appendTo("body");
        }
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

function splitText($el){
    var splitter = getOS()=="Windows"?"\n\n":"\r\n\r\n";
    var text = $el.find("textarea").val(), rows = text.split(splitter), elements = rows[0].trim().split("\t"), box, eTop = 100;

    if (elements.length < 2) {
        if (rows.length > 1) {
            $("body").css({
                overflow: "hidden"
            });
            window.scrollTo(0, 0);

            var boxes = [], line;
            for (var j = 0; j < rows.length; j ++) {
                if (rows[j].trim() != "") {
                    box = addSubTextTooltip(0, eTop, rows[j].trim(), $el.attr("id"));
                    boxes.push(box);
                    eTop += parseInt(box.css("height")) + 20;
                }
            }
            for (j = 1; j < boxes.length; j ++) {
                line = addBezierLine(boxes[j - 1], boxes[j]);
                line.set({
                    strokeDashArray: [1, 0]
                });
                line.leftCircle.set({
                    opacity: 0
                });
                line.rightCircle.set({
                    opacity: 0
                });
            }

            var $container = $(".text-cell-group");

            $("<div></div>", {
                class: "group-move-div"
            }).data({
                group: $el.attr("id")
            }).css({
                left: boxes[0].css("left"),
                top: parseInt(boxes[0].css("top")) - 35,
                cursor: "pointer"
            }).draggable({
                start: function(e, ui){
                    var $cells = $(".text-group-" + $(this).data("group"));
                    
                    $.each($cells, function(i, cell){
                        $.each($(cell).data("lines"), function(i, line){
                            line.set({
                                opacity: 0
                            });
                        });
                        $(cell).data({
                            left: parseInt($(cell).css("left")),
                            top: parseInt($(cell).css("top"))
                        })
                    });
                    canvas.renderAll();
                },
                drag: function(e, ui){
                    var $cells = $(".text-group-" + $(this).data("group"));

                    $.each($cells, function(i, cell){
                        $(cell).css({
                            left: $(cell).data("left") - ui.originalPosition.left + ui.position.left,
                            top: $(cell).data("top") - ui.originalPosition.top + ui.position.top
                        });
                    });
                },
                end: function(e, ui){
                    if (lineInGroup) {
                        var $cells = $(".text-group-" + $(this).data("group"));

                        $.each($cells, function (i, cell) {
                            $.each($(cell).data("lines"), function (i, line) {
                                adjustCellLines(line);
                            });
                        });
                        canvas.renderAll();
                    }
                }
            }).append($("<img/>", {
                src: "assets/images/icons/move-24.png"
            })).appendTo($container);

            $el.removeClass("expanded").attr("data-hidden", true).css({
                left: ($container.data("group-count") - 1) * 420 + 30,
                top: 20
            }).data("newPoint").set({
                left: ($container.data("group-count") - 1) * 420 + 30,
                top: 20
            }).setCoords();

            $container.append($el);

            canvas.renderAll();
        }
    }
}

function saveTextCells(name){
    var data = [], $container = $(".text-cell-group"), $cells = $container.find(".image-tooltip"), $cell;

    for (var i = 0; i < $cells.length; i ++){
        $cell = $($cells[i]);
        data.push({
            id: $cell.attr("id"),
            left: $cell.offset().left + $container.prop("scrollLeft"),
            top: $cell.offset().top + $container.prop("scrollTop"),
            text: $cell.find("textarea").val(),
            group: $cell.data("group"),
            status: $cell.hasClass("expanded")?1:0
        });
    }

    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "save-text-cell",
            "elements": JSON.stringify(data),
            "fileName": name
        },
        success: function(res){
            $("#save").fadeOut();
            alert('Success', res);
        },
        complete: function(){
            hideSpinner()
        }
    });

}

function loadTextCells(){
    showSpinner();
    $("#load-target").val("text-cell");
    $("label[for='load-file-name']").text("Choose Name");
    $(".load-extra-option").hide();

    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-text-cell-names"
        },
        success: function(res){
            var names = $.parseJSON(res);
            $("#load-file-name").html('');
            names.forEach(function(name){
                if (name != '.' && name != '..' && name != '.gitignore') {
                    var option = document.createElement('option');
                    $(option).attr('value', name.split('.json')[0]).html(name.split('.json')[0]);
                    $("#load-file-name").append(option);
                }
            });
            $("#load").fadeIn();
        },
        complete: function(){
            hideSpinner();
        }
    });

}

function loadTextCell(name){
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            "action": "load-text-cell",
            "fileName": name
        },
        success: function(res) {
            var cells = $.parseJSON(res), c, i, $tooltip, result = [], line;

            for (i = 0; i < cells.length; i ++){
                c = cells[i];
                if (c.id.indexOf("sub-text-") > -1){
                    $tooltip = addSubTextTooltip(c.left, c.top, c.text, c.group);
                    $tooltip.attr("id", c.id);
                } else {
                    $tooltip = addTextTooltip(c.left, c.top, c.text);
                    $(".text-cell-group").append($tooltip);
                    $tooltip.attr("id", c.id);
                }
                if (c.status == 1){
                    $tooltip.addClass("expanded");
                } else {
                    $tooltip.removeClass("expanded");
                }
                result.push($tooltip);
            }
            for (i = 0; i < result.length - 1; i ++){
                if (result[i].attr("id").indexOf("sub-text-") > -1 && result[i + 1].attr("id").indexOf("sub-text-") > -1){
                    line = addBezierLine(result[i], result[i + 1]);
                    line.set({
                        strokeDashArray: [1, 0],
                        opacity: 1
                    });
                    line.leftCircle.set({
                        opacity: 0
                    });
                    line.rightCircle.set({
                        opacity: 0
                    });
                }
            }
            $("#load").fadeOut();
        },
        complete: function(){
            hideSpinner();
        }
    })
}

function handleTextCells($obj) {
    if ($obj.data("group-count") < 2){
        alert("Alert", "You must add at least two groups");
        return;
    }
    var groupKeys = $obj.data("groups");
    var i, j, k, l, $cells1, $cells2;
    switch ($obj.data("step")){
        case 0:
            for (i = 0; i < groupKeys.length - 1; i ++) {
                $cells1 = $(".text-group-" + groupKeys[i]);
                for (j = i + 1; j < groupKeys.length; j ++) {
                    $cells2 = $(".text-group-" + groupKeys[j]);
                    for (k = 0; k < $cells1.length; k ++){
                        for (l = 0; l < $cells2.length; l ++){
                            if ($($cells1[k]).find("textarea").val().trim() == $($cells2[l]).find("textarea").val().trim()){
                                $($cells1[k]).addClass("same").data("same", $($cells2[l]).attr("id"));
                                $($cells2[l]).addClass("same").data("same", $($cells1[k]).attr("id"));
                            }
                        }
                    }
                }
            }
            $obj.data("step", 1);
            break;
        case 1:
            var sentences = [];
            var cells = $obj.find(".image-tooltip[id*='sub-text-']:not(.same)");
            for (i = 0; i < cells.length; i ++) {
                sentences = sentences.concat($(cells[i]).find("textarea").val().trim().split("."));
            }
            console.log(sentences.join("\r\n"));
            $obj.data("step", 2);
            break;
        case 2:
            $obj.find(".same").removeClass("expanded");
            $obj.data("step", 3);
            break;
        case 3:
            $obj.find(".image-tooltip[id*='sub-text-']").addClass("expanded");
            $obj.find(".same").removeClass("same");
            $obj.data("step", 0);
            break;
    }
}

function adjustCellLines(line){
    var left1 = line.leftElement.offset().left + line.leftElement.outerWidth() / 2;
    var top1 = line.leftElement.offset().top + line.leftElement.innerHeight();
    var left2 = line.rightElement.offset().left + line.rightElement.outerWidth() / 2;
    var top2 = line.rightElement.offset().top;
    line.path[0][1] = left1;
    line.path[0][2] = top1;
    line.path[1][1] = (left1 + left2) / 2;
    line.path[1][2] = (top1 + top2) / 2;
    line.path[1][3] = left2;
    line.path[1][4] = top2;

    if ((line.path[0][1] > 0 && line.path[0][1] < window.innerWidth &&
        line.path[0][2] > 0 && line.path[0][2] < window.innerHeight) ||
        (line.path[1][3] > 0 && line.path[1][3] < window.innerWidth &&
        line.path[1][4] > 0 && line.path[1][4] < window.innerHeight)) {
        line.set({
            opacity: 1
        });
    } else {
        line.set({
            opacity: 0
        });
    }
    canvas.renderAll();
}