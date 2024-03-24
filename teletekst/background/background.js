import {activePopup} from "./state.js";
import {createPopup, removePopup, resetPopup} from "./createWindow.js";

function actionClickedListener() {
    /** prevent multiple popups */
    if (!activePopup.winId) {
        createPopup();
    } else {
        removePopup();
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

function messageListener(req) {
    if (req.message === 'closeWindow') {
        removePopup();
    }
}

chrome.action.onClicked.addListener(actionClickedListener);
chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
chrome.windows.onRemoved.addListener(resetPopup);
chrome.runtime.onMessage.addListener(messageListener);
