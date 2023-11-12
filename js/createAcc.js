// create-account.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, setDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCQunqW7Mpvu1DB8rHf0-OiSLMgt8u1Qxw",
    authDomain: "proyectofinal-67f34.firebaseapp.com",
    projectId: "proyectofinal-67f34",
    storageBucket: "proyectofinal-67f34.appspot.com",
    messagingSenderId: "444985429",
    appId: "1:444985429:web:f2efd8685909bccf9724dc"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.addEventListener("DOMContentLoaded", function () {
    const createAccountForm = document.getElementById("createAccountForm");
    const btnCrearCuenta = document.getElementById("btnCrearCuenta");

    createAccountForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    btnCrearCuenta.addEventListener("click", createAccount);

    function createAccount() {
        const email = document.getElementById("exampleInputEmail1").value;
        const password = document.getElementById("txtPassword").value;
        const role = document.getElementById("selectRole").value;

        // Crea el usuario en Firebase
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("Usuario creado exitosamente. Usuario: " + user.displayName);

                // Guarda el rol en Firestore
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    role: role
                }).then(() => {
                    console.log("Documento del usuario creado exitosamente");

                    // Redirige a la página deseada según el rol
                    window.location.href = "/html/loginP.html";
                    
                }).catch((error) => {
                    console.error("Error al asignar el rol:", error);
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error al crear usuario: " + errorMessage);
            });
        }
    
        // Función para redirigir a la página de acuerdo al rol
        /*function redirectToDashboard(role) {
            if (role === "admin") {
                window.location.href = "/html/admin/admin.html";
            } else {
                window.location.href = "/html/user/user.html";
            }
        }*/
    });
    
