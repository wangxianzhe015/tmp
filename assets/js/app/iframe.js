var iframeTabs = [], currentTab = 0;
$(document).ready(function(){
    $(".tablinks").each(function(i,tab){
        iframeTabs[i] = $(tab).attr("data-target");
    });

    $("#iframe-next-btn").on("click", function(){
        var links = $(".tablinks");
        if (iframeTabs.length <= currentTab + 1){
            return false;
        }
        currentTab ++;
        if (iframeTabs.length == currentTab + 1){
            $(this).addClass("disabled");
        }
        $("#iframe-prev-btn").removeClass("disabled");
        links.removeClass("active");
        $(links[currentTab]).addClass("active");
        $(".tabcontent").hide();
        $(iframeTabs[currentTab]).show();
    });

    $("#iframe-prev-btn").on("click", function(){
        var links = $(".tablinks");
        if (currentTab == 0){
            return false;
        }
        currentTab --;
        if (currentTab == 0){
            $(this).addClass("disabled");
        }
        $("#iframe-next-btn").removeClass("disabled");
        links.removeClass("active");
        $(links[currentTab]).addClass("active");
        $(".tabcontent").hide();
        $(iframeTabs[currentTab]).show();
    });

});