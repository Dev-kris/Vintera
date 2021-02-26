const params = new URLSearchParams(window.location.search);
const productNumber = params.toString().slice(3);
const buyButton = document.getElementById("add-cart-button");

//gets camera image for single camera page

async function getCameraImage() {
  const response = await fetch(api_url + productNumber);
  const data = await response.json();

  const cameraImage = document.createElement("img");
  cameraImage.alt = "Picture of a " + data.name + " camera";
  cameraImage.src = data.imageUrl;
  cameraImage.className = "camera-details-img";

  document.getElementById("product-image").appendChild(cameraImage);
  await getCameraDetails();
}
//gets camera name, price, description for single camera page

async function getCameraDetails() {
  const response = await fetch(api_url + productNumber);
  const data = await response.json();

  document.getElementById("product-name").innerHTML = data.name;
  document.getElementById("product-price").innerHTML = "$ " + data.price / 100;
  document.getElementById("product-details").innerHTML = data.description;
  await getCamaraLenses();
}

// gets available lenses for selected camera
async function getCamaraLenses() {
  const response = await fetch(api_url + productNumber);
  const data = await response.json();

  //populates selection options for each available lens
  data.lenses.forEach((lens) => {
    let lensOption = document.createElement("option");

    document
      .getElementById("product-option")
      .appendChild(lensOption).innerHTML = lens;
  });
}

let cameraLensField = document.getElementById("product-option");
//stores selected camera lens
let cameraLensSelection =
  cameraLensField.options[cameraLensField.selectedIndex].value;

// function is run on change when selecting lens
function getCameraLensSelection(sel) {
  cameraLensSelection = sel.options[sel.selectedIndex].text;
}
//gets quantity on page and checks if camera is already in cart
//if already in cart, add quantities together
buyButton.addEventListener("click", (event) => {
  let qty = parseInt(document.getElementById("qty").value);
  let qtyInteger = parseInt(localStorage.getItem(productNumber)) || "";
  let qtyTotal = qty + qtyInteger;

  //prevents camera being added to cart if lens field is empty
  if (cameraLensSelection === "1") {
    swal("Please select a lens!", "", "error");
  } else {
    localStorage.setItem(productNumber, qtyTotal);

    swal("Camera Added to Cart!", "", "success");
  }
});

getCameraImage();
