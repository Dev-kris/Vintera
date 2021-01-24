const api_url = 'http://localhost:3000/api/cameras/';

async function getProducts() {
    const response = await fetch(api_url);
    const data = await response.json();

    for (item of data) {
        const root = document.createElement('div');
        root.className = 'col-md-4 product-grid';

        const imgDiv = document.createElement('div');
        imgDiv.className = 'image';

        const name = document.createElement('h5');
        name.className = 'text-center text-light';
        name.textContent = item.name;
        
        const price = document.createElement('h5');
        price.className = 'text-center text-light';        
        price.textContent = ' $ ' + parseFloat(item.price/100);

        const description = document.createElement('p');
        description.className = 'text-center text-white';
        description.textContent = item.description;

        const imageLink = document.createElement('a');
        imageLink.href = 'camera.html' + '?id=' + item._id;

        const image = document.createElement('img');
        image.alt = 'Picture of a ' + item.name + ' camera';
        image.className = 'w-100';
        image.src = item.imageUrl;

        const buyButton = document.createElement('a');
        buyButton.className = 'btn buy text-warning';
        buyButton.href = 'camera.html?id=' + item._id;
        buyButton.textContent = 'More Info';

        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const overlayDetails = document.createElement('div');
        overlayDetails.className = 'detail';
        overlayDetails.textContent = 'More Info...';




        imgDiv.append(imageLink);
        overlay.append(overlayDetails);
        imageLink.append(overlay);
        imageLink.append(image);
        root.append(imgDiv, name, price, description, buyButton);




        document.getElementById('row').appendChild(root);


    }

}

getProducts();
