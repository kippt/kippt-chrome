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
            });
        });
    });
});