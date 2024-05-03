import {config} from "../../config.js";
import {handleKeyInput} from "./keyinput.js";
import {fetchPage} from "./fetchPage.js";

const cssSidePanel = `
#container,
#container2 {
    padding: 0 8px;
    font-size: 14px;
    margin-left: -10px;
}
#container #content {
    height: 460px;
}
#container2 #content {
    height: unset;
}
.tt-btn {
    font-size: 12px;
}
.tt-paginatie {
    height: 26px;
    transform: scale(.76);
    margin-left: -54px;
}
#help {
    display: none;
}
#message {
    top: 34px;
    left: 8px;
}
#container2 .tt-paginatie,
#container2 #content span:nth-last-child(1),
#container2 #content span:nth-last-child(2),
#container2 #content span:nth-last-child(3),
#container2 #content span:nth-last-child(4)
  {
    display: none;
}
#container2 #content {
    line-height: 1.3;
}
`;

function injectSidePanelStyle() {
    const style = document.createElement('style');
    style.innerHTML = cssSidePanel;
    document.head.appendChild(style);
}

document.onkeydown = function (event) {
    handleKeyInput(event).then(url => fetchPage(url, 'container'));
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.location.search.length === 0) {
        injectSidePanelStyle()
    }
    /* STARTPUNT */
    fetchPage(config.teletekstStart, 'container');
});
