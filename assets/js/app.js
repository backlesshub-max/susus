
/* ================================================================
   ADMIN / DEVELOPER ONLY — VOLUNTEER PHOTO CONFIGURATION
   Keep exactly 12 slots. Upload each volunteer photo to ImgBB, copy
   the DIRECT image URL, then edit only name / role / image below.
   Example image URL: https://i.ibb.co/xxxxx/photo.jpg
   ================================================================ */
const volunteers = window.NSSVolunteers || [];

const pageContent = window.NSSPageContent || {};



// Keep rendered routed pages distinct for search engines that execute JavaScript.
function updateSeoForRoute(key){
  const data=pageContent[key];
  const title=data ? `${data.title} | Raha College NSS` : 'Raha College NSS | National Service Scheme | Raha, Nagaon, Assam';
  document.title=title;
  const canonical=document.querySelector('link[rel="canonical"]');
  if(canonical){
    canonical.href='https://rahacollegenss.in/'+(key ? '?page='+encodeURIComponent(key) : '');
  }
  let meta=document.querySelector('meta[name="description"]');
  if(meta && data){
    meta.setAttribute('content', `${data.title} - Raha College NSS, National Service Scheme, Raha, Nagaon, Assam.`);
  }else if(meta){
    meta.setAttribute('content','Raha College NSS portal for National Service Scheme information, NSS activities, volunteers, registration, notices, FAQs and community service in Raha, Nagaon, Assam.');
  }
}

function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function renderVolunteers(){
  const grid=document.getElementById('volunteersGrid');
  if(!grid)return;
  grid.innerHTML=volunteers.map(v=>`
    <article class="vol reveal visible">
      <div class="vol-photo">${v.image?`<img src="${v.image}" alt="${escapeHtml(v.name)}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`:`<div class="silhouette" aria-hidden="true"></div>`}</div>
      <div class="vol-body"><b>${escapeHtml(v.name)}</b><span>${escapeHtml(v.role||'NSS Volunteer')}</span></div>
    </article>`).join('');
}
renderVolunteers();

let activePageLoad = 0;
async function showPage(key){
  const requestId = ++activePageLoad;
  const data = pageContent[key];
  if(!data){
    document.getElementById('pageView').innerHTML='';
    document.getElementById('homeView').classList.remove('hidden');
    document.getElementById('footer').classList.remove('hidden');
    return;
  }
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('footer').classList.add('hidden');
  let pageHtml = '';
  try{
    const response = await fetch(data.file);
    if(!response.ok) throw new Error('Page file could not be loaded.');
    pageHtml = await response.text();
  }catch(error){
    if(requestId !== activePageLoad) return;
    pageHtml = '<div class="notice">This page could not be loaded. Please return to the NSS home page and try again.</div>';
  }
  if(requestId !== activePageLoad) return;
  document.getElementById('pageView').innerHTML=`
    <section class="page active"><div class="page-card">
      <a class="back" href="#" data-home>← Back to NSS Home</a>
      <div class="eyebrow" style="margin-top:30px">${data.eyebrow}</div>
      <h1>${data.title}</h1>
      ${pageHtml}
    </div></section>`;
  window.scrollTo({top:0,behavior:'smooth'});
}
function route(){
  const params=new URLSearchParams(location.search);
  const key=params.get('page');
  showPage(key);
  updateSeoForRoute(key);
}
window.addEventListener('popstate',route);
document.addEventListener('click',e=>{
  const openTerms=e.target.closest('[data-open-terms]');
  if(openTerms){e.preventDefault(); document.getElementById('termsOverlay').classList.remove('hidden'); return;}
  const home=e.target.closest('[data-home]');
  if(home){e.preventDefault();history.pushState({},'',location.pathname+'#home');showPage(null);document.getElementById('homeView').classList.remove('hidden');document.getElementById('footer').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});return;}
  const pageLink=e.target.closest('a[href^="?page="]');
  if(pageLink){e.preventDefault();const url=new URL(pageLink.href);history.pushState({},'',url.pathname+url.search);route();}
});
route();


// === ACTIVE HEADER NAV: pink glow for current section, red for Register ===
(function(){
  const navItems=[...document.querySelectorAll('.navlinks a')];
  const sectionMap=navItems.filter(a=>!a.classList.contains('nav-cta')).map(a=>{
    const id=(a.getAttribute('href')||'').replace(/^#/,'');
    return {link:a,section:id?document.getElementById(id):null};
  }).filter(x=>x.section);
  function setActive(link){navItems.forEach(a=>a.classList.remove('active'));if(link)link.classList.add('active');}
  function setFromHash(){
    const id=location.hash.replace(/^#/,'')||'home';
    const match=sectionMap.find(x=>x.section.id===id);
    setActive(match?match.link:navItems.find(a=>a.dataset.home));
  }
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(!visible.length)return;
    const current=sectionMap.find(x=>x.section===visible[0].target);
    if(current)setActive(current.link);
  },{root:null,rootMargin:'-18% 0px -58% 0px',threshold:[0.05,0.2,0.4,0.7]});
  sectionMap.forEach(x=>navObserver.observe(x.section));
  navItems.forEach(link=>link.addEventListener('click',()=>{
    const targetId=(link.getAttribute('href')||'').replace(/^#/,'');
    const target=targetId?document.getElementById(targetId):null;
    if(target)setActive(link);
    if(targetId==='register')link.classList.add('active');
    setTimeout(setFromHash,700);
  }));
  window.addEventListener('hashchange',setFromHash);
  setFromHash();
})();

const menu=document.getElementById('menu'), nav=document.getElementById('nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const slider=document.getElementById('compareSlider'), after=document.getElementById('afterImg'), divider=document.getElementById('divider');
function compare(v){after.style.clipPath=`inset(0 0 0 ${v}%)`;divider.style.left=v+'%'}
slider.addEventListener('input',e=>compare(e.target.value)); compare(50);

let down=false,startX=0,scrollLeft=0;
const track=document.getElementById('galleryTrack');
track.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;scrollLeft=track.scrollLeft;track.setPointerCapture(e.pointerId)});
track.addEventListener('pointerup',()=>down=false);track.addEventListener('pointercancel',()=>down=false);
track.addEventListener('pointermove',e=>{if(!down)return;track.scrollLeft=scrollLeft-(e.clientX-startX)*1.25});

window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('progress').style.width=(h>0?(scrollY/h)*100:0)+'%';
});


// === NSS ENTRY, ONE-TIME CONSENT, NAME COLLECTION & FORMSubmit ===
(function(){
  const termsOverlay = document.getElementById('termsOverlay');
  const termsAgree = document.getElementById('termsAgree');
  const emailConsentAgree = document.getElementById('emailConsentAgree');
  const privacyAgree = document.getElementById('privacyAgree');
  const pledgeAgree = document.getElementById('pledgeAgree');
  const termsAccept = document.getElementById('termsAccept');
  const termsDeny = document.getElementById('termsDeny');
  const nameOverlay = document.getElementById('nameOverlay');
  const visitorForm = document.getElementById('visitorForm');
  const visitorName = document.getElementById('visitorName');
  const firstLoader = document.getElementById('firstLoader');

  const CONSENT_KEY = "nssPortalTermsAcceptedV1";
  const NAME_KEY = "nssVisitorNameV1";

  function show(el){ if(el) el.classList.remove('hidden'); }
  function hide(el){ if(el) el.classList.add('hidden'); }

  function allConsentsAccepted(){
    return termsAgree.checked && emailConsentAgree.checked && privacyAgree.checked && pledgeAgree.checked;
  }
  function updateAccept(){
    termsAccept.disabled = !allConsentsAccepted();
  }
  [termsAgree,emailConsentAgree,privacyAgree,pledgeAgree].forEach(el=>el.addEventListener('change',updateAccept));

  // Consent is requested only once per browser/device. The four checkboxes remain required on first entry.
  const alreadyAccepted = localStorage.getItem(CONSENT_KEY) === "yes";

  termsAccept.addEventListener('click',()=>{
    if(!allConsentsAccepted()) return;
    localStorage.setItem(CONSENT_KEY,"yes");
    hide(termsOverlay);
    // Name collection is also first-visit only.
    if(!localStorage.getItem(NAME_KEY)){
      show(nameOverlay);
      setTimeout(()=>visitorName.focus(),120);
    }else{
      document.body.classList.remove('entry-locked');
      window.scrollTo({top:0,behavior:'auto'});
    }
  });

  termsDeny.addEventListener('click',()=>{
    termsOverlay.innerHTML='<div class="clay-modal" style="text-align:center"><div class="clay-icon" style="margin:0 auto 18px">↩</div><h2>Terms not accepted</h2><p>You have chosen not to continue. You can close this tab or return to the consent screen.</p><div class="actions" style="justify-content:center"><button class="btn btn-primary" id="returnToTerms">Return to Terms</button></div></div>';
    document.getElementById('returnToTerms').addEventListener('click',()=>location.reload());
  });

  visitorForm.addEventListener('submit',()=>{
    const fullName = visitorName.value.trim();
    if(!fullName){
      visitorName.focus();
      return;
    }

    localStorage.setItem(NAME_KEY,fullName);
    show(firstLoader);

    // The hidden iframe keeps the visitor on this page while the form is submitted.
    setTimeout(()=>{
      hide(firstLoader);
      hide(nameOverlay);
      document.body.classList.remove('entry-locked');
      window.scrollTo({top:0,behavior:'auto'});
    },1200);
  });

  // On later visits, do not show either the consent or name screen.
  if(alreadyAccepted){
    hide(termsOverlay);
    hide(nameOverlay);
    hide(firstLoader);
    document.body.classList.remove('entry-locked');
  }else{
    show(termsOverlay);
    hide(nameOverlay);
    hide(firstLoader);
    updateAccept();
  }
  // Theme controls
  const root = document.documentElement;
  const bgButtons = [...document.querySelectorAll('#bgThemes .theme-swatch')];
  const accentButtons = [...document.querySelectorAll('#accentThemes .theme-swatch')];

  const savedBg = localStorage.getItem("nssBgTheme");
  const savedDark = localStorage.getItem("nssDarkTheme");
  const savedAccent = localStorage.getItem("nssAccentTheme");

  // Default appearance: Champagne background + Forest dark-green theme.
  const defaultBg = "#f3e6d3";
  const defaultDark = "#0a3a29";
  const defaultAccent = "#c51f2b";
  root.style.setProperty("--clay-bg", savedBg || defaultBg);
  root.style.setProperty("--clay-dark", savedDark || defaultDark);
  root.style.setProperty("--clay-accent", savedAccent || defaultAccent);

  bgButtons.forEach(btn=>{
    if(btn.dataset.bg === (savedBg || defaultBg)) btn.classList.add("active");
    btn.addEventListener("click",()=>{
      root.style.setProperty("--clay-bg",btn.dataset.bg);
      localStorage.setItem("nssBgTheme",btn.dataset.bg);
      bgButtons.forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  accentButtons.forEach(btn=>{
    if(btn.dataset.dark === (savedDark || defaultDark) && btn.dataset.accent === (savedAccent || defaultAccent)) btn.classList.add("active");
    btn.addEventListener("click",()=>{
      root.style.setProperty("--clay-dark",btn.dataset.dark);
      root.style.setProperty("--clay-accent",btn.dataset.accent);
      localStorage.setItem("nssDarkTheme",btn.dataset.dark);
      localStorage.setItem("nssAccentTheme",btn.dataset.accent);
      accentButtons.forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
    });
  });
})();




