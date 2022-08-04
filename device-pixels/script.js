const boxA = document.getElementById('box_a');
const boxAInfo = document.getElementById('box_a_info');const resInfo = document.getElementById('resolution_info');

resInfo.innerText = window.devicePixelRatio ? devicePixelRatio : '(window.devicePixelRatio is undefined!)';

const computedStyle = getComputedStyle(boxA);
const bcr = boxA.getBoundingClientRect();

boxAInfo.innerText =
`from getComputedStyle():
    height: ${computedStyle.height}
    width: ${computedStyle.width}
fromgetBoundingClientRect():
    height: ${bcr.height}
    width: ${bcr.width}
Device pixels:
    vertical: ${(window.devicePixelRatio ? devicePixelRatio : 1) * bcr.height}
    horizontal: ${(window.devicePixelRatio ? devicePixelRatio : 1) * bcr.width}`;