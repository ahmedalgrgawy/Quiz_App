// Selectors 

let countSpan = document.querySelector(".quiz-info .count span");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let resultsContainer = document.querySelector(".results");
let countDown = document.querySelector(".countdown")

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

// Functions

function getQ() {
    let myR = new XMLHttpRequest();

    myR.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            let Questions = JSON.parse(this.responseText);
            let QuestionsCount = Questions.length;
            console.log(QuestionsCount);

            // create Bullets & Set Q Count
            createB(QuestionsCount);

            // countdown start
            countdown(10, QuestionsCount)

            // add Qs Data
            addQuestionsData(Questions[currentIndex], QuestionsCount);

            // click on submit
            submitButton.onclick = () => {

                // right answer
                let rightAnswer = Questions[currentIndex].right_answer;

                // increaser index 
                currentIndex++;

                // check answer
                checkAnswer(rightAnswer, QuestionsCount)

                // remove Qs
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";

                addQuestionsData(Questions[currentIndex], QuestionsCount);

                // handle bullets
                handleBullets();

                // countdown start
                clearInterval(countDownInterval);
                countdown(10, QuestionsCount)


                // show result
                showResult(QuestionsCount);
            }

        }
    }

    myR.open('GET', "Questions.json", true);

    myR.send();
}
getQ()

function createB(num) {
    countSpan.innerHTML = num;

    // Create Bullets and Appening it
    for (let i = 0; i < num; i++) {
        let spanB = document.createElement("span");

        if (i === 0) {
            spanB.className = "on";
        }

        bulletsSpanContainer.appendChild(spanB);
    }

}

function addQuestionsData(q, count) {

    if (currentIndex < count) {
        // create h2 q title
        let QuestionTilte = document.createElement("h2");

        // create q text
        let QuestionText = document.createTextNode(q['title']);

        // apend text to title
        QuestionTilte.appendChild(QuestionText);

        // append title to quiz area
        quizArea.appendChild(QuestionTilte);

        //create the answer
        for (let i = 1; i <= 4; i++) {
            // create main answer
            let mainDiv = document.createElement("div");

            // add class to main div
            mainDiv.className = "answer";

            // create radio input
            let radioInput = document.createElement("input")

            // add type and name and id and data-attr
            radioInput.name = "Questions";
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = q[`answer_${i}`];

            // make first asnwer selercted
            if (i === 1) {
                radioInput.checked = true;
            }

            // create label
            let theLabel = document.createElement("label");

            // add for attr
            theLabel.htmlFor = `answer_${i}`;

            // create label text
            let theLabelText = document.createTextNode(q[`answer_${i}`]);

            // add the text to label
            theLabel.appendChild(theLabelText);

            // add label to maindiv
            mainDiv.appendChild(radioInput)
            mainDiv.appendChild(theLabel);

            // add main div to answers area
            answerArea.appendChild(mainDiv);
        }

    }
}

function checkAnswer(rA, count) {

    let answers = document.getElementsByName("Questions");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }

    }

    if (rA === theChoosenAnswer) {
        rightAnswers++;
    }

}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arraySpans = Array.from(bulletsSpans);

    arraySpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResult(count) {

    let result;

    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            result = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            result = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            result = `<span class="bad">Bad</span>,  ${rightAnswers} From ${count}`;
        }

        resultsContainer.innerHTML = result;
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let min, secs;
        countDownInterval = setInterval(function () {
            min = parseInt(duration / 60);
            secs = parseInt(duration % 60);

            min = min < 10 ? `0${min}` : `${min}`;
            secs = secs < 10 ? `0${secs}` : `${secs}`;

            countDown.innerHTML = `${min}:${secs}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }

        }, 1000)
    }
}