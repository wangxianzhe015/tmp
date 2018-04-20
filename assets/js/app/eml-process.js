function loadEml() {
    showSpinner();
    $.ajax({
        url: "action.php",
        type: "POST",
        data: {
            action: "load-eml"
        },
        success: function(res) {
            var emls = $.parseJSON(res), id, $iframe, iframes = [];
            $.each(emls, function(i, eml) {
                id = "eml-data-iframe-" + parseInt(Math.random() * 1000000000);
                $iframe = $("<iframe></iframe>", {
                    class: "eml-data-iframe",
                    id: id
                }).appendTo("body");

                var doc = $iframe[0].contentWindow.document;
                doc.open();
                doc.write(eml['content']);
                doc.close();

                iframes.push(id);
            });

            for (var i = iframes.length - 1; i > -1; i --) {
                html2canvas(document.getElementById(iframes[i]).contentWindow.document.body, {
                    onrendered: function (newCanvas) {
                        $(newCanvas).appendTo($("<div></div>", {
                            class: "eml-canvas-container"
                        }).css({

                        }).draggable().resizable().appendTo("body"));
                        $("#" + iframes[iframes.length - 1]).remove();
                        iframes.pop();
                    }
                })
            }
        },
        complete: hideSpinner
    });
}