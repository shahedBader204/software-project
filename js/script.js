 const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const header = item.querySelector(".faq-header");
      const body = item.querySelector(".faq-body");
      const icon = item.querySelector(".faq-icon");

      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        if (isOpen) {
          item.classList.remove("open");
          body.style.maxHeight = null;
          icon.textContent = "+";
        } else {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
          icon.textContent = "−"; // minus
        }
      });
    });
    // ===== AI Lecture Summarizer (Step switch) =====
const sumFile = document.getElementById("sumFile");
const sumStep1 = document.getElementById("sumStep1");
const sumStep2 = document.getElementById("sumStep2");

const sumUploadBtn = document.getElementById("sumUploadBtn");
const sumSelectAnother = document.getElementById("sumSelectAnother");
const sumRemoveBtn = document.getElementById("sumRemoveBtn");
const sumContinueBtn = document.getElementById("sumContinueBtn");

const sumFileName = document.getElementById("sumFileName");
const sumFileSize = document.getElementById("sumFileSize");

let CURRENT_FILE = null;

function formatMB(bytes){
  const mb = bytes / (1024 * 1024);
  return (mb < 0.1 ? mb.toFixed(2) : mb.toFixed(1)) + " MB";
}

function showStep2(file){
  CURRENT_FILE = file;
  sumFileName.textContent = file.name;
  sumFileSize.textContent = formatMB(file.size);

  sumStep1.style.display = "none";
  sumStep2.style.display = "flex";
}

function resetSteps(){
  CURRENT_FILE = null;
  sumFile.value = "";
  sumStep2.style.display = "none";
  sumStep1.style.display = "block";
}

sumUploadBtn?.addEventListener("click", () => sumFile.click());
sumSelectAnother?.addEventListener("click", (e) => {
  e.preventDefault();
  sumFile.click();
});
sumRemoveBtn?.addEventListener("click", () => resetSteps());

sumFile?.addEventListener("change", () => {
  const file = sumFile.files?.[0];
  if(!file) return;
  showStep2(file);
});


// ===== IndexedDB helper (store audio file before moving to app.html) =====
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

async function saveCurrentFileToDB(file){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");

    // نخزن blob + metadata
    store.put(
      { blob: file, name: file.name, type: file.type, size: file.size, savedAt: Date.now() },
      "current"
    );

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

sumContinueBtn?.addEventListener("click", async () => {
  if(!CURRENT_FILE){
    alert("Please select an audio/video file first.");
    return;
  }

  // خزّني الملف ثم روحي لصفحة app
  try{
    sumContinueBtn.disabled = true;
    sumContinueBtn.textContent = "Loading...";
    await saveCurrentFileToDB(CURRENT_FILE);
    window.location.href = "./app.html";
  }catch(err){
    console.error(err);
    alert("Could not save file. Try a smaller file or another browser.");
  }finally{
    sumContinueBtn.disabled = false;
    sumContinueBtn.textContent = "Continue in app";
  }
});
