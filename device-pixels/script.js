'use strict';

var boxA = document.getElementById('box_a');
var boxAInfo = document.getElementById('box_a_info');var resInfo = document.getElementById('resolution_info');

resInfo.innerText = window.devicePixelRatio ? devicePixelRatio : '(window.devicePixelRatio is undefined!)';

var computedStyle = getComputedStyle(boxA);
var bcr = boxA.getBoundingClientRect();

boxAInfo.innerText = 'from getComputedStyle():\n    height: ' + computedStyle.height + '\n    width: ' + computedStyle.width + '\nfrom getBoundingClientRect():\n    height: ' + bcr.height + '\n    width: ' + bcr.width + '\nDevice pixels:\n    vertical: ' + (window.devicePixelRatio ? devicePixelRatio : 1) * bcr.height + '\n    horizontal: ' + (window.devicePixelRatio ? devicePixelRatio : 1) * bcr.width;