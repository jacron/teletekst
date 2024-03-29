import {activePopup} from "./state.js";

/*
In manifest v3, calculating window left using screen.width is not possible in the background script.
So we use a previous calculation here for my Studio Display.
Later, more dynamically, in the injected script, teletekst.js,
we calculate the center of the screen for the x-position of the window.
 */
const popupData = {
    /** load page 101, nieuwsoverzicht */
    url: 'https://teletekst-data.nos.nl/webplus/?p=101-1',
    type: 'popup',
    width: 610,
    height: 640,
    left: 975, // calculated on my studio display
    top: 40,
};

function createPopup() {
    chrome.windows.create(popupData, win => {
        activePopup.tabId = win.tabs[0].id;
        activePopup.winId = win.id;
    });
}

function removePopup() {
    chrome.windows.remove(activePopup.winId, () => {});
}

function resetPopup(windowId) {
    if (windowId === activePopup.winId) {
        activePopup.winId = null;
        activePopup.tabId = null;
    }
}

export {createPopup, removePopup, resetPopup}
