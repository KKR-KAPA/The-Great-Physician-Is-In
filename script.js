// ===== CONFIG =====
const SHEETS = {
  eventInfo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=0&single=true&output=csv',
  program: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=699491117&single=true&output=csv',
  petugas: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1535279811&single=true&output=csv',
  announcements: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=496101149&single=true&output=csv',
  attendance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1475228326&single=true&output=csv',
}
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIqTb_aMQWQtH-_uzttgc_DZg5shogZ6A6sVf5mrutiZ8P5hBkOql8uzhZftQpgloU/exec'

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
    if (rows[i][0]) list.push({ date: rows[i][0].trim(), title: (rows[i][1] || '').trim(), content: (rows[i][2] || '').trim() })
  }
  return list
}

async function getAttendanceStats() {
  const rows = await fetchCSV(SHEETS.attendance)
  if (rows.length < 2) return { total: 0, today: 0, daily: {} }
  const today = getTodayMsia()
  const daily = {}
  let total = 0
  for (let i = 1; i < rows.length; i++) {
    const d = rows[i][1]
    if (d) { daily[d] = (daily[d] || 0) + 1; total++ }
  }
  return { total, today: daily[today] || 0, daily }
}

function getTodayMsia() {
  const now = new Date()
  const msia = new Date(now.getTime() + 8 * 3600000)
  return msia.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
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
}

// ===== WHATSAPP =====
async function setupWhatsApp() {
  const btn = document.getElementById('whatsappBtn')
  if (!btn) return
  try {
    const info = await getEventInfo()
    const contact = info['Contact'] || 'Pihak KKR'
    const raw = info['Whatsapp Number'] || ''
    const phone = raw.replace(/[^0-9]/g, '')
    if (phone) {
      btn.href = `https://wa.me/${phone}?text=Hai%20${encodeURIComponent(contact)}%2C%20saya%20ada%20soalan%20berkaitan%20KKR.`
    }
  } catch (e) {}
}

// ===== SPEAKER MODAL =====
let speakerInfo = null

function openSpeakerModal() {
  if (!speakerInfo) return
  openModal('Latar Belakang Pembicara', `
    <div style="text-align:center;margin-bottom:20px">
      <img src="PrKim.jpeg" alt="${speakerInfo.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--gold)" onerror="this.style.display='none'">
      <h3 style="margin-top:12px;font-size:17px;font-weight:700;color:var(--primary)">${speakerInfo.name}</h3>
      <p style="color:var(--gold);font-size:13px;font-weight:600">Pembicara</p>
    </div>
    <div style="font-size:14px;color:var(--gray);line-height:1.8">
      ${speakerInfo.bio || 'Maklumat latar belakang akan dikemaskini.'}
    </div>
  `)
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
      bio: info['Speaker Bio'] || 'Maklumat latar belakang akan dikemaskini.',
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

    const statsDiv = document.createElement('div')
    statsDiv.id = 'statsBar'
    statsDiv.className = 'stats-bar'
    container.appendChild(statsDiv)
    renderStats()

    const spk = document.createElement('div')
    spk.className = 'card card-clickable'
    spk.style.cursor = 'pointer'
    spk.onclick = openSpeakerModal
    spk.innerHTML = `
      <h2 style="font-size:20px;margin-bottom:20px">🎤 Pembicara</h2>
      <div class="speaker-card">
        <img src="PrKim.jpeg" alt="Speaker" class="speaker-img" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'64\\' height=\\'64\\'><rect fill=\\'%23c8a24e\\' width=\\'64\\' height=\\'64\\' rx=\\'32\\'/><text x=\\'32\\' y=\\'38\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'12\\' font-family=\\'sans-serif\\'>Pr</text></svg>'">
        <div class="speaker-info" style="flex:1">
          <div class="speaker-name">${info['Main Speaker'] || '-'}</div>
          <div class="speaker-role">Pembicara</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>`
    container.appendChild(spk)

    const mapCard = document.createElement('div')
    mapCard.className = 'card'
    mapCard.innerHTML = `
      <h2 style="font-size:20px;margin-bottom:16px">📍 Lokasi</h2>
      <div class="info-item" style="margin-bottom:12px"><span class="info-label">Tempat</span><span class="info-value">${info['Venue'] || '-'}</span></div>
      ${info['Venue Google Map'] ? `<a href="${info['Venue Google Map']}" target="_blank" class="info-link" style="margin-top:4px">
        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> Buka di Google Maps
      </a>` : ''}
    `
    container.appendChild(mapCard)

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

async function renderStats() {
  const bar = document.getElementById('statsBar')
  if (!bar) return
  try {
    const stats = await getAttendanceStats()
    const dates = Object.entries(stats.daily).sort((a, b) => new Date(a[0]) - new Date(b[0]))
    bar.innerHTML = `
      <div class="stat-card"><div class="stat-number">${stats.today}</div><div class="stat-label">Hari Ini</div></div>
      <div class="stat-card"><div class="stat-number gold">${stats.total}</div><div class="stat-label">Jumlah</div></div>
    `

    let dailyHTML = ''
    if (dates.length) {
      dailyHTML = '<div class="daily-list">' + dates.map(([d, c]) =>
        `<div class="daily-item"><span class="daily-date">${d}</span><span class="daily-num">${c} orang</span></div>`
      ).join('') + '</div>'
    }

    const existingDaily = document.getElementById('dailyBreakdown')
    if (existingDaily) existingDaily.innerHTML = dailyHTML || '<div class="empty-state">Belum ada data kehadiran.</div>'
  } catch (e) {}
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

    // Build tabs
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

    // Auto-select day
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

  // Scroll active tab into view
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
          <div class="role-count">${data.roles.length} peranan</div>
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
    let html = '<div class="announce-grid">'
    list.forEach((a, i) => {
      const preview = (a.content || '').replace(/\n/g, ' ').substring(0, 100)
      html += `<div class="announce-card" onclick="openAnnounceModal(${i})">
        <div class="announce-date">${a.date}</div>
        <div class="announce-title">${a.title}</div>
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
  openModal(a.title, `<p style="color:var(--gold);font-size:12px;font-weight:600;margin-bottom:12px">${a.date}</p><div style="font-size:14px;color:var(--gray);line-height:1.7;white-space:pre-line">${a.content}</div>`)
}

// ===== ATTENDANCE =====
function initAttendancePage() {
  const form = document.getElementById('attendanceForm')
  const nameInput = document.getElementById('nameInput')
  const phoneInput = document.getElementById('phoneInput')
  const submitBtn = document.getElementById('submitBtn')
  const formSection = document.getElementById('formSection')
  const statusSection = document.getElementById('statusSection')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = nameInput.value.trim()
    const phone = phoneInput.value.trim()
    if (!name || !phone) return

    submitBtn.disabled = true
    submitBtn.innerHTML = '<div style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto"></div>'

    const today = getTodayMsia()
    let isDuplicate = false

    try {
      const rows = await fetchCSV(SHEETS.attendance)
      isDuplicate = rows.slice(1).some(r => {
        const rowDate = r[1] || ''
        const rowPhone = (r[3] || '').trim()
        return rowDate === today && rowPhone === phone.trim()
      })
    } catch (e) {}

    if (!isDuplicate) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ name, phone }),
        })
      } catch (e) {}
    }

    formSection.style.display = 'none'
    statusSection.style.display = 'block'

    if (isDuplicate) {
      statusSection.innerHTML = `
        <div class="status-box">
          <div class="status-icon duplicate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01"/></svg>
          </div>
          <h2>Anda Sudah Check In</h2>
          <p class="status-msg" style="color:#fcd34d">Anda sudah check in hari ini</p>
          <p class="status-sub">Mengalihkan ke Laman Utama...</p>
        </div>`
    } else {
      statusSection.innerHTML = `
        <div class="status-box">
          <div class="status-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2>Check In Berjaya!</h2>
          <p class="status-msg">Selamat datang ke KKR</p>
          <p class="status-sub">Mengalihkan ke Laman Utama...</p>
        </div>`
    }

    setTimeout(() => { window.location.href = 'home.html' }, 2500)
  })
}

// ===== SPLASH =====
function initSplash() {
  const eventEl = document.getElementById('splashEventName')
  const themeEl = document.getElementById('splashTheme')
  getEventInfo().then(info => {
    if (eventEl) eventEl.textContent = info['Event Name'] || 'KKR (Kebaktian Kebangunan Rohani)'
    if (themeEl) themeEl.textContent = `"${info['Theme'] || 'The Great Physician Is In'}"`
  }).catch(() => {})

  setTimeout(() => {
    document.querySelector('.splash').style.transition = 'opacity 0.5s'
    document.querySelector('.splash').style.opacity = '0'
    setTimeout(() => { window.location.href = 'attendance.html' }, 500)
  }, 3500)
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay')
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })

  if (document.getElementById('splashPage')) initSplash()
  if (document.getElementById('attendancePage')) initAttendancePage()
  if (document.getElementById('homePage')) { loadEventInfo(); setInterval(renderStats, 30000) }
  if (document.getElementById('programPage')) loadProgram()
  if (document.getElementById('petugasPage')) loadPetugas()
  if (document.getElementById('announcePage')) loadAnnouncements()

  setupWhatsApp()
})
