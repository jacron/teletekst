import {config} from "../config.js";

const KEY_OPTIONS = config.storageKey.onderregel;
const KEY_STATE = config.storageKey.onderregelAan;
const STORAGE = chrome.storage.local;

const fastIds = ['fastText1', 'fastText2', 'fastText3', 'fastText4'];
const optionalLinks = [
        [' nieuws ', '101'],
        [' actualiteit ', '220'],
        [' documentaire ', '228'],
        [' weer ', '702'],
    ]

// let opties;

function _showOpties(opties) {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < opties.length; i++) {
        const row = rows[i];
        const optie = opties[i];
        const kolommen = row.querySelectorAll('td');
        kolommen[1].querySelector('input').value = optie[0];
        kolommen[2].querySelector('input').value = optie[1];
    }
}

function showMessage(msg) {
    if (msg === 'defaults') {
        document.getElementById('optional-defaults').style.display = 'block';
        document.getElementById('spaces-msg').style.display = 'none';
    } else if (msg === 'spaces') {
        document.getElementById('optional-defaults').style.display = 'none';
        document.getElementById('spaces-msg').style.display = 'block';
    }
}

function showOpties(opties) {
    if (opties === undefined) {
        showMessage('defaults');
    } else {
        _showOpties(JSON.parse(opties));
    }
}

function showLength(opties) {
    let length = 0;
    if (!opties) {
        return;
    }
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
    const opties = [];
    for (let i = 0; i < opties.length; i++) {
        const row = rows[i];
        const optie = opties[i];
        const kolommen = row.querySelectorAll('td');
        optie[0] = kolommen[1].querySelector('input').value;
        optie[1] = kolommen[2].querySelector('input').value;
    }
    const state = document.getElementById('state').checked;
    STORAGE.set({[KEY_STATE]: JSON.stringify(state)}).then();
    STORAGE.set({[KEY_OPTIONS]: JSON.stringify(opties)}).then(() => {
        showOnderregelPreview(opties, state);
        const msg = document.getElementById('saved-message');
        msg.style.display = 'inline-block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000)
    });

}

function showFast() {
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
}

function showDefaults() {
    for (let i = 0; i < fastIds.length; i++) {
        const fast = document.getElementById(fastIds[i]);
        fast.style.display = 'none';
    }
    for (let span of document.querySelectorAll('.deflt')) {
        span.style.display = 'inline-block';
    }
}

function showOnderregelPreview(opties, useCustom) {
    if (!useCustom) {
        useCustom = document.getElementById('state').checked;
    }
    if (useCustom) {
        if (opties) {
            showFast();
        } else {
            showDefaults();
        }
    } else {
        showDefaults();
    }
}

function handleChanges() {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    const opties = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const captionInput = row.querySelector('.caption');
        const pageNrInput = row.querySelector('.pagenr');
        captionInput.oninput = () => {
            opties[i][0] = captionInput.value;
            showOnderregelPreview(opties);
            showLength(opties);
        }
        pageNrInput.oninput = () => {
            opties[i][1] = pageNrInput.value;
            showOnderregelPreview(opties);
            showLength(opties);
        }
    }
    document.getElementById('state').onchange = (e) => {
        showOnderregelPreview(opties, e.target.checked);
    }
}

function handleButtonClicks() {
    document.getElementById('cmd-use-defaults').addEventListener('click', () => {
        // opties = optionalLinks;
        _showOpties(optionalLinks);
        showOnderregelPreview(optionalLinks);
        showMessage('spaces');
    })
}

function checkState(state) {
    if (state) {
        console.log(state)
        document.getElementById('state').checked = JSON.parse(state);
    } else {
        document.getElementById('state').checked = false;
    }
}

function fromStorage() {
    return new Promise((resolve, reject) => {
        const {onderregel, onderregelAan} = config.storageKey;
        STORAGE.get([onderregel, onderregelAan], storedOpties => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(storedOpties);
        })
    })
}

fromStorage()
    .then(results => {
        const opties = results[KEY_OPTIONS];
        showOpties(opties);
        showLength(opties);
        handleChanges();
        handleButtonClicks();
        checkState(results[KEY_STATE]);
        showOnderregelPreview(opties);
    })
    .catch(err => console.log(err));

document.forms[0].onsubmit = save;

