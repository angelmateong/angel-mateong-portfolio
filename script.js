// Light theme: dynamic population and interactions.
// resume.json drives visible sections (work history intentionally not displayed).
// Calendly popup configured using the calendly URL in resume.json.

const resumeUrl = './resume.json';

async function loadResume() {
  try {
    const res = await fetch(resumeUrl);
    if (!res.ok) throw new Error('resume.json not found. Using embedded defaults.');
    const data = await res.json();
    populateSite(data);
  } catch (err) {
    console.warn(err);
    populateSite(getDefaultData());
  }
}

function getDefaultData() {
  return {
    name: "Angel Mateong",
    headline: "Bookkeeper — Revenue reconciliation, audit-ready records & actionable insights",
    summary: "Detail-oriented accounting professional who ensures revenue is reconciled, schedules are audit-ready, and reports are simple to act on.",
    resumePdf: "Angel_Mateong_Resume.pdf",
    calendly: "https://calendly.com/angelmateong13",
    quickBenefits: [
      "Revenue reconciliation & variance resolution",
      "Audit-ready schedules & month-end close",
      "Automation with QuickBooks / NetSuite / POS"
    ],
    skills: [
      "Oracle NetSuite",
      "QuickBooks Online",
      "POS Systems (Posist, Loyverse)",
      "MS Excel (Pivot Tables, XLOOKUP)",
      "Hotel Management Systems (Hotelogix)"
    ],
    contact: {
      email: "angelmateong13@gmail.com",
      phone: "09127494474",
      location: "San Juan St, Santolan Pasig"
    },
    certifications: [
      "Certified International Bookkeeper (MICB)",
      "Certified QuickBooks ProAdvisor",
      "Google Data Analytics: Foundations"
    ]
  };
}

function populateSite(data){
  document.title = `${data.name} — Bookkeeper`;
  document.getElementById('brandName').textContent = data.name;
  document.getElementById('heroName').textContent = data.headline || 'Bookkeeping that makes your revenue accurate and your decisions clearer';
  document.getElementById('heroSummary').textContent = data.summary || '';
  const downloadLink = document.getElementById('downloadResume');
  if (downloadLink) downloadLink.href = data.resumePdf || '#';

  // Quick benefits
  const qb = document.getElementById('quickBenefits');
  if (qb) {
    qb.innerHTML = '';
    (data.quickBenefits || []).forEach(s=>{
      const li = document.createElement('li'); li.textContent = s; qb.appendChild(li);
    });
  }

  // Deliverables list (if present)
  const dl = document.getElementById('deliverablesList');
  if (dl) {
    const deliverables = [
      "Daily / monthly revenue reconciliation reports and variance notes",
      "Audit-ready schedules and deposit reconciliation workpapers",
      "Corrected journal entries and month-end close support",
      "Simple dashboards and cashflow snapshots with practical next steps"
    ];
    dl.innerHTML = deliverables.map(d => `<li>${d}</li>`).join('');
  }

  // Skills
  const skillList = document.getElementById('skillList');
  if (skillList) {
    skillList.innerHTML = '';
    (data.skills || []).forEach(s=>{
      const el = document.createElement('div'); el.className='skill-pill'; el.textContent = s; skillList.appendChild(el);
    });
  }

  // Contact info (visibility: show email & phone)
  const contactInfo = document.getElementById('contactInfo');
  if (contactInfo) {
    contactInfo.innerHTML = `<p><strong>Email:</strong> <a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
                             <p><strong>Phone:</strong> ${data.contact.phone || '—'}</p>
                             <p><strong>Location:</strong> ${data.contact.location || '—'}</p>`;
  }

  // Certifications
  if (data.certifications && data.certifications.length){
    const certsEl = document.createElement('div');
    certsEl.style.marginTop = '10px';
    certsEl.style.color = '#374151';
    certsEl.innerHTML = `<strong>Certifications:</strong> ${data.certifications.join(', ')}`;
    if (skillList && skillList.parentElement) skillList.parentElement.appendChild(certsEl);
  }

  document.getElementById('footerName').textContent = `© ${new Date().getFullYear()} ${data.name} — Bookkeeping & Financial Workflow`;

  // Calendly popup binding
  const calendlyUrl = data.calendly || 'https://calendly.com/angelmateong13';
  const scheduleBtn = document.getElementById('scheduleBtn');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // If Calendly widget is available, use popup; otherwise open in new tab
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        try {
          window.Calendly.initPopupWidget({ url: calendlyUrl });
        } catch (err) {
          window.open(calendlyUrl, '_blank', 'noopener');
        }
      } else {
        window.open(calendlyUrl, '_blank', 'noopener');
      }
    });
  }
}

// Interactive workflow hover
document.querySelectorAll('.workflow-grid .step').forEach(step=>{
  step.addEventListener('mouseenter',e=>{
    const t = e.currentTarget;
    const title = t.querySelector('h4').textContent;
    const text = t.querySelector('p').textContent;
    document.getElementById('workflow-title').textContent = title;
    document.getElementById('workflow-text').textContent = text;
    gsap.to(t,{scale:1.03,duration:0.28});
  });
  step.addEventListener('mouseleave',e=>{
    const t = e.currentTarget;
    gsap.to(t,{scale:1,duration:0.24});
    document.getElementById('workflow-title').textContent = 'Hover a step to see details';
    document.getElementById('workflow-text').textContent = 'Interactive details appear here with tips and typical deliverables.';
  });
});

// Netlify-ready form UX feedback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (ev)=>{
    const status = document.getElementById('formStatus');
    status.textContent = 'Sending...';
    await new Promise(r=>setTimeout(r,800));
    status.textContent = 'Thanks — I will reply shortly.';
    ev.target.reset();
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
loadResume();