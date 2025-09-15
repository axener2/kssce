
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDKSvo5KNuXPq83284_6GOnxXisKA_lSks",
  authDomain: "kssce-51e3e.firebaseapp.com",
  projectId: "kssce-51e3e",
  storageBucket: "kssce-51e3e.firebasestorage.app",
  messagingSenderId: "308291560377",
  appId: "1:308291560377:web:ae634dd42e9ac1459e0c68"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
await setPersistence(auth, browserLocalPersistence);

// Helpers
const $ = s=>document.querySelector(s);
const $$ = s=>Array.from(document.querySelectorAll(s));
const showError = (m)=>{ const e=$("#auth-error"); e.textContent=m; e.classList.remove("text-emerald-600"); e.classList.add("text-red-600"); }
const showOK = (m)=>{ const e=$("#auth-error"); e.textContent=m; e.classList.remove("text-red-600"); e.classList.add("text-emerald-600"); }
const emailValid = (v)=>!!v && v.includes("@");
const passValid = (v)=>(v||"").length>=8;

// Auth UI
function renderSignedIn(email){
  $("#auth-status").innerHTML = `<span class="inline-flex items-center gap-2 text-slate-700"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>${email}</span> <button id="btn-logout" class="ml-2 text-sky-600 hover:text-sky-700">Sign out</button>`;
  $("#btn-logout").addEventListener("click", async ()=>{ await signOut(auth); });
  $("#auth-panel").classList.add("hidden");
  $("#app").classList.remove("hidden");
}
function renderSignedOut(){
  $("#auth-status").innerHTML = "";
  $("#auth-panel").classList.remove("hidden");
  $("#app").classList.add("hidden");
}

// Attach listeners **synchronously** at load
$("#btn-login").addEventListener("click", async ()=>{
  const email = ($("#auth-email").value||"").trim().toLowerCase();
  const pass = $("#auth-password").value||"";
  if(!emailValid(email)) return showError("Enter a valid email.");
  if(!passValid(pass)) return showError("Password must be at least 8 characters.");
  try{ await signInWithEmailAndPassword(auth, email, pass); }
  catch{ showError("Invalid credentials."); }
});
$("#btn-signup").addEventListener("click", async ()=>{
  const email = ($("#auth-email").value||"").trim().toLowerCase();
  const pass = $("#auth-password").value||"";
  if(!emailValid(email)) return showError("Enter a valid email.");
  if(!passValid(pass)) return showError("Password must be at least 8 characters.");
  try{
    // allowlist check
    const snap = await getDoc(doc(db,"allowlist", email));
    if(!snap.exists()) return showError("This email is not on the allow‑list.");
    await createUserWithEmailAndPassword(auth, email, pass);
    showOK("Account created.");
  }catch{ showError("Account creation failed."); }
});
$("#btn-forgot").addEventListener("click", async ()=>{
  const email = ($("#auth-email").value||"").trim().toLowerCase();
  if(!emailValid(email)) return showError("Enter your email first.");
  try{ await sendPasswordResetEmail(auth, email); showOK("Password reset email sent."); }
  catch{ showError("Could not send reset email."); }
});

onAuthStateChanged(auth, (user)=>{ if(user) renderSignedIn((user.email||"").toLowerCase()); else renderSignedOut(); });

// Checklist data (full)
const CHECKLIST = [
  {
    code: "A",
    title: "General",
    items: [
      "Hospital should adopt infection control measures",
      "Appropriate arrangements for Bio medical waste management should be in place",
      "Medical Records should be maintained by either in hard or soft copy",
      "Laboratory Services should be available (dedicated set-up or collection centre with forwarding and reporting)",
      "Birth and death information register should be maintained",
      "Back-up facility for electricity failure covering essential activities should be available",
      "Fire extinguishers should be available",
      "Facility for clean/sterilized linens should be available",
      "Ambulance service arrangement should be in place",
      "Display of services provided and rates & packages",
      "Information regarding the services and approximate charges provided by hospital administration"
    ]
  },
  {
    code: "B",
    title: "OPD",
    items: [
      "Availability of stethoscope, torch, thermometer (non-mercury preferred), BP apparatus (non-mercury preferred), hand-wash facility, examination table, chairs/stools for doctor, patient and bystander",
      "Female attendant for female patients; privacy to patients; information material for patients",
      "Registration of patients (Name, Age, Sex, contact details at least mobile) available in hard or soft copy",
      "Waiting area, drinking water facility and separate male & female toilets available",
      "Names of doctors with their qualifications displayed"
    ]
  },
  {
    code: "C",
    title: "Casualty Services",
    items: [
      "Human resources supporting casualty services available during working hours",
      "Emergency drugs and equipment available according to scope of services",
      "Signage board of casualty displayed at entrance and easily visible",
      "Patient-friendly ramp or slope facility available",
      "Stretchers/wheelchairs available"
    ]
  },
  {
    code: "D",
    title: "IPD",
    items: [
      "Signboards of different departments and wards displayed",
      "A doctor available on call",
      "Personnel trained in nursing for at least 1 year available",
      "Beds available to provide inpatient treatment",
      "System to call nurses/attendants (Intercom/Call bell) present",
      "Hand-washing facility/hand sanitizer, bed pan, waste bins, attendants chair/stool available",
      "Drinking water facility and gender-specific toilets available"
    ]
  },
  {
    code: "E",
    title: "Registration Standards for OP Cabins",
    items: [
      "Name of physician with qualification & registration number displayed",
      "Chairs/stool, examination table, torch, thermometer (preferably non-mercurial), BP apparatus (preferably non-mercurial), stethoscope available",
      "Hand-washing facility, drinking water and waiting space present"
    ]
  },
  {
    code: "F",
    title: "Registration Standards for Laboratories",
    items: [
      "Name of consultant with qualification & registration number displayed",
      "Display of services & charges",
      "Equipment and instruments as per workload and scope of services"
    ]
  },
  {
    code: "G",
    title: "Signage",
    items: [
      "Appropriate bilingual signage (English & Malayalam); ‘24 hours emergency’ board desirable",
      "Board displaying hospital name at a prominent location",
      "Name of care provider with registration number",
      "Registration details of the hospital as per KCEA 2018",
      "Availability of fee structure of services (as per KCEA 2018)",
      "Timings of hospital and services provided",
      "Mandatory information (e.g., under PNDT Act) displayed prominently as applicable",
      "Important contact numbers (nearby Blood Banks, Fire Dept, Police, Ambulance)",
      "Safety Hazard and Caution signs posted appropriately",
      "Appropriate Fire exit signage",
      "‘No Smoking’ signage at prominent places"
    ]
  },
  {
    code: "H",
    title: "Infrastructure – Other Requirements",
    items: [
      "Convenient entry point to the hospital",
      "Access within requirements of Persons with Disabilities Act (and for all with restricted mobility)",
      "Safe, clean and hygienic environment for patients, attendants, staff and visitors",
      "24-hour potable water (drinking & hand hygiene) and 24-hour electricity (grid/UPS/generator)",
      "Clean public toilets separate for males, females and disabled-friendly",
      "Furniture and fixtures adequate, functional and maintained (Indicative list per Annexure 1)"
    ]
  },
  {
    code: "I",
    title: "Infrastructure – General Space Requirements",
    items: [
      "Reception & waiting area – 100 sq ft (desirable)",
      "Consultation cabin with physical examination table – 80 sq ft each (desirable)",
      "Storage & pharmacy – 40 sq ft (desirable)",
      "Ancillary area – 60 sq ft (desirable)",
      "Wards: 30% circulation space for nursing station, ward store, sanitary etc.",
      "OT (minor procedures) reception & waiting – 9.2 sq m (desirable)",
      "Consultation cabin (minor OT block) – 7.4 sq m each; exam area 3.71 sq m (desirable)",
      "Storage/pharmacy ancillary area – 5.57 sq m (desirable)",
      "Wards to have areas for nursing station, doctors’ duty, store, clean/dirty utility, janitor room, toilets (from circulation)",
      "General ward of 20 beds: ≥1 working counter and ≥1 hand-wash basin",
      "Distance between beds ≥1.0 m (desirable)",
      "Space at head end of bed ≥0.25 m",
      "Door width 1.2 m (desirable) and corridor width 2.5 m (desirable)"
    ]
  },
  {
    code: "J",
    title: "Medical Equipment & Instruments",
    items: [
      "Adequate equipment/instruments as per scope of service and bed strength",
      "Established system for maintenance of critical equipment",
      "Equipment kept in good working order via periodic inspection, cleaning and maintenance (e.g., AMC)"
    ]
  },
  {
    code: "K",
    title: "Drugs, Medical Devices & Consumables",
    items: [
      "Adequate drugs, medical devices and consumables",
      "Emergency drugs & consumables available at all times",
      "Drug storage in clean, well-lit, safe environment and per applicable laws",
      "Defined procedures for storage, inventory management and dispensing (pharmacy & patient care areas)"
    ]
  },
  {
    code: "L",
    title: "Human Resource Requirements",
    items: [
      "Qualified/trained nursing staff as per scope of services and regulatory requirements",
      "Qualified/trained paramedical staff as per scope and regulatory requirements",
      "Personal record for every staff (incl. contractual): appointment order, qualification/training, registration",
      "Qualified doctor available during working hours (MBBS for primary care; PG for advanced; round-the-clock if IPD)",
      "Trained nurse (≥1 year experience) – minimum 1",
      "Pharmacist (if in-house pharmacy) – minimum 1",
      "Lab technician (if in-house laboratory) – minimum 1",
      "X-ray technician (if in-house X-ray) – minimum 1",
      "Multi-task staff – minimum 1",
      "Other support/admin staff as per scope"
    ]
  },
  {
    code: "M",
    title: "Support Services",
    items: [
      "Registration/help-desk & billing counter present",
      "Diagnostic services in-house or outsourced per minimum standards",
      "Pharmacy services in-house or outsourced"
    ]
  },
  {
    code: "N",
    title: "Waste Management Services",
    items: [
      "General waste segregation, collection, transport, storage & disposal per local laws",
      "Biomedical waste segregation, collection, transport, storage & disposal per BMW Rules"
    ]
  },
  {
    code: "O",
    title: "Legal / Statutory Requirements",
    items: [
      "Compliance with local regulations and law",
      "Clinical Establishments registration (if applicable)",
      "Bio-medical Waste Management licenses from PCB",
      "Other mandatory licenses from concerned authorities as per scope"
    ]
  },
  {
    code: "P",
    title: "Record Maintenance & Reporting",
    items: [
      "Minimum medical records maintained and information provided as per Annexure 4 and KCEA 2018",
      "Medical records maintained in physical or digital format",
      "IPD medical records maintained per national/local law, MCI guidelines, and court orders"
    ]
  }
];;
const ANNEX_1_3 = [
  {
    title: "Annexure 1 – Furniture & Fixtures (indicative)",
    items: [
      "Examination table","Writing tables","Chairs","Almirah","Waiting benches","Inpatient beds",
      "Labour table (if applicable)","Wheel chair / Stretcher","Medicine trolley / Instrument trolley",
      "Screens / curtains","Foot step","Bed side table","Baby cot (if applicable)","Stool",
      "Medicine chest","Examination lamp","View box","Fans","Lighting fixtures",
      "Wash basin","IV stand","Color-coded bins for BMW"
    ]
  },
  {
    title: "Annexure 2 – Essential Equipment & Instruments (indicative)",
    items: [
      "Stethoscope","Digital thermometer","Torch / flash light","Digital BP apparatus",
      "Weighing machine (adult/pediatric)","Glucometer","Pulse oximeter","Syringes & needles (assorted)",
      "Examination gloves","Examination table","Otoscope","Patellar hammer",
      "Receptacle for soiled pads/dressings","Sterile equipment storage","Sutures",
      "Non-mercury thermometer","Dressing trolley","IV stands","Medicine storage cabinet",
      "Oxygen cylinder","Suction machine","Urinals and bedpans","Linens"
    ]
  },
  {
    title: "Annexure 3 – Emergency Drugs & Consumables (essential in all hospitals)",
    items: [
      "Inj. Diazepam 10 mg","Inj. Furosemide 20 mg","Inj. Ondansetron 8 mg/4 ml","Inj. Ranitidine",
      "Inj. Noradrenaline 4 mg","Inj. Phenytoin 50 mg","Inj. Diclofenac 75 mg","Inj. Deriphylline",
      "Inj. Chlorpheniramine maleate","Inj. Hydrocortisone 100 mg","Inj. Atropine 0.6 mg","Inj. Adrenaline 1 mg",
      "KCl","Sterile water","Inj. Sodium bicarbonate","Inj. Dopamine","Inj. Naloxone 400 mcg","Inj. Lignocaine 50 ml",
      "Tab. Sorbitrate","Tab. Aspirin","Inj. Tetanus toxoid",
      "Neb. Salbutamol 2.5 ml","Neb. Budesonide","Lignocaine jelly 2%","Calcium (inj/tab)",
      "Fluids: RL 500 ml, NS 500/250/100 ml, DNS 500 ml, Dextrose 5%/10% 500 ml, Pediatric IV infusion 500 ml"
    ]
  }
];;
const ANNEX_4 = [
  "Name & Registration number of treating doctor",
  "Name, demographic details & contact number of patient",
  "Clinical history, assessment & re-assessment, nursing notes, and diagnosis",
  "Investigation reports",
  "Details of treatment, invasive procedures, surgery and other care provided",
  "Applicable consents",
  "Discharge summary",
  "Cause-of-death certificate & death summary (where applicable)"
];;

// App state
let state = { hospitalName:"", hospitalAddress:"", visitDate:"", sections:{}, annex13:{}, annex4:{} };
function initState(){
  CHECKLIST.forEach(s=>s.items.forEach((_,i)=> state.sections[`${s.code}-${i}`]={value:"",remark:""}));
  ANNEX_1_3.forEach((b,bi)=> b.items.forEach((_,i)=> state.annex13[`B${bi}-${i}`]={value:"",remark:""}));
  ANNEX_4.forEach((_,i)=> state.annex4[`A4-${i}`]={value:"",remark:""});
}
initState();

const optionHtml = (v,l)=>`<option value="${v}">${l}</option>`;

// Renderers
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
  if(!collect.length){ mount.innerHTML = '<p class="text-slate-500 text-sm">No non‑compliance marked yet.</p>'; return; }
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
    $$(".tab").forEach(b=>{ b.classList.remove("bg-sky-500","text-white","active"); b.classList.add("bg-slate-200","text-slate-800"); });
    $$(".tab-panel").forEach(p=> p.classList.add("hidden"));
    btn.classList.add("bg-sky-500","text-white","active");
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
    await addDoc(collection(db, "assessments"), payload);
    status.textContent = "Saved ✓";
    setTimeout(()=> status.textContent = "", 2000);
  }catch{ status.textContent = "Save failed."; setTimeout(()=> status.textContent = "", 3000); }
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
