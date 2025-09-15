import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const statusBar = document.getElementById("auth-status");
const panel = document.getElementById("auth-panel");
const btnAuth = document.getElementById("btn-auth");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const forgotLink = document.getElementById("forgot-link");
const appMain = document.getElementById("app");

let mode = "login";
document.querySelectorAll(".auth-tab").forEach(b=>{
  b.addEventListener("click", ()=>{
    document.querySelectorAll(".auth-tab").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    mode = b.dataset.mode;
    btnAuth.textContent = mode === "login" ? "Sign in" : "Create account";
    authError.textContent = "";
  });
});

function setLoading(yes){
  btnAuth.disabled = yes;
  btnAuth.textContent = yes ? (mode==="login"?"Signing in…":"Creating…") : (mode==="login"?"Sign in":"Create account");
}

function renderSignedIn(email){
  statusBar.innerHTML = \`<span class="chip">Signed in as \${email}</span> <button class="btn small" id="btn-logout">Sign out</button>\`;
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

// DEMO MODE: show app without login
if (window.DEMO_MODE) {
  const brand = document.querySelector(".subtitle");
  brand.textContent += " • Demo mode (no login / no save)";
  renderSignedIn("demo@example.com");
} else {
  const { auth, db } = window.__APP__ || {};

  onAuthStateChanged(auth, (user) => {
    if (user) renderSignedIn((user.email||"").toLowerCase());
    else renderSignedOut();
  });

  btnAuth.addEventListener("click", async () => {
    authError.textContent = "";
    const email = (authEmail.value || "").trim().toLowerCase();
    const pass = authPassword.value || "";
    if(!email || !pass){ authError.textContent = "Enter email and password."; return; }
    setLoading(true);
    try{
      if(mode==="login"){
        await signInWithEmailAndPassword(auth, email, pass);
      }else{
        // Check allowlist before account creation
        const allowRef = doc(getFirestore(), "allowlist", email);
        const allowSnap = await getDoc(allowRef);
        if(!allowSnap.exists()) throw new Error("This email is not on the allow-list.");
        await createUserWithEmailAndPassword(auth, email, pass);
      }
    }catch(e){
      const msg = (e && e.message && e.message.includes("allow-list")) ? e.message : "Invalid credentials or action not permitted.";
      authError.textContent = msg;
    }finally{
      setLoading(false);
    }
  });

  forgotLink.addEventListener("click", async (ev)=>{
    ev.preventDefault();
    authError.textContent = "";
    const email = (authEmail.value||"").trim().toLowerCase();
    if(!email){ authError.textContent = "Enter your email first."; return; }
    try{
      await sendPasswordResetEmail(auth, email);
      authError.style.color = "#16a34a";
      authError.textContent = "Password reset email sent (check inbox/spam).";
    }catch(e){
      authError.style.color = "";
      authError.textContent = "Could not send reset email.";
    }
  });
}
