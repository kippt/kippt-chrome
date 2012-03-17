$(function() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {helper: 'get_note'}, function(response) {
            selected_note = response.note;
            
            // Kippt iframe
            chrome.tabs.getSelected(null, function(tab){
                var kippt_url = 'https://kippt.com/extensions/new';
                var tab_url = tab.url;
                var tab_title = tab.title;
                var iframe_url = kippt_url + 
                    '?url=' + encodeURIComponent(tab_url) + 
                    '&title=' + encodeURIComponent(tab_title) + 
                    '&notes=' + encodeURIComponent(selected_note) +
                    '&source=chrome';

                kippt_iframe = document.createElement('iframe');
                kippt_iframe.src = iframe_url;
                kippt_iframe.frameborder = '0';
                kippt_iframe.width = '100%';
                kippt_iframe.height = '100%';
                $(kippt_iframe).attr('allowTransparency', 'true')
                $(kippt_iframe).attr('frameBorder', '0')
                $(kippt_iframe).attr('scrolling', 'no');
                
                $('#iframe').html(kippt_iframe);
            });
        });
    });
    
    
});