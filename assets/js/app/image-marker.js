/**
 * Created by Steel on 4/17/2018.
 */
var downPoint = {x: 0, y: 0};
var mouseDown = false;
var myCropper;

$(document).ready(function(){
    $(window).on({
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
                    $("<img/>", {
                        class: "cropped-image",
                        src: blob
                    }).css({
                        left: data.left - 1,
                        top: data.top - 1,
                        width: data.width,
                        height: data.height
                    }).on({
                        click: imageClickHandler,
                        mouseover: function(){
                            if ($(this).data("annotation")) {
                                $(this).data("annotation").addClass("active");
                            }
                        },
                        mouseleave: function(){
                            if ($(this).data("annotation")) {
                                $(this).data("annotation").removeClass("active");
                            }
                        }
                    }).appendTo("body");
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
    if ($(e.target).data("annotation")) return false;

    var parentDiv = $("<div></div>", {
        class: "image-annotation-div"
    }).css({
        left: e.originalEvent.pageX,
        top: e.originalEvent.pageY
    }).appendTo("body");
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
            $(this).parent().data("target").data("annotation", null);
            $(this).parent().remove();
        }
    }).appendTo(parentDiv);

    parentDiv.data("target", $(e.target));
    $(e.target).data("annotation", parentDiv);
}