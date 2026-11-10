// ===== פרטי קשר: לעדכן כאן בלבד =====
const CONFIG = {
  whatsapp: "972500000000",          // מספר וואטסאפ עסקי בפורמט בינלאומי, בלי + ובלי 0 מוביל
  email: "hello@clearbase.co.il",    // מייל עסקי
};
// =====================================

const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#year").textContent = new Date().getFullYear();
const WA_TEXT = encodeURIComponent("היי, אשמח לשמוע פרטים");
document.querySelectorAll(".wa-link, #wa-link").forEach((a) => { a.href = `https://wa.me/${CONFIG.whatsapp}?text=${WA_TEXT}`; });
document.querySelectorAll(".mail-text").forEach((el) => { el.textContent = CONFIG.email; });
document.querySelectorAll("#mail-link, .mail-link").forEach((a) => { a.href = `mailto:${CONFIG.email}`; });

// תפריט מובייל
const toggle = $(".nav-toggle");
const menu = $("#menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

// חלון הדוגמאות: לשוניות שמתחלפות לבד עד שנוגעים בהן
const tabs = [...document.querySelectorAll(".tabs [role=tab]")];
let current = 0;
function selectTab(i) {
  current = i;
  tabs.forEach((t, n) => {
    const on = n === i;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
let rotate = reduced || !tabs.length ? null : setInterval(() => selectTab((current + 1) % tabs.length), 4500);
const stopRotate = () => { clearInterval(rotate); rotate = null; };
tabs.forEach((t, i) => {
  t.addEventListener("click", () => { stopRotate(); selectTab(i); });
  t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    stopRotate();
    const next = (i + (e.key === "ArrowLeft" ? 1 : -1) + tabs.length) % tabs.length; // RTL
    selectTab(next);
    tabs[next].focus();
  });
});
$(".show")?.addEventListener("pointerenter", stopRotate);

// הדמיית AI: קריאת חשבונית
const FIELDS = ["supplier", "num", "date", "total"];
const demo = $("#ai-demo");
const status = $("#ai-status");
const values = demo ? Object.fromEntries(FIELDS.map((f) => [f, demo.querySelector(`[data-o="${f}"]`).textContent])) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let playing = false;
async function playDemo() {
  if (playing) return;
  playing = true;
  FIELDS.forEach((f) => { demo.querySelector(`[data-o="${f}"]`).textContent = ""; });
  status.textContent = "קורא את המסמך…";
  await sleep(500);
  for (const f of FIELDS) {
    const src = demo.querySelector(`[data-f="${f}"]`);
    const out = demo.querySelector(`[data-o="${f}"]`);
    src.classList.add("scan");
    for (let i = 1; i <= values[f].length; i++) {
      out.textContent = values[f].slice(0, i);
      await sleep(22);
    }
    await sleep(350);
    src.classList.remove("scan");
  }
  status.textContent = "נשמר · שויך לספק קיים ✓";
  playing = false;
}
$("#ai-replay")?.addEventListener("click", playDemo);
if (demo && !reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { io.disconnect(); playDemo(); }
  }, { threshold: 0.6 });
  io.observe(demo);
}

// טופס: פותח וואטסאפ עם הודעה מוכנה (בלי שרת)
const form = $("#lead");
const note = $("#form-note");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  let firstBad = null;
  for (const el of form.querySelectorAll("[required]")) {
    const bad = !el.value.trim();
    el.classList.toggle("invalid", bad);
    if (bad && !firstBad) firstBad = el;
  }
  if (firstBad) {
    note.textContent = "חסרים פרטים: שם, שם העסק וטלפון.";
    firstBad.focus();
    return;
  }
  note.textContent = "";
  const lines = [
    `היי, אני ${data.name.trim()} מ${data.company.trim()}.`,
    data.msg.trim() ? `מה שמציק לנו: ${data.msg.trim()}` : "",
    `טלפון לחזרה: ${data.phone.trim()}`,
    "אשמח לשיחת היכרות.",
  ].filter(Boolean);
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});
