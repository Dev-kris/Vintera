const params = new URLSearchParams(window.location.search);
const productNumber = params.toString().slice(3);
const buyButton = document.getElementById('add-cart-button');


async function buildCartHTML() {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        let cameraKeyToRemove = key;

        const response = await fetch(api_url);
        const data = await response.json();

        // create cart table structure for each item
        const tableRow = document.createElement('tr');
        const tableData = document.createElement('td');
        const tableDataDiv = document.createElement('div');
        const tableDataDivImg = document.createElement('a');
        const tableDataDivDetails = document.createElement('div');
        const tableDataQty = document.createElement('td');
        const tableDataPrice = document.createElement('td');
        const tableDataSubtotal = document.createElement('td');
        const removeButton = document.createElement('td');
        const removeButtonBtn = document.createElement('button');

        // set attributes to each element
        tableRow.id = 'table-row' + [i];
        tableData.id = 'table-row-data' + [i];
        tableDataDiv.id = 'cart-camera-details' + [i];
        tableDataDivImg.id = 'cart-thumbnail' + [i];
        tableDataDivImg.href = 'camera.html' + '?id=' + key;
        tableDataDivDetails.id = 'camera-details' + [i];
        tableDataQty.id = 'table-data-qty' + [i];
        tableDataPrice.id = 'camera-price' + [i];
        tableDataSubtotal.id = 'camera-subtotal' + [i];
        removeButton.id = 'remove-td' + [i];
        removeButtonBtn.id = 'remove-tdd' + [i];

        // add button to each product to allow removal
        removeButtonBtn.className = 'btn filter-red btn-remove-cart';
        removeButton.addEventListener('click', function () {
            localStorage.removeItem(cameraKeyToRemove);
            location.reload();
        });


        // attach each new element to the page
        document.getElementById('cart-table').appendChild(tableRow);
        document.getElementById('table-row' + [i]).appendChild(tableData);
        document.getElementById('table-row-data' + [i]).appendChild(tableDataDiv);
        document.getElementById('cart-camera-details' + [i]).appendChild(tableDataDivImg);
        document.getElementById('cart-camera-details' + [i]).appendChild(tableDataDivDetails);
        document.getElementById('table-row' + [i]).appendChild(tableDataQty);
        document.getElementById('table-row' + [i]).appendChild(tableDataPrice);
        document.getElementById('table-row' + [i]).appendChild(tableDataSubtotal);
        document.getElementById('table-row' + [i]).appendChild(removeButton);
        document.getElementById('remove-td' + [i]).appendChild(removeButtonBtn);

    }
    await getCameraImage();
}
async function getCameraImage() {

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);

        const response = await fetch(api_url + key);
        const data = await response.json();

        const cameraImage = document.createElement('img');
        cameraImage.alt = 'Picture of a ' + data.name + ' camera';
        cameraImage.src = data.imageUrl;
        cameraImage.className = 'thumbnail-format';
        document.getElementById('cart-thumbnail' + [i]).appendChild(cameraImage);
    }
    await getCameraDetails();

}


async function getCameraDetails() {

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        const response = await fetch(api_url + key);
        const data = await response.json();

        const cameraName = document.createElement('p');
        cameraName.className = 'text-light';
        cameraName.textContent = data.name;
        document.getElementById('camera-details' + [i]).appendChild(cameraName);

        const price = data.price / 100;
        document.getElementById('camera-price' + [i]).innerHTML = '$ ' + price;

        const qty = parseInt(localStorage.getItem(key));
        document.getElementById('table-data-qty' + [i]).innerHTML = qty;
        //document.getElementById('camera-qty' + [i]).setAttribute('value', qty);

        const lineSubtotal = qty * (data.price / 100);
        document.getElementById('camera-subtotal' + [i]).innerHTML = '$ ' + lineSubtotal;

    }
    await getCartTotals();

}
async function getCartTotals() {

    let testTotal = 0;
    let cartSubtotal = 0;

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        const response = await fetch(api_url + key);
        const data = await response.json();

        const qty = parseInt(localStorage.getItem(key));
        const subtotal = qty * (data.price / 100);

        cartSubtotal += subtotal;
    }
    let cartTax = cartSubtotal * .2;
    var cartTotal = cartSubtotal + cartTax;
    testTotal += cartTotal;


    document.getElementById('subtotal-data').innerHTML = '$ ' + cartSubtotal.toFixed(2);
    document.getElementById('tax-data').innerHTML = '$ ' + cartTax.toFixed(2);
    document.getElementById('total-data').innerHTML = '$ ' + cartTotal.toFixed(2);
    return testTotal;
}
// console.log('The test total is ' + testTotal);
// form validation


(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('change', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    document.getElementById("order-submit-btn").disabled = true;

                } else {
                    console.log('validation test');
                    document.getElementById("order-submit-btn").disabled = false;

                }

                form.classList.add('was-validated')
            }, false)
        })
})()

// post cart and form data to api



let cartTotal = document.getElementById('total-data').textContent;


async function postOrder() {

    let testTotalTwo = await getCartTotals();
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let address = document.getElementById('address').value;
    let country = document.getElementById('country').value;
    let city = document.getElementById('city').value;
    let postCode = document.getElementById('postCode').value;
    let email = document.getElementById('email').value;

    let products = [];
    let cartTotalConfirmation = 0;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);

        const response = await fetch(api_url + key);
        const data = await response.json();

        products.push(key);

        const qty = parseInt(localStorage.getItem(key));
        const cartTotal = qty * (data.price / 100);
        cartTotalConfirmation += cartTotal * 1.2;
    }

    let contact = {
        lastName,
        firstName,
        address,
        city,
        email,
    }
    let order = {
        contact,
        products,
    }
    let jsonOrder = JSON.stringify(order);

    // set variables in separate js file --- look at environment variable

    let http = new XMLHttpRequest();
    http.onload = function () {
        sessionStorage.setItem(cartTotalConfirmation, http.responseText);
        window.location = "./confirmation.html";
        console.log(sessionStorage);
    };

    http.open("POST", post_url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(jsonOrder);
}


if (localStorage.length > 0) {
    buildCartHTML();

} else {
    swal("Your cart is empty!", "", 'error');

}
