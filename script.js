let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let username = "";
let timeLeft = 60;
let timerInterval;

const timerElement = document.getElementById("timer");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");

// 🟢 Start Quiz
document.getElementById("start-btn").addEventListener("click", () => {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name!");
    return;
  }

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  startTimer();
  showQuestion();
});

function startTimer() {
  timerElement.textContent = `Time Left: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionContainer.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.addEventListener("click", () => handleAnswer(option, btn));
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selected, btn) {
  const correctAnswer = questions[currentQuestionIndex].correct;
  userAnswers[currentQuestionIndex] = selected;

  const allButtons = optionsContainer.querySelectorAll("button");
  allButtons.forEach((b) => (b.disabled = true));

  if (selected === correctAnswer) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    allButtons.forEach((b) => {
      if (b.textContent === correctAnswer) b.classList.add("correct");
    });
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}

// 🧮 Show Results & update leaderboard
function showResult() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("score-container").textContent = `${username}, your score is ${score}/${questions.length}`;

  // Save to leaderboard
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: username, score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// 🧩 View All Answers
document.getElementById("view-answers-btn").addEventListener("click", () => {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("answers-screen").style.display = "block";

  const answersList = document.getElementById("answers-list");
  answersList.innerHTML = "";

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("answer-item");
    div.innerHTML = `
      <p><strong>Q${i + 1}:</strong> ${q.question}</p>
      <p>Your Answer: <span style="color:${
        userAnswers[i] === q.correct ? "green" : "red"
      }">${userAnswers[i] || "Not answered"}</span></p>
      <p>Correct Answer: <strong>${q.correct}</strong></p>
      <hr/>
    `;
    answersList.appendChild(div);
  });
});

// 🔙 Back to Results
document.getElementById("back-to-results-btn").addEventListener("click", () => {
  document.getElementById("answers-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
});

// 🏆 View Leaderboard
document.getElementById("view-leaderboard-btn").addEventListener("click", () => {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("leaderboard-screen").style.display = "block";
  showLeaderboard();
});

function showLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard");
  leaderboardList.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// 🧹 Clear Leaderboard
document.getElementById("clear-leaderboard-btn").addEventListener("click", () => {
  if (confirm("Clear all leaderboard data?")) {
    localStorage.removeItem("leaderboard");
    showLeaderboard();
  }
});

// 🔁 Restart Quiz
document.getElementById("restart-btn").addEventListener("click", resetToStart);
document.getElementById("back-btn").addEventListener("click", resetToStart);

function resetToStart() {
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("answers-screen").style.display = "none";
  document.getElementById("leaderboard-screen").style.display = "none";

  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  username = "";
  timeLeft = 60;
  clearInterval(timerInterval);
  document.getElementById("username").value = "";
}
