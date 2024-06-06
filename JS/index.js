
// Form input fields
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productCategory = document.getElementById("productCategory");
var productImage = document.getElementById("productImage");
var productDesc = document.getElementById("productDesc");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");

// Cards
var productsCards = document.getElementById("productsCards");

//Array to hold form data
var productsContainer = [];
var searchedProducts = [];


// Regex function
function validateInput(element) {
    var regex = {
        productName: /^[A-Z][\w\s]+$/,
        productPrice: /^([6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
        productCategory: /^(TV|Mobile|Screens|Watch|Electronics)$/,
        productDesc: /^.{0,255}$/,
        productImage: /^[^0]$/
    }

    //validating the input
    if (element.id == "productImage") {
        if (regex[element.id].test(element.files.length)) {
            //if valid, show the green border around the input
            element.classList.add("is-valid");
            element.classList.remove("is-invalid");

            //if valid, display the alert
            element.nextElementSibling.classList.replace("d-block", "d-none");

            //Enabling the "add product" button
            addBtn.classList.remove("disabled");
            return true;
        }
        else {
            //if invalid, show the red border around the input
            element.classList.add("is-invalid");
            element.classList.remove("is-valid");

            //disabling the "add product" button
            if (!addBtn.classList.contains("disabled")) {
                addBtn.classList.add("disabled");
            }

            //if invalid, display the alert
            element.nextElementSibling.classList.replace("d-none", "d-block");

            return false;
        }
    }
    else if (regex[element.id].test(element.value)) {
        //if valid, show the green border around the input
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");

        //if valid, display the alert
        element.nextElementSibling.classList.replace("d-block", "d-none");

        //Enabling the "add product" button
        addBtn.classList.remove("disabled");
        return true;
    }
    else {
        //if invalid, show the red border around the input
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");

        //disabling the "add product" button
        if (!addBtn.classList.contains("disabled")) {
            addBtn.classList.add("disabled");
        }

        //if invalid, display the alert
        element.nextElementSibling.classList.replace("d-none", "d-block");

        return false;
    }
}

function removeIsValid() {
    productName.classList.remove("is-valid");
    productPrice.classList.remove("is-valid");
    productCategory.classList.remove("is-valid");
    productDesc.classList.remove("is-valid");
    productImage.classList.remove("is-valid");
}


//Checking if there are products stored in the local storage or not
if (localStorage.getItem("products") != null) {
    productsContainer = JSON.parse(localStorage.getItem("products"));
    displayProducts(productsContainer);
}

function addNewProduct() {

    if (validateInput(productName) && validateInput(productPrice) && validateInput(productCategory) && validateInput(productDesc) && validateInput(productImage)) {

        //Creating a product object to push in the array
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

    //removing green border from the from input fields
    removeIsValid();
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
        <div class="item col-4 ">
        <div class="card overflow-hidden position-relative rounded-5">
        <div class="card-img">
            <img src="${displayedArray[i].image}" class="img-fluid"  alt="">
        </div>
        <div class="card-body pt-0">
            <p class = "B-secondary-font-family mb-0 text-light">${displayedArray[i].name}</p>
            <p class = "R-secondary-font-family price-text">${displayedArray[i].price} EGP</p>
            <p class = "R-secondary-font-family secondary-text">${displayedArray[i].category}</p>
            <p class = "R-secondary-font-family secondary-text">${displayedArray[i].description}</p>
            <button class="position-absolute top-0 end-0 me-5 bg-transparent border-0 text-warning update" onclick="setFormForUpdate(${i})"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="position-absolute top-0 end-0 me-3 bg-transparent border-0 text-danger delete" onclick="deleteProduct(${i})"><i class="fa-regular fa-trash-can"></i></button>
        </div>
    </div>
    </div>`;
    }

    productsCards.innerHTML = container;

    //Clean the searchedProducts array and the productsContainer array form any span added
    for (var i = 0; i < displayedArray.length; i++) {
        displayedArray[i].name = displayedArray[i].name.replace(`<span class="text-danger">`, "");
        displayedArray[i].name = displayedArray[i].name.replace(`</span>`, "");
    }

}

function deleteProduct(index) {
    //Searching for the matched index in the productsContainer
    if (!(searchedProducts.length == 0)) {
        for (var i = 0; i < productsContainer.length; i++) {
            if (searchedProducts[index].name == productsContainer[i].name &&
                searchedProducts[index].price == productsContainer[i].price &&
                searchedProducts[index].category == productsContainer[i].category &&
                searchedProducts[index].description == productsContainer[i].description) {
                index = i;
                break;
            }
        }
    }

    productsContainer.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(productsContainer));
    displayProducts(productsContainer);
}

function search(term) {
    searchedProducts = [];

    for (var i = 0; i < productsContainer.length; i++) {
        if (productsContainer[i].name.toLowerCase().includes(term.toLowerCase())) {
            searchedProducts.push(productsContainer[i]);
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

    //Searching for the matched index in the productsContainer
    if (!(searchedProducts.length == 0)) {
        for (var i = 0; i < productsContainer.length; i++) {
            if (searchedProducts[index].name == productsContainer[i].name &&
                searchedProducts[index].price == productsContainer[i].price &&
                searchedProducts[index].category == productsContainer[i].category &&
                searchedProducts[index].description == productsContainer[i].description) {
                index = i;
                break;
            }
        }
    }

    //Fill the form with the edited items
    productName.value = productsContainer[index].name;
    productPrice.value = productsContainer[index].price;
    productCategory.value = productsContainer[index].category;
    productDesc.value = productsContainer[index].description;

    //Adding Custom Attribute
    addCustomAttr(productsContainer, index)
}

function updateProduct() {

    //Getting the Card Index stored in the Custom Attribute
    var updatedCard = document.querySelector("button[data-updated-card]");
    var updatedCardIndex = Number(updatedCard.getAttribute("data-updated-card"));

    if (validateInput(productImage)) {
        //Updating the item in the array
        productsContainer[updatedCardIndex].name = productName.value;
        productsContainer[updatedCardIndex].price = productPrice.value;
        productsContainer[updatedCardIndex].category = productCategory.value;
        productsContainer[updatedCardIndex].description = productDesc.value;
        productsContainer[updatedCardIndex].image = `images/${productImage.files[0].name}`;

        displayProducts(productsContainer);
        localStorage.setItem("products", JSON.stringify(productsContainer));

        updateBtn.classList.replace("d-block", "d-none");
        addBtn.classList.replace("d-none", "d-block");

        deleteFormData();
        removeIsValid();
    }
}

function addCustomAttr(displayedArray, index) {
    var container = ``;

    for (var i = 0; i < displayedArray.length; i++) {
        if (i !== index) {
            container += `
            <div class="item col-4 ">
        <div class="card overflow-hidden position-relative rounded-5">
        <div class="card-img">
            <img src="${displayedArray[i].image}" class="img-fluid"  alt="">
        </div>
        <div class="card-body pt-0">
            <p class = "B-secondary-font-family mb-0 text-light">${displayedArray[i].name}</p>
            <p class = "R-secondary-font-family price-text">${displayedArray[i].price} EGP</p>
            <p class = "R-secondary-font-family secondary-text">${displayedArray[i].category}</p>
            <p class = "R-secondary-font-family secondary-text">${displayedArray[i].description}</p>
            <button class="position-absolute top-0 end-0 me-5 bg-transparent border-0 text-warning update" onclick="setFormForUpdate(${i})"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="position-absolute top-0 end-0 me-3 bg-transparent border-0 text-danger delete" onclick="deleteProduct(${i})"><i class="fa-regular fa-trash-can"></i></button>
        </div>
    </div>
    </div>`;
        }
        else {
            container += `
            <div class="item col-4 ">
        <div class="card overflow-hidden position-relative rounded-5">
        <div class="card-img">
            <img src="${displayedArray[i].image}" class="img-fluid"  alt="">
        </div>
        <div class="card-body pt-0">
            <p class = "B-secondary-font-family mb-0 text-light">${displayedArray[i].name}</p>
            <p class = "R-secondary-font-family price-text">${displayedArray[i].price} EGP</p>
            <p class = "R-secondary-font-family secondary-text">${displayedArray[i].category}</p>
            <p class = "R-secondary-font-family secondary-text">${displayedArray[i].description}</p>
            <button class="position-absolute top-0 end-0 me-5 bg-transparent border-0 text-warning update" onclick="setFormForUpdate(${i})"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="position-absolute top-0 end-0 me-3 bg-transparent border-0 text-danger delete" data-updated-card="${i}" onclick="deleteProduct(${i})"><i class="fa-regular fa-trash-can"></i></button>
        </div>
    </div>
    </div>`;
        }

    }

    productsCards.innerHTML = container;
}