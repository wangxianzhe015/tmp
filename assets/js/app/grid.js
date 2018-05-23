function addOneGridRow(){
    var canvasHeight = canvas.getHeight();
    gridCanvas.setHeight(canvasHeight + Math.sqrt(3) * radius / 2);
    canvas.setHeight(canvasHeight + Math.sqrt(3) * radius / 2);
    canvas.renderAll();
    drawGrid();
    window.scrollTo(window.scrollX, window.scrollY + Math.sqrt(3) * radius / 2);
}

function addOneGridColumn(){
    var canvasWidth = canvas.getWidth();
    canvas.setWidth(canvasWidth + radius);
    canvas.renderAll();
    gridCanvas.setWidth(canvasWidth + radius);
    drawGrid();
    window.scrollTo(window.scrollX + radius, window.scrollY);
}

var getGridByID = function(id){
    var res = 0;
    grid.forEach(function(obj,index){
        if (obj.id == id){
            res = index;
        }
    });
    return res;
};

function drawGrid() {

    grid=[];

    var root3 = Math.sqrt(3);
    var countX = Math.floor(2 * (canvas.width - 2 * radius) / (3 * radius)) + 1;
    var countY = Math.floor(canvas.height / (root3 * radius));
    var hexagon = regularPolygonPoints(6,radius-border / 2);

    var oneGrid,myPoly,effect,offsetX,offsetY;
    myPoly = new fabric.Polygon(hexagon, {
        stroke: borderColor,
        left: 0,
        top: 0,
        fill: gridColor,
        strokeWidth: border
    }, false);

    effect = new fabric.Line([effectDepth / root3, root3 * radius / 2, (radius + effectDepth) / 2, border - 2],
        {
            stroke: '#333',
            strokeWidth: effectDepth,
            selectable: false
        }, false);


    for (var x = 0; x < countX; x++) {
        gridX = x;
        offsetX = (3 * x / 2) * radius + radius;
        for (var y = 0; y < countY; y++) {
            gridY = y;
            if (x % 2 == 0){
                offsetY = root3 * (y + 1 / 2) * radius;
            } else {
                offsetY = root3 * (y + 1) * radius;
            }

            //if (offsetX + radius <= canvas.width && offsetY + root3 * radius / 2 <= canvas.height) {

                oneGrid = new fabric.Group([myPoly,effect],{
                    id: x + "-" + y,
                    class: 'grid',
                    left: offsetX,
                    top: offsetY,
                    //left: parseInt(offsetX),
                    //top: parseInt(offsetY),
                    originX: 'center',
                    originY: 'center',
                    lockMovementX: true,
                    lockMovementY: true,
                    visible: false,
                    hoverCursor: "default",
                    selectable: false,
                    draggable: false,
                    hasBorders: false,
                    hasControls: false,
                    hasRotatingPoint: false
                });
                canvas.add(oneGrid);
                grid.push(oneGrid);

                //effect = new fabric.Line([ offsetX + 2 * radius - 2 * border / Math.sqrt(3), offsetY + Math.sqrt(3) * radius / 2 , offsetX + 3 * radius / 2 - border / Math.sqrt(3), offsetY + Math.sqrt(3) * radius - border],
                //    {   id: x + "-" + y,
                //        stroke: '#111',
                //        strokeWidth: border/3,
                //        selectable: false
                //    },false );
                //canvas.add(effect);
                //effect = new fabric.Line([ offsetX + radius / 2 + border / Math.sqrt(3), offsetY + Math.sqrt(3) * radius - border , offsetX + 3 * radius / 2 - border / Math.sqrt(3), offsetY + Math.sqrt(3) * radius - border],
                //    {   id: x + "-" + y,
                //        stroke: '#222',
                //        strokeWidth: border/3,
                //        selectable: false
                //    },false );
                //canvas.add(effect);
            //}
        }
    }
    //grid.forEach(function(el){
    //    canvas.add(el);
    //});
    canvas.renderAll();
}

function showGrid(){
    grid.forEach(function(obj){
        obj.set({
            visible: true
        });
    });
    canvas.renderAll();
}

function hideGrid(){
    grid.forEach(function(obj){
        obj.set({
            visible: false
        });
    });
    canvas.renderAll();
}