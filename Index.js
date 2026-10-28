
var historyLogs = JSON.parse(localStorage.getItem('israr_vg_history')) || [];
var trashBin = JSON.parse(localStorage.getItem('israr_vg_trash')) || [];
let isHistoryMarkMode = false;
let isTrashMarkMode = false;
let currentUnlockType = 'key';
let isEditingCode = false;

const appContainer = document.getElementById('mainAppContainer');
appContainer.addEventListener('scroll', function() {
  localStorage.setItem('israr_vg_scroll', appContainer.scrollTop);
});

window.addEventListener('load', function() {
  const savedScroll = localStorage.getItem('israr_vg_scroll');
  if(savedScroll) { appContainer.scrollTop = parseInt(savedScroll, 10); }
});

function cleanExpiredTrash() {
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  trashBin = trashBin.filter(item => (now - (item.deletedAt || now)) < thirtyDaysMs);
  localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
}
cleanExpiredTrash();

var menuToggle = document.getElementById("bst-menu-toggle");
var drawer = document.getElementById("bst-drawer");
var drawerClose = document.getElementById("bst-drawer-close");
var overlay = document.getElementById("bst-overlay");

function toggleMenu() {
  drawer.classList.toggle("open");
  overlay.classList.toggle("active");
}
if(menuToggle) menuToggle.addEventListener("click", toggleMenu);
if(drawerClose) drawerClose.addEventListener("click", toggleMenu);
if(overlay) overlay.addEventListener("click", toggleMenu);

function togglePasswordInputState() {
  const enabled = document.getElementById('enablePasswordToggle').checked;
  document.getElementById('passwordGroup').style.display = enabled ? 'block' : 'none';
}

function setUnlockType(type) {
  currentUnlockType = type;
  document.getElementById('unlockTypeKeyBtn').classList.toggle('active', type === 'key');
  document.getElementById('unlockTypeUrlBtn').classList.toggle('active', type === 'url');
  const input = document.getElementById('customAccessKey');
  if(type === 'url') {
    input.placeholder = "e.g. https://example.com/download-file";
  } else {
    input.placeholder = "e.g. VIP-ACCESS-KEY-99";
  }
}

var vipThemes = [
  { name: 'Royal Plum VIP', bg: '#10051a', panel: '#220b2e', card: '#270f36', btn: '#411756', header: 'linear-gradient(115deg,#8b00a8,#c026d3,#f078ff)' },
  { name: 'Cyberpunk Neon', bg: '#050508', panel: '#18122b', card: '#23193a', btn: '#2e1a47', header: 'linear-gradient(115deg,#7c3aed,#c084fc,#f43f5e)' },
  { name: 'Emerald Matrix', bg: '#02120a', panel: '#062816', card: '#0b3820', btn: '#0f4a29', header: 'linear-gradient(115deg,#047857,#10b981,#6ee7b7)' },
  { name: 'Royal Purple', bg: '#10071a', panel: '#241038', card: '#381856', btn: '#4b2075', header: 'linear-gradient(115deg,#6b21a8,#9333ea,#c084fc)' },
  { name: 'Crimson Spark', bg: '#140505', panel: '#2b0f0f', card: '#451717', btn: '#5c2020', header: 'linear-gradient(115deg,#b91c1c,#ef4444,#fca5a5)' },
  { name: 'Deep Ocean', bg: '#02101a', panel: '#0a2538', card: '#0f3754', btn: '#164a70', header: 'linear-gradient(115deg,#0369a1,#0ea5e9,#7dd3fc)' },
  { name: 'Golden Sunset', bg: '#171203', panel: '#332706', card: '#52400a', btn: '#6e550d', header: 'linear-gradient(115deg,#b45309,#f59e0b,#fde68a)' },
  { name: 'Midnight Charcoal', bg: '#111111', panel: '#222222', card: '#333333', btn: '#444444', header: 'linear-gradient(115deg,#374151,#6b7280,#d1d5db)' },
  { name: 'Neon Turquoise', bg: '#011616', panel: '#032d2d', card: '#064545', btn: '#095c5c', header: 'linear-gradient(115deg,#0f766e,#14b8a6,#99f6e4)' },
  { name: 'Amethyst Glow', bg: '#16061a', panel: '#2e0d36', card: '#471454', btn: '#5e1c6e', header: 'linear-gradient(115deg,#a21caf,#c084fc,#f0abfc)' },
  { name: 'Sapphire Elite', bg: '#061126', panel: '#0c2042', card: '#12305d', btn: '#1b477e', header: 'linear-gradient(115deg,#1d4ed8,#38bdf8,#bae6fd)' },
  { name: 'Ruby Royale', bg: '#18070d', panel: '#310d1a', card: '#4b1428', btn: '#681b37', header: 'linear-gradient(115deg,#9f1239,#e11d48,#fda4af)' },
  { name: 'Copper Luxe', bg: '#170d08', panel: '#2d1a10', card: '#472719', btn: '#633821', header: 'linear-gradient(115deg,#92400e,#c2410c,#fdba74)' },
  { name: 'Ice Crystal', bg: '#07131a', panel: '#102a35', card: '#183c49', btn: '#245565', header: 'linear-gradient(115deg,#0e7490,#67e8f9,#e0f2fe)' },
  { name: 'Rose Gold', bg: '#1b0d13', panel: '#321923', card: '#4b2634', btn: '#663548', header: 'linear-gradient(115deg,#9d174d,#e879a9,#fbcfe8)' },
  { name: 'Lime Voltage', bg: '#101705', panel: '#202d0a', card: '#304414', btn: '#45601b', header: 'linear-gradient(115deg,#4d7c0f,#a3e635,#ecfccb)' },
  { name: 'Solar Flare', bg: '#1a0d02', panel: '#351b05', card: '#512b08', btn: '#713b0b', header: 'linear-gradient(115deg,#c2410c,#fb923c,#fef08a)' },
  { name: 'Arctic Aurora', bg: '#06141a', panel: '#0d2930', card: '#16404a', btn: '#205765', header: 'linear-gradient(115deg,#0f766e,#2dd4bf,#a7f3d0)' },
  { name: 'Black Diamond', bg: '#08090c', panel: '#17191f', card: '#252832', btn: '#353946', header: 'linear-gradient(115deg,#111827,#4b5563,#e5e7eb)' },
  { name: 'Electric Blue', bg: '#050d20', panel: '#0c1d3c', card: '#122c55', btn: '#1a3e75', header: 'linear-gradient(115deg,#1e40af,#2563eb,#60a5fa)' },
  { name: 'Jade Empire', bg: '#04140e', panel: '#0b2b1d', card: '#12402b', btn: '#1a593a', header: 'linear-gradient(115deg,#065f46,#34d399,#a7f3d0)' },
  { name: 'Violet Galaxy', bg: '#0e071c', panel: '#21113b', card: '#321a58', btn: '#48277a', header: 'linear-gradient(115deg,#5b21b6,#a78bfa,#e9d5ff)' },
  { name: 'Cherry Noir', bg: '#16070a', panel: '#2b1016', card: '#431821', btn: '#5d202c', header: 'linear-gradient(115deg,#881337,#e11d48,#fda4af)' },
  { name: 'Oceanic Teal', bg: '#031416', panel: '#092b2e', card: '#104044', btn: '#17585d', header: 'linear-gradient(115deg,#115e59,#0d9488,#99f6e4)' },
  { name: 'Imperial Gold', bg: '#171102', panel: '#302506', card: '#4b3a0b', btn: '#68500d', header: 'linear-gradient(115deg,#854d0e,#eab308,#fef3c7)' },
  { name: 'Neon Fuchsia', bg: '#180617', panel: '#300e2e', card: '#491545', btn: '#641d60', header: 'linear-gradient(115deg,#a21caf,#ec4899,#fbcfe8)' },
  { name: 'Storm Grey', bg: '#0c1118', panel: '#1b2531', card: '#293746', btn: '#394b5e', header: 'linear-gradient(115deg,#334155,#64748b,#cbd5e1)' },
  { name: 'Tropical Paradise', bg: '#031711', panel: '#0a3023', card: '#124633', btn: '#1a6044', header: 'linear-gradient(115deg,#047857,#22c55e,#bef264)' },
  { name: 'Cosmic Red', bg: '#160708', panel: '#301013', card: '#49181c', btn: '#652127', header: 'linear-gradient(115deg,#991b1b,#f43f5e,#fecaca)' },
  { name: 'Platinum VIP', bg: '#101216', panel: '#22262d', card: '#343a44', btn: '#48515e', header: 'linear-gradient(115deg,#52525b,#a1a1aa,#f4f4f5)' }
];
let currentThemeIdx = parseInt(localStorage.getItem('israr_vg_theme_idx') || '1', 10);
let isDarkMode = localStorage.getItem('israr_vg_darkmode') !== 'false';

function applyVipTheme(idx) {
  idx = Number(idx);
  if (!Number.isInteger(idx) || idx < 1 || idx > vipThemes.length) idx = 1;
  currentThemeIdx = idx;
  localStorage.setItem('israr_vg_theme_idx', idx);
  var t = vipThemes[idx - 1];
  if (!isDarkMode) return;

  document.documentElement.style.setProperty('--bg', t.bg);
  document.documentElement.style.setProperty('--panel-bg', t.panel);
  document.documentElement.style.setProperty('--card-bg', t.card);
  document.documentElement.style.setProperty('--btn-bg', t.btn);
  document.documentElement.style.setProperty('--header-bg', t.header);
  document.documentElement.style.setProperty('--footer-bg', t.card);

  var themeIdxSpan = document.getElementById("themeIndexDisplay");
  if (themeIdxSpan) themeIdxSpan.textContent = idx;
}

function applyDarkModeState() {
  const body = document.body;
  const dmStatus = document.getElementById('darkmodeStatus');
  if (isDarkMode) {
    body.classList.remove('light-mode');
    if (dmStatus) dmStatus.textContent = "On";
    applyVipTheme(currentThemeIdx);
  } else {
    body.classList.add('light-mode');
    if (dmStatus) dmStatus.textContent = "Off";
  }
  localStorage.setItem('israr_vg_darkmode', isDarkMode);
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  applyDarkModeState();
}

function applyVipThemeMain() {
  if (!isDarkMode) { alert("लाइट मोड ऑन होने पर कस्टम थीम बंद रहती है। पहले डार्क मोड ऑन करें।"); return; }
  currentThemeIdx = (currentThemeIdx % vipThemes.length) + 1;
  applyVipTheme(currentThemeIdx);
}

applyDarkModeState();
applyVipTheme(currentThemeIdx);

/* BUBBLE CANVAS */
(function(){
  const canvas = document.getElementById('bubble');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  class Bubble {
    constructor(x, y, r, s){
      this.x = x; this.y = y; this.r = r; this.s = s;
      this.d = Math.random() * 0.5 - 0.25;
      this.t = Math.random() * 100;
    }
    draw(){
      let sc = 0.7 + Math.sin(this.t * 0.05) * 0.3;
      let al = 0.25 * (0.5 + sc * 0.5);
      let g = ctx.createRadialGradient(this.x, this.y, this.r * 0.2, this.x, this.y, this.r);
      g.addColorStop(0, `rgba(255,255,255,${al})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
    upd(){
      this.y -= this.s; this.x += this.d; this.t += 1;
      if(this.y + this.r < 0){
        this.r = Math.random() * 3 + 3;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.r;
        this.s = Math.random() * 0.25 + 0.05;
      }
      this.draw();
    }
  }

  let bubbles = [];
  for(let i = 0; i < 18; i++){
    bubbles.push(new Bubble(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 3, Math.random() * 0.25 + 0.05));
  }
  (function anim(){
    requestAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach(b => b.upd());
  })();
})();

/* GATEWAY GENERATOR LOGIC */
const PLATFORM_CONFIG = {
  youtube: { name: "YouTube", placeholder: "e.g. https://youtube.com/@channel", title: "Subscribe on YouTube", desc: "Subscribe to our official YouTube channel to continue.", btn: "Subscribe on YouTube" },
  facebook: { name: "Facebook", placeholder: "e.g. https://facebook.com/page", title: "Follow Facebook Page", desc: "Follow our official Facebook page to unlock the next step.", btn: "Follow on Facebook" },
  instagram: { name: "Instagram", placeholder: "e.g. https://instagram.com/username", title: "Follow Instagram", desc: "Follow our official Instagram profile to continue verification.", btn: "Follow Instagram" },
  telegram: { name: "Telegram", placeholder: "e.g. https://t.me/channel", title: "Join Telegram Channel", desc: "Join our official Telegram channel to unlock the next step.", btn: "Join Telegram" },
  twitter: { name: "Twitter (X)", placeholder: "e.g. https://x.com/username", title: "Follow Twitter (X)", desc: "Follow our official Twitter (X) profile to continue verification.", btn: "Follow on Twitter (X)" },
  snapchat: { name: "Snapchat", placeholder: "e.g. https://snapchat.com/add/username", title: "Add Snapchat", desc: "Add our official Snapchat account to continue verification.", btn: "Add on Snapchat" },
  pinterest: { name: "Pinterest", placeholder: "e.g. https://pinterest.com/username", title: "Follow Pinterest", desc: "Follow our official Pinterest page to continue verification.", btn: "Follow on Pinterest" },
  tiktok: { name: "TikTok", placeholder: "e.g. https://tiktok.com/@username", title: "Follow TikTok", desc: "Follow our official TikTok account to continue verification.", btn: "Follow on TikTok" },
  discord: { name: "Discord", placeholder: "e.g. https://discord.gg/invite", title: "Join Discord Server", desc: "Join our official Discord server to unlock the next step.", btn: "Join Discord Server" },
  whatsapp: { name: "WhatsApp", placeholder: "e.g. https://whatsapp.com/channel/...", title: "Join WhatsApp Channel", desc: "Follow our official WhatsApp channel to unlock the next step.", btn: "Join WhatsApp Channel" },
  youtubevideo: { name: "YouTube Video (Watch)", placeholder: "e.g. https://youtube.com/watch?v=...", title: "Watch YouTube Video", desc: "Watch the YouTube video to continue.", btn: "Watch YouTube Video" }
};

function handleTimerPresetChange(){
  const val = document.getElementById("timerPresetSelect").value;
  const wrap = document.getElementById("customTimerWrap");
  if(val === "custom"){
    wrap.classList.add("show");
    document.getElementById("customTimerInput").focus();
  } else {
    wrap.classList.remove("show");
  }
}

function getSelectedTimerSeconds(){
  const val = document.getElementById("timerPresetSelect").value;
  if(val === "custom"){
    const customVal = parseInt(document.getElementById("customTimerInput").value.trim(), 10);
    return (!isNaN(customVal) && customVal > 0) ? customVal : 10;
  }
  return parseInt(val, 10) || 10;
}

function addSelectedPlatform(platformKey, customUrl, customDisplayName){
  const select = document.getElementById("platformSelect");
  const key = platformKey || select.value;
  const config = PLATFORM_CONFIG[key];
  if(!config) return;

  const list = document.getElementById("dynamicSocialList");
  const card = document.createElement("div");
  card.className = "url-card";

  const head = document.createElement("div");
  head.className = "url-card-head";

  const displayName = customDisplayName || config.name;
  const tag = document.createElement("div");
  tag.className = "platform-tag";
  tag.innerHTML = `<span class="platform-name-label">${displayName}</span> <button type="button" class="edit-name-btn" title="Rename" onclick="renamePlatform(this)"><i class="fas fa-pencil-alt"></i></button>`;
  head.appendChild(tag);

  const row = document.createElement("div");
  row.className = "url-row";

  const input = document.createElement("input");
  input.type = "url";
  input.dataset.platformKey = key;
  input.dataset.platformName = displayName;
  input.placeholder = config.placeholder;
  input.value = customUrl || "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "×";
  removeBtn.onclick = function(){ card.remove(); };

  row.appendChild(input);
  row.appendChild(removeBtn);
  card.appendChild(head);
  card.appendChild(row);
  list.appendChild(card);
}

function renamePlatform(btn) {
  const tagDiv = btn.closest('.platform-tag');
  if (!tagDiv || tagDiv.querySelector('.rename-inline-input')) return;
  const labelSpan = tagDiv.querySelector('.platform-name-label');
  const card = btn.closest('.url-card');
  const urlInput = card.querySelector('input[data-platform-key]');
  const originalName = labelSpan.textContent.trim();
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'rename-inline-input';
  editInput.value = originalName;
  editInput.style.cssText = 'width:min(200px,60vw);min-width:70px;padding:4px 6px;border:1px solid var(--orange);border-radius:6px;background:var(--card-bg);color:var(--text);font:inherit;font-size:11px;outline:none;';
  labelSpan.replaceWith(editInput);
  btn.style.display = 'none';
  let saved = false;
  function saveName() {
    if (saved) return;
    saved = true;
    const newName = editInput.value.trim() || originalName;
    const newLabel = document.createElement('span');
    newLabel.className = 'platform-name-label';
    newLabel.textContent = newName;
    if (editInput.parentNode) editInput.replaceWith(newLabel);
    if (urlInput) urlInput.dataset.platformName = newName;
    btn.style.display = '';
  }
  editInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); editInput.blur(); }
    if (e.key === 'Escape') { editInput.value = originalName; editInput.blur(); }
  });
  editInput.addEventListener('blur', saveName);
  editInput.focus();
  editInput.select();
}

window.addEventListener("DOMContentLoaded", function(){
  addSelectedPlatform("youtubevideo");
  addSelectedPlatform("youtube");
  addSelectedPlatform("telegram");
  renderHistoryList();
});

function collectLinks(){
  const result = [];
  const inputs = document.querySelectorAll("#dynamicSocialList input[data-platform-key]");
  inputs.forEach(function(input){
    const url = input.value.trim();
    if(url){
      result.push({ key: input.dataset.platformKey, platform: input.dataset.platformName, url: url });
    }
  });
  return result;
}

function generateGateway(){
  const links = collectLinks();
  const enablePassword = document.getElementById("enablePasswordToggle").checked;
  const password = enablePassword ? document.getElementById("verificationPassword").value.trim() : "";
  const accessKeyVal = document.getElementById("customAccessKey").value.trim();
  const enableCaptcha = document.getElementById("enableCaptcha").checked;
  const timerSeconds = getSelectedTimerSeconds();

  const button = document.getElementById("generateBtn");
  const btnLoader = document.getElementById("btnLoader");
  const btnText = button.querySelector(".btn-text");
  const message = document.getElementById("message");

  if(links.length === 0){
    message.textContent = "⚠️ कम से कम एक सोशल मीडिया लिंक में अपना URL भरें।";
    return;
  }
  if(enablePassword && !password){
    message.textContent = "⚠️ Verification Password डालें या पासवर्ड टॉगल बंद करें।";
    return;
  }
  if(!accessKeyVal){
    message.textContent = "⚠️ कृपया Secret Key या Redirect URL भरें।";
    return;
  }

  button.disabled = true;
  btnLoader.style.display = "block";
  btnText.style.display = "none";
  message.textContent = "";

  setTimeout(function(){
    try{
      const code = createGatewayCode(links, password, accessKeyVal, enableCaptcha, timerSeconds, enablePassword, currentUnlockType);
      document.getElementById("generatedCode").value = code;
      document.getElementById("previewFrame").srcdoc = code;

      document.getElementById("resultsPanelBox").style.display = "flex";
      document.getElementById("historySectionBox").style.display = "block";

      const now = new Date();
      const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
      const newHistoryItem = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        title: (links[0] ? links[0].platform + ' Gateway' : 'Verification Gateway'),
        code: code,
        links: links,
        password: password,
        unlockType: currentUnlockType,
        accessKey: accessKeyVal,
        enableCaptcha: enableCaptcha,
        enablePassword: enablePassword,
        timerSeconds: timerSeconds,
        time: timeStr
      };
      historyLogs.unshift(newHistoryItem);
      if(historyLogs.length > 200) historyLogs.pop();
      localStorage.setItem('israr_vg_history', JSON.stringify(historyLogs));
      renderHistoryList();

      button.disabled = false;
      btnLoader.style.display = "none";
      btnText.style.display = "inline-flex";
      btnText.innerHTML = '<i class="fas fa-check"></i> Gateway Ready & Saved!';
      message.textContent = "✓ आपका Verification Gateway तैयार है और History में सेव हो गया है।";

      setTimeout(function(){
        btnText.innerHTML = '<i class="fas fa-bolt"></i> Generate Verification Gateway';
      }, 2000);
    }catch(error){
      console.error(error);
      button.disabled = false;
      btnLoader.style.display = "none";
      btnText.style.display = "inline-flex";
      message.textContent = "❌ Generate करते समय error आया।";
    }
  }, 400);
}

function createGatewayCode(links, password, accessKeyVal, enableCaptcha, timerSeconds, enablePassword, unlockType){
  const n1 = Math.floor(Math.random() * 8) + 2;
  const n2 = Math.floor(Math.random() * 8) + 1;
  const captchaAnswer = n1 + n2;

  const totalSocial = links.length;
  const captchaStepNum = enableCaptcha ? (totalSocial + 1) : null;
  const passStepNum = enablePassword ? (enableCaptcha ? totalSocial + 2 : totalSocial + 1) : null;
  const keyStepNum = (passStepNum !== null) ? passStepNum + 1 : (captchaStepNum !== null ? captchaStepNum + 1 : totalSocial + 1);

  function pad(n){ return n < 10 ? "0" + n : "" + n; }
  function getDetails(item){ return { name: item.platform, title: item.platform, desc: "Complete the official action for " + item.platform + " to continue.", btn: item.platform }; }

  let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  html += '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n';
  html += '<title>Secure Verification Gateway</title>\n';
  html += '<style>\n';
  html += '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");\n';
  html += '*{margin:0;padding:0;box-sizing:border-box;}\n';
  html += ':root{--bg:#03050b;--orange:#ff8500;--orange-light:#ffb347;--text:#f5f8ff;--muted:#7f8ca3;}\n';
  html += 'body{min-height:100vh;font-family:Inter,Arial,sans-serif;color:var(--text);background:#03050b;overflow-x:hidden;padding:20px 10px;}\n';
  html += '.wrapper{position:relative;z-index:2;width:min(650px,100%);margin:auto;padding:30px 10px;}\n';
  html += '.hero{text-align:center;padding-bottom:24px;}\n';
  html += '.badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:50px;color:var(--orange-light);background:rgba(255,133,0,.1);border:1px solid rgba(255,133,0,.3);font-size:10px;font-weight:800;letter-spacing:1px;}\n';
  html += 'h1{margin-top:14px;font-size:32px;font-weight:800;color:#fff;}\n';
  html += '.hero p{margin-top:8px;color:#718097;font-size:12px;line-height:1.6;}\n';
  html += '.panel{padding:14px;border-radius:24px;background:rgba(12,18,30,.92);border:1px solid rgba(255,147,40,.2);box-shadow:0 30px 80px rgba(0,0,0,.6);}\n';
  html += '.step{position:relative;padding:18px;margin-bottom:10px;border-radius:16px;background:rgba(16,24,38,.85);border:1px solid rgba(255,255,255,.06);transition:.35s ease;opacity:0.45;}\n';
  html += '.step:last-child{margin-bottom:0;}\n';
  html += '.step.active{opacity:1;border-color:var(--orange);box-shadow:0 0 20px rgba(255,133,0,.15);}\n';
  html += '.step.done{opacity:0.95;border-color:rgba(0,255,102,.3);}\n';
  html += '.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}\n';
  html += '.num{color:var(--orange-light);font-size:10px;font-weight:800;letter-spacing:2px;}\n';
  html += '.status{padding:4px 9px;border-radius:20px;color:#56647a;background:rgba(255,255,255,.03);font-size:9px;font-weight:800;}\n';
  html += '.active .status{color:#000;background:var(--orange-light);}\n';
  html += '.done .status{color:#000;background:#00ff66;}\n';
  html += 'h2{font-size:15px;font-weight:700;margin-bottom:4px;}\n';
  html += '.desc{color:#718096;font-size:11px;line-height:1.6;margin-bottom:12px;}\n';
  html += 'button{display:flex;align-items:center;justify-content:center;width:100%;min-height:42px;padding:0 16px;border:none;border-radius:10px;color:#fff;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;background:linear-gradient(120deg,#ff5e00,#ffad33);box-shadow:0 4px 15px rgba(255,133,0,.2);transition:.2s;}\n';
  html += 'button:hover:not(:disabled){filter:brightness(1.15);transform:translateY(-1px);}\n';
  html += 'button:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}\n';
  html += 'input{width:100%;height:44px;padding:0 12px;margin-bottom:10px;outline:none;border:1px solid rgba(255,147,40,.2);border-radius:10px;background:#060d18;color:#fff;font-family:inherit;font-size:12px;}\n';
  html += 'input:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(255,133,0,.1);}\n';
  html += '.captcha{height:50px;margin-bottom:10px;display:flex;justify-content:center;align-items:center;gap:10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#070d1a;color:#77869d;font-size:16px;letter-spacing:2px;}\n';
  html += '.captcha b{color:var(--orange-light);}\n';
  html += '.msg{min-height:15px;margin-top:8px;color:#536278;font-size:10px;line-height:1.4;}\n';
  html += '.step.done .msg{color:#00ff66;}\n';
  html += '.timer-box{display:none;margin-bottom:12px;padding:12px;text-align:center;border-radius:12px;border:1px solid var(--orange);background:rgba(255,133,0,.05);}\n';
  html += '.timer-box.show{display:block;}\n';
  html += '.timer{margin-top:4px;color:var(--orange-light);font-size:24px;font-weight:800;}\n';
  html += '.progress{height:4px;margin-top:10px;overflow:hidden;border-radius:10px;background:rgba(255,255,255,.1);}\n';
  html += '.progress-bar{width:0%;height:100%;border-radius:10px;background:var(--orange);transition:width .2s linear;}\n';
  html += '.key{padding:14px;border-radius:12px;border:1.5px solid #00ff66;background:rgba(0,255,102,.1);color:#00ff66;font-family:monospace;font-size:14px;font-weight:bold;text-align:center;letter-spacing:1px;word-break:break-all;user-select:all;}\n';
  html += '.copy-btn{margin-top:10px;background:#00ff66;color:#000;font-size:12px;font-weight:800;}\n';
  html += '<style>\n#israr-lab-root .header-top-panel{min-height:0!important;padding:8px 14px!important;gap:8px;}#israr-lab-root .header-title-box{padding:0 6px!important;min-width:0;}#israr-lab-root .header-title-box .title{font-size:clamp(20px,5vw,30px)!important;line-height:1.15!important;}#israr-lab-root .header-title-box .subtitle{font-size:12px!important;line-height:1.3!important;margin-top:4px!important;}#israr-lab-root .bst-menu-toggle{width:34px!important;height:34px!important;flex:0 0 34px;}#israr-lab-root .header-top-panel>div:last-child{width:34px!important;flex:0 0 34px;}#israr-lab-root .header-btn-row{margin:8px auto 10px!important;}#israr-lab-root .article-section{padding:20px!important;line-height:1.85!important;}#israr-lab-root .article-section h2{font-size:22px!important;line-height:1.35!important;}#israr-lab-root .article-section h3{font-size:18px!important;line-height:1.45!important;}#israr-lab-root .article-section p,#israr-lab-root .article-section ul{font-size:16px!important;line-height:1.85!important;}#israr-lab-root .article-section li{font-size:16px!important;line-height:1.8!important;}\n</style>\n</head>\n<body>\n';

  html += '<main class="wrapper">\n<section class="hero">\n  <div class="badge">SECURE VERIFICATION GATEWAY</div>\n  <h1>Access Gateway</h1>\n  <p>Complete all official actions to unlock your content.</p>\n</section>\n<section class="panel">\n';

  links.forEach(function(item, idx){
    const sNum = idx + 1;
    const isFirst = (idx === 0);
    const details = getDetails(item);
    html += '<div class="step ' + (isFirst ? 'active' : '') + '" id="step' + sNum + '">\n';
    html += '  <div class="head"><span class="num">STEP ' + pad(sNum) + '</span><span class="status" id="status' + sNum + '">' + (isFirst ? 'READY' : 'LOCKED') + '</span></div>\n';
    html += '  <h2>' + details.title + '</h2>\n  <p class="desc">' + details.desc + '</p>\n';
    html += '  <button type="button" id="btn' + sNum + '" ' + (isFirst ? '' : 'disabled') + ' onclick="startSocialStep(' + sNum + ')">' + details.btn + '</button>\n';
    html += '  <div id="timer' + sNum + '" class="timer-box"><div style="font-size:9px;color:#718097;font-weight:bold;">VERIFICATION IN PROGRESS</div><div class="timer" id="count' + sNum + '">' + timerSeconds + '</div><div class="progress"><div class="progress-bar" id="progress' + sNum + '"></div></div></div>\n';
    html += '  <div class="msg" id="msg' + sNum + '"></div>\n</div>\n';
  });

  if(enableCaptcha){
    html += '<div class="step" id="step' + captchaStepNum + '">\n';
    html += '  <div class="head"><span class="num">STEP ' + pad(captchaStepNum) + '</span><span class="status" id="status' + captchaStepNum + '">LOCKED</span></div>\n';
    html += '  <h2>Human Captcha Verification</h2>\n  <p class="desc">Solve the arithmetic puzzle to verify you are human.</p>\n';
    html += '  <div class="captcha"><b id="n1">' + n1 + '</b><span>+</span><b id="n2">' + n2 + '</b><span>=</span><span>?</span></div>\n';
    html += '  <input id="captchaInput" type="number" placeholder="Enter answer" disabled onkeydown="if(event.key===\'Enter\') verifyCaptcha()">\n';
    html += '  <button type="button" id="captchaBtn" disabled onclick="verifyCaptcha()">Verify Captcha</button>\n';
    html += '  <div class="msg" id="msg' + captchaStepNum + '"></div>\n</div>\n';
  }

  if(enablePassword){
    html += '<div class="step" id="step' + passStepNum + '">\n';
    html += '  <div class="head"><span class="num">STEP ' + pad(passStepNum) + '</span><span class="status" id="status' + passStepNum + '">LOCKED</span></div>\n';
    html += '  <h2>Verification Password</h2>\n  <p class="desc">Enter the secret password provided by the creator.</p>\n';
    html += '  <input id="passwordInput" type="password" placeholder="Enter password" disabled onkeydown="if(event.key===\'Enter\') verifyPassword()">\n';
    html += '  <button type="button" id="passwordBtn" disabled onclick="verifyPassword()">Verify Password</button>\n';
    html += '  <div class="msg" id="msg' + passStepNum + '"></div>\n</div>\n';
  }

  html += '<div class="step" id="step' + keyStepNum + '">\n';
  html += '  <div class="head"><span class="num">STEP ' + pad(keyStepNum) + '</span><span class="status" id="status' + keyStepNum + '">LOCKED</span></div>\n';
  html += '  <h2>Unlocked Content</h2>\n  <p class="desc">All steps verified! Your destination is unlocked below:</p>\n';
  html += '  <div id="keyBox"><div style="font-size:11px;color:#596d88;text-align:center;padding:10px;">Complete above steps to reveal destination.</div></div>\n';
  html += '</div>\n</section>\n</main>\n';

  html += '<script>\n';
  html += 'const LINKS = ' + JSON.stringify(links) + ';\n';
  html += 'const PASSWORD = ' + JSON.stringify(password) + ';\n';
  html += 'const ACCESS_KEY = ' + JSON.stringify(accessKeyVal) + ';\n';
  html += 'const UNLOCK_TYPE = ' + JSON.stringify(unlockType) + ';\n';
  html += 'const ENABLE_CAPTCHA = ' + enableCaptcha + ';\n';
  html += 'const ENABLE_PASSWORD = ' + enablePassword + ';\n';
  html += 'const TIMER_SECONDS = ' + timerSeconds + ';\n';
  html += 'const ANSWER = ' + captchaAnswer + ';\n';
  html += 'const CAPTCHA_STEP = ' + (captchaStepNum || 'null') + ';\n';
  html += 'const PASS_STEP = ' + (passStepNum || 'null') + ';\n';
  html += 'const KEY_STEP = ' + keyStepNum + ';\n';

  html += 'function activate(n){ var s=document.getElementById("step"+n), st=document.getElementById("status"+n); if(s)s.classList.add("active"); if(st)st.textContent="READY"; }\n';
  html += 'function complete(n){ var s=document.getElementById("step"+n), st=document.getElementById("status"+n); if(s){s.classList.remove("active"); s.classList.add("done");} if(st)st.textContent="DONE"; }\n';
  html += 'function openPlatformUrl(url){ if(!/^https?:\\/\\//i.test(url)) url = "https://" + url; try{ var w = window.open(url, "_blank"); if(!w || w.closed) window.location.href = url; }catch(e){ window.location.href = url; } }\n';
  html += 'var pendingStep = null, timerRunning = false, safetyTimer = null;\n';
  html += 'function startSocialStep(stepNum){\n  if(timerRunning) return;\n  var item = LINKS[stepNum - 1];\n  var btn = document.getElementById("btn" + stepNum);\n  var msg = document.getElementById("msg" + stepNum);\n  btn.disabled = true;\n  btn.textContent = "⏳ Link Opened... Return to verify";\n  if(msg){ msg.textContent = "👉 Action opened. Return back here to start verification."; msg.style.color = "#ffb347"; }\n  pendingStep = stepNum;\n  openPlatformUrl(item.url.trim());\n  if(safetyTimer) clearTimeout(safetyTimer);\n  safetyTimer = setTimeout(function(){ if(pendingStep === stepNum) startStepCountdown(stepNum); }, 3500);\n}\n';
  html += 'function handleUserReturn(){ if(pendingStep !== null && !timerRunning){ var s = pendingStep; pendingStep = null; if(safetyTimer) clearTimeout(safetyTimer); startStepCountdown(s); } }\n';
  html += 'window.addEventListener("focus", handleUserReturn);\ndocument.addEventListener("visibilitychange", function(){ if(!document.hidden && document.visibilityState==="visible") handleUserReturn(); });\n';
  html += 'function startStepCountdown(stepNum){\n  timerRunning = true; pendingStep = null;\n  var item = LINKS[stepNum - 1];\n  var btn = document.getElementById("btn" + stepNum);\n  var timerBox = document.getElementById("timer" + stepNum);\n  var countEl = document.getElementById("count" + stepNum);\n  var progressEl = document.getElementById("progress" + stepNum);\n  var msg = document.getElementById("msg" + stepNum);\n  if(timerBox) timerBox.classList.add("show");\n  if(msg){ msg.textContent = "Verifying action... Please wait " + TIMER_SECONDS + "s."; msg.style.color = "#718096"; }\n';
  html += '  var timeLeft = TIMER_SECONDS;\n  btn.disabled = true;\n  btn.textContent = "⏳ Verifying... " + timeLeft + "s";\n  if(countEl) countEl.textContent = timeLeft;\n  if(progressEl) progressEl.style.width = "0%";\n';
  html += '  var interval = setInterval(function(){\n    timeLeft--;\n    if(timeLeft > 0){\n      btn.textContent = "⏳ Verifying... " + timeLeft + "s";\n      if(countEl) countEl.textContent = timeLeft;\n      var pct = ((TIMER_SECONDS - timeLeft) / TIMER_SECONDS) * 100;\n      if(progressEl) progressEl.style.width = pct + "%";\n    }else{\n      clearInterval(interval); timerRunning = false;\n      if(progressEl) progressEl.style.width = "100%";\n      if(countEl) countEl.textContent = "0";\n';
  html += '      setTimeout(function(){\n        if(timerBox) timerBox.classList.remove("show");\n        complete(stepNum);\n        btn.textContent = "✓ Completed";\n        if(msg){ msg.textContent = "✓ " + item.platform + " verification completed!"; msg.style.color = "#00ff66"; }\n';
  html += '        unlockNextStep(stepNum);\n      }, 350);\n    }\n  }, 1000);\n}\n';
  html += 'function unlockNextStep(currentStepNum){\n  var nextNum = currentStepNum + 1;\n  if(nextNum <= LINKS.length){\n    activate(nextNum);\n    var nBtn = document.getElementById("btn" + nextNum); if(nBtn) nBtn.disabled = false;\n    var nCard = document.getElementById("step" + nextNum); if(nCard) nCard.scrollIntoView({ behavior:"smooth", block:"center" });\n';
  html += '  }else if(ENABLE_CAPTCHA && nextNum === CAPTCHA_STEP){\n    activate(CAPTCHA_STEP);\n    var cIn = document.getElementById("captchaInput"), cBtn = document.getElementById("captchaBtn");\n    if(cIn) cIn.disabled = false; if(cBtn) cBtn.disabled = false;\n    var cCard = document.getElementById("step" + CAPTCHA_STEP); if(cCard) cCard.scrollIntoView({ behavior:"smooth", block:"center" });\n';
  html += '  }else if(ENABLE_PASSWORD && nextNum === PASS_STEP){\n    activate(PASS_STEP);\n    var pIn = document.getElementById("passwordInput"), pBtn = document.getElementById("passwordBtn");\n    if(pIn) pIn.disabled = false; if(pBtn) pBtn.disabled = false;\n    var pCard = document.getElementById("step" + PASS_STEP); if(pCard) pCard.scrollIntoView({ behavior:"smooth", block:"center" });\n';
  html += '  }else if(!ENABLE_PASSWORD && nextNum === KEY_STEP){\n    activate(KEY_STEP);\n    revealDestination();\n  }\n}\n';

  if(enableCaptcha){
    html += 'function verifyCaptcha(){\n  var input = document.getElementById("captchaInput");\n  var val = Number(input.value.trim());\n  var msg = document.getElementById("msg" + CAPTCHA_STEP);\n  var btn = document.getElementById("captchaBtn");\n';
    html += '  if(input.value.trim() === "" || isNaN(val) || val !== ANSWER){ msg.textContent = "❌ Incorrect answer. Please try again."; msg.style.color = "#ff5364"; return; }\n';
    html += '  complete(CAPTCHA_STEP);\n  input.disabled = true; btn.disabled = true; btn.textContent = "✓ Captcha Verified";\n';
    html += '  msg.textContent = "✓ Captcha verified successfully!"; msg.style.color = "#00ff66";\n';
    html += '  if(ENABLE_PASSWORD){\n    activate(PASS_STEP);\n    var pIn = document.getElementById("passwordInput"), pBtn = document.getElementById("passwordBtn");\n    if(pIn) pIn.disabled = false; if(pBtn) pBtn.disabled = false;\n    var pCard = document.getElementById("step" + PASS_STEP); if(pCard) pCard.scrollIntoView({ behavior:"smooth", block:"center" });\n';
    html += '  }else{\n    activate(KEY_STEP);\n    revealDestination();\n  }\n}\n';
  }

  if(enablePassword){
    html += 'function verifyPassword(){\n  var input = document.getElementById("passwordInput");\n  var val = input.value.trim();\n  var msg = document.getElementById("msg" + PASS_STEP);\n  var btn = document.getElementById("passwordBtn");\n';
    html += '  if(!val || val !== PASSWORD){ msg.textContent = "❌ Invalid verification password."; msg.style.color = "#ff5364"; return; }\n';
    html += '  complete(PASS_STEP);\n  input.disabled = true; btn.disabled = true; btn.textContent = "✓ Password Verified";\n';
    html += '  msg.textContent = "✓ Password verified successfully!"; msg.style.color = "#00ff66";\n';
    html += '  activate(KEY_STEP);\n  revealDestination();\n}\n';
  }

  html += 'function revealDestination(){\n  complete(KEY_STEP);\n  var keyBox = document.getElementById("keyBox");\n';
  html += '  if(UNLOCK_TYPE === "url"){\n    var targetUrl = ACCESS_KEY;\n    if(!/^https?:\\/\\//i.test(targetUrl)) targetUrl = "https://" + targetUrl;\n    keyBox.innerHTML = \'<a href="\' + targetUrl + \'" target="_blank" class="copy-btn" style="text-decoration:none;display:block;text-align:center;">🚀 Click Here to Proceed / Download</a>\';\n';
    html += '    window.location.href = targetUrl;\n';
    html += '  }else{\n    keyBox.innerHTML = \'<div class="key">\' + ACCESS_KEY + \'</div><button type="button" class="copy-btn" id="keyCopyBtn" onclick="copyAccessKeyNow()">📋 Copy Access Key</button>\';\n';
    html += '  }\n  var kCard = document.getElementById("step" + KEY_STEP); if(kCard) kCard.scrollIntoView({ behavior:"smooth", block:"center" });\n}\n';
  html += 'function copyAccessKeyNow(){\n  var btn = document.getElementById("keyCopyBtn");\n  navigator.clipboard.writeText(ACCESS_KEY).then(function(){\n    btn.textContent = "✓ Access Key Copied!";\n    setTimeout(function(){ btn.textContent = "📋 Copy Access Key"; }, 2000);\n  }).catch(function(){ prompt("Copy your access key:", ACCESS_KEY); });\n}\n';
  html += '<' + '/script>\n</body>\n</html>';
  return html;
}

function showCode(){
  document.getElementById("codeView").style.display = "block";
  document.getElementById("previewView").style.display = "none";
  document.getElementById("codeTab").classList.add("active");
  document.getElementById("previewTab").classList.remove("active");
}

function showPreview(){
  const code = document.getElementById("generatedCode").value;
  if(!code) return;
  document.getElementById("codeView").style.display = "none";
  document.getElementById("previewView").style.display = "block";
  document.getElementById("codeTab").classList.remove("active");
  document.getElementById("previewTab").classList.add("active");
  document.getElementById("previewFrame").srcdoc = code;
}

function toggleEditMode() {
  const box = document.getElementById("generatedCode");
  const btn = document.getElementById("editSaveBtn");
  isEditingCode = !isEditingCode;
  box.readOnly = !isEditingCode;
  if(isEditingCode) {
    btn.textContent = "💾 Save";
    btn.style.background = "var(--green)";
    btn.style.color = "#000";
    box.focus();
  } else {
    btn.textContent = "✏️ Edit";
    btn.style.background = "";
    btn.style.color = "";
    document.getElementById("previewFrame").srcdoc = box.value;
    alert("Code updated successfully!");
  }
}

function openTestInNewTab(){
  const code = document.getElementById("generatedCode").value;
  if(!code){ alert("कृपया पहले 'Generate Verification Gateway' बटन दबाएं!"); return; }
  const blob = new Blob([code], { type: "text/html;charset=utf-8" });
  window.open(URL.createObjectURL(blob), "_blank");
}

async function copyCode(){
  const code = document.getElementById("generatedCode").value;
  if(!code) return;
  try{
    await navigator.clipboard.writeText(code);
    document.getElementById("message").textContent = "✓ Code successfully copied to clipboard!";
  }catch(err){
    const box = document.getElementById("generatedCode");
    box.select(); document.execCommand("copy");
    document.getElementById("message").textContent = "✓ Code copied!";
  }
  setTimeout(function(){ document.getElementById("message").textContent = ""; }, 2500);
}

function renderHistoryList() {
  const box = document.getElementById('historyListBox');
  if(!box) return;
  if(historyLogs.length === 0) {
    document.getElementById('historySectionBox').style.display = 'none';
    return;
  }
  document.getElementById('historySectionBox').style.display = 'block';
  box.innerHTML = '';
  historyLogs.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'history-item-card';
    card.innerHTML = `
      <div class="history-item-top">
        <div style="display:flex; align-items:center; gap:8px;">
          ${isHistoryMarkMode ? `<input type="checkbox" class="hist-chk" data-index="${index}" style="width:16px;height:16px;">` : ''}
          <span style="font-weight:700; color:var(--orange-light);">#${historyLogs.length - index}</span>
          <span class="history-item-title">${escapeHtml(item.title)}</span>
        </div>
        <span>🕒 ${item.time}</span>
      </div>
      <div class="history-item-buttons" onclick="event.stopPropagation()">
        <button class="h-btn copy" onclick="copyHistoryCode(${index})">📋 Code Copy</button>
        <button class="h-btn copy" onclick="copyHistoryUrl(${index})">🔗 URL Copy</button>
        <button class="h-btn" onclick="openHistoryUrl(${index})" style="color:#38bdf8; border-color:#38bdf8;">🌐 Open URL</button>
        <button class="h-btn del" onclick="deleteHistoryItem(${index})">🗑️ Delete</button>
      </div>
    `;
    card.onclick = () => loadHistoryIntoGenerator(index);
    box.appendChild(card);
  });
}

function loadHistoryIntoGenerator(index) {
  const item = historyLogs[index];
  if(!item) return;
  document.getElementById('dynamicSocialList').innerHTML = '';
  if(item.links && item.links.length > 0) {
    item.links.forEach(l => addSelectedPlatform(l.key, l.url, l.platform));
  } else {
    addSelectedPlatform('youtubevideo');
    addSelectedPlatform('youtube');
  }
  document.getElementById('timerPresetSelect').value = item.timerSeconds || 10;
  document.getElementById('enableCaptcha').checked = !!item.enableCaptcha;
  document.getElementById('enablePasswordToggle').checked = !!item.enablePassword;
  togglePasswordInputState();
  if(item.password) document.getElementById('verificationPassword').value = item.password;
  
  setUnlockType(item.unlockType || 'key');
  if(item.accessKey) document.getElementById('customAccessKey').value = item.accessKey;
  
  document.getElementById('generatedCode').value = item.code || '';
  document.getElementById('previewFrame').srcdoc = item.code || '';
  document.getElementById('resultsPanelBox').style.display = 'flex';
  appContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyHistoryCode(index) {
  navigator.clipboard.writeText(historyLogs[index].code).then(() => alert('Gateway Code Copied!'));
}
function copyHistoryUrl(index) {
  const blob = new Blob([historyLogs[index].code], { type: "text/html;charset=utf-8" });
  navigator.clipboard.writeText(URL.createObjectURL(blob)).then(() => alert('Gateway Preview URL Copied!'));
}
function openHistoryUrl(index) {
  const blob = new Blob([historyLogs[index].code], { type: "text/html;charset=utf-8" });
  window.open(URL.createObjectURL(blob), '_blank');
}
function deleteHistoryItem(index) {
  const removed = historyLogs.splice(index, 1)[0];
  removed.deletedAt = Date.now();
  trashBin.unshift(removed);
  localStorage.setItem('israr_vg_history', JSON.stringify(historyLogs));
  localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
  renderHistoryList();
}
function toggleHistoryMarkDelete() {
  isHistoryMarkMode = !isHistoryMarkMode;
  const btn = document.getElementById('historyMarkDelBtn');
  btn.style.background = isHistoryMarkMode ? 'rgba(255,83,100,0.3)' : '';
  btn.innerHTML = isHistoryMarkMode ? '<i class="fas fa-trash"></i> Confirm Delete' : '<i class="fas fa-check-square"></i> Mark Delete';
  if(!isHistoryMarkMode) {
    const checks = document.querySelectorAll('.hist-chk:checked');
    if(checks.length > 0 && confirm(`क्या आप चुने गए ${checks.length} आइटम्स को ट्रैश में भेजना चाहते हैं?`)) {
      const indices = Array.from(checks).map(c => parseInt(c.dataset.index)).sort((a,b)=>b-a);
      indices.forEach(i => {
        const removed = historyLogs.splice(i, 1)[0];
        removed.deletedAt = Date.now();
        trashBin.unshift(removed);
      });
      localStorage.setItem('israr_vg_history', JSON.stringify(historyLogs));
      localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
    }
  }
  renderHistoryList();
}
function clearAllHistory() {
  if(confirm('क्या आप सभी हिस्ट्री आइटम्स को डिलीट करना चाहते हैं?')) {
    historyLogs.forEach(item => { item.deletedAt = Date.now(); trashBin.unshift(item); });
    historyLogs = [];
    localStorage.setItem('israr_vg_history', JSON.stringify(historyLogs));
    localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
    renderHistoryList();
  }
}

function openRecoveryFullPage() {
  cleanExpiredTrash();
  const subPage = document.getElementById('subPageView');
  document.getElementById('subPageTitle').innerHTML = '<i class="fas fa-trash-restore"></i> Recovery Trash Bin (30 Days)';
  document.getElementById('subPageActionButtons').className = "sec-actions israr-lab-recovery-actions"; document.getElementById('subPageActionButtons').innerHTML = `<button class="sec-btn" onclick="closeRecoveryFullPage()">← Back</button><button class="sec-btn" id="trashMarkBtn" onclick="toggleTrashMarkDelete()">✓ Mark</button><button class="sec-btn danger" onclick="emptyTrash()">✕ Delete All</button><button class="sec-btn" onclick="restoreAllTrashItems()">↻ Restore</button>`;
  renderTrashListInFullPage();
  subPage.style.display = 'flex';
}
function closeRecoveryFullPage() { document.getElementById('subPageView').style.display = 'none'; }

function renderTrashListInFullPage() {
  const container = document.getElementById('subPageContentBody');
  if(trashBin.length === 0) {
    container.innerHTML = '<div style="color:var(--muted); font-size:13px; text-align:center; padding:40px;">ट्रैश खाली है।</div>';
    return;
  }
  let html = '<div class="history-list-box">';
  trashBin.forEach((item, index) => {
    html += `<div class="history-item-card"><div class="history-item-top"><div style="display:flex; align-items:center; gap:8px;">${isTrashMarkMode ? `<input type="checkbox" class="trash-chk" data-index="${index}" style="width:16px;height:16px;">` : ''}<span style="font-weight:700; color:var(--red);">🗑️ Deleted</span><span class="history-item-title">${escapeHtml(item.title)}</span></div><span>${item.time}</span></div><div class="history-item-buttons"><button class="h-btn copy" onclick="copyTrashCode(${index})">📋 Code Copy</button><button class="h-btn copy" onclick="copyTrashUrl(${index})">🔗 URL Copy</button><button class="h-btn" onclick="restoreTrashItem(${index})" style="color:#00ff66; border-color:#00ff66;">♻️ Restore</button><button class="h-btn del" onclick="permanentDeleteTrashItem(${index})">❌ Delete</button></div></div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}
function copyTrashCode(index) { navigator.clipboard.writeText(trashBin[index].code).then(() => alert('Trash Code Copied!')); }
function copyTrashUrl(index) {
  const blob = new Blob([trashBin[index].code], { type: "text/html;charset=utf-8" });
  navigator.clipboard.writeText(URL.createObjectURL(blob)).then(() => alert('Trash Preview URL Copied!'));
}
function restoreTrashItem(index) {
  const restored = trashBin.splice(index, 1)[0];
  delete restored.deletedAt;
  historyLogs.unshift(restored);
  localStorage.setItem('israr_vg_history', JSON.stringify(historyLogs));
  localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
  renderTrashListInFullPage(); renderHistoryList();
  alert('आइटम सफलतापूर्वक रिस्टोर हो गया!');
}
function permanentDeleteTrashItem(index) {
  if(confirm('क्या आप इसे हमेशा के लिए डिलीट करना चाहते हैं?')) {
    trashBin.splice(index, 1);
    localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
    renderTrashListInFullPage();
  }
}
function toggleTrashMarkDelete() {
  isTrashMarkMode = !isTrashMarkMode;
  const btn = document.getElementById('trashMarkBtn');
  btn.style.background = isTrashMarkMode ? 'rgba(255,83,100,0.3)' : '';
  btn.innerHTML = isTrashMarkMode ? '<i class="fas fa-trash"></i> Confirm Delete' : '<i class="fas fa-check-square"></i> Mark Delete';
  if(!isTrashMarkMode) {
    const checks = document.querySelectorAll('.trash-chk:checked');
    if(checks.length > 0 && confirm(`चुने गए ${checks.length} आइटम्स को हमेशा के लिए डिलीट करें?`)) {
      const indices = Array.from(checks).map(c => parseInt(c.dataset.index)).sort((a,b)=>b-a);
      indices.forEach(i => trashBin.splice(i, 1));
      localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
    }
  }
  renderTrashListInFullPage();
}
function restoreAllTrashItems() {
  if(!trashBin.length) { alert('Recovery bin is already empty.'); return; }
  if(!confirm('Restore all items from Recovery to History?')) return;
  trashBin.forEach(function(item){ delete item.deletedAt; historyLogs.unshift(item); });
  trashBin = [];
  localStorage.setItem('israr_vg_history', JSON.stringify(historyLogs));
  localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
  renderTrashListInFullPage(); renderHistoryList();
  alert('All items restored successfully!');
}
function emptyTrash() {
  if(confirm('क्या आप ट्रैश को पूरी तरह खाली करना चाहते हैं?')) {
    trashBin = [];
    localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
    renderTrashListInFullPage();
  }
}

function openBackupFullPage() {
  const subPage = document.getElementById('subPageView');
  document.getElementById('subPageTitle').innerHTML = '<i class="fas fa-database"></i> Backup & Restore Manager';
  document.getElementById('subPageActionButtons').innerHTML = `<button class="sec-btn" onclick="closeRecoveryFullPage()">Back</button>`;
  document.getElementById('subPageContentBody').innerHTML = `<div style="display:flex; flex-direction:column; gap:14px; background:var(--card-bg); border:1px solid var(--border); padding:24px; border-radius:8px;"><p style="font-size:13px; color:var(--muted);">अपने सभी जनरेटेड कोड्स और सेटिंग्स का बैकअप सुरक्षित रखें:</p><div style="display:flex; gap:10px; flex-wrap:wrap;"><button class="sec-btn" onclick="exportJsonBackup()" style="background:var(--orange); color:#fff; border:none; height:36px; padding:0 16px;">Save JSON Backup</button><label class="sec-btn" style="background:#319795; color:#fff; border:none; height:36px; padding:0 16px; cursor:pointer; display:inline-flex; align-items:center;">Import JSON File <input type="file" id="importJsonFileInput" accept=".json" style="display:none;" onchange="importJsonBackup(event)"></label></div></div>`;
  subPage.style.display = 'flex';
}
function exportJsonBackup() {
  const backupData = { app: "Israr Lab Verification Gateway Generator", exportDate: new Date().toISOString(), historyLogs: historyLogs, trashBin: trashBin };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr); dlAnchor.setAttribute("download", `IsrarLab_Gateway_Backup_${Date.now()}.json`);
  document.body.appendChild(dlAnchor); dlAnchor.click(); dlAnchor.remove();
  alert("JSON Backup downloaded successfully!");
}
function importJsonBackup(event) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if(parsed.historyLogs && Array.isArray(parsed.historyLogs)) { historyLogs = historyLogs.concat(parsed.historyLogs); }
      if(parsed.trashBin && Array.isArray(parsed.trashBin)) { trashBin = trashBin.concat(parsed.trashBin); }
      localStorage.setItem('israr_vg_history', JSON.stringify(historyLogs));
      localStorage.setItem('israr_vg_trash', JSON.stringify(trashBin));
      renderHistoryList(); closeRecoveryFullPage();
      alert("Backup successfully imported and restored!");
    } catch(err) { alert("Invalid JSON backup file format!"); }
  };
  reader.readAsText(file);
}

/* 44 ORIGINAL ITEMS WITH THUMBNAILS & LIVE STATS */
const allRelatedTools = [
  { title: "Premium Verification Gateway Generator Free Israr Tool Zone", url: "https://isrartoolzone.blogspot.com/p/premium-verification-gateway-generator.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyNHf1cvZ4zYVwta08SwZ5V8fBQMpH1pDrxyDqGGrZUVIzxLMycosCZUpraDTfLXAd8RiAbY-F8GaNcilIwOZoYVtSYJwrzGmz4PsFUwYvDqnOE6ZI6IeHS2Sq4h7RGKIt14AUVAdm5XyS_c2dHexdU_h_jHwUhIqIKa2umt9nAk_BhAn0q3eR3Vy5mt8/s1376/85793.jpg", views: 14200, active: 6200 },
  { title: "Article Divider - Split Text Into 200+", url: "https://isrartoolzone.blogspot.com/p/article-divider-split-text-into-200.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJiYmkQQaUiGo3G17Gqf7jRZGBgHuv8fquhNiLk-Rj8Lniqg-6Q0qOLq7VyFRWpPokU62kRfRuQoyldTvSHZuuROKsR7pHg7FigUrm-BS5P3sAlNUW7cfaALRRifdrXah-BLo8jo0eBOiKgqcgeg2Ld5c80Dv7qcayn5U6To_aV6mc21pmJEjlVn65fhg/s1024/A_luxurious,_ultra-modern_crea_330810882%20(1).jpeg", views: 18500, active: 8100 },
  { title: "Email Generator - Unlimited Custom Emails", url: "https://isrartoolzone.blogspot.com/p/email-generator-unlimited-custom-emails.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhh6I0x3O0sjuxMKHeFiANLLdPaHqRu26l2sS5K4ACJTUQlgAFn5_LWdzhhVg05saFzQzEMmToy4Ba1Wvd3i7cBFnrAZ8EmoeD4g3PuYiWgoiPVdAbKPZpAFQRks0FVG67weHo6LrlyJLnRj3q7WDlSCK4hWziDK33el4JjlVEH1Qw0f7M5EvpYtZdU4bY/s944/Futuristic_premium_studio_with_8830680.jpeg", views: 12100, active: 5300 },
  { title: "AI Images Generator - Text to Image", url: "https://isrartoolzone.blogspot.com/p/ai-images-generator-text-to-image.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvpnQrD15qS57_HoLip6Wf7PLVzNMTxZjbzGxqLOvQls43Y-8fCR1uyiAxwM3KfuoSyoAiwod0UDj69QNw9UXzbKi321KIRzfTt0zcKxVHEalnOtVWBQGTSMfVlLNjSlBSYF1BR_za4iaIs_SJtHAvaldoQROZFb-gjRnL5kh9m64NGbbA08NooxTWE_VW/s1024/A_modern,_futuristic_tech_678662982.png", views: 22400, active: 9400 },
  { title: "AI Creative Suite - Free Text to Image", url: "https://isrartoolzone.blogspot.com/p/ai-creative-suite-free-text-to-image.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoY2lysf4-5Q9AoE7vGmodh1bMVuziRNDRqzQ6vbhN3iK5rfyokOzEVt7Ur4jWE5LN2NXzTT8Pcyjr124LFA97i70lZgwnHr5IJpuByJupSR8S_8iLvG2DzugdwgyOCBTKEIclcSp5M8yNKbB3e4BTOUUcG9pqd-6pMmUSpmBzD6GEcu9pZZBzrfzQPSZi/s1704/A_futuristic_3D_studio_interio_685484605.png.jpg", views: 15400, active: 7200 },
  { title: "AI Art Generator - Text to Image Free", url: "https://isrartoolzone.blogspot.com/p/ai-art-generator-text-to-image-free.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUlv-vYxogNx95PW4h5NC5nyskjIrrixgkq7FqxBS5BWcTRPMe3ChuER0Oc-OhYGz7ezVLwGPUww8vxBQbx0QBd50Ya_njJ4efGAhMnb_7-1vAQJGwSLPAkhI9W0ETSd-QLvxVs1fPmV2OiCoaiHauTvR2lVDiBaEnPyCfJfNPJwQ0cDo1rg3vJYYiVI0/s1024/generated_image_1756796196225.png.jpg", views: 19800, active: 8500 },
  { title: "AI Code Builder - Free No API Key", url: "https://isrartoolzone.blogspot.com/p/ai-code-builder-free-no-api-key-israr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUJdq45TV9gQfwJj6TAs666cFvPR5YC3fL9-RgkpkwFdXRWBsY62mceGmqpF5vZlYOif4OG3oqG8h2kTt1vu0ifusrrG2mppCfmAE3jBBX38qDBnyPQToRQ4ukHvuCXhcTwgV7jJkdCOQm_gi5zWWYdYc4B3Lpn1a4digH87pVrRZOUz6GVo0W4UnWjHSz/s1024/A_futuristic_3D_tech_work_925742714.png.jpg", views: 16700, active: 7400 },
  { title: "Paste to Link Generator Code Share", url: "https://isrartoolzone.blogspot.com/p/paste-to-link-generator-code-share.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEivxdWKmsx-QRj4ecXe5voulhXKyxwRLJT-6QQl3TqKvnM_8rj4ouN2j9IDlgtt_ANwNwOuxE1OM1YS-fYTIvwwpQSZgVUV6c361LKgIq_sj9qmD17DuqQvhJ508xAA-ixq7Dy_N6D1J-5xCtugUgFTaHV10zKxDAAMBgOD2XpGtpTJcRE9omJG5Obc1JE/s1024/Ultra-realistic_8K_3D_futurist_474969675%20(1).jpeg", views: 11200, active: 4900 },
  { title: "URL Shortener Short Link QR Generator", url: "https://isrartoolzone.blogspot.com/p/url-shortener-short-link-qr-generator.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiyaFKUeZY-0PjkvG_CK_viHaM_GvDEf8ky9hPZAcY3pg3HumBnU8n1Ai8ebb5dxBIDztT5VO2iTR4snFxuy0YRSU3X18RcQ6yp5adGAq40I1r7BfKHKpMzKVCwqENQrixY8eyq1I2graCfiI5k8e2xiwV_dLxFQQM4lyHeZlG2rco-EMPX3SJPHk7iZ6RB/s1024/A_stylish_young_woman_sta_518554105.png", views: 25100, active: 10200 },
  { title: "Advance HTML Viewer Code Live Preview", url: "https://isrartoolzone.blogspot.com/p/advance-html-viewer-code-live-preview.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia8mazQu3xBBGmE4v0pcYe2wO45RCzWfLLSkSeAPkR5uEBVN96pVyQIQgRKp_v4CxJK6IqFLLYSoBfRZ4ZfwhZPkEtHjDSAFLjifAiv6nbJckI5aKz3r1b6UPczwZ0lmvl8_sHbOUSdDf2oPC2Soku4GAkDe2jRkWatGWo_wbhJ92Y-TkmnY_IWDpQSEjz/s1024/A_modern_classroom_design_252651673.png", views: 13400, active: 5800 },
  { title: "HTML Viewer Live Preview Tool Online", url: "https://isrartoolzone.blogspot.com/p/html-viewer-live-preview-tool-online.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVaagKHgwBPn5rfvIkedoaSLNBoUvDBuaJjRrABJY8BE7qEg5o5a48V-1EdkmuYxkwy7CrL68W9WSV2F9tHGduoATkkjLzWGcflY3t83rno6d1EHvKlfobLpdb2pq9ySV1_RMB40SMFeFppQzsuFkY5BIe3WazFZX3BHnB13AppIr8Usdf-OUxFw9u3dH/s1024/A_modern_tech_workspace_r_226046361.png.jpg", views: 14500, active: 6100 },
  { title: "Text to Speech Speech to Text Voice", url: "https://isrartoolzone.blogspot.com/p/text-to-speech-speech-to-text-voice.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW2gC5TSitsAPJ0vUivjkW4kAlGEhpXUR6SxMR9_lRSroWyhefH6CFjrXiasDyhOH4YGM6jF2P3nM8iVOzoKReNiQ2k2LbcXTQAL5xO0DGy4u2sTz-KfVAx4k5u_Zw7JInjOgbf2DxEoIvuxReyxmyZ_1lPElc4hQu1E4T491LFMH-0wpcTommB_YmR76k/s1024/A_realistic_tech_workspac_333279290.png.jpg", views: 17200, active: 7500 },
  { title: "Word Counter Character Count Tool", url: "https://isrartoolzone.blogspot.com/p/word-counter-character-count-tool.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqnd4EAAHU6YXpK4t30tBYnXDi60ZdIzWU7zbRQuyHeX4s56PRib4ee25efh-ayNvgvV_ZprfY7lroRR_hR8yhZTWch789cwV-rV6gROSzexsp3RG0F75UyNOhRFObEVkgAOzF3jPoMUHPi1u86xakEgw9H8x_y8UGT4C4HIaMKcJbgChXZD2DTpY2WbPw/s1024/A_modern_workspace_setup__236130886.png.jpg", views: 16100, active: 6800 },
  { title: "Hijri Date Converter Islamic Calendar", url: "https://isrartoolzone.blogspot.com/p/hijri-date-converter-islamic-calendar.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOPG8PQG3AzegUFx3pXasamoA9VjYU8zzbR5EDyy4q8weLw81DjDNExPgRoZr0_X31_hySEOeY5SJ8JaoLScRpWOH3AG8PIh4kyXVFe1vEtWlV-3KQ9AgT-CKGYNYBbHoTURyVrcScARBcvepgM7kUjiEqpfoJbzTCIUhK1V1lVMYoDsH8t0w8CtES11mK/s1024/3D_digital_artwork_of_a_m_552705508.png.jpg", views: 9400, active: 4100 },
  { title: "Age Calculator Birthday DOB Calculator", url: "https://isrartoolzone.blogspot.com/p/age-calculator-birthday-dob-calculator.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjW1VOO-cASN3dHSxJMH5qY7MY8ksmKkCaQt3CIx6wJlkpQf7Zx4KZiKxfXMi-NPabnqYRm4pzZWbAJVQuAzZC174lWzozRohqfsDoI0bxZTiVzxZkPQAIyct3bl4HvkPnl-CuCZmOb3F47Cc3Y7ALiDlmXPqgxiqZEzMkCCEqR3-i_W5fdvTZtT-7U-kib/s1024/3D_digital_illustration_o_465396204.png.jpg", views: 13200, active: 5700 },
  { title: "Bijli Calculator Electricity Bill India", url: "https://isrartoolzone.blogspot.com/p/bijli-calculator-electricity-bill-india.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-2-PXvurQ-2_9Dr_tRorNmREZu9UwXuLLIctkvkkM93bb2goClY1c9FRDyw0ZkZG5n0yoL69PZp_fUSGZRSKMp2xi_tYKpyn6kTio2pryembFC5Hy5mf5r40NYEb0qqBcYacNvowlth3GkrLRX24TKozxazgh7oc_6ihagtfg6uEl-yXqHcwi_2PxAGGG/s1024/_3D_digital_artwork_of_an_100067981.png", views: 10500, active: 4600 },
  { title: "Loan Calculator EMI Calculator Free", url: "https://isrartoolzone.blogspot.com/p/loan-calculator-emi-calculator-free.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5MY4xXWUJ73IJ62w1j7kGfdUOBF4rgL_1NPwPaqsfZhMLeUxg-4I5n9gMXv4MSm9wELsn61AOlJ6xlLq4D3kfNJjxpWSFPZoJD2KEjm_pq-qBf5fY3KtHCR0ALXVM6XmOcDt8hvziWriu_CBWi2cFJ1knp7TjHisQJ7ETJ8t_jwkZrvqE_qwxM5a0IAd2/s1024/_3D_digital_illustration__674769610.png", views: 15600, active: 6700 },
  { title: "All Unit Converter Convert Online", url: "https://isrartoolzone.blogspot.com/p/all-unit-converter-convert-online-israr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg52gYZmDj7UU5PQ6RdRDbFG5St2lqjGVE7Wu5yE5E2pxS91pjbFJvSavCs62Hmrf9csec6wg8RaT6r0m2Mos6svq_Z9PKz0RbBqO4YNSYmTZp-CdHFDbXlWf1gaxZt5ttSB3K4tNib-uHDNa4HVB57JeLRpA1mH80lxAJUq7PFY9gOQyFaMUiRTXJdTIA/s1376/85478.jpg", views: 12900, active: 5500 },
  { title: "Free Quiz Maker Create Online Quiz", url: "https://isrartoolzone.blogspot.com/p/free-quiz-maker-create-online-quiz.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKg0LGvsyynNtTwoDk4WhvUH5zD7MzfmVzUWi-mPswiayxTXZbXSEpbzPIv5XeJ_hjnI7WZE9XYAQ0XBLFMGIEu0z6Ysw-Ha8G8ld86AJ9OgGkkq_svW6Qx_2lE4AASoyogw0AxFPyfqySE85R8V8i5ZWHzA3bvjAlJj1guD2nwGv-fj7gyIz3pxSFLVuh/s1024/A_realistic_workspace_set_759290890.png.jpg", views: 11800, active: 5100 },
  { title: "Internet Speed Test Real Speed Check", url: "https://isrartoolzone.blogspot.com/p/internet-speed-test-real-speed-check.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-OFuPGheUx_fMx6VSaVtIxfdzMZiY8gKlhpjEv1NHSf88vAIYYrTWIcQvAbj6OfwEU-hpZtgRkjnq3wTby3O6mlEUU5gMkv0PHL5_rDjJy9jxUjNDLAMQk2Lh-MGlvPV2Qbs9T3m9yxKPtKmB9J8Ac1EV6zYWeHF_7_amQ0adtlsbHxeAwY6cRHZO2HI/s1376/85471.jpg", views: 28400, active: 11900 },
  { title: "WhatsApp Direct Message No Save Needed", url: "https://isrartoolzone.blogspot.com/p/whatsapp-direct-message-no-save-needed.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEist7Zgf7M-Bf12FVVWXsS9H1_B76ibECoTWLC6QMkr3nRhcLTYoB4EE5ac6YprFLyN_dlwvobV7aJMPOc4S6_cF8L34-sVnKO7pnTrNnLaN3vC27XbDRxjnnjq3xTUBrSqci9VZN-kEwi4k_fMN_NarPhQOyxVlvOkiLel_6fYXl4aiBXl1MtoguFT-BZS/s1024/A_realistic,_modern_works_572379611.png.jpg", views: 21300, active: 9100 },
  { title: "Strong Password Generator Free Secure", url: "https://isrartoolzone.blogspot.com/p/strong-password-generator-free-secure.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnrreen0pq16tb4bc62futy9x1UC1HRbYQ9PThhOKF_gDnv4G5EQ8n31NOyN5lqh6IPGMpsY5MPQ12YqKQ6nWDo3yaeKKcflTCE7aDr8IM-1yzUr2L61QXaYfMqR6Qaokn5LQOmbkmVv8BhWAmxsSa4yJ51uPvkE65qhRvq-HPFEcu6w7SL52z-uf5Xxu6/s1024/A_high-resolution_modern__733840994.png.jpg", views: 14700, active: 6300 },
  { title: "IFSC Code Finder All Banks Instantly", url: "https://isrartoolzone.blogspot.com/p/ifsc-code-finder-all-banks-instantly.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjI-jBSdrAB6Tn2sIrOMTBGnHVw4OlETxJI1FXROgKiFL5nkYXV0GMBE2aWDYsP0MYvFjCGL4B0PHcdE-AwWoqoLMKsYYIYadWqEMj9tHxy47InwCwJTfl_-JCXvgsHoAueZAARdDcaWH2tNllYpjElASodvY8DV1EBumsPzLw7hW4XwyqE5Ocgmi1ft4sL/s1024/A_modern,_ultra-realistic_296282460.png.jpg", views: 16900, active: 7300 },
  { title: "Stylish Button Generator Free Custom", url: "https://isrartoolzone.blogspot.com/p/stylish-button-generator-free-custom.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh11vKg8nolORYkMgLrtiOMu3Fj_AQ7SdGV8BmM-6_9fkUvKdxXvNGxReKTomWiP08yO8Q0cD2NgAWeffWMMVOsgkYUGXwcejSO4slFNVi06Av2uHne6HtNUZrLHO9s4M9snG-HRKbp22cUcMZZPseEkYJvLO56U6mkW7XrG0kXdqegap3MCLI_svAeiVvD/s1024/A-beautiful-stylish-dark-263720649.jpg", views: 13800, active: 5900 },
  { title: "CSS Button Generator Free Stylish Maker", url: "https://isrartoolzone.blogspot.com/p/css-button-generator-free-stylish-maker.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8CungducxWsZhba3tDXkQZyAKfCQV7dXOGdUfA_mWykzmiFgy_fEN6feQzD2VouWQH_fVApMy2NPo5gM6HdYi6RahNOjfvEW94FLG80b2pR1YH8wfq2ZvjEi0zF7rzNiBJTXDCavZVNCK4REMlVVvV6vUWtF8G4Wi0ZgTJXE0ITKuNx02k6Nx5BuRvuj5/s1024/A_modern_tech-themed_thum_975821435.png.jpg", views: 15200, active: 6500 },
  { title: "Random Button Generator Modern CSS Tool", url: "https://isrartoolzone.blogspot.com/p/random-button-generator-modern-css-tool.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyq7HRTOiKpEoKAuuL6XlUu0Xsk-9awGQ1fk1_WEEdMEVQMXzwKg3u-p3HeVVUFwY2P70HQvVJISFSvrsvSNPVyHKUWV6PcYGLOI36KRpVQ3qDCbOdJVqfxyE_mxzyLNq3K4zUWv5Spi_ogQbhRgxlROBRzx3dQx2xYekmLQLFwSbOoxJMVDZGs-dtuvxJ/s1024/A_modern_computer_monitor_897506577.png", views: 11900, active: 5200 },
  { title: "200 CSS Buttons Stylish Modern Button", url: "https://isrartoolzone.blogspot.com/p/200-css-buttons-stylish-modern-button.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvhAdwBK_beWICNDWnlLRn3UKLKCxyUrtFYCqNFiGSLVl-qKdF4fQu8CXrtqFATj3ubF3KzMbV0odE3hSf6UiHDpBBluMPxGbcbXS2rQgjThiVlUIAZEDKn7eQr4pGg1pP36YDpndsQVMeurHOyfuoeL39mf_h2jeHxIwvoj6VEP7GWfjUuRHvZiD-e6o9/s1024/A_modern_workspace_setup__996476333.png.jpg", views: 19400, active: 8300 },
  { title: "Gradient Generator Custom Color", url: "https://isrartoolzone.blogspot.com/p/gradient-generator-custom-color.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrjyUU01S3FcQiXxWxwwANeGMoKs7O20_zmQdhqBExrF-6PZSSIT-IKwtY-aKOKAHfQtrlcloYAC5HVwfFvWy8iUGHHEhyznXAjopj4-rcc1MnYS2RCzsE3emkwGf-Owt4smzdEhrXoiC6PvZMomLdmd1npvL19NxdZdQNgbf8m4_-cgevi2y7vSBx6xS4/s1024/A_modern_digital_workspac_520016822.png.jpg", views: 12600, active: 5400 },
  { title: "Text Shadow Create Advanced Stylish", url: "https://isrartoolzone.blogspot.com/p/text-shadow-create-advanced-stylish.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHd-Qs1RpkMlFreti2wD_MBcwqhLYBiXdy-EqWxsT_Dvrs5uFQxrpSowmju05CTJqMBvOtRkQEhcW0PTuXCF-74QJUHW39c_dcroVN8bwFL9PiH-ECjNGBg7KBKaI5iXd3zDq-A68MhdPQiQvQUVW3Qj3Y4kuE82KM6ebMs095oNdsi68zQlz0g7UpVdHN/s1024/A_realistic_and_modern_wo_871813681.png.jpg", views: 10800, active: 4700 },
  { title: "Text Shadow Generator Stylish", url: "https://isrartoolzone.blogspot.com/p/text-shadow-generator-stylish.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh17Lei4xnMgHRsZ2gBTdaCMKKmZx1H4ypDFgvmd_3oByPHUue9DsUxdml6CeZhFzrHsTEzBL_R5cUQ86ivEs-1_T2jSRZTfVMnOEhcThvohe7PJ1HXFHr_69S6rytgFdpnJf16VtPwFnBh-wLKrByTRIBf0iH3eLjb8-8wIPEkdfDXmfDJdFlku_etOPv0/s1024/A_beautiful_girl_sitting__723633607.png", views: 11500, active: 5000 },
  { title: "Soft Shadow Generator Modern", url: "https://isrartoolzone.blogspot.com/p/soft-shadow-generator-modern.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZUaLsINHNhYW0uvbSVcX94eirlvp_q_F9L5J8WGRO5ESDHMpXSGEGeqOT3qshuU6INPmphyFlhtbIQnt0a-TPAtp6qZhXQUuT_mMTAsN76JMq1vpuL7et0iUME4NMxnWTfehEszV-tcg_qTh-o6yzUYghzqz563DAOnARtOF_vvSggr_Yd0_X_6IeUEKS/s1024/A_modern_creative_workspa_425799789.png.jpg", views: 9900, active: 4300 },
  { title: "Box Shadow Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/box-shadow-generator-stylish-css.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBkzPxtcQX3P0epcAxv-Un__phzRnzqBKz_2Usg8LT0rMBVqZMAAuxd61YGt3IqGExFCUwIV02PDO1TYP869H8jhP_3pf_oefJJeV2e26p2Mr7Rb_A_XqaAzG0LiYSxpVoiS2Euigsj8oB3B8s_cicuK2D85e-VEnz7EoXa4jx2aPMIBQkMvDRtLCK6-E/s1024/A-realistic-19-year-old-g-299570621.jpg", views: 16400, active: 7100 },
  { title: "Border Style Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/border-style-generator-stylish-css.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgaIN1lwHJjma3tutHxqGpnkJ4kb1-_sKvyNPQ-YVhszDo_flMVsmX4tmqbenC-WG__0pZnLX95lwP96-sfcSu9WG26ByfdTTzExwlb7pORYpwzStRHonzV9pyfyi0SQphFr3jSreCrALmZn5k4b3yUSWonox789tqH5eA4YTKSarZtgzQgctxCZMscAFV4/s1024/A_vibrant,_slightly_isome_901030846.png.jpg", views: 10400, active: 4500 },
  { title: "Dashed Border Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/dashed-border-generator-stylish-css.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFhB1kH61tVuzAInFLnNkf800mxcakNkZLRt04eiBelE2sdxZ5c_XDsFqrFQkoQ_4E2MSYkNp39xv6UTLX1plZ4YxMtTQaKBCr4LmWvJwNFAqjoMFIWIRR0PPzWAZlg1UyxmT4t2yYPkG5kb43C96jpHFNB6Sxg3rlFEUbq5l4tu5PtpzYEg5o1ZhIVqA/s1024/86626.jpg", views: 9200, active: 4000 },
  { title: "CSS Transform Generator Visual Scale", url: "https://isrartoolzone.blogspot.com/p/css-transform-generator-visual-scale.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgETlCYH96-APYh7nGtaKm4uAVS7-AfmF_hdtZSD76MFVHlVNUp1v7kjirplPrI3m6ZBEo3fjKSN6BqAr21HU3ea_urgoHX0aTLQ6DiIXUo2J3AIDWX6-tE3EWdTKQdu7VJp9miatQtSn8Bz2QCY7cJ_OLCTmCQxsym2HzHnCtgNs2e1T6mTFDNGHbgAnSA/s1024/A_realistic_19-year-old_g_927578681.png.jpg", views: 11100, active: 4800 },
  { title: "YouTube Revenue Calculator Estimate", url: "https://isrartoolzone.blogspot.com/p/youtube-revenue-calculator-estimate.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWDpLiWbQ9mDD-VOBl9t5Hw7RTEuMaqonxUbnwvO7Un7qpCGbulZiDL12xjS9xj9kDPGdhCpljLpnmme_XAdhvnFqyU68y5qxFklSPARUDxNi9DFMkLjob9fJfteGD_6CBvdTgEpcFjjiwbIhN5iEz8R3WYh6ZtOC2wg5dzEC-JjPg-0Q0walSJh6Z10EA/s1024/3D_digital_artwork_of_a_c_390156647.png.jpg", views: 23500, active: 10100 },
  { title: "YouTube Thumbnail Downloader Download", url: "https://isrartoolzone.blogspot.com/p/youtube-thumbnail-downloader-download.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWDpLiWbQ9mDD-VOBl9t5Hw7RTEuMaqonxUbnwvO7Un7qpCGbulZiDL12xjS9xj9kDPGdhCpljLpnmme_XAdhvnFqyU68y5qxFklSPARUDxNi9DFMkLjob9fJfteGD_6CBvdTgEpcFjjiwbIhN5iEz8R3WYh6ZtOC2wg5dzEC-JjPg-0Q0walSJh6Z10EA/s1024/3D_digital_artwork_of_a_c_390156647.png.jpg", views: 26800, active: 11400 },
  { title: "YouTube Tags Extractor Get Tags Title", url: "https://isrartoolzone.blogspot.com/p/youtube-tags-extractor-get-tags-title.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRsmmlV4xs3inRcfr-y3xhK7jhALSUr2Aoy81ZdAxN2e5rVyiwMsfDazUeR3qAhQWebM2Vkn0Yed-9mHZi6dIZaoKX8HYE91GLoSiPLg6RjIV_dNI1h1O4PcfSPgDXhgIrfz1pCoLXoHNrjxlle9U0wxNi09x8vm2Cszj3NilMRViKq14DSm8jAyX6yyZm/s1024/Design-a-vibrant-eye-cat-409136621.jpg", views: 17900, active: 7700 },
  { title: "YouTube Tag Extractor Extract Tags", url: "https://isrartoolzone.blogspot.com/p/youtube-tag-extractor-extract-tags-from.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOMnwXGDQeRdfMUMnaFX6DswALeA8TXEWeIb0xlPQo7kMn2Cx7ncmVABzXbo3YqRIohdCjVRQ7vboBmYNdDoMkIgHnBBMu-PJOAThCZMddLIRIbc2Zrw6BbSRWo2R8wOKUUw_QJ10nacZ68eag3XaBKWq2X4MTanMM0tF3nMEZGzKyWNXp5DKWu1OpP9ZP/s1024/A_premium,_realistic_work_586583276.png.jpg", views: 15800, active: 6800 },
  { title: "Israr Tool Zone YouTube Suite Pro", url: "https://isrartoolzone.blogspot.com/p/israr-tool-zone-youtube-suite-pro-all.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoJN9KJnchdLBuTkswSnUKRLHiHxHgnF0u2NdAkWFXTjFKlgEcmDjSmTXTrmNN69VdW8A_TQ_qOm5Z3JU9IDmNfgYay8KYWskJLTJozFHPtEeVXPGeFruDcSGKAFoxUSh142CQhR_DViH9jNKijHi8k9Oo-F7l6jP1aAN39sfMewZj1V1lXl40PLAc1rjM/s1024/a-modern-and-vibrant-digital-workspace-showing-multiple-tools-like-youtube-description-generator-im-1.jpg", views: 29500, active: 12800 },
  { title: "Image Crop Tool Online Circle Crop", url: "https://isrartoolzone.blogspot.com/p/image-crop-tool-online-circle-crop.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhN-a2DyOWA_E-Vquj62RIUuO-mCgJwV3k08rJl0BYT67gTBrR6sb0wY3q0q-jRZAyOjyc1TZu2gCbBFjZ2jkxme6BDLkx3Y7IGZa4B5t4zPzYNMNw5RFhfgFkIuesqbiK6nCTjCZ9ihXh5_Ri5OeKhYJd_k_yUVwBn-JQDXLdsL3plePwFPdofwDSPmN15/s1024/A_modern_digital_workspac_634396879.png.jpg", views: 14100, active: 6100 },
  { title: "Compress Image Online Reduce Photo Size", url: "https://isrartoolzone.blogspot.com/p/compress-image-online-reduce-photo-size.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXvu7BgPz-r-c3DURYsr4g-xocl0QmfW30MBuYNHIi-fCFvyAtY27fYi61M27E_bYYn8z-0iHNylJ7yr4TMvi0A2ld_v5REjC0cz-94fUL_jcV6BWUZH-we1qtRKYhyphenhyphenuUvF4pXWO3XCGs_8F-Qq9p1eKqu4MDHpZYqgYvtbKzY355rmKQMPFmIJB_eJD_U/s1024/3D_digital_art_showing_a__466267296.png.jpg", views: 21900, active: 9300 },
  { title: "Free Keyword Generator Tool", url: "https://isrartoolzone.blogspot.com/p/free-keyword-generator-tool-100-working.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6YuNE99KFDev80Kpc4JWAZVrcu2oYQ7SqcPnV9wYtwuGXvrPovXzZsWw206dpHxgJTSts5HOZVezmrs-4JA0l6sDE1gaXT11fWUOly1IPrItpFfqAw8mcRKLVo-f_AqNLuZ5ZnpzA6XxCPbt_44M4uWtE3U1jovqS7hUgUk91gMwRoonTLKyJsQXUjymv/s1024/A_realistic_workspace_fea_109311379.png.jpg", views: 13300, active: 5800 },
  { title: "Free Keyword Finder Tool Unlimited SEO", url: "https://isrartoolzone.blogspot.com/p/free-keyword-finder-tool-unlimited-seo.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOcESecPB0A0xfXMaj0A85OWQ8Qfe0yCsJKHyWXbuoK2FwRqmk9i3YpTMxyjwhZKwbKezCroQbugz5bslKkno9G_gRcEhA0Bw99phPXvB3x_xmojAOB9g2ATcG40wI0H_kaSfYD7uWJx19MTsVNxEOhso-ueE81k_o1tK28CG8b8dHBe3LiEut2IZ3iO0O/s1024/3D_digital_illustration_o_786134816.png.jpg", views: 12500, active: 5400 },
  { title: "Free HTML Code Converter Parse HTML", url: "https://isrartoolzone.blogspot.com/p/free-html-code-converter-parse-html.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4rqg-09AHicyxZEC0KwWvMG9rZzCFw4tJx1XB7cTQre59sjHs7Z7Mps7m_8UYVWNe2GSQzV2kjV0OE136cl9OWQLiyNOn5-YvOR-xTymiQoX1Xyrs-WECTvKU6xMyyIbGVIKg35IbKdSa0i1TUohEzF6igfopjCruX27KPfzH3NG3v1vKnpHd8i1TV1jb/s1024/A_realistic_digital_works_328734446.png.jpg", views: 10600, active: 4600 },
  { title: "Free AdSense Calculator Calculate", url: "https://isrartoolzone.blogspot.com/p/free-adsense-calculator-calculate.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNxHjhaA2KJhepbFfTPOCaQizuc_uWXmzhB4Ncp_e2POJLc1HJZEBmcJjla0Da8PxadmKuVVfwFCZ42ezM0qotLZZjK6JIaFaHJTVbXDQsXO5FHsPtzE78jrPJIacWukn8SR1e4Fc-_QJNHCQu1xvdGtRRFpZoJcR1VCqjR8WzbRgpO30_iFWGhESkkYrC/s1024/3D_digital_artwork_of_a_m_639514542.png.jpg", views: 18100, active: 7800 },
  { title: "Free AdSense Approval Checker", url: "https://isrartoolzone.blogspot.com/p/free-adsense-approval-checker-check.html", thumb: "https://blogger.googleusercontent.com/img/b/R2_vZxl/AVvXsEihKsYErSqjZwWP5cCsPlCxVHTDsJeeUCkyEk_u8Be0TgFptUhYKPH6ZLjCGfsPfMXo2F3CSAavfKba4oQcYI1kOm941lPy0W9alZkqhkkuyvT2mpYhnRFNPymxHjUlT7r6rP3ix2Dh7FxWiMFPmThTNLSq7K5Pgt8mXXZJohaD3S5PlcWmAEgeKolb040V/s1024/A_large_ultra-HD_monitor__107871603.png.jpg", views: 14900, active: 6400 },
  { title: "Free Favicon Generator Create Favicon", url: "https://isrartoolzone.blogspot.com/p/free-favicon-generator-create-favicon.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjr2r0Lk7DcCgMnA-KUrUNGZBDsA4N-EYzcQ3myBfvdPcEn-5287TqCB684Zf6OjESvqPvZIvEKVNLN3tkntJkuSqOVUyuv4G60-6ZATG1ZnPbUXnYRNzl6O7t8J7k_PXd_u7a1XnIbB-MAWbdMD8T8asEM2ef7M6ndOpmendQIqINN_JXG6AN3Xs1e8AFp/s1704/A_modern_3D_office_room_with_g_454643402.png.jpg", views: 11200, active: 4900 },
  { title: "Free Robots.txt Generator Custom", url: "https://isrartoolzone.blogspot.com/p/free-robotstxt-generator-custom.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbbzTgRwcSbVuTrpr0E8fLZPMhHuAicc_Jn5Dw_t0mKVxpE8-UgSOh5tqfg7OBR8YkqcJsmqMinw4znYe2xbocHTqIIqRzs_0u1eMJXaYE2gJ_m-a90l9kA4k9maZOrqi0KhxkH2E-UXw13R3_1NR_3_dv4r7-yHV7TZOmSIZeAECF2j90LywqbyiuMI57/s1024/3D_digital_artwork_of_an__996230162.png.jpg", views: 10100, active: 4400 },
  { title: "Free Meta Description Generator SEO", url: "https://isrartoolzone.blogspot.com/p/free-meta-description-generator-seo.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgaEauCnZqQDvOWXsBTlfz1BloPQlaVhgae59TJmXZHTlZoex9B22CsrsDkYgd7PhyphenhyphenYfl6oq9FjW1CKpU48KjqNZ_GJ_ZsQTcLBa448aG4CRI0oOmVSY3XxtAkmVGgBu9h0RMKPYYn91zwtSqGjxXNI051H7umVye2eLvMmswDk3N0hm8mhy9xuHNvJfHPy/s1024/3D_digital_artwork_of_a_s_474133995.png.jpg", views: 13600, active: 5900 },
  { title: "Free About Us Page Generator", url: "https://isrartoolzone.blogspot.com/p/free-about-us-page-generator-for.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNkQ10P0xR8h2j4y_o2zNiatsIgliVdfA9eIOa_N2z4rEVLhbT9FT3_2grilRRQnx-LlJTF-jaUr5NNAsjM5amhVskbFZfIDI6Szb7dxEBlPmK6iZVs_zZ416cvSxmsDTLuqYnR5MVO-UZr3cKrn7AJFjZANpm3HV47i0HObaHj2G6hvKbXjPTpG68MvHg/s1024/_3D_digital_illustration__965042156.png.jpg", views: 15700, active: 6800 },
  { title: "Free Contact Form Generator", url: "https://isrartoolzone.blogspot.com/p/free-contact-form-generator-for-blogger.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiamUHVbY39aoOxSE-Lh5J3_KdUObEoDO3t3mT3jt_qWkbAsDhPWl532g1wm76ABAR8SELTD9KJtD27ykZYMpwzLYFnAR2YcedMrUOcy-KHB65WOImI3Ypq4TDNikUA1CUspK1cU4_tSM1LRGMQdU4JI7f8mvZ3CbCmsjz98rJ0PcbOLbbg0z8rjqBZe5qL/s1704/A_modern_office_interior_with__349539268.png.jpg", views: 11800, active: 5100 },
  { title: "Free Cookie Banner Generator GDPR", url: "https://isrartoolzone.blogspot.com/p/free-cookie-banner-generator-gdpr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2M16n1tMqpt_dutRY4TU6MgTUF4WLcRZ61vQCgPh853VBRFd0dEbVBjXUKDOnYCNWxa_0RZ96EfH8rA4aR663ZVUsn-XtYCre2pr0UiCPMnmkeVUv7m6X5ejs4Yyaoc-q_Gy59vKwfS4TQfhC2BUzFaxg2YYUzrglAIAMFBJvzsiQc60JhkKPH6w7c1YT/s1704/A_modern_office_interior_with__3988369.png.jpg", views: 9600, active: 4200 },
  { title: "Cookies Policy Generator Free GDPR", url: "https://isrartoolzone.blogspot.com/p/cookies-policy-generator-free-gdpr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW8V7KY31VWMGhYm8Cwkvar5iFGKOVn2qHZWds7jbh91rMAlrHBfFOBV1OmvQ55MpKKnh1yrweEVbwHF5Q9Jz06vJ0Rgp9KwLzTtIJ4irqEzpn1i-Do9Qo1tZxs7L6L8wLnsKVZ_b6LWe6HdFcDRctB2hTQbpLkruSuRyWtaEbM-nAq__RKsekmW8nnMi3/s1704/A_modern_office_interior_scene_870095492.png.jpg", views: 8900, active: 3900 },
  { title: "Free Disclaimer Generator", url: "https://isrartoolzone.blogspot.com/p/free-disclaimer-generator-for-website.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibtOeDV8CmSr_gET5g1z1cJymjILzET_m2j69LA7ZVofN7wN0e6GifvRLaZe_wJeEzJ8QM3iohjN1YHqGmdUWBXV8I76nVF5EWRjsv-LbgYgazGt74oghff3CQoOf-TPsaffFjqMNfHjUpgauGhStRSFqXJawgB1p2GPcMaWVbLixGvWqwivpsMHk8eLqz/s1024/_3D_digital_illustration__910356462.png.jpg", views: 12400, active: 5300 },
  { title: "Free Terms and Conditions Generator", url: "https://isrartoolzone.blogspot.com/p/free-terms-and-conditions-generator-for.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOe7R0H26pDgxcnlcg0xcnGoTXW_u7RuGmle0ik22wu38O1_7AaTflKvpXa2cUT1_bB_FJiVNTB4oVNDjzg4XdeMA8g0ClU85l43jc21YycX269sohezTeGtX2FvcBvFAcIKxzst8ZwwRIfBlvtOWhD2_KGbgA_5SKae_Kitgwt2vyjxXJfJjRs6Ei7yTs/s1024/3D_digital_illustration_o_84667914.png.jpg", views: 13100, active: 5600 },
  { title: "Free Privacy Policy Generator", url: "https://isrartoolzone.blogspot.com/p/free-privacy-policy-generator-for.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_TQGmxZYxWHwqp-eE1Q0kHOmysMvZYEXTKQcwMaM3GmiO7sU_UVVItRp-0xWGzppVWdv6-lySiqOp5wq5T-3WjWll-dHj3FR_nX65hspPCJNKvrHv-f76_u97Th5u7m_iIwSAay8bKKOzAiFbWkLvYP426fZ2-snGvv58YW-9cyo3LopZ83bY8N678dE/s1024/_3D_digital_illustration__223292339.png.jpg", views: 16800, active: 7200 }
];

const relatedBatchSize = 4;
let relatedCurrentPage = parseInt(localStorage.getItem('israr_vg_rel_page') || '1', 10);
let relatedMode = localStorage.getItem('israr_vg_rel_mode') || 'recent';
let relatedSearchResults = allRelatedTools.slice();

function getRelatedViews(){try{return JSON.parse(localStorage.getItem('israr_lab_related_views')||'{}')}catch(e){return {}}}
function getRelatedActivity(){try{return JSON.parse(localStorage.getItem('israr_lab_related_activity')||'[]')}catch(e){return []}}
function trackRelatedVisit(tool){
  try {
    const views=getRelatedViews(); views[tool.url]=(Number(views[tool.url])||0)+1;
    localStorage.setItem('israr_lab_related_views',JSON.stringify(views));
    const activity=getRelatedActivity(); activity.unshift({title:tool.title,url:tool.url,time:Date.now()});
    localStorage.setItem('israr_lab_related_activity',JSON.stringify(activity.slice(0,100)));
  } catch(e) {}
}

function saveSearchHistory(query) {
  if(!query || query.trim() === "") return;
  let history = [];
  try { history = JSON.parse(localStorage.getItem('israr_vg_search_history') || '[]'); } catch(e){ history = []; }
  if(!history.includes(query)) {
    history.unshift(query);
    if(history.length > 10) history.pop();
    localStorage.setItem('israr_vg_search_history', JSON.stringify(history));
  }
}

function showSearchSuggestions() {
  const box = document.getElementById('searchSuggestionsBox');
  let history = [];
  try { history = JSON.parse(localStorage.getItem('israr_vg_search_history') || '[]'); } catch(e){ history = []; }
  if(history.length === 0) { box.style.display = 'none'; return; }
  
  box.innerHTML = '';
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'search-suggestion-item';
    div.textContent = item;
    div.onclick = function() {
      document.getElementById('relatedSearchInput').value = item;
      box.style.display = 'none';
      filterRelatedTools(true);
    };
    box.appendChild(div);
  });
  box.style.display = 'block';
}

document.addEventListener('click', function(e) {
  const box = document.getElementById('searchSuggestionsBox');
  const input = document.getElementById('relatedSearchInput');
  if(box && input && !box.contains(e.target) && e.target !== input) {
    box.style.display = 'none';
  }
});

function highlightRelatedTitle(title, query) {
  const safeTitle = escapeHtml(title);
  if (!query) return safeTitle;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try { return safeTitle.replace(new RegExp('(' + escapedQuery + ')', 'ig'), '<mark>$1</mark>'); }
  catch (e) { return safeTitle; }
}

function getSortedRelatedTools(list){
  const views = getRelatedViews();
  if(relatedMode === 'top' || relatedMode === 'ranking') {
    return list.slice().sort((a, b) => (Number(views[b.url]) || b.views || 0) - (Number(views[a.url]) || a.views || 0));
  }
  return list.slice();
}

function filterRelatedTools(resetPage = false) {
  const input = document.getElementById('relatedSearchInput');
  const q = (input ? input.value : '').trim().toLowerCase();
  if(resetPage) relatedCurrentPage = 1;
  
  if(q) saveSearchHistory(q);

  const loader = document.getElementById('relatedLoader');
  if(loader) loader.style.display = 'block';

  setTimeout(() => {
    relatedSearchResults = allRelatedTools.filter(t => t.title.toLowerCase().includes(q));
    
    localStorage.setItem('israr_vg_rel_page', relatedCurrentPage);
    localStorage.setItem('israr_vg_rel_mode', relatedMode);

    if(loader) loader.style.display = 'none';

    if(relatedMode === 'activity') { 
      renderRelatedActivity(); 
      renderRelatedPagination(0); 
      return; 
    }
    
    const sorted = getSortedRelatedTools(relatedSearchResults);
    const totalPages = Math.max(1, Math.ceil(sorted.length / relatedBatchSize));
    relatedCurrentPage = Math.min(relatedCurrentPage, totalPages);
    const visible = sorted.slice((relatedCurrentPage - 1) * relatedBatchSize, relatedCurrentPage * relatedBatchSize);
    renderRelatedGrid(visible, q);
    
    const count = document.getElementById('relatedSearchCount');
    if(count) count.textContent = q ? `${relatedSearchResults.length} tool${relatedSearchResults.length === 1 ? '' : 's'} found` : `Showing ${visible.length} of ${sorted.length} tools`;
    renderRelatedPagination(totalPages);
  }, 500); // 2 second delay loader on pagination/search
}

function renderRelatedGrid(tools, query = '') {
  const grid = document.getElementById('relatedToolsGrid');
  grid.innerHTML = '';
  if(!tools.length) {
    grid.innerHTML = '<div style="color:var(--muted);font-size:12px;grid-column:1/-1;text-align:center;padding:18px;">No tools found on this page.</div>';
    return;
  }
  tools.forEach((t, idx) => {
    const card = document.createElement('a');
    card.className = 'related-card';
    card.href = t.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.addEventListener('click', () => trackRelatedVisit(t));

    const image = document.createElement('img');
    image.className = 'related-card-image';
    image.alt = t.title + ' image';
    image.loading = 'lazy';
    image.src = t.thumb || 'https://s.wordpress.com/mshots/v1/' + encodeURIComponent(t.url) + '?w=900';
    image.onerror = function(){this.onerror=null;this.src='https://www.google.com/s2/favicons?domain='+encodeURIComponent(new URL(t.url).hostname)+'&sz=256';this.style.objectFit='contain';this.style.padding='22px';};

    const title = document.createElement('div');
    title.className = 'related-card-title';
    title.innerHTML = highlightRelatedTitle(t.title, query);

    const stats = document.createElement('div');
    stats.className = 'related-card-stats';
    const uniqueId = `tool_stat_${idx}_${Math.floor(Math.random()*1000)}`;
    stats.id = uniqueId;
    stats.innerHTML = `
      <div><span class="live-dot-orange"></span>New user: <b id="new_${uniqueId}">${t.views.toLocaleString()}</b></div>
      <div><span class="live-dot-green"></span>Active user: <b id="act_${uniqueId}">${t.active.toLocaleString()}</b></div>
    `;

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(stats);
    grid.appendChild(card);
  });
}

// Live stats background updating loop (New user: 12k to 100k, Active user: 5k to 15k fluctuations)
setInterval(() => {
  allRelatedTools.forEach((t) => {
    if(t.views < 100000) {
      t.views += Math.floor(Math.random() * 45) + 15;
      if(t.views > 100000) t.views = 100000;
    }
    let delta = Math.floor(Math.random() * 401) - 200;
    t.active = Math.max(5000, Math.min(15000, t.active + delta));
  });

  document.querySelectorAll('.related-card-stats').forEach(statBox => {
    const newEl = statBox.querySelector('[id^="new_"]');
    const actEl = statBox.querySelector('[id^="act_"]');
    if(newEl && actEl) {
      let curNew = parseInt(newEl.textContent.replace(/,/g,''), 10);
      let curAct = parseInt(actEl.textContent.replace(/,/g,''), 10);
      if(!isNaN(curNew) && curNew < 100000) curNew += Math.floor(Math.random() * 12) + 2;
      if(!isNaN(curAct)) {
        let diff = Math.floor(Math.random() * 301) - 150;
        curAct = Math.max(5000, Math.min(15000, curAct + diff));
      }
      newEl.textContent = curNew.toLocaleString();
      actEl.textContent = curAct.toLocaleString();
    }
  });
}, 900);

function renderRelatedPagination(totalPages){
  const box=document.getElementById('israr-lab-related-pagination'); if(!box)return; box.innerHTML='';
  if(relatedMode==='activity') return;
  const addBtn=(label,page,disabled,active)=>{const b=document.createElement('button');b.type='button';b.className='israr-lab-related-page-btn'+(active?' active':'');b.textContent=label;b.disabled=!!disabled;b.style.opacity=disabled?'.45':'1';b.onclick=()=>{relatedCurrentPage=page;filterRelatedTools(false);document.getElementById('israr-lab-related-section').scrollIntoView({behavior:'smooth',block:'start'});};box.appendChild(b);};
  addBtn('Prev',Math.max(1,relatedCurrentPage-1),relatedCurrentPage===1,false);
  for(let i=1;i<=totalPages;i++) addBtn(String(i),i,false,i===relatedCurrentPage);
  addBtn('Next',Math.min(totalPages,relatedCurrentPage+1),relatedCurrentPage===totalPages,false);
}

function renderRelatedActivity(){
  const grid=document.getElementById('relatedToolsGrid'); 
  const count=document.getElementById('relatedSearchCount');
  const searchEl=document.getElementById('relatedSearchInput'); 
  const q=(searchEl?searchEl.value:'').trim().toLowerCase(); 
  const activity=getRelatedActivity().filter(a=>String(a.title||'').toLowerCase().includes(q));
  
  if(count) count.textContent=`Your activity history records: ${activity.length}`;
  if(!activity.length){
    grid.innerHTML='<div style="color:var(--muted);font-size:12px;grid-column:1/-1;text-align:center;padding:18px;">अभी related tools पर कोई visit record नहीं हुई है।</div>';
    return;
  }
  
  let html = '<div class="israr-lab-activity-list">';
  activity.slice(0, 40).forEach(a => {
    const timeStr = new Date(a.time).toLocaleString();
    html += `
      <a class="israr-lab-activity-row" href="${a.url}" target="_blank" rel="noopener noreferrer">
        <div class="act-title">${escapeHtml(a.title)}</div>
        <div class="act-url">${escapeHtml(a.url)}</div>
        <div class="act-time">🕒 ${timeStr}</div>
      </a>
    `;
  });
  html += '</div>';
  grid.innerHTML = html;
}

function setRelatedMode(mode){
  relatedMode=mode; 
  relatedCurrentPage=1; 
  localStorage.setItem('israr_vg_rel_mode', mode);
  localStorage.setItem('israr_vg_rel_page', 1);
  document.querySelectorAll('#israr-lab-related-tabs .israr-lab-related-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  filterRelatedTools(false);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',() => {
    document.querySelectorAll('#israr-lab-related-tabs .israr-lab-related-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===relatedMode));
    filterRelatedTools(false);
  });
} else {
  document.querySelectorAll('#israr-lab-related-tabs .israr-lab-related-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===relatedMode));
  filterRelatedTools(false);
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

