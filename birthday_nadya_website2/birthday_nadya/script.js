const sky = document.getElementById('sky');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const letterModal = document.getElementById('letterModal');
let audioContext = null;
let musicTimer = null;
let musicPlaying = false;
let noteIndex = 0;

// Bintang kecil yang berkelip di latar.
for (let i = 0; i < 42; i++) {
  const star = document.createElement('span');
  star.className = 'sparkle';
  star.textContent = Math.random() > 0.5 ? '✦' : '·';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.fontSize = `${8 + Math.random() * 17}px`;
  star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
  star.style.animationDelay = `${Math.random() * 4}s`;
  sky.appendChild(star);
}

// Hati jatuh muncul berkala.
function dropHeart() {
  const heart = document.createElement('span');
  heart.className = 'heart-fall';
  heart.textContent = ['♡', '♥', '✧', '💙'][Math.floor(Math.random() * 4)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 18}px`;
  heart.style.setProperty('--fall', `${6 + Math.random() * 5}s`);
  sky.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}
setInterval(dropHeart, 750);

// Surat: bisa dibuka dari tombol dan ditutup dengan tombol X, klik luar, atau Escape.
function openLetter() {
  letterModal.hidden = false;
  document.getElementById('closeLetter').focus();
}
function closeLetter() {
  letterModal.hidden = true;
  document.getElementById('openLetter').focus();
}
document.getElementById('openLetter').addEventListener('click', openLetter);
document.getElementById('closeLetter').addEventListener('click', closeLetter);
letterModal.addEventListener('click', (event) => {
  if (event.target.dataset.close === 'true') closeLetter();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !letterModal.hidden) closeLetter();
});

// Musik instrumental sederhana dibuat oleh browser (tidak memakai file lagu berhak cipta).
// Browser baru akan mengizinkan audio setelah pengunjung menekan tombol musik.
const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
function playNote() {
  if (!audioContext || !musicPlaying) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = melody[noteIndex % melody.length];
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.075, audioContext.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.45);
  noteIndex++;
}
async function toggleMusic() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      musicLabel.textContent = 'Audio tidak didukung';
      return;
    }
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') await audioContext.resume();
  musicPlaying = !musicPlaying;
  if (musicPlaying) {
    playNote();
    musicTimer = setInterval(playNote, 470);
    musicLabel.textContent = 'Jeda musik';
    musicToggle.firstChild.textContent = '♫ ';
  } else {
    clearInterval(musicTimer);
    musicLabel.textContent = 'Putar musik';
    musicToggle.firstChild.textContent = '♫ ';
  }
}
musicToggle.addEventListener('click', toggleMusic);

// Tombol kejutan: setiap klik memberi pesan manis yang berbeda.
const surprises = [
  'Plot twist: kamu itu salah satu hal baik yang bikin dunia lebih seru. 💙',
  'Kupon virtual: 1 pelukan erat + 1000% dukungan buat semua mimpimu! 🫂',
  'Misi hari ini: makan yang enak, senyum yang banyak, dan manjain diri sendiri! 🍰',
  'Pengingat penting: kamu berharga, kamu disayang, dan kamu pantas bahagia. ✨'
];
let lastSurprise = -1;
document.getElementById('surpriseButton').addEventListener('click', () => {
  let next;
  do { next = Math.floor(Math.random() * surprises.length); } while (next === lastSurprise);
  lastSurprise = next;
  document.getElementById('surpriseMessage').textContent = surprises[next];
  for (let i = 0; i < 14; i++) {
    const pop = document.createElement('span');
    pop.className = 'heart-fall';
    pop.textContent = ['💙', '✨', '♡'][i % 3];
    pop.style.left = `${20 + Math.random() * 60}%`;
    pop.style.top = `${40 + Math.random() * 20}%`;
    pop.style.setProperty('--fall', `${2 + Math.random() * 2}s`);
    sky.appendChild(pop);
    setTimeout(() => pop.remove(), 4500);
  }
});
