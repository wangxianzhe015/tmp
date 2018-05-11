var enableHide = true;

function boundary(object){
    var $object = $(object), $obj, $section, $newObject, isMultiple = false,classPrefix="",height, array, wordsExist = true, words, tmp;

    $.ajax({
        url: "../action.php",
        type: "post",
        data: {
            "action": "get-wrapper-words"
        },
        success: function(res){
            var sections;
            if (res == "fail" || res == ""){
                wordsExist = false;
                sections = [];
            } else {
                sections = $.parseJSON(res);
            }

            for (var i = 0; i < $object.length; i ++) {
                if (sections.length < i){
                    wordsExist = false;
                }
                if ($($object[i]).find(".boundary-layout").length > 0) {
                    $section = $($object[i]).find(".boundary-layout");
                    isMultiple = true;
                    if (wordsExist) {
                        array = sections[i]["outer"];
                    } else {
                        array = {
                            "left": "SUPREME COURT:::<_?_>WITNESS PREP:::<_?_>BARRISTER:::<_?_>FORENSIC:::<_?_>GIA EXAM:::",
                            "top": "ALI:::<_?_>ROWLING:::<_?_>DYLAN GORDON:::<_?_>YURY SHAR:::",
                            "right": "STUART:::<_?_>IAN MOORE:::<_?_>VALERI:::<_?_>TAMMY:::<_?_>IRINA:::<_?_>JASON:::<_?_>IP ASSIGNME:::",
                            "bottom": "44 Bay St:::<_?_>EIN Delaware:::<_?_>LLC UK Ltd:::<_?_>ASIC 404:::"
                        };
                    }
                } else {
                    $section = $($object[i]);
                    if (wordsExist) {
                        array = sections[i]["inner"];
                    } else {
                        array = {
                            "left": "Reuters:::<_?_>Bloomberg:::<_?_>Yummmy Car:::<_?_>Medellin:::<_?_>Freelancer:::<_?_>Bing:::<_?_>HR Policy:::<_?_>Delegates Sheet:::<_?_>Sophin:::<_?_>TFN:::<_?_>APEC:::",
                            "top": "SAP:::<_?_>ADOBE:::<_?_>IBM:::<_?_>REED:::<_?_>MICROSOFT:::<_?_>GOOGLE:::<_?_>ORACLE:::<_?_>ATLASSIAN:::<_?_>SALESFORCE:::<_?_>DROPBOX:::<_?_>31:::",
                            "right": "Kayak Trip Advisor:::<_?_>Amoma:::<_?_>Yandex:::<_?_>Bing:::<_?_>Google:::<_?_>Intertrust:::<_?_>VISA:::<_?_>James Stavrou:::<_?_>Jason Vieges:::<_?_>T & C Love:::",
                            "bottom": "..cn:::<_?_>.de:::<_?_>.ru:::<_?_>.com:::<_?_>.ko:::<_?_>.co.r:::<_?_>.uk:::<_?_>redvat.com:::<_?_>detectasum magnify:::"
                        };
                    }
                    handleTooltips();
                }

                $newObject = $("<div></div>", {
                    class: "boundary-layout",
                    id: "boundary-layout-" + parseInt(Math.random() * 100000000000)
                });

                if (isMultiple) {
                    $newObject.addClass("boundary boundary-layout-content");
                    classPrefix = "inner-";
                }

                if (wordsExist) {
                    words = sections[i]["body"];
                } else {
                    words = "Jun-07 EUGDRP:::<_?_>07 JETBLUE:::<_?_>07 JETCOST:::<_?_>08 OMANAIR:::<_?_>11 ANNOUNCEMENT:::<_?_>12 SCTI CLAIM:::<_?_>13 DEXE-PHERIN:::<_?_>15:::";
                }
                var $bodyDiv = $("<div></div>", {
                    class: "boundary " + classPrefix + "boundary-layout-content"
                }).appendTo($newObject);

                words.split("<_?_>").forEach(function (word) {
                    tmp = word.split(":");
                    $("<p></p>", {
                        "class": "wrapper-body-word " + "word-" + parseInt(Math.random() * 100000),
                        text: tmp[0]
                    }).data({
                        date: tmp[1],
                        importance: tmp[2],
                        description: tmp[3]
                    }).on({
                        mouseover: function (e) {
                            enableHide = false;
                            $(".active-party").removeClass("active-party");
                            $(this).addClass("active-party");
                            showTooltip($(this), e.originalEvent);
                        },
                        mouseleave: function () {
                            enableHide = true;
                            setTimeout(hideTooltip, 500);
                        }
                    }).appendTo($bodyDiv);
                });

                $("<div></div>", {
                    class: "boundary " + classPrefix + "left-boundary",
                    html: makeTooltipText(array["left"])
                }).prependTo($newObject);

                $("<div></div>", {
                    class: "boundary " + classPrefix + "top-boundary",
                    html: makeTooltipText(array["top"])
                }).prependTo($newObject);

                $("<div></div>", {
                    class: "boundary " + classPrefix + "right-boundary",
                    html: makeTooltipText(array["right"])
                }).appendTo($newObject);

                $("<div></div>", {
                    class: "boundary " + classPrefix + "bottom-boundary",
                    html: makeTooltipText(array["bottom"])
                }).appendTo($newObject);

                if (isMultiple) {
                    $section.find(".boundary-layout-content").replaceWith($newObject.clone(true, true));
                    height = $section.find(".boundary-layout-content").innerHeight() - 3 * parseInt($section.css("font-size")) - 20;
                    $section.find("." + classPrefix + "left-boundary").css("width", height);
                    $section.find("." + classPrefix + "right-boundary").css("width", height);
                } else {
                    $section.prepend($newObject.clone(true, true));
                    height = $section.innerHeight() - 3 * parseInt($section.css("font-size")) - 20;
                    $section.find("." + classPrefix + "left-boundary").css("width", height);
                    $section.find("." + classPrefix + "right-boundary").css("width", height);
                }
            }
        }
    });

}

function makeTooltipText(text){
    var arr = text.split("<_?_>"), result = [], length = text.length, wordData;
    arr.forEach(function(word){
        if (word != ""){
            wordData = word.split(":");
            result.push($("<div></div>", {
                class: "tagger-word " + "word-" + parseInt(Math.random() * 100000),
                text: wordData[0]
            }).css({
                width: parseInt(word.length / length * 100) + "%",
                "min-width": word.length * 0.4 + "em"
            }).data({
                date: wordData[1],
                importance: wordData[2],
                description: wordData[3]
            }).on({
                mouseover: function(e){
                    enableHide = false;
                    $(".active-party").removeClass("active-party");
                    $(this).addClass("active-party");
                    showTooltip($(this), e.originalEvent);
                },
                mouseleave: function(){
                    enableHide = true;
                    setTimeout(hideTooltip, 500);
                }
            }));
        }
    });
    return result
}

function showTooltip($obj, event){
    if (!tooltipStatus) return;
    $("#message-tooltip").hide();
    var $tooltipObj = $("#image-tooltip"), left = event.clientX, top = event.clientY;
    if (left + $tooltipObj.innerWidth() > window.innerWidth){
        left = event.clientX - $tooltipObj.innerWidth();
    }
    if (top + $tooltipObj.innerHeight() > window.innerHeight){
        top = window.innerHeight - $tooltipObj.innerHeight();
    }
    $tooltipObj.find("#event-date").val($obj.data("date"));
    $tooltipObj.find("#tagger-message-select").val($obj.data("importance"));
    $tooltipObj.find("#tooltip-description").val($obj.data("description"));
    $tooltipObj.css({
        left: left,
        top: top
    }).show().find("#tooltip-text").val($obj.text());
}

function hideTooltip(){
    if (enableHide){
        $(".tagger-tooltip").hide();
        $(".ui-datepicker").hide();
    }
}

function showMessageTooltip(){
    var $obj = $("#image-tooltip"), left = $obj.offset().left + $obj.innerWidth() + 5, top = $obj.offset().top, $tooltip = $("#message-tooltip");
    if (left + $tooltip.innerWidth() > window.innerWidth){
        left = $obj.offset().left - $tooltip.innerWidth() - 5;
    }
    $tooltip.css({
        left: left,
        top: top
    }).show();
}

function updateWrapperWords(){
    var $objects = $(".boundary-layout:not(.boundary)"), $obj, $elems, $el, result = [], words = {}, outerWords = {left: "", top: "", right: "", bottom: ""}, innerWords = {left: "", top: "", right: "", bottom: ""}, bodyWords = "", tmp;
    for (var i = 0; i < $objects.length; i ++){
        $obj = $($objects[i]);
        $elems = $obj.find(".left-boundary").find(".tagger-word");
        for (var j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            outerWords.left += tmp;
        }
        $elems = $obj.find(".top-boundary").find(".tagger-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            outerWords.top += tmp;
        }
        $elems = $obj.find(".right-boundary").find(".tagger-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            outerWords.right += tmp;
        }
        $elems = $obj.find(".bottom-boundary").find(".tagger-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            outerWords.bottom += tmp;
        }

        $elems = $obj.find(".inner-left-boundary").find(".tagger-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            innerWords.left += tmp;
        }
        $elems = $obj.find(".inner-top-boundary").find(".tagger-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            innerWords.top += tmp;
        }
        $elems = $obj.find(".inner-right-boundary").find(".tagger-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            innerWords.right += tmp;
        }
        $elems = $obj.find(".inner-bottom-boundary").find(".tagger-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            innerWords.bottom += tmp;
        }

        $elems = $obj.find(".wrapper-body-word");
        for (j = 0; j < $elems.length; j ++){
            $el = $($elems[j]);
            tmp = $el.text() + ":" + $el.data("date") + ":" + $el.data("importance") + ":" + $el.data("description") + "<_?_>";
            bodyWords += tmp;
        }

        words.inner = innerWords;
        words.outer = outerWords;
        words.body = bodyWords;

        result.push(words);
        words = {};
        outerWords = {left: "", top: "", right: "", bottom: ""};
        innerWords = {left: "", top: "", right: "", bottom: ""};
        bodyWords = "";
    }

    $.ajax({
        url: "../action.php",
        type: "post",
        data: {
            action: "set-wrapper-words",
            data: JSON.stringify(result)
        },
        success: function(r){console.log(r)}
    });
}

function handleTooltips(){
    $("body").append($("<div></div>", {
        class: "tagger-tooltip",
        id: "image-tooltip"
    }).append($("<div></div>", {
        class: "ttip"
    }).append($("<div></div>", {
        class: "tooltip-button-panel"
    }).append($("<img/>", {
        src: "../assets/images/icons/user-24.png"
    }).on("click", function(){
        showMessageTooltip();
    })).append($("<img/>", {
        src: "../assets/images/icons/plus-24.png"
    }).on({
        click: showNewWordDialog
    }))).append($("<input/>", {
        id: "tooltip-text",
        class: "form-control no-margin no-padding"
    }).on("keyup", function(){
        var $obj = $("." + $(".active-party")[0].className.split(" ")[1]);
        $obj.html($(this).val());
        updateWrapperWords();
    })).append($("<h3></h3>", {
        class: "white"
    })).append($("<div></div>", {
        class: "form-group"
    }).append($("<input/>", {
        type: "text",
        id: "event-date",
        class: "form-control width-half",
        placeholder: "Event Date"
    }).on("change", function(){
        var $obj = $("." + $(".active-party")[0].className.split(" ")[1]);
        $obj.data("date", $(this).val());
        updateWrapperWords();
    }).datepicker()).append($("<select></select>", {
        id: "tagger-message-select",
        class: "form-control width-half"
    }).on("change", function(){
        var $obj = $("." + $(".active-party")[0].className.split(" ")[1]);
        $obj.data("importance", $(this).val());
        updateWrapperWords();
    }))).append($("<h3></h3>", {
        class: "white"
    })).append($("<textarea></textarea>", {
        id: "tooltip-description",
        class: "form-control no-margin",
        placeholder: "<Type...>"
    }).on("keyup", function(){
        var $obj = $("." + $(".active-party")[0].className.split(" ")[1]);
        $obj.data("description", $(this).val());
        updateWrapperWords();
    }))).on({
        mouseover: function(){
            enableHide = false;
        },
        mouseleave: function(){
            enableHide = true;
            setTimeout(hideTooltip, 500);
        }
    }));

    $("#message-tooltip").on({
        mouseover: function(){
            enableHide = false;
        },
        mouseleave: function(){
            enableHide = true;
            setTimeout(hideTooltip, 500);
        }
    });

    $(".tab-menu>li>a").on("click", function(event){
        event.preventDefault();
        $(this).parent().parent().parent().find(".tab-menu>li").removeClass("active");
        $(this).parent().addClass("active");
        $(this).parent().parent().parent().find(".tab-pane").removeClass("active");
        $($(this).attr("data-tab")).addClass("active");
    });

    $("#message-date").datepicker();
    $("#message-cc-select").multipleSelect({
        placeholder: "Bcc"
    });

    /* file upload */
    var obj = $('#message-fileupload');
    obj.fileupload({
        url: 'files/',
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
    $(".upload-plus").on("click", function(){
        $(this).parent().find("input[type='file']").click();
    });

    $(".upload-cancel").on("click", function(){
        $(this).parent().find(".cancel").click();
    });

    $(".upload-start").on("click", function(){
        $(this).parent().find(".start").click();
    });

    /* end file upload */

    // temporary data for select tag
    var tempdata = ["Highest", "High", "Normal", "Low", "Lowest"];
    $("#tagger-message-select").append("<option value='' disabled selected>Importance</option>")
    $.each(tempdata, function(i, w){
        $("<option></option>", {
            value: w,
            text: w
        }).appendTo("#tagger-message-select");
    });

    // To stop hiding tooltip when moving on datepicker calendar
    $(".ui-datepicker").on("mouseover", function(){
        enableHide = false;
    });
}

function showNewWordDialog(){
    $("#new-word-dialog").fadeIn();
}

function alert(msg){
    var box = $("#alert");
    box.find(".alert-content").html(msg);
    box.show();
    setTimeout(function(){
        $("#alert").hide();
        action = "";
    }, 3000);
}