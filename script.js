// ===== CONFIG =====
const SHEETS = {
  eventInfo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=0&single=true&output=csv',
  program: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=699491117&single=true&output=csv',
  petugas: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1535279811&single=true&output=csv',
  announcements: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=496101149&single=true&output=csv',
  attendance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1475228326&single=true&output=csv',
}

const MONTH_MAP = { Jan: 'Januari', Feb: 'Februari', Mar: 'Mac', Apr: 'April', May: 'Mei', Jun: 'Jun', Jul: 'Julai', Aug: 'Ogos', Sep: 'September', Oct: 'Oktober', Nov: 'November', Dec: 'Disember' }

// ===== LANGUAGE =====
let lang = 'ms'
try { lang = localStorage.getItem('kkr_lang') || 'ms' } catch (e) {}

const L10N = {
  ms: {
    appTitle: 'KKR Daerah Kapa',
    pageHome: 'Laman Utama',
    pageProgram: 'Aturcara',
    pagePetugas: 'Petugas',
    pageGallery: 'Galeri',
    pageAnnounce: 'Pengumuman',
    heroLabel: 'KKR Daerah Kapa',
    heroTitle: 'KEBAKTIAN KEBANGUNAN ROHANI',
    heroTheme: '"The Great Physician Is In"',
    speakerRole: 'Pembicara',
    speakerHint: 'Klik untuk info lanjut',
    speakerBio: 'Pastor Kim Tae Hyung kini sedang melanjutkan pengajian di peringkat Doktor Pelayanan (Doctor of Ministry, D.Min.) di Adventist International Institute of Advanced Studies (AIIAS). Beliau kini memberi tumpuan kepada latihan misionari serta penyelidikan bagi menyiapkan disertasi kedoktorannya.',
    statsToday: 'Kehadiran Hari Ini',
    statsTotal: 'Jumlah Kehadiran Keseluruhan',
    statsBefore: 'KKR akan bermula pada 20 Julai 2026',
    countdownDays: 'Hari',
    countdownHours: 'Jam',
    countdownMins: 'Minit',
    countdownSecs: 'Saat',
    fabLabel: 'Hubungi Kami',
    fabForm: 'Borang Soalan',
    fabWA: 'WhatsApp',
    splashLabel: 'KKR Daerah Kapa',
    splashWelcome: 'Selamat Datang Ke',
    splashHint: 'Sila tunggu sebentar...',
    splashLoading: 'Memuatkan...',
    programTitle: 'Aturcara',
    programDesc: '20 - 25 Julai 2026',
    programDownload: 'Muat Turun Aturcara',
    programDownloadSub: 'Format PNG · 20-24 Julai 2026',
    petugasTitle: 'Petugas',
    petugasDesc: 'Senarai petugas KKR 2026',
    galleryTitle: 'Galeri',
    galleryDesc: 'Lagu tema dan media KKR 2026',
    announceTitle: 'Pengumuman',
    announceDesc: 'Maklumat terkini KKR 2026',
    graphTitle: 'Kehadiran Setiap Hari',
    graphEmpty: 'Tiada data kehadiran.',
    lirikBtn: '📄 Lirik',
    lirikClose: 'Tutup Lirik',
    lirikBtnEn: '📄 English Lyrics',
    lirikCloseEn: 'Tutup English Lyrics',
    loading: 'Memuatkan...',
    empty: 'Tiada data.',
    error: 'Gagal memuat maklumat.',
    livestream: 'Siaran Langsung',
    livestreamBtn: 'Tonton Sekarang',
    sabatTitle: 'Kebaktian Sabat Gabungan',
    sabatVenue: 'Auditorium Adventist, Tamparuli',
    sabatSesiPagi: 'Sesi Pagi',
    sabatSesiPetang: 'Sesi Petang',
    sabatClose: 'Tutup',
    checkinTitle: 'Kehadiran KKR',
    checkinSub: 'Sila isi maklumat anda untuk check in',
    checkinName: 'Nama Penuh',
    checkinChurch: 'Gereja Asal',
    checkinBilangan: 'Bilangan Ahli Keluarga',
    checkinBtn: 'Check In',
    checkinSuccess: 'Check In Berjaya!',
    checkinSuccessMsg: 'Selamat datang ke KKR',
    checkinDuplicate: 'Anda Sudah Check In',
    checkinDuplicateMsg: 'Anda sudah check in hari ini',
    checkinRedirect: 'Mengalihkan...',
    checkinHome: 'Ke Laman Utama →',
    checkinReset: 'Bukan anda? Klik di sini',
    dayMon: 'Isnin', dayTue: 'Selasa', dayWed: 'Rabu', dayThu: 'Khamis', dayFri: 'Jumaat', daySat: 'Sabat',
    daySun: 'Ahad',
    programSabat: 'Sabat',
    downloadCard: 'Muat Turun Aturcara',
    downloadCardSub: 'Format PNG · 20-24 Julai 2026',
    ajkTitle: 'Senarai AJK KKR 2026',
    confirmTitle: 'Betul?',
    confirmName: 'Nama',
    confirmChurch: 'Gereja',
    confirmBil: 'Bilangan',
    speakerModalTitle: 'Latar Belakang Pembicara',
    petugasModalTitle: 'Senarai Petugas',
    rolePetugas: 'Petugas',
    albumTitle: 'Album Foto',
    albumDay: 'Hari',
    albumEmpty: 'Foto akan dimuat naik tidak lama lagi. Sila datang semula kemudian.',
    noData: 'Tiada data.',
  },
  en: {
    appTitle: 'KKR Kapa District',
    pageHome: 'Home',
    pageProgram: 'Schedule',
    pagePetugas: 'Workers',
    pageGallery: 'Gallery',
    pageAnnounce: 'Announcements',
    heroLabel: 'KKR Kapa District',
    heroTitle: 'KEBAKTIAN KEBANGUNAN ROHANI',
    heroTheme: '"The Great Physician Is In"',
    speakerRole: 'Speaker',
    speakerHint: 'Click for more info',
    speakerBio: 'Pastor Kim Tae Hyung is currently pursuing a Doctor of Ministry (D.Min.) at the Adventist International Institute of Advanced Studies (AIIAS). He is currently focused on missionary training and research for his doctoral dissertation.',
    statsToday: "Today's Attendance",
    statsTotal: 'Total Attendance',
    statsBefore: 'KKR will begin on 20 July 2026',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMins: 'Mins',
    countdownSecs: 'Secs',
    fabLabel: 'Contact Us',
    fabForm: 'Question Form',
    fabWA: 'WhatsApp',
    splashLabel: 'KKR Kapa District',
    splashWelcome: 'Welcome To',
    splashHint: 'Please wait...',
    splashLoading: 'Loading...',
    programTitle: 'Schedule',
    programDesc: '20 - 25 July 2026',
    programDownload: 'Download Schedule',
    programDownloadSub: 'PNG Format · 20-24 July 2026',
    petugasTitle: 'Workers',
    petugasDesc: 'List of KKR 2026 workers',
    galleryTitle: 'Gallery',
    galleryDesc: 'Theme song and KKR 2026 media',
    announceTitle: 'Announcements',
    announceDesc: 'Latest KKR 2026 info',
    graphTitle: 'Daily Attendance',
    graphEmpty: 'No attendance data.',
    lirikBtn: '📄 Lyrics',
    lirikClose: 'Close Lyrics',
    lirikBtnEn: '📄 BM Lyrics',
    lirikCloseEn: 'Close BM Lyrics',
    loading: 'Loading...',
    empty: 'No data.',
    error: 'Failed to load.',
    livestream: 'Live Stream',
    livestreamBtn: 'Watch Now',
    sabatTitle: 'Joint Sabbath Service',
    sabatVenue: 'Auditorium Adventist, Tamparuli',
    sabatSesiPagi: 'Morning Session',
    sabatSesiPetang: 'Afternoon Session',
    sabatClose: 'Close',
    checkinTitle: 'KKR Attendance',
    checkinSub: 'Please fill in your details to check in',
    checkinName: 'Full Name',
    checkinChurch: 'Home Church',
    checkinBilangan: 'Number of Family Members',
    checkinBtn: 'Check In',
    checkinSuccess: 'Check In Successful!',
    checkinSuccessMsg: 'Welcome to KKR',
    checkinDuplicate: 'Already Checked In',
    checkinDuplicateMsg: 'You have already checked in today',
    checkinRedirect: 'Redirecting...',
    checkinHome: 'Go to Home →',
    checkinReset: 'Not you? Click here',
    dayMon: 'Monday', dayTue: 'Tuesday', dayWed: 'Wednesday', dayThu: 'Thursday', dayFri: 'Friday', daySat: 'Sabbath',
    daySun: 'Sunday',
    programSabat: 'Sabbath',
    downloadCard: 'Download Schedule',
    downloadCardSub: 'PNG Format · 20-24 July 2026',
    ajkTitle: 'KKR 2026 Committee List',
    confirmTitle: 'Confirm?',
    confirmName: 'Name',
    confirmChurch: 'Church',
    confirmBil: 'Members',
    speakerModalTitle: 'Speaker Background',
    petugasModalTitle: 'Worker List',
    rolePetugas: 'Worker',
    albumTitle: 'Photo Album',
    albumDay: 'Day',
    albumEmpty: 'Photos will be uploaded soon. Please come back later.',
    noData: 'No data.',
  }
}

function t(key) { return L10N[lang][key] || key }
function dayLabels() { return [t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri')] }

function toggleLang() {
  lang = lang === 'ms' ? 'en' : 'ms'
  try { localStorage.setItem('kkr_lang', lang) } catch (e) {}
  location.reload()
}

// ===== CSV PARSER =====
function parseCSV(text) {
  const items = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') { inQ = !inQ; continue }
    if (c === ',' && !inQ) { items.push(cur.trim()); cur = ''; continue }
    if ((c === '\n' || c === '\r') && !inQ) {
      if (cur) items.push(cur.trim())
      cur = ''
      if (c === '\r') i++
      items.push('__ROW__')
      continue
    }
    cur += c
  }
  if (cur) items.push(cur.trim())
  const rows = []
  let row = []
  for (const item of items) {
    if (item === '__ROW__') { if (row.length) rows.push(row); row = []; }
    else row.push(item)
  }
  if (row.length) rows.push(row)
  return rows
}

async function fetchCSV(url) {
  const res = await fetch(url, { cache: 'no-store' })
  return parseCSV(await res.text())
}

// ===== DATA FETCHERS =====
async function getEventInfo() {
  const rows = await fetchCSV(SHEETS.eventInfo)
  const map = {}
  for (const r of rows) if (r[0] && r[1]) map[r[0].trim()] = r[1].trim()
  return map
}

async function getProgram() {
  const rows = await fetchCSV(SHEETS.program)
  if (rows.length < 2) return { days: [], slots: [] }
  const days = rows[0].slice(1).filter(Boolean)
  const slots = rows.slice(1).filter(r => r[0]).map(r => {
    const parts = r[0].split('\n')
    return { role: parts[0].trim(), time: parts[1] ? parts[1].trim() : '', schedule: r.slice(1) }
  })
  return { days, slots }
}

async function getPetugas() {
  const rows = await fetchCSV(SHEETS.petugas)
  if (rows.length < 2) return { days: [], roles: [] }
  const days = rows[0].slice(1).filter(Boolean)
  const roles = rows.slice(1).filter(r => r[0]).map(r => ({ role: r[0].trim(), assignments: r.slice(1) }))
  return { days, roles }
}

async function getAnnouncements() {
  const rows = await fetchCSV(SHEETS.announcements)
  const list = []
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0]) list.push({ no: rows[i][0].trim(), title: (rows[i][1] || '').trim(), content: (rows[i][2] || '').trim() })
  }
  return list
}

function updateAnnounceBadge(count) {
  const badge = document.getElementById('announceBadge')
  if (badge) {
    badge.textContent = count
    badge.style.display = count > 0 ? 'flex' : 'none'
  }
}

async function loadBadge() {
  try {
    const list = await getAnnouncements()
    updateAnnounceBadge(list.length)
  } catch (e) {}
}

/* ── Get today's date in Malaysia time (UTC+8) ── */
function getTodayMsia() {
  const now = new Date()
  const msia = new Date(now.getTime() + 8 * 3600000)
  return msia.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/* ── Attendance stats ── */
async function getAttendanceStats() {
  try {
    const csv = await fetchCSV(SHEETS.attendance)
    const rows = csv.slice(1).filter(r => r[0] && r[0].trim())
    const todayStr = getTodayMsia()
    let today = 0
    let total = 0
    rows.forEach(r => {
      const rowDate = r[1] ? r[1].trim() : ''
      const bil = parseInt(r[4], 10) || 1
      total += bil
      if (rowDate === todayStr) today += bil
    })
    return { total, today }
  } catch (e) {
    console.warn('Attendance stats error:', e)
    return null
  }
}

async function renderStats() {
  const container = document.getElementById('statsContainer')
  if (!container) return

  const now = new Date()
  const msia = new Date(now.getTime() + 8 * 3600000)
  const msiaDate = new Date(Date.UTC(msia.getFullYear(), msia.getMonth(), msia.getDate()))
  const start = new Date(Date.UTC(2026, 6, 20))
  const end = new Date(Date.UTC(2026, 6, 26))

  if (msiaDate < start) {
    container.innerHTML = '<div class="stat-card" style="width:100%;text-align:center"><span class="stat-number" style="font-size:16px">⏳</span><span class="stat-label">' + t('statsBefore') + '</span></div>'
    return
  }

  const stats = await getAttendanceStats()
  if (!stats) return

  if (msiaDate > end) {
    container.innerHTML = `<div class="stat-card" style="width:100%"><span class="stat-number">${stats.total}</span><span class="stat-label">${t('statsTotal')}</span></div>`
    return
  }

  container.innerHTML = `<div class="stat-card" style="width:100%"><span class="stat-number">${stats.today}</span><span class="stat-label">${t('statsToday')}</span></div>`
}

async function renderAttendanceGraph() {
  const el = document.getElementById('attendanceGraph')
  if (!el) return
  try {
    const csv = await fetchCSV(SHEETS.attendance)
    const dayMap = {}
    csv.slice(1).filter(r => r[0]).forEach(r => {
      const d = r[1] ? r[1].trim() : ''
      const bil = parseInt(r[4], 10) || 1
      if (d) dayMap[d] = (dayMap[d] || 0) + bil
    })
    const dates = Object.keys(dayMap).sort()
    if (!dates.length) {
      el.innerHTML = '<p style="color:var(--gray);font-size:13px;text-align:center">' + t('graphEmpty') + '</p>'
      return
    }
    const max = Math.max(...Object.values(dayMap), 1)
    const dayNames = [t('daySun') || 'Ahad', t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri'), t('daySat')]
    let html = '<div class="graph-body">'
    dates.forEach((d, i) => {
      const day = new Date(d)
      const label = !isNaN(day.getTime()) ? dayNames[day.getDay()] : d.split(' ')[0] || d
      const pct = (dayMap[d] / max) * 100
      html += `
        <div class="graph-row">
          <span class="graph-label">${label}</span>
          <div class="graph-bar-wrap">
            <div class="graph-bar" style="width:${pct}%;transition-delay:${i * 0.06}s"></div>
          </div>
          <span class="graph-count">${dayMap[d]}</span>
        </div>`
    })
    html += '</div>'
    el.innerHTML = html
  } catch (e) {
    el.innerHTML = '<p style="color:var(--gray);font-size:13px;text-align:center">' + t('graphEmpty') + '</p>'
  }
}

// ===== MODAL =====
function openModal(title, bodyHTML) {
  const overlay = document.getElementById('modalOverlay')
  if (!overlay) return
  document.getElementById('modalTitle').textContent = title
  document.getElementById('modalBody').innerHTML = bodyHTML
  overlay.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay')
  if (!overlay) return
  overlay.classList.remove('open')
  document.body.style.overflow = ''
  const header = document.querySelector('.modal-header')
  if (header) header.style.display = ''
}

// ===== CONTACT FAB =====
function toggleContactMenu() {
  const fab = document.getElementById('contactFab')
  fab.classList.toggle('open')
}

document.addEventListener('click', function closeFab(e) {
  const fab = document.getElementById('contactFab')
  if (fab && !fab.contains(e.target) && fab.classList.contains('open')) {
    fab.classList.remove('open')
  }
})

function setupContactFab() {
  const label = document.querySelector('.fab-label')
  if (label) label.textContent = t('fabLabel')
  const options = document.querySelectorAll('.contact-option span')
  if (options.length >= 2) {
    options[0].textContent = t('fabForm')
    options[1].textContent = t('fabWA')
  }
  getEventInfo().then(info => {
    const waBtn = document.getElementById('waOption')
    const formBtn = document.getElementById('formOption')
    if (waBtn) {
      const contact = info['Contact'] || 'Pihak KKR'
      const raw = info['Whatsapp Number'] || ''
      const phone = raw.replace(/[^0-9]/g, '')
      if (phone) {
        waBtn.href = `https://wa.me/${phone}?text=Hai%20${encodeURIComponent(contact)}%2C%20saya%20ada%20soalan%20berkaitan%20KKR.`
      }
    }
    if (formBtn) {
      formBtn.href = info['Google Form Link'] || 'https://forms.gle/P8ZvxiimCh8nDJnq5'
    }
  }).catch(() => {})
}

// ===== SPEAKER MODAL =====
let speakerInfo = null

function openSpeakerModal() {
  if (!speakerInfo) return

  const overlay = document.getElementById('modalOverlay')
  const header = document.querySelector('.modal-header')
  const body = document.getElementById('modalBody')

  if (header) header.style.display = 'none'

  body.innerHTML = `
    <div class="speaker-modal-body">
      <img src="PrKim.jpeg" alt="${speakerInfo.name}" class="speaker-modal-img" onerror="this.style.display='none'">
      <div class="speaker-modal-gradient"></div>
      <div class="speaker-modal-info">
        <h3 class="speaker-modal-name">${speakerInfo.name}</h3>
        <p class="speaker-modal-role">${t('speakerRole')}</p>
        <p class="speaker-modal-bio">${speakerInfo.bio || t('noData')}</p>
      </div>
      <button class="speaker-modal-close" onclick="closeModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `

  overlay.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function openSabatModal() {
  const overlay = document.getElementById('modalOverlay')
  const header = document.querySelector('.modal-header')
  const body = document.getElementById('modalBody')

  if (header) header.style.display = 'none'

  body.innerHTML = `
    <div class="speaker-modal-body">
      <div class="sabat-hero">
        <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,var(--gold),#a8852e);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-bottom:16px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <h3 style="font-size:20px;font-weight:800;color:white;margin:0 0 4px">${t('sabatTitle')}</h3>
        <p style="color:var(--gold);font-size:13px;font-weight:600;margin:0 0 2px">25 Julai 2026</p>
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0">${t('sabatVenue')}</p>
      </div>
      <div class="sabat-gradient"></div>
      <div class="sabat-content">
        <div class="sabat-sesi">
          <h4 class="sabat-sesi-title">${t('sabatSesiPagi')}</h4>
          <table class="sabat-table">
            <tr><td class="sabat-time">7.30 pagi</td><td class="sabat-desc">Ketibaan Jemaat</td></tr>
            <tr><td class="sabat-time">8.00 – 8.45 pagi</td><td class="sabat-desc">Ucapan Alu-aluan<div class="sabat-sub">Lagu Pujian dan Penyembahan<br>Tayangan Montaj<br>Laporan Misi Sedunia<br>Sorotan Pelajaran Sekolah Sabat</div></td></tr>
            <tr><td class="sabat-time">8.45 – 9.45 pagi</td><td class="sabat-desc">Konsert Mini oleh Pastori Choir (Korea)</td></tr>
            <tr><td class="sabat-time">9.45 – 10.00 pagi</td><td class="sabat-desc">Persembahan Persepuluhan dan Persembahan</td></tr>
            <tr><td class="sabat-time">10.00 – 10.15 pagi</td><td class="sabat-desc">Ikrar Pembaptisan</td></tr>
            <tr><td class="sabat-time">10.15 – 11.15 pagi</td><td class="sabat-desc">Khotbah</td></tr>
            <tr><td class="sabat-time">11.15 – 12.15 tengah hari</td><td class="sabat-desc">Upacara Pembaptisan</td></tr>
            <tr><td class="sabat-time">12.30 tengah hari</td><td class="sabat-desc">Jamuan Kasih (Fellowship Lunch)</td></tr>
          </table>
        </div>
        <div class="sabat-sesi">
          <h4 class="sabat-sesi-title">${t('sabatSesiPetang')}</h4>
          <table class="sabat-table">
            <tr><td class="sabat-time">2.00 petang</td><td class="sabat-desc">Program Penutupan<div class="sabat-sub">Lagu Pujian oleh koir-koir tempatan (akan disahkan kemudian)</div></td></tr>
            <tr><td class="sabat-time">2.30 petang</td><td class="sabat-desc">Ucapan Penghargaan dan Tanda Terima Kasih (Sesi Bergambar)</td></tr>
            <tr><td class="sabat-time">3.30 petang</td><td class="sabat-desc">Doa Berkat (Benediction)</td></tr>
          </table>
        </div>
      </div>
      <button class="speaker-modal-close" onclick="closeModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `

  overlay.classList.add('open')
  document.body.style.overflow = 'hidden'
}

// ===== HOME PAGE =====
async function loadEventInfo() {
  const container = document.getElementById('eventInfoContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>'
  try {
    const info = await getEventInfo()
    container.innerHTML = ''

    speakerInfo = {
      name: info['Main Speaker'] || 'Pr. Taehyung Kim',
      bio: 'Pastor Kim Tae Hyung kini sedang melanjutkan pengajian di peringkat Doktor Pelayanan (Doctor of Ministry, D.Min.) di Adventist International Institute of Advanced Studies (AIIAS). Beliau kini memberi tumpuan kepada latihan misionari serta penyelidikan bagi menyiapkan disertasi kedoktorannya.',
    }

    const heroDates = document.getElementById('heroDates')
    const heroVenue = document.getElementById('heroVenue')
    if (heroDates) heroDates.textContent = `${info['Date Start'] || '?'} – ${info['Date End'] || '?'}`
    if (heroVenue) heroVenue.textContent = info['Venue'] || '-'

    if (info['Banner Image']) {
      const div = document.createElement('div')
      div.className = 'banner-wrap'
      div.innerHTML = `<img src="${info['Banner Image']}" alt="Banner" onerror="this.style.display='none'">`
      container.appendChild(div)
    }

    const spk = document.createElement('div')
    spk.className = 'card card-clickable'
    spk.style.cursor = 'pointer'
    spk.onclick = openSpeakerModal
    spk.innerHTML = `
      <h2 style="font-size:20px;margin-bottom:20px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" style="vertical-align:middle;margin-right:8px">
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
          <path d="M19 10v2a7 7 0 01-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
        ${t('speakerRole')}
      </h2>
      <div class="speaker-card">
        <img src="PrKim.jpeg" alt="Speaker" class="speaker-img" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'64\\' height=\\'64\\'><rect fill=\\'%23c8a24e\\' width=\\'64\\' height=\\'64\\' rx=\\'32\\'/><text x=\\'32\\' y=\\'38\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'12\\' font-family=\\'sans-serif'>Pr</text></svg>'">
        <div class="speaker-info" style="flex:1">
          <div class="speaker-name">${info['Main Speaker'] || '-'}</div>
          <div class="speaker-role">${t('speakerRole')}</div>
          <div class="speaker-hint">${t('speakerHint')}</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </div>`
    container.appendChild(spk)

    const statsBar = document.createElement('div')
    statsBar.id = 'statsContainer'
    statsBar.className = 'stats-bar'
    container.appendChild(statsBar)
    renderStats()

    const graphCard = document.createElement('div')
    graphCard.className = 'card'
    graphCard.innerHTML = `<h2 style="font-size:20px;margin-bottom:16px">📊 ${t('graphTitle')}</h2><div id="attendanceGraph"><div class="loading-wrap"><div class="spinner"></div></div></div>`
    container.appendChild(graphCard)
    renderAttendanceGraph()

    if (info['Livestream']) {
      const ls = document.createElement('div')
      ls.className = 'card'
      ls.innerHTML = `<h2 style="font-size:20px;margin-bottom:20px">📺 ${t('livestream')}</h2><a href="${info['Livestream']}" target="_blank" class="livestream-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        ${t('livestreamBtn')}
      </a>`
      container.appendChild(ls)
    }

    const sabatCard = document.createElement('div')
    sabatCard.className = 'card card-clickable'
    sabatCard.style.cursor = 'pointer'
    sabatCard.onclick = openSabatModal
    sabatCard.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--gold),#a8852e);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:15px;color:var(--primary)">${t('sabatTitle')}</div>
          <div style="font-size:12px;color:var(--gray);margin-top:2px">25 Julai 2026 · ${t('sabatVenue')}</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </div>`
    container.appendChild(sabatCard)
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">' + t('error') + '</p></div>'
  }
}

// ===== PROGRAM PAGE (Tabbed) =====
let programData = null

async function loadProgram() {
  const container = document.getElementById('programContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>'
  try {
    programData = await getProgram()
    if (!programData.days.length) { container.innerHTML = '<div class="empty-state">' + t('noData') + '</div>'; return }

    let tabsHTML = '<div class="program-dates" id="programTabs">'
    const rawDates = programData.days

    rawDates.forEach((d, i) => {
      const parts = d.split(' ')
      const month = MONTH_MAP[parts[1]] || parts[1] || ''
      const shortMonth = parts[1] ? parts[1].substring(0, 3) : ''
      const displayShort = parts[0] ? `${parts[0]} ${shortMonth}` : d

      tabsHTML += `<button class="program-date-tab" data-index="${i}" onclick="selectProgramDay(${i})">
        <span class="pdt-label">${dayLabels()[i] || ''}</span>
        <span class="pdt-date">${displayShort}</span>
      </button>`
    })
    tabsHTML += `<button class="program-date-tab" data-index="${rawDates.length}" onclick="selectProgramDay(${rawDates.length})">
      <span class="pdt-label">${t('programSabat')}</span>
      <span class="pdt-date">25 Jul</span>
    </button>`
    tabsHTML += '</div><div id="programDayContent"></div>'
    container.innerHTML = tabsHTML

    let defaultDay = 0
    try {
      const now = new Date()
      const eventStart = new Date(2026, 6, 20)
      if (now >= eventStart) {
        const diff = Math.floor((now - eventStart) / 86400000)
        defaultDay = Math.min(diff, rawDates.length)
      }
    } catch (e) {}
    selectProgramDay(defaultDay)
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">' + t('error') + '</p></div>'
  }
}

const SABAT_SCHEDULE = {
  pagi: [
    { time: '7.30 pagi', desc: 'Ketibaan Jemaat' },
    { time: '8.00 – 8.45 pagi', desc: 'Ucapan Alu-aluan', sub: ['Lagu Pujian dan Penyembahan', 'Tayangan Montaj', 'Laporan Misi Sedunia', 'Sorotan Pelajaran Sekolah Sabat'] },
    { time: '8.45 – 9.45 pagi', desc: 'Konsert Mini oleh Pastori Choir (Korea)' },
    { time: '9.45 – 10.00 pagi', desc: 'Persembahan Persepuluhan dan Persembahan' },
    { time: '10.00 – 10.15 pagi', desc: 'Ikrar Pembaptisan' },
    { time: '10.15 – 11.15 pagi', desc: 'Khotbah' },
    { time: '11.15 – 12.15 tengah hari', desc: 'Upacara Pembaptisan' },
    { time: '12.30 tengah hari', desc: 'Jamuan Kasih (Fellowship Lunch)' },
  ],
  petang: [
    { time: '2.00 petang', desc: 'Program Penutupan', sub: ['Lagu Pujian oleh koir-koir tempatan (akan disahkan kemudian)'] },
    { time: '2.30 petang', desc: 'Ucapan Penghargaan dan Tanda Terima Kasih (Sesi Bergambar)' },
    { time: '3.30 petang', desc: 'Doa Berkat (Benediction)' },
  ],
}

function renderSabatProgram() {
  let html = `<div class="program-day-card">
    <div class="program-day-header">
      <div class="day-name">${t('programSabat')}</div>
      <div class="day-date">25 Julai 2026</div>
      <div style="font-size:12px;color:var(--gold);font-weight:500;margin-top:4px">${t('sabatVenue')}</div>
    </div>`

  const renderSlots = (sesi, title) => {
    html += `<div class="sabat-sesi" style="padding:16px 18px 0">
      <h4 class="sabat-sesi-title" style="margin-bottom:12px">${title}</h4>`
    sesi.forEach(s => {
      html += `<div class="program-slot">
        <div class="slot-left">
          <div class="slot-role">${s.desc}</div>
          <div class="slot-time">${s.time}</div>
        </div>
      </div>`
      if (s.sub) {
        s.sub.forEach(line => {
          html += `<div style="font-size:12px;color:rgba(128,108,140,0.7);padding:2px 0 2px 42%">${line}</div>`
        })
      }
    })
    html += `</div>`
  }

  renderSlots(SABAT_SCHEDULE.pagi, t('sabatSesiPagi'))
  renderSlots(SABAT_SCHEDULE.petang, t('sabatSesiPetang'))

  html += '</div>'
  return html
}

function selectProgramDay(index) {
  const tabs = document.querySelectorAll('.program-date-tab')
  tabs.forEach((t, i) => t.classList.toggle('active', i === index))

  const content = document.getElementById('programDayContent')
  if (!content || !programData) return

  const sabatIndex = programData.days.length

  if (index === sabatIndex) {
    content.innerHTML = renderSabatProgram()
    tabs.forEach(t => {
      if (t.classList.contains('active')) {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    })
    return
  }

  const day = programData.days[index]
  const parts = day.split(' ')
  const month = MONTH_MAP[parts[1]] || parts[1] || ''
  const displayDate = parts[0] ? `${parts[0]} ${month} ${parts[2] || ''}` : day

  let html = `<div class="program-day-card">
    <div class="program-day-header">
      <div class="day-name">${dayLabels()[index] || ''}</div>
      <div class="day-date">${displayDate}</div>
    </div>`

  let hasSlots = false
  programData.slots.forEach(slot => {
    const person = slot.schedule[index] || ''
    if (!person) return
    hasSlots = true
    html += `<div class="program-slot">
      <div class="slot-left">
        <div class="slot-role">${slot.role}</div>
        ${slot.time ? `<div class="slot-time">${slot.time}</div>` : ''}
      </div>
      <div class="slot-person">${person}</div>
    </div>`
  })

  if (!hasSlots) html += '<div class="empty-state">' + t('noData') + '</div>'
  html += '</div>'
  content.innerHTML = html

  tabs.forEach(t => {
    if (t.classList.contains('active')) {
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  })
}

// ===== PETUGAS =====
const AJK_LIST = [
  { role: 'PENAUNG', person: 'SAB MISSION' },
  { role: 'PENASIHAT', person: 'PR. MAX BULOH SELAMAT' },
  { role: 'PENGERUSI', person: 'ELD. SONNY TIVON STIMOL' },
  { role: 'PENYELARAS KKR (FLOOR MANAGER)', person: 'ELDER JACKOL GIPIN' },
  { role: 'SETIAUSAHA', person: 'ELD. JACKOL GIPIN' },
  { role: 'BENDAHARI', person: 'PN. AGNES VIVY TOISIN' },
  { role: 'AJK KESELAMATAN & PARKIR', person: 'GEREJA KAPA' },
  { role: 'AJK BAPTISAN', person: 'ELD. JOLIUS UMBARIS' },
  { role: 'AJK PROMOSI & MEDIA', person: 'ELD. WILFRED NYUK & EN. JOY BRANDON' },
  { role: 'AJK PENYEDIAAN CENDERAHATI', person: 'PN. AGNES VIVY TOISIN' },
  { role: 'AJK PENYEDIAAN MAKANAN & MINUMAN', person: 'PN. MERLYN VALDEZ & PW G. KAPA' },
  { role: 'AJK KEBERSIHAN', person: 'GEREJA KAPA' },
  { role: 'AJK PENYAMBUT TETAMU', person: 'DIAKONES GEREJA MASING-MASING (MENGIKUT JADUAL BERTUGAS)' },
  { role: 'AJK PA SYSTEM', person: 'ELD. WILFRED & EN. RAIZAL' },
  { role: 'AJK MUSIK', person: 'CIK CAMELIA WILFRED' },
  { role: 'AJK DOA KHAS', person: 'PENYELARAS KKR GEREJA LOKAL' },
  { role: 'AJK PENJUALAN BUKU-BUKU', person: 'PN. TIAMBIN MANGKI' },
  { role: 'AJK KESIHATAN', person: 'PN. JUPINAH JAHAN' },
  { role: 'AJK PKK', person: 'CIK LADIANA FERDI' },
  { role: 'AJK URUSETIA', person: 'EN. ERLANDSON KEITH SUBIN' },
  { role: 'AJK KECEMASAN', person: 'ELD. HARIKADOE' },
  { role: 'AJK PENGINAPAN', person: 'GEREJA KAPA' },
  { role: 'AJK PENGANGKUTAN', person: 'ELD. JUKILIN JAMINIK' },
]

function renderAJK() {
  let html = '<div class="card" style="margin-top:20px">'
  html += `<h2 style="font-size:20px;margin-bottom:16px">${t('ajkTitle')}</h2>`
  html += '<div class="ajk-grid">'
  AJK_LIST.forEach((a, i) => {
    html += `<div class="ajk-item"><div class="ajk-role">${i + 1}) ${a.role}</div><div class="ajk-person">: ${a.person}</div></div>`
  })
  html += '</div></div>'
  return html
}

async function loadPetugas() {
  const container = document.getElementById('petugasContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>'
  try {
    const data = await getPetugas()
    if (!data.days.length) { container.innerHTML = '<div class="empty-state">' + t('noData') + '</div>'; return }

    let html = '<div class="petugas-grid">'
    data.days.forEach((d, i) => {
      html += `<div class="petugas-card" onclick="openPetugasModal(${i})">
        <div>
          <div class="day-label">${dayLabels()[i] || ''}</div>
          <div class="day-date">${d}</div>
        </div>
        <div class="arrow">›</div>
      </div>`
    })
    html += '</div>'
    window.__petugasData = data
    container.innerHTML = html + renderAJK()
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">' + t('error') + '</p></div>'
  }
}

function openPetugasModal(dayIndex) {
  const data = window.__petugasData
  if (!data || !data.days[dayIndex]) return
  const title = `${dayLabels()[dayIndex] || ''}, ${data.days[dayIndex]}`
  let body = ''
  data.roles.forEach(r => {
    body += `<div class="role-item"><div class="role-dot"></div><div><div class="role-name">${r.role}</div><div class="role-person">${r.assignments[dayIndex] || '-'}</div></div></div>`
  })
  openModal(title, body)
}

// ===== ANNOUNCEMENTS =====
async function loadAnnouncements() {
  const container = document.getElementById('announceContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>'
  try {
    const list = await getAnnouncements()
    if (!list.length) { container.innerHTML = '<div class="empty-state">' + t('noData') + '</div>'; return }

    window.__announceData = list
    updateAnnounceBadge(list.length)
    let html = '<div class="announce-grid">'
    list.forEach((a, i) => {
      const preview = (a.content || '').replace(/\n/g, ' ').substring(0, 100)
      html += `<div class="announce-card" onclick="openAnnounceModal(${i})">
        <div class="announce-card-top">
          <span class="announce-badge">${a.no}</span>
          <div class="announce-title">${a.title}</div>
        </div>
        <div class="announce-preview">${preview}${(a.content || '').length > 100 ? '...' : ''}</div>
      </div>`
    })
    html += '</div>'
    container.innerHTML = html
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">' + t('error') + '</p></div>'
  }
}

function openAnnounceModal(index) {
  const a = window.__announceData[index]
  if (!a) return
  openModal(`${a.no}. ${a.title}`, `<div style="font-size:14px;color:var(--gray);line-height:1.7;white-space:pre-line">${a.content}</div>`)
}

// ===== GALLERY =====
const GALLERY_SONGS = [
  { title: 'Tabib Besar Ada Dekat', artist: 'LPMI', file: 'LPMI-69-TABIB-BESAR-ADA-DEKAT.mp3' },
]

let currentAudio = null
let currentSong = -1

const LIRIK = `(1)<br>Tabib besar ada dekat,<br>Yesus yang berkasihan;<br>Hai orang yang berhati brat,<br>Dengarlah suara Tuhan.<br><br><strong>Korus</strong><br>Lagu yang amat merdu<br>Bagi syurga dan dunia<br>Nyanyian amat merdu:<br>Nama Tuhan Yesus.<br><br>(2)<br>Ketakutan dihapuskan<br>Oleh namanya Yesus;<br>Aku rindulah dengarkan<br>Nama Yesus yang indah<br><br>(3)<br>Hormati dan puji Domba<br>Yang mati ganti kita;<br>Betapa manis bunyinya<br>Khabar slamat yang indah.<br><br>(4)<br>Bila nanti Tuhan datang,<br>Kita akan ke syurga;<br>Di sana kita slalu snang<br>Dan memakai mahkota.`

const LIRIK_EN = `(1)<br>The Great Physician now is near,<br>The sympathizing Jesus;<br>He speaks the drooping heart to cheer,<br>Oh, hear the voice of Jesus.<br><br><strong>Refrain</strong><br>Sweetest note in seraph song,<br>Sweetest name on mortal tongue;<br>Sweetest carol ever sung:<br>Jesus, blessed Jesus.<br><br>(2)<br>Your many sins are all forgiven,<br>Oh, hear the voice of Jesus;<br>Go on your way in peace to heaven,<br>And wear a crown with Jesus.<br><br>(3)<br>Come, weary sinner, see your need,<br>And trust the love of Jesus;<br>In Him you have a friend indeed,<br>He'll give you peace with Jesus.<br><br>(4)<br>And when to death's dark vale you come,<br>And think of seeing Jesus,<br>His presence still shall cheer your gloom,<br>The bliss of heaven with Jesus.`

function toggleLirik(index) {
  const el = document.getElementById(`lirik${index}`)
  if (!el) return
  const btn = document.getElementById(`lirikBtn${index}`)
  if (el.style.display === 'none' || !el.style.display) {
    el.style.display = 'block'
    if (btn) btn.textContent = t('lirikClose')
  } else {
    el.style.display = 'none'
    if (btn) btn.textContent = t('lirikBtn')
  }
}

function toggleLirikEn(index) {
  const el = document.getElementById(`lirikEn${index}`)
  if (!el) return
  const btn = document.getElementById(`lirikEnBtn${index}`)
  if (el.style.display === 'none' || !el.style.display) {
    el.style.display = 'block'
    if (btn) btn.textContent = t('lirikCloseEn')
  } else {
    el.style.display = 'none'
    if (btn) btn.textContent = t('lirikBtnEn')
  }
}

function loadGallery() {
  const container = document.getElementById('galleryContainer')
  if (!container) return
  let html = '<div class="gallery-list">'
  GALLERY_SONGS.forEach((s, i) => {
    html += `<div class="gallery-card" data-index="${i}">
      <div class="gallery-card-header">
        <div class="gallery-icon">
          <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
        <div class="gallery-meta">
          <div class="gallery-title">${s.title}</div>
          <div class="gallery-artist">${s.artist}</div>
        </div>
      </div>
      <div class="gallery-controls">
        <button class="gallery-play-btn" onclick="togglePlay(${i})" id="playBtn${i}">
          <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <div class="gallery-progress" onclick="seekAudio(${i}, event)">
          <div class="gallery-progress-fill" id="progress${i}"></div>
        </div>
        <span class="gallery-time" id="time${i}">0:00</span>
        <audio id="audio${i}" preload="none" src="${s.file}"></audio>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="lirik-toggle" id="lirikBtn${i}" onclick="toggleLirik(${i})">${t('lirikBtn')}</button>
        <button class="lirik-toggle" id="lirikEnBtn${i}" onclick="toggleLirikEn(${i})">${t('lirikBtnEn')}</button>
      </div>
      <div class="lirik-content" id="lirik${i}" style="display:none">
        <div class="lirik-body">${LIRIK}</div>
      </div>
      <div class="lirik-content" id="lirikEn${i}" style="display:none">
        <div class="lirik-body">${LIRIK_EN}</div>
      </div>
    </div>`
  })
  html += `<div class="gallery-card card-clickable" onclick="openAlbumModal()">
    <div class="gallery-card-header">
      <div class="gallery-icon" style="background:var(--gold)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8" cy="8" r="2"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
      <div class="gallery-meta">
        <div class="gallery-title">${t('albumTitle')}</div>
        <div class="gallery-artist">${t('albumDay')} 1 – 5</div>
      </div>
    </div>
  </div>`
  html += '</div>'
  container.innerHTML = html

  GALLERY_SONGS.forEach((_, i) => {
    const audio = document.getElementById(`audio${i}`)
    audio.addEventListener('timeupdate', () => {
      const progress = document.getElementById(`progress${i}`)
      const timeEl = document.getElementById(`time${i}`)
      if (progress && audio.duration) progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`
      if (timeEl) timeEl.textContent = formatTime(audio.currentTime)
    })
    audio.addEventListener('ended', () => {
      const btn = document.getElementById(`playBtn${i}`)
      if (btn) btn.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
      document.getElementById(`progress${i}`).style.width = '0%'
      document.getElementById(`time${i}`).textContent = '0:00'
      currentAudio = null
      currentSong = -1
    })
  })
}

function togglePlay(index) {
  const audio = document.getElementById(`audio${index}`)
  const btn = document.getElementById(`playBtn${index}`)
  if (!audio) return

  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause()
    const prevBtn = document.getElementById(`playBtn${currentSong}`)
    if (prevBtn) prevBtn.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
  }

  if (audio.paused) {
    audio.play()
    currentAudio = audio
    currentSong = index
    btn.innerHTML = `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
  } else {
    audio.pause()
    btn.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
    currentAudio = null
    currentSong = -1
  }
}

function seekAudio(index, event) {
  const audio = document.getElementById(`audio${index}`)
  if (!audio || !audio.duration) return
  const rect = event.currentTarget.getBoundingClientRect()
  const pct = (event.clientX - rect.left) / rect.width
  audio.currentTime = pct * audio.duration
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

// ===== ALBUM =====
const ALBUM_PHOTOS = [
  { day: 1, label: 'Isnin', date: '20 Julai 2026', photos: [] },
  { day: 2, label: 'Selasa', date: '21 Julai 2026', photos: [] },
  { day: 3, label: 'Rabu', date: '22 Julai 2026', photos: [] },
  { day: 4, label: 'Khamis', date: '23 Julai 2026', photos: [] },
  { day: 5, label: 'Jumaat', date: '24 Julai 2026', photos: [] },
]

function openAlbumModal() {
  let body = '<div class="album-day-grid">'
  ALBUM_PHOTOS.forEach((a, i) => {
    body += `<button class="album-day-btn" onclick="openAlbumDay(${i})">
      <div class="album-day-label">${t('albumDay')} ${a.day}</div>
      <div class="album-day-date">${a.label}, ${a.date}</div>
    </button>`
  })
  body += '</div>'
  openModal(t('albumTitle'), body)
}

function openAlbumDay(index) {
  const day = ALBUM_PHOTOS[index]
  if (!day) return
  const title = `${t('albumDay')} ${day.day}: ${day.label}, ${day.date}`
  let body
  if (day.photos && day.photos.length) {
    let grid = '<div class="album-photo-grid">'
    day.photos.forEach(p => {
      grid += `<img src="album/${p}" class="album-photo" onclick="openAlbumViewer(this.src)">`
    })
    grid += '</div>'
    body = grid
  } else {
    body = `<div class="album-empty-state">${t('albumEmpty')}</div>`
  }
  openModal(title, body)
}

// ===== SPLASH =====
function initSplash() {
  try {
    const eventEl = document.getElementById('splashEventName')
    const themeEl = document.getElementById('splashTheme')
    const labelEl = document.querySelector('.splash-content .label')
    const welcomeEl = document.querySelector('.splash-content h1')
    const hintEl = document.querySelector('.splash-hint')
    if (labelEl) labelEl.textContent = t('splashLabel')
    if (welcomeEl) welcomeEl.textContent = t('splashWelcome')
    if (hintEl) hintEl.textContent = t('splashHint')
    getEventInfo().then(info => {
      if (eventEl) eventEl.textContent = info['Event Name'] || t('heroTitle')
      if (themeEl) themeEl.textContent = `"${info['Theme'] || 'The Great Physician Is In'}"`
    }).catch(() => {})
  } catch (e) {}

  setTimeout(() => {
    try {
      const s = document.querySelector('.splash')
      if (s) { s.style.transition = 'opacity 0.4s'; s.style.opacity = '0' }
    } catch (e) {}
    setTimeout(() => { window.location.href = 'home.html' }, 400)
  }, 1500)
}

// ===== LANGUAGE UI =====
function applyTranslations() {
  const langToggle = document.getElementById('langToggle')
  if (langToggle) langToggle.textContent = lang === 'ms' ? 'EN' : 'BM'

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'))
  })

  const heroLabels = document.querySelectorAll('.hero-label, .home-label')
  heroLabels.forEach(el => { el.textContent = t('heroLabel') })

  const heroTitles = document.querySelectorAll('.hero-title, .home-hero > h1')
  heroTitles.forEach(el => { el.textContent = t('heroTitle') })

  document.querySelectorAll('.subtitle').forEach(el => { el.textContent = t('heroLabel') })

  const pageTitle = document.querySelector('.page-title')
  if (pageTitle) {
    const key = pageTitle.getAttribute('data-i18n')
    if (key) pageTitle.textContent = t(key)
  }

  const pageDesc = document.querySelector('.page-desc')
  if (pageDesc) {
    const key = pageDesc.getAttribute('data-i18n')
    if (key) pageDesc.textContent = t(key)
  }

  document.querySelectorAll('.countdown-lbl').forEach(el => {
    const map = { 'Hari': 'countdownDays', 'Jam': 'countdownHours', 'Minit': 'countdownMins', 'Saat': 'countdownSecs', 'Days': 'countdownDays', 'Hours': 'countdownHours', 'Mins': 'countdownMins', 'Secs': 'countdownSecs' }
    const key = map[el.textContent.trim()]
    if (key) el.textContent = t(key)
  })

  const navLinks = {
    'homeLink': 'pageHome',
    'programLink': 'pageProgram',
    'petugasLink': 'pagePetugas',
    'galleryLink': 'pageGallery',
    'announceLink': 'pageAnnounce',
  }
  Object.entries(navLinks).forEach(([id, key]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = t(key)
  })

  const downloadCards = document.querySelectorAll('.download-card-title')
  downloadCards.forEach(el => {
    const key = el.getAttribute('data-i18n') || 'downloadCard'
    el.textContent = t(key)
  })
  const downloadSubs = document.querySelectorAll('.download-card-sub')
  downloadSubs.forEach(el => {
    const key = el.getAttribute('data-i18n') || 'downloadCardSub'
    el.textContent = t(key)
  })
}

function addLangToggleUI() {
  let header = document.querySelector('.page-header .header-inner') || document.querySelector('.home-hero .header-inner')
  if (!header) {
    const pageHeader = document.querySelector('.page-header')
    if (pageHeader) {
      const inner = document.createElement('div')
      inner.className = 'header-inner'
      inner.style.cssText = 'display:flex;align-items:center;gap:12px;width:100%;margin-bottom:12px'
      pageHeader.insertBefore(inner, pageHeader.firstChild)
      header = inner
    }
  }
  if (!header || document.getElementById('langToggle')) return
  const btn = document.createElement('button')
  btn.id = 'langToggle'
  btn.textContent = lang === 'ms' ? 'EN' : 'BM'
  btn.style.cssText = 'background:var(--gold);color:white;border:none;border-radius:20px;padding:6px 14px;font-size:13px;font-weight:700;cursor:pointer;margin-left:auto;flex-shrink:0;transition:opacity 0.2s'
  btn.onmouseover = () => { btn.style.opacity = '0.85' }
  btn.onmouseout = () => { btn.style.opacity = '1' }
  btn.onclick = toggleLang
  header.appendChild(btn)
}

// ===== COUNTDOWN =====
function startCountdown() {
  const container = document.getElementById('countdownContainer')
  if (!container) return

  const target = new Date(Date.UTC(2026, 6, 20, 10, 0, 0)) // 6pm MYT = 10am UTC
  const cdDays = document.getElementById('cdDays')
  const cdHours = document.getElementById('cdHours')
  const cdMins = document.getElementById('cdMins')
  const cdSecs = document.getElementById('cdSecs')

  function tick() {
    const diff = target - new Date()
    if (diff <= 0) { container.style.display = 'none'; return }
    container.style.display = ''
    cdDays.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0')
    cdHours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0')
    cdMins.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
    cdSecs.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
  }

  tick()
  setInterval(tick, 1000)
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  try {
  const overlay = document.getElementById('modalOverlay')
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })

  if (document.getElementById('splashPage')) initSplash()
  if (document.getElementById('homePage')) { loadEventInfo(); loadBadge(); startCountdown(); setInterval(renderStats, 30000); setInterval(renderAttendanceGraph, 30000) }
  if (document.getElementById('programPage')) { loadProgram(); loadBadge() }
  if (document.getElementById('petugasPage')) { loadPetugas(); loadBadge() }
  if (document.getElementById('galleryPage')) { loadGallery(); loadBadge() }
  if (document.getElementById('announcePage')) loadAnnouncements()

  setupContactFab()
  addLangToggleUI()
  applyTranslations()
  } catch (e) { console.error(e) }
})
