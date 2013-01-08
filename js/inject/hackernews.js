$(function() {

    var openPopup = function(a, title, url) {
        data = {
            title: title,
            url: url,
            source: "chrome_extension_hackernews"
        };
        KipptOpenPopup(data);
    };

    var inject = function() {
        var tdList = $('tr td.subtext');
        if (tdList.length == 0)
            return;

        tdList.each(function(i, td) {
            var aList = $('a', td);
            if (aList.length != 3)
                return;

            var a = $('<a href>save to kippt</a>');
            a.on('click', function(e) {
                e.preventDefault();
                // Get URL and title
                var tdAbove = td.parentElement.previousSibling.childNodes[2];
                var aLink = $('a', tdAbove)[0];
                var title = aLink.innerText;
                var url = aLink.href;

                openPopup(a, title, url);
            });

            // New link at the end
            var last = aList.last();
            last.after(a);
            a.before(' | ');
        });
    };

    // Check opt-out status
    chrome.extension.sendRequest({method: 'getStorage'}, function(response) {
        var bool = response.storage['inject_hn'];
        if (bool == 'true' || bool == undefined) inject();
    });

});
