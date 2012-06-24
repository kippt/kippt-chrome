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
        chrome.tabs.update(tab.id, {url : text});
    });
});