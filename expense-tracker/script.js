/* =========================
   VARIABLES
========================= */

var transactions = JSON.parse(
    localStorage.getItem("expenseFlowTransactions")
) || [];

var currentType = "expense";
var currentFilter = "all";


/* =========================
   ELEMENTS
========================= */

var form = document.getElementById("transactionForm");

var descriptionInput =
    document.getElementById("description");

var amountInput =
    document.getElementById("amount");

var categoryInput =
    document.getElementById("category");

var dateInput =
    document.getElementById("date");

var transactionList =
    document.getElementById("transactionList");

var balanceElement =
    document.getElementById("balance");

var incomeElement =
    document.getElementById("income");

var expenseElement =
    document.getElementById("expense");

var currentDateElement =
    document.getElementById("currentDate");


/* =========================
   CURRENT DATE
========================= */

var today = new Date();

var todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

dateInput.value = todayString;

currentDateElement.textContent =
    today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });


/* =========================
   TYPE BUTTONS
========================= */

var typeButtons =
    document.querySelectorAll(".type-btn");

for (var i = 0; i < typeButtons.length; i++) {

    typeButtons[i].addEventListener(
        "click",
        function () {

            for (var j = 0; j < typeButtons.length; j++) {
                typeButtons[j].classList.remove("active");
            }

            this.classList.add("active");

            currentType =
                this.getAttribute("data-type");

            if (currentType === "income") {
                categoryInput.value = "Salary";
            }

        }
    );
}


/* =========================
   ADD TRANSACTION
========================= */

form.addEventListener("submit", function (event) {

    event.preventDefault();

    var description =
        descriptionInput.value.trim();

    var amount =
        parseFloat(amountInput.value);

    var category =
        categoryInput.value;

    var date =
        dateInput.value;

    if (
        description === "" ||
        isNaN(amount) ||
        amount <= 0 ||
        date === ""
    ) {
        alert("Please enter valid transaction details.");
        return;
    }


    var transaction = {

        id: Date.now(),

        description: description,

        amount: amount,

        category: category,

        date: date,

        type: currentType

    };


    transactions.unshift(transaction);

    saveTransactions();

    updateDashboard();

    form.reset();

    dateInput.value = todayString;

    currentType = "expense";


    for (var k = 0; k < typeButtons.length; k++) {

        typeButtons[k].classList.remove("active");

        if (
            typeButtons[k].getAttribute("data-type") ===
            "expense"
        ) {
            typeButtons[k].classList.add("active");
        }
    }

});


/* =========================
   SAVE
========================= */

function saveTransactions() {

    localStorage.setItem(
        "expenseFlowTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard() {

    var totalIncome = 0;

    var totalExpense = 0;


    for (var i = 0; i < transactions.length; i++) {

        if (transactions[i].type === "income") {

            totalIncome += transactions[i].amount;

        } else {

            totalExpense += transactions[i].amount;

        }

    }


    var balance =
        totalIncome - totalExpense;


    balanceElement.textContent =
        formatMoney(balance);

    incomeElement.textContent =
        formatMoney(totalIncome);

    expenseElement.textContent =
        formatMoney(totalExpense);


    displayTransactions();

}


/* =========================
   DISPLAY TRANSACTIONS
========================= */

function displayTransactions() {

    var filteredTransactions = [];

    for (var i = 0; i < transactions.length; i++) {

        if (
            currentFilter === "all" ||
            transactions[i].type === currentFilter
        ) {

            filteredTransactions.push(
                transactions[i]
            );

        }

    }


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML =

            '<div class="empty-state">' +

                '<div class="empty-icon">$</div>' +

                '<h3>No transactions found</h3>' +

                '<p>Add a transaction to see it here.</p>' +

            '</div>';

        return;

    }


    transactionList.innerHTML = "";


    for (
        var j = 0;
        j < filteredTransactions.length;
        j++
    ) {

        var transaction =
            filteredTransactions[j];


        var icon =
            transaction.type === "income"
                ? "↗"
                : "↘";


        var sign =
            transaction.type === "income"
                ? "+"
                : "-";


        var amountClass =
            transaction.type;


        var formattedDate =
            formatDate(transaction.date);


        var transactionHTML =

            '<div class="transaction">' +

                '<div class="transaction-left">' +

                    '<div class="transaction-icon ' +
                    transaction.type +
                    '">' +

                        icon +

                    '</div>' +

                    '<div class="transaction-info">' +

                        '<h3>' +
                        escapeHTML(transaction.description) +
                        '</h3>' +

                        '<p>' +
                        escapeHTML(transaction.category) +
                        ' · ' +
                        formattedDate +
                        '</p>' +

                    '</div>' +

                '</div>' +


                '<div class="transaction-right">' +

                    '<span class="transaction-amount ' +
                    amountClass +
                    '">' +

                        sign +
                        formatMoney(transaction.amount) +

                    '</span>' +

                    '<button ' +
                    'class="delete-btn" ' +
                    'onclick="deleteTransaction(' +
                    transaction.id +
                    ')">' +

                        '✕' +

                    '</button>' +

                '</div>' +

            '</div>';


        transactionList.innerHTML +=
            transactionHTML;

    }

}


/* =========================
   DELETE
========================= */

function deleteTransaction(id) {

    var confirmed =
        confirm("Delete this transaction?");

    if (!confirmed) {
        return;
    }


    var newTransactions = [];


    for (var i = 0; i < transactions.length; i++) {

        if (transactions[i].id !== id) {

            newTransactions.push(
                transactions[i]
            );

        }

    }


    transactions = newTransactions;

    saveTransactions();

    updateDashboard();

}


/* =========================
   FILTERS
========================= */

var filterButtons =
    document.querySelectorAll(".filter");


for (var i = 0; i < filterButtons.length; i++) {

    filterButtons[i].addEventListener(
        "click",
        function () {

            for (var j = 0; j < filterButtons.length; j++) {

                filterButtons[j].classList.remove(
                    "active"
                );

            }


            this.classList.add("active");


            currentFilter =
                this.getAttribute("data-filter");


            displayTransactions();

        }
    );

}


/* =========================
   FORMAT MONEY
========================= */

function formatMoney(amount) {

    return "$" + amount.toFixed(2);

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(dateString) {

    var date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    var div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   INITIAL LOAD
========================= */

updateDashboard();