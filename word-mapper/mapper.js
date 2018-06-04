var mouseDown = false;
var $targetWord = null;
var gridStep = 25;

$(document).ready(function(){
    $(".box").resizable({
        handles: "all"
    });
    $("#box-1").css({
        width: window.innerWidth,
        height: window.innerHeight,
        left: 0,
        top: 0
    });
    $("#box-2").css({
        width: window.innerWidth - 80,
        height: window.innerHeight - 80,
        left: 40,
        top: 40
    });
    $("#box-3").css({
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
        left: window.innerWidth / 4,
        top: window.innerHeight / 4
    });
    $("#box-4").css({
        width: window.innerWidth / 2 - 100,
        height: window.innerHeight / 2 - 100,
        left: window.innerWidth / 4 + 50,
        top: window.innerHeight / 4 + 50
    });

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
            addWord(e.pageX, e.pageY);
        },
        mouseup: function(e){
            mouseDown = false;
            $targetWord = null;
        },
        mousemove: function(e){
            if (mouseDown && $targetWord instanceof jQuery){
                $targetWord.css({
                    left: parseInt(e.pageX / gridStep) * gridStep,
                    top: parseInt(e.pageY / gridStep) * gridStep
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

    $("#add-word-btn").on("click", function(){
        addTitle();
        $(this).remove();
    });

    $("#load-file-name").on("change", function(){
        $(this).hide();
        load($(this).val());
    });

    $("#load-btn").on("click", loadNames);

    setInterval(save, 30000);
});

function save(){
    var $titleDiv = $("#page-title");
    if ($titleDiv.length == 0) return;
    var box1 = $("#box1"), box2 = $("#box2"), box3 = $("#box3"), box4 = $("#box4");
    var data = {
        title: $titleDiv.text(),
        box1: {
            left: box1.css("left"),
            top: box1.css("top"),
            width: box1.innerWidth(),
            height: box1.innerHeight()
        },
        box2: {
            left: box2.css("left"),
            top: box2.css("top"),
            width: box2.innerWidth(),
            height: box2.innerHeight()
        },
        box3: {
            left: box3.css("left"),
            top: box3.css("top"),
            width: box3.innerWidth(),
            height: box3.innerHeight()
        },
        box4: {
            left: box4.css("left"),
            top: box4.css("top"),
            width: box4.innerWidth(),
            height: box4.innerHeight()
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
            data: JSON.stringify(data),
            name: $titleDiv.text()
        },
        success: function(res){

        }
    });
}

function load(name){
    $.ajax({
        url: "../action.php",
        type: "POST",
        data: {
            action: "load-word-mapper",
            name: name
        },
        success: function(res){
            if (res == "" || res == "fail") return;
            var objects = $.parseJSON(res);
            $("#page-title").remove();
            $("#add-word-btn").remove();
            $(".word").remove();
            $("#box1").css({
                left: objects.box1.left,
                top: objects.box1.top,
                width: objects.box1.width,
                height: objects.box1.height
            });
            $("#box2").css({
                left: objects.box2.left,
                top: objects.box2.top,
                width: objects.box2.width,
                height: objects.box2.height
            });
            $("#box3").css({
                left: objects.box3.left,
                top: objects.box3.top,
                width: objects.box3.width,
                height: objects.box3.height
            });
            $("#box4").css({
                left: objects.box4.left,
                top: objects.box4.top,
                width: objects.box4.width,
                height: objects.box4.height
            });
            $.each(objects.words, function(i, word){
                addWord(word.left, word.top, word.text);
            });
            addTitle(objects.title).blur();
        }
    });
}

function loadNames(){
    $.ajax({
        url: "../action.php",
        type: "POST",
        data: {
            action: "load-mapper-names"
        },
        success: function(res){
            var names = $.parseJSON(res);
            $("#load-file-name").html("<option>-- Select Name --</option>").show();
            names.forEach(function(name){
                if (name != '.' && name != '..' && name != '.gitignore') {
                    var option = document.createElement('option');
                    $(option).attr('value', name.split('.json')[0]).html(name.split('.json')[0]);
                    $("#load-file-name").append(option);
                }
            });
        }
    });
}

function addWord(left, top, text){
    $("<div></div>", {
        class: "word",
        contentEditable: true,
        text: text==undefined?"word":text
    }).css({
        left: parseInt(left / gridStep) * gridStep,
        top: parseInt(top / gridStep) * gridStep
    }).on({
        mousedown: function(e){
            $targetWord = $(this);
            mouseDown = true;
        },
        keydown: function(e){
            if (e.originalEvent.keyCode == 13){
                $(this).blur();
            }
            if (window.getSelection().toString() == $(this).text()) {
                $(this).text("").focus();
            }
        },
        dblclick: function(e){
            e.stopPropagation();
            e.preventDefault();
            var range = document.createRange();
            range.selectNodeContents(this);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }).appendTo("body").focus();
}

function addTitle(title){
    return $("<div></div>", {
        id: "page-title",
        contentEditable: true,
        text: title==undefined?"Title":title
    }).on({
        keydown: function(e){
            if (e.originalEvent.keyCode == 13){
                $(this).blur();
            }
        },
        dblclick: function(e){
            e.stopPropagation();
        }
    }).appendTo("body").focus();
}