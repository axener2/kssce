# KSCCE Hospital Checklist (Kerala) – Static Web App

Mobile‑friendly web app for the **Kerala State Council for Clinical Establishments (KSCCE)** hospital checklist with:
- **Firebase email/password sign‑in** gated by an **allow‑list**
- Tabs for the main **Checklist**, **Annexures 1–3**, **Annexure 4**, and a **Non‑Compliance** view
- **PDF summary export** (jsPDF) and **CSV export** of non‑compliance (“NO”) items
- **Firestore** storage of each saved assessment document

> This UI maps the content from the official *Checklist for Hospital* and Annexures. Please verify against your latest document.

---

## 1) What’s inside

```
hospital-checklist-app/
├── index.html
├── styles.css
├── firebase-config.js           # <-- put your Firebase project config here
├── auth.js                      # auth + allowlist gate
├── app.js                       # UI, Firestore save, PDF/CSV export
├── data/
│   └── schema.js                # checklist + annexure item lists (YES/NO)
└── README.md
```

---

## 2) One‑time Firebase setup

1. **Create a Firebase project** → https://console.firebase.google.com  
2. In **Authentication → Sign‑in method**, enable **Email/Password**.
3. In **Authentication → Settings** (Authorized domains), **add your GitHub Pages domain**  
   e.g. `your-username.github.io`.
4. In **Firestore Database**, create a database in **production mode**.
5. **Seed an allow‑list** collection:
   - Collection: `allowlist`
   - Document ID: the exact lower‑cased email (e.g. `assessor@hospital.in`)
   - Document body can be empty (`{}`), or include metadata like `{"role":"assessor"}`
   - Repeat for each permitted email.
6. **Set Firestore rules** (restrict reads/writes to allow‑listed users only). Example:

```
// Firestore rules (Rules → Edit rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAllowListed() {
      return request.auth != null
        && exists(/databases/$(database)/documents/allowlist/$(request.auth.token.email));
    }

    match /allowlist/{email} {
      allow read, write: if false; // manage via console only (admins)
    }

    match /assessments/{docId} {
      allow create: if isAllowListed();
      allow read, update, delete: if isAllowListed() && request.auth.uid == resource.data.owner;
    }
  }
}
```

> This pattern allows anyone to **attempt** sign‑up, but **only emails present in `allowlist/`** will succeed in creating an account via the app, and only allow‑listed users can read/write assessment data.

> If you prefer **hard blocking of sign‑ups**, you can add a Firebase Authentication *blocking function* to check the `allowlist` on `beforeCreate`—that needs Cloud Functions.

7. Copy your **Firebase config** from **Project Settings → Web app** and paste into `firebase-config.js`.

---

## 3) Local test (optional)

Because this is static, you can just open `index.html` in a local server:

- Python: `python3 -m http.server 8080`
- Node: `npx http-server -p 8080`

Then visit http://localhost:8080

---

## 4) Deploy on GitHub Pages

1. Create a **public repo** (e.g., `hospital-checklist`).
2. Upload all files from `hospital-checklist-app/` root to the repo.
3. In **Repo → Settings → Pages**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main / root`
4. Wait for Pages to build. Your site will be live at  
   `https://<your-username>.github.io/<repo>/`
5. Add this exact URL (domain) to **Firebase Auth → Authorized domains**.

---

## 5) Using the app

1. Click **Sign in**.
2. Use an **allow‑listed email**. If the email is not on the list:
   - Account creation will be **blocked in UI**, and
   - Even if someone bypasses UI, **Firestore rules** still prevent any data access.
3. Enter **hospital name, address, date**.
4. Fill **YES/NO** and remarks across tabs:
   - **Checklist** matches sections A–P.
   - **Annexures 1–3** include furniture/fixtures, equipment and drugs.
   - **Annexure 4** lists contents of medical records.
5. Click **Save** to create a Firestore document under `assessments`.
6. Click **Export Summary PDF** to generate a PDF with:
   - Header metadata (hospital, address, date)
   - YES/NO counts
   - Table of all **NO** (non‑compliance) items with remarks
7. Click **Export Non‑Compliance (CSV)** to export only NO items.

---

## 6) Admin tips

- To **add a new assessor**, add their email (lower‑case) as a doc inside `allowlist/`.
- To **revoke** access, delete their doc from `allowlist/`.
- You can later add features:
  - Per‑assessment **edit & versioning**
  - **Per‑section completion** badges
  - **Print‑ready** layouts
  - Cloud Functions for stronger **signup blocking** and **server‑side PDFs** if needed

---

## 7) Notes on the source document

This app mirrors the **KSCCE Hospital Checklist** sections (A–P) and **Annexures 1–4** as YES/NO items for quick capture. Always cross‑check against the latest official document.

---

## 8) Troubleshooting

- **Login loops / redirected to sign‑in**: Ensure your GitHub Pages domain is added in **Auth → Authorized domains**.
- **“Invalid login credentials”**: Shown by design; we don’t leak Firebase error details.
- **Can’t create account**: Email likely not in `allowlist/`.
- **PDF empty / missing table**: You may have no items marked **NO**.

---

## License

For assessment purposes only. Verify conformance with KSCCE and local laws before production use.
