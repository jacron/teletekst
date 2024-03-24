import {activePopup} from "./state.js";
import {createPopup} from "./createWindow.js";

function actionClickedListener() {
    /** prevent multiple popups */
    if (!activePopup.winId) {
        createPopup();
    } else {
        chrome.windows.remove(activePopup.winId).then();
    }
}

function injectScript(id) {
    chrome.scripting.executeScript({
        target: {tabId: id},
        files: ['teletekst.js'],

    }, () => {});
}

function tabsUpdatedListener(id, tabChangeInfo) {
    if (tabChangeInfo.status && tabChangeInfo.status === 'loading' &&
        id === activePopup.tabId) {
        injectScript(id);
    }
}

function windowRemovedListener(windowId) {
    if (windowId === activePopup.winId) {
        activePopup.winId = null;
        activePopup.tabId = null;
    }
}

function messageListener(req) {
    if (req.message === 'closeWindow') {
        chrome.windows.remove(activePopup.winId, () => {});
    }
}

chrome.action.onClicked.addListener(actionClickedListener);
chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
chrome.windows.onRemoved.addListener(windowRemovedListener);
chrome.runtime.onMessage.addListener(messageListener);

