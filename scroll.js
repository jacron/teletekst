/** dit script wordt uitgevoerd door chrome.
 * dus niet vanzelf telkens als je een refresh doet */
function setTitleWithTime() {
    const now = new Date();
    document.title = 'NOS Teletekst - ' +
        now.getHours() + ':' +
        now.getMinutes();
}

window.scrollTo(0, 294);
setTitleWithTime();
