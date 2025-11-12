
let allQuestions = [];
let examQuestions = [];
let currentIndex = 0;
let answers = [];
let timerInterval = null;
let totalTime = 60 * 60; // seconds
const TOTAL_Q = 40;

async function loadQuestions(){
  const res = await fetch('questions.json');
  allQuestions = await res.json();
}

function startExam(){
  // pick 40 random distinct questions
  examQuestions = shuffle(allQuestions).slice(0, TOTAL_Q);
  currentIndex = 0;
  answers = Array(TOTAL_Q).fill(null);
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('exam-screen').classList.remove('hidden');
  totalTime = 60*60;
  startTimer();
  renderQuestion();
}

function startTimer(){
  updateTimerDisplay();
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    totalTime -= 1;
    if(totalTime <= 0){
      clearInterval(timerInterval);
      finishExam();
    }
    updateTimerDisplay();
  },1000);
}
function updateTimerDisplay(){
  const el = document.getElementById('timer');
  const mm = Math.floor(totalTime/60).toString().padStart(2,'0');
  const ss = (totalTime%60).toString().padStart(2,'0');
  el.textContent = mm + ':' + ss;
}

function renderQuestion(){
  const qNum = currentIndex + 1;
  document.getElementById('q-count').textContent = `Question ${qNum} / ${TOTAL_Q}`;
  const q = examQuestions[currentIndex];
  document.getElementById('definition').textContent = q.definition;
  const opts = q.options.slice(); // copy
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  opts.forEach((opt, idx)=>{
    const b = document.createElement('div');
    b.className = 'option';
    b.textContent = opt;
    b.onclick = ()=> {
      document.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      answers[currentIndex] = opt;
      document.getElementById('next-btn').disabled = false;
    };
    optionsDiv.appendChild(b);
  });
  // preselect if answered
  const prev = answers[currentIndex];
  if(prev){
    Array.from(document.querySelectorAll('.option')).forEach(o=>{
      if(o.textContent === prev) o.classList.add('selected');
    });
    document.getElementById('next-btn').disabled = false;
  } else {
    document.getElementById('next-btn').disabled = true;
  }
}

function nextQuestion(){
  if(currentIndex < TOTAL_Q -1){
    currentIndex += 1;
    renderQuestion();
  } else {
    finishExam();
  }
}

function finishExam(){
  clearInterval(timerInterval);
  // evaluate
  let score = 0;
  const review = [];
  for(let i=0;i<TOTAL_Q;i++){
    const q = examQuestions[i];
    const selected = answers[i];
    const correct = q.correct_answer;
    if(selected === correct) score += 1;
    review.push({
      number: i+1,
      definition: q.definition,
      selected: selected || "(no answer)",
      correct: correct,
      isCorrect: selected === correct
    });
  }
  document.getElementById('exam-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  document.getElementById('score').textContent = `Score: ${score} / ${TOTAL_Q}`;
  const pass = score >= 26;
  document.getElementById('passfail').textContent = pass ? 'Pass ✅' : 'Fail ❌';
  const revDiv = document.getElementById('review');
  revDiv.innerHTML = '';
  review.forEach(r=>{
    const wrap = document.createElement('div');
    wrap.className = 'review-item';
    wrap.innerHTML = `<div class="small"><strong>Q${r.number}</strong></div>
      <div>${r.definition}</div>
      <div class="small">Your answer: ${r.selected}</div>
      <div class="small">Correct answer: ${r.correct}</div>`;
    if(!r.isCorrect){
      wrap.style.background = '#fff6f6';
    }
    revDiv.appendChild(wrap);
  });
}

function restart(){
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
}

document.getElementById('start-btn').addEventListener('click', startExam);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restart);

function shuffle(a){
  const b = a.slice();
  for(let i=b.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [b[i],b[j]] = [b[j],b[i]];
  }
  return b;
}

// load questions on start
loadQuestions();
