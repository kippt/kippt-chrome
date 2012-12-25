$(function() {

    var openPopup = function(a, title, url) {
        data = {
            title: title,
            url: url,
            source: "chrome_extension_quora"
        };
        KipptOpenPopup(data);
    };

    var inject = function() {
        var rowList = $('.feed_item');
        if (rowList.length === 0){ //If not home page
            var a = $('<span class="bullet"> . </span><a href="#">save to kippt</a>');
            a.on('click', function() {
                // Get URL and title
                var url = document.URL;
                var raw_title = document.title;
                if (raw_title[0] === '('){
                //Quora's title displays title as (2) here 2 is no of unread notification, we should
                //get rid off it.
                   var title = raw_title.split('(')[1];
                }else{
                    var title = raw_title;
                }

                openPopup(a, title, url);
            });

            // New link at the end
            $('.item_action_bar').append(a);
        } else {
        rowList.each(function(no, div) {
           var aList = $('a', div);
            if (aList.length <= 1)
                return;

            var a = $('<span class="bullet"> . </span><a href="#">save to kippt</a>');
            a.on('click', function() {
                // Get URL and title
                var url = "https://quora.com" + $('.question_link', div).attr('href');
                var title = $('.question_link', div)[0].innerText;

                openPopup(a, title, url);
            });

            // New link at the end
            $('.item_action_bar', div).append(a);
            });
        }
    };

    // Check opt-out status
    chrome.extension.sendRequest({method: 'getStorage'}, function(response) {
        var bool = response.storage['inject_quora'];
        if (bool == 'true' || bool === undefined) inject();
    });

});
