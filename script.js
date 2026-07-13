// ===== CONFIG =====
const SHEETS = {
  eventInfo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=0&single=true&output=csv',
  program: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=699491117&single=true&output=csv',
  petugas: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1535279811&single=true&output=csv',
  announcements: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=496101149&single=true&output=csv',
  attendance: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBR3ctB0FYmGtvlzTkTKe1-ZT8mN7cnA8pDUfnrBsANhchBYPB3swa1Ig83quvgALlynFOlDCwQEc1/pub?gid=1475228326&single=true&output=csv',
}
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIqTb_aMQWQtH-_uzttgc_DZg5shogZ6A6sVf5mrutiZ8P5hBkOql8uzhZftQpgloU/exec'

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
  const slots = rows.slice(1).filter(r => r[0]).map(r => ({ time: r[0].trim(), schedule: r.slice(1) }))
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

// ===== WHATSAPP FLOAT =====
async function setupWhatsApp() {
  const btn = document.getElementById('whatsappBtn')
  const waNumber = document.getElementById('waNumber')
  if (!btn) return
  try {
    const info = await getEventInfo()
    const contact = info['Contact'] || 'Pihak KKR'
    const raw = info['Whatsapp Number'] || ''
    const phone = raw.replace(/[^0-9]/g, '')
    if (phone) {
      waNumber.textContent = raw
      btn.href = `https://wa.me/${phone}?text=Hai%20${encodeURIComponent(contact)}%2C%20saya%20ada%20soalan%20berkaitan%20KKR.`
    }
  } catch (e) { console.error('WA setup error', e) }
}

// ===== EVENT INFO LOADER (for home page) =====
async function loadEventInfo() {
  const container = document.getElementById('eventInfoContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-screen" style="min-height:auto;padding:40px"><div class="spinner"></div></div>'
  try {
    const info = await getEventInfo()
    container.innerHTML = ''

    // Banner
    if (info['Banner Image']) {
      const banner = document.createElement('div')
      banner.className = 'card'
      banner.style.padding = '0'
      banner.style.overflow = 'hidden'
      banner.innerHTML = `<img src="${info['Banner Image']}" alt="Banner" style="width:100%;height:200px;object-fit:cover" onerror="this.style.display='none'">`
      container.appendChild(banner)
    }

    // Attendance count
    const countCard = document.createElement('div')
    countCard.id = 'countCard'
    container.appendChild(countCard)
    renderAttendanceCount()

    // Event info card
    const infoCard = document.createElement('div')
    infoCard.className = 'card'
    infoCard.innerHTML = `
      <h2>Maklumat Program</h2>
      <div class="info-row"><span class="info-label">Tarikh</span><span class="info-value">${info['Date Start'] || '?'} - ${info['Date End'] || '?'}</span></div>
      <div class="info-row"><span class="info-label">Tempat</span><span class="info-value">${info['Venue'] || '-'}</span></div>
      ${info['Venue Google Map'] ? `<a href="${info['Venue Google Map']}" target="_blank" class="link-gold link-map mt-2"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> Buka di Google Maps</a>` : ''}
    `
    container.appendChild(infoCard)

    // Speaker card
    const spkCard = document.createElement('div')
    spkCard.className = 'card'
    spkCard.innerHTML = `
      <h2>Pengkhotbah</h2>
      <div class="speaker">
        <img src="PrKim.jpeg" alt="Speaker" class="speaker-img" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'72\\' height=\\'72\\'><rect fill=\\'%23c8a24e\\' width=\\'72\\' height=\\'72\\' rx=\\'36\\'/><text x=\\'36\\' y=\\'42\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'13\\' font-family=\\'sans-serif\\'>Pr</text></svg>'">
        <div><div class="speaker-name">${info['Main Speaker'] || '-'}</div><div class="speaker-role">Pengkhotbah Utama</div></div>
      </div>`
    container.appendChild(spkCard)

    // Livestream
    if (info['Livestream']) {
      const ls = document.createElement('div')
      ls.className = 'card'
      ls.innerHTML = `<h2>Siaran Langsung</h2><a href="${info['Livestream']}" target="_blank" class="btn btn-navy" style="display:inline-block;padding:10px 24px;font-size:13px">Tonton Sekarang</a>`
      container.appendChild(ls)
    }

    // Contact card
    const ctc = document.createElement('div')
    ctc.className = 'card'
    ctc.innerHTML = `
      <h2>Hubungi</h2>
      <p style="font-size:13px;color:var(--gray)">${info['Contact'] || '-'}</p>
      ${info['Whatsapp Number'] ? `<a href="https://wa.me/${info['Whatsapp Number'].replace(/[^0-9]/g, '')}" target="_blank" class="link-gold" style="margin-top:6px;display:inline-block;font-size:13px">WhatsApp: ${info['Whatsapp Number']}</a>` : ''}
    `
    container.appendChild(ctc)
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">Gagal memuat maklumat. Sila muat semula halaman.</p></div>'
  }
}

async function renderAttendanceCount() {
  const card = document.getElementById('countCard')
  if (!card) return
  try {
    const stats = await getAttendanceStats()
    const dates = Object.entries(stats.daily).sort((a, b) => new Date(a[0]) - new Date(b[0]))
    card.className = 'card'
    card.innerHTML = `
      <h2>Kehadiran</h2>
      <div class="count-grid">
        <div class="count-box navy-box"><div class="count-number">${stats.today}</div><div class="count-label">Hari Ini</div></div>
        <div class="count-box gold-box"><div class="count-number">${stats.total}</div><div class="count-label">Jumlah</div></div>
      </div>
      ${dates.map(([d, c]) => `<div class="count-daily-item"><span>${d}</span><span style="font-weight:600">${c} orang</span></div>`).join('')}
    `
  } catch (e) {
    card.className = 'card'
    card.innerHTML = '<p style="font-size:13px;color:var(--gray)">Kehadiran: Gagal memuat.</p>'
  }
}

// ===== ATTENDANCE =====
async function submitAttendance(name, phone) {
  const today = getTodayMsia()

  try {
    const rows = await fetchCSV(SHEETS.attendance)
    const isDuplicate = rows.slice(1).some(r => {
      const rowDate = r[1] || ''
      const rowPhone = (r[3] || '').trim()
      return rowDate === today && rowPhone === phone.trim()
    })

    if (isDuplicate) {
      return { status: 'duplicate', message: 'Anda sudah check in hari ini' }
    }

    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name, phone }),
    })

    return { status: 'success', message: 'Check in berjaya! Selamat datang ke KKR.' }
  } catch (e) {
    return { status: 'error', message: 'Ralat rangkaian. Sila cuba lagi.' }
  }
}

// ===== LOAD PROGRAM =====
async function loadProgram() {
  const container = document.getElementById('programContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-screen" style="min-height:auto;padding:40px"><div class="spinner"></div></div>'
  try {
    const data = await getProgram()
    if (!data.days.length) { container.innerHTML = '<div class="card"><p style="font-size:13px;color:var(--gray)">Tiada data program.</p></div>'; return }

    const dayLabels = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat']
    let html = '<div class="table-wrap card" style="padding:0;overflow:hidden"><table class="program-table"><thead><tr><th style="text-align:left;padding-left:12px">Masa</th>'
    data.days.forEach((d, i) => {
      html += `<th><span class="day-label">${dayLabels[i] || ''}</span><span class="day-date">${d}</span></th>`
    })
    html += '</tr></thead><tbody>'
    data.slots.forEach(s => {
      html += `<tr><td class="time-col" style="padding-left:12px">${s.time}</td>`
      data.days.forEach((_, j) => {
        html += `<td>${s.schedule[j] || '-'}</td>`
      })
      html += '</tr>'
    })
    html += '</tbody></table></div>'

    html += '<div class="note-card">* Program pada 25 Julai 2026 akan diadakan di <strong>SASS Multipurpose Hall</strong> yang dikendalikan oleh pihak lain. Sila rujuk pengumuman untuk maklumat lanjut.</div>'

    container.innerHTML = html
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">Gagal memuat aturcara.</p></div>'
  }
}

// ===== LOAD PETUGAS =====
async function loadPetugas() {
  const container = document.getElementById('petugasContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-screen" style="min-height:auto;padding:40px"><div class="spinner"></div></div>'
  try {
    const data = await getPetugas()
    if (!data.days.length) { container.innerHTML = '<div class="card"><p style="font-size:13px;color:var(--gray)">Tiada data petugas.</p></div>'; return }

    const dayLabels = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat']
    let html = '<div class="petugas-grid">'
    data.days.forEach((d, i) => {
      html += `<div class="petugas-card" onclick="openPetugasModal(${i})">
        <div>
          <div class="day-label">${dayLabels[i] || ''}</div>
          <div class="day-date">${d}</div>
          <div class="role-count">${data.roles.length} peranan</div>
        </div>
        <div class="arrow">›</div>
      </div>`
    })
    html += '</div>'

    // Store data for modal
    window.__petugasData = data
    container.innerHTML = html
  } catch (e) {
    container.innerHTML = '<div class="card"><p style="color:#ef4444;font-size:13px">Gagal memuat petugas.</p></div>'
  }
}

function openPetugasModal(dayIndex) {
  const data = window.__petugasData
  if (!data || !data.days[dayIndex]) return
  const dayLabels = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat']
  const title = `${dayLabels[dayIndex] || ''}, ${data.days[dayIndex]}`
  let body = ''
  data.roles.forEach(r => {
    body += `<div class="role-item"><div class="role-dot"></div><div><div class="role-name">${r.role}</div><div class="role-person">${r.assignments[dayIndex] || '-'}</div></div></div>`
  })
  openModal(title, body)
}

// ===== LOAD ANNOUNCEMENTS =====
async function loadAnnouncements() {
  const container = document.getElementById('announceContainer')
  if (!container) return
  container.innerHTML = '<div class="loading-screen" style="min-height:auto;padding:40px"><div class="spinner"></div></div>'
  try {
    const list = await getAnnouncements()
    if (!list.length) { container.innerHTML = '<div class="card"><p style="font-size:13px;color:var(--gray)">Tiada pengumuman.</p></div>'; return }

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

// ===== ATTENDANCE PAGE =====
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
    submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto"></div>'

    const result = await submitAttendance(name, phone)

    formSection.style.display = 'none'
    statusSection.style.display = 'block'

    if (result.status === 'success') {
      statusSection.innerHTML = `
        <div class="status-box">
          <div class="status-icon success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></div>
          <h2 style="color:white">Check In Berjaya!</h2>
          <p class="status-msg">${result.message}</p>
          <p class="status-sub">Mengalihkan ke Laman Utama...</p>
        </div>`
    } else if (result.status === 'duplicate') {
      statusSection.innerHTML = `
        <div class="status-box">
          <div class="status-icon duplicate"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 9v2m0 4h.01"/></svg></div>
          <h2 style="color:white">Anda Sudah Check In</h2>
          <p class="status-msg" style="color:#fcd34d">${result.message}</p>
          <p class="status-sub">Mengalihkan ke Laman Utama...</p>
        </div>`
    } else {
      statusSection.innerHTML = `
        <div class="status-box">
          <div class="status-icon error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg></div>
          <h2 style="color:white">Ralat</h2>
          <p class="status-msg" style="color:#fca5a5">${result.message}</p>
          <p class="status-sub">Mengalihkan ke Laman Utama...</p>
        </div>`
    }

    setTimeout(() => { window.location.href = 'home.html' }, 2500)
  })
}

// ===== SPLASH PAGE =====
function initSplash() {
  const eventEl = document.getElementById('splashEventName')
  const themeEl = document.getElementById('splashTheme')
  const logo = document.getElementById('splashLogo')

  getEventInfo().then(info => {
    if (eventEl) eventEl.textContent = info['Event Name'] || 'KKR (Kebaktian Kebangunan Rohani)'
    if (themeEl) themeEl.textContent = info['Theme'] || 'The Great Physician Is In'
  }).catch(() => {})

  // Redirect after 3.5s
  setTimeout(() => {
    document.querySelector('.splash').style.transition = 'opacity 0.5s'
    document.querySelector('.splash').style.opacity = '0'
    setTimeout(() => { window.location.href = 'attendance.html' }, 500)
  }, 3500)
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Close modal on overlay click
  const overlay = document.getElementById('modalOverlay')
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })

  // Page-specific init
  if (document.getElementById('splashPage')) initSplash()
  if (document.getElementById('attendancePage')) initAttendancePage()
  if (document.getElementById('homePage')) { loadEventInfo(); setInterval(renderAttendanceCount, 30000) }
  if (document.getElementById('programPage')) loadProgram()
  if (document.getElementById('petugasPage')) loadPetugas()
  if (document.getElementById('announcePage')) loadAnnouncements()

  // WhatsApp setup
  setupWhatsApp()
})
