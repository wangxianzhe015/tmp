var enableHide = true;

function boundary(object, array){
    var $object = $(object),isMultiple = false,classPrefix="",height;
    if ($object.find(".boundary-layout").length > 0){
        $object = $(object).find(".boundary-layout");
        isMultiple = true;
    } else {
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
            $(".active-party").html($(this).val());
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
            $(".active-party").data("date", $(this).val());
        }).datepicker()).append($("<select></select>", {
            id: "tagger-message-select",
            class: "form-control width-half"
        }).on("change", function(){
            $(".active-party").data("importance", $(this).val());
        }))).append($("<h3></h3>", {
            class: "white"
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
    $object.each(function(index,obj){
        $object = $(obj);
        //if ($object.hasClass("boundary-layout")){
        //    $object.find(".left-boundary").html(array[0]);
        //    $object.find(".top-boundary").html(array[1]);
        //    $object.find(".right-boundary").html(array[2]);
        //    $object.find(".bottom-boundary").html(array[3]);
        //    return true;
        //}

        var $newObject = $("<div></div>", {
            class: "boundary-layout",
            id: "boundary-layout-" + parseInt(Math.random() * 100000000000)
        });

        if (isMultiple){
            $newObject.addClass("boundary boundary-layout-content");
            classPrefix = "inner-";
        }

        var words = "<span>Jun-07 EUGDRP</span><br/>" +
        "<span>07 JETBLUE</span><br/>" +
        "<span>07 JETCOST</span><br/>" +
        "<span>08 OMANAIR</span><br/>" +
        "<span>11 ANNOUNCEMENT</span><br/>" +
        "<span>12 SCTI CLAIM</span><br/>" +
        "<span>13 DEXE-PHERIN</span><br/>" +
        "<span>15</span>";
        $newObject.html("<div class='boundary " + classPrefix+ "boundary-layout-content'>" + words + "</div>").find("span").each(function(i,el){
            $(el).on({
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
            }).attr("id", "word-" + parseInt(Math.random() * 100000));
        });
        if (isMultiple){
            $object.find(".boundary-layout-content").replaceWith($newObject);
            height = $newObject.innerHeight() - 3 * parseInt($object.css("font-size"));
        } else {
            $newObject.prependTo($object);
            height = $object.innerHeight() - 3 * parseInt($object.css("font-size")) - 20;
        }

        $("<div></div>", {
            class: "boundary " + classPrefix+ "left-boundary",
            html: makeTooltipText(array[0])
        }).css("width", height).prependTo($newObject);

        $("<div></div>", {
            class: "boundary " + classPrefix+ "top-boundary",
            html: makeTooltipText(array[1])
        }).prependTo($newObject);

        $("<div></div>", {
            class: "boundary " + classPrefix+ "right-boundary",
            html: makeTooltipText(array[2])
        }).css("width", height).appendTo($newObject);

        $("<div></div>", {
            class: "boundary " + classPrefix+ "bottom-boundary",
            html: makeTooltipText(array[3])
        }).appendTo($newObject);

    });

    return true;
}

function makeTooltipText(text){
    var arr = text.split(" "), result = [], length = text.length;
    arr.forEach(function(word){
        if (word != ""){
            result.push($("<div></div>", {
                class: "tagger-word",
                text: word,
                id: "word-" + parseInt(Math.random() * 100000)
            }).css({
                width: parseInt(word.length / length * 100) + "%",
                "min-width": word.length * 0.5 + "em"
            }).data({
                date: "",
                importance: ""
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
    if ($obj.data("importance") == ""){
        //$tooltipObj.find("#tagger-message-select").
    } else {
        $tooltipObj.find("#tagger-message-select").val($obj.data("importance"));
    }
    $tooltipObj.find("#tagger-message-select").val($obj.data("importance"));
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