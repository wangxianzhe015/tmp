/**
 * Created by Steel on 4/17/2018.
 */
var downPoint = {x: 0, y: 0};
var mouseDown = false;
var myCropper;

$(document).ready(function(){
    $("body").on({
        "mousedown": function() {
            if (myCropper) return;
            var imgTag = document.getElementById("thumbnail-image");
            myCropper = new Cropper(imgTag, {
                x: 0,
                y: 0,
                movable: false,
                zoomable: false,
                rotatable: false,
                scalable: true,
                autoCrop: true,
                ready: function() {
                    var maxD = window.innerWidth / imgTag.naturalWidth > window.innerHeight / imgTag.naturalHeight?"h":"v";
                    var myScaleX = maxD=="h"?window.innerWidth / (imgTag.naturalWidth * window.innerHeight / imgTag.naturalHeight):1;
                    var myScaleY = maxD=="h"?1:window.innerHeight / (imgTag.naturalHeight * window.innerWidth / imgTag.naturalWidth);
                    myCropper.scale(
                        myScaleX,
                        myScaleY
                    );
                    myCropper.clear();
                },
                cropend: function(){
                    var data = myCropper.getCropBoxData();
                    var blob = myCropper.getCroppedCanvas().toDataURL();
                    var $imageDiv = $("<div></div>", {
                        class: "cropped-image-div"
                    }).css({
                        left: data.left - 1,
                        top: data.top - 1
                    }).on({
                        mouseover: function(){
                            $(this).find(".image-annotation-div").addClass("active");
                        },
                        mouseout: function(){
                            $(this).find(".image-annotation-div").removeClass("active");
                        }
                    }).appendTo("body");

                    $("<img/>", {
                        class: "cropped-image",
                        src: blob
                    }).css({
                        width: data.width,
                        height: data.height
                    }).on({
                        click: imageClickHandler
                    }).appendTo($imageDiv);
                    myCropper.clear();
                }
            });
        },
        "contextmenu": function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

});

function imageClickHandler(e){
    var $container = $(e.target).parents(".cropped-image-div");
    if ($container.find(".image-annotation-div").length > 0) return false;

    var parentDiv = $("<div></div>", {
        class: "image-annotation-div"
    }).css({
        left: e.originalEvent.pageX - $container.offset().left,
        top: e.originalEvent.pageY - $container.offset().top
    }).appendTo($container);
    parentDiv.draggable();

    $("<div></div>", {
        class: "image-annotation",
        contentEditable: "true"
    }).appendTo(parentDiv);

    $("<span></span>", {
        class: "annotation-close-btn",
        text: "X"
    }).on({
        click: function() {
            $(this).parent().remove();
        }
    }).appendTo(parentDiv);
}