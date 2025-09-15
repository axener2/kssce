import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
const { auth, db } = window.__APP__ || {};
import { CHECKLIST, ANNEX_1_3, ANNEX_4 } from "./data/schema.js";

const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));

let state = { hospitalName:"", hospitalAddress:"", visitDate:"", sections:{}, annex13:{}, annex4:{} };

function initState(){
  CHECKLIST.forEach(s=>s.items.forEach((_,i)=> state.sections[`${s.code}-${i}`]={value:"",remark:""}));
  ANNEX_1_3.forEach((b,bi)=> b.items.forEach((_,i)=> state.annex13[`B${bi}-${i}`]={value:"",remark:""}));
  ANNEX_4.forEach((_,i)=> state.annex4[`A4-${i}`]={value:"",remark:""});
}
initState();

function optionHtml(v,l){ return `<option value="${v}">${l}</option>`; }

function renderChecklist(){
  const mount = el("#tab-checklist"); mount.innerHTML = "";
  CHECKLIST.forEach(section=>{
    const box = document.createElement("div");
    box.className="section";
    box.innerHTML = `<div class="section-head"><div class="section-title">${section.code}. ${section.title}</div><div class="muted">Items: ${section.items.length}</div></div><div class="section-body"></div>`;
    const body = box.querySelector(".section-body");
    section.items.forEach((text,idx)=>{
      const key = `${section.code}-${idx}`;
      const row = document.createElement("div"); row.className="item";
      row.innerHTML = `<div class="label">${text}</div><div class="controls"><select data-key="${key}">${optionHtml("","Select")}${optionHtml("YES","YES")}${optionHtml("NO","NO")}</select></div><input type="text" placeholder="Remarks (optional)" data-remark="${key}" />`;
      body.appendChild(row);
    });
    mount.appendChild(box);
  });
}
function renderAnnex13(){
  const mount = el("#tab-annex-1-3"); mount.innerHTML = "";
  ANNEX_1_3.forEach((blk,bi)=>{
    const box = document.createElement("div"); box.className="section";
    box.innerHTML = `<div class="section-head"><div class="section-title">${blk.title}</div><div class="muted">Items: ${blk.items.length}</div></div><div class="section-body"></div>`;
    const body = box.querySelector(".section-body");
    blk.items.forEach((text,idx)=>{
      const key = `B${bi}-${idx}`;
      const row = document.createElement("div"); row.className="item";
      row.innerHTML = `<div class="label">${text}</div><div class="controls"><select data-key="${key}">${optionHtml("","Select")}${optionHtml("YES","YES")}${optionHtml("NO","NO")}</select></div><input type="text" placeholder="Remarks (optional)" data-remark="${key}" />`;
      body.appendChild(row);
    });
    mount.appendChild(box);
  });
}
function renderAnnex4(){
  const mount = el("#tab-annex-4"); mount.innerHTML = "";
  const box = document.createElement("div"); box.className="section";
  box.innerHTML = `<div class="section-head"><div class="section-title">Annexure 4 – Content of Medical Record</div><div class="muted">Items: ${ANNEX_4.length}</div></div><div class="section-body"></div>`;
  const body = box.querySelector(".section-body");
  ANNEX_4.forEach((text,idx)=>{
    const key = `A4-${idx}`;
    const row = document.createElement("div"); row.className="item";
    row.innerHTML = `<div class="label">${text}</div><div class="controls"><select data-key="${key}">${optionHtml("","Select")}${optionHtml("YES","YES")}${optionHtml("NO","NO")}</select></div><input type="text" placeholder="Remarks (optional)" data-remark="${key}" />`;
    body.appendChild(row);
  });
  mount.appendChild(box);
}
function refreshNonCompliance(){
  const mount = el("#noncompliance-list"); const rows = [];
  CHECKLIST.forEach(sec=>sec.items.forEach((text,idx)=>{ const k=`${sec.code}-${idx}`; if(state.sections[k]?.value==="NO") rows.push({section:`${sec.code}. ${sec.title}`, item:text, remark:state.sections[k].remark||""}); }));
  ANNEX_1_3.forEach((blk,bi)=>blk.items.forEach((text,idx)=>{ const k=`B${bi}-${idx}`; if(state.annex13[k]?.value==="NO") rows.push({section:blk.title, item:text, remark:state.annex13[k].remark||""}); }));
  ANNEX_4.forEach((text,idx)=>{ const k=`A4-${idx}`; if(state.annex4[k]?.value==="NO") rows.push({section:"Annexure 4 – Content of Medical Record", item:text, remark:state.annex4[k].remark||""}); });
  mount.innerHTML = rows.length? rows.map((r,i)=>`<div class="item"><div class="label">${i+1}. <strong>${r.item}</strong><br><span class="muted">${r.section}</span></div><div class="muted">NO</div><input type="text" value="${r.remark}" disabled></div>`).join("") : '<p class="muted">No non-compliance marked yet.</p>';
}
function wireInputs(){
  ["#tab-checklist","#tab-annex-1-3","#tab-annex-4"].forEach(sel=>{
    els(`${sel} select[data-key]`).forEach(s=> s.addEventListener("change",e=>{ const k=e.target.dataset.key; const dest = k.startsWith("B")? state.annex13 : k.startsWith("A4")? state.annex4 : state.sections; dest[k].value=e.target.value; refreshNonCompliance(); }));
    els(`${sel} input[data-remark]`).forEach(i=> i.addEventListener("change",e=>{ const k=e.target.dataset.remark; const dest = k.startsWith("B")? state.annex13 : k.startsWith("A4")? state.annex4 : state.sections; dest[k].remark=e.target.value; refreshNonCompliance(); }));
  });
  el("#hospital-name").addEventListener("input", e=> state.hospitalName = e.target.value );
  el("#hospital-address").addEventListener("input", e=> state.hospitalAddress = e.target.value );
  el("#visit-date").addEventListener("change", e=> state.visitDate = e.target.value );
  el("#btn-save").addEventListener("click", saveAssessment);
  el("#btn-export-pdf").addEventListener("click", exportSummaryPDF);
  el("#btn-export-noncompliance").addEventListener("click", exportNonComplianceCSV);
}
function wireTabs(){
  els(".tab").forEach(btn=> btn.addEventListener("click", ()=>{
    els(".tab").forEach(b=>b.classList.remove("active")); els(".tab-panel").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active"); el(`#tab-${btn.dataset.tab}`).classList.add("active");
  }));
}
async function saveAssessment(){
  const status = el("#save-status");
  if(window.DEMO_MODE || !auth || !auth.currentUser){ status.textContent="Demo mode: not saved to Firestore."; setTimeout(()=>status.textContent="",2500); return; }
  const payload={ owner:auth.currentUser.uid, ownerEmail:auth.currentUser.email, hospitalName: state.hospitalName||el("#hospital-name").value.trim(), hospitalAddress: state.hospitalAddress||el("#hospital-address").value.trim(), visitDate: state.visitDate||el("#visit-date").value||null, sections:state.sections, annex13:state.annex13, annex4:state.annex4, savedAt:new Date().toISOString() };
  try{ await addDoc(collection(getFirestore(), "assessments"), payload); status.textContent="Saved ✓"; setTimeout(()=>status.textContent="",2000);}catch{ status.textContent="Save failed."; setTimeout(()=>status.textContent="",3000); }
}
function exportSummaryPDF(){
  const { jsPDF } = window.jspdf || {}; if(!jsPDF){ alert("PDF library not loaded"); return; }
  const doc = new jsPDF({unit:"pt",compress:true});
  const hospital=(state.hospitalName||el("#hospital-name").value||"").trim();
  const address=(state.hospitalAddress||el("#hospital-address").value||"").trim();
  const visitDate=(state.visitDate||el("#visit-date").value||"").trim();
  doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.text("Hospital Assessment – Summary", 40, 40);
  doc.setFontSize(10); doc.setFont("helvetica","normal");
  doc.text(`Hospital: ${hospital||"-"}`, 40, 62); doc.text(`Address: ${address||"-"}`, 40, 78); doc.text(`Date(s): ${visitDate||"-"}`, 40, 94);
  let total=0, yes=0, no=0; [state.sections,state.annex13,state.annex4].forEach(o=>Object.values(o).forEach(v=>{ if(!v.value) return; total++; if(v.value==="YES") yes++; if(v.value==="NO") no++; }));
  doc.text(`Responses: YES ${yes} • NO ${no} • Total marked ${total}`, 40, 120);
  const rows=[];
  CHECKLIST.forEach(sec=> sec.items.forEach((t,i)=>{ const k=`${sec.code}-${i}`; const v=state.sections[k]; if(v?.value==="NO") rows.push([`${sec.code}. ${sec.title}`, t, v.remark||""]); }));
  ANNEX_1_3.forEach((blk,bi)=> blk.items.forEach((t,i)=>{ const k=`B${bi}-${i}`; const v=state.annex13[k]; if(v?.value==="NO") rows.push([blk.title, t, v.remark||""]); }));
  ANNEX_4.forEach((t,i)=>{ const k=`A4-${i}`; const v=state.annex4[k]; if(v?.value==="NO") rows.push(["Annexure 4 – Content of Medical Record", t, v.remark||""]); });
  const startY=150;
  if(rows.length){ doc.autoTable({ head:[["Section","Item (marked NO)","Remarks"]], body:rows, startY, styles:{fontSize:9,cellPadding:4,overflow:"linebreak"}, headStyles:{fillColor:[14,165,233]} }); }
  else{ doc.text("No non-compliance recorded.", 40, startY); }
  const name = `Assessment_Summary_${(hospital||"").replace(/\W+/g,"_")}_${Date.now()}.pdf`; doc.save(name);
}
function exportNonComplianceCSV(){
  const lines=[["Section","Item","Remarks"]];
  CHECKLIST.forEach(sec=> sec.items.forEach((t,i)=>{ const k=`${sec.code}-${i}`; const v=state.sections[k]; if(v?.value==="NO") lines.push([`${sec.code}. ${sec.title}`, t, v.remark||""]); }));
  ANNEX_1_3.forEach((blk,bi)=> blk.items.forEach((t,i)=>{ const k=`B${bi}-${i}`; const v=state.annex13[k]; if(v?.value==="NO") lines.push([blk.title, t, v.remark||""]); }));
  ANNEX_4.forEach((t,i)=>{ const k=`A4-${i}`; const v=state.annex4[k]; if(v?.value==="NO") lines.push(["Annexure 4 – Content of Medical Record", t, v.remark||""]); });
  const csv = lines.map(r=>r.map(v=>`"${(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="NonCompliance.csv"; a.click(); URL.revokeObjectURL(url);
}
function boot(){ renderChecklist(); renderAnnex13(); renderAnnex4(); wireInputs(); wireTabs(); refreshNonCompliance(); }
boot();
