var mouseDown = false;
var $targetWord = null;
var gridStep = 25;

$(document).ready(function(){
    $("#outer-box").css({
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
        left: window.innerWidth / 4,
        top: window.innerHeight / 4
    }).resizable({
        handles: "all"
    });
    $("#inner-box").css({
        width: window.innerWidth / 3,
        height: window.innerHeight / 3,
        left: window.innerWidth / 12,
        top: window.innerHeight / 12
    }).resizable({
        handles: "all"
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
            if ($targetWord == null) {
                addWord(e.pageX, e.pageY);
            }
        },
        mouseup: function(e){
            mouseDown = false;
            if (!($(e.originalEvent.target).hasClass("word") || $(e.originalEvent.target).hasClass("page-title"))){
                $targetWord = null;
            }
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
    var outerBox = $("#outer-box"), innerBox = $("#inner-box");
    var data = {
        title: $titleDiv.text(),
        outerBox: {
            left: outerBox.css("left"),
            top: outerBox.css("top"),
            width: outerBox.innerWidth(),
            height: outerBox.innerHeight()
        },
        innerBox: {
            left: innerBox.css("left"),
            top: innerBox.css("top"),
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
            $("#outer-box").css({
                left: objects.outerBox.left,
                top: objects.outerBox.top,
                width: objects.outerBox.width,
                height: objects.outerBox.height
            });
            $("#inner-box").css({
                left: objects.innerBox.left,
                top: objects.innerBox.top,
                width: objects.innerBox.width,
                height: objects.innerBox.height
            });
            $.each(objects.words, function(i, word){
                addWord(word.left, word.top, word.text);
            });
            addTitle(objects.title);
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
        }
    }).appendTo("body").focus();
}

function addTitle(title){
    $("<div></div>", {
        id: "page-title",
        contentEditable: true,
        text: title==undefined?"Title":title
    }).on({
        keydown: function(e){
            if (e.originalEvent.keyCode == 13){
                $(this).blur();
            }
        }
    }).appendTo("body").focus();
}