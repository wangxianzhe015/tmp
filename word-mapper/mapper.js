var mouseDown = false;
var $targetWord = null;

$(document).ready(function(){
    $("#outer-box").css({
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
        left: window.innerWidth / 4,
        top: window.innerHeight / 4
    }).resizable();
    $("#inner-box").css({
        width: window.innerWidth / 3,
        height: window.innerHeight / 3,
        left: window.innerWidth / 12,
        top: window.innerHeight / 12
    }).resizable();

    $(window).on({
        dragover: function(e){
            e = e || event;
            e.preventDefault();
        },
        drop: function(e){
            e = e || event;
            e.preventDefault();
        },
        dblclick: function(e){
            if (window.getSelection().toString() == "") {
                addWord(e.pageX, e.pageY);
            }
        },
        mouseup: function(){
            mouseDown = false;
        },
        mousemove: function(e){
            if (mouseDown && $targetWord instanceof jQuery){
                $targetWord.css({
                    left: parseInt(e.pageX / 50) * 50,
                    top: parseInt(e.pageY / 50) * 50
                }).blur();
            }
        }
    });

    $(document).contextmenu({
        delegate: "body",
        //delegate: ".upper-canvas",
        menu: [
        ],
        beforeOpen: function (event, ui) {
            //return false;
        }
    });

    setInterval(save, 30000);
});

function save(){
    var outerBox = $("#outer-box"), innerBox = $("#inner-box"), words = [];
    var data = {
        outerBox: {
            left: outerBox.offset().left,
            top: outerBox.offset().top,
            width: outerBox.innerWidth(),
            height: outerBox.innerHeight()
        },
        innerBox: {
            left: innerBox.offset().left,
            top: innerBox.offset().top,
            width: innerBox.innerWidth(),
            height: innerBox.innerHeight()
        },
        words: []
    };

    $.each($(".word"), function(i, w){
        data.words.push({
            left: $(w).offset().left,
            top: $(w).offset().top,
            text: $(w).text()
        })
    });

    $.ajax({
        url: "../action.php",
        type: "POST",
        data: {
            action: "save-word-mapper",
            data: JSON.stringify(data)
        },
        success: function(res){

        }
    });
}

function addWord(left, top){
    $("<div></div>", {
        class: "word",
        contentEditable: true,
        text: "word"
    }).css({
        left: parseInt(left / 50) * 50,
        top: parseInt(top / 50) * 50
    }).on({
        mousedown: function(e){
            $targetWord = $(this);
            mouseDown = true;
        },
        mouseup: function(){
            //$targetWord = null;
        }
    }).appendTo("body").focus();
}