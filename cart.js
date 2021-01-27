const api_url = 'http://localhost:3000/api/cameras/';
const params = new URLSearchParams(window.location.search);
const productNumber = params.toString().slice(3);
const buyButton = document.getElementById('add-cart-button');

var e = document.getElementById("product-option");
var value = e.options[e.selectedIndex].value;
var text = e.options[e.selectedIndex].text;
console.log(value);


const cart = {
    key: 'cart-contents',
    contents: [],
    init() {
        //check local storage and initialize the contents of cart.contents
        let _contents = localStorage.getItem(cart.key);
        if (_contents) {
            cart.contents = JSON.parse(_contents);
        } else {
            //dummy test data, use empty array for next step
            cart.contents = [
                {
                    id: 1,
                    title: 'apple',
                    qty: 5,
                    itemPrice: 0.85
                },
                {
                    id: 2,
                    title: 'bananna',
                    qty: 3,
                    itemPrice: 0.35
                },
                {
                    id: 3,
                    title: 'cherry',
                    qty: 8,
                    itemPrice: 0.05
                }
                ];
        }
    },
    async sync() {
        let _cart = JSON.stringify(cart.contents);
        await localStorage.setItem(cart.key, _cart);
    },
    find(id) {
        //find an item in the cart by it's id
        let match = cart.contents.filter(items => {
            if (item.id == id)
                return true;
        });
        if (match && match)
            return match[0];
    },
    add(id) {

        // add a new item to cart
        // check for duplicate items
        if (cart.find(id)) {
            cart.increase(id, 1);
        } else {
            let arr = PRODUCTS.filter(product => {
                if (product.id == id) {
                    return true;
                }
            });
            if (arr && arr[0]) {
                let obj = {
                    id: arr[0].id,
                    title: arr[0].title,
                    qty: 1,
                    itemPrice: arr[0].itemPrice
                };
                cart.contents.push(obj);
                // update localstorage
                cart.sync();
            } else {
                // product id does not exist
                console.error('invalid product');
            }
        }
    },
    increase(id, qty = 1) {
        // increase the quantity of item
        cart.contents = cart.contents.map(item => {
            if (item.id === id)
                item.qty = item.qty + qty;
            return item;
        });
        // update localstorage
        cart.sync()

    },
    reduce(id, qty = 1) {
        // reduce the quantity of an item
        cart.contents = cart.contents.map(item => {
            if (item.id === id)
                item.qty = item.qty - qty;
            return item;
        });
        cart.contents.forEach(async item => {
            if (item.id === id && item.qty === 0)
                cart.remove(id);
        });
        cart.sync()
    },
    remove(id) {
        // empty the cart
        cart.contents = [];
        // update localstorage
        cart.sync();
    },
    sort(field = 'title') {
        // sort by field - title, price
        // return sorted copy of cart.contents array

        let sorted = cart.contents.sort((a, b) => {
            if (a[field] > b[field]) {
                return 1;
            } else if (a[field] < a[field]) {
                return -1;

            } else {
                return 0;
            }
        });
        return sorted;
        // does not change localstorage
    },

    logContents(prefix) {
        console.log(prefix, cart.contents)
    }
};

let PRODUCTS = [];


document.addEventListener('DOMContentLoaded', () => {
    //when the page is ready
    getProducts(showProducts, errorMessage);
    //get the cart items from localStorage
    cart.init();
    //load the cart items
    // showCart();
});
async function getCameraDetails() {
    const response = await fetch(api_url + productNumber);
    const data = await response.json();

    document.getElementById('product-name').innerHTML = data.name;
    document.getElementById('product-price').innerHTML = '$ ' + data.price / 100;
    document.getElementById('product-details').innerHTML = data.description;

}


function getProducts(success, failure) {
    //request the list of products from the "server"
    const api_url = 'http://localhost:3000/api/cameras/';
    const params = new URLSearchParams(window.location.search);
    const productNumber = params.toString().slice(3);
    //const URL = api_url + productNumber;
    const URL = api_url + productNumber;
    fetch(URL, {
            method: 'GET',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(showProducts)
        .catch(err => {
            errorMessage(err.message);
        });
    console.log(api_url, productNumber);
}

async function getCamaraLenses() {
    const response = await fetch(api_url + productNumber);
    const data = await response.json();

    data.lenses.forEach((lens) => {
        let lensOption = document.createElement("option");

        document.getElementById('product-option').appendChild(lensOption).innerHTML = lens;
    })

}

function showProducts(products) {
    PRODUCTS = products;
    // take data.products and display inside id products
    let imgPath = './images';
    let productSection = document.getElementById('products');
    productSection.innerHTML = '';
    products.forEach(product => {
        let card = document.createElement('div');
        card.className = 'card';
        // add image
        let img = document.createElement('img');
        img.alt = 'picture of a ' + product.title + ' camera';
        img.src = data.imageUrl;
        img.className = 'camera-details-img';
        card.appendChild(img);
        // add price
        let price = document.createElement('p');
        price.textContent = product.itemPrice / 100;

        // add title 
        let title = document.createElement('h2');
        title.textContent = product.title;
        card.appendChild(title);

        // add description
        let description = document.createElement('p');
        description.textContent = product.description;
        card.appendChild(description);

        // add button
        let buyButton = document.createElement('button');
        buyButton.className = 'btn';
        buyButton.textContent = 'Add Item';
        buyButton.setAttribute('data-id', product.id);
        buyButton.addEventListener('click', addItem);
        card.appendChild(buyButton);

        // add card to page
        productSection.appendChild(card);

    })
}

function addItem(ev) {
    ev.preventDefault();
    let id = ev.target.getAttribute('data-id');
    console.log('add to item to cart', id);
    cart.add(id, 1);
    //showCart
}

function errorMessage(err) {
    console.error(err);
}
buyButton.addEventListener('click', (event) => {

    if (value === '1') {
        swal("Please select a lens!", "", 'error');
    } else {
        localStorage.setItem(productNumber, value);
        console.log(productNumber);
        swal("Camera Added to Cart!", "", 'success');
    }
});




console.log(localStorage);
console.log('product number is ' + productNumber);