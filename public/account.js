// account.js
import { auth, db } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// UI
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginBox = document.getElementById("login-box");
const signupBox = document.getElementById("signup-box");
const loggedBox = document.getElementById("logged-in-box");
const loggedEmail = document.getElementById("logged-in-email");

// ---------------- LOGIN ----------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-pass").value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    alert(err.message);
  }
});

// ---------------- SIGNUP ----------------
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("signup-pass").value;

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    alert(err.message);
  }
});

// ---------------- CLOUD SAVE ----------------
document.getElementById("save-cloud").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const data = {
    accent: localStorage.getItem("s0laceAccent") || null,
    theme: localStorage.getItem("s0laceTheme") || null,
    bg: localStorage.getItem("s0laceBgMode") || null
  };

  await setDoc(doc(db, "users", user.uid), data);
  alert("Saved to cloud!");
});

// ---------------- CLOUD SYNC ----------------
document.getElementById("sync-cloud").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return alert("Nothing saved in cloud!");

  const data = snap.data();

  localStorage.setItem("s0laceAccent", data.accent);
  localStorage.setItem("s0laceTheme", data.theme);
  localStorage.setItem("s0laceBgMode", data.bg);

  alert("Synced — refresh the page.");
});

// ---------------- LOGOUT ----------------
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth);
});

// ---------------- AUTH STATE ----------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedEmail.textContent = "Logged in as " + user.email;
    loggedBox.style.display = "block";
    loginBox.style.display = "none";
    signupBox.style.display = "none";
  } else {
    loggedBox.style.display = "none";
    loginBox.style.display = "block";
    signupBox.style.display = "block";
  }
});
