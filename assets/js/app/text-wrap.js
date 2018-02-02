var enableHide = true;

function boundary(object){
    var $object = $(object), $obj,isMultiple = false,classPrefix="",height, array, cookieExist = true, words, tmp;
    if (getCookie("wrapper-words") == ""){
        cookieExist = false;
    }
    if ($object.find(".boundary-layout").length > 0){
        $object = $(object).find(".boundary-layout");
        isMultiple = true;
        if (cookieExist){
            array = $.parseJSON(getCookie("wrapper-words"))["outer"];
        } else {
            array = {"left": "SUPREME COURT:::,WITNESS PREP:::,BARRISTER:::,FORENSIC:::,GIA EXAM:::", "top": "ALI:::,ROWLING:::,DYLAN GORDON:::,YURY SHAR:::", "right": "STUART:::,IAN MOORE:::,VALERI:::,TAMMY:::,IRINA:::,JASON:::,IP ASSIGNME:::", "bottom": "44 Bay St:::,EIN Delaware:::,LLC UK Ltd:::,ASIC 404:::"};
        }
    } else {
        if (cookieExist){
            array = $.parseJSON(getCookie("wrapper-words"))["inner"];
        } else {
            array = {"left": "Reuters:::,Bloomberg:::,Yummmy Car:::,Medellin:::,Freelancer:::,Bing:::,HR Policy:::,Delegates Sheet:::,Sophin:::,TFN:::,APEC:::", "top": "SAP:::,ADOBE:::,IBM:::,REED:::,MICROSOFT:::,GOOGLE:::,ORACLE:::,ATLASSIAN:::,SALESFORCE:::,DROPBOX:::,31:::","right": "Kayak Trip Advisor:::,Amoma:::,Yandex:::,Bing:::,Google:::,Intertrust:::,VISA:::,James Stavrou:::,Jason Vieges:::,T & C Love:::", "bottom": "..cn:::,.de:::,.ru:::,.com:::,.ko:::,.co.r:::,.uk:::,redvat.com:::,detectasum magnify:::"};
        }
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
        }))).append($("<input/>", {
            id: "tooltip-text",
            class: "form-control no-margin no-padding"
        }).on("keyup", function(){
            var $obj = $("." + $(".active-party")[0].className.split(" ")[1]);
            $obj.html($(this).val());
            updateCookieWords();
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
            updateCookieWords();
        }).datepicker()).append($("<select></select>", {
            id: "tagger-message-select",
            class: "form-control width-half"
        }).on("change", function(){
            var $obj = $("." + $(".active-party")[0].className.split(" ")[1]);
            $obj.data("importance", $(this).val());
            updateCookieWords();
        }))).append($("<h3></h3>", {
            class: "white"
        })).append($("<textarea></textarea>", {
            id: "tooltip-description",
            class: "form-control no-margin",
            placeholder: "<Type...>"
        }).on("keyup", function(){
            var $obj = $("." + $(".active-party")[0].className.split(" ")[1]);
            $obj.data("description", $(this).val());
            updateCookieWords();
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

    var $newObject = $("<div></div>", {
        class: "boundary-layout",
        id: "boundary-layout-" + parseInt(Math.random() * 100000000000)
    });

    if (isMultiple){
        $newObject.addClass("boundary boundary-layout-content");
        classPrefix = "inner-";
    }

    if (cookieExist){
        words = $.parseJSON(getCookie("wrapper-words"))["body"];
    } else {
        words = "Jun-07 EUGDRP:::,07 JETBLUE:::,07 JETCOST:::,08 OMANAIR:::,11 ANNOUNCEMENT:::,12 SCTI CLAIM:::,13 DEXE-PHERIN:::,15:::";
    }
    var $bodyDiv = $("<div></div>", {
        class: "boundary " + classPrefix+ "boundary-layout-content"
    }).appendTo($newObject);
    words.split(",").forEach(function(word){
        tmp = word.split(":");
        $("<p></p>", {
            "class": "wrapper-body-word " + "word-" + parseInt(Math.random() * 100000),
            text: tmp[0]
        }).data({
            date: tmp[1],
            importance: tmp[2],
            description: tmp[3]
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
        }).appendTo($bodyDiv);
    });

    $("<div></div>", {
        class: "boundary " + classPrefix+ "left-boundary",
        html: makeTooltipText(array["left"])
    }).prependTo($newObject);

    $("<div></div>", {
        class: "boundary " + classPrefix+ "top-boundary",
        html: makeTooltipText(array["top"])
    }).prependTo($newObject);

    $("<div></div>", {
        class: "boundary " + classPrefix+ "right-boundary",
        html: makeTooltipText(array["right"])
    }).appendTo($newObject);

    $("<div></div>", {
        class: "boundary " + classPrefix+ "bottom-boundary",
        html: makeTooltipText(array["bottom"])
    }).appendTo($newObject);

    $object.each(function(index,obj){
        $obj = $(obj);
        if (isMultiple){
            $obj.find(".boundary-layout-content").replaceWith($newObject.clone(true, true));
            height = $obj.find(".boundary-layout-content").innerHeight() - 3 * parseInt($obj.css("font-size")) - 20;
            $obj.find("." + classPrefix+ "left-boundary").css("width", height);
            $obj.find("." + classPrefix+ "right-boundary").css("width", height);
        } else {
            $obj.prepend($newObject.clone(true, true));
            height = $obj.innerHeight() - 3 * parseInt($obj.css("font-size")) - 20;
            $obj.find("." + classPrefix+ "left-boundary").css("width", height);
            $obj.find("." + classPrefix+ "right-boundary").css("width", height);
        }

    });

    return true;
}

function makeTooltipText(text){
    var arr = text.split(","), result = [], length = text.length, wordData;
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

function updateCookieWords(){
    var $obj = $($(".boundary-layout")[0]), words = {}, outerWords = {left: "", top: "", right: "", bottom: ""}, innerWords = {left: "", top: "", right: "", bottom: ""}, bodyWords = "", tmp;
    $obj.find(".left-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        outerWords.left += tmp;
    });
    $obj.find(".top-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        outerWords.top += tmp;
    });
    $obj.find(".right-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        outerWords.right += tmp;
    });
    $obj.find(".bottom-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        outerWords.bottom += tmp;
    });


    $obj.find(".inner-left-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        innerWords.left += tmp;
    });
    $obj.find(".inner-top-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        innerWords.top += tmp;
    });
    $obj.find(".inner-right-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        innerWords.right += tmp;
    });
    $obj.find(".inner-bottom-boundary").find(".tagger-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        innerWords.bottom += tmp;
    });

    $obj.find(".wrapper-body-word").each(function(i, el){
        tmp = $(el).text() + ":" + $(el).data("date") + ":" + $(el).data("importance") + ":" + $(el).data("description") + ",";
        bodyWords += tmp;
    });

    words.inner = innerWords;
    words.outer = outerWords;
    words.body = bodyWords;

    setCookie("wrapper-words", JSON.stringify(words));
}