import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
const { auth, db } = window.__APP__;
import { CHECKLIST, ANNEX_1_3, ANNEX_4 } from "./data/schema.js";

// --- Helpers
const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));

function optionHtml(val, label){ return `<option value="${val}">${label}</option>`; }

// --- State
let state = {
  hospitalName: "",
  hospitalAddress: "",
  visitDate: "",
  sections: {},   // e.g., { "A-0": {value:"YES", remark:"..."}, ... }
  annex13: {},    // similar keying
  annex4: {}
};

// Pre-populate state keys
function initState(){
  CHECKLIST.forEach(sec=>{
    sec.items.forEach((_, idx)=>{
      state.sections[`${sec.code}-${idx}`] = { value:"", remark:"" };
    });
  });
  ANNEX_1_3.forEach((blk, bidx)=>{
    blk.items.forEach((_, idx)=>{
      state.annex13[`B${bidx}-${idx}`] = { value:"", remark:"" };
    });
  });
  ANNEX_4.forEach((_, idx)=>{
    state.annex4[`A4-${idx}`] = { value:"", remark:"" };
  });
}

initState();

// --- Renderers
function renderChecklist(){
  const mount = el("#tab-checklist");
  mount.innerHTML = "";
  CHECKLIST.forEach(section=>{
    const box = document.createElement("div");
    box.className = "section";
    box.innerHTML = `
      <div class="section-head">
        <div class="section-title">${section.code}. ${section.title}</div>
        <div class="badge">Items: ${section.items.length}</div>
      </div>
      <div class="section-body"></div>
    `;
    const body = box.querySelector(".section-body");
    section.items.forEach((text, idx)=>{
      const key = `${section.code}-${idx}`;
      const row = document.createElement("div");
      row.className = "item";
      row.innerHTML = `
        <div class="label">${text}</div>
        <div class="controls">
          <select data-key="${key}">
            ${optionHtml("", "Select")}
            ${optionHtml("YES","YES")}
            ${optionHtml("NO","NO")}
          </select>
        </div>
        <input type="text" placeholder="Remarks (optional)" data-remark="${key}" />
      `;
      body.appendChild(row);
    });
    mount.appendChild(box);
  });
}

function renderAnnex13(){
  const mount = el("#tab-annex-1-3");
  mount.innerHTML = "";
  ANNEX_1_3.forEach((blk, bidx)=>{
    const box = document.createElement("div");
    box.className = "section";
    box.innerHTML = `
      <div class="section-head">
        <div class="section-title">${blk.title}</div>
        <div class="badge">Items: ${blk.items.length}</div>
      </div>
      <div class="section-body"></div>
    `;
    const body = box.querySelector(".section-body");
    blk.items.forEach((text, idx)=>{
      const key = `B${bidx}-${idx}`;
      const row = document.createElement("div");
      row.className = "item";
      row.innerHTML = `
        <div class="label">${text}</div>
        <div class="controls">
          <select data-key="${key}">
            ${optionHtml("", "Select")}
            ${optionHtml("YES","YES")}
            ${optionHtml("NO","NO")}
          </select>
        </div>
        <input type="text" placeholder="Remarks (optional)" data-remark="${key}" />
      `;
      body.appendChild(row);
    });
    mount.appendChild(box);
  });
}

function renderAnnex4(){
  const mount = el("#tab-annex-4");
  mount.innerHTML = "";
  const box = document.createElement("div");
  box.className = "section";
  box.innerHTML = `
    <div class="section-head">
      <div class="section-title">Annexure 4 – Content of Medical Record</div>
      <div class="badge">Items: ${ANNEX_4.length}</div>
    </div>
    <div class="section-body"></div>
  `;
  const body = box.querySelector(".section-body");
  ANNEX_4.forEach((text, idx)=>{
    const key = `A4-${idx}`;
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div class="label">${text}</div>
      <div class="controls">
        <select data-key="${key}">
          ${optionHtml("", "Select")}
          ${optionHtml("YES","YES")}
          ${optionHtml("NO","NO")}
        </select>
      </div>
      <input type="text" placeholder="Remarks (optional)" data-remark="${key}" />
    `;
    body.appendChild(row);
  });
  mount.appendChild(box);
}

function refreshNonCompliance(){
  const mount = el("#noncompliance-list");
  const collect = [];

  // Checklist
  CHECKLIST.forEach((sec, sidx) => {
    sec.items.forEach((text, idx)=>{
      const key = `${sec.code}-${idx}`;
      if(state.sections[key]?.value === "NO"){
        collect.push({ section:`${sec.code}. ${sec.title}`, item:text, key });
      }
    });
  });

  // Annex 1-3
  ANNEX_1_3.forEach((blk, bidx)=>{
    blk.items.forEach((text, idx)=>{
      const key = `B${bidx}-${idx}`;
      if(state.annex13[key]?.value === "NO"){
        collect.push({ section: blk.title, item:text, key });
      }
    });
  });

  // Annex 4
  ANNEX_4.forEach((text, idx)=>{
    const key = `A4-${idx}`;
    if(state.annex4[key]?.value === "NO"){
      collect.push({ section: "Annexure 4 – Content of Medical Record", item:text, key });
    }
  });

  mount.innerHTML = "";
  if(collect.length === 0){
    mount.innerHTML = '<p class="muted">No non‑compliance marked yet.</p>';
    return;
  }

  const frag = document.createDocumentFragment();
  collect.forEach((row, i)=>{
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="label">${i+1}. <strong>${row.item}</strong><br/><span class="muted">${row.section}</span></div>
      <div class="badge no">NO</div>
      <input type="text" value="${(state.sections[row.key]?.remark || state.annex13[row.key]?.remark || state.annex4[row.key]?.remark || "")}" disabled />
    `;
    frag.appendChild(div);
  });
  mount.appendChild(frag);
}

// --- Wiring selections
function wireInputs(){
  // checklist
  els("#tab-checklist select[data-key]").forEach(sel=>{
    sel.addEventListener("change", e=>{
      const key = e.target.dataset.key;
      state.sections[key].value = e.target.value;
      refreshNonCompliance();
    });
  });
  els("#tab-checklist input[data-remark]").forEach(inp=>{
    inp.addEventListener("change", e=>{
      const key = e.target.dataset.remark;
      state.sections[key].remark = e.target.value;
      refreshNonCompliance();
    });
  });

  // annex 1-3
  els("#tab-annex-1-3 select[data-key]").forEach(sel=>{
    sel.addEventListener("change", e=>{
      const key = e.target.dataset.key;
      state.annex13[key].value = e.target.value;
      refreshNonCompliance();
    });
  });
  els("#tab-annex-1-3 input[data-remark]").forEach(inp=>{
    inp.addEventListener("change", e=>{
      const key = e.target.dataset.remark;
      state.annex13[key].remark = e.target.value;
      refreshNonCompliance();
    });
  });

  // annex 4
  els("#tab-annex-4 select[data-key]").forEach(sel=>{
    sel.addEventListener("change", e=>{
      const key = e.target.dataset.key;
      state.annex4[key].value = e.target.value;
      refreshNonCompliance();
    });
  });
  els("#tab-annex-4 input[data-remark]").forEach(inp=>{
    inp.addEventListener("change", e=>{
      const key = e.target.dataset.remark;
      state.annex4[key].remark = e.target.value;
      refreshNonCompliance();
    });
  });

  // toolbar fields
  el("#hospital-name").addEventListener("input", e=> state.hospitalName = e.target.value );
  el("#hospital-address").addEventListener("input", e=> state.hospitalAddress = e.target.value );
  el("#visit-date").addEventListener("change", e=> state.visitDate = e.target.value );

  // Save
  el("#btn-save").addEventListener("click", saveAssessment);

  // Export PDF
  el("#btn-export-pdf").addEventListener("click", exportSummaryPDF);

  // Export CSV
  el("#btn-export-noncompliance").addEventListener("click", exportNonComplianceCSV);
}

// --- Tabs
function wireTabs(){
  els(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      els(".tab").forEach(b => b.classList.remove("active"));
      els(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      el(`#tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

// --- Firestore persistence (per‑assessment doc)
async function saveAssessment(){
  if(!auth.currentUser){ return; }
  const status = el("#save-status");

  const payload = {
    owner: auth.currentUser.uid,
    ownerEmail: auth.currentUser.email,
    hospitalName: state.hospitalName || el("#hospital-name").value.trim(),
    hospitalAddress: state.hospitalAddress || el("#hospital-address").value.trim(),
    visitDate: state.visitDate || el("#visit-date").value || null,
    sections: state.sections,
    annex13: state.annex13,
    annex4: state.annex4,
    savedAt: new Date().toISOString()
  };

  try{
    const ref = collection(getFirestore(), "assessments");
    await addDoc(ref, payload);
    status.textContent = "Saved ✓";
    setTimeout(()=> status.textContent = "", 2500);
  }catch(e){
    status.textContent = "Save failed. Check connection or permissions.";
    setTimeout(()=> status.textContent = "", 4000);
  }
}

// --- Export: Summary PDF
function exportSummaryPDF(){
  const { jsPDF } = window.jspdf || {};
  if(!jsPDF){ alert("PDF library not loaded, please retry."); return; }
  const doc = new jsPDF({ unit:"pt", compress:true });

  const hospital = (state.hospitalName || el("#hospital-name").value || "").trim();
  const address = (state.hospitalAddress || el("#hospital-address").value || "").trim();
  const visitDate = (state.visitDate || el("#visit-date").value || "").trim();

  const title = "Hospital Assessment – Summary";
  doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.text(title, 40, 40);
  doc.setFontSize(10); doc.setFont("helvetica","normal");
  doc.text(`Hospital: ${hospital || "-"}`, 40, 62);
  doc.text(`Address: ${address || "-"}`, 40, 78);
  doc.text(`Date(s): ${visitDate || "-"}`, 40, 94);

  // Counts
  let total=0, yes=0, no=0;
  function tallyFrom(obj){
    Object.values(obj).forEach(v=>{
      if(!v || !v.value) return;
      total++; if(v.value==="YES") yes++; else if(v.value==="NO") no++;
    });
  }
  tallyFrom(state.sections); tallyFrom(state.annex13); tallyFrom(state.annex4);

  doc.text(`Responses: YES ${yes} • NO ${no} • Total marked ${total}`, 40, 120);

  // Table: non‑compliance
  const rows = [];
  // Checklist
  CHECKLIST.forEach(section=>{
    section.items.forEach((text, idx)=>{
      const key = `${section.code}-${idx}`;
      const v = state.sections[key];
      if(v?.value === "NO"){
        rows.push([`${section.code}. ${section.title}`, text, v.remark || ""]);
      }
    });
  });
  // Annex 1-3
  ANNEX_1_3.forEach((blk, bidx)=>{
    blk.items.forEach((text, idx)=>{
      const key = `B${bidx}-${idx}`;
      const v = state.annex13[key];
      if(v?.value === "NO"){
        rows.push([blk.title, text, v.remark || ""]);
      }
    });
  });
  // Annex 4
  ANNEX_4.forEach((text, idx)=>{
    const key = `A4-${idx}`;
    const v = state.annex4[key];
    if(v?.value === "NO"){
      rows.push(["Annexure 4 – Content of Medical Record", text, v.remark || ""]);
    }
  });

  const startY = 150;
  if(rows.length){
    doc.autoTable({
      head:[["Section", "Item (marked NO)", "Remarks"]],
      body: rows,
      startY,
      styles:{ fontSize:9, cellPadding:4, overflow:"linebreak" },
      headStyles:{ fillColor:[20,184,166] }
    });
  }else{
    doc.text("No non‑compliance recorded.", 40, startY);
  }

  const name = `Assessment_Summary_${(hospital||"").replace(/\W+/g,"_")}_${Date.now()}.pdf`;
  doc.save(name);
}

// --- Export: Non‑Compliance CSV
function exportNonComplianceCSV(){
  const lines = [["Section","Item","Remarks"]];
  // Checklist
  CHECKLIST.forEach(section=>{
    section.items.forEach((text, idx)=>{
      const key = `${section.code}-${idx}`;
      const v = state.sections[key];
      if(v?.value === "NO"){
        lines.push([`${section.code}. ${section.title}`, text, v.remark || ""]);
      }
    });
  });
  // Annex 1‑3
  ANNEX_1_3.forEach((blk, bidx)=>{
    blk.items.forEach((text, idx)=>{
      const key = `B${bidx}-${idx}`;
      const v = state.annex13[key];
      if(v?.value === "NO"){
        lines.push([blk.title, text, v.remark || ""]);
      }
    });
  });
  // Annex 4
  ANNEX_4.forEach((text, idx)=>{
    const key = `A4-${idx}`;
    const v = state.annex4[key];
    if(v?.value === "NO"){
      lines.push(["Annexure 4 – Content of Medical Record", text, v.remark || ""]);
    }
  });

  const csv = lines.map(row => row.map(v => `"${(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "NonCompliance.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// --- Boot
function boot(){
  renderChecklist();
  renderAnnex13();
  renderAnnex4();
  wireInputs();
  wireTabs();
  refreshNonCompliance();
}
boot();
