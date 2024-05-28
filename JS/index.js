
// Form input fields
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productCategory = document.getElementById("productCategory");
var productImage = document.getElementById("productImage");
var productDesc = document.getElementById("productDesc");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
// Table elements
var productsCards = document.getElementById("productsCards");

//Array to hold form data
var productsContainer = [];

var searchedIndex;


// Regex function
function validateInput(element) {
    var regex = {
        productName: /^[A-Z][\w]+$/,
        productPrice: /^([6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
        productCategory: /^(TV|Mobile|Screens|Watch|Electronics)$/,
        productDesc: /^.{0,255}$/,
    }

    //validate the input
    if (regex[element.id].test(element.value)) {
        //if valid, show the green border around the input
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");

        //if valid, display the alert
        element.nextElementSibling.classList.replace("d-block", "d-none");

        return true;
    }
    else {
        //if invalid, show the red border around the input
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");

        //if invalid, display the alert
        element.nextElementSibling.classList.replace("d-none", "d-block");

        return false;
    }
}




//Checking if there is products stored in the local storage or not
if (localStorage.getItem("products") != null) {
    productsContainer = JSON.parse(localStorage.getItem("products"));
    displayProducts(productsContainer);
}


function addNewProduct() {

    if (validateInput(productName) && validateInput(productPrice) && validateInput(productCategory) && validateInput(productDesc)) {


        var product = {
            name: productName.value,
            price: productPrice.value,
            category: productCategory.value,
            description: productDesc.value,
            image: `images/${productImage.files[0]?.name}`
        };

        productsContainer.push(product);
        localStorage.setItem("products", JSON.stringify(productsContainer));
        // console.log(productsContainer);

        deleteFormData();
        displayProducts(productsContainer);
    }
}

function deleteFormData() {
    productName.value = "";
    productPrice.value = "";
    productCategory.value = "";
    productDesc.value = "";
    productImage.value = "";
}

function displayProducts(displayedArray) {
    var container = ``;

    for (var i = 0; i < displayedArray.length; i++) {
        container += `
        <div class="item col-3">
        <div class="card">
        <div class="card-img">
            <img src="${displayedArray[i].image}" class="img-fluid"  alt="">
        </div>
        <div class="card-body">
            <p>${displayedArray[i].name}</p>
            <p>${displayedArray[i].price}EGP</p>
            <p>${displayedArray[i].category}</p>
            <p>${displayedArray[i].description}</p>
            <button class="btn btn-warning" onclick="setFormForUpdate(${i})">Update</button>
            <button class="btn btn-danger" onclick="deleteProduct(${i})">Delete</button>
        </div>
    </div>
    </div>`;
    }

    productsCards.innerHTML = container;
}

function deleteProduct(index) {
    productsContainer.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(productsContainer));
    displayProducts(productsContainer);
}

function search(term) {
    var searchedProducts = [];
    //declaring two variables, one to store string in it and the other to store a copy of an array of objects
    var tempString;
    var tempArr = [];
    for (var i = 0; i < productsContainer.length; i++) {
        if (productsContainer[i].name.toLowerCase().includes(term.toLowerCase())) {
            //Here we make a copy of the productsContainer array because passing it directly passes it by reference not value which changes the real data
            tempString = JSON.stringify(productsContainer);
            tempArr = JSON.parse(tempString);

            searchedProducts.push(tempArr[i]);
        }
    }

    //replacing the searched text (term) with a red text
    for (var i = 0; i < searchedProducts.length; i++) {
        //Find the start of the term in the name
        var startIndex = searchedProducts[i].name.toLowerCase().indexOf(term.toLowerCase());

        //Creating a new term to search for that matches the case of the name characters
        var newTerm = searchedProducts[i].name.substring(startIndex, (startIndex + term.length));

        //Replacing the newTerm with a formatted one
        searchedProducts[i].name = searchedProducts[i].name.replace(newTerm, `<span class="text-danger">${newTerm}</span>`)
    }

    displayProducts(searchedProducts);

    //Handling the case when nothing found with the text searched for (term)
    if (searchedProducts.length == 0) {
        productsCards.innerHTML = `<p class="alert alert-info">There is nothing found with "${term}"</p>`;
    }
}

function setFormForUpdate(index) {
    //Change Buttons
    addBtn.classList.replace("d-block", "d-none");
    updateBtn.classList.replace("d-none", "d-block");

    //Fill the form with the edited items


    productName.value = productsContainer[index].name;
    productPrice.value = productsContainer[index].price;
    productCategory.value = productsContainer[index].category;
    productDesc.value = productsContainer[index].description;

    searchedIndex = index;
}

function updateProduct() {

    //Updating the item in the array
    productsContainer[searchedIndex].name = productName.value;
    productsContainer[searchedIndex].price = productPrice.value;
    productsContainer[searchedIndex].category = productCategory.value;
    productsContainer[searchedIndex].description = productDesc.value;
    productsContainer[searchedIndex].image = `images/${productImage.files[0].name}`;

    displayProducts(productsContainer);
    localStorage.setItem("products", JSON.stringify(productsContainer));

    updateBtn.classList.replace("d-block", "d-none");
    addBtn.classList.replace("d-none", "d-block");

    deleteFormData();
}
