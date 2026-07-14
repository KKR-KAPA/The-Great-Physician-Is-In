// ===== CONFIG =====
const SHEETS = {
  eventInfo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=0&single=true&output=csv',
  program: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=699491117&single=true&output=csv',
  petugas: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1535279811&single=true&output=csv',
  announcements: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=496101149&single=true&output=csv',
  attendance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1475228326&single=true&output=csv',
}

const DAY_LABELS = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat']
const MONTH_MAP = { Jan: 'Januari', Feb: 'Februari', Mar: 'Mac', Apr: 'April', May: 'Mei', Jun: 'Jun', Jul: 'Julai', Aug: 'Ogos', Sep: 'September', Oct: 'Oktober', Nov: 'November', Dec: 'Disember' }

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
    container.innerHTML = '<div class="stat-card" style="width:100%;text-align:center"><span class="stat-number" style="font-size:16px">⏳</span><span class="stat-label">KKR akan bermula pada 20 Julai 2026</span></div>'
    return
  }

  const stats = await getAttendanceStats()
  if (!stats) return

  if (msiaDate > end) {
    container.innerHTML = `<div class="stat-card" style="width:100%"><span class="stat-number">${stats.total}</span><span class="stat-label">Jumlah Kehadiran Keseluruhan</span></div>`
    return
  }

  container.innerHTML = `<div class="stat-card" style="width:100%"><span class="stat-number">${stats.today}</span><span class="stat-label">Kehadiran Hari Ini</span></div>`
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
      el.innerHTML = '<p style="color:var(--gray);font-size:13px;text-align:center">Tiada data kehadiran.</p>'
      return
    }
    const max = Math.max(...Object.values(dayMap), 1)
    const dayNames = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu']
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
    el.innerHTML = '<p style="color:var(--gray);font-size:13px;text-align:center">Tiada data kehadiran.</p>'
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
        <p class="speaker-modal-role">Pembicara</p>
        <p class="speaker-modal-bio">${speakerInfo.bio || 'Maklumat latar belakang akan dikemaskini.'}</p>
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
        Pembicara
      </h2>
      <div class="speaker-card">
        <img src="PrKim.jpeg" alt="Speaker" class="speaker-img" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'64\\' height=\\'64\\'><rect fill=\\'%23c8a24e\\' width=\\'64\\' height=\\'64\\' rx=\\'32\\'/><text x=\\'32\\' y=\\'38\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'12\\' font-family=\\'sans-serif\\'>Pr</text></svg>'">
        <div class="speaker-info" style="flex:1">
          <div class="speaker-name">${info['Main Speaker'] || '-'}</div>
          <div class="speaker-role">Pembicara</div>
          <div class="speaker-hint">Klik untuk info lanjut</div>
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
    graphCard.innerHTML = '<h2 style="font-size:20px;margin-bottom:16px">📊 Kehadiran Setiap Hari</h2><div id="attendanceGraph"><div class="loading-wrap"><div class="spinner"></div></div></div>'
    container.appendChild(graphCard)
    renderAttendanceGraph()

    if (info['Livestream']) {
      const ls = document.createElement('div')
      ls.className = 'card'
      ls.innerHTML = `<h2 style="font-size:20px;margin-bottom:20px">📺 Siaran Langsung</h2><a href="${info['Livestream']}" target="_blank" class="livestream-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Tonton Sekarang
      </a>`
      container.appendChild(ls)
    }
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">Gagal memuat maklumat.</p></div>'
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
    if (!programData.days.length) { container.innerHTML = '<div class="empty-state">Tiada data program.</div>'; return }

    let tabsHTML = '<div class="program-dates" id="programTabs">'
    const rawDates = programData.days

    rawDates.forEach((d, i) => {
      const parts = d.split(' ')
      const month = MONTH_MAP[parts[1]] || parts[1] || ''
      const shortMonth = parts[1] ? parts[1].substring(0, 3) : ''
      const displayShort = parts[0] ? `${parts[0]} ${shortMonth}` : d

      tabsHTML += `<button class="program-date-tab" data-index="${i}" onclick="selectProgramDay(${i})">
        <span class="pdt-label">${DAY_LABELS[i] || ''}</span>
        <span class="pdt-date">${displayShort}</span>
      </button>`
    })
    tabsHTML += '</div><div id="programDayContent"></div>'
    container.innerHTML = tabsHTML

    let defaultDay = 0
    try {
      const now = new Date()
      const eventStart = new Date(2026, 6, 20)
      if (now >= eventStart && now < new Date(2026, 6, 25)) {
        const diff = Math.floor((now - eventStart) / 86400000)
        defaultDay = Math.min(diff, rawDates.length - 1)
      }
    } catch (e) {}
    selectProgramDay(defaultDay)
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">Gagal memuat aturcara.</p></div>'
  }
}

function selectProgramDay(index) {
  const tabs = document.querySelectorAll('.program-date-tab')
  tabs.forEach((t, i) => t.classList.toggle('active', i === index))

  const content = document.getElementById('programDayContent')
  if (!content || !programData) return

  const day = programData.days[index]
  const parts = day.split(' ')
  const month = MONTH_MAP[parts[1]] || parts[1] || ''
  const displayDate = parts[0] ? `${parts[0]} ${month} ${parts[2] || ''}` : day

  let html = `<div class="program-day-card">
    <div class="program-day-header">
      <div class="day-name">${DAY_LABELS[index] || ''}</div>
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

  if (!hasSlots) html += '<div class="empty-state">Tiada jadual untuk hari ini.</div>'
  html += '</div>'
  content.innerHTML = html

  tabs.forEach(t => {
    if (t.classList.contains('active')) {
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  })
}

// ===== PETUGAS =====
async function loadPetugas() {
  const container = document.getElementById('petugasContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>'
  try {
    const data = await getPetugas()
    if (!data.days.length) { container.innerHTML = '<div class="empty-state">Tiada data petugas.</div>'; return }

    let html = '<div class="petugas-grid">'
    data.days.forEach((d, i) => {
      html += `<div class="petugas-card" onclick="openPetugasModal(${i})">
        <div>
          <div class="day-label">${DAY_LABELS[i] || ''}</div>
          <div class="day-date">${d}</div>
        </div>
        <div class="arrow">›</div>
      </div>`
    })
    html += '</div>'
    window.__petugasData = data
    container.innerHTML = html
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">Gagal memuat petugas.</p></div>'
  }
}

function openPetugasModal(dayIndex) {
  const data = window.__petugasData
  if (!data || !data.days[dayIndex]) return
  const title = `${DAY_LABELS[dayIndex] || ''}, ${data.days[dayIndex]}`
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
    if (!list.length) { container.innerHTML = '<div class="empty-state">Tiada pengumuman.</div>'; return }

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
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">Gagal memuat pengumuman.</p></div>'
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

function toggleLirik(index) {
  const el = document.getElementById(`lirik${index}`)
  if (!el) return
  const btn = document.getElementById(`lirikBtn${index}`)
  if (el.style.display === 'none' || !el.style.display) {
    el.style.display = 'block'
    if (btn) btn.textContent = 'Tutup Lirik'
  } else {
    el.style.display = 'none'
    if (btn) btn.textContent = '📄 Lirik'
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
      <button class="lirik-toggle" id="lirikBtn${i}" onclick="toggleLirik(${i})">📄 Lirik</button>
      <div class="lirik-content" id="lirik${i}" style="display:none">
        <div class="lirik-body">${LIRIK}</div>
      </div>
    </div>`
  })
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

// ===== SPLASH =====
function initSplash() {
  const eventEl = document.getElementById('splashEventName')
  const themeEl = document.getElementById('splashTheme')
  getEventInfo().then(info => {
    if (eventEl) eventEl.textContent = info['Event Name'] || 'KEBAKTIAN KEBANGUNAN ROHANI'
    if (themeEl) themeEl.textContent = `"${info['Theme'] || 'The Great Physician Is In'}"`
  }).catch(() => {})

  setTimeout(() => {
    document.querySelector('.splash').style.transition = 'opacity 0.5s'
    document.querySelector('.splash').style.opacity = '0'
    setTimeout(() => { window.location.href = 'home.html' }, 500)
  }, 3500)
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay')
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })

  if (document.getElementById('splashPage')) initSplash()
  if (document.getElementById('homePage')) { loadEventInfo(); loadBadge(); setInterval(renderStats, 30000); setInterval(renderAttendanceGraph, 30000) }
  if (document.getElementById('programPage')) { loadProgram(); loadBadge() }
  if (document.getElementById('petugasPage')) { loadPetugas(); loadBadge() }
  if (document.getElementById('galleryPage')) { loadGallery(); loadBadge() }
  if (document.getElementById('announcePage')) loadAnnouncements()

  setupContactFab()
})
