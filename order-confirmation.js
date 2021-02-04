let orderNumber = document.getElementById('order-number');
let orderTotal = document.getElementById('order-total');

var orderTotalData = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));

function confirmationData(){
orderNumber.innerHTML = orderTotalData.orderId;
orderTotal.innerHTML = parseFloat(sessionStorage.key(0)).toFixed(2);
    
    clearData();
}

function clearData(){
    localStorage.clear();
    sessionStorage.clear();
}

confirmationData();

