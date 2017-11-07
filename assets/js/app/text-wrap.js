function boundary(object, array){
    var $object;
    $(object).each(function(index,obj){
        $object = $(obj);
        if ($object.hasClass("boundary-layout")){
            $object.find(".left-boundary").html(array[0]);
            $object.find(".top-boundary").html(array[1]);
            $object.find(".right-boundary").html(array[2]);
            $object.find(".bottom-boundary").html(array[3]);
            return true;
        }
        //var defaultWidth = "100%", defaultHeight = "100%";
        var $newObject = $("<div></div>", {
            class: "boundary-layout",
            id: "boundary-layout-" + parseInt(Math.random() * 100000000000)
        });

        var words = "Jun-07 EUGDRP" +
        "07 JETBLUE<br/>" +
        "07 JETCOST<br/>" +
        "08 OMANAIR<br/>" +
        "11 ANNOUNCEMENT<br/>" +
        "12 SCTI CLAIM<br/>" +
        "13 DEXE-PHERIN<br/>" +
        "15";
        $newObject.html("<div class='boundary boundary-layout-content'>" + words + "</div>");
        $newObject.prependTo($object);

        $("<div></div>", {
            class: "boundary left-boundary",
            text: array[0]
        }).css("width", $object.innerHeight() - 3 * parseInt($object.css("font-size")) - 20).prependTo($newObject);

        $("<div></div>", {
            class: "boundary top-boundary",
            text: array[1]
        }).prependTo($newObject);

        $("<div></div>", {
            class: "boundary right-boundary",
            text: array[2]
        }).css("width", $object.innerHeight() - 3 * parseInt($object.css("font-size")) - 20).appendTo($newObject);

        $("<div></div>", {
            class: "boundary bottom-boundary",
            text: array[3]
        }).appendTo($newObject);

    });

    return true;
}