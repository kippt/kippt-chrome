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
            
            if (tab.url.indexOf('chrome://') == 0) {
                // Not tab content - Open Kippt
                chrome.tabs.update({url: 'https://kippt.com/inbox/'});
                window.close();
            } else {
                // General variables
                var url = tab.url,
                    existingClipId = false;
                
                // Init spinner
                var opts = {
                  lines: 9, // The number of lines to draw
                  length: 2, // The length of each line
                  width: 2, // The line thickness
                  radius: 3, // The radius of the inner circle
                  rotate: 0, // The rotation offset
                  color: '#111', // #rgb or #rrggbb
                  speed: 1, // Rounds per second
                  trail: 27, // Afterglow percentage
                  shadow: false, // Whether to render a shadow
                  hwaccel: false, // Whether to use hardware acceleration
                  className: 'spinner', // The CSS class to assign to the spinner
                  zIndex: 2e9, // The z-index (defaults to 2000000000)
                  top: 'auto', // Top position relative to parent in px
                  left: 'auto' // Left position relative to parent in px
                };
                var spinner = new Spinner(opts).spin();

                // Get user data
                var userResponse = $.ajax({
                    url: 'https://kippt.com/api/account/?include_data=services',
                    type: "GET",
                    dataType: 'json'
                });
                userResponse.done(function(data){
                    var services = data.services;
                    var linkShare = function(serviceName) {
                        $('#kippt-actions .' + serviceName).tipsy({title: 'data-connect-title', gravity: 'sw'});
                        $('#kippt-actions .' + serviceName).click(function(e) {
                            window.open('https://kippt.com/accounts/settings/connections/')
                        });

                    };
                    
                    var showShare = function(serviceName) { $('#kippt-actions .'+serviceName).css('display', 'inline-block'); };
                    
                    if (services.twitter === false)
                        linkShare('twitter');
                    if (services.facebook === false)
                        linkShare('facebook');
                    if (services.tumblr === false)
                        linkShare('tumblr');
                    else
                        showShare('tumblr');
                    if (services.instapaper === false)
                        linkShare('instapaper');
                    else
                        showShare('instapaper');
                    if (services.readability === false)
                        linkShare('readability');
                    else
                        showShare('readability');
                    if (services.pocket === false)
                        linkShare('pocket');
                    else
                        showShare('pocket');
                });
                userResponse.fail(function(jqXHR, textStatus){
                    $('.existing .loading').hide();
                    $('#logged-out').show();
                });
                
                // Check for dublicates
                $('.existing .loading').append(spinner.el);
                var dublicateRequest = $.ajax({
                    url: 'https://kippt.com/api/clips/?include_data=list&url='+escape(url),
                    type: "GET",
                    dataType: 'json'
                });
                dublicateRequest.done(function(response){
                    $('.existing .loading').hide();
                    if (response.meta.total_count) {
                        var duplicate = response.objects[0];
                        existingClipId = duplicate.id;
                        $('.existing a').show();
                        $('.existing a').click(function(e){
                            $('#id_title').val(duplicate.title);
                            $('#id_notes').val(duplicate.notes);
                            $('#id_list option[value='+duplicate.list.id+']').attr('selected', 'selected');
                            $('.existing').hide();
                        });
                    }
                });

                // Lists
                var updateLists = function(data) {
                    // Clear loading
                    $('#id_list').html('');
                    for (var i in data) {
                        var list = data[i];
                        $('#id_list').append(new Option(list['title'], list['id'], true, true));
                    }
                    $('#id_list option').first().attr('selected', 'selected');
                };

                // Fill lists from cache
                var listCache = localStorage.getItem('kipptListCache');
                if (listCache) {
                    updateLists(JSON.parse(listCache));
                }

                // Update lists from remote
                $.getJSON(
                    'https://kippt.com/api/lists/?limit=0',
                    function(response) {
                        var responseJSON = JSON.stringify(response.objects);
                        // Update only if lists have changed
                        if (responseJSON !== listCache) {
                            // Update UI
                            updateLists(response.objects);
                            // Save to cache
                            localStorage.setItem('kipptListCache', responseJSON);
                        }
                    }
                )

                // Shares
                $('.share').click(function(e){
                    if ($('.share:checked').length) {
                        $('#submit_clip').val('Save & share');
                    } else {
                        $('#submit_clip').val('Save')
                    }
                });

                // Handle save
                $('#submit_clip').click(function(e){
                    // Data
                    var data = {
                        id: existingClipId,
                        url: url,
                        title: $('#id_title').val(),
                        notes: $('#id_notes').val(),
                        list: $('#id_list option:selected').val(),
                        source: 'chrome_v1.1'
                    }
                    
                    // Shares
                    var services = [];
                    $('.share:checked').each(function(i, elem){
                        services.push($(elem).data('service'));
                    });
                    data['share'] = services;
                    
                    // Save to Kippt in background
                    Socket.postTask(data);
                    window.close();
                });
                
                // Cache notes
                $('#id_title').on('keyup change cut paste', function(e){
                    localStorage.setItem('cache-title', $('#id_title').val())
                });
                $('#id_notes').on('keyup change cut paste', function(e){
                    localStorage.setItem('cache-notes', $('#id_notes').val())
                });
            }
        });
    });
});