import {isNumber} from "./keyinput.js";
import {config} from "../../config.js";

function handleOneInternalLink(e, link, init, containerId, href) {
    const isBlauwNummer = link.classList.contains('cyan') && isNumber(link.textContent);
    if (isBlauwNummer) {
        alert(config.msgBlauwNietOproepbaar);
    } else {
        let url = config.teletekstHome + href;
        /* 'pagina niet gevonden'? */
        if (href.indexOf('?p') === -1) {
            url = config.teletekstStart;
        }
        init(url, containerId);
    }
    e.preventDefault();
    return true;
}

function handleInternalLinks(init, containerId) {
    const links = document.body.getElementsByTagName('a');
    for (let link of links) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
            link.addEventListener('click', e => {
                handleOneInternalLink(e, link, init, containerId, href);
            })
        }
    }
}

export {handleInternalLinks}
