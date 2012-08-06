$(function() {
    window.KipptOpenPopup = function(data) {
        var url = encodeURIComponent(data.url),
            title= encodeURIComponent(data.title),
            source = encodeURIComponent(data.source);

        var windowUrl = "https://kippt.com/extensions/new?url="+ url +"&title="+ title +"&source="+ source;
        window.open(windowUrl, "kippt-popup", "location=no,menubar=no,status=no,titlebar=no,scrollbars=no,width=420,height=192");
    };
});