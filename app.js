
const app=document.getElementById('app');
const USER_KEY='pjokArenaUserV2';
const LOCAL_KEY='pjokArenaLocalBoardV2';
let user=JSON.parse(localStorage.getItem(USER_KEY)||'null');
let selectedMode=20, selectedCategory='Semua';
let state={qs:[],i:0,score:0,xp:0,correct:0,combo:0,bestCombo:0,time:15,timer:null};

const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
const cats=[...new Set(QUESTIONS.map(q=>q.c))];
const modes=[
  {n:10,title:'Quick Match',desc:'10 soal • santai',time:15},
  {n:20,title:'Standard Match',desc:'20 soal • rekomendasi',time:15},
  {n:30,title:'Challenge',desc:'30 soal • gaspol',time:12}
];

function shell(content){app.innerHTML=`<main class="wrap">${content}</main>`}
function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);requestAnimationFrame(()=>x.classList.add('show'));setTimeout(()=>{x.classList.remove('show');setTimeout(()=>x.remove(),250)},1800)}
function register(){
 shell(`<section class="hero"><div class="logo">⚡ PJOK ARENA ⚡</div><h1>CLASS VII</h1><p class="muted">Cerdas Cermat PJOK — Arena Belajar Bergaya Gaming</p>
 <div class="card" style="max-width:600px;margin:22px auto 0;text-align:left"><h2>🎮 Buat Profil Pemain</h2>
 <p class="small">Isi identitas sebelum masuk arena.</p>
 <label>Username</label><input id="u" maxlength="20" placeholder="contoh: denny07">
 <label>Nama Lengkap</label><input id="n" maxlength="60" placeholder="Nama lengkap">
 <label>Kelas</label><select id="k">${['VII A','VII B','VII C','VII D','VII E','VII F','VII G'].map(x=>`<option>${x}</option>`).join('')}</select>
 <br><br><button class="btn" onclick="saveUser()">MULAI ARENA 🚀</button></div></section>`);
}
function saveUser(){
 const username=document.getElementById('u').value.trim(),name=document.getElementById('n').value.trim(),cls=document.getElementById('k').value;
 if(!username||!name)return alert('Username dan nama lengkap wajib diisi.');
 user={username,name,class:cls,totalXP:0,totalScore:0,played:0,correct:0,matches:0,bestCombo:0,achievements:[]};
 localStorage.setItem(USER_KEY,JSON.stringify(user));dashboard();
}
function dashboard(){
 shell(`<div class="topbar"><div><div class="logo">⚡ PJOK ARENA</div><span class="small">Halo, ${esc(user.name)} • ${esc(user.class)}</span></div><button class="btn alt" style="width:auto" onclick="logout()">Keluar</button></div>
 <div class="card"><div class="stats"><div class="stat">⭐ XP<br><b>${user.totalXP}</b></div><div class="stat">🏆 Skor<br><b>${user.totalScore}</b></div><div class="stat">🎯 Akurasi<br><b>${user.played?Math.round(user.correct/user.played*100):0}%</b></div></div>
 <div class="section-title"><h2>⚔️ Pilih Pertandingan</h2><span class="small">${QUESTIONS.length} soal tersedia</span></div>
 <div class="modegrid">${modes.map(m=>`<button class="choice" onclick="setupQuiz(${m.n})"><b>${m.title}</b><br><span class="small">${m.desc}</span></button>`).join('')}</div>
 <div class="menu"><div class="tile" onclick="leaderboard()"><span class="icon">🏆</span><b>Leaderboard</b><span class="small">Peringkat di perangkat ini</span></div>
 <div class="tile" onclick="achievements()"><span class="icon">🎖️</span><b>Achievement</b><span class="small">Lihat pencapaian</span></div>
 <div class="tile" onclick="statistics()"><span class="icon">📊</span><b>Statistik</b><span class="small">Riwayat performa</span></div>
 <div class="tile" onclick="showCategories()"><span class="icon">📚</span><b>Materi</b><span class="small">Kategori dari bank soal</span></div></div></div>`);
}
function setupQuiz(mode){
 selectedMode=mode;
 shell(`<div class="topbar"><button class="btn alt" style="width:auto" onclick="dashboard()">← Menu</button><div class="logo">SETUP MATCH</div></div>
 <div class="card"><h2>⚡ ${mode} SOAL</h2><p class="muted">Pilih kategori. Kalau “Semua”, soal akan diambil secara acak dari seluruh bank.</p>
 <div class="catgrid">${['Semua',...cats].map(c=>`<button class="choice ${selectedCategory===c?'active':''}" onclick="pickCat(${JSON.stringify(c)},${mode})">${esc(c)}</button>`).join('')}</div>
 <br><button class="btn" onclick="startQuiz(${mode})">MULAI PERTANDINGAN 🔥</button></div>`);
}
function pickCat(c,m){selectedCategory=c;setupQuiz(m)}
function startQuiz(mode){
 const pool=selectedCategory==='Semua'?QUESTIONS:QUESTIONS.filter(q=>q.c===selectedCategory);
 if(!pool.length)return alert('Kategori ini belum memiliki soal.');
 state.mode=mode;state.qs=shuffle(pool).slice(0,Math.min(mode,pool.length));state.i=0;state.score=0;state.xp=0;state.correct=0;state.combo=0;state.bestCombo=0;showQ();
}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function showQ(){
 clearInterval(state.timer);state.answered=false;state.time=(state.mode===30?12:15);
 const q=state.qs[state.i], pct=state.i/state.qs.length*100;
 shell(`<div class="topbar"><button class="btn alt" style="width:auto" onclick="dashboard()">← Menu</button><div class="timer" id="timer">00:${String(state.time).padStart(2,'0')}</div></div>
 <div class="card"><div class="quizHead"><b>SOAL ${state.i+1}/${state.qs.length}</b><span class="badge">${esc(q.c)}</span></div>
 <div class="progress"><i style="width:${pct}%"></i></div><div class="qtext">${esc(q.q)}</div>
 <div class="opts">${q.o.map((x,j)=>`<button class="opt" id="o${j}" onclick="answer(${j})">${String.fromCharCode(65+j)}. ${esc(x)}</button>`).join('')}</div><div id="feedback"></div></div>`);
 state.timer=setInterval(()=>{state.time--;const el=document.getElementById('timer');if(el){el.textContent='00:'+String(Math.max(0,state.time)).padStart(2,'0');if(state.time<=5)el.classList.add('danger')}if(state.time<=0){clearInterval(state.timer);answer(-1)}},1000);
}
function answer(j){
 if(state.answered)return;state.answered=true;clearInterval(state.timer);
 const q=state.qs[state.i],ok=j===q.a;
 if(j>=0)document.getElementById('o'+j).classList.add(ok?'correct':'wrong');
 document.getElementById('o'+q.a).classList.add('correct');
 let pts=ok?(q.d===2?30:20):0;
 if(ok){state.combo++;state.bestCombo=Math.max(state.bestCombo,state.combo);pts+=Math.min(state.combo*2,20)}else state.combo=0;
 state.score+=pts;state.xp+=pts;state.correct+=ok?1:0;
 const combo=state.combo>=2?`<div class="combo">🔥 COMBO x${state.combo}</div>`:'';
 document.getElementById('feedback').innerHTML=`<div class="feedback">${ok?'✅ BENAR! +'+pts+' poin':'❌ BELUM TEPAT'} ${combo}<br>${esc(q.e)}<br><span class="small">Sumber: ${esc(q.sourceRef||q.c)}</span><br><br><button class="btn" onclick="nextQ()">${state.i+1===state.qs.length?'LIHAT HASIL':'SOAL BERIKUTNYA →'}</button></div>`;
}
function nextQ(){if(state.i+1<state.qs.length){state.i++;showQ()}else finish()}
function finish(){
 clearInterval(state.timer);
 user.totalXP+=state.xp;user.totalScore+=state.score;user.played+=state.qs.length;user.correct+=state.correct;user.matches++;user.bestCombo=Math.max(user.bestCombo,state.bestCombo);
 const unlocked=[];
 if(user.matches>=1)unlocked.push('first');
 if(user.totalScore>=1000)unlocked.push('score1000');
 if(user.correct>=25)unlocked.push('sharp');
 if(user.bestCombo>=5)unlocked.push('combo5');
 user.achievements=[...new Set([...(user.achievements||[]),...unlocked])];
 localStorage.setItem(USER_KEY,JSON.stringify(user));saveLocalBoard();
 const acc=Math.round(state.correct/state.qs.length*100);
 shell(`<div class="hero"><div class="card"><div class="logo">MATCH COMPLETE</div><div class="resultScore">${state.score}</div><h2>🎉 ${state.correct}/${state.qs.length} benar</h2><p class="muted">Akurasi pertandingan: ${acc}% • Combo terbaik: x${state.bestCombo}</p>
 <div class="stats"><div class="stat">⭐ XP<br><b>+${state.xp}</b></div><div class="stat">🎯 Akurasi<br><b>${acc}%</b></div><div class="stat">🔥 Combo<br><b>x${state.bestCombo}</b></div></div>
 <button class="btn" onclick="setupQuiz(${state.mode})">MAIN LAGI 🔥</button><br><br><button class="btn alt" onclick="dashboard()">KEMBALI KE MENU</button></div></div>`);
}
function saveLocalBoard(){
 const board=JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]');
 const idx=board.findIndex(x=>x.username===user.username);
 const row={username:user.username,name:user.name,class:user.class,score:user.totalScore};
 if(idx>=0)board[idx]=row;else board.push(row);
 board.sort((a,b)=>b.score-a.score);localStorage.setItem(LOCAL_KEY,JSON.stringify(board.slice(0,50)));
}
function leaderboard(){
 const board=JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]');
 const rows=[...board.filter(x=>x.username!==user.username),{username:user.username,name:user.name,class:user.class,score:user.totalScore}].sort((a,b)=>b.score-a.score).slice(0,20);
 shell(`<div class="topbar"><button class="btn alt" style="width:auto" onclick="dashboard()">← Menu</button><div class="logo">LEADERBOARD</div></div><div class="card"><h2>🏆 Peringkat Arena</h2>
 <div class="rank"><span>👑 <strong>PERINGKAT SEPUH</strong><br><b>Denny Agustiana S.Pd</b></span><b>999999999</b></div>
 ${rows.length?rows.map((x,i)=>`<div class="rank"><span>#${i+1} ${esc(x.name)}<br><span class="small">${esc(x.username)} • ${esc(x.class)}</span></span><b>${x.score}</b></div>`).join(''):'<p class="muted">Belum ada skor pemain di perangkat ini.</p>'}
 <p class="small">Catatan: leaderboard ini masih lokal pada browser/perangkat. Database online akan kita pasang pada fase berikutnya.</p></div>`);
}
function achievements(){
 const defs=[['first','🎮','First Match','Selesaikan 1 pertandingan'],['score1000','⭐','1000 POINT','Kumpulkan 1000 total skor'],['sharp','🎯','Sharp Shooter','Capai 25 jawaban benar'],['combo5','🔥','Combo Master','Capai combo x5']];
 shell(`<div class="topbar"><button class="btn alt" style="width:auto" onclick="dashboard()">← Menu</button><div class="logo">ACHIEVEMENT</div></div><div class="card"><h2>🎖️ Pencapaian</h2>${defs.map(d=>`<div class="achievement ${(user.achievements||[]).includes(d[0])?'':'locked'}"><span style="font-size:28px">${d[1]}</span><div><b>${d[2]}</b><br><span class="small">${d[3]}</span></div></div>`).join('')}</div>`);
}
function statistics(){
 const acc=user.played?Math.round(user.correct/user.played*100):0;
 shell(`<div class="topbar"><button class="btn alt" style="width:auto" onclick="dashboard()">← Menu</button><div class="logo">STATISTIK</div></div><div class="card"><h2>📊 Statistik ${esc(user.username)}</h2><div class="stats"><div class="stat">Pertandingan<br><b>${user.matches}</b></div><div class="stat">Soal Dijawab<br><b>${user.played}</b></div><div class="stat">Benar<br><b>${user.correct}</b></div></div><div class="stats"><div class="stat">Akurasi<br><b>${acc}%</b></div><div class="stat">Total XP<br><b>${user.totalXP}</b></div><div class="stat">Combo Terbaik<br><b>x${user.bestCombo}</b></div></div></div>`);
}
function showCategories(){
 shell(`<div class="topbar"><button class="btn alt" style="width:auto" onclick="dashboard()">← Menu</button><div class="logo">MATERI</div></div><div class="card"><h2>📚 Kategori Bank Soal</h2>${cats.map(c=>`<div class="rank"><span><b>${esc(c)}</b></span><span class="small">${QUESTIONS.filter(q=>q.c===c).length} soal</span></div>`).join('')}</div>`);
}
function logout(){clearInterval(state.timer);localStorage.removeItem(USER_KEY);user=null;register()}
if(user)dashboard();else register();
