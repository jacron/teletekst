import {config} from "../config.js";
import {initOnderregel} from "../popup/js/onderRegel.js";

const KEY = config.storageKey.onderregel;
const KEYSTATE = config.storageKey.onderregelAan;
const STORAGE = chrome.storage.local;

const fastIds = ['fastText1', 'fastText2', 'fastText3', 'fastText4'];
const optionalLinks = [
        [' nieuws ', '101'],
        [' actualiteit ', '220'],
        [' documentaire ', '228'],
        [' weer ', '702'],
    ]

let opties;

function _showOpties() {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < opties.length; i++) {
        const row = rows[i];
        const optie = opties[i];
        const kolommen = row.querySelectorAll('td');
        kolommen[0].querySelector('input').value = optie[0];
        kolommen[1].querySelector('input').value = optie[1];
    }
}

function showOpties(results) {
    if (results[KEY] === undefined) {
        document.getElementById('optional-defaults').style.display = 'block';
    } else {
        opties = JSON.parse(results[KEY]);
    }
    if (opties) {
        _showOpties();
    }
}

function showLength() {
    let length = 0;
    for (let optie of opties) {
        length += optie[0].length;
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
    for (let i = 0; i < opties.length; i++) {
        const row = rows[i];
        const optie = opties[i];
        const kolommen = row.querySelectorAll('td');
        optie[0] = kolommen[0].querySelector('input').value;
        optie[1] = kolommen[1].querySelector('input').value;
    }
    const state = document.getElementById('state').checked;
    STORAGE.set({[KEYSTATE]: JSON.stringify(state)}).then();
    STORAGE.set({[KEY]: JSON.stringify(opties)}).then(() => {
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
    if (useCustom) {
        for (let i = 0; i < opties.length; i++) {
            const optie = opties[i];
            const fast = document.getElementById(fastIds[i]);
            fast.style.display = 'inline-block';
            fast.textContent = optie[0];
            fast.onclick = (e) => {
                e.preventDefault();
                open(config.teletekstPagina + optie[1], '_blank');
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

function handleChanges() {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < opties.length; i++) {
        const row = rows[i];
        const optie = opties[i];
        const kolommen = row.querySelectorAll('td');
        for (let j = 0; j < kolommen.length; j++) {
            const input = kolommen[j].querySelector('input');
            input.oninput = () => {
                optie[j] = input.value;
                showOnderregelPreview();
                showLength();
            }
        }
    }
    document.getElementById('state').onchange = (e) => {
        showOnderregelPreview(e.target.checked);
    }
}

function handleButtonClicks() {
    document.getElementById('cmd-use-defaults').addEventListener('click', () => {
        opties = optionalLinks;
        _showOpties();
        document.getElementById('optional-defaults').style.display = 'none';
    })
}

function checkState(results) {
    if (results[KEYSTATE]) {
        document.getElementById('state').checked = JSON.parse(results[KEYSTATE]);
    }
}

initOnderregel()
    .then(results => {
        showOpties(results);
        showLength();
        handleChanges();
        handleButtonClicks();
        checkState(results);
        showOnderregelPreview();
    })
    .catch(err => console.log(err));

document.forms[0].onsubmit = save;

