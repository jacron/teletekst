import {config} from "./config.js";

const KEY = config.storageKey.onderregel;
const KEYSTATE = config.storageKey.onderregelAan;
const STORAGE = chrome.storage.local;

let optionalLinks = [
        [' nieuws ', '101'],
        [' actualiteit ', '220'],
        [' documentaire ', '228'],
        [' weer ', '702'],
    ]

function showOpties(storedOpties) {
    const opties = storedOpties? JSON.parse(storedOpties) : optionalLinks;
    optionalLinks = opties;
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < optionalLinks.length; i++) {
        const row = rows[i];
        const link = opties[i];
        const kolommen = row.querySelectorAll('td');
        kolommen[0].querySelector('input').value = link[0];
        kolommen[1].querySelector('input').value = link[1];
    }
}

function showLength() {
    let length = 0;
    for (let i = 0; i < optionalLinks.length; i++) {
        length += optionalLinks[i][0].length;
    }
    const totalLength = document.getElementById('totalLength');
    totalLength.textContent = length.toString();
    if (length === 41) {
        totalLength.classList.remove('red');
    } else {
        totalLength.classList.add('red');
    }
}

function save(e) {
    e.preventDefault();
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < optionalLinks.length; i++) {
        const row = rows[i];
        const link = optionalLinks[i];
        const kolommen = row.querySelectorAll('td');
        link[0] = kolommen[0].querySelector('input').value;
        link[1] = kolommen[1].querySelector('input').value;
    }
    const state = document.getElementById('state').checked;
    STORAGE.set({[KEYSTATE]: JSON.stringify(state)}).then();
    STORAGE.set({[KEY]: JSON.stringify(optionalLinks)}).then(() => {
        showOnderregelPreview(state);
        const msg = document.getElementById('saved-message');
        msg.style.display = 'inline-block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000)
    });

}

function showOnderregelPreview(useCustom) {
    if (!useCustom) {
        useCustom = document.getElementById('state').checked;
    }
    const fastIds = ['fastText1', 'fastText2', 'fastText3', 'fastText4'];
    if (useCustom) {
        for (let i = 0; i < optionalLinks.length; i++) {
            const link = optionalLinks[i];
            const fast = document.getElementById(fastIds[i]);
            fast.style.display = 'inline-block';
            fast.textContent = link[0];
            fast.onclick = (e) => {
                e.preventDefault();
                open(config.teletekstPagina + link[1], '_blank');
            }
        }
        for (let span of document.querySelectorAll('.deflt')) {
            span.style.display = 'none';
        }
    } else {
        for (let i = 0; i < fastIds.length; i++) {
            const fast = document.getElementById(fastIds[i]);
            fast.style.display = 'none';
        }
        for (let span of document.querySelectorAll('.deflt')) {
            span.style.display = 'inline-block';
        }
    }
}

function handelChanges() {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < optionalLinks.length; i++) {
        const row = rows[i];
        const link = optionalLinks[i];
        const kolommen = row.querySelectorAll('td');
        for (let j = 0; j < kolommen.length; j++) {
            const input = kolommen[j].querySelector('input');
            input.oninput = () => {
                link[j] = input.value;
                showOnderregelPreview();
                showLength();
            }
        }
    }
    document.getElementById('state').onchange = (e) => {
        showOnderregelPreview(e.target.checked);
    }}

STORAGE.get(KEY, results => {
    showOpties(results[KEY]);
    showLength();
    handelChanges();
})
STORAGE.get(KEYSTATE, results => {
    const checked = JSON.parse(results[KEYSTATE]);
    document.getElementById('state').checked = checked;
    showOnderregelPreview(checked);
})
document.forms[0].onsubmit = save;

