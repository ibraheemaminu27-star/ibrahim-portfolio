const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "0";
let previousValue = "";
let operator = null;
let resetDisplay = false;


// ===============================
// UPDATE DISPLAY
// ===============================

function updateDisplay() {
    currentDisplay.textContent = currentValue;

    if (previousValue && operator) {
        previousDisplay.textContent =
            `${previousValue} ${operator}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// ===============================
// ADD NUMBER
// ===============================

function addNumber(number) {

    if (resetDisplay) {
        currentValue = "0";
        resetDisplay = false;
    }

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


// ===============================
// CHOOSE OPERATOR
// ===============================

function chooseOperator(selectedOperator) {

    if (operator !== null && !resetDisplay) {
        calculate();
    }

    previousValue = currentValue;

    operator = selectedOperator;

    resetDisplay = true;

    updateDisplay();
}


// ===============================
// CALCULATE
// ===============================

function calculate() {

    if (
        operator === null ||
        previousValue === ""
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                operator = null;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    currentValue = String(
        Number(result.toFixed(10))
    );

    previousValue = "";

    operator = null;

    resetDisplay = true;

    updateDisplay();
}


// ===============================
// CLEAR
// ===============================

function clearCalculator() {

    currentValue = "0";

    previousValue = "";

    operator = null;

    resetDisplay = false;

    updateDisplay();
}


// ===============================
// DELETE
// ===============================

function deleteNumber() {

    if (
        currentValue === "Error" ||
        currentValue.length === 1
    ) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}


// ===============================
// PERCENT
// ===============================

function percentage() {

    const number = parseFloat(currentValue);

    if (isNaN(number)) {
        return;
    }

    currentValue = String(number / 100);

    updateDisplay();
}


// ===============================
// BUTTON EVENTS
// ===============================

numberButtons.forEach((button) => {

    button.addEventListener("click", () => {

        addNumber(
            button.dataset.number
        );

    });

});


operatorButtons.forEach((button) => {

    button.addEventListener("click", () => {

        chooseOperator(
            button.dataset.operator
        );

    });

});


actionButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteNumber();
        }

        if (action === "percent") {
            percentage();
        }

        if (action === "calculate") {
            calculate();
        }

    });

});


// ===============================
// KEYBOARD SUPPORT
// ===============================

document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        addNumber(key);
    }

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        let selectedOperator = key;

        if (key === "*") {
            selectedOperator = "×";
        }

        if (key === "/") {
            selectedOperator = "÷";
        }

        chooseOperator(selectedOperator);
    }

    if (key === "Enter" || key === "=") {
        calculate();
    }

    if (key === "Backspace") {
        deleteNumber();
    }

    if (key === "Escape") {
        clearCalculator();
    }

    if (key === "%") {
        percentage();
    }

});
