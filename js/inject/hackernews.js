$(function() {
    var openPopup = function(a, title, url) {
        data = {
            title: title,
            url: url,
            source: "chrome_extension_hackernews"
        };
        KipptOpenPopup(data);
    };

    var tdList = $('tr td.subtext');
    if (tdList.length == 0)
        return;

    tdList.each(function(i, td) {
        var aList = $('a', td);
        if (aList.length != 3)
            return;

        var a = $('<a href="#">kippt</a>');
        a.on('click', function() {
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
});