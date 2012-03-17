// http://code.google.com/chrome/extensions/messaging.html
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.helper == 'get_note'){
            sendResponse({note: document.getSelection().toString()});
        } else {
            sendResponse({note: ''}); // snub them.
        }
    }
);
