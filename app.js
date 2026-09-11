const SUPABASE_URL = 'https://krgdmlbecoookynlbrpj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ph95R9n3FIXv7RHOyO33XA_WQlCNQJT';
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });

const app = document.getElementById('app');
const USER_KEY='pjokArenaUserFinal';
const RESUME_KEY='pjokArenaResumeFinal';
const SOUND_KEY='pjokSound';
const cats=[...new Set(QUESTIONS.map(q=>q.c))];
const modes=[{n:10,title:'QUICK MATCH',desc:'10 soal • cepat',time:15,icon:'⚡'},{n:20,title:'STANDARD',desc:'20 soal • rekomendasi',time:15,icon:'🔥'},{n:30,title:'CHALLENGE',desc:'30 soal • 12 detik',time:12,icon:'☠️'}];
let selectedMode=20, selectedCategory='Semua', soundOn=localStorage.getItem(SOUND_KEY)!=='off', audioCtx=null, session=null, online=false;
let user=JSON.parse(localStorage.getItem(USER_KEY)||'null');
let state={qs:[],i:0,score:0,xp:0,correct:0,combo:0,bestCombo:0,time:15,timer:null,mode:20,category:'Semua',answered:false};

const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
function hideLoading(){const x=document.getElementById('loading');if(x)x.remove()}
function shell(content){app.innerHTML=`<main class="wrap">${content}</main>`;updateSoundButton()}
function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);requestAnimationFrame(()=>x.classList.add('show'));setTimeout(()=>{x.classList.remove('show');setTimeout(()=>x.remove(),250)},1800)}
function tone(freq,dur=.09,type='sine',vol=.045){if(!soundOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch(e){}}
function sfx(name){if(name==='click')tone(260,.05,'square',.025);if(name==='correct'){tone(520,.08);setTimeout(()=>tone(780,.12),70)}if(name==='wrong')tone(180,.13,'sawtooth',.03);if(name==='finish'){tone(520,.08);setTimeout(()=>tone(660,.08),90);setTimeout(()=>tone(880,.18),180)}}
function toggleSound(){soundOn=!soundOn;localStorage.setItem(SOUND_KEY,soundOn?'on':'off');updateSoundButton();if(soundOn){tone(600,.08);toast('Suara ON 🔊')}else toast('Suara OFF 🔇')}
function updateSoundButton(){const b=document.getElementById('soundBtn');if(b)b.textContent=soundOn?'🔊':'🔇'}
function athleteSVG(){return `<div class="athlete"><svg viewBox="0 0 430 470" xmlns="http://www.w3.org/2000/svg" aria-label="Ilustrasi atlet PJOK bergaya anime"><defs><linearGradient id="j1" x1="0" x2="1"><stop stop-color="#4de7ff"/><stop offset="1" stop-color="#9a6cff"/></linearGradient><linearGradient id="j2" x1="0" x2="1"><stop stop-color="#ff4fd8"/><stop offset="1" stop-color="#7d4dff"/></linearGradient></defs><circle cx="215" cy="90" r="54" fill="#ffd7c2"/><path d="M163 86c3-50 104-65 112 10-21-15-36-28-63-25-15 2-30 10-49 15z" fill="#171327"/><path d="M176 93c15 8 24 8 39 5M234 98c12 6 22 4 31-2" stroke="#2b2148" stroke-width="7" stroke-linecap="round"/><circle cx="198" cy="92" r="4" fill="#171327"/><circle cx="254" cy="92" r="4" fill="#171327"/><path d="M185 135c20 18 42 21 63 0l22 26-15 111H171l-14-111z" fill="url(#j1)"/><path d="M176 152l-61 83 21 14 65-58zM250 151l72 61-17 20-75-47z" fill="#ffd7c2"/><path d="M171 251l-39 116 54 3 28-104 18 104 58-5-26-114z" fill="url(#j2)"/><path d="M132 364l54 3-5 42-69 0zM232 365l58-5 18 48-70 0z" fill="#151126"/><path d="M100 408h82M237 408h78" stroke="#4de7ff" stroke-width="10" stroke-linecap="round"/><circle cx="339" cy="205" r="27" fill="none" stroke="#ff4fd8" stroke-width="7"/></svg></div>`}

async function boot(){
  try{
    const {data,error}=await db.auth.getSession(); if(error) throw error; session=data.session; online=!!session;
    if(session){ await loadOnlineProfile(); }
  }catch(e){ console.warn(e); online=false; }
  hideLoading();
  if(!user) register(); else { syncResumeToMemory(); dashboard(); }
}

function register(){shell(`<section class="hero"><div class="brand"><span class="bolt">⚡</span> PJOK ARENA <span class="bolt">⚡</span></div><div class="eyebrow">SMP • KELAS VII • SEASON 01</div><div class="auth-grid" style="text-align:left;margin-top:18px"><div class="art-panel"><div class="ring"></div>${athleteSVG()}<div class="art-copy"><strong>READY TO PLAY?</strong><span>Uji pengetahuan PJOK kamu dan kejar peringkat tertinggi.</span></div></div><div class="card form-card"><div class="eyebrow">PLAYER REGISTRATION</div><h1>CLASS VII</h1><p class="muted">Cerdas cermat PJOK dengan nuansa arena gaming.</p><div class="feature-row"><div class="feature">🎯<b>QUIZ</b><span>Bank soal PJOK</span></div><div class="feature">🔥<b>COMBO</b><span>Bonus skor</span></div><div class="feature">🏆<b>RANK</b><span>Online</span></div></div><label>Username</label><input id="u" maxlength="20" placeholder="contoh: denny07"><label>Nama Lengkap</label><input id="n" maxlength="60" placeholder="Nama lengkap"><label>Kelas</label><select id="k">${['VII A','VII B','VII C','VII D','VII E','VII F','VII G'].map(x=>`<option>${x}</option>`).join('')}</select><br><button class="btn full" onclick="saveUser()">MASUK ARENA 🚀</button><p class="small" style="margin-top:12px">🔐 Tidak perlu password. Akun arena tersimpan di perangkat ini.</p></div></div></section>`)}

async function ensureAuth(){
  if(session)return true;
  const {data,error}=await db.auth.signInAnonymously();
  if(error){console.error(error);toast('Login online gagal. Cek Anonymous Sign-In.');return false}
  session=data.session; online=true; return true;
}

async function saveUser(){
  const username=document.getElementById('u').value.trim().toLowerCase().replace(/\s+/g,'_'),name=document.getElementById('n').value.trim(),cls=document.getElementById('k').value;
  if(!username||!name)return alert('Username dan nama lengkap wajib diisi.');
  if(username.length<3)return alert('Username minimal 3 karakter.');
  sfx('click');
  const ok=await ensureAuth();
  if(!ok){ user={username,name,class:cls,totalXP:0,totalScore:0,played:0,correct:0,matches:0,bestCombo:0,achievements:[]};localStorage.setItem(USER_KEY,JSON.stringify(user));dashboard();return; }
  const profile={id:session.user.id,username,full_name:name,class_name:cls};
  const {error}=await db.from('players').insert(profile);
  if(error){
    if(error.code==='23505')return alert('Username itu sudah dipakai. Pilih username lain.');
    console.error(error);return alert('Profil gagal disimpan: '+error.message);
  }
  user={username,name,class:cls,totalXP:0,totalScore:0,played:0,correct:0,matches:0,bestCombo:0,achievements:[]};
  localStorage.setItem(USER_KEY,JSON.stringify(user));
  toast('Akun online berhasil dibuat! 🌐'); dashboard();
}

async function loadOnlineProfile(){
  if(!session)return;
  const {data,error}=await db.from('players').select('username,full_name,class_name,total_score,total_xp,correct_count,answered_count,matches,best_combo').eq('id',session.user.id).maybeSingle();
  if(error){console.warn(error);return}
  if(data){
    user={username:data.username,name:data.full_name,class:data.class_name,totalXP:Number(data.total_xp)||0,totalScore:Number(data.total_score)||0,played:Number(data.answered_count)||0,correct:Number(data.correct_count)||0,matches:Number(data.matches)||0,bestCombo:Number(data.best_combo)||0,achievements:JSON.parse(localStorage.getItem('pjokAchievementsFinal')||'[]')};
    localStorage.setItem(USER_KEY,JSON.stringify(user));
  }
}

function dashboard(){
  if(!user)return register();
  shell(`<div class="topbar"><div><div class="brand"><span class="bolt">⚡</span> PJOK ARENA</div><span class="small">PLAYER: ${esc(user.username)} • ${esc(user.class)} ${online?'• 🟢 ONLINE':'• 🟡 OFFLINE'}</span></div><button class="btn alt smallbtn" onclick="logout()">KELUAR</button></div><div class="card"><div class="eyebrow">WELCOME BACK</div><h2>${esc(user.name)} 👋</h2><div class="stats"><div class="stat">⭐ XP<b>${user.totalXP}</b></div><div class="stat">🏆 SKOR<b>${user.totalScore}</b></div><div class="stat">🎯 AKURASI<b>${user.played?Math.round(user.correct/user.played*100):0}%</b></div><div class="stat">🔥 COMBO<b>x${user.bestCombo}</b></div></div><div class="section-title"><h2>⚔️ PILIH MATCH</h2><span class="small">${QUESTIONS.length} soal tersedia</span></div><div class="modegrid">${modes.map(m=>`<button class="choice" onclick="setupQuiz(${m.n})"><span style="font-size:28px">${m.icon}</span><div class="big">${m.title}</div><span class="small">${m.desc}</span></button>`).join('')}</div><div class="menu"><div class="tile" onclick="leaderboard()"><span class="icon">🏆</span><b>LEADERBOARD</b><span class="small">Papan online</span></div><div class="tile" onclick="achievements()"><span class="icon">🎖️</span><b>ACHIEVEMENT</b><span class="small">Pencapaian</span></div><div class="tile" onclick="statistics()"><span class="icon">📊</span><b>STATISTIK</b><span class="small">Performa kamu</span></div><div class="tile" onclick="showCategories()"><span class="icon">📚</span><b>MATERI</b><span class="small">Kategori soal</span></div></div>${getResume()?`<div class="resume"><b>⏯️ MATCH TERSIMPAN</b><span>${getResume().category} • soal ${getResume().i+1}/${getResume().qs.length}</span><button class="btn full" onclick="resumeQuiz()">LANJUTKAN MATCH →</button></div>`:''}</div>`)
}

function setupQuiz(mode){selectedMode=mode;shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">MATCH SETUP</div></div><div class="card"><div class="eyebrow">SELECT CATEGORY</div><h2>⚡ ${mode} SOAL</h2><p class="muted">Pilih kategori atau gas semua materi.</p><div class="catgrid">${['Semua',...cats].map(c=>`<button class="choice ${selectedCategory===c?'active':''}" onclick='pickCat(${JSON.stringify(c)},${mode})'><b>${esc(c)}</b><br><span class="small">${c==='Semua'?QUESTIONS.length:QUESTIONS.filter(q=>q.c===c).length} soal</span></button>`).join('')}</div><br><button class="btn full" onclick="startQuiz(${mode})">MULAI PERTANDINGAN 🔥</button></div>`)}
function pickCat(c,m){selectedCategory=c;sfx('click');setupQuiz(m)}
function startQuiz(mode){const pool=selectedCategory==='Semua'?QUESTIONS:QUESTIONS.filter(q=>q.c===selectedCategory);if(!pool.length)return alert('Kategori ini belum memiliki soal.');sfx('click');state={qs:shuffle(pool).slice(0,Math.min(mode,pool.length)),i:0,score:0,xp:0,correct:0,combo:0,bestCombo:0,time:mode===30?12:15,timer:null,mode,category:selectedCategory,answered:false};saveResume();showQ()}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function saveResume(){const x={...state,timer:null};localStorage.setItem(RESUME_KEY,JSON.stringify(x))}
function getResume(){try{const x=JSON.parse(localStorage.getItem(RESUME_KEY)||'null');return x&&x.qs?.length&&x.i<x.qs.length?x:null}catch{return null}}
function syncResumeToMemory(){const x=getResume();if(x)state=x}
function resumeQuiz(){const x=getResume();if(!x)return startQuiz(selectedMode);state={...x,timer:null,answered:false};showQ()}
function clearResume(){localStorage.removeItem(RESUME_KEY)}
function showQ(){clearInterval(state.timer);state.answered=false;const q=state.qs[state.i];state.time=state.time||((state.mode===30)?12:15);const pct=state.i/state.qs.length*100;shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="confirmExitQuiz()">← MENU</button><div class="timer" id="timer">00:${String(state.time).padStart(2,'0')}</div></div><div class="card"><div class="quizHead"><b>SOAL ${state.i+1}/${state.qs.length}</b><span class="badge">${esc(q.c)}</span></div><div class="progress"><i style="width:${pct}%"></i></div><div class="qtext">${esc(q.q)}</div><div class="opts">${q.o.map((x,j)=>`<button class="opt" id="o${j}" onclick="answer(${j})">${String.fromCharCode(65+j)}. ${esc(x)}</button>`).join('')}</div><div id="feedback"></div></div>`);state.timer=setInterval(()=>{state.time--;saveResume();const el=document.getElementById('timer');if(el){el.textContent='00:'+String(Math.max(0,state.time)).padStart(2,'0');if(state.time<=5)el.classList.add('danger')}if(state.time<=0){clearInterval(state.timer);answer(-1)}},1000)}
function confirmExitQuiz(){if(confirm('Keluar dari quiz? Progres akan tetap disimpan dan bisa dilanjutkan nanti.')){clearInterval(state.timer);saveResume();dashboard()}}
function answer(j){if(state.answered)return;state.answered=true;clearInterval(state.timer);const q=state.qs[state.i],ok=j===q.a;if(j>=0){const el=document.getElementById('o'+j);if(el)el.classList.add(ok?'correct':'wrong')}const correctEl=document.getElementById('o'+q.a);if(correctEl)correctEl.classList.add('correct');let pts=ok?(q.d===2?30:20):0;if(ok){state.combo++;state.bestCombo=Math.max(state.bestCombo,state.combo);pts+=Math.min(state.combo*2,20);sfx('correct')}else{state.combo=0;sfx('wrong')}state.score+=pts;state.xp+=pts;state.correct+=ok?1:0;saveResume();const combo=state.combo>=2?`<div class="combo">🔥 COMBO x${state.combo}</div>`:'';document.getElementById('feedback').innerHTML=`<div class="feedback">${ok?'✅ BENAR! +'+pts+' poin':'❌ BELUM TEPAT'} ${combo}<br>${esc(q.e)}<br><span class="small">Sumber: ${esc(q.sourceRef||q.c)}</span><br><br><button class="btn full" onclick="nextQ()">${state.i+1===state.qs.length?'LIHAT HASIL':'SOAL BERIKUTNYA →'}</button></div>`}
function nextQ(){sfx('click');if(state.i+1<state.qs.length){state.i++;state.time=state.mode===30?12:15;saveResume();showQ()}else finish()}

async function finish(){clearInterval(state.timer);clearResume();sfx('finish');
  const acc=Math.round(state.correct/state.qs.length*100);
  const unlocked=[];if((user.matches||0)+1>=1)unlocked.push('first');if((user.totalScore||0)+state.score>=1000)unlocked.push('score1000');if((user.correct||0)+state.correct>=25)unlocked.push('sharp');if(Math.max(user.bestCombo||0,state.bestCombo)>=5)unlocked.push('combo5');
  user.achievements=[...new Set([...(user.achievements||[]),...unlocked])];localStorage.setItem('pjokAchievementsFinal',JSON.stringify(user.achievements));
  let savedOnline=false;
  if(await ensureAuth()){
    const {data,error}=await db.rpc('submit_match',{p_score:state.score,p_xp:state.xp,p_correct_count:state.correct,p_total_questions:state.qs.length,p_best_combo:state.bestCombo,p_category:state.category,p_mode:state.mode});
    if(!error){savedOnline=true;await loadOnlineProfile();}else console.error(error);
  }
  if(!savedOnline){user.totalXP=(user.totalXP||0)+state.xp;user.totalScore=(user.totalScore||0)+state.score;user.played=(user.played||0)+state.qs.length;user.correct=(user.correct||0)+state.correct;user.matches=(user.matches||0)+1;user.bestCombo=Math.max(user.bestCombo||0,state.bestCombo);localStorage.setItem(USER_KEY,JSON.stringify(user));}
  shell(`<div class="hero"><div class="card result-wrap"><div class="result-badge">MATCH COMPLETE</div><div class="resultScore">${state.score}</div><h2>🎉 ${state.correct}/${state.qs.length} BENAR</h2><p class="muted">Akurasi ${acc}% • Combo terbaik x${state.bestCombo}</p><div class="stats"><div class="stat">⭐ XP<b>+${state.xp}</b></div><div class="stat">🎯 AKURASI<b>${acc}%</b></div><div class="stat">🔥 COMBO<b>x${state.bestCombo}</b></div><div class="stat">🏆 TOTAL<b>${user.totalScore}</b></div></div><p class="small">${savedOnline?'🌐 Skor tersimpan di leaderboard online.':'🟡 Skor tersimpan sementara di perangkat.'}</p><button class="btn full" onclick="setupQuiz(${state.mode})">MAIN LAGI 🔥</button><br><br><button class="btn alt full" onclick="leaderboard()">LIHAT LEADERBOARD 🏆</button><br><br><button class="btn alt full" onclick="dashboard()">KEMBALI KE MENU</button></div></div>`)
}

async function leaderboard(){
  let rows=[];
  if(await ensureAuth()){
    const {data,error}=await db.from('players').select('username,full_name,class_name,total_score').order('total_score',{ascending:false}).limit(50);
    if(!error)rows=data||[];
  }
  if(!rows.length){rows=JSON.parse(localStorage.getItem('pjokArenaLocalBoardV3')||'[]');}
  rows=rows.filter(x=>x.username!=='__sepuh__');
  const current=rows.find(x=>x.username===user?.username); if(current) current._me=true;
  const top=rows.slice(0,3);
  shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">LEADERBOARD</div></div><div class="card"><div class="sepuh"><div><span class="crown">👑</span> <strong>PERINGKAT SEPUH</strong><br><span class="small">Denny Agustiana S.Pd • legenda arena</span></div><strong>999999999</strong></div>${top.length?`<div class="podium">${[top[1],top[0],top[2]].map((x,i)=>x?`<div class="pod ${i===1?'first':''}"><div class="medal">${i===1?'🥇':i===0?'🥈':'🥉'}</div><div class="avatar">${initials(x.full_name||x.name)}</div><b>${esc(x.full_name||x.name)}</b><span class="small">${esc(x.class_name||x.class)}</span><strong>${Number(x.total_score||x.score||0)}</strong></div>`:'<div class="pod" style="visibility:hidden"></div>').join('')}</div>`:''}<div class="rank-list">${rows.map((x,i)=>`<div class="rank ${x._me?'me':''}"><div class="num">#${i+1}</div><div class="who"><b>${esc(x.full_name||x.name)} ${x._me?'• KAMU':''}</b><span>${esc(x.username)} • ${esc(x.class_name||x.class)}</span></div><div class="points">${Number(x.total_score||x.score||0)}</div></div>`).join('')}</div><p class="small" style="margin-top:16px">🌐 Peringkat ini mengambil data dari semua HP yang memakai arena ini.</p></div>`)
}
function initials(name){return String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}
function achievements(){const defs=[['first','🎮','FIRST MATCH','Selesaikan 1 pertandingan'],['score1000','⭐','1000 POINT','Kumpulkan 1000 total skor'],['sharp','🎯','SHARP SHOOTER','Capai 25 jawaban benar'],['combo5','🔥','COMBO MASTER','Capai combo x5']];shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">ACHIEVEMENT</div></div><div class="card"><div class="eyebrow">COLLECTION</div><h2>🎖️ PENCAPAIAN</h2>${defs.map(d=>`<div class="achievement ${(user.achievements||[]).includes(d[0])?'':'locked'}"><span style="font-size:30px">${d[1]}</span><div><b>${d[2]}</b><br><span class="small">${d[3]}</span></div></div>`).join('')}</div>`)}
function statistics(){const acc=user.played?Math.round(user.correct/user.played*100):0;shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">STATISTIK</div></div><div class="card"><div class="eyebrow">PLAYER DATA</div><h2>📊 ${esc(user.username)}</h2><div class="stats"><div class="stat">MATCH<b>${user.matches}</b></div><div class="stat">SOAL<b>${user.played}</b></div><div class="stat">BENAR<b>${user.correct}</b></div><div class="stat">AKURASI<b>${acc}%</b></div></div><div class="stats"><div class="stat">TOTAL XP<b>${user.totalXP}</b></div><div class="stat">TOTAL SKOR<b>${user.totalScore}</b></div><div class="stat">BEST COMBO<b>x${user.bestCombo}</b></div><div class="stat">KELAS<b>${esc(user.class)}</b></div></div></div>`)}
function showCategories(){shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">MATERI</div></div><div class="card"><div class="eyebrow">QUESTION BANK</div><h2>📚 KATEGORI PJOK</h2>${cats.map(c=>`<div class="rank"><div class="num">📘</div><div class="who"><b>${esc(c)}</b><span>Materi pada bank soal</span></div><div class="points">${QUESTIONS.filter(q=>q.c===c).length}</div></div>`).join('')}</div>`)}
async function logout(){if(!confirm('Keluar dari akun di perangkat ini?'))return;clearInterval(state.timer);clearResume();localStorage.removeItem(USER_KEY);user=null;session=null;online=false;await db.auth.signOut();register()}
window.addEventListener('beforeunload',()=>{if(state.qs?.length&&!state.answered&&state.i<state.qs.length){saveResume()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.qs?.length&&!state.answered&&state.i<state.qs.length)saveResume()});
boot();
