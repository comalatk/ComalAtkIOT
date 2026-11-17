import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// KONFIGURASI FIREBASE PROYEK ANDA (camalatktiot10)
const firebaseConfig = {
    apiKey: "MASUKKAN_API_KEY_ANDA_DARI_FIREBASE_CONSOLE",
    authDomain: "camalatktiot10.firebaseapp.com",
    projectId: "camalatktiot10",
    storageBucket: "camalatktiot10.appspot.com",
    messagingSenderId: "MASUKKAN_MESSAGING_SENDER_ID",
    appId: "MASUKKAN_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let isRegisterMode = false;

window.toggleForm = function() {
    isRegisterMode = !isRegisterMode;
    document.getElementById("form-title").innerText = isRegisterMode ? "Registrasi Akun" : "Login Sistem";
    document.getElementById("submit-btn").innerText = isRegisterMode ? "Daftar" : "Masuk";
    document.getElementById("toggle-form-btn").innerText = isRegisterMode ? "Sudah punya akun? Login" : "Belum punya akun? Daftar di sini";
    document.getElementById("register-fields").style.display = isRegisterMode ? "block" : "none";
    document.getElementById("status-msg").innerText = "";
}

window.handleSubmit = async function() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const statusMsg = document.getElementById("status-msg");
    statusMsg.style.color = "blue";
    statusMsg.innerText = "Memproses...";

    try {
        if (isRegisterMode) {
            const nama = document.getElementById("nama").value.trim();
            const role = document.getElementById("role").value;

            if (!nama) {
                throw new Error("Nama lengkap wajib diisi!");
            }

            // 1. Buat akun di Firebase Auth
            const userCredential = await createUserWith
