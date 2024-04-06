const teletekstHome = 'https://teletekst-data.nos.nl';
/* real url: https://nos.nl/teletekst#101_01 */

export const config = {
    teletekstHome,
    teletekstStart: teletekstHome + '/webplus/?p=101-1',
    teletekstPagina: teletekstHome + '/webplus/?p=',
    msgBlauwNietOproepbaar: 'Pagina\'s in blauw zijn niet oproepbaar',
    optionalLinks: [
        [' nieuws ', 101],
        [' actualiteit ', 220],
        [' documentaire ', 228],
        [' weer ', 702],
    ],
    useOptionalLinks: true,
    storageKey: {
        history: 'history',
        onderregel: 'onderregel'
    },
}
