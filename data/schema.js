// Checklist schema derived from KSCCE "Checklist for Hospital" (Kerala)
// Items are grouped into sections with YES/NO responses and optional remarks.

export const CHECKLIST = [
  {
    code: "A",
    title: "General",
    items: [
      "Hospital should adopt infection control measures",
      "Appropriate arrangements for Bio medical waste management should be in place",
      "Medical Records should be maintained by either in hard or soft copy",
      "Laboratory Services should be available (dedicated set‑up or collection centre with forwarding and reporting)",
      "Birth and death information register should be maintained",
      "Back‑up facility for electricity failure covering essential activities should be available",
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
      "Availability of stethoscope, torch, thermometer (non‑mercury preferred), BP apparatus (non‑mercury preferred), hand‑wash facility, examination table, chairs/stools for doctor, patient and bystander",
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
      "Patient‑friendly ramp or slope facility available",
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
      "Hand‑washing facility/hand sanitizer, bed pan, waste bins, attendants chair/stool available",
      "Drinking water facility and gender‑specific toilets available"
    ]
  },
  {
    code: "E",
    title: "Registration Standards for OP Cabins",
    items: [
      "Name of physician with qualification & registration number displayed",
      "Chairs/stool, examination table, torch, thermometer (preferably non‑mercurial), BP apparatus (preferably non‑mercurial), stethoscope available",
      "Hand‑washing facility, drinking water and waiting space present"
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
      "24‑hour potable water (drinking & hand hygiene) and 24‑hour electricity (grid/UPS/generator)",
      "Clean public toilets separate for males, females and disabled‑friendly",
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
      "General ward of 20 beds: ≥1 working counter and ≥1 hand‑wash basin",
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
      "Drug storage in clean, well‑lit, safe environment and per applicable laws",
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
      "Qualified doctor available during working hours (MBBS for primary care; PG for advanced; round‑the‑clock if IPD)",
      "Trained nurse (≥1 year experience) – minimum 1",
      "Pharmacist (if in‑house pharmacy) – minimum 1",
      "Lab technician (if in‑house laboratory) – minimum 1",
      "X‑ray technician (if in‑house X‑ray) – minimum 1",
      "Multi‑task staff – minimum 1",
      "Other support/admin staff as per scope"
    ]
  },
  {
    code: "M",
    title: "Support Services",
    items: [
      "Registration/help‑desk & billing counter present",
      "Diagnostic services in‑house or outsourced per minimum standards",
      "Pharmacy services in‑house or outsourced"
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
      "Bio‑medical Waste Management licenses from PCB",
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
];

// Annexures 1–3 combined (indicative lists → YES/NO)
export const ANNEX_1_3 = [
  {
    title: "Annexure 1 – Furniture & Fixtures (indicative)",
    items: [
      "Examination table","Writing tables","Chairs","Almirah","Waiting benches","Inpatient beds",
      "Labour table (if applicable)","Wheel chair / Stretcher","Medicine trolley / Instrument trolley",
      "Screens / curtains","Foot step","Bed side table","Baby cot (if applicable)","Stool",
      "Medicine chest","Examination lamp","View box","Fans","Lighting fixtures",
      "Wash basin","IV stand","Color‑coded bins for BMW"
    ]
  },
  {
    title: "Annexure 2 – Essential Equipment & Instruments (indicative)",
    items: [
      "Stethoscope","Digital thermometer","Torch / flash light","Digital BP apparatus",
      "Weighing machine (adult/pediatric)","Glucometer","Pulse oximeter","Syringes & needles (assorted)",
      "Examination gloves","Examination table","Otoscope","Patellar hammer",
      "Receptacle for soiled pads/dressings","Sterile equipment storage","Sutures",
      "Non‑mercury thermometer","Dressing trolley","IV stands","Medicine storage cabinet",
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
];

// Annexure 4 – Content of Medical Record
export const ANNEX_4 = [
  "Name & Registration number of treating doctor",
  "Name, demographic details & contact number of patient",
  "Clinical history, assessment & re‑assessment, nursing notes, and diagnosis",
  "Investigation reports",
  "Details of treatment, invasive procedures, surgery and other care provided",
  "Applicable consents",
  "Discharge summary",
  "Cause‑of‑death certificate & death summary (where applicable)"
];
