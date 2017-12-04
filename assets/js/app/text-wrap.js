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
        }).on("mouseover", function(){
            enableHide = false;
        }));
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
                    showTooltip($(this), e.originalEvent);
                },
                mouseleave: function(){
                    enableHide = true;
                    setTimeout(hideTooltip, 500);
                }
            });
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
                text: word
            }).css({
                width: parseInt(word.length / length * 100) + "%",
                "min-width": word.length * 0.5 + "em"
            }).on({
                mouseover: function(e){
                    enableHide = false;
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
    var $tooltipObj = $("#image-tooltip"), left = event.clientX, top = event.clientY;
    if (left + $tooltipObj.innerWidth() > window.innerWidth){
        left = event.clientX - $tooltipObj.innerWidth();
    }
    if (top + $tooltipObj.innerHeight() > window.innerHeight){
        top = window.innerHeight - $tooltipObj.innerHeight();
    }
    $tooltipObj.html($obj.text()).css({
        left: left,
        top: top
    }).show();
}

function hideTooltip(){
    if (enableHide){
        $("#image-tooltip").hide();
    }
}