import {config} from "./popup/config.js";

function showOnderregel() {
    const optiesTable = document.getElementById('onderregelOpties');
    const rows = optiesTable.querySelectorAll('tr');
    for (let i = 0; i < config.optionalLinks.length; i++) {
        const row = rows[i];
        const link = config.optionalLinks[i];
        const kolommen = row.querySelectorAll('td');
        kolommen[0].querySelector('input').value = link[0];
        kolommen[1].querySelector('input').value = link[1].toString();
    }
    let length = 0;
    for (let i = 0; i < config.optionalLinks.length; i++) {
        length += config.optionalLinks[i][0].length;
    }
    const totalLength = document.getElementById('totalLength');
    totalLength.textContent = length;
}

function save() {

}

document.forms[0].onsubmit = save();
