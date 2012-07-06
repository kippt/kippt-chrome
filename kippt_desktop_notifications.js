$(function () {
    var pollTimer,
        since,
        notifications = {}, 
        firstRound = true,
        
        poll,
        updateBadge,
        showNotification,

        getNotificationTitle,
        getNotificationBody,
        getNotificationIcon,
        
        titles = {
            new_comment: 'commented on'
        };
    
    // Makes a request to the notifications api
    poll = function () {
        $.ajax({
            type: 'GET',
            url: 'https://kippt.com/api/notifications/',
            dataType: 'jsonp',
            data: { 
                since: since,
                include_data: 'user,clip'
            },
            success: function (data, status, xhr) {
                // Hash to store the new notifications
                var newNotifications = {},
                    lastTimestamp,
                    timestamp;
                
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    return;
                }
                
                if (!data) {
                    return;
                }
                
                if (data.objects && data.objects.length > 0) {
                    // Loop through all new notifications
                    data.objects.forEach(function (object) {
                        // Store the id for the next update
                        newNotifications[object.id] = true;
                        // Check if we've seen this already
                        if (!firstRound || !notifications[object.id]) {
                            // Make sure user hasn't seen this
                            if (!object.is_seen) {
                                // Show the actual notification
                                showNotification(object);
                            }
                        }
                        // Store last item timestamp
                        timestamp = parseInt(object.created, 10);
                        if (!lastTimestamp || timestamp > lastTimestamp) {
                            lastTimestamp = timestamp;
                        }
                    });
                }
                
                // Update badge with unread count
                if (data.meta && typeof data.meta.unread_count === 'number') {
                    updateBadge(data.meta.unread_count);
                }
                
                // Treat rest of the requests as new so all the notifications get shown
                firstRound = false;
                // Store id's of seen notifications
                notifications = newNotifications;
                
                since = lastTimestamp;
            },
            error: function (xhr, errorType, error) {

            }
        });
    };
    
    updateBadge = function (count) {
        if (count == '?') {
            chrome.browserAction.setBadgeText({text: '?'});
        } else if (count === 0) {
            chrome.browserAction.setBadgeText({text: '0'});
        } else {
            chrome.browserAction.setBadgeText({text: count});
        }
    };
    
    showNotification = function (notificationData) {
        var notification,
            title = getNotificationTitle(notificationData), 
            body = getNotificationBody(notificationData),
            icon = getNotificationIcon(notificationData);
            
        notification = webkitNotifications.createNotification(icon, title, body);
        notification.onclick = function () {
            notification.cancel();
            chrome.tabs.update({url: 'https://kippt.com' + notificationData.item_url});
            // TODO: mark notification as read
        };
        notification.ondisplay = function () {
            // Close popup after 10 seconds
            setTimeout(function () {
                notification.cancel();
            }, 10 * 1000);
        };
        notification.show();
    };
    
    getNotificationTitle = function (notificationData) {
        return notificationData.item.user.username + ' ' + titles[notificationData.type];
    };
    getNotificationBody = function (notificationData) {
        return notificationData.item.clip.title;
    };
    getNotificationIcon = function (notificationData) {
        return 'img/icon48.png';
    };
    
    window.kipptStartPolling = function () {
        if (!pollTimer) {
            pollTimer = setInterval(poll, 1000 * 60);
        }
    };
    window.kipptStopPolling = function () {
        pollTimer = clearInterval(pollTimer);
    };
    
    poll();
    
    kipptStartPolling(); 
});