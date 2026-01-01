// ===== IndexedDB read =====
function openDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("lectureDB", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if(!db.objectStoreNames.contains("files")){
        db.createObjectStore("files");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readCurrentFileFromDB(){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const getReq = store.get("current");
    getReq.onsuccess = () => resolve(getReq.result || null);
    getReq.onerror = () => reject(getReq.error);
  });
}

// ===== UI refs =====
const audioPlayer = document.getElementById("audioPlayer");
const appTitle = document.getElementById("appTitle");
const appDate = document.getElementById("appDate");
const transcript = document.getElementById("transcript");

const findText = document.getElementById("findText");
const replaceText = document.getElementById("replaceText");
const replaceOnce = document.getElementById("replaceOnce");
const replaceAll = document.getElementById("replaceAll");
const revertBtn = document.getElementById("revertBtn");

const exportBtn = document.getElementById("exportBtn");
const notesBox = document.getElementById("notesBox");

const playBtn = document.getElementById("playBtn");
let ORIGINAL_TRANSCRIPT_HTML = "";

// ===== load file =====
(async function init(){
  const data = await readCurrentFileFromDB();

  if(!data){
    appTitle.textContent = "No file selected";
    return;
  }

  // date
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yyyy = d.getFullYear();
  appDate.textContent = `${dd}/${mm}/${yyyy}`;

  // title = file name without extension (optional)
  appTitle.textContent = data.name?.replace(/\.[^/.]+$/, "") || "Untitled";

  // audio src
  const url = URL.createObjectURL(data.blob);
  audioPlayer.src = url;

  // save original transcript for revert
  ORIGINAL_TRANSCRIPT_HTML = transcript.innerHTML;
})();

// ===== play/pause button (top icons) =====
playBtn?.addEventListener("click", () => {
  if(audioPlayer.paused){
    audioPlayer.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }else{
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});

// ===== Search & Replace =====
function getPlainText(){
  return transcript.innerText || "";
}

replaceOnce?.addEventListener("click", () => {
  const f = findText.value.trim();
  const r = replaceText.value;
  if(f.length < 3) return;

  const html = transcript.innerHTML;
  const idx = html.toLowerCase().indexOf(f.toLowerCase());
  if(idx === -1) return;

  // replace first occurrence (simple approach)
  const before = html.slice(0, idx);
  const after = html.slice(idx + f.length);
  transcript.innerHTML = before + r + after;
});

replaceAll?.addEventListener("click", () => {
  const f = findText.value.trim();
  const r = replaceText.value;
  if(f.length < 3) return;

  const re = new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  transcript.innerHTML = transcript.innerHTML.replace(re, r);
});

revertBtn?.addEventListener("click", () => {
  transcript.innerHTML = ORIGINAL_TRANSCRIPT_HTML;
});

// ===== Export =====
exportBtn?.addEventListener("click", () => {
  const title = appTitle.textContent || "AI Summary";
  const txt =
`TITLE: ${title}

TRANSCRIPT:
${getPlainText()}

NOTES:
${notesBox.value || ""}`;

  const blob = new Blob([txt], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
});
