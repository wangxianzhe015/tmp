function clusterElements(key){
    if (positionBeforeClustering == null && key != 'temp') {
        positionBeforeClustering = [];
        canvas.forEachObject(function (obj) {
            if (obj.class == 'element') {
                positionBeforeClustering[obj.id] = {
                    x: obj.left,
                    y: obj.top
                };
            }
        });
    }

    var x = 0, y = 0, formationInfo = formations[clusters[key].length - 2],offsetToMove = [];
    var firstPos = decideFirstPosition(formationInfo, key);
    x = firstPos.x;
    y = firstPos.y;
    //var firstPos = decideFirstPos(formationInfo, key);

    clusters[key].forEach(function(el,index){
        if (index == 0){
            //x = elementsInfo[el].x;
            //y = elementsInfo[el].y;
            //x = 3 * firstPos.x * radius / 2 + radius;
            //y = Math.sqrt(3) * (firstPos.y + 1) * radius / 2;
            offsetToMove[el] = {x: firstPos.x,y: firstPos.y};
        }else {
            offsetToMove[el] = {
                x: x + formationInfo[index - 1].x * 3 * radius / 2,
                y: y + formationInfo[index - 1].y * Math.round(Math.sqrt(3) * radius / 2)
            };
        }
    });

    if (firstPos.maxY > window.innerHeight + window.scrollY || firstPos.maxX > window.innerWidth + window.scrollX) {
        $('body').stop().animate({
            scrollTop: firstPos.maxY - window.innerHeight + radius,
            scrollLeft: firstPos.maxX - window.innerWidth + radius
        }, 2000, 'swing');
    }

    canvas.forEachObject(function(obj){
        if (obj.class == 'element' && obj.cluster == key){
            if (key != 'temp') {
                obj.animate({
                    opacity: 1,
                    top: offsetToMove[obj.id].y,
                    left: offsetToMove[obj.id].x
                }, {
                    duration: 2000,
                    onChange: canvas.renderAll.bind(canvas),
                    easing: fabric.util.ease.easeOutCirc
                });
                obj.newPoint.animate({
                    top: offsetToMove[obj.id].y - Math.sqrt(3) * (radius - border / 2) / 2,
                    left: offsetToMove[obj.id].x
                }, {
                    duration: 2000,
                    onChange: canvas.renderAll.bind(canvas),
                    easing: fabric.util.ease.easeOutCirc
                });
            } else {
                obj.set({
                    top: offsetToMove[obj.id].y,
                    left: offsetToMove[obj.id].x,
                    cluster: ''
                }).setCoords();
                obj.newPoint.set({
                    top: offsetToMove[obj.id].y - Math.sqrt(3) * (radius - border / 2) / 2,
                    left: offsetToMove[obj.id].x
                }).setCoords();
            }
        }
    });
    delete clusters.temp;
    canvas.renderAll();

    if ($("#back-button").length == 0 && key != 'temp') {
        addBackButton();
    }
}

function unClusterElements(){
    $("#back-button").remove();
    canvas.forEachObject(function(obj){
        if (obj.class == 'element' && positionBeforeClustering.hasOwnProperty(obj.id)){
            obj.animate({
                opacity: 1,
                top: positionBeforeClustering[obj.id].y,
                left: positionBeforeClustering[obj.id].x
            }, {
                duration: 2000,
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease.easeOutCirc
            });
        }
    });

    positionBeforeClustering = null;
    canvas.renderAll();
}

function decideFirstPosition(formationInfo, key){
    var tempRect = new fabric.Rect({
        width: 2 * radius - border,
        height: 2 * radius - border,
        left: 50,
        top: 50,
        originX: 'center',
        originY: 'center',
        opacity: 1
    });

    canvas.add(tempRect);

    var check = false, maxX = 0, maxY = 0;
    for (var regionX = 0; regionX < 2; regionX ++){
        for (var regionY = 0; regionY < 2; regionY ++){
            for (var y = window.scrollY + regionY*window.innerHeight + radius; y < window.scrollY + (regionY + 1) * window.innerHeight - radius; y += radius){
                for (var x = window.scrollX + regionX*window.innerWidth + radius; x < (regionX + 1) * window.innerWidth + window.scrollX - radius; x += radius){
                    formationInfo.forEach(function(obj){
                        if (x + 3 * obj.x * radius / 2 >= radius
                            && x + 3 * obj.x * radius / 2 < canvas.width - radius
                            && y + Math.sqrt(3) * obj.y * radius / 2 >= radius
                            && y + Math.sqrt(3) * obj.y * radius / 2 < canvas.height - radius)
                        {
                            if (maxX < obj.x){
                                maxX = obj.x;
                            }
                            if (maxY < obj.y){
                                maxY = obj.y;
                            }
                            tempRect.set({
                                left: x + 3 * obj.x * radius / 2,
                                top: y + Math.sqrt(3) * obj.y * radius / 2
                            }).setCoords();
                            canvas.forEachObject(function(shape){
                                if (shape.class == 'element' && shape.cluster != 'key' && tempRect.intersectsWithObject(shape)){
                                    check = true;
                                }
                            });
                        } else {
                            check = true;
                        }
                    });
                    if (!check) {
                        canvas.remove(tempRect).renderAll();
                        return {x: x, y: y, maxX: x + 3 * maxX * radius / 2, maxY: y + Math.sqrt(3) * maxY * radius / 2};
                    }
                    check = false;
                }
            }
        }
    }

    canvas.remove(tempRect).renderAll();
    // If we couldn't find proper position, center of canvas will be default position
    return {x: window.innerWidth, y: window.innerHeight, maxX: window.innerWidth + 3 * maxX * radius / 2, maxY: window.innerHeight + Math.sqrt(3) * maxY * radius / 2};

}

function decideFirstPos(formationInfo, key){
    var x, y;
    for (x = 0; x < gridX + 1; x ++){
        for (y = 0; y < gridY + 1; y ++){
            elementsMap[x][y] = 'x';
        }
    }

    canvas.forEachObject(function(obj){
        if (obj.class == 'element' && obj.cluster != key){
            elementsMap[Math.round((obj.left - radius) / (3 * radius / 2))][Math.round((obj.top - Math.sqrt(3) * radius / 2) / (Math.sqrt(3) * radius / 2))] = obj.id;
        }
    });

    var check = false;
    var startX = Math.floor(2 * window.scrollX / (3 * radius)),
        endX = Math.floor(2 * (window.innerWidth + window.scrollX) / (3 * radius)),
        startY = Math.floor(window.scrollY / (Math.sqrt(3) * radius)),
        endY = Math.floor((window.scrollY + window.innerHeight) / (Math.sqrt(3) * radius));
    for (y = startY; y < endY; y ++){
        for (x = startX; x < endX; x ++){
            formationInfo.forEach(function(obj){
                if (x + obj.x > -1 && x + obj.x < gridX + 1 && 2 * y + obj.y + x % 2 > -1 && 2 * y + obj.y + x % 2  < gridY + 1){
                    if (elementsMap[x + obj.x][2 * y + obj.y + x % 2 ] != 'x'){
                        check = true;
                    }
                } else {
                    check = true;
                }
            });
            if (elementsMap[x][2 * y + x % 2] != 'x'){
                check = true;
            }
            if (!check)
                return {x: x, y: 2 * y + x % 2};
            check = false;
        }
    }

    return {x: x, y: 2 * y + x % 2};
}

function loadFormations(){
    if (formations.length == 0){
        $.ajax({
            url: 'action.php',
            type: 'POST',
            data: {
                'action': 'load-formations'
            },
            success: function(res){
                if (res != 'fail'){
                    formations = $.parseJSON(res);
                }
            }
        });
    }
}

function saveFormations(){
    $.ajax({
        url: 'action.php',
        type: 'POST',
        data: {
            action: 'save-formations',
            data: JSON.stringify(formations)
        },
        success: function(res){
            if (res != 'fail'){
                alert('Success', res);
            }
        }
    })
}