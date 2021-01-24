const api_url = 'http://localhost:3000/api/cameras/';
const params = new URLSearchParams(window.location.search);
const productNumber = params.toString().slice(3);



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

async function getCameraBuyButton() {
    const response = await fetch(api_url + productNumber);
    const data = await response.json();

    const buyButton = document.createElement('a');
    buyButton.className = 'btn buy text-warning';
    buyButton.href = 'camera.html?id=' + data._id;
    buyButton.textContent = 'More Info';
}





console.log('product number is ' + productNumber);

getCamaraLenses();
getCameraDetails();
getCameraImage();
