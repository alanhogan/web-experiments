document.getElementById('generate').onclick = generate;

function generate() {
  var number = "";
  number += Math.round(1000000000000 * Math.random());
  while (number.length < 12) number = "0" + number;
  document.querySelector('output').innerText = number;
}

generate();