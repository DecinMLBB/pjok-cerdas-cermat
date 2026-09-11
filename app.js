/* PJOK ARENA FINAL — UI ala mobile anime game */
const SUPABASE_URL = "https://krgdmlbecoookynlbrpj.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ph95R9n3FIXv7RHOyO33XA_WQlCNQJT";
let sb = null;
try { if (window.supabase) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch(e) {}

const A = "assets/home/hero.jpg";
const AV = "assets/profile/avatar-sheet-100.png";
const state = {
  screen:"home", sound:true, user:JSON.parse(localStorage.getItem("pjokArenaUserV2")||"null"),
  quiz:null, results:JSON.parse(localStorage.getItem("pjokArenaResults")||"[]"),
  categories:["Semua","Bola Basket","Bola Voli","Kasti","Pencak Silat","Atletik","Senam","Gerak Berirama","Kebugaran Jasmani"]
};
const $ = s => document.querySelector(s);
const esc = s => String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

function avatarStyle(index=1, size=80){
  const i=Math.max(1,Math.min(100,Number(index)||1))-1;
  const col=i%10,row=Math.floor(i/10);
  return `width:${size}px;height:${size}px;background-image:url("${AV}");background-size:${size*10}px ${size*10}px;background-position:${-col*size}px ${-row*size}px;background-repeat:no-repeat;`;
}
function avatarDiv(index=1, cls="avatar"){ return `<div class="${cls} avatar-sprite" style="${avatarStyle(index, cls.includes("mini")?32:cls.includes("profile")?92:75)}"></div>`; }
function beep(freq=600,dur=.07){
  if(!state.sound) return;
  try{ const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();
  o.frequency.value=freq;o.type="sine";g.gain.value=.025;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+dur); }catch(e){}
}
function setNav(){document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.nav===state.screen));}
function shell(html){ $("#screen").innerHTML=html; setNav(); window.scrollTo(0,0); }

function home(){
 state.screen="home";
 const u=state.user;
 shell(`<section>
  <div class="hero">
    <img class="hero-img" src="${A}" alt="PJOK Arena anime">
    <div class="hero-copy">
      <div class="kicker">SMP • KELAS VII • SEASON 01</div>
      <h1>JAGA SPORTIVITAS!<br><em>RAIH PRESTASI!</em></h1>
      <p>Uji pengetahuan PJOK kamu dan kejar peringkat tertinggi.</p>
      <button class="btn-primary" data-action="start">▶ PLAY — MULAI QUIZ</button>
    </div>
  </div>
  <div class="home-title">ARENA MENU</div>
  <div class="menu-grid">
    ${menu("▤","MULAI QUIZ","Uji pengetahuan PJOK kamu!","start")}
    ${menu("▦","MATERI PJOK","Pelajari materi dan teori","materials")}
    ${menu("🎮","GAME SERU","Tantang kemampuanmu","games")}
    ${menu("📣","PENGUMUMAN","Info terbaru dari guru","notice")}
    ${menu("👤","TENTANG PA DENNY","Sosial media & profil","profile")}
  </div>
  <div style="display:flex;gap:8px;margin-top:12px">
    <button class="btn-secondary" style="flex:1" data-action="leaderboard">♛ LEADERBOARD</button>
    <button class="btn-secondary" style="flex:1" data-action="settings">⚙ PENGATURAN</button>
  </div>
  <div class="panel" style="margin-top:12px;padding:12px">
    <b style="font-size:12px">${u?`👋 ${esc(u.username)} • ${esc(u.className)}`:"👤 Guest"}</b>
    <div style="color:#718bad;font-size:10px;margin-top:2px">${u?"Progres tersimpan di perangkat ini.":"Klik MULAI QUIZ untuk daftar."}</div>
  </div>
 </section>`);
}
function menu(icon,title,desc,action){return `<button class="menu-card" data-action="${action}"><div class="menu-icon">${icon}</div><div><h3>${title}</h3><p>${desc}</p></div><div class="chev">›</div></button>`}

function register(){
 state.screen="profile";
 state.pendingAvatarIndex=Number((state.user||{}).avatarIndex||1);
 const u=state.user||{};
 const selected=Number(u.avatarIndex||1);
 shell(`<div class="page-head"><button class="icon-btn" data-action="home">‹</button><div><h2>PROFILE</h2><p>Pilih identitas pemain arena</p></div></div>
 <div class="panel profile-form">
  <div class="profile-preview">${avatarDiv(selected,"profile-picker-preview")}</div>
  <div class="selected-avatar-label">AVATAR <b id="avatarNumber">${String(selected).padStart(2,"0")}</b></div>
  <div class="avatar-grid">${Array.from({length:100},(_,n)=>{const i=n+1;return `<button class="avatar-choice ${i===selected?"selected":""}" data-avatar-index="${i}" aria-label="Avatar ${i}"><span class="avatar-cell" style="${avatarStyle(i,64)}"></span><small>${String(i).padStart(2,"0")}</small></button>`}).join("")}</div>
  <div class="field"><label>USERNAME</label><input id="username" maxlength="20" value="${esc(u.username||"")}" placeholder="contoh: denny"></div>
  <div class="field"><label>NAMA LENGKAP</label><input id="fullname" maxlength="60" value="${esc(u.fullName||"")}" placeholder="Nama lengkap"></div>
  <div class="field"><label>KELAS</label><select id="className">${["VII A","VII B","VII C","VII D","VII E","VII F","VII G"].map(x=>`<option ${u.className===x?"selected":""}>${x}</option>`).join("")}</select></div>
  <button class="btn-primary" data-action="saveProfile">💾 SIMPAN PROFIL</button>
 </div>
 <div class="panel" style="margin-top:12px"><b style="font-size:13px">Tentang data</b><p style="font-size:11px;color:#8fa7c8;line-height:1.6">Pilih 1 dari 100 avatar. Pilihan avatar, nama, username, dan kelas tersimpan di perangkat ini.</p></div>`);
}

function leaderboard(){
 state.screen="leaderboard";
 let rows=[...state.results]
   .filter(r => r && !String(r.id||"").startsWith("demo"))
   .filter(r => Number(r.score) >= 0)
   .sort((a,b)=>Number(b.score||0)-Number(a.score||0))
   .slice(0,20);
 const top=rows.slice(0,3), rest=rows.slice(3);
 shell(`<div class="page-head"><button class="icon-btn" data-action="home">‹</button><div><h2>LEADERBOARD</h2><p>PJOK ARENA</p></div></div>
 <div class="seph"><div class="crown">♛</div><small>PERINGKAT SEPUH</small><strong>999999999</strong><span>Denny Agustiana S.Pd • legenda arena</span></div>
 ${rows.length ? `<div class="podium">
  ${pod(top[1],2,"🥈","second")}
  ${pod(top[0],1,"🥇","first")}
  ${pod(top[2],3,"🥉","third")}
 </div>
 <div class="panel"><div style="font-family:Orbitron;font-size:12px;margin-bottom:10px">RANKING ARENA</div>
 <div class="rank-list">${rest.map((r,i)=>rankRow(i+4,r)).join("")}</div></div>`
 : `<div class="panel empty-ranking">
    <div style="font-size:42px">🏆</div>
    <h3>BELUM ADA PESERTA</h3>
    <p>Belum ada siswa yang menyelesaikan quiz.</p>
    <button class="btn-primary" data-action="start">▶ MULAI QUIZ</button>
   </div>`}`);
}
function pod(r,n,medal,cl){r=r||{username:"Player",className:"VII",score:0};return `<div class="pod ${cl}"><div class="medal">${medal}</div>${avatarDiv(r.avatarIndex||1,"avatar")}<b>${esc(r.username)}</b><small>${esc(r.className)}</small><div class="score">${Number(r.score).toLocaleString("id-ID")}</div></div>`}
function rankRow(n,r){return `<div class="rank-row"><div class="rank-no">#${n}</div>${avatarDiv(r.avatarIndex||1,"mini")}<div class="rank-name">${esc(r.username)}<span class="rank-class">${esc(r.className)}</span></div><div class="rank-score">${Number(r.score).toLocaleString("id-ID")}</div></div>`}

function materials(){
 state.screen="materials";
 const cats=["Bola Basket","Bola Voli","Kasti","Pencak Silat","Atletik","Senam Lantai","Gerak Berirama","Kebugaran Jasmani"];
 shell(`<div class="page-head"><button class="icon-btn" data-action="home">‹</button><div><h2>MATERI PJOK</h2><p>Fase D • Kelas VII</p></div></div>
 <div class="tabs">${cats.map(c=>`<button class="tab active">${c}</button>`).join("")}</div>
 <div class="material-list">${cats.map((c,i)=>`<div class="material"><img src="${A}" alt=""><div><h3>${c}</h3><p>Materi PJOK kelas VII • teori dan latihan</p></div><span class="chev">›</span></div>`).join("")}</div>`);
}

function games(){
 state.screen="games";
 shell(`<div class="page-head"><button class="icon-btn" data-action="home">‹</button><div><h2>GAME SERU</h2><p>Tantang kemampuanmu</p></div></div>
 <div class="menu-grid">
  ${menu("🏆","TEBAK PJOK","Tantang pengetahuanmu dengan cepat!","start")}
  ${menu("⚡","SPEED QUIZ","Jawab secepat mungkin!","start")}
 </div>
 <div class="hero" style="margin-top:12px;min-height:300px"><img class="hero-img" style="min-height:300px" src="${A}" alt=""><div class="hero-copy"><div class="kicker">PLAY AND IMPROVE</div><h1 style="font-size:28px">NAIKKAN<br><em>RANK-MU!</em></h1></div></div>`);
}
function notice(){
 state.screen="notice";
 shell(`<div class="page-head"><button class="icon-btn" data-action="home">‹</button><div><h2>PENGUMUMAN</h2><p>Info dari guru</p></div></div>
 <div class="notice"><h3>📣 Pengumuman Grup</h3><p>Assalamualaikum wr.wb<br><br>Untuk besok jangan lupa membawa baju olahraga, sepatu olahraga, dan membawa air minum.<br><br>Terima kasih 🙏</p><small style="color:#6e89ad">— Pa Denny</small></div>`);
}

function startQuiz(){
 if(!state.user){ register(); return; }
 state.screen="quiz";
 const pool=(typeof questions!=="undefined"?questions:[]).slice();
 const shuffled=pool.sort(()=>Math.random()-.5).slice(0,10);
 state.quiz={items:shuffled,index:0,score:0,correct:0,combo:0,bestCombo:0,locked:false,time:15,timer:null};
 renderQuiz();
}
function renderQuiz(){
 const q=state.quiz.items[state.quiz.index];
 clearInterval(state.quiz.timer); state.quiz.time=15; state.quiz.locked=false;
 state.quiz.timer=setInterval(()=>{state.quiz.time--; const t=$("#timer");if(t)t.textContent=state.quiz.time+"s"; if(state.quiz.time<=0){clearInterval(state.quiz.timer);choose(-1)}},1000);
 const p=Math.round((state.quiz.index/state.quiz.items.length)*100);
 shell(`<div class="page-head"><button class="icon-btn" data-action="quitQuiz">‹</button><div><h2>QUIZ PJOK</h2><p>${state.quiz.index+1}/${state.quiz.items.length}</p></div><div class="timer" id="timer">15s</div></div>
 <div class="progress"><i style="width:${p}%"></i></div>
 <div class="panel">
  <div style="color:#7da4d0;font-size:10px">${esc(q.c||"PJOK")}</div>
  <div class="question">${esc(q.q)}</div>
  <div class="answers">${q.o.map((x,i)=>`<button class="answer" data-answer="${i}"><span>${"ABCD"[i]}</span>${esc(x)}</button>`).join("")}</div>
 </div>`);
}
function choose(i){
 if(state.quiz.locked)return; state.quiz.locked=true; clearInterval(state.quiz.timer);
 const q=state.quiz.items[state.quiz.index], ok=i===q.a;
 document.querySelectorAll(".answer").forEach((b,idx)=>{b.disabled=true;if(idx===q.a)b.classList.add("correct");if(idx===i&&!ok)b.classList.add("wrong")});
 if(ok){state.quiz.correct++;state.quiz.combo++;state.quiz.bestCombo=Math.max(state.quiz.bestCombo,state.quiz.combo);state.quiz.score+=100+(state.quiz.combo-1)*25+Math.max(0,state.quiz.time)*2;beep(880,.09)}
 else {state.quiz.combo=0;beep(180,.12)}
 setTimeout(()=>{state.quiz.index++; if(state.quiz.index>=state.quiz.items.length)finishQuiz();else renderQuiz()},650);
}
function finishQuiz(){
 clearInterval(state.quiz.timer);
 const q=state.quiz, xp=q.correct*20+q.bestCombo*5;
 const result={username:state.user.username,className:state.user.className,avatarIndex:state.user.avatarIndex||1,score:q.score,correct:q.correct,total:q.items.length,xp,createdAt:Date.now()};
 state.results.unshift(result);state.results=state.results.slice(0,30);localStorage.setItem("pjokArenaResults",JSON.stringify(state.results));
 if(sb) trySubmit(result);
 state.screen="result";
 shell(`<div class="page-head"><button class="icon-btn" data-action="home">‹</button><div><h2>HASIL QUIZ</h2><p>Match selesai</p></div></div>
 <div class="panel result"><div class="result-art"><img src="${A}" alt=""></div><div class="kicker" style="margin-top:12px">SKOR KAMU</div><div class="result-score">${q.score}</div><div class="result-badge">${q.correct>=8?"KEREN!":q.correct>=5?"BAGUS!":"TERUS BERLATIH!"}</div><p style="color:#a6bad5;font-size:11px">${q.correct}/${q.items.length} benar • XP +${xp} • Best combo ${q.bestCombo}</p><button class="btn-primary" data-action="start" style="margin-top:8px">↻ ULANGI</button><button class="btn-secondary" data-action="home" style="width:100%;margin-top:8px">⌂ KEMBALI KE MENU</button></div>`);
}
async function trySubmit(r){
  // Safe fallback: the UI remains functional even when the online DB is not configured.
  // For a secure production leaderboard, use the Supabase RLS/RPC schema from the setup.
  try{
    const {data:{user}}=await sb.auth.getUser();
    if(!user) return;
  }catch(e){}
}
function settings(){state.screen="settings";shell(`<div class="page-head"><button class="icon-btn" data-action="home">‹</button><div><h2>PENGATURAN</h2><p>Atur arena kamu</p></div></div><div class="panel"><button class="btn-secondary" data-action="sound" style="width:100%">🔊 Suara: ${state.sound?"ON":"OFF"}</button><p style="font-size:11px;color:#839abd;line-height:1.6">Tema anime/game aktif. Data quiz lokal tetap tersimpan di browser.</p></div>`)}
function about(){register()}

document.addEventListener("click",e=>{
 const av=e.target.closest("[data-avatar-index]");
 if(av){
   state.pendingAvatarIndex=Number(av.dataset.avatarIndex);
   document.querySelectorAll(".avatar-choice").forEach(x=>x.classList.toggle("selected",x===av));
   const n=$("#avatarNumber"); if(n)n.textContent=String(state.pendingAvatarIndex).padStart(2,"0");
   const prev=$(".profile-picker-preview"); if(prev){prev.setAttribute("style",avatarStyle(state.pendingAvatarIndex,92));}
   beep(720,.05); return;
 }
 const nav=e.target.closest("[data-nav]"); if(nav){const n=nav.dataset.nav;if(n==="home")home();else if(n==="quiz")startQuiz();else if(n==="leaderboard")leaderboard();else register();return}
 const b=e.target.closest("[data-action]");if(!b)return;const a=b.dataset.action;
 if(a==="home")home();else if(a==="back"||a==="quitQuiz")home();else if(a==="start")startQuiz();else if(a==="leaderboard")leaderboard();else if(a==="materials")materials();else if(a==="games")games();else if(a==="notice")notice();else if(a==="profile")register();else if(a==="settings")settings();else if(a==="sound"){state.sound=!state.sound;$("#soundBtn").textContent=state.sound?"♫":"×";if(state.screen==="settings")settings()}else if(a==="saveProfile"){const u={username:$("#username").value.trim(),fullName:$("#fullname").value.trim(),className:$("#className").value,avatarIndex:Number(state.pendingAvatarIndex||state.user?.avatarIndex||1)};if(!u.username||!u.fullName){alert("Isi username dan nama lengkap dulu.");return}state.user=u;localStorage.setItem("pjokArenaUserV2",JSON.stringify(u));home()}
 const ans=e.target.closest("[data-answer]");if(ans)choose(Number(ans.dataset.answer));
});
home();


/* ===== PJOK ARENA BACKSOUND YOUTUBE ===== */
const PJOK_MUSIC_VIDEO = "BpcdiYYEmvE";
let pjokMusicOn = localStorage.getItem("pjokMusicOn") === "1";

function pjokMusicMount(){
  if(document.getElementById("pjok-yt-music")) return;
  const wrap=document.createElement("div");
  wrap.id="pjok-music-wrap";
  wrap.innerHTML=`
    <iframe id="pjok-yt-music"
      width="200" height="200"
      src="https://www.youtube.com/embed/${PJOK_MUSIC_VIDEO}?autoplay=0&loop=1&playlist=${PJOK_MUSIC_VIDEO}&controls=0&playsinline=1&rel=0"
      title="PJOK Arena Background Music"
      frameborder="0"
      allow="autoplay; encrypted-media"
      style="position:fixed;left:-220px;bottom:0;width:200px;height:200px;opacity:.01;pointer-events:none;">
    </iframe>`;
  document.body.appendChild(wrap);
}

function pjokMusicButton(){
  if(document.getElementById("pjok-music-btn")) return;
  const b=document.createElement("button");
  b.id="pjok-music-btn";
  b.type="button";
  b.innerHTML=pjokMusicOn ? "🔊" : "🔇";
  b.title=pjokMusicOn ? "Matikan backsound" : "Nyalakan backsound";
  b.setAttribute("aria-label",b.title);
  b.onclick=()=>{
    pjokMusicOn=!pjokMusicOn;
    localStorage.setItem("pjokMusicOn",pjokMusicOn?"1":"0");
    pjokMusicApply(true);
  };
  document.body.appendChild(b);
}

function pjokMusicApply(fromUser=false){
  const frame=document.getElementById("pjok-yt-music");
  if(!frame) return;
  const base=`https://www.youtube.com/embed/${PJOK_MUSIC_VIDEO}?loop=1&playlist=${PJOK_MUSIC_VIDEO}&controls=0&playsinline=1&rel=0`;
  if(pjokMusicOn){
    frame.src=base+"&autoplay=1";
  }else{
    frame.src=base+"&autoplay=0";
  }
  const b=document.getElementById("pjok-music-btn");
  if(b){
    b.innerHTML=pjokMusicOn ? "🔊" : "🔇";
    b.title=pjokMusicOn ? "Matikan backsound" : "Nyalakan backsound";
  }
}

function pjokMusicInit(){
  pjokMusicMount();
  pjokMusicButton();
  // Do not force sound autoplay on first page load on mobile.
  // If the user previously enabled it, the first user interaction starts it.
  if(pjokMusicOn){
    const start=()=>{
      pjokMusicApply(true);
      document.removeEventListener("click",start);
      document.removeEventListener("touchstart",start);
    };
    document.addEventListener("click",start,{once:true});
    document.addEventListener("touchstart",start,{once:true});
  }
}
document.addEventListener("DOMContentLoaded",pjokMusicInit);
