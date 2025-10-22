let currentQuestionIndex = 0, score = 0, timer, timeLeft = 60;
let questions = [], currentUser;

currentUser = localStorage.getItem("currentUser");
if(!currentUser) window.location.href = "register.html";

const quizFile = localStorage.getItem("selectedQuiz");
if(!quizFile) window.location.href = "dashboard.html";

fetch(quizFile)
.then(response => response.json())
.then(data => {
  questions = data.sort(()=>0.5-Math.random()).slice(0,5);
  startQuiz();
});

function startQuiz() {
  document.getElementById("quiz-screen").style.display="block";
  document.getElementById("result-screen").style.display="none";
  startTimer();
  showQuestion();
}

function startTimer() {
  document.getElementById("timer").innerText=`Time Left: ${timeLeft}s`;
  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").innerText=`Time Left: ${timeLeft}s`;
    if(timeLeft<=0){clearInterval(timer); endQuiz();}
  },1000);
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  const questionContainer = document.getElementById("question-container");
  const optionsContainer = document.getElementById("options-container");

  questionContainer.innerText = q.question;
  optionsContainer.innerHTML = "";

  q.options.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.innerText=opt;
    btn.classList.add("option-btn");
    btn.onclick=()=>checkAnswer(i, btn);
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selectedIndex, button){
  const q = questions[currentQuestionIndex];
  const allBtns = document.querySelectorAll(".option-btn");

  // Disable all buttons after one selection
  allBtns.forEach(btn => btn.disabled = true);

  if(selectedIndex === q.answer){
    score++;
    button.classList.add("correct");
  } else {
    button.classList.add("wrong");
    // Highlight correct answer
    allBtns[q.answer].classList.add("correct");
  }

  // Wait for 1.5s then move to next question
  setTimeout(()=>{
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length) showQuestion();
    else endQuiz();
  },1500);
}

function endQuiz(){
  clearInterval(timer);
  document.getElementById("quiz-screen").style.display="none";
  document.getElementById("result-screen").style.display="block";
  document.getElementById("score-container").innerText=`Your Score: ${score} / ${questions.length}`;

  let users = JSON.parse(localStorage.getItem("users"));
  const userIndex = users.findIndex(u=>u.username===currentUser);
  if(userIndex>=0){
    users[userIndex].quizzesTaken.push(localStorage.getItem("selectedQuiz"));
    users[userIndex].scores.push(score);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Add View Answers Button
  const resultScreen = document.getElementById("result-screen");
  const existingBtn = document.getElementById("view-answers-btn");
  if(!existingBtn){
    const viewBtn = document.createElement("button");
    viewBtn.id = "view-answers-btn";
    viewBtn.innerText = "View All Answers";
    viewBtn.onclick = showAllAnswers;
    resultScreen.appendChild(viewBtn);
  }
}

function showAllAnswers(){
  const container = document.querySelector(".quiz-container");
  container.innerHTML = `<h1>All Questions & Answers</h1>`;
  questions.forEach((q, idx)=>{
    const div = document.createElement("div");
    div.classList.add("review-item");
    let optionsHTML = "";
    q.options.forEach((opt, i)=>{
      const isCorrect = i === q.answer ? "correct" : "";
      optionsHTML += `<div class="option ${isCorrect}">${opt}</div>`;
    });
    div.innerHTML = `
      <h3>Q${idx+1}. ${q.question}</h3>
      ${optionsHTML}
      <hr/>
    `;
    container.appendChild(div);
  });

  const backBtn = document.createElement("button");
  backBtn.innerText = "Back to Dashboard";
  backBtn.onclick = ()=>window.location.href="dashboard.html";
  container.appendChild(backBtn);
}
