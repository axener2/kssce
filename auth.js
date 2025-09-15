import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const statusBar = document.getElementById("auth-status");
const panel = document.getElementById("auth-panel");
const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
const btnForgot = document.getElementById("btn-forgot");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const appMain = document.getElementById("app");

function showError(msg){ authError.textContent = msg; }
function clearError(){ authError.textContent = ""; }
function emailValid(v){ return !!v && v.includes("@"); }
function passValid(v){ return (v||"").length >= 8; }

function renderSignedIn(email){
  statusBar.innerHTML = `<span class="inline-flex items-center gap-2 text-slate-700"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>${email}</span> <button id="btn-logout" class="ml-2 text-brand hover:text-brand-dark">Sign out</button>`;
  document.getElementById("btn-logout").addEventListener("click", async ()=>{
    const { auth } = window.__APP__ || {};
    await signOut(auth);
  });
  panel.classList.add("hidden");
  appMain.classList.remove("hidden");
}
function renderSignedOut(){
  statusBar.innerHTML = "";
  panel.classList.remove("hidden");
  appMain.classList.add("hidden");
}

const { auth } = window.__APP__ || {};

// auth state
onAuthStateChanged(auth, (user) => {
  if (user) renderSignedIn((user.email||"").toLowerCase());
  else renderSignedOut();
});

btnLogin.addEventListener("click", async ()=>{
  clearError();
  const email = (authEmail.value||"").trim().toLowerCase();
  const pass = authPassword.value||"";
  if(!emailValid(email)) return showError("Enter a valid email.");
  if(!passValid(pass)) return showError("Password must be at least 8 characters.");
  try{
    await signInWithEmailAndPassword(auth, email, pass);
  }catch(e){
    showError("Invalid credentials.");
  }
});

btnSignup.addEventListener("click", async ()=>{
  clearError();
  const email = (authEmail.value||"").trim().toLowerCase();
  const pass = authPassword.value||"";
  if(!emailValid(email)) return showError("Enter a valid email.");
  if(!passValid(pass)) return showError("Password must be at least 8 characters.");

  try{
    const db = getFirestore();
    const allowRef = doc(db, "allowlist", email);
    const allowSnap = await getDoc(allowRef);
    if(!allowSnap.exists()) return showError("This email is not on the allow‑list.");
    await createUserWithEmailAndPassword(auth, email, pass);
  }catch(e){
    showError("Account creation failed.");
  }
});

btnForgot.addEventListener("click", async ()=>{
  clearError();
  const email = (authEmail.value||"").trim().toLowerCase();
  if(!emailValid(email)) return showError("Enter your email first.");
  try{
    await sendPasswordResetEmail(auth, email);
    showError("Password reset email sent.");
    authError.classList.remove("text-red-600");
    authError.classList.add("text-emerald-600");
    setTimeout(()=>{ authError.textContent=""; authError.classList.remove("text-emerald-600"); authError.classList.add("text-red-600"); }, 2500);
  }catch(e){
    showError("Could not send reset email.");
  }
});
