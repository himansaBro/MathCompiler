let calculatorBox = document.getElementById("calculator-screen");
let answerBox = document.getElementById("answerBox");
let flowBox = document.getElementById("flowBox");

calculatorBox.addEventListener("keydown", function (event) {
    if (!"1234567890()+-*/.".includes(event.key)) {
        if (event.key !== "Backspace" && event.key !== "Delete") {
            event.preventDefault();
        }
    } else {
        let currentValue = calculatorBox.value;
        let pressedKey = event.key;
        let lastChar = currentValue[currentValue.length - 1];

        // Prevent two operators in a row
        if ("+-*/".includes(pressedKey) && "+-*/".includes(lastChar)) {
            event.preventDefault();
        }
        if ("+-*/".includes(pressedKey) && currentValue === "") {
            event.preventDefault();
        }
        if ("+-*/".includes(pressedKey) && lastChar === "(") {
            event.preventDefault();
        }
        if ("+-*/".includes(lastChar) && pressedKey === ")") {
            event.preventDefault();
        }
    }
    if (event.key === "Enter") {
        let ival = calculatorBox.value;
        if (ival.length > 2) {
            let r = CalculateResult(ival);
            let answer = r.answer;
            let dflow = r.flow.replaceAll("\n", "<br>");
            flowBox.innerHTML = dflow;
            answerBox.innerHTML = answer;
        }
    } else {
        console.log(event.key);
    }

});

