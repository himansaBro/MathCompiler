let history = document.getElementById('Output');
let input = document.getElementById('codeSpan');
input.focus();

input.addEventListener("keydown", function (event) {
    if (!"1234567890()+-*/.".includes(event.key)) {
        if (event.key !== "Backspace" && event.key !== "Delete") {
            event.preventDefault();
        }
    } else {
        let currentValue = input?.innerText ?? "";
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
    if (event.key === 'Enter') {
        event.preventDefault();
        let command = input.innerText.trim();
        input.innerText="";
        if (command.length > 0) {
            let result = CalculateResult(command);
            let formattedFlow = result.flow.replaceAll("\n", "<br>");
            if (formattedFlow[0]=="<") {
                formattedFlow = formattedFlow.slice(4);
            }
            let Output = `<div>> ${command}</div><div>${formattedFlow}</div><div> Answer = ${result.answer}`;
            history.insertAdjacentHTML('beforeend', Output);
        }
    }
});