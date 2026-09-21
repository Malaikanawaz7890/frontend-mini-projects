/* =========================
   LOADER
========================= */

window.addEventListener("load", function () {

    var loader = document.getElementById("loader");

    setTimeout(function () {
        loader.style.display = "none";
    }, 800);

});


/* =========================
   MOBILE MENU
========================= */

var menuBtn = document.getElementById("menuBtn");
var navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("show");

});


var navItems = navLinks.getElementsByTagName("a");

for (var i = 0; i < navItems.length; i++) {

    navItems[i].addEventListener("click", function () {

        navLinks.classList.remove("show");

    });

}


/* =========================
   WORKOUT FILTER
========================= */

var filterButtons =
    document.getElementsByClassName("filter-btn");

var workoutCards =
    document.getElementsByClassName("workout-card");

var currentCategory = "all";


function filterWorkouts() {

    for (var i = 0; i < workoutCards.length; i++) {

        var category =
            workoutCards[i].getAttribute("data-category");

        if (
            currentCategory === "all" ||
            category === currentCategory
        ) {

            workoutCards[i].style.display = "block";

        } else {

            workoutCards[i].style.display = "none";

        }

    }

}


for (var i = 0; i < filterButtons.length; i++) {

    filterButtons[i].addEventListener("click", function () {

        for (var j = 0; j < filterButtons.length; j++) {

            filterButtons[j].classList.remove("active");

        }

        this.classList.add("active");

        currentCategory =
            this.getAttribute("data-category");

        filterWorkouts();

    });

}


/* =========================
   WORKOUT TIMER
========================= */

var startButtons =
    document.getElementsByClassName("start-btn");

var timerOverlay =
    document.getElementById("timerOverlay");

var timerWorkout =
    document.getElementById("timerWorkout");

var timerDisplay =
    document.getElementById("timerDisplay");

var closeTimer =
    document.getElementById("closeTimer");

var pauseTimer =
    document.getElementById("pauseTimer");

var stopTimer =
    document.getElementById("stopTimer");


var timerSeconds = 0;
var timerInterval = null;
var timerPaused = false;


function updateTimerDisplay() {

    var minutes =
        Math.floor(timerSeconds / 60);

    var seconds =
        timerSeconds % 60;

    var minuteText = minutes;

    var secondText = seconds;

    if (minutes < 10) {
        minuteText = "0" + minutes;
    }

    if (seconds < 10) {
        secondText = "0" + seconds;
    }

    timerDisplay.innerHTML =
        minuteText + ":" + secondText;

}


function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(function () {

        if (!timerPaused && timerSeconds > 0) {

            timerSeconds--;

            updateTimerDisplay();

        }

        if (timerSeconds <= 0) {

            clearInterval(timerInterval);

            alert("Workout complete! Great job! 💪");

        }

    }, 1000);

}


for (var i = 0; i < startButtons.length; i++) {

    startButtons[i].addEventListener("click", function () {

        var workoutName =
            this.getAttribute("data-workout");

        var duration =
            parseInt(this.getAttribute("data-duration"));

        timerWorkout.innerHTML = workoutName;

        timerSeconds = duration * 60;

        timerPaused = false;

        pauseTimer.innerHTML = "Pause";

        updateTimerDisplay();

        timerOverlay.classList.add("show");

        startTimer();

    });

}


pauseTimer.addEventListener("click", function () {

    timerPaused = !timerPaused;

    if (timerPaused) {

        pauseTimer.innerHTML = "Resume";

    } else {

        pauseTimer.innerHTML = "Pause";

    }

});


function closeTimerBox() {

    clearInterval(timerInterval);

    timerOverlay.classList.remove("show");

}


closeTimer.addEventListener("click", function () {

    closeTimerBox();

});


stopTimer.addEventListener("click", function () {

    closeTimerBox();

});


timerOverlay.addEventListener("click", function (event) {

    if (event.target === timerOverlay) {

        closeTimerBox();

    }

});


/* =========================
   BMI CALCULATOR
========================= */

var bmiForm =
    document.getElementById("bmiForm");

var bmiResult =
    document.getElementById("bmiResult");


bmiForm.addEventListener("submit", function (event) {

    event.preventDefault();

    var weight =
        parseFloat(document.getElementById("weight").value);

    var height =
        parseFloat(document.getElementById("height").value);

    if (weight <= 0 || height <= 0) {

        bmiResult.innerHTML =
            "Please enter valid values.";

        return;

    }

    var heightMeter =
        height / 100;

    var bmi =
        weight / (heightMeter * heightMeter);

    bmi = bmi.toFixed(1);

    var category = "";

    if (bmi < 18.5) {

        category = "Underweight";

    } else if (bmi < 25) {

        category = "Normal Weight";

    } else if (bmi < 30) {

        category = "Overweight";

    } else {

        category = "Obesity";

    }

    bmiResult.innerHTML =
        "Your BMI is <strong>" +
        bmi +
        "</strong> — " +
        category;

});


/* =========================
   WEEKLY PLANNER
========================= */

var daySelects =
    document.getElementsByClassName("day-select");

var savePlan =
    document.getElementById("savePlan");

var planMessage =
    document.getElementById("planMessage");


var savedPlan =
    localStorage.getItem("fitTrackPlan");


if (savedPlan) {

    var planData =
        JSON.parse(savedPlan);

    for (var i = 0; i < daySelects.length; i++) {

        if (planData[i]) {

            daySelects[i].value =
                planData[i];

        }

    }

}


savePlan.addEventListener("click", function () {

    var plan = [];

    for (var i = 0; i < daySelects.length; i++) {

        plan.push(daySelects[i].value);

    }

    localStorage.setItem(
        "fitTrackPlan",
        JSON.stringify(plan)
    );

    planMessage.innerHTML =
        "✓ Your weekly workout plan has been saved!";

});


/* =========================
   CONTACT FORM
========================= */

var contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    var name =
        document.getElementById("contactName").value;

    alert(
        "Thank you " +
        name +
        "! Your message has been sent."
    );

    contactForm.reset();

});