$(function() {
    chrome.tabs.getSelected(null, function(tab) {
        // Extension
        chrome.tabs.sendRequest(tab.id, {helper: 'get_note'}, function(response) {
            if (response){
                selected_note = response.note;
            } else {
                selected_note = '';
            }

            // Kippt extension
            chrome.tabs.getSelected(null, function(tab){
                var kippt_url = 'https://kippt.com/extensions/new';
                var tab_url = tab.url;
                var tab_title = tab.title;


                $('#id_title').val(tab_title.trim());
                $('#id_url').val(tab_url);
                $('#id_notes').val(selected_note.trim());

                $('textarea').focus();
                
                // Get from cache
                if (localStorage.getItem('cache-title'))
                    $('#id_title').val( localStorage.getItem('cache-title') );
                if (localStorage.getItem('cache-notes'))
                    $('#id_notes').val( localStorage.getItem('cache-notes') );
            });
        });
    });
});