let orderNumber = document.getElementById('order-number');
let orderTotal = document.getElementById('order-total');

var orderTotalData = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));

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
        const tableDataDivDetails = document.createElement('div');
        const tableDataQty = document.createElement('td');
        const tableDataPrice = document.createElement('td');
        const tableDataSubtotal = document.createElement('td');

        // set attributes to each element
        tableRow.id = 'table-row' + [i];
        tableData.id = 'table-row-data' + [i];
        tableDataDiv.id = 'cart-camera-details' + [i];
        tableDataDivDetails.id = 'camera-details' + [i];
        tableDataQty.id = 'table-data-qty' + [i];
        tableDataPrice.id = 'camera-price' + [i];
        tableDataSubtotal.id = 'camera-subtotal' + [i];

        // attach each new element to the page
        document.getElementById('cart-table').appendChild(tableRow);
        document.getElementById('table-row' + [i]).appendChild(tableData);
        document.getElementById('table-row-data' + [i]).appendChild(tableDataDiv);
        document.getElementById('cart-camera-details' + [i]).appendChild(tableDataDivDetails);
        document.getElementById('table-row' + [i]).appendChild(tableDataQty);
        document.getElementById('table-row' + [i]).appendChild(tableDataPrice);
        document.getElementById('table-row' + [i]).appendChild(tableDataSubtotal);
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
    confirmationData();

}


function confirmationData(){
orderNumber.innerHTML = orderTotalData.orderId;
orderTotal.innerHTML = parseFloat(sessionStorage.key(0)).toFixed(2);
    
    clearData();
}

function clearData(){
    localStorage.clear();
    sessionStorage.clear();
}

if (localStorage.length>0){
buildCartHTML();
    
}else{
    alert('Your cart is empty!');
}

