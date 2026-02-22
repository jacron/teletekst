const myTypes = {
    POPUP1: 'popup1',
    POPUP2: 'popup2',
}

function getMyType() {
    const search = document.location.search;
    if (search === '?popup2') {
        return myTypes.POPUP2;
    } else {
        return myTypes.POPUP1;
    }
}

export {getMyType, myTypes}
