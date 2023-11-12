// Configurar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCQunqW7Mpvu1DB8rHf0-OiSLMgt8u1Qxw",
    authDomain: "proyectofinal-67f34.firebaseapp.com",
    projectId: "proyectofinal-67f34",
    storageBucket: "proyectofinal-67f34.appspot.com",
    messagingSenderId: "444985429",
    appId: "1:444985429:web:f2efd8685909bccf9724dc"
};

firebase.initializeApp(firebaseConfig);

// Referencia a la colección de productos en Firestore
const productsCollection = firebase.firestore().collection('products');

// Obtener y mostrar solo los productos habilitados
const productsContainer = document.getElementById('productsContainer');

productsCollection.where('status', '==', 0).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const statusClass = data.status === 1 ? 'product-status-agotado' : 'product-status-disponible';
            productCard.innerHTML = `
                <img src="${data.imageUrl}" alt="${data.name}">
                <h3>${data.name}</h3>
                <hr>
                <p>Código: ${data.code}</p>
                <p>Precio:  ${data.price.toFixed(0)} <img src="/img/Credits_icon.webp" alt="Precio" class="product-image"></p> <!-- Agregar la imagen de precio -->
            `;
            productsContainer.appendChild(productCard);
        });
    })
    .catch((error) => {
        console.error('Error al obtener los productos:', error);
    });
