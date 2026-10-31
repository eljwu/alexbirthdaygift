
const questions = [
  {
    question: "What time was Agent Simpson born?",
    answers: [
      "11:42",
      "11:24",
      "12:36",
      "10:58"
    ],
    correct: 1,
    correctMessage: "BIRTH RECORDS VERIFIED.",
    wrongMessage: "Maybe call Julie for help."
  },
  {
    question: "What is Agent Simpson's favorite color?",
    answers: [
      "Blue",
      "Green",
      "Purple",
      "Red"
    ],
    correct: 2,
    correctMessage: "BASIC INFORMATION VERIFIED.",
    wrongMessage: "Identity crisis detected. Are you sure you're Alex Simpson?"
  },
  {
    question: "Which of the following is a known weakness?",
    answers: [
      "Tequila",
      "Hot Dogs",
      "Charlie",
      "Driving"
    ],
    correct: 0,
    correctMessage: "VULNERABILITY CONFIRMED.",
    wrongMessage: "Your liver would disagree."
  },
  {
    question: "You have 07 cups left in a game of shot pong. What rerack are you running?",
    answers: [
      "2-3-2",
      "Long Zipper",
      "Twin Towers (one has an antenna)",
      "None"
    ],
    correct: 2,
    correctMessage: "STRATEGIC MIND CONFIRMED.",
    wrongMessage: "Let's say you want to get a cup."
  },
  {
    question: "Which song revives an incapacitated Agent Simpson?",
    answers: [
      "FE!N",
      "COCAINE NOSE",
      "Mo Bamba",
      "Headlines"
    ],
    correct: 1,
    correctMessage: "EMERGENCY REVIVAL PROTOCOL SUCCESSFUL.",
    wrongMessage: "Revival unsuccessful. HINT: Schyeah."
  },
  {
    question: "Which of the following is NOT a standard food group for Agent Simpson's diet?",
    answers: [
      "Cheese",
      "Eggs",
      "Salad",
      "Milk"
    ],
    correct: 2,
    correctMessage: "DIETARY PREFERENCES VERIFIED.",
    wrongMessage: "Are we being serious?"
  },
  {
    question: "Which of the following songs has NOT been featured on an @a_d_simpson post?",
    answers: [
      "AT THE PARTY",
      "Barking at the Moon",
      "Pepper",
      "NEW MAGIC WAND"
    ],
    correct: 3,
    correctMessage: "DIGITAL FOOTPRINT VERIFIED.",
    wrongMessage: "Some people like to scroll your feed."
  },
  {
    question: "How many drinks did Agent Simpson consume on his birthday last year?",
    answers: [
      "Approximately 26",
      "19 (obviously)",
      "1,000,000",
      "12 (not the most impressive)"
    ],
    correct: 0,
    correctMessage: "INCIDENT REPORT CONFIRMED.",
    wrongMessage: "The official incident report says otherwise. Recount."
  },
  {
    question: "Which town is Agent Simpson's alias from?",
    answers: [
      "Limestone, OH",
      "Kansas, OH",
      "North Branch, MI",
      "Bowling Green, OH"
    ],
    correct: 1,
    correctMessage: "COVER IDENTITY CONFIRMED.",
    wrongMessage: "Your cover story is falling apart. Get it together."
  },
  {
    question: "What is Agent Simpson's greatest achievement?",
    answers: [
      "Surviving 20 years",
      "Becoming the most lit, awesome human being ever",
      "Being a Michigan Wolverine",
      "Finding the best girlfriend in the world"
    ],
    correct: 3,
    correctMessage: "SWEETNESS CONFIRMED.",
    wrongMessage: "True, but not the greatest achievement."
  }
];

// GAME STATE

let currentQuestion = 0;
let score = 0;
let answering = false;

const briefingScreen = document.getElementById("briefingScreen");
const quizScreen = document.getElementById("quizScreen");
const completeScreen = document.getElementById("completeScreen");

const questionText = document.getElementById("questionText");
const answerGrid = document.getElementById("answerGrid");
const feedback = document.getElementById("feedback");

const letters = ["A", "B", "C", "D"];

document.getElementById("briefingCount").textContent =
  String(questions.length).padStart(2, "0");

// SCREEN SWITCHING

function showScreen(screen) {
  [briefingScreen, quizScreen, completeScreen].forEach(item => {
    item.classList.add("hidden");
  });

  screen.classList.remove("hidden");
}

// START GAME

document.getElementById("startButton").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  answering = false;

  showScreen(quizScreen);
  displayQuestion();
});

// DISPLAY QUESTION

function displayQuestion() {
  answering = false;

  const current = questions[currentQuestion];

  questionText.textContent = current.question;
  answerGrid.innerHTML = "";

  feedback.textContent = "";
  feedback.className = "feedback";

  document.getElementById("questionCounter").textContent =
    `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;

  document.getElementById("quizProgress").style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  document.getElementById("scoreText").textContent =
    `CORRECT ANSWERS: ${score}`;

  current.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = letters[index];

    const label = document.createElement("span");
    label.textContent = answer;

    button.append(letter, label);

    button.addEventListener("click", () => {
      checkAnswer(index, button);
    });

    answerGrid.appendChild(button);
  });
}

// CHECK ANSWER

function checkAnswer(selectedIndex, selectedButton) {
  if (answering) return;

  answering = true;

  const current = questions[currentQuestion];
  const isCorrect = selectedIndex === current.correct;

  const buttons = answerGrid.querySelectorAll(".answer-button");

  buttons.forEach(button => {
    button.disabled = true;
  });

  if (isCorrect) {
    score++;

    selectedButton.classList.add("correct");
    feedback.textContent =
      current.correctMessage || "CORRECT. ACCESS GRANTED.";
    feedback.className = "feedback success";

    document.getElementById("scoreText").textContent =
      `CORRECT ANSWERS: ${score}`;

    setTimeout(() => {
      currentQuestion++;

      if (currentQuestion < questions.length) {
        displayQuestion();
      } else {
        finishGame();
      }
    }, 1400);

  } else {
    selectedButton.classList.add("incorrect");

    buttons[current.correct].classList.add("correct");

    feedback.textContent =
      current.wrongMessage || "INCORRECT. TRY AGAIN.";
    feedback.className = "feedback error";

    // Wrong answers don't advance.
    // The same question will be presented again.
    setTimeout(() => {
      displayQuestion();
    }, 1900);
  }
}

// FINISH GAME

function finishGame() {
  document.getElementById("quizProgress").style.width = "100%";

  document.getElementById("finalScore").textContent =
    `${score} / ${questions.length}`;

  // Save progress for the Mission Select screen.
  const STORAGE_KEY = "birthdayMissionProgress";

  let progress;

  try {
    progress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    progress = {};
  }

  progress.trivia = true;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  showScreen(completeScreen);
}

// RETURN TO MISSION SELECT

document.getElementById("continueButton").addEventListener("click", () => {
  window.location.href = "mission.html";
});
