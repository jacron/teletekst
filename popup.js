function init() {
    fetch(config.teletekstUrl, {mode: 'no-cors'})
        .then(res => res.text())
        .then(text => {
            const parser = new DOMParser();
            const HTMLDcoument = parser.parseFromString(text, 'text/html');
            const teletekst = HTMLDcoument.getElementById('teletekst');
            const container = document.getElementById('teletekst');
            container.innerHTML = teletekst.innerHTML;
            document.documentElement.innerHTML = text;
        }).catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});
