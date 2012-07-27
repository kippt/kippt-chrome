chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    if (text.length > 0) {
        var search = 'https://kippt.com/api/search/clips/?limit=5&q=' + text;
        $.getJSON(search, function(data){
            if (data.objects) {
                var suggestions = [];
                for (s in data.objects) {
                    var title = data.objects[s].title;
                    var url = data.objects[s].url;
                    var url_domain = data.objects[s].url_domain;
                    suggestions.push({
                        description: title+' <dim> - '+url_domain+'</dim>',
                        content: url
                    });
                }
                suggest(suggestions);
            }
        });
    }
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    chrome.tabs.getSelected(null, function(tab) {
        if ((text.indexOf('http://') == 0) || (text.indexOf('https://') == 0)) {
            // Go to search result
            chrome.tabs.update(tab.id, {url : text});
        } else {
            // Search Kippt
            chrome.tabs.update(tab.id, {url : 'https://kippt.com/search?q='+text});
        }
    });
});