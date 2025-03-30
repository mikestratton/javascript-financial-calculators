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