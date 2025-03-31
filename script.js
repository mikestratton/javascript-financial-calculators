const display = document.getElementById("display");

function appendToDisplay(input){
    display.value += input;
}

function clearDisplay(){
    display.value = "";
}

function calculate(){
    try{
        display.value = eval(display.value);
    }
    catch(e){
        display.value = "Error";
    }

}

function calculateAPR(principal, monthlyPayment, numberOfPayments) {
    // Initial guess for the monthly interest rate
    let monthlyInterestRate = 0.1 / 12; // 10% annual rate as a starting point

    // Tolerance for convergence
    const tolerance = 0.000001;

    // Maximum number of iterations to prevent infinite loops
    const maxIterations = 1000;

    let apr = 0;
    let currentGuess = 0;
    let previousGuess = 0;

    for (let i = 0; i < maxIterations; i++) {
        previousGuess = monthlyInterestRate;

        // Calculate the present value of the annuity
        let presentValue = 0;
        for (let j = 1; j <= numberOfPayments; j++) {
            presentValue += monthlyPayment / Math.pow(1 + monthlyInterestRate, j);
        }

        // Calculate the difference between the present value and the principal
        const difference = presentValue - principal;

        // If the difference is within the tolerance, we have found the monthly interest rate
        if (Math.abs(difference) < tolerance) {
            apr = monthlyInterestRate * 12;
            return apr * 100; // Return APR as a percentage
        }

        // Use Newton's method to improve the guess
        let derivative = 0;
        for (let j = 1; j <= numberOfPayments; j++) {
            derivative -= (j * monthlyPayment) / Math.pow(1 + monthlyInterestRate, j + 1);
        }

        monthlyInterestRate -= difference / derivative;

        // Check for convergence or divergence
        if (Math.abs(monthlyInterestRate - previousGuess) < tolerance) {
            apr = monthlyInterestRate * 12;
            return apr * 100; // Return APR as a percentage
        }

        // Prevent negative interest rates
        if (monthlyInterestRate < 0) {
            monthlyInterestRate = previousGuess / 2; //reduce guess to prevent negatives.
        }
    }

    // If we reach the maximum number of iterations, we have not found a solution
    return null;
}

// Example usage:
const principal = 10000;
const monthlyPayment = 300;
const numberOfPayments = 36;

const apr = calculateAPR(principal, monthlyPayment, numberOfPayments);

if (apr !== null) {
    console.log("APR:", apr.toFixed(2) + "%");
} else {
    console.log("Could not calculate APR.");
}

//HTML Example.

function displayAPR(){

    const principalHTML = document.getElementById("principal").value;
    const monthlyPaymentHTML = document.getElementById("monthlyPayment").value;
    const numberOfPaymentsHTML = document.getElementById("payments").value;

    const aprResult = calculateAPR(parseFloat(principalHTML), parseFloat(monthlyPaymentHTML), parseInt(numberOfPaymentsHTML));

    if (aprResult !== null) {
        document.getElementById("result").innerHTML = "APR: " + aprResult.toFixed(2) + "%";
    } else {
        document.getElementById("result").innerHTML = "Could not calculate APR.";
    }
}

function calculateMortgage(principal, interestRate, loanTerm) {
    // Convert annual interest rate to monthly
    const monthlyInterestRate = interestRate / 100 / 12;

    // Convert loan term to months
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly mortgage payment
    const monthlyPayment =
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate total payment
    const totalPayment = monthlyPayment * numberOfPayments;

    // Calculate total interest paid
    const totalInterest = totalPayment - principal;

    return {
        monthlyPayment: monthlyPayment,
        totalPayment: totalPayment,
        totalInterest: totalInterest,
    };
}

function displayMortgageResults() {
    const principal = parseFloat(document.getElementById("principal").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value);
    const loanTerm = parseInt(document.getElementById("loanTerm").value);

    if (isNaN(principal) || isNaN(interestRate) || isNaN(loanTerm) || principal <= 0 || interestRate < 0 || loanTerm <= 0) {
        document.getElementById("results").innerHTML = "<p style='color:red;'>Please enter valid positive numbers.</p>";
        return;
    }

    const results = calculateMortgage(principal, interestRate, loanTerm);

    if (results) {
        document.getElementById("results").innerHTML = `
      <p>Monthly Payment: $${results.monthlyPayment.toFixed(2)}</p>
      <p>Total Payment: $${results.totalPayment.toFixed(2)}</p>
      <p>Total Interest Paid: $${results.totalInterest.toFixed(2)}</p>
    `;
    } else {
        document.getElementById("results").innerHTML = "<p>Invalid input.</p>";
    }
}

function clearResults(){
    document.getElementById("principal").value = "";
    document.getElementById("interestRate").value = "";
    document.getElementById("loanTerm").value = "";
    document.getElementById("results").innerHTML = "";
}

function calculateDebtToIncomeRatio(monthlyDebt, monthlyIncome) {
    if (isNaN(monthlyDebt) || isNaN(monthlyIncome) || monthlyIncome === 0) {
        return "Invalid input"; // Handle invalid input
    }

    const debtToIncomeRatio = (monthlyDebt / monthlyIncome) * 100;
    return debtToIncomeRatio.toFixed(2); // Return ratio as a percentage with 2 decimal places
}

function displayDtiRatio() {
    const monthlyDebtInput = document.getElementById("monthlyDebt").value;
    const monthlyIncomeInput = document.getElementById("monthlyIncome").value;

    const monthlyDebt = parseFloat(monthlyDebtInput);
    const monthlyIncome = parseFloat(monthlyIncomeInput);

    const dtiRatio = calculateDebtToIncomeRatio(monthlyDebt, monthlyIncome);

    const resultElement = document.getElementById("result");

    if (typeof dtiRatio === "string") {
        resultElement.textContent = dtiRatio; // Display error message
    } else {
        resultElement.textContent = "Debt-to-Income Ratio: " + dtiRatio + "%";
    }
}

function clearDti(){
    document.getElementById("monthlyDebt").value = "";
    document.getElementById("monthlyIncome").value = "";
    document.getElementById("result").textContent = "";
}

function calculateROI(investment, gain) {
    if (isNaN(investment) || isNaN(gain) || investment === 0) {
        return "Invalid input"; // Handle invalid input
    }

    const roi = ((gain - investment) / investment) * 100;
    return roi.toFixed(2); // Return ROI as a percentage with 2 decimal places
}

function displayROI() {
    const investmentInput = document.getElementById("investment").value;
    const gainInput = document.getElementById("gain").value;

    const investment = parseFloat(investmentInput);
    const gain = parseFloat(gainInput);

    const roi = calculateROI(investment, gain);

    const resultElement = document.getElementById("result");

    if (typeof roi === "string") {
        resultElement.textContent = roi; // Display error message
    } else {
        resultElement.textContent = "Return on Investment (ROI): " + roi + "%";
    }
}

function clearROI(){
    document.getElementById("investment").value = "";
    document.getElementById("gain").value = "";
    document.getElementById("result").textContent = "";
}

function calculateInterestRate() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100; // Convert percentage to decimal
    const time = parseFloat(document.getElementById('time').value);
    const compoundFrequency = parseInt(document.getElementById('compoundFrequency').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(compoundFrequency) || principal < 0 || rate < 0 || time < 0 || (compoundFrequency < 0)) {
        document.getElementById('result').innerHTML = "<p style='color:red;'>Invalid input.</p>";
        return;
    }

    let amount, interest;

    if (compoundFrequency === 0) { // Simple interest
        amount = principal * (1 + rate * time);
        interest = principal * rate * time;
    } else { // Compound interest
        amount = principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time);
        interest = amount - principal;
    }

    document.getElementById('result').innerHTML = `
                <p>Final Amount: $${amount.toFixed(2)}</p>
                <p>Total Interest: $${interest.toFixed(2)}</p>
            `;
}

// script.js

document.getElementById('calculateButton').addEventListener('click', calculateCurrentRatio);

function calculateCurrentRatio() {
    const currentAssets = parseFloat(document.getElementById('currentAssets').value);
    const currentLiabilities = parseFloat(document.getElementById('currentLiabilities').value);
    const resultDiv = document.getElementById('result');

    if (isNaN(currentAssets) || isNaN(currentLiabilities)) {
        resultDiv.innerHTML = "<p style='color:red;'>Please enter valid numbers.</p>";
        return;
    }

    if (currentLiabilities === 0) {
        resultDiv.innerHTML = "<p style='color:red;'>Current liabilities cannot be zero.</p>";
        return;
    }

    const currentRatio = currentAssets / currentLiabilities;

    resultDiv.innerHTML = `<p>Current Ratio: ${currentRatio.toFixed(2)}</p>`;
}

document.getElementById('calculateButton').addEventListener('click', calculateQuickRatio);

function calculateQuickRatio() {
    const currentAssets = parseFloat(document.getElementById('currentAssets').value);
    const inventory = parseFloat(document.getElementById('inventory').value);
    const currentLiabilities = parseFloat(document.getElementById('currentLiabilities').value);
    const resultDiv = document.getElementById('result');

    if (isNaN(currentAssets) || isNaN(inventory) || isNaN(currentLiabilities)) {
        resultDiv.innerHTML = "<p style='color:red;'>Please enter valid numbers.</p>";
        return;
    }

    if (currentLiabilities === 0) {
        resultDiv.innerHTML = "<p style='color:red;'>Current liabilities cannot be zero.</p>";
        return;
    }

    const quickRatio = (currentAssets - inventory) / currentLiabilities;

    resultDiv.innerHTML = `<p>Quick Ratio: ${quickRatio.toFixed(2)}:1</p>`; // Corrected output format
}