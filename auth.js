
import { onAuthStateChanged, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, sendPasswordResetEmail, signOut }
  from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const { auth, db } = window.__APP__;

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const msgEl = document.getElementById("auth-msg");
const signinBtn = document.getElementById("signin");
const signupBtn = document.getElementById("signup");
const forgotBtn = document.getElementById("forgot");
const logoutBtn = document.getElementById("logout");
const appMain = document.getElementById("app");
const authContainer = document.getElementById("auth-container");

async function isAllowListed(email){
  const ref = doc(db, "allowlist", email.toLowerCase());
  const snap = await getDoc(ref);
  return snap.exists();
}

signinBtn.addEventListener("click", async () => {
  try{
    await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
  }catch(e){ msgEl.textContent = e.message; }
});

signupBtn.addEventListener("click", async () => {
  try{
    const email = emailEl.value;
    const allowed = await isAllowListed(email);
    if(!allowed){ msgEl.textContent="Email not in allowlist"; return; }
    await createUserWithEmailAndPassword(auth, email, passEl.value);
    msgEl.textContent="Account created";
  }catch(e){ msgEl.textContent = e.message; }
});

forgotBtn.addEventListener("click", async () => {
  try{
    await sendPasswordResetEmail(auth, emailEl.value);
    msgEl.textContent="Reset email sent";
  }catch(e){ msgEl.textContent = e.message; }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, user => {
  if(user){ authContainer.classList.add("hidden"); appMain.classList.remove("hidden"); }
  else { authContainer.classList.remove("hidden"); appMain.classList.add("hidden"); }
});
