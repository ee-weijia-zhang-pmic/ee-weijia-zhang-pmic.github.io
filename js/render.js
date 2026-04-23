/* ============================================================
   XYZ Lab — render.js
   Shared helpers for fetching JSON data and rendering pages.
   ============================================================ */

/** Show a loading message in the target element */
function showLoading(el) {
  el.innerHTML = '<p class="loading">Loading…</p>';
}

/** Show an error message in the target element */
function showError(el, msg) {
  el.innerHTML = `<p class="error">Could not load content: ${msg}</p>`;
}

/** Fetch a JSON file and call callback(data), or show error in el */
async function loadJSON(path, el, callback) {
  showLoading(el);
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    callback(data);
  } catch (err) {
    showError(el, err.message);
  }
}

/* ── People ─────────────────────────────────────────────────── */
function renderPeople(data, el) {
  const pi       = data.filter(p => p.role === 'PI');
  const students = data.filter(p => ['PhD Candidate','PhD Student', 'Post-doctoral Fellow', 'MPhil Student', 'Visiting Student', 'Undergraduate'].includes(p.role));
  const alumni   = data.filter(p => p.role === 'Alumni');

  let html = '';

  // PI section
  if (pi.length) {
    html += '<section><h2>Principal Investigator</h2>';
    pi.forEach(p => {
      html += `
        <div class="pi-card">
          ${p.photo
            ? `<img src="${p.photo}" alt="${p.name}">`
            : `<div class="photo-placeholder">Photo</div>`}
          <div class="info">
            <h3>${p.name}</h3>
            <div class="role">${p.role_title || p.role}</div>
            <p>${p.bio || ''}</p>
            <div class="links">
              ${p.email    ? `<a href="mailto:${p.email}">Email</a>` : ''}
              ${p.scholar  ? `<a href="${p.scholar}" target="_blank">Google Scholar</a>` : ''}
              ${p.cv       ? `<a href="${p.cv}" target="_blank">CV</a>` : ''}
              ${p.website  ? `<a href="${p.website}" target="_blank">Website</a>` : ''}
            </div>
          </div>
        </div>`;
    });
    html += '</section>';
  }

  // Current members section
  if (students.length) {
    html += '<section><h2>Lab Members</h2><div class="people-grid">';
    students.forEach(p => {
      html += `
        <div class="person-card">
          ${p.photo
            ? `<img src="${p.photo}" alt="${p.name}">`
            : `<div class="photo-placeholder">Photo</div>`}
          <div class="card-body">
            <h3>${p.name}</h3>
            <div class="role">${p.role}</div>
            ${p.area ? `<div class="area">${p.area}</div>` : ''}
          </div>
        </div>`;
    });
    html += '</div></section>';
  }

  // Alumni section
  if (alumni.length) {
    html += '<section><h2>Alumni</h2><ul class="alumni-list">';
    alumni.forEach(p => {
      html += `<li><strong>${p.name}</strong>${p.area ? ` — ${p.area}` : ''}${p.now ? `<span class="alumni-now">(Now: ${p.now})</span>` : ''}</li>`;
    });
    html += '</ul></section>';
  }

  // Group Photos Section
html += `
<section>
  <h2>Group Photos</h2>
  <div class="group-photo-grid">

    <div class="group-photo-item">
      <img src="assets/PhotowithProfWu.jpg" alt="Photo with Prof. Ng">
      <p>Photo with Prof. Wai Tung Ng, University of Toronto</p>
    </div>
    
    <div class="group-photo-item">
      <div class="group-photo-placeholder">Photo</div>
      <p>Team photo</p>
    </div>
    
  </div>
</section>
`;
   
el.innerHTML = html || '<p>No people found. Add entries to data/people.json.</p>';
}

/* ── News ───────────────────────────────────────────────────── */
function renderNews(data, el) {
  if (!data.length) {
    el.innerHTML = '<p>No news yet.</p>';
    return;
  }

  const years = [2026, 2025, 2024];
  let html = '';

  years.forEach(year => {
    const items = data.filter(item => item.year == year);
    if (!items.length) return;

    html += `<section><h2>${year}</h2>`;

    items.forEach(item => {
      html += `
        <div class="news-event">
          <h3>${item.headline}</h3>
          <p class="news-description">- ${item.description}</p>
      `;

      if (item.photos && item.photos.length) {
        html += `<div class="news-photo-grid">`;

        item.photos.forEach(photo => {
          html += `
            <div class="news-photo-item">
              <img src="${photo.image}" alt="${photo.caption}">
              <p>${photo.caption}</p>
            </div>
          `;
        });
        html += `</div>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  });
  el.innerHTML = html;
}

function renderNewsPreview(data, el, limit = 2) {
  if (!data.length) {
    el.innerHTML = '<p>No news yet.</p>';
    return;
  }

  const items = data.slice(0, limit);

  let html = '';

  items.forEach(item => {
    html += `
      <div class="news-preview-item">
        <h3>${item.headline}</h3>
        <p>${item.description}</p>
      </div>
    `;
  });

  el.innerHTML = html;
}

/* ── Research ───────────────────────────────────────────────── */
function renderResearch(data, el) {
  const groups = {
    ic_design: [],
    wbg_system: [],
    ai: []
  };

  data.forEach(item => {
    groups[item.section].push(item);
  });

  const sections = [
    {
      id: "ic-design",
      title: "Advanced Power IC Design",
      key: "ic_design"
    },
    {
      id: "wbg",
      title: "Devices & System Integration",
      key: "wbg_system"
    },
    {
      id: "ai",
      title: "AI-Assisted Power Applications",
      key: "ai"
    }
  ];

  let html = "";

  sections.forEach(sec => {
    html += `
      <section id="${sec.id}">
        <h2>${sec.title}</h2>
        <div class="research-section">
    `;
     
groups[sec.key].forEach((topic, index) => {

  const topicIds = {
    "Smart Switch for Wide-Bandgap Devices": "smart-switch",
    "Monolithic Novel IC Platform": "monolithic-ic",
    "Wide-Bandgap Power Devices Multi-physics Sensing and Predictive Control": "multi-physics",
    "Power Delivery for Next-Generation Computational Hardware": "power-delivery",
    "": "ai-topic"
  };

  const topicId = topicIds[topic.title] || `topic-${index}`;

  html += `
    <div class="research-topic" id="${topicId}">

      <div class="research-image">
        ${topic.image ? `<img src="${topic.image}" alt="${topic.title}">` : ''}
      </div>

      <div class="research-content">
        ${topic.title ? `<h3>${topic.title}</h3>` : ''}
        <p>${topic.description}</p>
      </div>

    </div>
  `;
});

    html += `</div></section>`;
  });

  el.innerHTML = html;
}
setTimeout(() => {
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}, 50);

/* ── Publications ───────────────────────────────────────────── */
function renderPublications(data, el) {
  if (!data.length) {
    el.innerHTML = '<p>No publications yet. Add entries to data/publications.json.</p>';
    return;
  }

  // Group by year, sort descending
  const byYear = {};
  data.forEach(pub => {
    if (!byYear[pub.year]) byYear[pub.year] = [];
    byYear[pub.year].push(pub);
  });
  const years = Object.keys(byYear).sort((a, b) => b - a);

  let html = '';
  years.forEach(year => {
    html += `<div class="pub-year-group"><div class="pub-year">${year}</div><ul class="pub-list">`;
    byYear[year].forEach(pub => {
      html += `
        <li class="pub-entry">
          <span class="pub-authors">${pub.authors}.</span>
          "<span class="pub-title">${pub.title}</span>."
          <span class="pub-venue">${pub.venue}</span>, ${pub.year}.
          <div class="pub-links">
            ${pub.pdf  ? `<a href="${pub.pdf}"  target="_blank">PDF</a>`  : ''}
            ${pub.code ? `<a href="${pub.code}" target="_blank">Code</a>` : ''}
            ${pub.doi  ? `<a href="${pub.doi}"  target="_blank">DOI</a>`  : ''}
          </div>
        </li>`;
    });
    html += '</ul></div>';
  });
  el.innerHTML = html + `
  <div class="pub-note" style="margin-top: 28px; color:#666; font-size:0.95rem;">
    <p>
      A full list of publications, including work prior to joining HKUST, is available on
      <a href="https://scholar.google.com/citations?user=7OlewaoAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
        Google Scholar
      </a>.
    </p>
  </div>
`;
}
/* ── home gallery ───────────────────────────── */

const viewport = document.querySelector('.gallery-viewport');
const images = document.querySelectorAll('.gallery-track img');
const prevBtn = document.querySelector('.gallery-btn.prev');
const nextBtn = document.querySelector('.gallery-btn.next');

function getCurrentIndex() {
  const left = viewport.scrollLeft;

  for (let i = 0; i < images.length; i++) {
    if (images[i].offsetLeft >= left - 5) {
      return i;
    }
  }

  return images.length - 1;
}

function goTo(index) {
  if (index < 0) index = 0;
  if (index > images.length - 1) index = images.length - 1;

  viewport.scrollTo({
    left: images[index].offsetLeft,
    behavior: 'smooth'
  });

  updateButtons(index);
}

function updateButtons(index = getCurrentIndex()) {
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index >= images.length - 1;
}

prevBtn.addEventListener('click', () => {
  const current = getCurrentIndex();
  goTo(current - 1);
});

nextBtn.addEventListener('click', () => {
  const current = getCurrentIndex();
  goTo(current + 1);
});

viewport.addEventListener('scroll', () => {
  updateButtons();
});

window.addEventListener('load', updateButtons);
window.addEventListener('resize', updateButtons);
