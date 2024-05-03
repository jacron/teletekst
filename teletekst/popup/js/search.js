const myTypes = {
    POPUP1: 'popup1',
    POPUP2: 'popup2',
    SIDE_PANE: 'side-pane'
}

function getMyType() {
    const search = document.location.search;
    if (search.length === 0) {
        return myTypes.SIDE_PANE;
    } else if (search === '?popup2') {
        return myTypes.POPUP2;
    } else {
        return myTypes.POPUP1;
    }
}

export {getMyType, myTypes}
