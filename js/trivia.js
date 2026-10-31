
const questions = [
  {
    question: "What is Agent Simpson's official threat level?",
    answers: [
      "Extremely dangerous",
      "Moderate after 10 drinks",
      "Harmless at all times",
      "Classified by the government"
    ],
    correct: 1,
    correctMessage: "THREAT ASSESSMENT VERIFIED.",
    wrongMessage: "Have you even read your own personnel file?"
  },
  {
    question: "Which of the following is a known weakness?",
    answers: [
      "Tequila",
      "Hot dogs",
      "Beer ball",
      "Driving"
    ],
    correct: 0,
    correctMessage: "VULNERABILITY CONFIRMED.",
    wrongMessage: "Your liver would disagree."
  },
  {
    question: "What is Agent Simpson's passive ability?",
    answers: [
      "Professional Sleeper",
      "Life of the Party",
      "Emergency Exit",
      "Unlimited Stamina"
    ],
    correct: 1,
    correctMessage: "PASSIVE ABILITY IDENTIFIED.",
    wrongMessage: "You really don't know your own abilities?"
  },
  {
    question: "Which location is marked as the primary base of operations?",
    answers: [
      "Denver",
      "New Orleans",
      "Ann Arbor",
      "Chicago"
    ],
    correct: 2,
    correctMessage: "LOCATION CONFIRMED.",
    wrongMessage: "GPS malfunction. Try again."
  },
  {
    question: "What is the agent's current level?",
    answers: [
      "18",
      "19",
      "20",
      "21"
    ],
    correct: 2,
    correctMessage: "LEVEL 20 VERIFIED.",
    wrongMessage: "It's literally your birthday."
  },
  {
    question: "Which of these is one of Agent Simpson's special skills?",
    answers: [
      "Solving world hunger",
      "Beer ball",
      "Speaking seven languages",
      "Quantum physics"
    ],
    correct: 1,
    correctMessage: "SPECIAL SKILL CONFIRMED.",
    wrongMessage: "The scouting report says otherwise."
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
