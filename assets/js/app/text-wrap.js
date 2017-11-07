function boundary(object, array){
    var $object = $(object),isMultiple = false,classPrefix="",height;
    if ($object.find(".boundary-layout").length > 0){
        $object = $(object).find(".boundary-layout");
        isMultiple = true;
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

        var words = "Jun-07 EUGDRP" +
        "07 JETBLUE<br/>" +
        "07 JETCOST<br/>" +
        "08 OMANAIR<br/>" +
        "11 ANNOUNCEMENT<br/>" +
        "12 SCTI CLAIM<br/>" +
        "13 DEXE-PHERIN<br/>" +
        "15";
        $newObject.html("<div class='boundary " + classPrefix+ "boundary-layout-content'>" + words + "</div>");
        if (isMultiple){
            $object.find(".boundary-layout-content").replaceWith($newObject);
            height = $newObject.innerHeight() - 3 * parseInt($object.css("font-size"));
        } else {
            $newObject.prependTo($object);
            height = $object.innerHeight() - 3 * parseInt($object.css("font-size")) - 20;
        }

        $("<div></div>", {
            class: "boundary " + classPrefix+ "left-boundary",
            text: array[0]
        }).css("width", height).prependTo($newObject);

        $("<div></div>", {
            class: "boundary " + classPrefix+ "top-boundary",
            text: array[1]
        }).prependTo($newObject);

        $("<div></div>", {
            class: "boundary " + classPrefix+ "right-boundary",
            text: array[2]
        }).css("width", height).appendTo($newObject);

        $("<div></div>", {
            class: "boundary " + classPrefix+ "bottom-boundary",
            text: array[3]
        }).appendTo($newObject);

    });

    return true;
}