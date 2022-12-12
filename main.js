//fetch('https://api.escuelajs.co/api/v1/products').then(result => result.json()).then(data => console.log(data));

// Variables Iniciales:
let shoppingCartArray = [];
let total = 0;
let productContainer = document.querySelector('.shop-items');
let totalElement = document.querySelector('.cart-total-title');

// Peticion de productos al servidor:

let result = await fetch('https://api.escuelajs.co/api/v1/products')
let data = await result.json()


// Limitamos a 10 productos
let productsArray = data.slice(30,41)
//console.log(productsArray);


// Imprimir los productos en pantalla
productsArray.forEach(product => {
    productContainer.innerHTML += `
    <div class="shop-item" id="${product.id}">
        <span class="shop-item-title">${product.title}</span>
        <img class="shop-item-image" src="${product.images[0]}">
        <div class="shop-item-details">
            <span class="shop-item-price">$${product.price}</span>
            <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
    </div>
</div>`
});

//Se escucha cuando se hace Click en un boton ADD

let addBtns = document.querySelectorAll('.shop-item-button');
addBtns = [...addBtns];

let cartContainer = document.querySelector('.cart-items')

addBtns.forEach(btn => {
    btn.addEventListener('click', event => {
        //Agregar productos al carro

        //Buscar el ID del Producto
        let actualID = parseInt(event.target.parentNode.parentNode.id)
        console.log(actualID);

        // Con el ID encontrar el objecto Actual
        let actualProduct = productsArray.find(item => item.id == actualID)
        
           if (actualProduct.quantity === undefined) {
            actualProduct.quantity = 1;
           }     

            // Preguntar si el producto que estoy agregando, Ya existe
            
            let exist = false
            shoppingCartArray.forEach(produ => {
               if (actualID == produ.id){
                exist = true
               }
            })
            if (exist) {
                actualProduct.quantity++
            }else{
                shoppingCartArray.push(actualProduct)
            }

            
        console.log(shoppingCartArray)
            //Dibujar en el DOM el Arreglo de compras Actualizado
            drawItems()
            
        // Actualizar el Valor Total
        getTotal()

        //console.log(total);
        updateNumberOfItems()

        removeItems()
    });
});

function getTotal() {
    let sumTotal
    let total = shoppingCartArray.reduce( (sum, item) => {
        sumTotal = sum + item.quantity*item.price
        return sumTotal
    }, 0);
    totalElement.innerText = `$${total}`
}

function drawItems() {
    cartContainer.innerHTML = '';

            shoppingCartArray.forEach(item => {
            cartContainer.innerHTML +=  `
            <div class="cart-row">
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${item.images[0]}" width="100" height="100">
                    <span class="cart-item-title">${item.title}</span>
                </div>
                <span class="cart-price cart-column">$${item.price}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" min="1" type="number" value="${item.quantity}">
                    <button class="btn btn-danger" type="button">REMOVE</button>
                </div>
            </div>`
        });
        removeItems()
}

function updateNumberOfItems(){
    let  inputNumber = document.querySelectorAll('.cart-quantity-input');
    inputNumber = [...inputNumber];


    inputNumber.forEach(item => {
        item.addEventListener('click', event => {
            // Conseguir el titulo del producto
            let actualProductTitle = event.target.parentElement.parentElement.childNodes[1].innerText;
            let actualProductQuantity = parseInt(event.target.value);
            console.log(actualProductQuantity);
            
            //Busco el obejto con ese titulo
            let actualProductObject = shoppingCartArray.find(item => item.title == actualProductTitle)
                console.log(actualProductObject);

            //Actualizar el numero de la quantity
            actualProductObject.quantity = actualProductQuantity;

            //Actualizar el precio del total
            getTotal()
        })
    });
    
}

function removeItems(){
    let removeBtns = document.querySelectorAll('.btn-danger');
    removeBtns = [...removeBtns];
    removeBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            // Conseguir el titulo del producto
            let actualProductTitle = event.target.parentElement.parentElement.childNodes[1].innerText;

            //Busco el obejto con ese titulo
            let actualProductObject = shoppingCartArray.find(item => item.title == actualProductTitle)

            //Remover el arreglo de productos del cart
            shoppingCartArray = shoppingCartArray.filter(item => item != actualProductObject)
            console.log(shoppingCartArray);

            //Actualizar el precio del total
            drawItems()
            
            // Actualizar el Valor Total
            getTotal()
            updateNumberOfItems()
        });
    });
    
    
}