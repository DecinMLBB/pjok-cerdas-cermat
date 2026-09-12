/* PJOK ARENA — stable mobile build */
const SUPABASE_URL = "https://krgdmlbecoookynlbrpj.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ph95R9n3FIXv7RHOyO33XA_WQlCNQJT";
const ASSET = {
  homeHero: "assets/home/hero.jpg",
  homeBg: "assets/home/bg-home.jpg",
  quizBg: "assets/quiz/quiz-bg.jpg",
  leaderboardBg: "assets/leaderboard/leaderboard-bg.jpg",
  profileBg: "assets/profile/profile-bg.jpg",
  resultBg: "assets/result/result-bg.jpg",
  noticeBg: "assets/announcement/announcement-bg.jpg",
  aboutBg: "assets/about/about-bg.jpg",
  anime: "assets/pjok-anime.jpg",
  avatars: "assets/profile/avatar-sheet-100.png"
};

let sb = null;
try { if (window.supabase) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch (e) { console.warn("Supabase init:", e); }

const state = {
  screen: "home",
  user: loadSavedUser(),
  results: readJSON("pjokArenaResults", []),
  onlineRows: [],
  quiz: null,
  pendingAvatarIndex: 1,
  selectedCategory: "Semua",
  sound: localStorage.getItem("pjokSoundFx") !== "0",
  musicOn: localStorage.getItem("pjokMusicOn") !== "0",
  authReady: false,
  onlineAvailable: false,
  history: ["home"]
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
function readJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
function num(v) { return Number.isFinite(Number(v)) ? Number(v) : 0; }
function fmt(v) { return num(v).toLocaleString("id-ID"); }

function avatarSrc(index = 1) {
  const i = Math.max(1, Math.min(100, Number(index) || 1));
  return `assets/profile/avatars/${String(i).padStart(2,"0")}.png`;
}
function avatarStyle(index = 1, size = 80) {
  return `width:${size}px;height:${size}px;`;
}
function avatarDiv(index = 1, cls = "avatar") {
  const size = cls.includes("mini") ? 34 : cls.includes("profile") ? 96 : 76;
  return `<img class="avatar-sprite ${cls}" src="${avatarSrc(index)}" width="${size}" height="${size}" alt="Avatar ${Number(index)||1}" loading="lazy">`;
}
function loadSavedUser() {
  const keys = ["pjokArenaUserV3","pjokArenaUserV2","pjokArenaUser","pjokProfile"];
  for (const key of keys) {
    const u = readJSON(key, null);
    if (u && typeof u === "object" && u.username) {
      const normalized = {username:String(u.username), fullName:String(u.fullName || u.full_name || u.username), className:String(u.className || u.class_name || "VII A"), avatarIndex:Math.max(1,Math.min(100,Number(u.avatarIndex || u.avatar_index) || 1))};
      saveJSON("pjokArenaUserV3", normalized);
      return normalized;
    }
  }
  return null;
}
function persistUser(user) {
  saveJSON("pjokArenaUserV3", user);
  saveJSON("pjokArenaUserV2", user);
}
function beep(freq = 600, dur = .06) {
  if (!state.sound) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const c = new Ctx(), o = c.createOscillator(), g = c.createGain();
    o.frequency.value = freq; o.type = "sine"; g.gain.value = .018;
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur);
    setTimeout(() => c.close?.(), 150);
  } catch {}
}

function setPage(page) {
  state.screen = page;
  document.body.dataset.page = page;
  $$(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.nav === page));
}
function shell(html, page = state.screen) {
  setPage(page);
  const screen = $("#screen");
  screen.innerHTML = html;
  screen.scrollTop = 0;
  window.scrollTo(0,0);
  refreshHeader();
}
function refreshHeader() {
  const sound = $("#soundBtn");
  if (sound) sound.textContent = state.sound ? "♫" : "×";
  const home = $("#homeBtn");
  if (home) home.style.visibility = state.screen === "home" ? "hidden" : "visible";
}
function go(page, replace = false) {
  if (!replace && state.screen !== page) state.history.push(page);
  if (page === "home") home();
  else if (page === "quiz") quizMenu();
  else if (page === "leaderboard") leaderboard();
  else if (page === "profile") profile();
  else if (page === "materials") materials();
  else if (page === "games") games();
  else if (page === "notice") notice();
  else if (page === "about") about();
  else if (page === "settings") settings();
}
function back() {
  if (state.quiz) { quitQuiz(); return; }
  state.history.pop();
  const previous = state.history[state.history.length - 1] || "home";
  go(previous, true);
}

function menu(icon, title, desc, action, cls = "") {
  return `<button class="menu-card ${cls}" data-action="${action}"><span class="menu-icon">${icon}</span><span class="menu-copy"><b>${title}</b><small>${desc}</small></span><span class="chev">›</span></button>`;
}
function pageHead(title, sub, backAction = "back") {
  return `<div class="page-head"><button class="icon-btn" data-action="${backAction}" aria-label="Kembali">‹</button><div><h2>${title}</h2><p>${sub}</p></div></div>`;
}
function pageBackdrop(asset, extra = "") {
  return `<div class="page-backdrop" style="background-image:linear-gradient(180deg,rgba(3,10,25,.32),rgba(3,10,25,.92)),url('${asset}')"></div>${extra}`;
}

function home() {
  state.quiz = null;
  shell(`<section class="home-page">
    ${pageBackdrop(ASSET.homeBg)}
    <div class="hero">
      <img class="hero-img" src="${ASSET.homeHero}" alt="Karakter PJOK Arena">
      <div class="hero-overlay"></div>
      <div class="hero-copy">
        <span class="kicker">SMP • KELAS VII • SEASON 01</span>
        <h1>JAGA SPORTIVITAS!<br><em>RAIH PRESTASI!</em></h1>
        <p>Uji pengetahuan PJOK, kumpulkan skor, dan kejar peringkat tertinggi.</p>
        <button class="btn-primary" data-action="start">▶ MULAI QUIZ</button>
      </div>
    </div>
    <div class="section-title"><span>ARENA MENU</span><small>${state.user ? `PLAYER: ${esc(state.user.username)}` : "GUEST MODE"}</small></div>
    <div class="menu-grid">
      ${menu("▤", "MULAI QUIZ", "10 soal PJOK kelas VII", "start", "accent-blue")}
      ${menu("▦", "MATERI PJOK", "Ringkasan materi tiap bab", "materials", "accent-green")}
      ${menu("⚡", "GAME SERU", "Mode cepat dan tantangan", "games", "accent-pink")}
      ${menu("📣", "PENGUMUMAN", "Info terbaru dari Pa Denny", "notice", "accent-red")}
      ${menu("◉", "TENTANG PA DENNY", "Profil dan sosial media", "about", "accent-purple")}
    </div>
    <div class="quick-grid">
      <button class="quick-card" data-action="leaderboard"><b>♛</b><span>LEADERBOARD</span><small>Ranking arena</small></button>
      <button class="quick-card" data-action="profile"><b>◎</b><span>PROFILE</span><small>${state.user ? "Edit identitas" : "Buat identitas"}</small></button>
    </div>
  </section>`, "home");
}


const AUTH_EMAIL_DOMAIN = "@pjokarena.local";
function authEmail(username){
  return `${String(username||"").trim().toLowerCase()}${AUTH_EMAIL_DOMAIN}`;
}
function validUsername(u){ return /^[a-zA-Z0-9._-]{3,20}$/.test(String(u||"")); }
function validPassword(p){ return typeof p === "string" && p.length >= 6; }
function authScreen(mode="login", message="") {
  const login = mode === "login";
  document.body.classList.add("auth-screen");
  shell(`<section class="auth-page">
    ${pageBackdrop(ASSET.homeBg)}
    <div class="auth-card panel">
      <div class="auth-logo"><span>PJOK</span> ARENA</div>
      <span class="kicker">SMP • KELAS VII</span>
      <h1>${login ? "SELAMAT DATANG" : "BUAT AKUN"}</h1>
      <p class="auth-sub">${login ? "Masuk untuk melanjutkan progres dan profil kamu." : "Buat akun siswa. Username dan password wajib diingat."}</p>
      ${message ? `<div class="auth-message">${esc(message)}</div>` : ""}
      ${!login ? `<label class="field"><span>NAMA LENGKAP</span><input id="authFullName" maxlength="60" autocomplete="name" placeholder="Nama lengkap"></label>
      <label class="field"><span>KELAS</span><select id="authClassName">${["VII A","VII B","VII C","VII D","VII E","VII F","VII G","VII H"].map(x=>`<option>${x}</option>`).join("")}</select></label>` : ""}
      <label class="field"><span>USERNAME</span><input id="authUsername" maxlength="20" autocomplete="username" placeholder="contoh: denny123"></label>
      <label class="field"><span>PASSWORD</span><input id="authPassword" type="password" minlength="6" maxlength="72" autocomplete="${login?"current-password":"new-password"}" placeholder="Minimal 6 karakter"></label>
      ${!login ? `<div class="auth-note">Username: 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.</div>` : ""}
      <button class="btn-primary full" data-action="${login?"login":"register"}">${login?"🔐 MASUK":"🚀 BUAT AKUN"}</button>
      <button class="btn-secondary full auth-switch" data-action="toggleAuth">${login?"Belum punya akun? DAFTAR":"Sudah punya akun? MASUK"}</button>
    </div>
  </section>`, "auth");
  $$(".bottom-nav").forEach(n=>n.style.display="none");
  $("#homeBtn")?.style.setProperty("visibility","hidden");
}
function showAppNav(){ document.body.classList.remove("auth-screen"); $$(".bottom-nav").forEach(n=>n.style.display="grid"); }
async function registerAccount(){
  if(!sb){ toast("Koneksi Supabase belum siap.","warn"); return; }
  const username=$("#authUsername")?.value.trim();
  const password=$("#authPassword")?.value || "";
  const fullName=$("#authFullName")?.value.trim();
  const className=$("#authClassName")?.value || "VII A";
  if(!validUsername(username)){toast("Username 3–20 karakter: huruf, angka, titik, _ atau -.","warn");return;}
  if(!validPassword(password)){toast("Password minimal 6 karakter.","warn");return;}
  if(!fullName){toast("Nama lengkap wajib diisi.","warn");return;}
  const btn=$("[data-action='register']"); if(btn){btn.disabled=true;btn.textContent="MEMBUAT AKUN...";}
  try{
    const {data,error}=await sb.auth.signUp({email:authEmail(username),password,options:{data:{username,full_name:fullName,class_name:className}}});
    if(error) throw error;
    if(!data.user) throw new Error("Akun tidak berhasil dibuat.");
    if(!data.session){ throw new Error("Konfirmasi email masih aktif di Supabase. Matikan Confirm email terlebih dahulu, karena akun siswa memakai username tanpa email."); }
    state.user={username,fullName,className,avatarIndex:1};
    state.pendingAvatarIndex=1; persistUser(state.user);
    const {error:pe}=await sb.from("players").upsert({id:data.user.id,username,full_name:fullName,class_name:className,avatar_index:1,score:0,correct:0,total:0,best_combo:0,updated_at:new Date().toISOString()},{onConflict:"id"});
    if(pe) throw pe;
    state.authReady=true; showAppNav(); toast("Akun berhasil dibuat!","ok"); setTimeout(home,250);
  }catch(e){ toast(e.message||"Gagal membuat akun.","warn"); if(btn){btn.disabled=false;btn.textContent="🚀 BUAT AKUN";} }
}
async function loginAccount(){
  if(!sb){toast("Koneksi Supabase belum siap.","warn");return;}
  const username=$("#authUsername")?.value.trim(); const password=$("#authPassword")?.value||"";
  if(!validUsername(username)){toast("Masukkan username yang valid.","warn");return;}
  if(!password){toast("Password wajib diisi.","warn");return;}
  const btn=$("[data-action='login']"); if(btn){btn.disabled=true;btn.textContent="MEMERIKSA...";}
  try{
    const {data,error}=await sb.auth.signInWithPassword({email:authEmail(username),password});
    if(error) throw error;
    const user=data.user;
    const {data:row,error:re}=await sb.from("players").select("username,full_name,class_name,avatar_index").eq("id",user.id).maybeSingle();
    if(re) throw re;
    if(!row) throw new Error("Profil akun tidak ditemukan. Hubungi admin/guru.");
    state.user={username:row.username,fullName:row.full_name,className:row.class_name,avatarIndex:Number(row.avatar_index)||1};
    persistUser(state.user); state.authReady=true; showAppNav(); toast("Berhasil masuk!","ok"); setTimeout(home,200);
  }catch(e){toast("Username atau password salah.","warn");if(btn){btn.disabled=false;btn.textContent="🔐 MASUK";}}
}
async function bootAuth(){
  if(!sb){authScreen("login","Supabase belum terhubung.");initMusic();return;}
  try{
    const {data:{session}}=await sb.auth.getSession();
    if(session){
      const {data:row}=await sb.from("players").select("username,full_name,class_name,avatar_index").eq("id",session.user.id).maybeSingle();
      if(row){state.user={username:row.username,fullName:row.full_name,className:row.class_name,avatarIndex:Number(row.avatar_index)||1};persistUser(state.user);state.authReady=true;showAppNav();home();initMusic();return;}
      await sb.auth.signOut({scope:"local"});
    }
  }catch(e){console.warn("Auth boot:",e.message||e);}
  state.user=null; authScreen("login"); initMusic();
}

function profile(editing = false) {
  const u = state.user;

  // Setelah registrasi, Profile menjadi dashboard/statistik.
  // Form hanya dibuka melalui tombol EDIT PROFIL.
  if (u && !editing) {
    const results = state.results.filter(r => r && r.username === u.username);
    const totalQuiz = results.length;
    const bestScore = results.reduce((m,r)=>Math.max(m, num(r.score)), 0);
    const totalCorrect = results.reduce((s,r)=>s+num(r.correct), 0);
    const totalQuestions = results.reduce((s,r)=>s+num(r.total), 0);
    const accuracy = totalQuestions ? Math.round((totalCorrect/totalQuestions)*100) : 0;
    const bestCombo = results.reduce((m,r)=>Math.max(m, num(r.bestCombo)), 0);
    const recent = results.slice(0,5);

    shell(`<section>
      ${pageBackdrop(ASSET.profileBg)}
      ${pageHead("PROFILE", "Dashboard pemain arena")}
      <div class="profile-dashboard panel">
        <div class="profile-identity">
          <div class="profile-ring">${avatarDiv(u.avatarIndex || 1, "profile-picker-preview")}</div>
          <div class="profile-identity-copy">
            <span class="kicker">PLAYER PROFILE</span>
            <h2>${esc(u.fullName || u.username)}</h2>
            <p>@${esc(u.username)} • ${esc(u.className || "VII A")}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><b>${totalQuiz}</b><small>QUIZ SELESAI</small></div>
          <div class="stat-card"><b>${fmt(bestScore)}</b><small>SKOR TERBAIK</small></div>
          <div class="stat-card"><b>${accuracy}%</b><small>AKURASI</small></div>
          <div class="stat-card"><b>${bestCombo}x</b><small>BEST COMBO</small></div>
        </div>

        <div class="panel-title">RIWAYAT QUIZ <small>${totalQuiz} pertandingan</small></div>
        <div class="history-list">
          ${recent.length ? recent.map((r,i)=>`
            <div class="history-row">
              <span>#${i+1}</span>
              <div><b>${fmt(r.score)} POIN</b><small>${num(r.correct)}/${num(r.total)} benar • combo ${num(r.bestCombo)}x</small></div>
              <strong>${num(r.xp)} XP</strong>
            </div>`).join("") : `<div class="empty-state">Belum ada quiz. Yuk mulai pertandingan pertama!</div>`}
        </div>

        <div class="profile-actions">
          <button class="btn-primary" data-action="editProfile">✏️ EDIT PROFIL</button>
          <button class="btn-secondary full" data-action="logout">↪ LOG OUT</button>
        </div>
      </div>
    </section>`, "profile");
    return;
  }

  const selected = Number(u?.avatarIndex || 1);
  state.pendingAvatarIndex = selected;
  shell(`<section>
    ${pageBackdrop(ASSET.profileBg)}
    ${pageHead("PROFILE", u ? "Edit identitas pemain arena" : "Buat identitas pemain arena")}
    <div class="panel profile-panel">
      <div class="profile-hero">
        <div class="profile-ring">${avatarDiv(selected, "profile-picker-preview")}</div>
        <div class="profile-label">AVATAR <b id="avatarNumber">${String(selected).padStart(2,"0")}</b></div>
        <small>100 karakter tersedia</small>
      </div>
      <div class="avatar-grid">${Array.from({length:100}, (_, n) => {
        const i=n+1;
        return `<button class="avatar-choice ${i===selected?"selected":""}" data-avatar-index="${i}" aria-label="Avatar ${i}"><img class="avatar-cell" src="${avatarSrc(i)}" width="62" height="62" alt="Avatar ${i}" loading="lazy"><small>${String(i).padStart(2,"0")}</small></button>`;
      }).join("")}</div>
      <div class="form-grid">
        <label class="field"><span>USERNAME</span><input id="username" maxlength="20" autocomplete="off" value="${esc(u?.username||"")}" placeholder="contoh: denny"></label>
        <label class="field"><span>NAMA LENGKAP</span><input id="fullname" maxlength="60" autocomplete="name" value="${esc(u?.fullName||"")}" placeholder="Nama lengkap"></label>
        <label class="field"><span>KELAS</span><select id="className">${["VII A","VII B","VII C","VII D","VII E","VII F","VII G","VII H"].map(x=>`<option ${u?.className===x?"selected":""}>${x}</option>`).join("")}</select></label>
        <button class="btn-primary" data-action="saveProfile">💾 SIMPAN PROFIL</button>
      </div>
    </div>
    <div class="hint-card">Akun tersimpan online. Gunakan username + password yang sama untuk masuk lagi dari perangkat lain.</div>
  </section>`, "profile");
}

async function saveProfile() {
  const username = $("#username")?.value.trim();
  const fullName = $("#fullname")?.value.trim();
  const className = $("#className")?.value;
  if (!username || !fullName) { toast("Username dan nama lengkap wajib diisi.", "warn"); return; }
  if(!validUsername(username)){toast("Username tidak valid.","warn");return;}
  if(!sb){toast("Supabase belum siap.","warn");return;}
  try{
    const {data:{user}}=await sb.auth.getUser(); if(!user) throw new Error("Sesi login habis. Silakan masuk lagi.");
    const updated={username,fullName,className,avatarIndex:Number(state.pendingAvatarIndex||1)};
    const {error}=await sb.from("players").update({username,full_name:fullName,class_name:className,avatar_index:updated.avatarIndex,updated_at:new Date().toISOString()}).eq("id",user.id);
    if(error) throw error;
    state.user=updated; persistUser(updated); toast("Profil diperbarui.","ok"); setTimeout(profile,220);
  }catch(e){toast(e.message||"Gagal memperbarui profil.","warn");}
}

function leaderboard() {
  const local = cleanRows(state.results);
  const online = cleanRows(state.onlineRows);
  // Always merge local + online. This prevents an empty Supabase table
  // from wiping scores already saved on the student's device.
  const rows = mergeRows([...local, ...online]);
  shell(`<section>
    ${pageBackdrop(ASSET.leaderboardBg)}
    ${pageHead("LEADERBOARD", "PJOK ARENA • ranking tertinggi")}
    <div class="seph"><div class="crown">♛</div><small>PERINGKAT SEPUH</small><strong>999999999</strong><span>Denny Agustiana S.Pd • legenda arena</span></div>
    <div id="leaderboardContent">${leaderboardContent(rows)}</div>
  </section>`, "leaderboard");
  refreshOnlineLeaderboard();
}
function cleanRows(rows) {
  return (Array.isArray(rows) ? rows : []).filter(r => r && !String(r.id||"").startsWith("demo") && num(r.score) >= 0).map(r => ({
    id:r.id || r.user_id || `${r.username}-${r.className}`,
    username:r.username || "Player", fullName:r.fullName || r.full_name || "", className:r.className || r.class_name || "VII",
    avatarIndex:num(r.avatarIndex || r.avatar_index) || 1, score:num(r.score), correct:num(r.correct), total:num(r.total), bestCombo:num(r.bestCombo || r.best_combo), updatedAt:r.updatedAt || r.updated_at || 0
  })).sort((a,b)=>b.score-a.score || String(a.username).localeCompare(String(b.username))).slice(0,50);
}
function mergeRows(rows) {
  const map = new Map();
  rows.forEach(r => { const key = r.id || `${r.username}|${r.className}`; const old=map.get(key); if(!old || r.score > old.score) map.set(key,r); });
  return [...map.values()].sort((a,b)=>b.score-a.score).slice(0,50);
}
function leaderboardContent(rows) {
  if (!rows.length) return `<div class="panel empty-ranking"><div class="empty-icon">🏆</div><h3>BELUM ADA PESERTA</h3><p>Belum ada siswa yang menyelesaikan quiz.</p><button class="btn-primary" data-action="start">▶ MULAI QUIZ</button></div>`;
  const top=rows.slice(0,3), rest=rows.slice(3);
  return `<div class="podium">${pod(top[1],2,"🥈","second")}${pod(top[0],1,"🥇","first")}${pod(top[2],3,"🥉","third")}</div>
    <div class="panel rank-panel"><div class="panel-title">RANKING ARENA <small>${rows.length} peserta</small></div><div class="rank-list">${rest.map((r,i)=>rankRow(i+4,r)).join("")}</div></div>`;
}
function pod(r,n,medal,cl) {
  if (!r) return `<div class="pod ${cl} ghost"><div class="medal">${medal}</div><div class="ghost-avatar">?</div><b>KOSONG</b><small>—</small><div class="score">0</div></div>`;
  return `<div class="pod ${cl}"><div class="medal">${medal}</div>${avatarDiv(r.avatarIndex,"avatar") }<b>${esc(r.username)}</b><small>${esc(r.className)}</small><div class="score">${fmt(r.score)}</div></div>`;
}
function rankRow(n,r) { return `<div class="rank-row"><b class="rank-no">#${n}</b>${avatarDiv(r.avatarIndex,"mini")}<div class="rank-name">${esc(r.username)}<span>${esc(r.className)}</span></div><b class="rank-score">${fmt(r.score)}</b></div>`; }

async function refreshOnlineLeaderboard() {
  if (!sb) return;
  try {
    const { data, error } = await sb.from("players").select("id,username,full_name,class_name,avatar_index,score,correct,total,best_combo,updated_at").order("score", {ascending:false}).limit(50);
    if (error) throw error;
    state.onlineRows = data || []; state.onlineAvailable = true;
    const box=$("#leaderboardContent");
    if (box && state.screen === "leaderboard") {
      const merged = mergeRows([...cleanRows(state.results), ...cleanRows(state.onlineRows)]);
      box.innerHTML = leaderboardContent(merged);
    }
  } catch (e) {
    state.onlineAvailable = false;
    console.warn("Leaderboard online unavailable; local mode remains active.", e.message || e);
  }
}

/* ---------- MATERI PJOK ---------- */
/*
  DATA MATERI:
  Kalau nanti mau update materi, cukup ubah bagian MATERI_PJOK di bawah.
  Tampilan/UI tidak perlu diubah.
*/
const MATERI_PJOK = [
  {
    bab: "Bola Basket", icon: "🏀", tag: "BAB 1",
    ringkasan: "Bola basket adalah permainan beregu yang bertujuan memasukkan bola ke keranjang lawan. Permainan membutuhkan kerja sama, penguasaan bola, kecepatan mengambil keputusan, dan sportivitas.",
    tujuan: "Memahami teknik dasar dan aturan sederhana permainan bola basket.",
    teknik: [
      ["Passing", "Mengoper bola kepada teman. Contohnya chest pass, bounce pass, dan overhead pass."],
      ["Dribbling", "Menggiring bola dengan memantulkannya ke lantai. Dribble rendah membantu melindungi bola dari lawan."],
      ["Pivot", "Memutar badan dengan satu kaki tetap menjadi poros untuk melindungi atau mencari ruang operan."],
      ["Shooting", "Melempar bola menuju ring untuk memperoleh angka."],
      ["Rebound", "Mengambil kembali bola yang gagal masuk ke ring."]
    ],
    aturan: ["Satu tim memainkan 5 pemain di lapangan.", "Bola harus dimainkan sesuai aturan dribble, passing, dan langkah.", "Pelanggaran seperti traveling dan foul dapat merugikan tim."],
    inti: ["Kuasai passing dan dribbling.", "Gunakan pivot untuk melindungi bola.", "Kerja sama dan sportivitas sama pentingnya dengan mencetak angka."]
  },
  {
    bab: "Bola Voli", icon: "🏐", tag: "BAB 2",
    ringkasan: "Bola voli adalah permainan beregu yang dimainkan dengan melewatkan bola melewati net dan berusaha menjatuhkannya di daerah permainan lawan. Penguasaan passing, servis, serangan, dan pertahanan menjadi dasar permainan.",
    tujuan: "Memahami teknik dasar bola voli dan fungsi setiap gerakan.",
    teknik: [
      ["Passing bawah", "Menggunakan kedua lengan yang dirapatkan untuk menerima atau mengarahkan bola."],
      ["Passing atas", "Menggunakan ujung jari-jari untuk mengontrol bola dan memberikan umpan."],
      ["Servis", "Pukulan awal untuk memulai permainan atau rally."],
      ["Spike", "Pukulan serangan keras dan menukik ke daerah lawan."],
      ["Block", "Usaha membendung serangan lawan di dekat net."]
    ],
    aturan: ["Satu regu terdiri dari 6 pemain di lapangan.", "Bola diarahkan melewati net dan tidak boleh jatuh di daerah sendiri.", "Kerja sama, komunikasi, dan penempatan bola sangat penting."]
    ,
    inti: ["Passing untuk mengontrol bola.", "Servis untuk memulai rally.", "Spike untuk menyerang dan block untuk bertahan."]
  },
  {
    bab: "Permainan Kasti", icon: "⚾", tag: "BAB 3",
    ringkasan: "Kasti merupakan permainan bola kecil beregu yang menggabungkan kemampuan memukul, melempar, menangkap, dan berlari. Permainan menuntut kerja sama, kekompakan, ketangkasan, dan kecepatan.",
    tujuan: "Mengenal teknik dasar permainan kasti dan pentingnya kerja sama regu.",
    teknik: [
      ["Melempar", "Bola dapat dilempar melambung, mendatar, atau menyusur tanah sesuai kebutuhan permainan."],
      ["Menangkap", "Tangan dipersiapkan mengikuti arah datangnya bola agar bola dapat dikuasai dengan aman."],
      ["Memukul", "Pemukul mengarahkan bola ke tempat yang sulit dijangkau regu penjaga."],
      ["Berlari", "Pelari bergerak cepat menuju tiang atau tempat aman sesuai aturan permainan."]
    ],
    aturan: ["Permainan terdiri dari regu pemukul dan regu penjaga.", "Regu pemukul berusaha mendapatkan kesempatan berlari dan memperoleh nilai.", "Regu penjaga berusaha menangkap bola dan mematikan pelari sesuai aturan."]
    ,
    inti: ["Ketepatan lemparan dan tangkapan sangat penting.", "Pukul bola dengan terarah.", "Komunikasi antarpemain membuat regu lebih efektif."]
  },
  {
    bab: "Pencak Silat", icon: "🥋", tag: "BAB 4",
    ringkasan: "Pencak silat adalah seni bela diri yang mengembangkan keterampilan gerak, pertahanan, serangan, disiplin, dan sikap sportif. Latihan harus dilakukan dengan teknik yang benar dan mengutamakan keselamatan.",
    tujuan: "Memahami sikap dasar, gerakan serangan, pertahanan, dan nilai-nilai dalam pencak silat.",
    teknik: [
      ["Kuda-kuda", "Posisi kaki sebagai dasar keseimbangan dan kesiapan melakukan gerakan."],
      ["Sikap pasang", "Sikap siap untuk menghadapi lawan, menyerang, atau bertahan."],
      ["Pukulan", "Gerakan serangan menggunakan tangan dengan sasaran dan teknik yang terkontrol."],
      ["Tendangan", "Gerakan serangan menggunakan kaki yang dilakukan dengan keseimbangan dan kontrol."],
      ["Tangkisan", "Gerakan untuk membendung atau mengalihkan serangan lawan."]
    ],
    aturan: ["Latihan dilakukan dengan pengawasan dan kontrol gerakan.", "Hindari serangan keras pada teman saat latihan teknik.", "Kedisiplinan, pengendalian diri, dan sportivitas harus dijaga."]
    ,
    inti: ["Keseimbangan berasal dari kuda-kuda yang baik.", "Utamakan kontrol gerakan.", "Pencak silat bukan sekadar menyerang, tetapi juga disiplin dan membela diri."]
  },
  {
    bab: "Atletik — Lari Jarak Pendek", icon: "🏃", tag: "BAB 5",
    ringkasan: "Lari jarak pendek atau sprint adalah nomor atletik yang mengutamakan kecepatan dari start sampai garis finish. Pelari perlu memiliki reaksi cepat, koordinasi, kekuatan, dan teknik berlari yang efisien.",
    tujuan: "Memahami teknik start, fase berlari, dan memasuki garis finish.",
    teknik: [
      ["Start jongkok", "Start yang digunakan pada lari jarak pendek untuk menghasilkan dorongan awal yang kuat."],
      ["Fase akselerasi", "Tubuh secara bertahap meningkatkan kecepatan setelah start."],
      ["Teknik berlari", "Ayunan lengan dan langkah kaki harus terkoordinasi dengan posisi badan yang sesuai."],
      ["Finish", "Pelari mempertahankan kecepatan sampai melewati garis finish dan tidak berhenti terlalu awal."]
    ],
    aturan: ["Tetap berada pada lintasan sesuai ketentuan perlombaan.", "Reaksi terhadap aba-aba start harus diperhatikan.", "Kecepatan dipertahankan sampai melewati garis finish."]
    ,
    inti: ["Start yang baik membantu memperoleh kecepatan awal.", "Koordinasikan lengan dan kaki.", "Jangan mengurangi kecepatan sebelum garis finish."]
  },
  {
    bab: "Senam Lantai", icon: "🤸", tag: "BAB 6",
    ringkasan: "Senam lantai merupakan aktivitas senam yang dilakukan di atas matras dengan berbagai gerakan tubuh. Gerakan membutuhkan kelentukan, kekuatan, keseimbangan, koordinasi, dan keberanian yang terkontrol.",
    tujuan: "Mengenal gerakan dasar senam lantai dan memahami keselamatan saat berlatih.",
    teknik: [
      ["Guling depan", "Gerakan menggulingkan badan ke depan dengan tumpuan yang benar dan tubuh dikontrol."],
      ["Guling belakang", "Gerakan menggulingkan badan ke belakang dengan posisi tubuh dan tangan yang tepat."],
      ["Sikap lilin", "Posisi badan terlentang dengan kaki diangkat ke atas dan tubuh ditopang menggunakan tangan."],
      ["Keseimbangan", "Kemampuan mempertahankan posisi tubuh agar tetap stabil selama melakukan gerakan."]
    ],
    aturan: ["Gunakan matras dan area latihan yang aman.", "Lakukan pemanasan sebelum latihan.", "Gerakan baru sebaiknya dipelajari dengan bantuan guru atau pengawasan yang tepat."]
    ,
    inti: ["Keselamatan adalah prioritas.", "Gunakan teknik sesuai kemampuan.", "Kekuatan, kelentukan, dan keseimbangan perlu dilatih bertahap."]
  },
  {
    bab: "Gerak Berirama", icon: "🎵", tag: "BAB 7",
    ringkasan: "Gerak berirama adalah rangkaian gerakan tubuh yang dilakukan mengikuti irama musik atau hitungan. Aktivitas ini melatih koordinasi, kelentukan, keseimbangan, ketepatan gerak, dan kebugaran.",
    tujuan: "Memahami hubungan antara gerak tubuh, langkah, koordinasi, dan irama.",
    teknik: [
      ["Langkah kaki", "Gerakan kaki dilakukan mengikuti hitungan atau ketukan secara teratur."],
      ["Gerak tangan", "Gerakan tangan diselaraskan dengan langkah dan arah gerak tubuh."],
      ["Koordinasi", "Kemampuan menyatukan gerak kaki, tangan, dan tubuh agar rangkaian terlihat harmonis."],
      ["Irama", "Ketepatan gerakan mengikuti ketukan atau hitungan yang digunakan."]
    ],
    aturan: ["Ikuti hitungan atau irama dengan konsisten.", "Jaga jarak dengan teman saat bergerak.", "Sesuaikan intensitas latihan dengan kemampuan tubuh."]
    ,
    inti: ["Dengarkan irama.", "Koordinasikan tangan dan kaki.", "Lakukan gerakan secara teratur dan percaya diri."]
  },
  {
    bab: "Kebugaran Jasmani", icon: "💪", tag: "BAB 8",
    ringkasan: "Kebugaran jasmani adalah kemampuan tubuh melakukan aktivitas sehari-hari secara efektif tanpa mengalami kelelahan berlebihan. Kebugaran dibangun melalui latihan teratur, pola hidup sehat, istirahat, dan asupan yang baik.",
    tujuan: "Mengenal komponen kebugaran dan contoh latihan sederhana.",
    teknik: [
      ["Kekuatan", "Kemampuan otot menghasilkan tenaga. Contoh latihan: push-up atau squat."],
      ["Daya tahan", "Kemampuan tubuh melakukan aktivitas dalam waktu relatif lama. Contohnya latihan lari atau aktivitas aerobik."],
      ["Kecepatan", "Kemampuan melakukan gerakan dalam waktu singkat."],
      ["Kelentukan", "Kemampuan persendian bergerak dengan ruang gerak yang baik."],
      ["Kelincahan", "Kemampuan mengubah arah dan posisi tubuh dengan cepat dan terkontrol."]
    ],
    aturan: ["Lakukan pemanasan dan pendinginan.", "Latihan dilakukan bertahap sesuai kemampuan.", "Jaga hidrasi, pola makan, dan waktu istirahat."]
    ,
    inti: ["Latihan harus teratur.", "Kenali kemampuan tubuh sendiri.", "Kebugaran bukan hanya soal kuat, tetapi juga sehat dan bugar."]
  }
];

function materials() {
  shell(`<section>
    ${pageBackdrop(ASSET.quizBg)}
    ${pageHead("MATERI PJOK", "Ringkasan tiap bab • Kelas VII")}
    <div class="info-banner material-intro"><b>📚 BELAJAR SEBELUM BERTANDING</b><span>Pilih bab untuk membaca ringkasan, teknik dasar, aturan sederhana, dan poin yang wajib diingat.</span></div>
    <div class="material-list">
      ${MATERI_PJOK.map((t,i)=>`
        <button class="material material-enhanced" data-material="${i}">
          <div class="material-no">${String(i+1).padStart(2,"0")}</div>
          <div class="material-icon">${t.icon}</div>
          <div class="material-copy"><b>${esc(t.bab)}</b><small>${esc(t.ringkasan)}</small><em>${t.tag} • ${t.teknik.length} materi inti</em></div>
          <span>›</span>
        </button>`).join("")}
    </div>
  </section>`, "materials");
}

function materialDetail(i) {
  const t = MATERI_PJOK[i];
  if (!t) { materials(); return; }
  const qs = (typeof QUESTIONS !== "undefined" ? QUESTIONS : []).filter(q=>q.c===t.bab);
  shell(`<section>
    ${pageBackdrop(ASSET.quizBg)}
    ${pageHead(t.bab, `${t.tag} • Ringkasan PJOK kelas VII`)}
    <div class="lesson lesson-modern">
      <div class="lesson-hero">
        <div class="lesson-icon">${t.icon}</div>
        <div><span class="lesson-badge">${t.tag}</span><h3>${esc(t.bab)}</h3></div>
      </div>

      <div class="lesson-section">
        <div class="lesson-section-title">📖 RINGKASAN</div>
        <p>${esc(t.ringkasan)}</p>
      </div>

      <div class="lesson-section">
        <div class="lesson-section-title">🎯 TUJUAN BELAJAR</div>
        <p>${esc(t.tujuan)}</p>
      </div>

      <div class="lesson-section">
        <div class="lesson-section-title">⚡ TEKNIK / MATERI INTI</div>
        <div class="technique-list">
          ${t.teknik.map(x=>`<div class="technique-row"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join("")}
        </div>
      </div>

      <div class="lesson-section">
        <div class="lesson-section-title">📌 ATURAN & KESELAMATAN</div>
        <ul class="lesson-bullets">${t.aturan.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      </div>

      <div class="lesson-section lesson-highlight">
        <div class="lesson-section-title">🧠 WAJIB DIINGAT</div>
        <ul class="lesson-bullets">${t.inti.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      </div>

      <div class="lesson-quiz-box">
        <div><b>Siap menguji materi ini?</b><small>${qs.length} soal tersedia untuk bab ini.</small></div>
        <button class="btn-primary" data-action="startMaterialQuiz" data-material-index="${i}">🎯 QUIZ BAB INI</button>
      </div>
    </div>
  </section>`, "materials");
}

function games() {
  shell(`<section>${pageBackdrop(ASSET.resultBg)}${pageHead("GAME SERU", "Mode latihan PJOK")}
    <div class="game-hero"><span class="kicker">QUICK PLAY</span><h2>QUIZ RUSH</h2><p>10 pertanyaan • 15 detik per soal • combo bonus</p><button class="btn-primary" data-action="start">⚡ MAIN SEKARANG</button></div>
    <div class="quick-grid game-grid"><button class="quick-card" data-action="start"><b>🏆</b><span>CHALLENGE</span><small>Kejar skor tinggi</small></button><button class="quick-card" data-action="leaderboard"><b>♛</b><span>RANKING</span><small>Lihat posisi kamu</small></button></div>
  </section>`, "games");
}
function notice() {
  shell(`<section>${pageBackdrop(ASSET.noticeBg)}${pageHead("PENGUMUMAN", "Info dari Pa Denny")}
    <div class="notice-card"><span class="notice-tag">📣 PENGUMUMAN</span><h3>Persiapan Olahraga</h3><p>Assalamualaikum wr.wb<br><br>Untuk besok jangan lupa membawa baju olahraga, sepatu olahraga, dan air minum.</p><div class="notice-sign">— Pa Denny</div></div>
    <div class="hint-card">Pantau halaman ini untuk pengumuman terbaru.</div>
  </section>`, "notice");
}
function about() {
  shell(`<section>${pageBackdrop(ASSET.aboutBg)}${pageHead("TENTANG PA DENNY", "PJOK ARENA")}
    <div class="about-card"><img src="${ASSET.aboutBg}" alt="PJOK Arena"><div class="about-copy"><span class="kicker">PJOK ARENA</span><h2>Pa Denny</h2><p>Guru PJOK • Pembimbing Arena</p><div class="social-row"><a href="https://www.tiktok.com/@dennypjok" target="_blank" rel="noopener">TikTok <b>@dennypjok</b></a><a href="https://www.instagram.com/decin_4" target="_blank" rel="noopener">Instagram <b>@decin_4</b></a></div></div></div>
    <div class="hint-card">Website ini dibuat sebagai arena belajar PJOK untuk siswa SMP kelas VII.</div>
  </section>`, "about");
}
function settings() {
  shell(`<section>${pageHead("PENGATURAN", "Kontrol arena")}
    <div class="panel settings-list"><button class="setting-row" data-action="sound"><span>🔊 Efek suara</span><b>${state.sound?"ON":"OFF"}</b></button><button class="setting-row" data-action="music"><span>🎵 Backsound YouTube</span><b>${state.musicOn?"ON":"OFF"}</b></button><button class="setting-row" data-action="clearLocal"><span>🧹 Hapus data lokal</span><b>RESET</b></button></div>
    <div class="hint-card">Jangan reset kalau masih ingin mempertahankan profil dan riwayat skor di perangkat ini.</div>
  </section>`, "settings");
}

function quizMenu() {
  const cats = ["Semua", ...[...new Set((typeof QUESTIONS !== "undefined" ? QUESTIONS : []).map(q=>q.c))]];
  shell(`<section>${pageBackdrop(ASSET.quizBg)}${pageHead("PILIH QUIZ", "Tentukan mode permainan sebelum mulai")}
    <div class="quiz-intro panel"><span class="kicker">PJOK ARENA • QUIZ CENTER</span><h3>Mau main yang mana?</h3><p>Pilih mode. Profil kamu akan tetap tersimpan di perangkat ini.</p></div>
    <div class="quiz-modes">
      <button class="quiz-mode selected" data-quiz-mode="quick"><span>⚡</span><b>QUIZ CEPAT</b><small>10 soal acak • 15 detik/soal</small></button>
      <button class="quiz-mode" data-quiz-mode="sim"><span>🏆</span><b>SIMULASI</b><small>20 soal acak • tantangan penuh</small></button>
      <button class="quiz-mode" data-quiz-mode="chapter"><span>📚</span><b>LATIHAN BAB</b><small>Pilih materi PJOK yang ingin dilatih</small></button>
    </div>
    <div id="chapterPicker" class="chapter-picker panel" hidden><div class="panel-title">PILIH BAB</div><div class="category-grid">${cats.filter(x=>x!=="Semua").map(c=>`<button class="category-btn" data-quiz-category="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>
    <div class="panel quiz-selected"><span>MODE TERPILIH</span><b id="selectedModeLabel">QUIZ CEPAT</b><small id="selectedCategoryLabel">Semua materi</small></div>
    <button class="btn-primary" data-action="startSelectedQuiz">▶ MULAI SEKARANG</button>
  </section>`, "quiz");
}
function startQuiz(mode = "quick", category = "Semua") {
  if (!state.user) { profile(); toast("Buat profil dulu sebelum mulai quiz.", "warn"); return; }
  const all = typeof QUESTIONS !== "undefined" ? [...QUESTIONS] : [];
  let pool = category === "Semua" ? all : all.filter(q => q.c === category);
  if (!pool.length) pool = all;
  const count = mode === "sim" ? Math.min(20,pool.length) : Math.min(10,pool.length);
  pool = shuffle(pool).slice(0, count);
  state.selectedCategory = category;
  state.quiz = { items:pool, index:0, score:0, correct:0, combo:0, bestCombo:0, time:15, timer:null, locked:false, mode, category };
  renderQuiz();
}
function renderQuiz() {
  const q=state.quiz.items[state.quiz.index];
  clearInterval(state.quiz.timer); state.quiz.time=15; state.quiz.locked=false;
  state.quiz.timer=setInterval(()=>{
    state.quiz.time--;
    const t=$("#timer"); if(t) t.textContent=`${state.quiz.time}s`;
    if(state.quiz.time<=0){ clearInterval(state.quiz.timer); choose(-1); }
  },1000);
  const pct=Math.round((state.quiz.index/state.quiz.items.length)*100);
  shell(`<section>${pageBackdrop(ASSET.quizBg)}
    <div class="quiz-top"><button class="icon-btn" data-action="quitQuiz">‹</button><div><h2>QUIZ PJOK</h2><p>${state.quiz.index+1} / ${state.quiz.items.length}</p></div><div class="timer" id="timer">15s</div></div>
    <div class="quiz-progress"><i style="width:${pct}%"></i></div>
    <div class="panel question-panel"><div class="question-meta"><span>${esc(q.c||"PJOK")}</span><b>COMBO x${state.quiz.combo}</b></div><h3>${esc(q.q)}</h3><div class="answers">${q.o.map((x,i)=>`<button class="answer" data-answer="${i}"><span>${"ABCD"[i]}</span><b>${esc(x)}</b></button>`).join("")}</div></div>
  </section>`, "quiz");
}
function choose(i) {
  if (!state.quiz || state.quiz.locked) return;
  state.quiz.locked=true; clearInterval(state.quiz.timer);
  const q=state.quiz.items[state.quiz.index], ok=i===q.a;
  $$(".answer").forEach((b,idx)=>{ b.disabled=true; if(idx===q.a)b.classList.add("correct"); if(idx===i&&!ok)b.classList.add("wrong"); });
  if(ok){ state.quiz.correct++; state.quiz.combo++; state.quiz.bestCombo=Math.max(state.quiz.bestCombo,state.quiz.combo); state.quiz.score += 100 + (state.quiz.combo-1)*25 + Math.max(0,state.quiz.time)*2; beep(900,.08); }
  else { state.quiz.combo=0; beep(180,.1); }
  setTimeout(()=>{ state.quiz.index++; if(state.quiz.index>=state.quiz.items.length) finishQuiz(); else renderQuiz(); }, 600);
}
function quitQuiz(){ clearInterval(state.quiz?.timer); state.quiz=null; home(); }
async function finishQuiz() {
  clearInterval(state.quiz.timer);
  const q=state.quiz;
  const xp=q.correct*20+q.bestCombo*5;
  const result={id:null, username:state.user.username, fullName:state.user.fullName, className:state.user.className, avatarIndex:state.user.avatarIndex||1, score:q.score, correct:q.correct, total:q.items.length, bestCombo:q.bestCombo, xp, updatedAt:Date.now()};
  state.results.unshift(result); state.results=state.results.slice(0,30); saveJSON("pjokArenaResults",state.results);
  await ensureAuth(); await syncPlayerResult(result);
  state.quiz=null;
  shell(`<section>${pageBackdrop(ASSET.resultBg)}${pageHead("HASIL QUIZ", "Match selesai", "home")}
    <div class="result-card"><div class="result-art"><img src="${ASSET.resultBg}" alt="Hasil quiz"></div><span class="kicker">SKOR KAMU</span><div class="result-score">${fmt(q.score)}</div><div class="result-badge">${q.correct>=8?"🔥 KEREN!":q.correct>=5?"⚡ BAGUS!":"💪 TERUS BERLATIH!"}</div><p>${q.correct}/${q.items.length} benar • XP +${xp} • Best combo ${q.bestCombo}</p><button class="btn-primary" data-action="start">↻ ULANGI QUIZ</button><button class="btn-secondary full" data-action="leaderboard">♛ LIHAT LEADERBOARD</button></div>
  </section>`, "result");
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

async function ensureAuth() {
  if (!sb) return false;
  try { const {data:{session}}=await sb.auth.getSession(); state.authReady=!!session; return !!session; }
  catch(e){ console.warn("Auth check:",e.message||e); return false; }
}
async function syncPlayerProfile() {
  if (!sb || !state.user) return;
  try {
    await ensureAuth();
    const {data:{user}}=await sb.auth.getUser(); if(!user) return;
    const payload={id:user.id,username:state.user.username,full_name:state.user.fullName,class_name:state.user.className,avatar_index:state.user.avatarIndex,updated_at:new Date().toISOString()};
    await sb.from("players").upsert(payload,{onConflict:"id"});
  } catch(e) { console.warn("Profile sync skipped:", e.message || e); }
}
async function syncPlayerResult(r) {
  if (!sb || !state.user) return;
  try {
    await ensureAuth();
    const {data:{user}}=await sb.auth.getUser(); if(!user) return;
    const {data:old}=await sb.from("players").select("score").eq("id",user.id).maybeSingle();
    if(old && num(old.score)>r.score) return;
    const payload={id:user.id,username:r.username,full_name:r.fullName,class_name:r.className,avatar_index:r.avatarIndex,score:r.score,correct:r.correct,total:r.total,best_combo:r.bestCombo,updated_at:new Date().toISOString()};
    const {error}=await sb.from("players").upsert(payload,{onConflict:"id"}); if(error) throw error;
  } catch(e) { console.warn("Online score sync skipped:", e.message || e); }
}

async function logout() {
  if (!state.user) { authScreen("login"); return; }
  if (!confirm("Log out dari akun ini? Kamu bisa masuk lagi dengan username dan password yang sama.")) return;
  try { await sb?.auth?.signOut({scope:"local"}); } catch(e){ console.warn("Logout:",e.message||e); }
  ["pjokArenaUserV3","pjokArenaUserV2","pjokArenaUser","pjokProfile"].forEach(k=>localStorage.removeItem(k));
  state.user=null; state.authReady=false; state.onlineRows=[];
  toast("Berhasil log out.","ok"); setTimeout(()=>authScreen("login"),250);
}

function toast(message, type="ok") {
  const old=$(".toast"); old?.remove();
  const t=document.createElement("div"); t.className=`toast ${type}`; t.textContent=message; document.body.appendChild(t);
  setTimeout(()=>t.classList.add("show"),10); setTimeout(()=>t.remove(),2200);
}

/* ---------- UI events ---------- */
document.addEventListener("click", e => {
  const av=e.target.closest("[data-avatar-index]");
  if(av){
    state.pendingAvatarIndex=Number(av.dataset.avatarIndex);
    $$(".avatar-choice").forEach(x=>x.classList.toggle("selected",x===av));
    const n=$("#avatarNumber"); if(n)n.textContent=String(state.pendingAvatarIndex).padStart(2,"0");
    const p=$(".profile-picker-preview"); if(p){p.src=avatarSrc(state.pendingAvatarIndex);p.alt=`Avatar ${state.pendingAvatarIndex}`;}
    beep(720,.05); return;
  }
  const nav=e.target.closest("[data-nav]");
  if(nav){ const n=nav.dataset.nav; beep(520,.04); go(n); return; }
  const material=e.target.closest("[data-material]"); if(material){ materialDetail(Number(material.dataset.material)); return; }
  const modeBtn=e.target.closest("[data-quiz-mode]");
  if(modeBtn){
    $("#chapterPicker")?.toggleAttribute("hidden", modeBtn.dataset.quizMode !== "chapter");
    $$(".quiz-mode").forEach(x=>x.classList.toggle("selected",x===modeBtn));
    const mode=modeBtn.dataset.quizMode;
    const label=mode==="sim"?"SIMULASI":mode==="chapter"?"LATIHAN BAB":"QUIZ CEPAT";
    const sm=$("#selectedModeLabel"); if(sm) sm.textContent=label;
    if(mode!=="chapter"){const sc=$("#selectedCategoryLabel");if(sc)sc.textContent="Semua materi";}
    return;
  }
  const catBtn=e.target.closest("[data-quiz-category]");
  if(catBtn){
    $$(".category-btn").forEach(x=>x.classList.toggle("selected",x===catBtn));
    const sc=$("#selectedCategoryLabel"); if(sc)sc.textContent=catBtn.dataset.quizCategory;
    return;
  }
  const ans=e.target.closest("[data-answer]");
  if(ans){ choose(Number(ans.dataset.answer)); return; }
  const b=e.target.closest("[data-action]"); if(!b)return;
  const a=b.dataset.action;
  if(a==="home") home();
  else if(a==="back") back();
  else if(a==="quitQuiz") quitQuiz();
  else if(a==="start") startQuiz();
  else if(a==="startSelectedQuiz"){
    const mode=$(".quiz-mode.selected")?.dataset.quizMode || "quick";
    const category=mode==="chapter" ? $(".category-btn.selected")?.dataset.quizCategory : "Semua";
    if(mode==="chapter" && !category){ toast("Pilih bab dulu sebelum mulai.", "warn"); return; }
    startQuiz(mode,category || "Semua");
  }
  else if(a==="leaderboard") leaderboard();
  else if(a==="materials") materials();
  else if(a==="startMaterialQuiz"){ const idx=Number(b.dataset.materialIndex); const topic=MATERI_PJOK[idx]?.bab; if(topic) startQuiz("chapter",topic); }
  else if(a==="games") games();
  else if(a==="notice") notice();
  else if(a==="about") about();
  else if(a==="profile") profile();
  else if(a==="editProfile") profile(true);
  else if(a==="logout") logout();
  else if(a==="login") loginAccount();
  else if(a==="register") registerAccount();
  else if(a==="toggleAuth") authScreen($("[data-action=\"login\"]") ? "register" : "login");
  else if(a==="settings") settings();
  else if(a==="sound"){ state.sound=!state.sound; localStorage.setItem("pjokSoundFx",state.sound?"1":"0"); beep(700,.04); settings(); refreshHeader(); }
  else if(a==="music") pjokMusicToggle();
  else if(a==="saveProfile") saveProfile();
  else if(a==="clearLocal"){ if(confirm("Hapus profil dan riwayat skor di perangkat ini?")){ localStorage.removeItem("pjokArenaUserV3");localStorage.removeItem("pjokArenaUserV2");localStorage.removeItem("pjokArenaUser");localStorage.removeItem("pjokProfile");localStorage.removeItem("pjokArenaResults");state.user=null;state.results=[];toast("Data lokal dihapus.","ok");home();} }
});

$("#homeBtn")?.addEventListener("click",home);
$("#soundBtn")?.addEventListener("click",()=>{state.sound=!state.sound;localStorage.setItem("pjokSoundFx",state.sound?"1":"0");refreshHeader();});

/* ---------- YouTube background music ---------- */
const MUSIC_VIDEO="BpcdiYYEmvE";
let ytPlayer=null, ytReady=false, musicGesture=false;
function mountMusic(){
  if($("#pjok-music-wrap"))return;
  const wrap=document.createElement("div"); wrap.id="pjok-music-wrap";
  wrap.innerHTML='<div id="pjok-yt-music"></div>';
  document.body.appendChild(wrap);
  const btn=document.createElement("button"); btn.id="pjok-music-btn"; btn.type="button"; btn.addEventListener("click",()=>pjokMusicToggle()); document.body.appendChild(btn);
  refreshMusicButton();
}
function loadYT(){
  if(window.YT?.Player){window.onYouTubeIframeAPIReady?.();return;}
  if($("#youtube-iframe-api"))return;
  const s=document.createElement("script");s.id="youtube-iframe-api";s.src="https://www.youtube.com/iframe_api";document.head.appendChild(s);
}
window.onYouTubeIframeAPIReady=function(){
  if(ytPlayer)return;
  ytPlayer=new YT.Player("pjok-yt-music",{width:200,height:200,videoId:MUSIC_VIDEO,playerVars:{autoplay:0,controls:0,loop:1,playlist:MUSIC_VIDEO,playsinline:1,rel:0,modestbranding:1},events:{
    onReady:e=>{ytReady=true;e.target.setVolume(60);if(state.musicOn&&musicGesture)playMusic();},
    onStateChange:e=>{if(e.data===0&&state.musicOn)playMusic();},
    onAutoplayBlocked:()=>{toast("Tap tombol 🎵 kalau backsound belum bunyi.","warn");},
    onError:e=>console.warn("YouTube music error",e.data)
  }});
};
function playMusic(){if(!ytPlayer||!ytReady||!state.musicOn)return;try{ytPlayer.unMute();ytPlayer.setVolume(60);ytPlayer.playVideo();}catch{}}
function pauseMusic(){try{ytPlayer?.pauseVideo();}catch{}}
function refreshMusicButton(){const b=$("#pjok-music-btn");if(!b)return;b.textContent=state.musicOn?"🔊":"🔇";b.title=state.musicOn?"Matikan backsound":"Nyalakan backsound";}
function pjokMusicToggle(){state.musicOn=!state.musicOn;localStorage.setItem("pjokMusicOn",state.musicOn?"1":"0");musicGesture=true;refreshMusicButton();if(state.musicOn)playMusic();else pauseMusic();}
function initMusic(){
  mountMusic();loadYT();
  const first=()=>{musicGesture=true;if(state.musicOn)playMusic();document.removeEventListener("pointerdown",first);document.removeEventListener("keydown",first);};
  document.addEventListener("pointerdown",first,{passive:true});document.addEventListener("keydown",first,{passive:true});
}

/* Initial render */
bootAuth();
