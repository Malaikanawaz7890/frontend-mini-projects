/* =================================
   QUIZ QUESTIONS
================================= */

var questions = [

    {
        question: "Which language is used to structure a web page?",
        options: [
            "CSS",
            "HTML",
            "JavaScript",
            "Python"
        ],
        answer: "HTML"
    },

    {
        question: "Which language is mainly used for styling web pages?",
        options: [
            "HTML",
            "JavaScript",
            "CSS",
            "Python"
        ],
        answer: "CSS"
    },

    {
        question: "Which keyword is used to declare a variable in ES5?",
        options: [
            "let",
            "const",
            "var",
            "define"
        ],
        answer: "var"
    },

    {
        question: "Which method adds a new item to the end of an array?",
        options: [
            "pop()",
            "push()",
            "shift()",
            "slice()"
        ],
        answer: "push()"
    },

    {
        question: "Which CSS property changes the text color?",
        options: [
            "background",
            "font-color",
            "color",
            "text-color"
        ],
        answer: "color"
    },

    {
        question: "Which CSS layout system is useful for one-dimensional layouts?",
        options: [
            "Grid",
            "Flexbox",
            "Float",
            "Table"
        ],
        answer: "Flexbox"
    },

    {
        question: "Which method selects an element using its ID?",
        options: [
            "querySelectorAll()",
            "getElementById()",
            "getElementsByClassName()",
            "selectId()"
        ],
        answer: "getElementById()"
    },

    {
        question: "Which browser storage keeps data after the browser is closed?",
        options: [
            "sessionStorage",
            "localStorage",
            "temporaryStorage",
            "memoryStorage"
        ],
        answer: "localStorage"
    },

    {
        question: "Which symbol is used for a single-line comment in JavaScript?",
        options: [
            "<!--",
            "//",
            "/*",
            "#"
        ],
        answer: "//"
    },

    {
        question: "What does CSS stand for?",
        options: [
            "Creative Style System",
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Colorful Style Sheets"
        ],
        answer: "Cascading Style Sheets"
    }

];


/* =================================
   VARIABLES
================================= */

var currentQuestion = 0;

var score = 0;

var answered = false;

var seconds = 0;

var timerInterval;


/* =================================
   ELEMENTS
================================= */

var questionElement =
    document.getElementById("question");

var optionsElement =
    document.getElementById("options");

var questionNumberElement =
    document.getElementById("questionNumber");

var progressElement =
    document.getElementById("progress");

var progressPercentElement =
    document.getElementById("progressPercent");

var progressNumberElement =
    document.getElementById("progressNumber");

var scoreElement =
    document.getElementById("score");

var feedbackElement =
    document.getElementById("feedback");

var nextButton =
    document.getElementById("nextBtn");

var navigatorElement =
    document.getElementById("questionNavigator");

var bookmarkButton =
    document.getElementById("bookmarkBtn");

var quizCard =
    document.querySelector(".quiz-card");

var motivation =
    document.querySelector(".motivation");

var resultCard =
    document.getElementById("resultCard");

var finalScoreElement =
    document.getElementById("finalScore");

var resultMessage =
    document.getElementById("resultMessage");

var restartButton =
    document.getElementById("restartBtn");

var timerElement =
    document.getElementById("timer");


/* =================================
   TIMER
================================= */

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(
        function () {

            seconds++;

            var minutes =
                Math.floor(seconds / 60);

            var remainingSeconds =
                seconds % 60;


            if (minutes < 10) {
                minutes = "0" + minutes;
            }


            if (remainingSeconds < 10) {
                remainingSeconds =
                    "0" + remainingSeconds;
            }


            timerElement.textContent =
                minutes + ":" +
                remainingSeconds;

        },
        1000
    );

}


/* =================================
   QUESTION NAVIGATOR
================================= */

function createNavigator() {

    navigatorElement.innerHTML = "";


    for (
        var i = 0;
        i < questions.length;
        i++
    ) {

        var number =
            document.createElement("button");


        number.className =
            "nav-number";


        number.textContent =
            i + 1;


        number.setAttribute(
            "data-question",
            i
        );


        if (i === currentQuestion) {

            number.classList.add(
                "current"
            );

        }


        number.addEventListener(
            "click",
            function () {

                var index =
                    parseInt(
                        this.getAttribute(
                            "data-question"
                        )
                    );


                if (index <= currentQuestion) {

                    currentQuestion =
                        index;

                    loadQuestion();

                }

            }
        );


        navigatorElement.appendChild(number);

    }

}


/* =================================
   UPDATE NAVIGATOR
================================= */

function updateNavigator() {

    var numbers =
        document.querySelectorAll(
            ".nav-number"
        );


    for (
        var i = 0;
        i < numbers.length;
        i++
    ) {

        numbers[i].classList.remove(
            "current"
        );


        if (
            i < currentQuestion
        ) {

            numbers[i].classList.add(
                "answered"
            );

        }


        if (
            i === currentQuestion
        ) {

            numbers[i].classList.add(
                "current"
            );

        }

    }

}


/* =================================
   LOAD QUESTION
================================= */

function loadQuestion() {

    answered = false;

    nextButton.disabled = true;

    nextButton.textContent =
        "Next Question →";


    feedbackElement.textContent = "";

    feedbackElement.className =
        "feedback";


    var question =
        questions[currentQuestion];


    questionElement.textContent =
        question.question;


    questionNumberElement.textContent =
        currentQuestion + 1;


    progressNumberElement.textContent =
        currentQuestion + 1;


    var percentage =
        (
            (currentQuestion + 1)
            /
            questions.length
        ) * 100;


    progressElement.style.width =
        percentage + "%";


    progressPercentElement.textContent =
        percentage + "%";


    optionsElement.innerHTML = "";


    for (
        var i = 0;
        i < question.options.length;
        i++
    ) {

        var button =
            document.createElement("button");


        button.className =
            "option";


        button.textContent =
            question.options[i];


        button.setAttribute(
            "data-answer",
            question.options[i]
        );


        button.addEventListener(
            "click",
            checkAnswer
        );


        optionsElement.appendChild(
            button
        );

    }


    createNavigator();

    updateNavigator();

}


/* =================================
   CHECK ANSWER
================================= */

function checkAnswer() {

    if (answered) {
        return;
    }


    answered = true;


    var selectedAnswer =
        this.getAttribute(
            "data-answer"
        );


    var correctAnswer =
        questions[currentQuestion].answer;


    var allOptions =
        document.querySelectorAll(
            ".option"
        );


    for (
        var i = 0;
        i < allOptions.length;
        i++
    ) {

        allOptions[i].disabled =
            true;


        if (
            allOptions[i]
                .getAttribute(
                    "data-answer"
                )
            ===
            correctAnswer
        ) {

            allOptions[i]
                .classList.add(
                    "correct"
                );

        }

    }


    if (
        selectedAnswer ===
        correctAnswer
    ) {

        this.classList.add(
            "correct"
        );


        score++;


        scoreElement.textContent =
            score;


        feedbackElement.textContent =
            "✓ Correct! Great job!";


        feedbackElement.className =
            "feedback correct";

    } else {

        this.classList.add(
            "wrong"
        );


        feedbackElement.textContent =
            "✕ Incorrect! Correct answer: "
            +
            correctAnswer;


        feedbackElement.className =
            "feedback wrong";

    }


    nextButton.disabled = false;


    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextButton.textContent =
            "View Result →";

    }

}


/* =================================
   NEXT BUTTON
================================= */

nextButton.addEventListener(
    "click",
    function () {

        if (!answered) {
            return;
        }


        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            loadQuestion();

        } else {

            showResult();

        }

    }
);


/* =================================
   BOOKMARK
================================= */

bookmarkButton.addEventListener(
    "click",
    function () {

        this.classList.toggle(
            "active"
        );


        if (
            this.classList.contains(
                "active"
            )
        ) {

            this.textContent = "♥";

        } else {

            this.textContent = "♡";

        }

    }
);


/* =================================
   SHOW RESULT
================================= */

function showResult() {

    clearInterval(timerInterval);


    quizCard.classList.add(
        "hidden"
    );


    motivation.classList.add(
        "hidden"
    );


    resultCard.classList.remove(
        "hidden"
    );


    finalScoreElement.textContent =
        score;


    var percentage =
        (
            score /
            questions.length
        ) * 100;


    if (percentage === 100) {

        resultMessage.textContent =
            "Perfect score! You're a QuizMaster! 🏆";

    } else if (percentage >= 70) {

        resultMessage.textContent =
            "Excellent work! Keep learning and growing! 🎉";

    } else if (percentage >= 50) {

        resultMessage.textContent =
            "Good effort! Keep practicing to improve. 💪";

    } else {

        resultMessage.textContent =
            "Keep practicing! You can do better next time. 🚀";

    }

}


/* =================================
   RESTART QUIZ
================================= */

restartButton.addEventListener(
    "click",
    function () {

        currentQuestion = 0;

        score = 0;

        seconds = 0;


        scoreElement.textContent =
            "0";


        timerElement.textContent =
            "00:00";


        resultCard.classList.add(
            "hidden"
        );


        quizCard.classList.remove(
            "hidden"
        );


        motivation.classList.remove(
            "hidden"
        );


        bookmarkButton.classList.remove(
            "active"
        );


        bookmarkButton.textContent =
            "♡";


        loadQuestion();

        startTimer();

    }
);


/* =================================
   START
================================= */

loadQuestion();

startTimer();