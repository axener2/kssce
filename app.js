
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
const { auth, db } = window.__APP__;

function el(sel){ return document.querySelector(sel); }

// sample checklist rendering
el("#checklist").innerHTML = "<h3>Main Checklist</h3><p>Items go here...</p>";
el("#annex1").innerHTML = "<h3>Annex 1-3</h3>";
el("#annex4").innerHTML = "<h3>Annex 4</h3>";
el("#noncompliance").innerHTML = "<h3>Non-Compliance</h3>";

async function saveAssessment(){
  const status = el("#save-status");
  if(!auth.currentUser){ status.textContent="Not logged in"; return; }
  try{
    await addDoc(collection(db,"assessments"),{ owner:auth.currentUser.uid, ts:Date.now() });
    status.textContent="Saved!";
  }catch(e){ status.textContent=e.message; }
}
el("#save").addEventListener("click", saveAssessment);

document.querySelectorAll(".tablink").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
    document.getElementById(btn.dataset.tab).classList.remove("hidden");
  });
});
