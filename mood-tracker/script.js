var selectedMood = "";

var entries =
    JSON.parse(localStorage.getItem("moodEntries")) || [];


var moodEmojis = {

    Happy: "😊",

    Good: "🙂",

    Sad: "😔",

    Angry: "😤"

};


/* ================= DATE ================= */

var today = new Date();


var dayName = today.toLocaleDateString(
    "en-US",
    {
        weekday: "long"
    }
);


var formattedDate = today.toLocaleDateString(
    "en-US",
    {
        day: "numeric",
        month: "short",
        year: "numeric"
    }
);


document.getElementById("dayName").textContent =
    dayName;


document.getElementById("currentDate").textContent =
    formattedDate;


/* ================= MOOD SELECTION ================= */

var moodButtons =
    document.querySelectorAll(".mood");


for (var i = 0; i < moodButtons.length; i++) {

    moodButtons[i].addEventListener(
        "click",
        function () {

            for (
                var j = 0;
                j < moodButtons.length;
                j++
            ) {

                moodButtons[j]
                    .classList
                    .remove("active");
            }


            this.classList.add("active");


            selectedMood =
                this.getAttribute("data-mood");


            document.getElementById(
                "selectedMood"
            ).textContent = selectedMood;

        }
    );
}


/* ================= SAVE MOOD ================= */

document.getElementById("saveMood")
    .addEventListener(
        "click",
        function () {

            var note =
                document
                .getElementById("moodNote")
                .value
                .trim();


            if (selectedMood === "") {

                alert(
                    "Please choose your mood first."
                );

                return;
            }


            if (note === "") {

                alert(
                    "Please write a short note about your day."
                );

                return;
            }


            var newEntry = {

                id: Date.now(),

                mood: selectedMood,

                note: note,

                date: formattedDate

            };


            entries.unshift(newEntry);


            localStorage.setItem(
                "moodEntries",
                JSON.stringify(entries)
            );


            document.getElementById(
                "moodNote"
            ).value = "";


            selectedMood = "";


            document.getElementById(
                "selectedMood"
            ).textContent = "None";


            for (
                var k = 0;
                k < moodButtons.length;
                k++
            ) {

                moodButtons[k]
                    .classList
                    .remove("active");
            }


            renderEntries();

            updateStats();


            alert(
                "Your mood has been saved! 💜"
            );

        }
    );


/* ================= RENDER ENTRIES ================= */

function renderEntries() {

    var entriesList =
        document.getElementById("entriesList");


    if (entries.length === 0) {

        entriesList.innerHTML = `
        
            <div class="empty">

                <span>🌷</span>

                <p>No mood entries yet.</p>

                <small>
                    Start by adding today's mood.
                </small>

            </div>
        
        `;

        return;
    }


    entriesList.innerHTML = "";


    for (
        var i = 0;
        i < entries.length;
        i++
    ) {

        var entry = entries[i];


        var card =
            document.createElement("div");


        card.className = "entry-card";


        card.innerHTML = `

            <div class="entry-left">

                <div class="entry-emoji">
                    ${moodEmojis[entry.mood]}
                </div>

                <div class="entry-info">

                    <h3>
                        ${entry.mood}
                    </h3>

                    <p>
                        ${entry.note}
                    </p>

                    <span>
                        ${entry.date}
                    </span>

                </div>

            </div>


            <button
                class="delete-btn"
                onclick="deleteEntry(${entry.id})"
            >
                ×
            </button>

        `;


        entriesList.appendChild(card);
    }
}


/* ================= DELETE ================= */

function deleteEntry(id) {

    entries =
        entries.filter(
            function (entry) {

                return entry.id !== id;

            }
        );


    localStorage.setItem(
        "moodEntries",
        JSON.stringify(entries)
    );


    renderEntries();

    updateStats();
}


/* ================= STATISTICS ================= */

function updateStats() {

    var happy = 0;

    var good = 0;

    var sad = 0;

    var angry = 0;


    for (
        var i = 0;
        i < entries.length;
        i++
    ) {

        if (entries[i].mood === "Happy") {

            happy++;

        }


        if (entries[i].mood === "Good") {

            good++;

        }


        if (entries[i].mood === "Sad") {

            sad++;

        }


        if (entries[i].mood === "Angry") {

            angry++;

        }
    }


    document.getElementById(
        "happyCount"
    ).textContent = happy;


    document.getElementById(
        "goodCount"
    ).textContent = good;


    document.getElementById(
        "sadCount"
    ).textContent = sad;


    document.getElementById(
        "angryCount"
    ).textContent = angry;


    document.getElementById(
        "totalEntries"
    ).textContent =
        entries.length +
        (
            entries.length === 1
                ? " Entry"
                : " Entries"
        );
}


/* ================= INITIAL LOAD ================= */

renderEntries();

updateStats();