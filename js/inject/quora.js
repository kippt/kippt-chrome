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
            var a = $('<span class="bullet"> &bullet; </span><a href>Save to Kippt</a>');
            a.on('click', function() {
                // Get URL and title
                var url = document.URL;
                var title = $('h1').text();

                openPopup(a, title, url);
            });

            // New link at the end
            $('.item_action_bar').append(a);
        } else {
            rowList.each(function(no, div) {
                var aList = $('a', div);
                if (aList.length <= 1)
                    return;

                var a = $('<span class="bullet"> &bullet; </span><a href style="color: #538DC2;">Save to Kippt</a>');
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
