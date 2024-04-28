import {config} from "../config.js";
import {fromStorage, showOnderregelPreview} from "../popup/js/onderRegel.js";

const KEY_OPTIONS = config.storageKey.onderregel;
const KEY_STATE = config.storageKey.onderregelAan;
const STORAGE = chrome.storage.local;

const optionalLinks = [
        [' nieuws ', '101'],
        [' actualiteit ', '220'],
        [' documentaire ', '228'],
        [' weer ', '702'],
    ]

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

function optieValuesFromTable() {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    const opties = [];
    for (let i = 0; i < rows.length; i++) {
        const optie = [];
        const row = rows[i];
        const kolommen = row.querySelectorAll('td');
        optie.push(kolommen[1].querySelector('input').value);
        optie.push(kolommen[2].querySelector('input').value);
        opties.push(optie);
    }
    return opties;
}

function save(e) {
    e.preventDefault();
    const opties = optieValuesFromTable();
    const state = document.getElementById('state').checked;
    STORAGE.set({[KEY_STATE]: JSON.stringify(state)}).then();
    STORAGE.set({[KEY_OPTIONS]: JSON.stringify(opties)}).then(() => {
        showOnderregelPreview(opties);
        const msg = document.getElementById('saved-message');
        msg.style.display = 'inline-block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000)
    });
}

function onChangedOpties() {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const captionInput = row.querySelector('.caption');
        const pageNrInput = row.querySelector('.pagenr');
        captionInput.oninput = () => {
            const opties = optieValuesFromTable()
            showOnderregelPreview(opties);
        }
        pageNrInput.oninput = () => {
            const opties = optieValuesFromTable()
            showOnderregelPreview(opties);
        }
    }
}

function handleChanges() {
    onChangedOpties();
    document.getElementById('state').onchange = () => {
        showOnderregelPreview(optieValuesFromTable());
    }
}

function useDefaultOnClick() {
    document.getElementById('cmd-use-defaults').addEventListener('click', () => {
        _showOpties(optionalLinks);
        document.getElementById('state').checked = true;
        showOnderregelPreview(optionalLinks);
        showMessage('spaces');
    })
}

function checkState(state) {
    if (state) {
        document.getElementById('state').checked = JSON.parse(state);
    } else {
        document.getElementById('state').checked = false;
    }
}

fromStorage()
    .then(results => {
        let opties = null;
        const key_options = results[KEY_OPTIONS];
        if (key_options) {
            opties = JSON.parse(key_options);
            _showOpties(opties);
        } else {
            showMessage('defaults');
        }
        handleChanges();
        useDefaultOnClick();
        checkState(results[KEY_STATE]);
        showOnderregelPreview(opties);
    })
    .catch(err => console.log(err));

document.forms[0].onsubmit = save;

