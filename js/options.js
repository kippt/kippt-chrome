$(function() {
    var inject_inputs = ['inject_hn', 'inject_twitter', 'inject_google_reader', 'inject_quora', 'inject_dribbble', 'sort_list_alphabetically'];

    // Saves options to localStorage.
    var save_options = function() {
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
        $.each(inject_inputs, function(i, name) {
            var sel = 'input[name=' + name + ']';
            localStorage[name] = $(sel).is(':checked');
        });
    };

    // Restores select box state to saved value from localStorage.
    var restore_options = function() {
        var color = localStorage["button_color"];
        if (color === undefined) {
            $("#button-color input[name=button_color]").first().attr('checked', 'checked')
        }
        $("#button-color input[name=button_color]").each(function (index, option) {
            if ($(option).val() == color) {
                option.checked = "true";
            }
        });

        $.each(inject_inputs, function(i, name) {
            var sel = 'input[name=' + name + ']';
            var bool = localStorage[name];
            if (bool == undefined) bool = 'true';
            $(sel).attr('checked', bool == 'true');
        });
    };

    restore_options();
    $("button").click(save_options);

});

