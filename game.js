const COLORS = ["#2563eb","#e11d48","#16a34a","#9333ea"];
const EMOJIS = ["🔵","🔴","🟢","🟣"];
const QUESTIONS = [
["Ibu kota Indonesia adalah ...",["Jakarta","Bandung","Surabaya","Medan"],0],
["Hasil dari 8 × 7 adalah ...",["54","56","64","48"],1],
["Planet yang dikenal sebagai Planet Merah adalah ...",["Venus","Jupiter","Mars","Saturnus"],2],
["Hewan yang berkembang biak dengan bertelur disebut ...",["Vivipar","Ovipar","Mamalia","Omnivora"],1],
["Lambang sila pertama Pancasila adalah ...",["Bintang","Rantai","Pohon beringin","Kepala banteng"],0],
["Air membeku pada suhu ...",["0°C","10°C","50°C","100°C"],0],
["Sinonim kata 'cerdas' adalah ...",["Malas","Pintar","Lambat","Lemah"],1],
["Benua terbesar di dunia adalah ...",["Afrika","Eropa","Asia","Australia"],2],
["Hasil 144 ÷ 12 adalah ...",["10","11","12","14"],2],
["Alat untuk mengukur suhu adalah ...",["Barometer","Termometer","Penggaris","Kompas"],1],
["Proklamasi kemerdekaan Indonesia dibacakan pada ...",["17 Agustus 1945","1 Juni 1945","10 November 1945","20 Mei 1908"],0],
["Organ tubuh untuk memompa darah adalah ...",["Paru-paru","Hati","Jantung","Ginjal"],2],
["Bahasa Inggris dari 'buku' adalah ...",["Pen","Book","Table","Chair"],1],
["Hasil 25 + 37 adalah ...",["52","62","72","63"],1],
["Sumber energi utama bagi bumi adalah ...",["Bulan","Matahari","Angin","Batu"],1],
["Hewan pemakan tumbuhan disebut ...",["Karnivora","Herbivora","Omnivora","Insektivora"],1],
["Jumlah sisi pada segitiga adalah ...",["2","3","4","5"],1],
["Lawan kata 'tinggi' adalah ...",["Besar","Panjang","Rendah","Lebar"],2],
["Indonesia memiliki ... zona waktu.",["1","2","3","4"],2],
["Proses tumbuhan membuat makanan disebut ...",["Fotosintesis","Evaporasi","Respirasi","Adaptasi"],0],
["Hasil 9² adalah ...",["18","72","81","99"],2],
["Alat musik tradisional dari Jawa Barat adalah ...",["Sasando","Angklung","Tifa","Kolintang"],1],
["Samudra terluas di dunia adalah ...",["Atlantik","Hindia","Arktik","Pasifik"],3],
["Satu jam sama dengan ... menit.",["30","45","60","100"],2],
["Warna hasil campuran merah dan kuning adalah ...",["Hijau","Ungu","Oranye","Biru"],2],
["Gas yang dibutuhkan manusia untuk bernapas adalah ...",["Karbon dioksida","Oksigen","Nitrogen murni","Helium"],1],
["Hari Pendidikan Nasional diperingati setiap ...",["2 Mei","21 April","10 November","28 Oktober"],0],
["Hasil 15 × 6 adalah ...",["80","90","100","75"],1],
["Bagian tumbuhan yang menyerap air dari tanah adalah ...",["Daun","Bunga","Akar","Batang"],2],
["Komputer memproses data menggunakan ...",["CPU","Monitor","Mouse","Speaker"],0],
["Lawan kata 'hemat' adalah ...",["Irit","Boros","Cermat","Teliti"],1],
["Jumlah hari dalam satu tahun kabisat adalah ...",["364","365","366","367"],2],
["Hewan tercepat di darat adalah ...",["Singa","Kuda","Cheetah","Rusa"],2],
["Rumus luas persegi adalah ...",["Sisi × sisi","Panjang × lebar","2 × sisi","4 × sisi"],0],
["Sumpah Pemuda diperingati setiap ...",["17 Agustus","28 Oktober","1 Juni","10 November"],1],
["Benda yang dapat ditarik magnet adalah ...",["Kayu","Plastik","Besi","Kertas"],2],
["Hasil 100 - 38 adalah ...",["52","62","72","68"],1],
["Ibukota Provinsi Jawa Barat adalah ...",["Bogor","Bandung","Bekasi","Cirebon"],1],
["Perubahan air menjadi uap disebut ...",["Mencair","Membeku","Menguap","Mengembun"],2],
["Jumlah pemain sepak bola dalam satu tim di lapangan adalah ...",["9","10","11","12"],2]
];
const LADDERS = {3:22,8:30,20:41,28:55,36:57,51:72,71:92,80:99};
const SNAKES = {17:4,32:10,48:26,62:18, /* 62 intentionally a snake */ 64:43,87:54,95:75,98:79};
let players = [], current = 0, started = false, busy = false, gameOver = false;
const $ = id => document.getElementById(id);

function initSetup(){
  $("playerSetup").innerHTML = COLORS.map((c,i)=>`<label class="player-row"><span class="dot" style="background:${c}"></span><input id="name${i}" maxlength="16" value="Pemain ${i+1}" aria-label="Nama pemain ${i+1}"></label>`).join("");
}
function makePlayers(){
  players = COLORS.map((color,i)=>({name:$("name"+i).value.trim()||`Pemain ${i+1}`,pos:1,points:0,color,emoji:EMOJIS[i]}));
  current=0;started=true;busy=false;gameOver=false;
  $("gameMessage").textContent="Permainan dimulai. Lempar dadu untuk maju!";
  $("dice").textContent="⚀"; $("rollBtn").disabled=false;
  $("phasePill").textContent="Berjalan";
  $("questionModal").classList.add("hidden");$("resultModal").classList.add("hidden");
  render();
}
function renderBoard(){
  const board=$("board"); board.innerHTML="";
  // Nomor 100 di kiri atas, baris berikutnya berjalan zig-zag.
  for(let row=9;row>=0;row--){
    const nums=[];
    for(let col=0;col<10;col++) nums.push(row%2===0 ? row*10+col+1 : row*10+(10-col));
    nums.forEach(n=>{
      const cell=document.createElement("div");cell.className="cell";
      if(n===1)cell.classList.add("start");if(n===100)cell.classList.add("finish");
      if(LADDERS[n])cell.classList.add("ladder");if(SNAKES[n])cell.classList.add("snake");
      let mark=LADDERS[n]?"🪜":SNAKES[n]?"🐍":(n===1?"🚩":n===100?"🏁":"");
      cell.innerHTML=`<span>${n}</span><span class="mark">${mark}</span><div class="tokens" id="tokens${n}"></div>`;
      board.appendChild(cell);
    });
  }
}
function render(){
  renderBoard();
  players.forEach((p,i)=>{const t=$("tokens"+p.pos);if(t){const s=document.createElement("span");s.className="token";s.style.background=p.color;s.textContent=i+1;t.appendChild(s)}});
  $("currentPlayer").textContent=players[current]?.name||"Pemain";
  $("currentPlayer").style.color=players[current]?.color||"inherit";
  $("turnLabel").textContent=`Giliran: ${players[current]?.name||"-"}`;
  $("scoreList").innerHTML=players.map((p,i)=>`<div class="score-row"><span class="score-name" style="color:${p.color}">${p.emoji} ${escapeHtml(p.name)} ${i===current?"◀":""}</span><span class="score-meta">Kotak ${p.pos}</span><b>⭐ ${p.points}</b></div>`).join("");
  const target=$("targetPlayer");target.innerHTML=players.map((p,i)=>({p,i})).filter(x=>x.i!==current).map(x=>`<option value="${x.i}">${escapeHtml(x.p.name)} (kotak ${x.p.pos})</option>`).join("");
  $("attackBtn").disabled=!started||busy||gameOver||players[current]?.points<5||players.length<2;
  $("rollBtn").disabled=!started||busy||gameOver;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function roll(){
  if(!started||busy||gameOver)return;
  busy=true;const p=players[current],n=Math.floor(Math.random()*6)+1;
  const dice=$("dice");dice.classList.remove("rolling");void dice.offsetWidth;dice.classList.add("rolling");
  setTimeout(()=>{
    dice.textContent=["","⚀","⚁","⚂","⚃","⚄","⚅"][n];
    const before=p.pos;p.pos=Math.min(100,p.pos+n);
    $("gameMessage").textContent=`${p.name} mendapat angka ${n} dan bergerak dari kotak ${before} ke ${p.pos}.`;
    render();
    if(p.pos>=100){win(p);return}
    askQuestion();
  },850);
}
function askQuestion(){
  const q=QUESTIONS[Math.floor(Math.random()*QUESTIONS.length)];
  $("questionNumber").textContent=`Kotak ${players[current].pos}`;
  $("questionText").textContent=q[0];$("answerFeedback").textContent="";
  $("answerFeedback").className="feedback";
  $("answers").innerHTML=q[1].map((a,i)=>`<button class="answer-btn" data-index="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join("");
  $("answers").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>answer(Number(btn.dataset.index),q)));
  $("questionModal").classList.remove("hidden");
}
function answer(index,q){
  const buttons=[...$("answers").querySelectorAll("button")];buttons.forEach(b=>b.disabled=true);
  const p=players[current],correct=index===q[2];
  buttons[q[2]].classList.add("correct");
  if(correct){
    p.points+=2;$("answerFeedback").textContent="✅ Benar! Kamu mendapat +2 poin.";
    $("answerFeedback").classList.add("good");
  }else{
    buttons[index].classList.add("wrong");
    const back=Math.random()<.5?2:5;p.pos=Math.max(1,p.pos-back);
    $("answerFeedback").textContent=`❌ Salah! ${p.name} mundur ${back} langkah.`;
    $("answerFeedback").classList.add("bad");
  }
  $("gameMessage").textContent=$("answerFeedback").textContent;
  render();
  setTimeout(()=>{
    $("questionModal").classList.add("hidden");
    if(correct||!correct)resolveTile();
  },1350);
}
function resolveTile(){
  const p=players[current];
  if(LADDERS[p.pos]){const from=p.pos;p.pos=LADDERS[from];$("gameMessage").textContent=`🪜 ${p.name} naik tangga dari ${from} ke ${p.pos}.`;}
  else if(SNAKES[p.pos]){const from=p.pos;p.pos=SNAKES[from];$("gameMessage").textContent=`🐍 ${p.name} terkena ular dari ${from} ke ${p.pos}.`;}
  render();
  if(p.pos>=100){win(p);return}
  nextTurn();
}
function nextTurn(){current=(current+1)%players.length;busy=false;render();$("phasePill").textContent="Giliran berikutnya";}
function attack(){
  if(!started||busy||gameOver||players[current].points<5)return;
  const targetIndex=Number($("targetPlayer").value);if(!Number.isInteger(targetIndex)||!players[targetIndex])return;
  const attacker=players[current],target=players[targetIndex];
  attacker.points-=5;target.pos=Math.max(1,target.pos-3);
  $("gameMessage").textContent=`⚔️ ${attacker.name} menyerang ${target.name}! Target mundur 3 langkah.`;
  render();
}
function win(p){gameOver=true;busy=true;$("rollBtn").disabled=true;$("phasePill").textContent="Selesai";$("winnerText").textContent=`${p.emoji} ${p.name} Menang!`;$("resultModal").classList.remove("hidden");render();}
$("startBtn").addEventListener("click",makePlayers);
$("rollBtn").addEventListener("click",roll);
$("attackBtn").addEventListener("click",attack);
$("newGameBtn").addEventListener("click",()=>{if(!started||confirm("Mulai permainan baru? Posisi dan poin semua pemain akan direset."))makePlayers();});
$("playAgainBtn").addEventListener("click",makePlayers);
initSetup();renderBoard();
