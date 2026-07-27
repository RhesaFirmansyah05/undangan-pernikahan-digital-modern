/**
 * Standalone Admin Dashboard Engine for Wedding Invitation
 * Features: PIN Authentication, Full CRUD for Events, Gallery, Music, Bank Accounts, Story, Wishes, and Guest Links.
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
  
  events: [
    {
      id: 'event-akad',
      name: 'Akad Nikah',
      badge: 'Utama',
      dateText: 'Sabtu, 24 Oktober 2026',
      timeText: '08.00 WIB - Selesai',
      locationName: 'Masjid Agung Trans Studio',
      address: 'Jl. Gatot Subroto No.289, Cibangkong, Batununggal, Kota Bandung, Jawa Barat',
      mapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Trans+Studio+Bandung'
    },
    {
      id: 'event-resepsi',
      name: 'Resepsi Pernikahan',
      badge: 'Utama',
      dateText: 'Sabtu, 24 Oktober 2026',
      timeText: '11.00 - 14.00 WIB',
      locationName: 'Grand Ballroom InterContinental Hotel',
      address: 'Resor Dago Pakar, Jl. Resor Dago Pakar Raya 2B, Mekarsaluyu, Cimenyan, Bandung',
      mapsUrl: 'https://maps.google.com/?q=InterContinental+Bandung+Dago+Pakar'
    }
  ],

  // Music
  musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-113264.mp3',

  // Digital Envelope Bank
  bankAccounts: [
    {
      id: 'bank-1',
      name: 'Bank BCA',
      number: '1234567890',
      holder: 'a.n. Rhesa Firmansyah'
    },
    {
      id: 'bank-2',
      name: 'Bank Mandiri',
      number: '0987654321',
      holder: 'a.n. Alya Anindita'
    }
  ],

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
    { id: 'story-1', date: 'Tahun 2022', title: 'Pertama Bertemu', desc: 'Tak sengaja dipertemukan dalam sebuah proyek organisasi kampus. Berawal dari diskusi singkat, tumbuh rasa saling menghargai dan kenyamanan satu sama lain.' },
    { id: 'story-2', date: 'Tahun 2023', title: 'Mulai Berpacaran', desc: 'Setahun saling mengenal, kami memutuskan untuk mengikat komitmen bersama, saling mendukung impian masing-masing, dan belajar arti kesabaran serta ketulusan.' },
    { id: 'story-3', date: 'Tahun 2025', title: 'Momen Lamaran', desc: 'Momen membahagiakan di mana dua keluarga besar bersilaturahmi dan merestui niat suci kami untuk melangkah menuju ikrar pernikahan.' },
    { id: 'story-4', date: 'Tahun 2026', title: 'Pernikahan Suci', desc: 'Hari yang dinantikan tiba untuk mengucap janji suci sehidup semati di hadapan Allah SWT, keluarga, serta sahabat tercinta.' }
  ],

  // Admin PIN
  adminPin: '1234'
};

let currentConfig = null;
let isAuthenticated = false;
let adminAudioPreview = null;
let currentCrudType = null;
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
  currentConfig = getWeddingConfig();

  // Check session storage auth
  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    unlockAdmin();
  } else {
    lockAdmin();
  }

  initAuth();
  initAdminTabs();
  initFormInputs();
  initEventsCrud();
  initPhotosCrud();
  initMusicCrud();
  initBankCrud();
  initStoryCrud();
  initWishesCrud();
  initGuestLinkGenerator();
  initDynamicCrudModal();
  initSaveAndReset();
});

/* ==========================================================================
   CONFIGURATION & STORAGE ENGINE
   ========================================================================== */
function getWeddingConfig() {
  const stored = localStorage.getItem('wedding_config');
  let cfg = { ...DEFAULT_CONFIG };
  if (stored) {
    try {
      cfg = { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse wedding_config', e);
    }
  }

  // Ensure arrays are initialized
  if (!cfg.events || !Array.isArray(cfg.events) || cfg.events.length === 0) {
    cfg.events = [...DEFAULT_CONFIG.events];
  }
  if (!cfg.bankAccounts || !Array.isArray(cfg.bankAccounts) || cfg.bankAccounts.length === 0) {
    cfg.bankAccounts = [...DEFAULT_CONFIG.bankAccounts];
  }
  if (!cfg.timelineItems || !Array.isArray(cfg.timelineItems)) {
    cfg.timelineItems = [...DEFAULT_CONFIG.timelineItems];
  }
  if (!cfg.galleryPhotos || !Array.isArray(cfg.galleryPhotos)) {
    cfg.galleryPhotos = [...DEFAULT_CONFIG.galleryPhotos];
  }

  return cfg;
}

function saveWeddingConfig(cfg) {
  localStorage.setItem('wedding_config', JSON.stringify(cfg));
  currentConfig = cfg;
  showToast('Konfigurasi berhasil disimpan!', 'success');
}

function getWishes() {
  const stored = localStorage.getItem('wedding_wishes');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return []; }
  }
  return [
    {
      id: 'wish-demo-1',
      name: 'Tim Technical & Development',
      relationship: 'Rekan Kerja',
      attendance: 'Hadir',
      message: 'Selamat untuk Rhesa & Alya! Semoga menjadi pasangan yang sakinah, mawaddah, warahmah dan lancar seluruh acaranya sampai hari H.',
      timestamp: '2026-10-20T10:30:00'
    },
    {
      id: 'wish-demo-2',
      name: 'Bpk. Herman & Keluarga',
      relationship: 'Keluarga',
      attendance: 'Hadir',
      message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Turut bahagia untuk kedua mempelai.',
      timestamp: '2026-10-21T14:15:00'
    }
  ];
}

function saveWishes(wishes) {
  localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
}

function getGuestHistory() {
  const stored = localStorage.getItem('wedding_guest_links');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return []; }
  }
  return [
    { name: 'Rhesa Firmansyah', date: new Date().toLocaleDateString('id-ID') },
    { name: 'Tim Technical and Development', date: new Date().toLocaleDateString('id-ID') }
  ];
}

function saveGuestHistory(history) {
  localStorage.setItem('wedding_guest_links', JSON.stringify(history));
}

/* ==========================================================================
   AUTHENTICATION ENGINE
   ========================================================================== */
function initAuth() {
  const formAuth = document.getElementById('form-admin-auth');
  const pinInput = document.getElementById('auth-pin-input');
  const btnLogout = document.getElementById('btn-admin-logout');

  if (formAuth) {
    formAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = pinInput.value.trim();
      const actualPin = currentConfig.adminPin || '1234';

      if (enteredPin === actualPin) {
        sessionStorage.setItem('admin_authenticated', 'true');
        unlockAdmin();
        showToast('Login Admin Berhasil!', 'success');
      } else {
        showToast('PIN Keamanan Salah! Silakan coba lagi.', 'error');
        pinInput.value = '';
        pinInput.focus();
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('admin_authenticated');
      lockAdmin();
      showToast('Anda telah logout dari Admin.', 'info');
    });
  }
}

function unlockAdmin() {
  isAuthenticated = true;
  const overlay = document.getElementById('admin-login-overlay');
  if (overlay) overlay.classList.add('hidden');
  populateFormFields();
}

function lockAdmin() {
  isAuthenticated = false;
  const overlay = document.getElementById('admin-login-overlay');
  if (overlay) overlay.classList.remove('hidden');
}

/* ==========================================================================
   TAB NAVIGATION ENGINE
   ========================================================================== */
function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
    });
  });
}

/* ==========================================================================
   POPULATE ALL FORM FIELDS
   ========================================================================== */
function populateFormFields() {
  currentConfig = getWeddingConfig();

  // Tab 1: Text & Mempelai
  setValue('#adm-cover-title', currentConfig.coverTitle);
  setValue('#adm-cover-date-text', currentConfig.coverDateText);
  setValue('#adm-groom-name', currentConfig.groomName);
  setValue('#adm-groom-parents', currentConfig.groomParents);
  setValue('#adm-bride-name', currentConfig.brideName);
  setValue('#adm-bride-parents', currentConfig.brideParents);
  setValue('#adm-quote-text', currentConfig.quoteText);
  setValue('#adm-quote-source', currentConfig.quoteSource);

  // Tab 2: Target Countdown
  setValue('#adm-target-countdown', currentConfig.targetCountdownDate);
  renderEventsList();

  // Tab 3: Photos & Gallery
  setValue('#adm-cover-bg-url', currentConfig.coverBgUrl);
  setValue('#adm-groom-img-url', currentConfig.groomImgUrl);
  setValue('#adm-bride-img-url', currentConfig.brideImgUrl);
  setValue('#adm-couple-img-url', currentConfig.coupleImgUrl);

  setImgSrc('#prev-cover-bg', currentConfig.coverBgUrl);
  setImgSrc('#prev-groom-img', currentConfig.groomImgUrl);
  setImgSrc('#prev-bride-img', currentConfig.brideImgUrl);
  setImgSrc('#prev-couple-img', currentConfig.coupleImgUrl);

  renderGalleryList();

  // Tab 4: Music
  setValue('#adm-music-url', currentConfig.musicUrl);

  // Tab 5: Bank Accounts
  renderBankList();

  // Tab 6: Story Timeline
  renderStoryList();

  // Tab 7: Wishes
  renderWishesList();

  // Tab 8: Links
  renderGuestHistoryList();
}

function setValue(selector, val) {
  const el = document.querySelector(selector);
  if (el) el.value = val || '';
}

function setImgSrc(selector, src) {
  const el = document.querySelector(selector);
  if (el) el.src = src || 'assets/images/cover.jpg';
}

/* ==========================================================================
   TAB 2: EVENTS CRUD ENGINE
   ========================================================================== */
function initEventsCrud() {
  const btnAdd = document.getElementById('btn-add-event-modal');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      openCrudModal('EVENT', null);
    });
  }
}

function renderEventsList() {
  const container = document.getElementById('admin-events-list');
  if (!container) return;

  container.innerHTML = '';

  if (!currentConfig.events || currentConfig.events.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.88rem;">Belum ada acara. Klik "+ Tambah Acara Baru" di atas.</p>';
    return;
  }

  currentConfig.events.forEach((evt, idx) => {
    const card = document.createElement('div');
    card.className = 'crud-card';
    card.innerHTML = `
      <div class="crud-card-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge-gold">${evt.badge || 'Acara'}</span>
          <strong style="font-size:1.1rem; color:var(--gold-light);">${evt.name}</strong>
        </div>
        <div class="action-btn-group">
          <button type="button" class="btn-sm-edit" onclick="editEvent('${evt.id}')">✏️ Edit</button>
          <button type="button" class="btn-sm-danger" onclick="deleteEvent('${evt.id}')">🗑️ Hapus</button>
        </div>
      </div>
      <div style="font-size:0.85rem; color:var(--text-secondary); display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
        <div>📅 <strong>Tanggal:</strong> ${evt.dateText || '-'}</div>
        <div>⏰ <strong>Jam:</strong> ${evt.timeText || '-'}</div>
        <div style="grid-column: span 2;">📍 <strong>Tempat:</strong> ${evt.locationName || '-'}</div>
        <div style="grid-column: span 2; font-size:0.8rem; color:var(--text-muted);">🏢 ${evt.address || '-'}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.editEvent = function(id) {
  const evt = currentConfig.events.find(e => e.id === id);
  if (evt) openCrudModal('EVENT', evt);
};

window.deleteEvent = function(id) {
  if (confirm('Apakah Anda yakin ingin menghapus acara ini?')) {
    currentConfig.events = currentConfig.events.filter(e => e.id !== id);
    saveWeddingConfig(currentConfig);
    renderEventsList();
  }
};

/* ==========================================================================
   TAB 3: PHOTOS & GALLERY CRUD ENGINE
   ========================================================================== */
function initPhotosCrud() {
  // Realtime image URL inputs preview
  bindImgPreview('#adm-cover-bg-url', '#prev-cover-bg');
  bindImgPreview('#adm-groom-img-url', '#prev-groom-img');
  bindImgPreview('#adm-bride-img-url', '#prev-bride-img');
  bindImgPreview('#adm-couple-img-url', '#prev-couple-img');

  // File uploads to DataURL
  bindFileUpload('#file-cover-bg', '#adm-cover-bg-url', '#prev-cover-bg');
  bindFileUpload('#file-groom-img', '#adm-groom-img-url', '#prev-groom-img');
  bindFileUpload('#file-bride-img', '#adm-bride-img-url', '#prev-bride-img');
  bindFileUpload('#file-couple-img', '#adm-couple-img-url', '#prev-couple-img');

  // Add Gallery URL
  const btnAddGalUrl = document.getElementById('btn-add-gallery-url');
  const inputGalUrl = document.getElementById('adm-add-gallery-url');
  if (btnAddGalUrl && inputGalUrl) {
    btnAddGalUrl.addEventListener('click', () => {
      const url = inputGalUrl.value.trim();
      if (url) {
        currentConfig.galleryPhotos.push(url);
        saveWeddingConfig(currentConfig);
        renderGalleryList();
        inputGalUrl.value = '';
        showToast('Foto berhasil ditambahkan ke Galeri!', 'success');
      }
    });
  }

  // Upload Multiple Gallery Files
  const fileGalInput = document.getElementById('file-add-gallery');
  if (fileGalInput) {
    fileGalInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      let processed = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          currentConfig.galleryPhotos.push(evt.target.result);
          processed++;
          if (processed === files.length) {
            saveWeddingConfig(currentConfig);
            renderGalleryList();
            showToast(`${files.length} foto berhasil di-upload ke Galeri!`, 'success');
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }
}

function bindImgPreview(inputSel, imgSel) {
  const input = document.querySelector(inputSel);
  const img = document.querySelector(imgSel);
  if (input && img) {
    input.addEventListener('input', () => {
      img.src = input.value.trim() || 'assets/images/cover.jpg';
    });
  }
}

function bindFileUpload(fileSel, inputSel, imgSel) {
  const fileInput = document.querySelector(fileSel);
  const textInput = document.querySelector(inputSel);
  const img = document.querySelector(imgSel);

  if (fileInput && textInput && img) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          textInput.value = evt.target.result;
          img.src = evt.target.result;
          showToast('File foto berhasil di-load!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function renderGalleryList() {
  const container = document.getElementById('adm-gallery-container');
  if (!container) return;

  container.innerHTML = '';

  if (!currentConfig.galleryPhotos || currentConfig.galleryPhotos.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; grid-column:span 4;">Belum ada foto galeri.</p>';
    return;
  }

  currentConfig.galleryPhotos.forEach((photoUrl, idx) => {
    const item = document.createElement('div');
    item.className = 'adm-gallery-item';
    item.innerHTML = `
      <img src="${photoUrl}" alt="Gallery ${idx + 1}" loading="lazy">
      <button type="button" class="btn-del-gallery" onclick="deleteGalleryPhoto(${idx})" title="Hapus Foto">✕</button>
    `;
    container.appendChild(item);
  });
}

window.deleteGalleryPhoto = function(idx) {
  if (confirm('Hapus foto ini dari galeri?')) {
    currentConfig.galleryPhotos.splice(idx, 1);
    saveWeddingConfig(currentConfig);
    renderGalleryList();
    showToast('Foto berhasil dihapus dari galeri.', 'info');
  }
};

/* ==========================================================================
   TAB 4: MUSIC & PRESETS CRUD ENGINE
   ========================================================================== */
function initMusicCrud() {
  const btnTest = document.getElementById('btn-test-admin-music');
  const fileAudio = document.getElementById('file-music-audio');
  const musicInput = document.getElementById('adm-music-url');

  if (fileAudio && musicInput) {
    fileAudio.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          musicInput.value = evt.target.result;
          showToast('File audio MP3 berhasil di-upload!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnTest && musicInput) {
    btnTest.addEventListener('click', () => {
      const url = musicInput.value.trim();
      if (!url) {
        showToast('Masukkan URL musik terlebih dahulu!', 'error');
        return;
      }

      if (adminAudioPreview && !adminAudioPreview.paused) {
        adminAudioPreview.pause();
        btnTest.innerHTML = '▶️ Tes Putar Musik';
      } else {
        adminAudioPreview = new Audio(url);
        adminAudioPreview.play().then(() => {
          btnTest.innerHTML = '⏸️ Hentikan Musik';
        }).catch(err => {
          showToast('Gagal memutar audio preview.', 'error');
        });
      }
    });
  }

  // Presets
  const presets = document.querySelectorAll('.preset-music-item');
  presets.forEach(p => {
    p.addEventListener('click', () => {
      const url = p.getAttribute('data-music-preset');
      if (url && musicInput) {
        musicInput.value = url;
        showToast('Preset musik dipilih!', 'success');
      }
    });
  });
}

/* ==========================================================================
   TAB 5: BANK ACCOUNTS CRUD ENGINE
   ========================================================================== */
function initBankCrud() {
  const btnAdd = document.getElementById('btn-add-bank-modal');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      openCrudModal('BANK', null);
    });
  }
}

function renderBankList() {
  const container = document.getElementById('admin-bank-list');
  if (!container) return;

  container.innerHTML = '';

  if (!currentConfig.bankAccounts || currentConfig.bankAccounts.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.88rem;">Belum ada rekening. Klik "+ Tambah Rekening Baru".</p>';
    return;
  }

  currentConfig.bankAccounts.forEach((bank) => {
    const card = document.createElement('div');
    card.className = 'crud-card';
    card.innerHTML = `
      <div class="crud-card-header">
        <strong style="font-size:1.1rem; color:var(--gold-light);">💳 ${bank.name}</strong>
        <div class="action-btn-group">
          <button type="button" class="btn-sm-edit" onclick="editBank('${bank.id}')">✏️ Edit</button>
          <button type="button" class="btn-sm-danger" onclick="deleteBank('${bank.id}')">🗑️ Hapus</button>
        </div>
      </div>
      <div style="font-size:0.88rem; color:var(--text-secondary);">
        <div><strong>No Rekening:</strong> <code style="color:var(--gold-light); font-size:1rem;">${bank.number}</code></div>
        <div><strong>Atas Nama:</strong> ${bank.holder}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.editBank = function(id) {
  const bank = currentConfig.bankAccounts.find(b => b.id === id);
  if (bank) openCrudModal('BANK', bank);
};

window.deleteBank = function(id) {
  if (confirm('Hapus rekening bank ini?')) {
    currentConfig.bankAccounts = currentConfig.bankAccounts.filter(b => b.id !== id);
    saveWeddingConfig(currentConfig);
    renderBankList();
  }
};

/* ==========================================================================
   TAB 6: LOVE STORY TIMELINE CRUD ENGINE
   ========================================================================== */
function initStoryCrud() {
  const btnAdd = document.getElementById('btn-add-story-modal');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      openCrudModal('STORY', null);
    });
  }
}

function renderStoryList() {
  const container = document.getElementById('admin-story-list');
  if (!container) return;

  container.innerHTML = '';

  if (!currentConfig.timelineItems || currentConfig.timelineItems.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.88rem;">Belum ada kisah cinta. Klik "+ Tambah Momen Baru".</p>';
    return;
  }

  currentConfig.timelineItems.forEach((story) => {
    const card = document.createElement('div');
    card.className = 'crud-card';
    card.innerHTML = `
      <div class="crud-card-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge-gold">${story.date}</span>
          <strong style="font-size:1.1rem; color:var(--gold-light);">${story.title}</strong>
        </div>
        <div class="action-btn-group">
          <button type="button" class="btn-sm-edit" onclick="editStory('${story.id}')">✏️ Edit</button>
          <button type="button" class="btn-sm-danger" onclick="deleteStory('${story.id}')">🗑️ Hapus</button>
        </div>
      </div>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${story.desc}</p>
    `;
    container.appendChild(card);
  });
}

window.editStory = function(id) {
  const story = currentConfig.timelineItems.find(s => s.id === id);
  if (story) openCrudModal('STORY', story);
};

window.deleteStory = function(id) {
  if (confirm('Hapus momen kisah cinta ini?')) {
    currentConfig.timelineItems = currentConfig.timelineItems.filter(s => s.id !== id);
    saveWeddingConfig(currentConfig);
    renderStoryList();
  }
};

/* ==========================================================================
   TAB 7: GUEST WISHES & RSVP CRUD ENGINE
   ========================================================================== */
function initWishesCrud() {
  const btnAdd = document.getElementById('btn-add-wish-modal');
  const searchInput = document.getElementById('search-wish-input');
  const filterAttendance = document.getElementById('filter-wish-attendance');

  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      openCrudModal('WISH', null);
    });
  }

  if (searchInput) searchInput.addEventListener('input', renderWishesList);
  if (filterAttendance) filterAttendance.addEventListener('change', renderWishesList);
}

function renderWishesList() {
  const container = document.getElementById('admin-wishes-list');
  if (!container) return;

  const searchVal = (document.getElementById('search-wish-input')?.value || '').toLowerCase();
  const filterVal = document.getElementById('filter-wish-attendance')?.value || 'ALL';

  let wishes = getWishes();

  if (filterVal !== 'ALL') {
    wishes = wishes.filter(w => w.attendance === filterVal);
  }

  if (searchVal) {
    wishes = wishes.filter(w =>
      (w.name && w.name.toLowerCase().includes(searchVal)) ||
      (w.message && w.message.toLowerCase().includes(searchVal))
    );
  }

  container.innerHTML = '';

  if (wishes.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.88rem;">Tidak ada ucapan/doa yang ditemukan.</p>';
    return;
  }

  wishes.forEach((w) => {
    const card = document.createElement('div');
    card.className = 'crud-card';

    let badgeClass = 'badge-gold';
    if (w.attendance === 'Tidak Hadir') badgeClass = 'btn-sm-danger';

    card.innerHTML = `
      <div class="crud-card-header">
        <div>
          <strong style="font-size:1.05rem; color:var(--gold-light);">${escapeHtml(w.name)}</strong>
          <span style="font-size:0.78rem; color:var(--text-muted); margin-left:6px;">(${escapeHtml(w.relationship || 'Tamu')})</span>
        </div>
        <div class="action-btn-group">
          <span class="${badgeClass}">${w.attendance}</span>
          <button type="button" class="btn-sm-edit" onclick="editWish('${w.id}')">✏️ Edit</button>
          <button type="button" class="btn-sm-danger" onclick="deleteWish('${w.id}')">🗑️ Hapus</button>
        </div>
      </div>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin:6px 0;">"${escapeHtml(w.message)}"</p>
      <div style="font-size:0.75rem; color:var(--text-muted);">🕒 ${new Date(w.timestamp || Date.now()).toLocaleString('id-ID')}</div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.editWish = function(id) {
  const wishes = getWishes();
  const wish = wishes.find(w => w.id === id);
  if (wish) openCrudModal('WISH', wish);
};

window.deleteWish = function(id) {
  if (confirm('Hapus ucapan tamu ini?')) {
    let wishes = getWishes();
    wishes = wishes.filter(w => w.id !== id);
    saveWishes(wishes);
    renderWishesList();
    showToast('Ucapan berhasil dihapus.', 'info');
  }
};

/* ==========================================================================
   TAB 8: GUEST LINK GENERATOR & HISTORY
   ========================================================================== */
function initGuestLinkGenerator() {
  const nameInput = document.getElementById('gen-guest-name');
  const urlRes = document.getElementById('gen-guest-url-res');
  const btnCopy = document.getElementById('btn-gen-copy-link');
  const btnTest = document.getElementById('btn-gen-test-link');
  const btnSave = document.getElementById('btn-gen-save-history');

  function updateUrl() {
    if (!urlRes || !nameInput) return;
    const guest = nameInput.value.trim();
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    if (guest) {
      urlRes.value = `${baseUrl}?to=${encodeURIComponent(guest)}`;
    } else {
      urlRes.value = baseUrl;
    }
  }

  if (nameInput) {
    nameInput.addEventListener('input', updateUrl);
    updateUrl();
  }

  if (btnCopy && urlRes) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(urlRes.value).then(() => {
        showToast('Link undangan tamu berhasil disalin!', 'success');
      });
    });
  }

  if (btnTest && urlRes) {
    btnTest.addEventListener('click', () => {
      window.open(urlRes.value, '_blank');
    });
  }

  if (btnSave && nameInput) {
    btnSave.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) return;

      const history = getGuestHistory();
      history.unshift({ name, date: new Date().toLocaleDateString('id-ID') });
      saveGuestHistory(history);
      renderGuestHistoryList();
      showToast('Tamu berhasil disimpan ke riwayat!', 'success');
    });
  }
}

function renderGuestHistoryList() {
  const container = document.getElementById('admin-guest-history-list');
  if (!container) return;

  const history = getGuestHistory();
  container.innerHTML = '';

  if (history.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Belum ada riwayat link tamu.</p>';
    return;
  }

  history.forEach((item, idx) => {
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    const guestUrl = `${baseUrl}?to=${encodeURIComponent(item.name)}`;

    const card = document.createElement('div');
    card.className = 'crud-card';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifySpaceBetween = 'space-between';
    card.innerHTML = `
      <div>
        <strong style="color:var(--gold-light); font-size:1rem;">${escapeHtml(item.name)}</strong>
        <div style="font-size:0.75rem; color:var(--text-muted);">Dibuat: ${item.date}</div>
      </div>
      <div class="action-btn-group">
        <button type="button" class="btn-sm-edit" onclick="copyGuestHistoryUrl('${escapeHtml(guestUrl)}')">📋 Salin Link</button>
        <button type="button" class="btn-sm-danger" onclick="deleteGuestHistory(${idx})">🗑️ Hapus</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.copyGuestHistoryUrl = function(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link tamu berhasil disalin!', 'success');
  });
};

window.deleteGuestHistory = function(idx) {
  const history = getGuestHistory();
  history.splice(idx, 1);
  saveGuestHistory(history);
  renderGuestHistoryList();
};

/* ==========================================================================
   DYNAMIC CRUD MODAL ENGINE
   ========================================================================== */
function initDynamicCrudModal() {
  const btnClose = document.getElementById('btn-close-crud-modal');
  const btnCancel = document.getElementById('btn-cancel-crud');
  const formModal = document.getElementById('form-crud-dynamic');

  if (btnClose) btnClose.addEventListener('click', closeCrudModal);
  if (btnCancel) btnCancel.addEventListener('click', closeCrudModal);

  if (formModal) {
    formModal.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCrudModalData();
    });
  }
}

function openCrudModal(type, dataObj = null) {
  currentCrudType = type;
  currentEditingId = dataObj ? dataObj.id : null;

  const modal = document.getElementById('modal-crud-dynamic');
  const titleEl = document.getElementById('crud-modal-title');
  const fieldsContainer = document.getElementById('crud-modal-fields');

  if (!modal || !fieldsContainer) return;

  fieldsContainer.innerHTML = '';

  if (type === 'EVENT') {
    titleEl.textContent = dataObj ? 'Edit Acara Pernikahan' : 'Tambah Acara Pernikahan Baru';
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nama Acara</label>
        <input type="text" id="crud-evt-name" class="form-control" value="${dataObj?.name || ''}" placeholder="Contoh: After Party / Syukuran" required>
      </div>
      <div class="form-group">
        <label class="form-label">Kategori Badge</label>
        <input type="text" id="crud-evt-badge" class="form-control" value="${dataObj?.badge || 'Utama'}" placeholder="Contoh: Utama / Tambahan">
      </div>
      <div class="admin-form-grid">
        <div class="form-group">
          <label class="form-label">Hari & Tanggal</label>
          <input type="text" id="crud-evt-date" class="form-control" value="${dataObj?.dateText || ''}" placeholder="Sabtu, 24 Oktober 2026">
        </div>
        <div class="form-group">
          <label class="form-label">Jam Acara</label>
          <input type="text" id="crud-evt-time" class="form-control" value="${dataObj?.timeText || ''}" placeholder="19.00 WIB - Selesai">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Nama Tempat / Gedung</label>
        <input type="text" id="crud-evt-location" class="form-control" value="${dataObj?.locationName || ''}" placeholder="Grand Ballroom...">
      </div>
      <div class="form-group">
        <label class="form-label">Alamat Lengkap</label>
        <input type="text" id="crud-evt-address" class="form-control" value="${dataObj?.address || ''}" placeholder="Jl. Raya...">
      </div>
      <div class="form-group">
        <label class="form-label">Link Google Maps</label>
        <input type="url" id="crud-evt-maps" class="form-control" value="${dataObj?.mapsUrl || ''}" placeholder="https://maps.google.com/...">
      </div>
    `;
  } else if (type === 'BANK') {
    titleEl.textContent = dataObj ? 'Edit Rekening Bank/E-Wallet' : 'Tambah Rekening Bank/E-Wallet Baru';
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nama Bank / Provider</label>
        <input type="text" id="crud-bank-name" class="form-control" value="${dataObj?.name || ''}" placeholder="Contoh: Bank BCA / DANA / QRIS" required>
      </div>
      <div class="form-group">
        <label class="form-label">Nomor Rekening / No. HP</label>
        <input type="text" id="crud-bank-num" class="form-control" value="${dataObj?.number || ''}" placeholder="1234567890" required>
      </div>
      <div class="form-group">
        <label class="form-label">Atas Nama Rekening</label>
        <input type="text" id="crud-bank-holder" class="form-control" value="${dataObj?.holder || ''}" placeholder="a.n. Rhesa Firmansyah" required>
      </div>
    `;
  } else if (type === 'STORY') {
    titleEl.textContent = dataObj ? 'Edit Kisah Cinta' : 'Tambah Momen Kisah Cinta Baru';
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label">Tahun / Periode</label>
        <input type="text" id="crud-story-date" class="form-control" value="${dataObj?.date || ''}" placeholder="Contoh: Tahun 2024" required>
      </div>
      <div class="form-group">
        <label class="form-label">Judul Momen</label>
        <input type="text" id="crud-story-title" class="form-control" value="${dataObj?.title || ''}" placeholder="Momen Momen..." required>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi Cerita</label>
        <textarea id="crud-story-desc" class="form-control" rows="3" placeholder="Ceritakan kisah momen ini..." required>${dataObj?.desc || ''}</textarea>
      </div>
    `;
  } else if (type === 'WISH') {
    titleEl.textContent = dataObj ? 'Edit Ucapan Tamu' : 'Tambah Ucapan Tamu Manual';
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nama Tamu</label>
        <input type="text" id="crud-wish-name" class="form-control" value="${dataObj?.name || ''}" placeholder="Nama Pengirim..." required>
      </div>
      <div class="form-group">
        <label class="form-label">Hubungan</label>
        <input type="text" id="crud-wish-rel" class="form-control" value="${dataObj?.relationship || 'Sahabat'}" placeholder="Contoh: Sahabat / Teman Kerja / Keluarga">
      </div>
      <div class="form-group">
        <label class="form-label">Status Kehadiran</label>
        <select id="crud-wish-att" class="form-control" required>
          <option value="Hadir" ${dataObj?.attendance === 'Hadir' ? 'selected' : ''}>Hadir</option>
          <option value="Ragu-ragu" ${dataObj?.attendance === 'Ragu-ragu' ? 'selected' : ''}>Ragu-ragu</option>
          <option value="Tidak Hadir" ${dataObj?.attendance === 'Tidak Hadir' ? 'selected' : ''}>Tidak Hadir</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Isi Pesan Doa</label>
        <textarea id="crud-wish-msg" class="form-control" rows="3" placeholder="Pesan ucapan & doa..." required>${dataObj?.message || ''}</textarea>
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeCrudModal() {
  const modal = document.getElementById('modal-crud-dynamic');
  if (modal) modal.classList.remove('active');
}

function saveCrudModalData() {
  if (currentCrudType === 'EVENT') {
    const item = {
      id: currentEditingId || 'event-' + Date.now(),
      name: document.getElementById('crud-evt-name').value.trim(),
      badge: document.getElementById('crud-evt-badge').value.trim(),
      dateText: document.getElementById('crud-evt-date').value.trim(),
      timeText: document.getElementById('crud-evt-time').value.trim(),
      locationName: document.getElementById('crud-evt-location').value.trim(),
      address: document.getElementById('crud-evt-address').value.trim(),
      mapsUrl: document.getElementById('crud-evt-maps').value.trim()
    };

    if (currentEditingId) {
      const idx = currentConfig.events.findIndex(e => e.id === currentEditingId);
      if (idx !== -1) currentConfig.events[idx] = item;
    } else {
      currentConfig.events.push(item);
    }

    saveWeddingConfig(currentConfig);
    renderEventsList();
  } else if (currentCrudType === 'BANK') {
    const item = {
      id: currentEditingId || 'bank-' + Date.now(),
      name: document.getElementById('crud-bank-name').value.trim(),
      number: document.getElementById('crud-bank-num').value.trim(),
      holder: document.getElementById('crud-bank-holder').value.trim()
    };

    if (currentEditingId) {
      const idx = currentConfig.bankAccounts.findIndex(b => b.id === currentEditingId);
      if (idx !== -1) currentConfig.bankAccounts[idx] = item;
    } else {
      currentConfig.bankAccounts.push(item);
    }

    saveWeddingConfig(currentConfig);
    renderBankList();
  } else if (currentCrudType === 'STORY') {
    const item = {
      id: currentEditingId || 'story-' + Date.now(),
      date: document.getElementById('crud-story-date').value.trim(),
      title: document.getElementById('crud-story-title').value.trim(),
      desc: document.getElementById('crud-story-desc').value.trim()
    };

    if (currentEditingId) {
      const idx = currentConfig.timelineItems.findIndex(s => s.id === currentEditingId);
      if (idx !== -1) currentConfig.timelineItems[idx] = item;
    } else {
      currentConfig.timelineItems.push(item);
    }

    saveWeddingConfig(currentConfig);
    renderStoryList();
  } else if (currentCrudType === 'WISH') {
    const item = {
      id: currentEditingId || 'wish-' + Date.now(),
      name: document.getElementById('crud-wish-name').value.trim(),
      relationship: document.getElementById('crud-wish-rel').value.trim(),
      attendance: document.getElementById('crud-wish-att').value,
      message: document.getElementById('crud-wish-msg').value.trim(),
      timestamp: new Date().toISOString()
    };

    let wishes = getWishes();
    if (currentEditingId) {
      const idx = wishes.findIndex(w => w.id === currentEditingId);
      if (idx !== -1) wishes[idx] = item;
    } else {
      wishes.unshift(item);
    }

    saveWishes(wishes);
    renderWishesList();
  }

  closeCrudModal();
  showToast('Data berhasil disimpan!', 'success');
}

/* ==========================================================================
   SAVE ALL FORM CHANGES & RESET ENGINE
   ========================================================================== */
function initSaveAndReset() {
  const btnSaveAll = document.getElementById('btn-save-admin');
  const btnReset = document.getElementById('btn-reset-admin');

  if (btnSaveAll) {
    btnSaveAll.addEventListener('click', () => {
      // Gather inputs
      currentConfig.coverTitle = getValue('#adm-cover-title');
      currentConfig.coverDateText = getValue('#adm-cover-date-text');
      currentConfig.groomName = getValue('#adm-groom-name');
      currentConfig.groomParents = getValue('#adm-groom-parents');
      currentConfig.brideName = getValue('#adm-bride-name');
      currentConfig.brideParents = getValue('#adm-bride-parents');
      currentConfig.quoteText = getValue('#adm-quote-text');
      currentConfig.quoteSource = getValue('#adm-quote-source');

      currentConfig.targetCountdownDate = getValue('#adm-target-countdown');

      currentConfig.coverBgUrl = getValue('#adm-cover-bg-url');
      currentConfig.groomImgUrl = getValue('#adm-groom-img-url');
      currentConfig.brideImgUrl = getValue('#adm-bride-img-url');
      currentConfig.coupleImgUrl = getValue('#adm-couple-img-url');

      currentConfig.musicUrl = getValue('#adm-music-url');

      const newPin = getValue('#adm-new-pin');
      if (newPin) currentConfig.adminPin = newPin;

      saveWeddingConfig(currentConfig);
      showToast('Semua pengaturan berhasil disimpan ke website!', 'success');
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mengembalikan semua konfigurasi ke Default Pabrik?')) {
        localStorage.removeItem('wedding_config');
        currentConfig = getWeddingConfig();
        populateFormFields();
        showToast('Konfigurasi dikembalikan ke standar!', 'info');
      }
    });
  }
}

function getValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.value.trim() : '';
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
