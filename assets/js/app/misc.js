function showDropFrame(){
    $("#drag-drop-frame").attr("src", window.location.href + "/drop/").parent().data("status", "shown").show();
}

function hideDropFrame(){
    $("#drag-drop-frame").attr("src", "").parent().data("status", "hidden").hide();
}