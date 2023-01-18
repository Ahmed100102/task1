function add() {
  var x = document.getElementById("x").value;
  var y = document.getElementById("y").value;
  var result = parseFloat(x) + parseFloat(y);
  document.getElementById("result").innerHTML = result;
}

function subtract() {
  var x = document.getElementById("x").value;
  var y = document.getElementById("y").value;
  var result = parseFloat(x) - parseFloat(y);
  document.getElementById("result").innerHTML = result;
}

function multiply() {
  var x = document.getElementById("x").value;
  var y = document.getElementById("y").value;
  var result = parseFloat(x) * parseFloat(y);
  document.getElementById("result").innerHTML = result;
}

function divide() {
  var x = document.getElementById("x").value;
  var y = document.getElementById("y").value;
  var z = document.getElementById("result");
  var result = parseFloat(x) / parseFloat(y);
  document.getElementById("result").innerHTML = result;
}
