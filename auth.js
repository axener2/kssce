import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const { auth, db } = window.__APP__;

const openAuthBtn = document.getElementById("open-auth");
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
const btnCancel = document.getElementById("btn-cancel");
const authError = document.getElementById("auth-error");

const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");
const btnSignout = document.getElementById("btn-signout");

const appMain = document.getElementById("app");

openAuthBtn?.addEventListener("click", () => {
  authModal.showModal();
});

btnCancel?.addEventListener("click", () => {
  authModal.close();
});

btnSignup?.addEventListener("click", async () => {
  authError.textContent = "";
  const email = document.getElementById("auth-email").value.trim().toLowerCase();
  const password = document.getElementById("auth-password").value;
  if(!email || !password){ return; }
  try{
    // Check allowlist BEFORE creating account
    const allowRef = doc(getFirestore(), "allowlist", email);
    const allowSnap = await getDoc(allowRef);
    if(!allowSnap.exists()){
      throw new Error("This email is not on the allow‑list. Contact admin.");
    }
    await createUserWithEmailAndPassword(getAuth(), email, password);
  }catch(err){
    // Don't leak internal messages; show safe error
    authError.textContent = (err && err.message && err.message.includes("allow")) 
      ? err.message 
      : "Invalid credentials or account creation blocked.";
  }
});

btnLogin?.addEventListener("click", async () => {
  authError.textContent = "";
  const email = document.getElementById("auth-email").value.trim().toLowerCase();
  const password = document.getElementById("auth-password").value;
  if(!email || !password){ return; }
  try{
    await signInWithEmailAndPassword(getAuth(), email, password);
  }catch(err){
    authError.textContent = "Invalid login credentials.";
  }
});

btnSignout?.addEventListener("click", async () => {
  await signOut(getAuth());
});

onAuthStateChanged(auth, async (user) => {
  if(user){
    // Post‑sign‑in allowlist gate (and protects access if someone signs up via API)
    const email = (user.email || "").toLowerCase();
    const allowRef = doc(getFirestore(), "allowlist", email);
    const allowSnap = await getDoc(allowRef);

    if(!allowSnap.exists()){
      // Not allow‑listed; force sign‑out
      await signOut(getAuth());
      return;
    }

    userInfo.classList.remove("hidden");
    userEmail.textContent = email;
    openAuthBtn.classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
  }else{
    userInfo.classList.add("hidden");
    userEmail.textContent = "";
    openAuthBtn.classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
  }
});
