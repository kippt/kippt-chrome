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

    $('div.content-main').on('mouseover', '.js-stream-item', function(event) {
        // Mouseover fired for child elements so need to find the right div
        var el = event.target;
        while (!$(el).hasClass('js-stream-item')) {
            if (el == undefined)
                return;
            el = el.parentElement;
        }
        
        // Actions list
        var ul = $('ul.tweet-actions', $(el));

        if (!hasKipptAction(ul)) {
            // Insert kippt link at the end
            var c = ul.children();
            var lastAction = c[c.length - 1];
            $(lastAction).after($('<li class="action-kippt">KIPPT</li>'))
        }

    });

});
