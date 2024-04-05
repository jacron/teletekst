const optionalLinks = [
    [' nieuws ', 101],
    [' actualiteit ', 220],
    [' documentaire ', 228],
    [' weer ', 702],
]
const onderRegelLinks = [
    'fastText1Red', 'fastText2Green', 'fastText3Yellow','fastText4Blue',
]

function replaceLinks() {
    for (let i = 0; i < onderRegelLinks.length; i++) {
        const link = document.getElementById(onderRegelLinks[i]);
        link.textContent = optionalLinks[i][0];
        link.href = '/webplus?p=' + optionalLinks[i][1];
    }
}

function calcLength() {
    let length = 0;
    for (let link of optionalLinks) {
        length += link[0].length;
    }
    return length;
}

// console.log(calcLength()) // should be 41

export {replaceLinks}
