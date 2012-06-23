var clickHandler = function(e) {
    var url = e.pageUrl;
    var selection = '';
    var data = '';
    
    // Selected text on current page (save page url)
    if (e.selectionText) {
        selection = e.selectionText;
        data = JSON.stringify({url: url, notes: selection});
    }
    
    // Saving a link
    if (e.linkUrl) {
        url = e.linkUrl;
        data = JSON.stringify({url: url});
    }
    
    $.ajax({
        type: 'POST',
        url: 'https://kippt.com/api/clips/',
        data: data,
        dataType: 'json',
        timeout: 2500,
        error: function(xhr, type){ alert('Something went wrong when saving to Kippt. Have you signed in?') },
    });
};

chrome.contextMenus.create({
  "title": "Save to Kippt",
    "contexts": ["selection", "link"],
    "onclick" : clickHandler
});
