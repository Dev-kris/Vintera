const api_url = 'http://localhost:3000/api/cameras/';
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
        //const tableDataQtyInput = document.createElement('input');
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
       // tableDataQtyInput.id = 'camera-qty' + [i];
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
        //document.getElementById('table-data-qty' + [i]).appendChild(tableDataQtyInput);
        document.getElementById('table-row' + [i]).appendChild(tableDataPrice);
        document.getElementById('table-row' + [i]).appendChild(tableDataSubtotal);
        document.getElementById('table-row' + [i]).appendChild(removeButton);
        document.getElementById('remove-td' + [i]).appendChild(removeButtonBtn);

    }
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
}
async function getCartTotals() {

    let cartSubtotal = 0;

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        const response = await fetch(api_url + key);
        const data = await response.json();

        const qty = parseInt(localStorage.getItem(key));
        const subTotal = qty * (data.price / 100);

        cartSubtotal += subTotal;
    }
    let cartTax = cartSubtotal * .2;
    let cartTotal = cartSubtotal + cartTax;

    document.getElementById('subtotal-data').innerHTML = '$ ' + cartSubtotal.toFixed(2);
    document.getElementById('tax-data').innerHTML = '$ ' + cartTax.toFixed(2);
    document.getElementById('total-data').innerHTML = '$ ' + cartTotal.toFixed(2);

}





getCartTotals();
buildCartHTML();
getCameraDetails();
getCameraImage();
