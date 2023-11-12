// Importa las funciones necesarias de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, setDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
    const loginForm = document.getElementById("loginForm");
    const btnSubmit = document.getElementById("btnEnviar");
    const btnCrearCuenta = document.getElementById("btnCrearCuenta"); // Nuevo botón

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    btnSubmit.addEventListener("click", login);

    // Nuevo event listener para el botón de crear cuenta
    btnCrearCuenta.addEventListener("click", redirectToCreateAccount);

    function redirectToCreateAccount() {
        // Redirige a la página de creación de cuenta
        window.location.href = "/html/createAcc.html";
    }

    // Función para manejar el inicio de sesión
    function login() {
        const email = document.getElementById("exampleInputEmail1").value;
        const password = document.getElementById("txtPassword").value;

        // Inicia sesión con Firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert(`Inicio de sesión exitoso. Usuario: ${user.email}`);

                // Obtiene el rol del usuario desde Firestore
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef)
                    .then((doc) => {
                        if (doc.exists()) {
                            const userData = doc.data();
                            const role = userData.role;
                            console.log("Rol del usuario:", role);

                            // Redirige a la página deseada según el rol
                            redirectToDashboard(role);
                        } else {
                            console.error("No se encontró información del usuario en Firestore");
                        }
                    })
                    .catch((error) => {
                        console.error("Error al obtener información del usuario:", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error al iniciar sesión: " + errorMessage);
            });
    }
});

// Función para redirigir a la página de acuerdo al rol
function redirectToDashboard(role) {
    if (role === "admin") {
        window.location.href = "/html/admin/Storage.html";
    } else {
        window.location.href = "/html/user/user.html";
    }
}

 // Función para crear un nuevo usuario en Firebase con un rol específico
 /*
 function createUser() {
    const email = document.getElementById("exampleInputEmail1").value;
    const password = document.getElementById("txtPassword").value;
    const role = document.getElementById("selectRole").value;

    // Crea el usuario en Firebase
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Usuario creado exitosamente. Usuario: " + user.displayName);
            
            // Guarda el rol en Firestore
            setDoc(doc(db, "users", user.uid), {
                role: role
            }).then(() => {
                console.log("Rol asignado correctamente");
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
*/