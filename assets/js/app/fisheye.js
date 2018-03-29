function distortion(e) {
    var cx = (e.touches ? e.touches[0].clientX : e.clientX + window.scrollX),
        cy = (e.touches ? e.touches[0].clientY : e.clientY + window.scrollY),
        size = 200,
        zoom = 1;

    //fisheyeCanvas.width = size;
    //fisheyeCanvas.height = size;
    fisheyeCanvas.style.left = cx - size / 2 + 'px';
    fisheyeCanvas.style.top = cy - size / 2 + 'px';

    //f_ctx = fisheyeCanvas.getContext("2d");
    f_ctx.fillStyle = '#FFF';
    f_ctx.fillRect(0, 0, size, size);
    f_ctx.drawImage(
        bgCanvas,
        cx - bgCanvas.offsetLeft - .5 * size / zoom,
        cy - bgCanvas.offsetTop - .5 * size / zoom,
        size / zoom,
        size / zoom,
        0,
        0,
        size,
        size
    );

    var imgData = f_ctx.getImageData(0, 0, size, size);
    var pixels = imgData.data,
        pixelsCopy = [], index = 0, h = size, w = size;

    for (var i = 0; i <= pixels.length; i+=4) {
        pixelsCopy[index] = [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];
        index++;
    }

    var result = fisheye(pixelsCopy, w, h);

    for(var i = 0; i < result.length; i++) {
        index = 4*i;
        if (result[i] != undefined) {
            pixels[index + 0] = result[i][0];
            pixels[index + 1] = result[i][1];
            pixels[index + 2] = result[i][2];
            pixels[index + 3] = result[i][3];
        }
    }

    f_ctx.putImageData(imgData, 0, 0);
}

function fisheye(srcpixels, w, h) {

    var dstpixels = srcpixels.slice();

    for (var y = 0; y < h; y++) {

        var ny = ((2*y)/h)-1;
        var ny2 = ny*ny;

        for (var x = 0; x < w; x++) {

            var nx = ((2*x)/w)-1;
            var nx2 = nx*nx;
            var r = Math.sqrt(nx2+ny2);

            if (0.0 <= r && r <= 1.0) {
                var nr = Math.sqrt(1.0-r*r);
                nr = (r + (1.0-nr)) / 2.0;

                if (nr <= 1.0) {

                    var theta = Math.atan2(ny,nx);
                    var nxn = nr*Math.cos(theta);
                    var nyn = nr*Math.sin(theta);
                    var x2 = parseInt(((nxn+1)*w)/2);
                    var y2 = parseInt(((nyn+1)*h)/2);
                    var srcpos = parseInt(y2*w+x2);
                    if (srcpos >= 0 & srcpos < w*h) {
                        dstpixels[parseInt(y*w+x)] = srcpixels[srcpos];
                    }
                }
            }
        }
    }
    return dstpixels;
} 

function fisheyeHandler(){
    if ($("#bg-canvas").length == 0) {
        html2canvas(document.body, {
            onrendered: function (newCanvas) {
                $(newCanvas).attr({
                    id: "bg-canvas"
                }).css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    "z-index": 20
                });
                document.body.appendChild(newCanvas);
                bgCanvas = newCanvas;
                $("#f-c").show();
                $("#right-sidebar").show();

                window.addEventListener("mousemove", distortion);

            }
        });

    } else {
        $("#bg-canvas").remove();
        $("#f-c").hide();
        window.removeEventListener("mousemove", distortion);
        bgCanvas = null;
        $("#right-sidebar").show();
    }
}