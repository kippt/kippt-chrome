(function() {
    // Functions for socket.js
    window.KipptExtension = {
        taskReceived: function(msg) {
            // Helper function for clip creation
            var createNewClip = function(msg) {
                var type;
                if (!msg.id) {
                    // Create new
                    type = 'POST'
                    url = 'https://kippt.com/api/clips/';
                } else {
                    // Update
                    type = 'PUT'
                    url = 'https://kippt.com/api/clips/'+msg.id+'/'
                }

                $.ajax({
                    url: url,
                    type: type,
                    dataType: 'json',
                    data: JSON.stringify(msg)
                })
                .done(function(){
                    // Clear page cache
                    localStorage.removeItem('cache-title');
                    localStorage.removeItem('cache-notes');
                })
                .fail(function(jqXHR, textStatus){
                    alert( "Something went wrong when saving. Try again or contact hello@kippt.com");
                });
            }
            
            // New list
            if (msg['new_list']) {
                $.ajax({
                    url: 'https://kippt.com/api/lists/',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(msg['new_list'])
                })
                .done(function(data){
                    // Create clip with new list
                    msg['list'] = data.id;
                    createNewClip(msg);
                })
                .fail(function(){
                    alert( "Something went wrong when saving. Try again or contact hello@kippt.com");
                });
            } else {
                // Create clip with existing list
                createNewClip(msg);
            }
        }
    };

    // Message passing
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.method == 'getStorage') {
            sendResponse({storage: localStorage});
        } else {
            sendResponse({}); // snub them.
        }
    });

})();

