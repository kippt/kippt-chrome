$(function() {
    window.KipptOpenPopup = function(data) {
        var url = encodeURIComponent(data.url),
            title= encodeURIComponent(data.title),
            notes= encodeURIComponent(data.notes),
            source = encodeURIComponent(data.source);
        
        if (data.notes)
            notes= encodeURIComponent(data.notes)
        else
            notes = ''
        
        var windowUrl = "https://kippt.com/extensions/new?url="+ url +"&title="+ title + "&notes="+ notes + "&source="+ source;
        window.open(windowUrl, "kippt-popup", "location=no,menubar=no,status=no,titlebar=no,scrollbars=no,width=420,height=192");
    };
});