function boundary(object, array){
    var $object = $(object);
    if ($object.hasClass("boundary-layout")){
    	$object.find(".left-boundary").html(array[0]);
    	$object.find(".top-boundary").html(array[1]);
    	$object.find(".right-boundary").html(array[2]);
    	$object.find(".bottom-boundary").html(array[3]);
        return true;
    }
    var defaultWidth = 200, defaultHeight = 300;
    var $newObject = $("<div></div>", {
        class: "boundary-layout",
        id: object.substring(0,1)=="#"?object.substring(1,object.length):"boundary-layout-" + parseInt(Math.random() * 100000000000)
    });
    $newObject.addClass($object.attr("class"));
    /*
    if ($object.find(".inner-content").length == 0) {
        $object.html($("<p></p>", {
            class: "inner-content",
            html: $object.html()
        }));
    }
    */

    $newObject.html("<div class='boundary boundary-layout-content'>" + $object.html() + "</div>");
    $object.replaceWith($newObject);

    var $leftDiv = $("<div></div>", {
        class: "boundary left-boundary",
        text: array[0]
    }).css("width", defaultHeight).prependTo($newObject);

    var $topDiv = $("<div></div>", {
        class: "boundary top-boundary",
        text: array[1]
    }).prependTo($newObject);

    var $rightDiv = $("<div></div>", {
        class: "boundary right-boundary",
        text: array[2]
    }).css("width", defaultHeight).appendTo($newObject);

    var $bottomDiv = $("<div></div>", {
        class: "boundary bottom-boundary",
        text: array[3]
    }).appendTo($newObject);

    // var width = array[1].length > array[3].length ? array[1].length * 7 : array[3].length * 7;
    // var height = array[0].length > array[2].length ? array[0].length * 6 : array[2].length * 6;
    $newObject.css({
        width: defaultWidth,
        height: defaultHeight
    });
    if ($object.hasClass("boundary")){
        $newObject.parent().css({
            width: defaultWidth + 60
        });
    }

    return true;
}