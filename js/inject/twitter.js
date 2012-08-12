$(function() {
    var openPopup = function(a, title, url) {
        data = {
            title: title,
            url: url,
            source: "chrome_extension_twitter"
        };
        KipptOpenPopup(data);
    };

    var hasKipptAction = function(ul) {
        var found = false;
        $.each(ul.children(), function(i, li) {
            if ($(li).hasClass('action-kippt')) {
                found = true;
                return false;
            }
        });
        return found;
    };

    var getShareContent = function(parentEl) {
        var tweetEl = $('.js-tweet-text', parentEl);

        // Ignoring hashtag or @reply links
        var links = $('a:not(.twitter-hashtag, .twitter-atreply)', tweetEl);
        var a = null;
        if (links.length < 1) {
            // No links, use tweet URL
            var url = $('.time a', parentEl)[0].href;
        } else {
            // Take the first link
            a = links[0];
            url = a.href;
        }

        // Make a copy to extract text
        var el = $('<span>' + tweetEl.html() + '</span>');
        if (a) $('a', el).remove() // Remove all links
        var title = el.text();
        title = title.replace(/(\r\n|\n|\r)/gm, ''); // Strip newlines etc
        
        return {url: url, title: title};
    };

    var inject = function() {
        $('div.content-main').on('mouseover', '.js-stream-item', function(event) {
            // Mouseover fired for child elements so need to find the right div
            var el = event.target;
            while (!$(el).hasClass('js-stream-item')) {
                if (el == undefined)
                    return;
                el = el.parentElement;
            }
            el = $(el);
            
            // Actions list
            var ul = $('ul.tweet-actions', $(el));

            // Don't add kippt link again
            if (hasKipptAction(ul))
                return;

            // Insert kippt link at the end
            var content = getShareContent(el);
            var a = $('<a href="#">Kippt</a>');
            a.on('click', function() {
                openPopup(a, content.title, content.url);
            });

            var newAction = $('<li class="action-kippt"></li>');
            newAction.append(a);

            var c = ul.children();
            var lastAction = c[c.length - 1];
            $(lastAction).after(newAction);

        });
    };

    // Check opt-out status
    chrome.extension.sendRequest({method: 'getStorage'}, function(response) {
        var bool = response.storage['inject_twitter'];
        if (bool == 'true' || bool == undefined) inject();
    });

});
