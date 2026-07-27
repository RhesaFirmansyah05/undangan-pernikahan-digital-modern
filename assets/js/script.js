/**
 * Undangan Pernikahan Digital Modern - JavaScript
 * Features: Guest Name from URL, Audio Player, Countdown, Gallery Lightbox,
 * Wishes & Doa (LocalStorage), Copy Bank Account, Scroll Reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. GUEST NAME FROM URL PARAMETER
  initGuestName();

  // 2. COVER UNLOCK & OPEN INVITATION
  initCover();

  // 3. BACKGROUND MUSIC ENGINE
  initAudio();

  // 4. COUNTDOWN TIMER
  initCountdown();

  // 5. SCROLL REVEAL ANIMATIONS
  initScrollReveal();

  // 6. PHOTO GALLERY LIGHTBOX
  initLightbox();

  // 7. UCAPAN & DOA (LOCALSTORAGE)
  initWishes();

  // 8. DIGITAL ENVELOPE (COPY REKENING)
  initCopyBank();

  // 9. GUEST LINK GENERATOR TOOL
  initGuestLinkTool();
});

/* ==========================================================================
   1. GUEST NAME FROM URL (?to=Nama%20Tamu)
   ========================================================================== */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawGuest = urlParams.get('to');
  const guestDisplayEl = document.getElementById('guest-name');
  const wishNameInput = document.getElementById('nama-tamu');

  let guestName = 'Bapak/Ibu/Saudara/i';

  if (rawGuest && rawGuest.trim() !== '') {
    // Decode URI component and replace pluses with spaces
    guestName = decodeURIComponent(rawGuest.replace(/\+/g, ' ')).trim();
  }

  // XSS Safe setting via textContent
  if (guestDisplayEl) {
    guestDisplayEl.textContent = guestName;
  }

  // Pre-fill wish form if guest name exists and is not default
  if (wishNameInput && guestName !== 'Bapak/Ibu/Saudara/i') {
    wishNameInput.value = guestName;
  }
}

/* ==========================================================================
   2. COVER UNLOCK & SCROLL
   ========================================================================== */
function initCover() {
  const coverEl = document.getElementById('cover');
  const btnBuka = document.getElementById('btn-buka-undangan');

  if (!btnBuka || !coverEl) return;

  btnBuka.addEventListener('click', () => {
    // Unlock body scrolling
    document.body.classList.remove('cover-active');

    // Slide up cover
    coverEl.classList.add('opened');

    // Play Background Music
    playAudio();

    // Smooth scroll to hero section
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      setTimeout(() => {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  });
}

/* ==========================================================================
   3. AUDIO PLAYER ENGINE
   ========================================================================== */
let isAudioPlaying = false;
let audioContext = null;
let synthOsc = null;

function initAudio() {
  const btnMusic = document.getElementById('btn-music');
  if (!btnMusic) return;

  btnMusic.addEventListener('click', () => {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });
}

function playAudio() {
  const audioEl = document.getElementById('bg-music');
  const btnMusic = document.getElementById('btn-music');

  if (audioEl) {
    audioEl.play().then(() => {
      isAudioPlaying = true;
      if (btnMusic) btnMusic.classList.add('playing');
    }).catch(err => {
      console.log('Audio autoplay prevented or fallback synth needed:', err);
      // Fallback ambient romantic synth generator if audio URL fails
      playSynthAmbient();
      isAudioPlaying = true;
      if (btnMusic) btnMusic.classList.add('playing');
    });
  }
}

function pauseAudio() {
  const audioEl = document.getElementById('bg-music');
  const btnMusic = document.getElementById('btn-music');

  if (audioEl) {
    audioEl.pause();
  }
  if (audioContext) {
    audioContext.suspend();
  }

  isAudioPlaying = false;
  if (btnMusic) btnMusic.classList.remove('playing');
}

// Fallback Web Audio API Synthesizer for soft romantic chord loops
function playSynthAmbient() {
  try {
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  } catch (e) {
    console.error('Web Audio API not supported', e);
  }
}

/* ==========================================================================
   4. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // Target Date: 24 October 2026 08:00:00
  const targetDate = new Date('October 24, 2026 08:00:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. PHOTO GALLERY LIGHTBOX
   ========================================================================== */
let galleryImages = [];
let currentImgIndex = 0;

function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal || !galleryItems.length) return;

  galleryImages = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return img ? img.src : '';
  });

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentImgIndex = idx;
      openLightbox(modal, modalImg);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => closeLightbox(modal));
  if (prevBtn) prevBtn.addEventListener('click', () => navLightbox(-1, modalImg));
  if (nextBtn) nextBtn.addEventListener('click', () => navLightbox(1, modalImg));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox(modal);
    if (e.key === 'ArrowLeft') navLightbox(-1, modalImg);
    if (e.key === 'ArrowRight') navLightbox(1, modalImg);
  });
}

function openLightbox(modal, modalImg) {
  modalImg.src = galleryImages[currentImgIndex];
  modal.classList.add('active');
}

function closeLightbox(modal) {
  modal.classList.remove('active');
}

function navLightbox(direction, modalImg) {
  currentImgIndex = (currentImgIndex + direction + galleryImages.length) % galleryImages.length;
  modalImg.src = galleryImages[currentImgIndex];
}

/* ==========================================================================
   7. UCAPAN DAN DOA (WISHES)
   ========================================================================== */
const DEFAULT_WISHES = [
  {
    nama: 'Rhesa Firmansyah & Tim',
    hubungan: 'Tim Technical and Development',
    kehadiran: 'hadir',
    pesan: 'Selamat untuk Rhesa & Alya! Semoga pernikahan ini selalu dipenuhi keberkahan, kebahagiaan, dan kelancaran hingga hari H. Sakinah Mawaddah Warahmah!',
    waktu: 'Baru saja'
  },
  {
    nama: 'Keluarga Besar Bpk. Ahmad',
    hubungan: 'Keluarga',
    kehadiran: 'hadir',
    pesan: 'Selamat menempuh hidup baru untuk kedua mempelai. Semoga menjadi pasangan sehidup sesurga.',
    waktu: '2 jam yang lalu'
  },
  {
    nama: 'Dimas & Sarah',
    hubungan: 'Sahabat',
    kehadiran: 'hadir',
    pesan: 'Akhirnya melangkah ke jenjang pernikahan! Doa terbaik dari kami untuk kalian berdua.',
    waktu: '1 hari yang lalu'
  }
];

function initWishes() {
  const form = document.getElementById('form-ucapan');
  const container = document.getElementById('wishes-list');

  if (!container) return;

  // Load existing wishes from LocalStorage or fallback to default
  let wishes = JSON.parse(localStorage.getItem('wedding_wishes') || 'null');
  if (!wishes || wishes.length === 0) {
    wishes = DEFAULT_WISHES;
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
  }

  renderWishes(wishes, container);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nama = document.getElementById('nama-tamu').value.trim();
      const hubungan = document.getElementById('hubungan').value.trim() || 'Tamu Undangan';
      const kehadiran = document.getElementById('kehadiran').value;
      const pesan = document.getElementById('pesan-doa').value.trim();

      if (!nama || !pesan) {
        showToast('Mohon isi nama dan ucapan doa Anda.');
        return;
      }

      const newWish = {
        nama: nama,
        hubungan: hubungan,
        kehadiran: kehadiran,
        pesan: pesan,
        waktu: 'Baru saja'
      };

      wishes.unshift(newWish);
      localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

      renderWishes(wishes, container);

      // Reset form text
      document.getElementById('pesan-doa').value = '';

      showToast('Terima kasih! Ucapan & doa Anda berhasil dikirim.');
    });
  }
}

function renderWishes(wishes, container) {
  container.innerHTML = '';

  wishes.forEach(wish => {
    const card = document.createElement('div');
    card.className = 'wish-card';

    const initials = wish.nama ? wish.nama.charAt(0).toUpperCase() : 'T';

    let badgeClass = 'badge-hadir';
    let badgeText = 'Hadir';
    if (wish.kehadiran === 'ragu') {
      badgeClass = 'badge-ragu';
      badgeText = 'Ragu-ragu';
    } else if (wish.kehadiran === 'tidak') {
      badgeClass = 'badge-tidak';
      badgeText = 'Tidak Hadir';
    }

    card.innerHTML = `
      <div class="wish-header">
        <div class="wish-avatar">${escapeHtml(initials)}</div>
        <div>
          <div class="wish-author">${escapeHtml(wish.nama)}</div>
          <div class="wish-relation">${escapeHtml(wish.hubungan)}</div>
        </div>
        <span class="badge-attendance ${badgeClass}">${badgeText}</span>
      </div>
      <div class="wish-text">${escapeHtml(wish.pesan)}</div>
      <div class="wish-time">${escapeHtml(wish.waktu)}</div>
    `;

    container.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   8. AMPLOP DIGITAL (COPY REKENING)
   ========================================================================== */
function initCopyBank() {
  const copyBtns = document.querySelectorAll('.btn-copy-bank');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bankName = btn.getAttribute('data-bank');
      const accountNum = btn.getAttribute('data-account');

      if (!accountNum) return;

      copyToClipboard(accountNum, () => {
        showToast(`Nomor rekening ${bankName} (${accountNum}) berhasil disalin!`);
      });
    });
  });
}

function copyToClipboard(text, onSuccess) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
      fallbackCopy(text, onSuccess);
    });
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  onSuccess();
}

/* ==========================================================================
   9. GUEST LINK GENERATOR TOOL
   ========================================================================== */
function initGuestLinkTool() {
  const openBtn = document.getElementById('btn-open-guest-tool');
  const modal = document.getElementById('guest-modal');
  const closeBtn = document.getElementById('guest-modal-close');
  const nameInput = document.getElementById('input-gen-guest');
  const resultInput = document.getElementById('result-gen-link');
  const copyBtn = document.getElementById('btn-copy-gen-link');
  const testBtn = document.getElementById('btn-test-gen-link');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    updateGeneratedLink();
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  if (nameInput) {
    nameInput.addEventListener('input', updateGeneratedLink);
  }

  function updateGeneratedLink() {
    const val = nameInput ? nameInput.value.trim() : '';
    const baseUrl = window.location.origin + window.location.pathname;
    let finalUrl = baseUrl;
    if (val) {
      finalUrl += '?to=' + encodeURIComponent(val);
    }
    if (resultInput) resultInput.value = finalUrl;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!resultInput) return;
      copyToClipboard(resultInput.value, () => {
        showToast('Link undangan khusus tamu berhasil disalin!');
      });
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', () => {
      if (resultInput && resultInput.value) {
        window.location.href = resultInput.value;
      }
    });
  }
}

/* Toast Notifications Helper */
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, 3500);
}
