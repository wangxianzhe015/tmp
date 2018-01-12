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
    var top = window.scrollY + window.innerHeight - parseInt(dialog.css("height")) - 20;
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
    var top = window.scrollY + window.innerHeight - parseInt(dialog.css("height")) - 20;
    var left = window.scrollX + 50;
    dialog.css({
        top: top > 0 ? top : 0,
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
    $('.image-tooltip').hide();
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
    var top = window.scrollY + window.innerHeight - parseInt(obj.css("height")) - 20;
    var left = window.scrollX + 50;
    obj.css({
        top: top > 0 ? top : 0,
        left: left
    }).show();
}


function addTextTooltip(left, top){
    $("<div></div>", {
        class: "image-tooltip second text"
    }).on("mouseover", function(){
        $(this).addClass("expanded");
    }).on("mouseleave", function(){
        $(this).removeClass("expanded");
    }).append($("<div></div>", {
        class: "ttip"
    }).append($("<input/>", {
        type: "text",
        class: "form-control no-margin no-padding",
        value: "Text"
    })).append($("<h3></h3>", {
        class: "white"
    })).append($("<textarea></textarea>",{
        class: "default-textarea",
        text: "Some Text"
    }).on("paste", function(e){
        var clipboardData = (e.originalEvent || e).clipboardData.getData("text/plain");
        window.document.execCommand("insertText", false, clipboardData);
        if (clipboardData == "") return false;
        var rows = clipboardData.split("\n"), elements, header = [], dataSet = [];
        $.each(rows, function(i, row){
            elements = row.split("\t");
            if (i == 0) {
                $.each(elements, function (j, elem) {
                    header.push({title: elem})
                });
            } else if (elements != "") {
                dataSet.push(elements);
            }
        });

        var $table = $('<table></table>');
        $(this).replaceWith($table);
        $table.DataTable( {
            data: dataSet,
            columns: header
        });

    }))).draggable().css({
        left: left,
        top: top,
        position: "absolute"
    }).appendTo("body");
}