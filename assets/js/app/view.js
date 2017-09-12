function saveView(){
    var viewNameInput = $("#view-name"),viewName = viewNameInput.val(),view={name:viewName,data:[]};
    viewNameInput.val("");
    canvas.forEachObject(function(obj){
        if (obj.class != "grid" && !obj.isTemporary){
            view.data.push({
                id: obj.id,
                left: obj.left,
                top: obj.top
            });
        }
    });
    views.push(view);
    currentView = views.length - 1;
    mouseOverElement = false;
    removeImageTools();
    showTagTooltip(searchButton);
    //alert("Success", "View Saved Successfully");
}

function loadView(index){
    var elements = [], view = views[index].data;
    canvas.forEachObject(function(object){
        if (object.class == 'group' || object.class == 'element' || (object.class == 'button' && !object.isTemporary)){
            elements.push(object);
        }
    });
    var element;
    while(element = elements.pop()){
        view.forEach(function(obj){
            if (element.id == obj.id){
                element.animate({
                    top: obj.top,
                    left: obj.left
                },{
                    duration: 1000,
                    onChange: canvas.renderAll.bind(canvas),
                    easing: fabric.util.ease.easeInOutQuad
                });
            }
        });
    }
    canvas.renderAll();

}

function updateTagSelect(){
    var tagList = $("#tags-list").val().split(","), tagSelect = $("#tags");
    tagSelect.multipleSelect('destroy').html("");
    tagList.forEach(function(tag){
        if (tag != '') {
            tagSelect.append("<option value='" + tag + "'>" + tag + "</option>");
        }
    });
    tagSelect.multipleSelect();
}