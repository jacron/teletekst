function hackLinks() {
    const hacks = [
        ['fastText1Red', ' nieuws ', 101],
        ['fastText2Green', ' actualiteit ', 220],
        ['fastText3Yellow', ' documentaire ', 228],
        ['fastText4Blue', ' weer ', 702],
    ]
    for (const hack of hacks) {
        const link = document.getElementById(hack[0]);
        if (link) {
            link.textContent = hack[1];
            link.href = '/webplus?p=' + hack[2];
            link.classList.add('onderregel')
        }
    }
}

export {hackLinks}
