const api_url = 'http://localhost:3000/api/cameras/';
const params = new URLSearchParams(window.location.search);
const productNumber = params.toString().slice(3);
const buyButton = document.getElementById('add-cart-button');

var e = document.getElementById("product-option");
var value = e.options[e.selectedIndex].value;
var text = e.options[e.selectedIndex].text;
console.log(value);

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
    })

}

function getCameraLensSelection(sel) {

    value = sel.options[sel.selectedIndex].text;
    console.log(value);
}


// Local Storage 



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


getCameraLensSelection;
getCamaraLenses();
getCameraDetails();
getCameraImage();
