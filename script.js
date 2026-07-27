/**
 * Undangan Pernikahan Digital Modern - JavaScript
 * Features: Dynamic Config Engine, Admin Dashboard, Guest Name URL,
 * Audio Player, Countdown, Lightbox, Wishes (LocalStorage), Copy Bank, Scroll Reveal.
 */

const DEFAULT_CONFIG = {
  coverTitle: 'Rhesa & Alya',
  coverDateText: 'SABTU, 24 OKTOBER 2026',
  coverBgUrl: 'assets/images/cover.jpg',
  
  groomName: 'Rhesa Firmansyah, S.T.',
  groomParents: 'Putra Pertama dari Bapak Herman & Ibu Ratna',
  groomImgUrl: 'assets/images/groom.jpg',
  
  brideName: 'Alya Anindita, S.Ked.',
  brideParents: 'Putri Kedua dari Bapak Bambang & Ibu Sri',
  brideImgUrl: 'assets/images/bride.jpg',
  
  coupleImgUrl: 'assets/images/couple.jpg',
  quoteText: '"Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."',
  quoteSource: '(Q.S. Ar-Rum: 21)',

  // Countdown & Event
  targetCountdownDate: '2026-10-24T08:00',
  
  akadDateText: 'Sabtu, 24 Oktober 2026',
  akadTimeText: '08.00 WIB - Selesai',
  akadLocationName: 'Masjid Agung Trans Studio',
  akadAddress: 'Jl. Gatot Subroto No.289, Cibangkong, Batununggal, Kota Bandung, Jawa Barat',
  akadMapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Trans+Studio+Bandung',

  resepsiDateText: 'Sabtu, 24 Oktober 2026',
  resepsiTimeText: '11.00 - 14.00 WIB',
  resepsiLocationName: 'Grand Ballroom InterContinental Hotel',
  resepsiAddress: 'Resor Dago Pakar, Jl. Resor Dago Pakar Raya 2B, Mekarsaluyu, Cimenyan, Bandung',
  resepsiMapsUrl: 'https://maps.google.com/?q=InterContinental+Bandung+Dago+Pakar',

  // Music
  musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-113264.mp3',

  // Digital Envelope Bank
  bank1Name: 'Bank BCA',
  bank1Number: '1234567890',
  bank1Holder: 'a.n. Rhesa Firmansyah',
  bank2Name: 'Bank Mandiri',
  bank2Number: '0987654321',
  bank2Holder: 'a.n. Alya Anindita',

  // Gallery Photos
  galleryPhotos: [
    'assets/images/couple.jpg',
    'assets/images/groom.jpg',
    'assets/images/bride.jpg',
    'assets/images/cover.jpg',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
  ],

  // Love Story Timeline
  timelineItems: [
    { date: 'Tahun 2022', title: 'Pertama Bertemu', desc: 'Tak sengaja dipertemukan dalam sebuah proyek organisasi kampus. Berawal dari diskusi singkat, tumbuh rasa saling menghargai dan kenyamanan satu sama lain.' },
    { date: 'Tahun 2023', title: 'Mulai Berpacaran', desc: 'Setahun saling mengenal, kami memutuskan untuk mengikat komitmen bersama, saling mendukung impian masing-masing, dan belajar arti kesabaran serta ketulusan.' },
    { date: 'Tahun 2025', title: 'Momen Lamaran', desc: 'Momen membahagiakan di mana dua keluarga besar bersilaturahmi dan merestui niat suci kami untuk melangkah menuju ikrar pernikahan.' },
    { date: 'Tahun 2026', title: 'Pernikahan Suci', desc: 'Hari yang dinantikan tiba untuk mengucap janji suci sehidup semati di hadapan Allah SWT, keluarga, serta sahabat tercinta.' }
  ],

  // Admin PIN
  adminPin: '1234'
};

let currentConfig = null;
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  // Load configuration from local storage or defaults
  currentConfig = getWeddingConfig();
  
  // Apply configuration to DOM elements
  applyConfigToDOM(currentConfig);

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

  // 10. ADMIN DASHBOARD ENGINE
  initAdminDashboard();
});

/* ==========================================================================
   CONFIG STORAGE ENGINE
   ========================================================================== */
function getWeddingConfig() {
  const stored = localStorage.getItem('wedding_config');
  if (stored) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse wedding_config from localStorage', e);
    }
  }
  return { ...DEFAULT_CONFIG };
}

function saveWeddingConfig(config) {
  localStorage.setItem('wedding_config', JSON.stringify(config));
  currentConfig = config;
  applyConfigToDOM(config);
}

function applyConfigToDOM(cfg) {
  if (!cfg) return;

  // Cover Elements
  const coverTitleEl = document.querySelector('#cover .cover-title');
  if (coverTitleEl) coverTitleEl.textContent = cfg.coverTitle || DEFAULT_CONFIG.coverTitle;

  const coverDateEl = document.querySelector('#cover .cover-date');
  if (coverDateEl) coverDateEl.textContent = cfg.coverDateText || DEFAULT_CONFIG.coverDateText;

  const coverSectionEl = document.getElementById('cover');
  if (coverSectionEl && cfg.coverBgUrl) {
    coverSectionEl.style.backgroundImage = `linear-gradient(rgba(15, 13, 10, 0.65), rgba(15, 13, 10, 0.7)), url("${cfg.coverBgUrl}")`;
    coverSectionEl.style.backgroundSize = 'cover';
    coverSectionEl.style.backgroundPosition = 'center';
  }

  // Hero Elements
  const heroCoupleTitleEl = document.querySelector('#hero .couple-title');
  if (heroCoupleTitleEl) heroCoupleTitleEl.textContent = cfg.coverTitle || DEFAULT_CONFIG.coverTitle;

  const heroDateTextEl = document.querySelector('#hero .hero-date');
  if (heroDateTextEl) heroDateTextEl.textContent = cfg.coverDateText || DEFAULT_CONFIG.coverDateText;

  const heroCoupleImgEl = document.querySelector('#hero .couple-photo-frame img');
  if (heroCoupleImgEl && cfg.coupleImgUrl) heroCoupleImgEl.src = cfg.coupleImgUrl;

  // Groom & Bride
  const groomNameEl = document.querySelector('.groom-name');
  if (groomNameEl) groomNameEl.textContent = cfg.groomName;

  const groomParentsEl = document.querySelector('.groom-parents');
  if (groomParentsEl) groomParentsEl.textContent = cfg.groomParents;

  const groomImgEl = document.querySelector('.groom-img');
  if (groomImgEl && cfg.groomImgUrl) groomImgEl.src = cfg.groomImgUrl;

  const brideNameEl = document.querySelector('.bride-name');
  if (brideNameEl) brideNameEl.textContent = cfg.brideName;

  const brideParentsEl = document.querySelector('.bride-parents');
  if (brideParentsEl) brideParentsEl.textContent = cfg.brideParents;

  const brideImgEl = document.querySelector('.bride-img');
  if (brideImgEl && cfg.brideImgUrl) brideImgEl.src = cfg.brideImgUrl;

  // Quote
  const quoteTextEl = document.querySelector('.quote-text');
  if (quoteTextEl) quoteTextEl.textContent = cfg.quoteText;

  const quoteSourceEl = document.querySelector('.quote-source');
  if (quoteSourceEl) quoteSourceEl.textContent = cfg.quoteSource;

  // Events Grid Rendering
  const eventsGridEl = document.querySelector('.events-grid');
  if (eventsGridEl && cfg.events && Array.isArray(cfg.events) && cfg.events.length > 0) {
    eventsGridEl.innerHTML = '';
    cfg.events.forEach((evt) => {
      const card = document.createElement('div');
      card.className = 'event-card card-glass reveal active';
      card.innerHTML = `
        <div>
          <div class="event-badge">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21z"/>
            </svg>
          </div>
          <h3 class="event-title">${escapeHtml(evt.name)}</h3>

          <div class="event-detail-item">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>${escapeHtml(evt.dateText || '-')}</span>
          </div>

          <div class="event-detail-item">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>${escapeHtml(evt.timeText || '-')}</span>
          </div>

          <div class="event-location-name">${escapeHtml(evt.locationName || '-')}</div>
          <p class="event-location-address">
            ${escapeHtml(evt.address || '-')}
          </p>
        </div>

        ${evt.mapsUrl ? `
        <a href="${escapeHtml(evt.mapsUrl)}" target="_blank" rel="noopener" class="btn-outline-gold">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Lihat Lokasi Maps
        </a>
        ` : ''}
      `;
      eventsGridEl.appendChild(card);
    });
  }

  // Audio Music
  const audioEl = document.getElementById('bg-music');
  if (audioEl && cfg.musicUrl) {
    const audioSourceEl = audioEl.querySelector('source');
    if (audioSourceEl && audioSourceEl.src !== cfg.musicUrl) {
      audioSourceEl.src = cfg.musicUrl;
      audioEl.load();
    }
  }

  // Bank Accounts Grid Rendering
  const bankCardsGridEl = document.querySelector('.bank-cards-grid');
  if (bankCardsGridEl && cfg.bankAccounts && Array.isArray(cfg.bankAccounts) && cfg.bankAccounts.length > 0) {
    bankCardsGridEl.innerHTML = '';
    cfg.bankAccounts.forEach((bank) => {
      const card = document.createElement('div');
      card.className = 'bank-card card-glass reveal active';
      card.innerHTML = `
        <div class="bank-logo">${escapeHtml(bank.name)}</div>
        <div class="account-number">${escapeHtml(bank.number)}</div>
        <div class="account-holder">${escapeHtml(bank.holder)}</div>
        <button class="btn-copy-bank btn-outline-gold" data-bank="${escapeHtml(bank.name)}" data-account="${escapeHtml(bank.number)}">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Copy Rekening ${escapeHtml(bank.name)}
        </button>
      `;
      bankCardsGridEl.appendChild(card);
    });
    // Re-initialize copy bank event listeners
    initCopyBank();
  }

  // Gallery Grid Rendering
  const galleryGridEl = document.querySelector('.gallery-grid');
  if (galleryGridEl && cfg.galleryPhotos && Array.isArray(cfg.galleryPhotos)) {
    galleryGridEl.innerHTML = '';
    cfg.galleryPhotos.forEach((imgUrl, idx) => {
      const item = document.createElement('div');
      item.className = 'gallery-item reveal active';
      item.innerHTML = `
        <img src="${escapeHtml(imgUrl)}" alt="Galeri ${idx + 1}" class="gallery-img" referrerPolicy="no-referrer">
        <div class="gallery-overlay">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
          </svg>
        </div>
      `;
      galleryGridEl.appendChild(item);
    });
    // Re-initialize Lightbox after gallery update
    initLightbox();
  }

  // Love Story Timeline Rendering
  const timelineItemsEls = document.querySelectorAll('.timeline-item');
  if (cfg.timelineItems && Array.isArray(cfg.timelineItems)) {
    cfg.timelineItems.forEach((story, idx) => {
      if (timelineItemsEls[idx]) {
        const dateEl = timelineItemsEls[idx].querySelector('.timeline-date');
        if (dateEl) dateEl.textContent = story.date;
        const titleEl = timelineItemsEls[idx].querySelector('.timeline-title');
        if (titleEl) titleEl.textContent = story.title;
        const descEl = timelineItemsEls[idx].querySelector('.timeline-desc');
        if (descEl) descEl.textContent = story.desc;
      }
    });
  }

  // Closing Couple
  const closingCoupleEl = document.querySelector('.closing-couple');
  if (closingCoupleEl) closingCoupleEl.textContent = cfg.coverTitle;
}

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
    guestName = decodeURIComponent(rawGuest.replace(/\+/g, ' ')).trim();
  }

  if (guestDisplayEl) {
    guestDisplayEl.textContent = guestName;
  }

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
    document.body.classList.remove('cover-active');
    coverEl.classList.add('opened');
    playAudio();

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
  if (countdownInterval) clearInterval(countdownInterval);

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetStr = (currentConfig && currentConfig.targetCountdownDate) ? currentConfig.targetCountdownDate : '2026-10-24T08:00';
  const targetDate = new Date(targetStr).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (isNaN(distance) || distance < 0) {
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
  countdownInterval = setInterval(updateTimer, 1000);
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
    // Clone and replace to prevent duplicate listener accumulation
    const newItem = item.cloneNode(true);
    if (item.parentNode) item.parentNode.replaceChild(newItem, item);

    newItem.addEventListener('click', () => {
      currentImgIndex = idx;
      openLightbox(modal, modalImg);
    });
  });

  if (closeBtn) {
    closeBtn.onclick = () => closeLightbox(modal);
  }
  if (prevBtn) {
    prevBtn.onclick = () => navLightbox(-1, modalImg);
  }
  if (nextBtn) {
    nextBtn.onclick = () => navLightbox(1, modalImg);
  }

  modal.onclick = (e) => {
    if (e.target === modal) closeLightbox(modal);
  };
}

function openLightbox(modal, modalImg) {
  modalImg.src = galleryImages[currentImgIndex];
  modal.classList.add('active');
}

function closeLightbox(modal) {
  modal.classList.remove('active');
}

function navLightbox(direction, modalImg) {
  if (!galleryImages.length) return;
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

  let wishes = JSON.parse(localStorage.getItem('wedding_wishes') || 'null');
  if (!wishes || wishes.length === 0) {
    wishes = DEFAULT_WISHES;
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
  }

  renderWishes(wishes, container);

  if (form) {
    form.onsubmit = (e) => {
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
      document.getElementById('pesan-doa').value = '';
      showToast('Terima kasih! Ucapan & doa Anda berhasil dikirim.');
    };
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
  return String(str || '')
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
    btn.onclick = () => {
      const bankName = btn.getAttribute('data-bank');
      const accountNum = btn.getAttribute('data-account');

      if (!accountNum) return;

      copyToClipboard(accountNum, () => {
        showToast(`Nomor rekening ${bankName} (${accountNum}) berhasil disalin!`);
      });
    };
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

  openBtn.onclick = () => {
    modal.classList.add('active');
    updateGeneratedLink();
  };

  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');

  if (nameInput) {
    nameInput.oninput = updateGeneratedLink;
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
    copyBtn.onclick = () => {
      if (!resultInput) return;
      copyToClipboard(resultInput.value, () => {
        showToast('Link undangan khusus tamu berhasil disalin!');
      });
    };
  }

  if (testBtn) {
    testBtn.onclick = () => {
      if (resultInput && resultInput.value) {
        window.location.href = resultInput.value;
      }
    };
  }
}

/* ==========================================================================
   10. ADMIN DASHBOARD LOGIC & MANAGER
   ========================================================================== */
let editingGalleryPhotos = [];

function initAdminDashboard() {
  const openAdminBtn = document.getElementById('btn-open-admin');
  const loginModal = document.getElementById('admin-login-modal');
  const loginCloseBtn = document.getElementById('admin-login-close');
  const loginForm = document.getElementById('form-admin-login');
  const pinInput = document.getElementById('admin-pin-input');

  const adminModal = document.getElementById('admin-modal');
  const adminCloseBtn = document.getElementById('admin-modal-close');
  const cancelBtn = document.getElementById('btn-cancel-admin');
  const saveBtn = document.getElementById('btn-save-admin');
  const resetBtn = document.getElementById('btn-reset-admin');

  if (!openAdminBtn) return;

  // 1. Open Admin Login Modal
  openAdminBtn.onclick = () => {
    if (loginModal) {
      if (pinInput) pinInput.value = '';
      loginModal.classList.add('active');
    }
  };

  if (loginCloseBtn) {
    loginCloseBtn.onclick = () => loginModal.classList.remove('active');
  }

  // 2. Login Form Submission
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      const enteredPin = pinInput ? pinInput.value.trim() : '';
      const targetPin = currentConfig.adminPin || '1234';

      if (enteredPin === targetPin) {
        loginModal.classList.remove('active');
        openAdminDashboardModal();
        showToast('Berhasil masuk ke Dashboard Admin!');
      } else {
        showToast('PIN Admin salah! Silakan coba lagi.');
      }
    };
  }

  // 3. Admin Dashboard Modal Controls
  if (adminCloseBtn) adminCloseBtn.onclick = () => adminModal.classList.remove('active');
  if (cancelBtn) cancelBtn.onclick = () => adminModal.classList.remove('active');

  // Tab Switching Logic
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');

  tabBtns.forEach(btn => {
    btn.onclick = () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(targetTab);
      if (activePane) activePane.classList.add('active');
    };
  });

  // Photo Upload Helpers
  setupPhotoUpload('file-cover-bg', 'adm-cover-bg-url', 'prev-cover-bg');
  setupPhotoUpload('file-groom-img', 'adm-groom-img-url', 'prev-groom-img');
  setupPhotoUpload('file-bride-img', 'adm-bride-img-url', 'prev-bride-img');
  setupPhotoUpload('file-couple-img', 'adm-couple-img-url', 'prev-couple-img');

  // Input sync with preview thumbs
  setupInputPreviewSync('adm-cover-bg-url', 'prev-cover-bg');
  setupInputPreviewSync('adm-groom-img-url', 'prev-groom-img');
  setupInputPreviewSync('adm-bride-img-url', 'prev-bride-img');
  setupInputPreviewSync('adm-couple-img-url', 'prev-couple-img');

  // Audio Upload Helper
  const fileMusicInput = document.getElementById('file-music-audio');
  if (fileMusicInput) {
    fileMusicInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const musicUrlInput = document.getElementById('adm-music-url');
          if (musicUrlInput) musicUrlInput.value = evt.target.result;
          showToast('File MP3 berhasil diunggah!');
        };
        reader.readAsDataURL(file);
      }
    };
  }

  // Test Admin Music Button
  const testMusicBtn = document.getElementById('btn-test-admin-music');
  if (testMusicBtn) {
    testMusicBtn.onclick = () => {
      const urlInput = document.getElementById('adm-music-url');
      if (urlInput && urlInput.value) {
        const testAudio = new Audio(urlInput.value);
        testAudio.play().then(() => {
          showToast('Memutar musik uji coba...');
          setTimeout(() => testAudio.pause(), 10000);
        }).catch(() => {
          showToast('Gagal memutar audio! Pastikan URL file MP3 valid.');
        });
      }
    };
  }

  // Music Presets Selector
  const presetItems = document.querySelectorAll('.preset-music-item');
  presetItems.forEach(item => {
    item.onclick = () => {
      const url = item.getAttribute('data-music-preset');
      const urlInput = document.getElementById('adm-music-url');
      if (urlInput && url) {
        urlInput.value = url;
        showToast('Preset lagu berhasil dipilih!');
      }
    };
  });

  // Gallery Add URL & File Upload
  const btnAddGalleryUrl = document.getElementById('btn-add-gallery-url');
  if (btnAddGalleryUrl) {
    btnAddGalleryUrl.onclick = () => {
      const input = document.getElementById('adm-add-gallery-url');
      if (input && input.value.trim()) {
        editingGalleryPhotos.push(input.value.trim());
        input.value = '';
        renderAdminGalleryThumbs();
        showToast('Foto baru ditambahkan ke galeri!');
      }
    };
  }

  const fileAddGallery = document.getElementById('file-add-gallery');
  if (fileAddGallery) {
    fileAddGallery.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      let loadedCount = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          editingGalleryPhotos.push(evt.target.result);
          loadedCount++;
          if (loadedCount === files.length) {
            renderAdminGalleryThumbs();
            showToast(`${loadedCount} foto baru berhasil diunggah!`);
          }
        };
        reader.readAsDataURL(file);
      });
    };
  }

  // Save Admin Configuration
  if (saveBtn) {
    saveBtn.onclick = () => {
      const newConfig = {
        ...currentConfig,
        coverTitle: getVal('adm-cover-title', currentConfig.coverTitle),
        coverDateText: getVal('adm-cover-date-text', currentConfig.coverDateText),
        groomName: getVal('adm-groom-name', currentConfig.groomName),
        groomParents: getVal('adm-groom-parents', currentConfig.groomParents),
        brideName: getVal('adm-bride-name', currentConfig.brideName),
        brideParents: getVal('adm-bride-parents', currentConfig.brideParents),
        quoteText: getVal('adm-quote-text', currentConfig.quoteText),
        quoteSource: getVal('adm-quote-source', currentConfig.quoteSource),
        
        targetCountdownDate: getVal('adm-target-countdown', currentConfig.targetCountdownDate),
        
        akadDateText: getVal('adm-akad-date', currentConfig.akadDateText),
        akadTimeText: getVal('adm-akad-time', currentConfig.akadTimeText),
        akadLocationName: getVal('adm-akad-location', currentConfig.akadLocationName),
        akadAddress: getVal('adm-akad-address', currentConfig.akadAddress),
        akadMapsUrl: getVal('adm-akad-maps', currentConfig.akadMapsUrl),

        resepsiDateText: getVal('adm-resepsi-date', currentConfig.resepsiDateText),
        resepsiTimeText: getVal('adm-resepsi-time', currentConfig.resepsiTimeText),
        resepsiLocationName: getVal('adm-resepsi-location', currentConfig.resepsiLocationName),
        resepsiAddress: getVal('adm-resepsi-address', currentConfig.resepsiAddress),
        resepsiMapsUrl: getVal('adm-resepsi-maps', currentConfig.resepsiMapsUrl),

        coverBgUrl: getVal('adm-cover-bg-url', currentConfig.coverBgUrl),
        groomImgUrl: getVal('adm-groom-img-url', currentConfig.groomImgUrl),
        brideImgUrl: getVal('adm-bride-img-url', currentConfig.brideImgUrl),
        coupleImgUrl: getVal('adm-couple-img-url', currentConfig.coupleImgUrl),

        musicUrl: getVal('adm-music-url', currentConfig.musicUrl),

        bank1Name: getVal('adm-bank1-name', currentConfig.bank1Name),
        bank1Number: getVal('adm-bank1-number', currentConfig.bank1Number),
        bank1Holder: getVal('adm-bank1-holder', currentConfig.bank1Holder),

        bank2Name: getVal('adm-bank2-name', currentConfig.bank2Name),
        bank2Number: getVal('adm-bank2-number', currentConfig.bank2Number),
        bank2Holder: getVal('adm-bank2-holder', currentConfig.bank2Holder),

        galleryPhotos: [...editingGalleryPhotos],

        timelineItems: [
          { date: getVal('adm-story-date-0', 'Tahun 2022'), title: getVal('adm-story-title-0', 'Pertama Bertemu'), desc: getVal('adm-story-desc-0', '') },
          { date: getVal('adm-story-date-1', 'Tahun 2023'), title: getVal('adm-story-title-1', 'Mulai Berpacaran'), desc: getVal('adm-story-desc-1', '') },
          { date: getVal('adm-story-date-2', 'Tahun 2025'), title: getVal('adm-story-title-2', 'Momen Lamaran'), desc: getVal('adm-story-desc-2', '') },
          { date: getVal('adm-story-date-3', 'Tahun 2026'), title: getVal('adm-story-title-3', 'Pernikahan Suci'), desc: getVal('adm-story-desc-3', '') }
        ],

        adminPin: getVal('adm-new-pin', currentConfig.adminPin || '1234')
      };

      saveWeddingConfig(newConfig);
      initCountdown();
      initCopyBank();
      adminModal.classList.remove('active');
      showToast('Perubahan undangan berhasil disimpan!');
    };
  }

  // Reset Configuration
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Apakah Anda yakin ingin mengembalikan seluruh isi undangan ke pengaturan awal?')) {
        localStorage.removeItem('wedding_config');
        currentConfig = { ...DEFAULT_CONFIG };
        applyConfigToDOM(currentConfig);
        openAdminDashboardModal(); // Refresh form inputs
        initCountdown();
        initCopyBank();
        showToast('Pengaturan berhasil dikembalikan ke default!');
      }
    };
  }
}

function openAdminDashboardModal() {
  const adminModal = document.getElementById('admin-modal');
  if (!adminModal) return;

  const cfg = currentConfig;

  setVal('adm-cover-title', cfg.coverTitle);
  setVal('adm-cover-date-text', cfg.coverDateText);
  setVal('adm-groom-name', cfg.groomName);
  setVal('adm-groom-parents', cfg.groomParents);
  setVal('adm-bride-name', cfg.brideName);
  setVal('adm-bride-parents', cfg.brideParents);
  setVal('adm-quote-text', cfg.quoteText);
  setVal('adm-quote-source', cfg.quoteSource);

  setVal('adm-target-countdown', cfg.targetCountdownDate);
  
  setVal('adm-akad-date', cfg.akadDateText);
  setVal('adm-akad-time', cfg.akadTimeText);
  setVal('adm-akad-location', cfg.akadLocationName);
  setVal('adm-akad-address', cfg.akadAddress);
  setVal('adm-akad-maps', cfg.akadMapsUrl);

  setVal('adm-resepsi-date', cfg.resepsiDateText);
  setVal('adm-resepsi-time', cfg.resepsiTimeText);
  setVal('adm-resepsi-location', cfg.resepsiLocationName);
  setVal('adm-resepsi-address', cfg.resepsiAddress);
  setVal('adm-resepsi-maps', cfg.resepsiMapsUrl);

  setVal('adm-cover-bg-url', cfg.coverBgUrl);
  setVal('adm-groom-img-url', cfg.groomImgUrl);
  setVal('adm-bride-img-url', cfg.brideImgUrl);
  setVal('adm-couple-img-url', cfg.coupleImgUrl);

  setImgPrev('prev-cover-bg', cfg.coverBgUrl);
  setImgPrev('prev-groom-img', cfg.groomImgUrl);
  setImgPrev('prev-bride-img', cfg.brideImgUrl);
  setImgPrev('prev-couple-img', cfg.coupleImgUrl);

  setVal('adm-music-url', cfg.musicUrl);

  setVal('adm-bank1-name', cfg.bank1Name);
  setVal('adm-bank1-number', cfg.bank1Number);
  setVal('adm-bank1-holder', cfg.bank1Holder);

  setVal('adm-bank2-name', cfg.bank2Name);
  setVal('adm-bank2-number', cfg.bank2Number);
  setVal('adm-bank2-holder', cfg.bank2Holder);

  editingGalleryPhotos = [...(cfg.galleryPhotos || [])];
  renderAdminGalleryThumbs();

  if (cfg.timelineItems && Array.isArray(cfg.timelineItems)) {
    cfg.timelineItems.forEach((item, idx) => {
      setVal(`adm-story-date-${idx}`, item.date);
      setVal(`adm-story-title-${idx}`, item.title);
      setVal(`adm-story-desc-${idx}`, item.desc);
    });
  }

  setVal('adm-new-pin', cfg.adminPin || '1234');

  adminModal.classList.add('active');
}

function renderAdminGalleryThumbs() {
  const container = document.getElementById('adm-gallery-container');
  if (!container) return;

  container.innerHTML = '';
  editingGalleryPhotos.forEach((imgUrl, idx) => {
    const item = document.createElement('div');
    item.className = 'admin-gallery-item';
    item.innerHTML = `
      <img src="${escapeHtml(imgUrl)}" alt="Foto ${idx + 1}">
      <button type="button" class="btn-del-photo" title="Hapus foto ini">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;

    const delBtn = item.querySelector('.btn-del-photo');
    if (delBtn) {
      delBtn.onclick = () => {
        editingGalleryPhotos.splice(idx, 1);
        renderAdminGalleryThumbs();
        showToast('Foto dihapus dari galeri.');
      };
    }

    container.appendChild(item);
  });
}

function setupPhotoUpload(fileInputId, urlInputId, imgPrevId) {
  const fileInput = document.getElementById(fileInputId);
  if (!fileInput) return;

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setVal(urlInputId, evt.target.result);
        setImgPrev(imgPrevId, evt.target.result);
        showToast('Foto berhasil diunggah!');
      };
      reader.readAsDataURL(file);
    }
  };
}

function setupInputPreviewSync(inputId, prevId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.oninput = () => {
      setImgPrev(prevId, input.value);
    };
  }
}

function getVal(id, fallback = '') {
  const el = document.getElementById(id);
  return el ? el.value.trim() : fallback;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function setImgPrev(id, src) {
  const el = document.getElementById(id);
  if (el && src) el.src = src;
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
