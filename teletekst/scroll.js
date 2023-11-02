function setTitleWithTime() {
    const now = new Date();
    document.title = 'NOS Teletekst - ' +
        now.getHours() + ':' +
        now.getMinutes();
}
function hackWeer() {
    const linkSport = document.getElementById('fastText4Blue');
    linkSport.textContent = ' weer ';
    linkSport.href = '/webplus?p=702';
}
console.log('in scroll.js...');
window.scrollTo(0, 60);
setTitleWithTime();
hackWeer();
