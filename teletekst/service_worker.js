import {activatePopup2, resetIds} from "./lib/popup2.js";

function openSidePanel() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, ([tab]) => {
        chrome.sidePanel.open({tabId: tab.id}).then();
    })
}

function closeSidePanel() {
    chrome.runtime.sendMessage({message: 'close-panel'}).then()
        .catch(err => console.error(err.message))
}

function commandListener(command) {
    switch (command) {
        case 'open-side-panel':
            openSidePanel();
            break;
        case 'close-side-panel':
            closeSidePanel();
            break;
    }
}

function removedListener(windowId) {
    resetIds(windowId);
}

/**
 * Deze regel in manifest zal actionClick overrulen:
 "default_popup": "popup/view/popup.html?popup",
 *
 */
function actionClickedListener() {
    activatePopup2();
}

chrome.commands.onCommand.addListener(commandListener);
chrome.action.onClicked.addListener(actionClickedListener);
chrome.windows.onRemoved.addListener(removedListener);
