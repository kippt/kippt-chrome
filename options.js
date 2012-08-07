// Saves options to localStorage.
function save_options() {
    var select = $("#button-color");
    var color = $("#button-color input[name=button_color]:checked").val();
    localStorage["button_color"] = color;
    
    switch (localStorage["button_color"]) {
        case "grey":
            chrome.browserAction.setIcon({
                path: "img/icon19_grey.png"
            });
            break;
        case "light":
            chrome.browserAction.setIcon({
                path: "img/icon19_light.png"
            });
            break;
        default:
            chrome.browserAction.setIcon({
                path: "img/icon19.png"
            });
            break;
    }

    // Injection
    $.each(['inject_hn'], function(i, name) {
        var sel = 'input[name=' + name + ']';
        localStorage[name] = $(sel).is(':checked');
        console.log(sel, $(sel).is(':checked'), localStorage[name]);
    });
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var color = localStorage["button_color"];
    if (color === undefined) {
        $("#button-color input[name=button_color]").first().attr('checked', 'checked')
    }
    $("#button-color input[name=button_color]").each(function (index, option) {
        if ($(option).val() == color) {
            option.checked = "true";
        }
    });
}

$(function() {
    restore_options();
    $("button").click(save_options);
});

