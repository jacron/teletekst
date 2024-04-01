function keydownListener(e) {
    switch (e.key) {
        case 'F1':
            document.getElementById('fastText1Red').click();
            break;
        case 'F2':
            document.getElementById('fastText2Green').click();
            break;
        case 'F3':
            document.getElementById('fastText3Yellow').click();
            break;
        case 'F4':
            document.getElementById('fastText4Blue').click();
            break;
        case 'ArrowDown':
            e.preventDefault();
            navigateDown();
            break;
        case 'ArrowUp':
            e.preventDefault();
            navigateUp();
            break;
        case 'Home':
            e.preventDefault();
            navigateFirst();
            break;
        case 'End':
            e.preventDefault();
            navigateLast();
            break;
        case 'Enter':
            navigateInto(e);
            break;
        case 'Escape':
            tryClose();
            break
        default:
            navigateByCapital(e);
            break
    }
}

