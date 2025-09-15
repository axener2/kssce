import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
const { auth } = window.__APP__ || {};
import { CHECKLIST, ANNEX_1_3, ANNEX_4 } from "./data/schema.js";

const $ = s=>document.querySelector(s);
const $$ = s=>Array.from(document.querySelectorAll(s));

let state = { hospitalName:"", hospitalAddress:"", visitDate:"", sections:{}, annex13:{}, annex4:{} };

function initState(){
  CHECKLIST.forEach(s=>s.items.forEach((_,i)=> state.sections[`${s.code}-${i}`]={value:"",remark:""}));
  ANNEX_1_3.forEach((b,bi)=> b.items.forEach((_,i)=> state.annex13[`B${bi}-${i}`]={value:"",remark:""}));
  ANNEX_4.forEach((_,i)=> state.annex4[`A4-${i}`]={value:"",remark:""});
}
initState();

const optionHtml = (v,l)=>`<option value="${v}">${l}</option>`;

function renderChecklist(){
  const mount = $("#tab-checklist"); mount.innerHTML="";
  CHECKLIST.forEach(section=>{
    const box = document.createElement("div");
    box.className = "bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden";
    box.innerHTML = `<div class="px-4 py-3 bg-slate-50 flex items-center justify-between">
        <div class="font-semibold">${section.code}. ${section.title}</div>
        <div class="text-xs text-slate-500">Items: ${section.items.length}</div>
      </div><div class="p-2 sm:p-3"></div>`;
    const body = box.querySelector("div.p-2");
    section.items.forEach((text,idx)=>{
      const key = `${section.code}-${idx}`;
      const row = document.createElement("div");
      row.className = "grid gap-2 sm:grid-cols-[1fr,160px,260px] items-center border-b border-slate-100 px-2 py-2 last:border-b-0";
      row.innerHTML = `<div class="text-sm">${text}</div>
        <div><select data-key="${key}" class="w-full rounded-xl border border-slate-300 px-2 py-2">
          ${optionHtml("","Select")}${optionHtml("YES","YES")}${optionHtml("NO","NO")}
        </select></div>
        <input data-remark="${key}" class="rounded-xl border border-slate-300 px-3 py-2" placeholder="Remarks (optional)"/>`;
      body.appendChild(row);
    });
    mount.appendChild(box);
  });
}

function renderAnnex13(){
  const mount = $("#tab-annex-1-3"); mount.innerHTML="";
  ANNEX_1_3.forEach((blk,bi)=>{
    const box = document.createElement("div");
    box.className = "bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden";
    box.innerHTML = `<div class="px-4 py-3 bg-slate-50 flex items-center justify-between">
        <div class="font-semibold">${blk.title}</div>
        <div class="text-xs text-slate-500">Items: ${blk.items.length}</div>
      </div><div class="p-2 sm:p-3"></div>`;
    const body = box.querySelector("div.p-2");
    blk.items.forEach((text,idx)=>{
      const key = `B${bi}-${idx}`;
      const row = document.createElement("div");
      row.className = "grid gap-2 sm:grid-cols-[1fr,160px,260px] items-center border-b border-slate-100 px-2 py-2 last:border-b-0";
      row.innerHTML = `<div class="text-sm">${text}</div>
        <div><select data-key="${key}" class="w-full rounded-xl border border-slate-300 px-2 py-2">
          ${optionHtml("","Select")}${optionHtml("YES","YES")}${optionHtml("NO","NO")}
        </select></div>
        <input data-remark="${key}" class="rounded-xl border border-slate-300 px-3 py-2" placeholder="Remarks (optional)"/>`;
      body.appendChild(row);
    });
    mount.appendChild(box);
  });
}

function renderAnnex4(){
  const mount = $("#tab-annex-4"); mount.innerHTML="";
  const box = document.createElement("div");
  box.className = "bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden";
  box.innerHTML = `<div class="px-4 py-3 bg-slate-50 flex items-center justify-between">
      <div class="font-semibold">Annexure 4 – Content of Medical Record</div>
      <div class="text-xs text-slate-500">Items: ${ANNEX_4.length}</div>
    </div><div class="p-2 sm:p-3"></div>`;
  const body = box.querySelector("div.p-2");
  ANNEX_4.forEach((text,idx)=>{
    const key = `A4-${idx}`;
    const row = document.createElement("div");
    row.className = "grid gap-2 sm:grid-cols-[1fr,160px,260px] items-center border-b border-slate-100 px-2 py-2 last:border-b-0";
    row.innerHTML = `<div class="text-sm">${text}</div>
      <div><select data-key="${key}" class="w-full rounded-xl border border-slate-300 px-2 py-2">
        ${optionHtml("","Select")}${optionHtml("YES","YES")}${optionHtml("NO","NO")}
      </select></div>
      <input data-remark="${key}" class="rounded-xl border border-slate-300 px-3 py-2" placeholder="Remarks (optional)"/>`;
    body.appendChild(row);
  });
  mount.appendChild(box);
}

function refreshNonCompliance(){
  const mount = $("#noncompliance-list");
  const collect = [];
  CHECKLIST.forEach(sec=> sec.items.forEach((text,idx)=>{
    const k=`${sec.code}-${idx}`; if(state.sections[k]?.value==="NO") collect.push({section:`${sec.code}. ${sec.title}`, item:text, remark:state.sections[k].remark||""});
  }));
  ANNEX_1_3.forEach((blk,bi)=> blk.items.forEach((text,idx)=>{
    const k=`B${bi}-${idx}`; if(state.annex13[k]?.value==="NO") collect.push({section:blk.title, item:text, remark:state.annex13[k].remark||""});
  }));
  ANNEX_4.forEach((text,idx)=>{
    const k=`A4-${idx}`; if(state.annex4[k]?.value==="NO") collect.push({section:"Annexure 4 – Content of Medical Record", item:text, remark:state.annex4[k].remark||""});
  });
  mount.innerHTML = "";
  if(!collect.length){
    mount.innerHTML = '<p class="text-slate-500 text-sm">No non‑compliance marked yet.</p>';
    return;
  }
  collect.forEach((r,i)=>{
    const row = document.createElement("div");
    row.className = "bg-white border border-slate-200 rounded-xl p-3";
    row.innerHTML = `<div class="text-sm"><span class="font-medium">${i+1}. ${r.item}</span><br><span class="text-slate-500">${r.section}</span></div>
      <div class="mt-1 text-xs text-rose-600 font-medium">NO</div>
      <input value="${r.remark}" disabled class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50"/>`;
    mount.appendChild(row);
  });
}

function wireInputs(){
  [["#tab-checklist","sections"],["#tab-annex-1-3","annex13"],["#tab-annex-4","annex4"]].forEach(([sel,slot])=>{
    $$(sel+" select[data-key]").forEach(s=> s.addEventListener("change",e=>{ const k=e.target.dataset.key; state[slot][k].value = e.target.value; refreshNonCompliance(); }));
    $$(sel+" input[data-remark]").forEach(inp=> inp.addEventListener("change",e=>{ const k=e.target.dataset.remark; state[slot][k].remark = e.target.value; refreshNonCompliance(); }));
  });
  $("#hospital-name").addEventListener("input", e=> state.hospitalName = e.target.value );
  $("#hospital-address").addEventListener("input", e=> state.hospitalAddress = e.target.value );
  $("#visit-date").addEventListener("change", e=> state.visitDate = e.target.value );
  $("#btn-save").addEventListener("click", saveAssessment);
  $("#btn-export-pdf").addEventListener("click", exportSummaryPDF);
  $("#btn-export-noncompliance").addEventListener("click", exportNonComplianceCSV);
}

function wireTabs(){
  $$(".tab").forEach(btn=> btn.addEventListener("click", ()=>{
    $$(".tab").forEach(b=>{ b.classList.remove("bg-brand","text-white","active"); b.classList.add("bg-slate-200","text-slate-800"); });
    $$(".tab-panel").forEach(p=> p.classList.add("hidden"));
    btn.classList.add("bg-brand","text-white","active");
    document.querySelector(`#tab-${btn.dataset.tab}`).classList.remove("hidden");
  }));
}

async function saveAssessment(){
  const status = $("#save-status");
  if(!auth || !auth.currentUser){ status.textContent = "Sign in required."; setTimeout(()=>status.textContent="",2000); return; }
  const payload = {
    owner: auth.currentUser.uid,
    ownerEmail: auth.currentUser.email,
    hospitalName: state.hospitalName || $("#hospital-name").value.trim(),
    hospitalAddress: state.hospitalAddress || $("#hospital-address").value.trim(),
    visitDate: state.visitDate || $("#visit-date").value || null,
    sections: state.sections, annex13: state.annex13, annex4: state.annex4,
    savedAt: new Date().toISOString()
  };
  try{
    await addDoc(collection(getFirestore(), "assessments"), payload);
    status.textContent = "Saved ✓";
    setTimeout(()=> status.textContent = "", 2000);
  }catch(e){
    status.textContent = "Save failed.";
    setTimeout(()=> status.textContent = "", 3000);
  }
}

function exportSummaryPDF(){
  const { jsPDF } = window.jspdf || {}; if(!jsPDF){ alert("PDF library not loaded"); return; }
  const doc = new jsPDF({unit:"pt",compress:true});
  const hospital= (state.hospitalName || $("#hospital-name").value || "").trim();
  const address = (state.hospitalAddress || $("#hospital-address").value || "").trim();
  const visitDate = (state.visitDate || $("#visit-date").value || "").trim();
  doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.text("Hospital Assessment – Summary", 40, 40);
  doc.setFontSize(10); doc.setFont("helvetica","normal");
  doc.text(`Hospital: ${hospital||"-"}`, 40, 62);
  doc.text(`Address: ${address||"-"}`, 40, 78);
  doc.text(`Date(s): ${visitDate||"-"}`, 40, 94);
  let total=0,yes=0,no=0; [state.sections,state.annex13,state.annex4].forEach(o=>Object.values(o).forEach(v=>{ if(!v.value) return; total++; if(v.value==="YES") yes++; if(v.value==="NO") no++; }));
  doc.text(`Responses: YES ${yes} • NO ${no} • Total marked ${total}`, 40, 120);
  const rows = [];
  CHECKLIST.forEach(sec=>sec.items.forEach((t,i)=>{ const k=`${sec.code}-${i}`; const v=state.sections[k]; if(v?.value==="NO") rows.push([`${sec.code}. ${sec.title}`, t, v.remark||""]); }));
  ANNEX_1_3.forEach((blk,bi)=>blk.items.forEach((t,i)=>{ const k=`B${bi}-${i}`; const v=state.annex13[k]; if(v?.value==="NO") rows.push([blk.title, t, v.remark||""]); }));
  ANNEX_4.forEach((t,i)=>{ const k=`A4-${i}`; const v=state.annex4[k]; if(v?.value==="NO") rows.push(["Annexure 4 – Content of Medical Record", t, v.remark||""]); });
  const startY=150;
  if(rows.length){ doc.autoTable({ head:[["Section","Item (marked NO)","Remarks"]], body:rows, startY, styles:{fontSize:9,cellPadding:4,overflow:"linebreak"}, headStyles:{fillColor:[14,165,233]} }); }
  else{ doc.text("No non-compliance recorded.", 40, startY); }
  const name = `Assessment_Summary_${(hospital||"").replace(/\W+/g,"_")}_${Date.now()}.pdf`; doc.save(name);
}

function exportNonComplianceCSV(){
  const lines=[["Section","Item","Remarks"]];
  CHECKLIST.forEach(sec=>sec.items.forEach((t,i)=>{ const k=`${sec.code}-${i}`; const v=state.sections[k]; if(v?.value==="NO") lines.push([`${sec.code}. ${sec.title}`, t, v.remark||""]); }));
  ANNEX_1_3.forEach((blk,bi)=>blk.items.forEach((t,i)=>{ const k=`B${bi}-${i}`; const v=state.annex13[k]; if(v?.value==="NO") lines.push([blk.title, t, v.remark||""]); }));
  ANNEX_4.forEach((t,i)=>{ const k=`A4-${i}`; const v=state.annex4[k]; if(v?.value==="NO") lines.push(["Annexure 4 – Content of Medical Record", t, v.remark||""]); });
  const csv = lines.map(r=>r.map(v=>`"${(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download="NonCompliance.csv"; a.click(); URL.revokeObjectURL(url);
}

function boot(){ renderChecklist(); renderAnnex13(); renderAnnex4(); wireInputs(); wireTabs(); refreshNonCompliance(); }
boot();
