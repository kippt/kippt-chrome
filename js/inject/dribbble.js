$(function() {

    var openPopup = function(a, title, url) {
        data = {
            title: title,
            url: url,
            source: "chrome_extension_dribbble"
        };
        KipptOpenPopup(data);
    };

    var inject = function() {
        var tweetAction = $('.meta-act').has('.meta-act-link.meta-share');
        if (tweetAction.length === 1){
            // Insert kippt link at the end
            var sprite = chrome.extension.getURL('/img/dribbble-icon.png');      
            var a = $('<div class="meta-act"><a href class="meta-act-link meta-kippt" style="background-image: url('+sprite+') !important;">Save to Kippt</a></div>');
            a.on('click', function(e) {
                e.preventDefault();
                
                // Get URL and title
                var url = document.URL;
                var title = $('h1').text() + " by " + $('.shot-byline-user a').text();

                openPopup(a, title, url);
            });

            // New link at the end
            tweetAction.after(a);
        }
    };

    // Check opt-out status
    chrome.extension.sendRequest({method: 'getStorage'}, function(response) {
        var bool = response.storage['inject_dribbble'];
        if (bool == 'true' || bool === undefined) inject();
    });

});
