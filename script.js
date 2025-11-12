
let allQuestions=[],examQuestions=[],currentIndex=0,answers=[],timerInterval=null,totalTime=3600,paused=false,scoreCount=0;
const TOTAL_Q=40;
async function loadQuestions(){const r=await fetch('questions.json');allQuestions=await r.json();}
function startExam(){examQuestions=shuffle(allQuestions).slice(0,TOTAL_Q);answers=Array(TOTAL_Q).fill(null);currentIndex=0;scoreCount=0;
document.getElementById('start-screen').classList.add('hidden');
document.getElementById('exam-screen').classList.remove('hidden');
totalTime=3600;paused=false;startTimer();renderQuestion();}
function startTimer(){updateTimerDisplay();if(timerInterval)clearInterval(timerInterval);
timerInterval=setInterval(()=>{if(!paused){totalTime--;if(totalTime<=0){clearInterval(timerInterval);finishExam();}updateTimerDisplay();}},1000);}
function updateTimerDisplay(){const mm=Math.floor(totalTime/60).toString().padStart(2,'0'),ss=(totalTime%60).toString().padStart(2,'0');
document.getElementById('timer').textContent=`${mm}:${ss}`;}
function renderQuestion(){const q=examQuestions[currentIndex];document.getElementById('q-count').textContent=`Question ${currentIndex+1} / ${TOTAL_Q}`;
document.getElementById('score-display').textContent=`Score: ${scoreCount} / ${TOTAL_Q}`;
document.getElementById('definition').textContent=q.definition;
const optionsDiv=document.getElementById('options');optionsDiv.innerHTML='';q.options.forEach(opt=>{const d=document.createElement('div');
d.className='option';d.textContent=opt;d.onclick=()=>{if(paused)return;document.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));
d.classList.add('selected');answers[currentIndex]=opt;document.getElementById('next-btn').disabled=false;};optionsDiv.appendChild(d);});
const prev=answers[currentIndex];if(prev){Array.from(document.querySelectorAll('.option')).forEach(o=>{if(o.textContent===prev)o.classList.add('selected');});
document.getElementById('next-btn').disabled=false;}else document.getElementById('next-btn').disabled=true;}
function nextQuestion(){if(answers[currentIndex]===examQuestions[currentIndex].correct_answer)scoreCount++;
if(currentIndex<TOTAL_Q-1){currentIndex++;renderQuestion();}else finishExam();}
function finishExam(){clearInterval(timerInterval);let score=0;const rev=[];
for(let i=0;i<TOTAL_Q;i++){const q=examQuestions[i],sel=answers[i],cor=q.correct_answer;if(sel===cor)score++;rev.push({n:i+1,def:q.definition,sel:sel||'(no answer)',cor,isCorrect:sel===cor});}
document.getElementById('exam-screen').classList.add('hidden');document.getElementById('result-screen').classList.remove('hidden');
document.getElementById('score').textContent=`Score: ${score} / ${TOTAL_Q}`;document.getElementById('passfail').textContent=score>=26?'Pass ✅':'Fail ❌';
const revDiv=document.getElementById('review');revDiv.innerHTML='';rev.forEach(r=>{const w=document.createElement('div');w.className='review-item';
w.innerHTML=`<div class='small'><strong>Q${r.n}</strong></div><div>${r.def}</div><div class='small'>Your answer: ${r.sel}</div><div class='small'>Correct answer: ${r.cor}</div>`;
if(!r.isCorrect)w.style.background='#fff6f6';revDiv.appendChild(w);});}
function restart(){document.getElementById('result-screen').classList.add('hidden');document.getElementById('start-screen').classList.remove('hidden');}
function togglePause(){paused=!paused;const b=document.getElementById('pause-btn');b.textContent=paused?'Resume':'Pause';
document.querySelectorAll('.option').forEach(o=>o.classList.toggle('disabled',paused));}
document.getElementById('start-btn').onclick=startExam;document.getElementById('next-btn').onclick=nextQuestion;
document.getElementById('restart-btn').onclick=restart;document.getElementById('pause-btn').onclick=togglePause;
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
loadQuestions();
