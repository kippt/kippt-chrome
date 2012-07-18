function setIconColor() {
  switch (localStorage["button_color"]) {
    case "grey":
      chrome.browserAction.setIcon({
        path: "img/icon19_grey.png"
      });
      break;
    default:
      chrome.browserAction.setIcon({
        path: "img/icon19.png"
      });
      break;
  }
}

chrome.tabs.onCreated.addListener(setIconColor);
chrome.tabs.onActivated.addListener(setIconColor);
