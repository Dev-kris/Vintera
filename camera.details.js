const api_url = 'http://localhost:3000/api/cameras/';
const params = new URLSearchParams(window.location.search);
const productNumber = params.toString().slice(3);
const buyButton = document.getElementById('add-cart-button');


//console.log(value);

async function getCameraImage() {

    const response = await fetch(api_url + productNumber);
    const data = await response.json();

    const cameraImage = document.createElement('img')
    cameraImage.alt = 'Picture of a ' + data.name + ' camera';
    cameraImage.src = data.imageUrl;
    cameraImage.className = 'camera-details-img';


    document.getElementById('product-image').appendChild(cameraImage);
}

async function getCameraDetails() {
    const response = await fetch(api_url + productNumber);
    const data = await response.json();

    document.getElementById('product-name').innerHTML = data.name;
    document.getElementById('product-price').innerHTML = '$ ' + data.price / 100;
    document.getElementById('product-details').innerHTML = data.description;

}

async function getCamaraLenses() {
    const response = await fetch(api_url + productNumber);
    const data = await response.json();

    data.lenses.forEach((lens) => {
        let lensOption = document.createElement("option");

        document.getElementById('product-option').appendChild(lensOption).innerHTML = lens;
    });

}


let cameraLensField = document.getElementById("product-option");
let cameraLensSelection = cameraLensField.options[cameraLensField.selectedIndex].value;
let text = cameraLensField.options[cameraLensField.selectedIndex].text;


function getCameraLensSelection(sel) {

    cameraLensSelection = sel.options[sel.selectedIndex].text;
    console.log(cameraLensSelection);
}





buyButton.addEventListener('click', (event) => {


    let qty = parseInt(document.getElementById('qty').value);
    let qtyInteger = parseInt(localStorage.getItem(productNumber)) || '';
    let qtyTotal = qty + qtyInteger;


    if (cameraLensSelection === '1') {
        swal("Please select a lens!", "", 'error');
    } else {
        localStorage.setItem(productNumber, qtyTotal);

        swal("Camera Added to Cart!", "", 'success');

    }
});







console.log(localStorage);
//console.log('product number is ' + productNumber);


getCameraLensSelection;
getCamaraLenses();
getCameraDetails();
getCameraImage();
