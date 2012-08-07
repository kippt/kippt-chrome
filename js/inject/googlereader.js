$(function() {
    var openPopup = function(a, title, url) {
        data = {
            title: title,
            url: url,
            source: "chrome_extension_reader"
        };
        KipptOpenPopup(data);
    };
    
    var hasKipptAction = function(div) {
        return $('.action-kippt', div).length > 0
    };

    var getShareContent = function(el) {
        var title = $('h2.entry-title', el).text();
        var url = $('a.entry-original', el)[0].href;
        return {title: title, url: url};
    };

    var inject = function() {
        $('div#viewer-container').on('click', 'div.expanded', function(event) {
            // Mouseover fired for child elements so need to find the right div
            var el = event.target;

            while (!$(el).hasClass('entry')) {
                if (el == undefined)
                    return;
                el = el.parentElement;
            }
            el = $(el);
            
            // Actions list
            var div = $('.entry-actions', $(el));

            // Don't add kippt link again
            if (hasKipptAction(div))
                return;

            // Insert kippt link at the end
            var a = $('<a href="#">Kippt</a>');
            a.on('click', function() {
                var content = getShareContent(el);
                openPopup(a, content.title, content.url);
            });

            var newAction = $('<span class="action-kippt"></span>');
            newAction.append(a);

            var c = div.children();
            var lastAction = c[c.length - 1];
            $(lastAction).after(newAction);

        });
    };

    // Check opt-out status
    chrome.extension.sendRequest({method: 'getStorage'}, function(response) {
        var bool = response.storage['inject_google_reader'];
        if (bool == 'true' || bool == undefined) inject();
    });

});
