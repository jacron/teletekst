let winId = null;
let tabId = null;

const createData = {
    url: 'popup/view/popup.html?popup2',
    type: 'popup',
    width: 1100,
    height: 700,
    left: 10,
    top: 20,
};

function resetIds(windowId) {
    if (windowId === winId) {
        winId = null;
        tabId = null;
    }
}

function calcCenteredLeft() {
    const outerWindowWidth = 1100;
    return(screen.width / 2 - (outerWindowWidth / 2));
}

function openPopup2() {
    createData.left = calcCenteredLeft();
    chrome.windows.create(createData, win => {
        tabId = win.tabs[0].id;
        winId = win.id;
    });

}

function activatePopup2() {
    if (winId === null) {
        openPopup2();
    } else {
        chrome.windows.update(winId, {
            focused: true
        }).then();
    }
}

export {openPopup2, resetIds, activatePopup2}
