import {activatePopup2, resetIds} from "./lib/popup2.js";

// function openSidePanel() {
//     chrome.tabs.query({active: true, lastFocusedWindow: true}, ([tab]) => {
//         chrome.sidePanel.open({tabId: tab.id}).then();
//     })
// }

function commandListener(command) {
    switch (command) {
        case 'open-panel':
            activatePopup2();
            break;
    }
}

function windowRemovedListener(windowId) {
    resetIds(windowId);
}

/**
 * Deze regel in manifest zou actionClick overrulen:
 "default_popup": "popup/view/popup.html?popup",
 *
 */
function actionClickedListener() {
    activatePopup2();
}

chrome.commands.onCommand.addListener(commandListener);
chrome.action.onClicked.addListener(actionClickedListener);
chrome.windows.onRemoved.addListener(windowRemovedListener);
