function setTitleWithTime() {
    const now = new Date();
    document.title = 'NOS Teletekst - ' +
        now.getHours() + ':' +
        now.getMinutes();
}
console.log('in scroll.js...');
window.scrollTo(0, 60);
setTitleWithTime();
