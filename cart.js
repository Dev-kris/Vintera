const api_url = 'http://localhost:3000/api/cameras/';
const params = new URLSearchParams(window.location.search);
const productNumber = params.toString().slice(3);
const buyButton = document.getElementById('add-cart-button');

let cartData = localStorage.key(0);


console.log(cartData);



async function getCameraImage() {

    const response = await fetch(api_url + cartData);
    const data = await response.json();

    const cameraImage = document.createElement('img');
    cameraImage.alt = 'Picture of a ' + data.name + ' camera';
    cameraImage.src = data.imageUrl;
    cameraImage.className = 'thumbnail-format';
    document.getElementById('cart-thumbnail').appendChild(cameraImage);

}

async function getCameraDetails() {
    const response = await fetch(api_url + cartData);
    const data = await response.json();
    
    

    const cameraName = document.createElement('p');
    cameraName.className = 'text-center text-light';
    cameraName.textContent = data.name;
    document.getElementById('camera-details').appendChild(cameraName);

    const price = document.createElement('p');
    price.className = 'text-left text-light';
    price.textContent = ' $ ' + parseFloat(data.price / 100);
    document.getElementById('camera-price').appendChild(price);
    
    const qty = parseInt(localStorage.getItem(cartData));
    document.getElementById('camera-qty').setAttribute('value', qty);
    
    console.log(qty);
   
    const lineSubtotal = qty * (data.price / 100);
    document.getElementById('camera-subtotal').innerHTML= lineSubtotal;
    
    console.log(lineSubtotal);
    
}






getCameraDetails();
getCameraImage();


//root.append(imgDiv, name, price, description, buyButton);
