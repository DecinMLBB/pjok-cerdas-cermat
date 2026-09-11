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
function athleteSVG(){return `<div class="hero-character"><svg viewBox="0 0 500 590" xmlns="http://www.w3.org/2000/svg" aria-label="Karakter anime atlet PJOK original"><defs><linearGradient id="hair" x1="0" x2="1"><stop stop-color="#17204b"/><stop offset=".55" stop-color="#5534b7"/><stop offset="1" stop-color="#ff3fbd"/></linearGradient><linearGradient id="jersey" x1="0" x2="1"><stop stop-color="#25d9ff"/><stop offset=".5" stop-color="#536dff"/><stop offset="1" stop-color="#b84dff"/></linearGradient><linearGradient id="pants" x1="0" x2="1"><stop stop-color="#ff3fbd"/><stop offset="1" stop-color="#714cff"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><ellipse cx="250" cy="540" rx="130" ry="20" fill="#45e8ff" opacity=".13"/><circle cx="250" cy="190" r="125" fill="#42e8ff" opacity=".045"/><path d="M120 188c5-110 72-153 139-153 77 0 122 54 122 151-29-35-54-56-99-59-42-3-92 20-162 61z" fill="url(#hair)" stroke="#15102d" stroke-width="10"/><path d="M145 178c0-63 45-103 104-103 62 0 104 44 104 105v55c0 64-46 105-104 105s-104-41-104-105z" fill="#ffd8c5" stroke="#21183e" stroke-width="7"/><path d="M153 159c28-25 49-40 80-44 47-7 79 12 116 43-3-67-45-108-104-108-52 0-84 35-92 109z" fill="url(#hair)"/><path d="M180 205c17 12 33 12 50 1M270 206c17 11 34 11 51 0" fill="none" stroke="#30204f" stroke-width="9" stroke-linecap="round"/><circle cx="204" cy="207" r="5" fill="#1b1630"/><circle cx="295" cy="207" r="5" fill="#1b1630"/><path d="M226 253c15 9 31 9 47 0" fill="none" stroke="#e37b91" stroke-width="5" stroke-linecap="round"/><path d="M169 312l-48 126 75 25 55-102 54 102 76-26-51-125z" fill="url(#jersey)" stroke="#17112f" stroke-width="8"/><path d="M195 331h110l-11 89H207z" fill="#10102b" opacity=".34"/><text x="250" y="391" text-anchor="middle" font-family="Orbitron" font-size="34" font-weight="900" fill="#fff" opacity=".92">07</text><path d="M170 324l-97 92 31 34 117-76z" fill="#ffd8c5" stroke="#21183e" stroke-width="7"/><path d="M330 326l100 75-28 38-121-68z" fill="#ffd8c5" stroke="#21183e" stroke-width="7"/><circle cx="97" cy="434" r="25" fill="none" stroke="#ff3fbd" stroke-width="10" filter="url(#glow)"/><circle cx="425" cy="417" r="25" fill="none" stroke="#42e8ff" stroke-width="10" filter="url(#glow)"/><path d="M205 424l-47 105 75 5 19-93 20 93 74-6-46-104z" fill="url(#pants)" stroke="#17112f" stroke-width="8"/><path d="M157 528l77 6-10 44h-93zM275 534l75-6 27 50h-93z" fill="#111026" stroke="#17112f" stroke-width="7"/><path d="M130 574h98M278 578h104" stroke="#42e8ff" stroke-width="10" stroke-linecap="round" opacity=".8"/></svg></div>`}
function avatarSVG(seed='a'){const palettes=[['#42e8ff','#536dff'],['#ff3fbd','#714cff'],['#ffd45c','#ff7b54']];let p=palettes[Math.abs(hashCode(seed))%palettes.length];return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="av${Math.abs(hashCode(seed))}" x1="0" x2="1"><stop stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="#0b0920"/><circle cx="50" cy="50" r="43" fill="url(#av${Math.abs(hashCode(seed))})" opacity=".9"/><path d="M22 42c2-25 17-36 31-36 18 0 29 12 31 36-14-9-21-15-32-14-11 0-18 5-30 14z" fill="#19142f"/><circle cx="50" cy="50" r="26" fill="#ffd8c5"/><path d="M36 50c5 4 10 4 15 0M55 50c5 4 10 4 15 0" fill="none" stroke="#34204f" stroke-width="4" stroke-linecap="round"/><circle cx="44" cy="50" r="2.5" fill="#1c1530"/><circle cx="62" cy="50" r="2.5" fill="#1c1530"/><path d="M43 62c5 3 9 3 14 0" fill="none" stroke="#c86d83" stroke-width="2.5" stroke-linecap="round"/><path d="M29 77c11-10 31-10 42 0" fill="#10102b"/><path d="M32 79h36" stroke="#42e8ff" stroke-width="4" stroke-linecap="round"/></svg>`}
function hashCode(s){let h=0;for(let i=0;i<String(s).length;i++)h=((h<<5)-h)+String(s).charCodeAt(i)|0;return h}


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
  if(!rows.length)rows=JSON.parse(localStorage.getItem('pjokArenaLocalBoardV3')||'[]');
  rows=rows.filter(x=>x.username!=='__sepuh__');
  const current=rows.find(x=>x.username===user?.username);if(current)current._me=true;
  const top=[rows[1],rows[0],rows[2]];
  shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">🏆 LEADERBOARD</div></div><div class="card"><div class="eyebrow">GLOBAL RANKING • SEASON 01</div><h2>⚔️ ARENA RANK</h2><div class="sepuh"><div><div><span class="crown">👑</span> <strong>PERINGKAT SEPUH</strong></div><span class="small">Denny Agustiana S.Pd • legenda arena</span></div><strong class="score">999,999,999</strong></div>${top.some(Boolean)?`<div class="podium">${top.map((x,i)=>x?`<div class="pod ${i===1?'first':''}"><div class="medal">${i===1?'🥇':i===0?'🥈':'🥉'}</div><div class="avatar-anime">${avatarSVG(x.username||x.full_name)}</div><b>${esc(x.full_name||x.name)}</b><span class="small">${esc(x.class_name||x.class)}</span><strong>${Number(x.total_score||x.score||0).toLocaleString('id-ID')}</strong></div>`:`<div class="pod" style="visibility:hidden"></div>`).join('')}</div>`:''}<div class="rank-list">${rows.map((x,i)=>`<div class="rank ${x._me?'me':''}"><div class="num">#${i+1}</div><div class="who"><b>${esc(x.full_name||x.name)} ${x._me?'• KAMU':''}</b><span>${esc(x.username)} • ${esc(x.class_name||x.class)}</span></div><div class="points">${Number(x.total_score||x.score||0).toLocaleString('id-ID')}</div></div>`).join('')}</div><p class="small" style="margin-top:16px">🌐 Data ranking diambil dari semua pemain yang terhubung ke arena online.</p></div>`)
}

function initials(name){return String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}
function achievements(){const defs=[['first','🎮','FIRST MATCH','Selesaikan 1 pertandingan'],['score1000','⭐','1000 POINT','Kumpulkan 1000 total skor'],['sharp','🎯','SHARP SHOOTER','Capai 25 jawaban benar'],['combo5','🔥','COMBO MASTER','Capai combo x5']];shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">ACHIEVEMENT</div></div><div class="card"><div class="eyebrow">COLLECTION</div><h2>🎖️ PENCAPAIAN</h2>${defs.map(d=>`<div class="achievement ${(user.achievements||[]).includes(d[0])?'':'locked'}"><span style="font-size:30px">${d[1]}</span><div><b>${d[2]}</b><br><span class="small">${d[3]}</span></div></div>`).join('')}</div>`)}
function statistics(){const acc=user.played?Math.round(user.correct/user.played*100):0;shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">STATISTIK</div></div><div class="card"><div class="eyebrow">PLAYER DATA</div><h2>📊 ${esc(user.username)}</h2><div class="stats"><div class="stat">MATCH<b>${user.matches}</b></div><div class="stat">SOAL<b>${user.played}</b></div><div class="stat">BENAR<b>${user.correct}</b></div><div class="stat">AKURASI<b>${acc}%</b></div></div><div class="stats"><div class="stat">TOTAL XP<b>${user.totalXP}</b></div><div class="stat">TOTAL SKOR<b>${user.totalScore}</b></div><div class="stat">BEST COMBO<b>x${user.bestCombo}</b></div><div class="stat">KELAS<b>${esc(user.class)}</b></div></div></div>`)}
function showCategories(){shell(`<div class="topbar"><button class="btn alt smallbtn" onclick="dashboard()">← MENU</button><div class="brand">MATERI</div></div><div class="card"><div class="eyebrow">QUESTION BANK</div><h2>📚 KATEGORI PJOK</h2>${cats.map(c=>`<div class="rank"><div class="num">📘</div><div class="who"><b>${esc(c)}</b><span>Materi pada bank soal</span></div><div class="points">${QUESTIONS.filter(q=>q.c===c).length}</div></div>`).join('')}</div>`)}
async function logout(){if(!confirm('Keluar dari akun di perangkat ini?'))return;clearInterval(state.timer);clearResume();localStorage.removeItem(USER_KEY);user=null;session=null;online=false;await db.auth.signOut();register()}
window.addEventListener('beforeunload',()=>{if(state.qs?.length&&!state.answered&&state.i<state.qs.length){saveResume()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.qs?.length&&!state.answered&&state.i<state.qs.length)saveResume()});
boot();
