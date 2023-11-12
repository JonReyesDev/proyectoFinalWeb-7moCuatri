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

// Referencias a Firebase Storage y Firestore
const storage = firebase.storage();
const storageRef = storage.ref();
const firestore = firebase.firestore();

// Referencia a la colección de productos en Firestore
const productsCollection = firestore.collection('products');

// Función para subir una imagen a Firebase Storage
function uploadImage(file) {
    const imageName = new Date().getTime() + '-' + file.name;
    const imageRef = storageRef.child(`images/${imageName}`);
    return imageRef.put(file)
        .then((snapshot) => {
            return snapshot.ref.getDownloadURL();
        });
}

// Función para agregar un producto a Firestore con imagen
function addProductToFirestore(code, name, price, imageUrl, status) {
    // Verificar si ya existe un producto con el mismo código
    return productsCollection.where('code', '==', code).get()
        .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
                throw new Error('El código ya está en uso. Por favor, elige un código diferente.');
            } else {
                // Si el código no está en uso, agregar el producto
                return productsCollection.add({
                    code: code,
                    name: name,
                    price: price,
                    imageUrl: imageUrl,
                    status: 0
                });
            }
        });
}

// Función para buscar y mostrar un producto por código
function searchProductByCode(code) {
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = ''; // Limpiar el contenedor antes de mostrar resultados

    productsCollection.where('code', '==', code).get()
        .then((querySnapshot) => {
            if (querySnapshot.size === 0) {
                alert('No se encontró ningún producto con el código proporcionado.');
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const statusClass = data.status === 1 ? 'product-status-disabled' : 'product-status-enabled';

                    // Configurar el atributo data-status en el botón
                    const status = data.status === 1 ? 1 : 0;
                    productDetails.innerHTML = `
                        <h2>Producto Consultado</h2>
                        <img src="${data.imageUrl}" alt="${data.name}">
                        <h3>${data.name}</h3>
                        <p>Código: ${data.code}</p>
                        <p>Precio: $${data.price.toFixed(2)}</p>
                        <p>Estado: <span class="${statusClass}">${data.status === 1 ? 'Deshabilitado' : 'Habilitado'}</span></p>
                        <button id="toggleStatusButton" data-status="${status}">${data.status === 1 ? 'Habilitar Producto' : 'Deshabilitar Producto'}</button>
                    `;

                    // Agregar evento para cambiar el estado
                    const toggleStatusButton = document.getElementById('toggleStatusButton');
                    toggleStatusButton.addEventListener('click', () => {
                        toggleProductStatus(doc, data.status);
                    });
                });
            }
        })
        .catch((error) => {
            alert('Error al buscar el producto: ' + error.message);
        });
}

// Función para cambiar el estado del producto
function toggleProductStatus(doc, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Actualizar el estado en Firestore
    doc.ref.update({ status: newStatus })
        .then(() => {
            alert('Estado del producto actualizado con éxito.');
            // Refrescar la vista del producto
            searchProductByCode(doc.data().code);
        })
        .catch((error) => {
            alert('Error al actualizar el estado del producto: ' + error.message);
        });
}

// Manejar el envío del formulario de búsqueda
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchCode = document.getElementById('searchCode').value;

    if (searchCode) {
        searchProductByCode(searchCode);
    } else {
        alert('Por favor, ingresa un código de producto.');
    }
});

// Agregar evento para manejar la actualización de producto
const updateProductForm = document.getElementById('updateProductForm');
updateProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchCode = document.getElementById('searchCode').value;
    const newProductName = document.getElementById('updateProductName').value;
    const newProductPrice = parseFloat(document.getElementById('updateProductPrice').value);

    if (newProductName && !isNaN(newProductPrice)) {
        // Buscar el producto por código y actualizar los campos
        productsCollection.where('code', '==', searchCode).get()
            .then((querySnapshot) => {
                if (querySnapshot.size === 0) {
                    alert('No se encontró ningún producto con el código proporcionado.');
                } else {
                    querySnapshot.forEach((doc) => {
                        // Actualizar el nombre y el precio en Firestore
                        doc.ref.update({
                            name: newProductName,
                            price: newProductPrice
                        }).then(() => {
                            alert('Producto actualizado con éxito.');
                            // Refrescar la vista del producto
                            searchProductByCode(searchCode);
                        }).catch((error) => {
                            alert('Error al actualizar el producto: ' + error.message);
                        });
                    });
                }
            })
            .catch((error) => {
                alert('Error al buscar el producto: ' + error.message);
            });
    } else {
        alert('Por favor, completa los campos de nombre y precio correctamente.');
    }
});


// Manejar el envío del formulario
const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productCode = document.getElementById('productCode').value;
    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productImage = document.getElementById('productImage').files[0];

    if (productCode && productName && !isNaN(productPrice) && productImage) {
        // Subir la imagen a Firebase Storage
        uploadImage(productImage)
            .then((imageUrl) => {
                // Agregar el producto a Firestore
                return addProductToFirestore(productCode, productName, productPrice, imageUrl);
            })
            .then(() => {
                alert('Producto agregado con éxito.');
                productForm.reset();
            })
            .catch((error) => {
                alert('Error al agregar el producto: ' + error.message);
            });
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
});


