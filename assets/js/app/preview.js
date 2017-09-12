function showPreviewBox(index){
    var documents = [], doc, box = $("#preview-box"), container = $("#preview-images-container"), imageDialog = $("#imageDialog");
    tooltipObject.jsonObjects.forEach(function(obj){
        if (obj.tag == 'documents'){
            documents = $.parseJSON(obj.json);
        }
    });
    doc = documents[index];
    container.html("");
    var imageURLs = doc.DocumentPreviewURLs.split(',');
    imageURLs.forEach(function(imgURL, i){
        $("<img>", {
            src: imgURL,
            class: 'preview-image',
            order: i
        }).css('display', 'none').appendTo(container);
    });
    if (imageURLs.length > 1) {
        $("#total-preview-images").html(imageURLs.length);
        $("#pagination").show();
    }
    $("#save-document-image").attr('data-url',doc.DocumentDownloadURL).attr('data-title',doc.DocumentName);
    container.find("img:first-child").show();

    var top = parseInt(imageDialog.css("top")) + 30,
        left = parseInt(imageDialog.css("left")) + parseInt(imageDialog.css("width")) + 20,
        right = left + parseInt(box.css('width'));
    if (right > canvas.getWidth()){
        left = parseInt(imageDialog.css("left")) - parseInt(box.css("width")) - 20;
        window.scrollTo(left - 100, window.scrollY);
    } else {
        window.scrollTo(parseInt(imageDialog.css("left")) - 100, window.scrollY);
    }

    box.css({
        top: top,
        left: left
    }).show();

    $("#current-preview-image").val(1);
}