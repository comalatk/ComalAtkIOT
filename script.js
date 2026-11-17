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

// GANTI DENGAN KONFIGURASI FIREBASE ANDA
const firebaseConfig = {
    apiKey: "API_KEY_ANDA",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Simpan Nama dan Role ke Firestore Database berdasarkan UID user
            await setDoc(doc(db, "users", user.uid), {
                nama: nama,
                email: email,
                role: role
            });

            tampilkanDashboard(user.uid);
        } else {
            // Proses Login
            await signInWithEmailAndPassword(auth, email, password);
        }
    } catch (error) {
        statusMsg.style.color = "red";
        statusMsg.innerText = error.message;
    }
}

window.handleLogout = function() {
    signOut(auth);
}

// Fungsi mengambil data Role dari Firestore dan menampilkan panel yang sesuai
async function tampilkanDashboard(uid) {
    const authSection = document.getElementById("auth-section");
    const dashboardSection = document.getElementById("dashboard-section");

    // Sembunyikan semua panel role terlebih dahulu
    document.getElementById("konten-owner").style.display = "none";
    document.getElementById("konten-admin").style.display = "none";
    document.getElementById("konten-karyawan").style.display = "none";

    // Ambil dokumen user dari koleksi "users" di Firestore
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("user-nama").innerText = data.nama;
        
        const badge = document.getElementById("user-role-badge");
        badge.innerText = data.role;
        badge.className = "badge badge-" + data.role;

        // Tampilkan konten sesuai role
        if (data.role === "owner") {
            document.getElementById("konten-owner").style.display = "block";
        } else if (data.role === "admin") {
            document.getElementById("konten-admin").style.display = "block";
        } else {
            document.getElementById("konten-karyawan").style.display = "block";
        }

        authSection.style.display = "none";
        dashboardSection.style.display = "block";
    }
}

// Pantau status login
onAuthStateChanged(auth, (user) => {
    if (user) {
        setTimeout(() => tampilkanDashboard(user.uid), 500);
    } else {
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("dashboard-section").style.display = "none";
        document.getElementById("status-msg").innerText = "";
    }
});
