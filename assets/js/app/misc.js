function showDropFrame(left, top){
    $("#drag-drop-frame").attr("src", window.location.href + "/drop/").parent().css({
        left: left,
        top: top
    }).show();
}

function hideDropFrame(){
    $("#drag-drop-frame").attr("src", "").parent().hide();
}