/* =========================
   LOADER
========================= */

window.addEventListener("load", function () {
    var loader = document.getElementById("loader");

    setTimeout(function () {
        loader.style.display = "none";
    }, 800);
});


/* =========================
   MOBILE MENU
========================= */

var menuBtn = document.getElementById("menuBtn");
var navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("show");
});

var navItems = navLinks.getElementsByTagName("a");

for (var i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener("click", function () {
        navLinks.classList.remove("show");
    });
}


/* =========================
   PRODUCTS
========================= */

var productCards = document.getElementsByClassName("product-card");
var filterButtons = document.getElementsByClassName("filter-btn");
var searchInput = document.getElementById("searchInput");
var noProducts = document.getElementById("noProducts");

var currentCategory = "all";


function filterProducts() {

    var searchText = searchInput.value.toLowerCase();
    var visibleProducts = 0;

    for (var i = 0; i < productCards.length; i++) {

        var category = productCards[i].getAttribute("data-category");
        var name = productCards[i].getAttribute("data-name").toLowerCase();

        var categoryMatch =
            currentCategory === "all" ||
            category === currentCategory;

        var searchMatch =
            name.indexOf(searchText) !== -1;

        if (categoryMatch && searchMatch) {
            productCards[i].style.display = "block";
            visibleProducts++;
        } else {
            productCards[i].style.display = "none";
        }
    }

    if (visibleProducts === 0) {
        noProducts.style.display = "block";
    } else {
        noProducts.style.display = "none";
    }
}


for (var i = 0; i < filterButtons.length; i++) {

    filterButtons[i].addEventListener("click", function () {

        for (var j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("active");
        }

        this.classList.add("active");

        currentCategory =
            this.getAttribute("data-category");

        filterProducts();
    });
}


searchInput.addEventListener("keyup", function () {
    filterProducts();
});


/* =========================
   CART
========================= */

var cart = [];

var savedCart = localStorage.getItem("glowCart");

if (savedCart) {
    cart = JSON.parse(savedCart);
}


var cartBtn = document.getElementById("cartBtn");
var closeCart = document.getElementById("closeCart");
var cartPanel = document.getElementById("cartPanel");
var overlay = document.getElementById("overlay");
var cartItems = document.getElementById("cartItems");
var cartCount = document.getElementById("cartCount");
var cartTotal = document.getElementById("cartTotal");


function saveCart() {
    localStorage.setItem("glowCart", JSON.stringify(cart));
}


function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';

        cartCount.innerHTML = "0";
        cartTotal.innerHTML = "Rs. 0";

        return;
    }

    var totalItems = 0;
    var totalPrice = 0;

    for (var i = 0; i < cart.length; i++) {

        var item = cart[i];

        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        var cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML =
            '<img src="' + item.image + '" alt="' + item.name + '">' +

            '<div class="cart-item-info">' +

                '<h4>' + item.name + '</h4>' +

                '<p>Rs. ' + item.price +
                ' × ' + item.quantity + '</p>' +

                '<button class="remove-item" data-index="' +
                i + '">Remove</button>' +

            '</div>';

        cartItems.appendChild(cartItem);
    }

    cartCount.innerHTML = totalItems;
    cartTotal.innerHTML = "Rs. " + totalPrice.toLocaleString();

    var removeButtons =
        document.getElementsByClassName("remove-item");

    for (var j = 0; j < removeButtons.length; j++) {

        removeButtons[j].addEventListener("click", function () {

            var index =
                parseInt(this.getAttribute("data-index"));

            cart.splice(index, 1);

            saveCart();
            updateCart();
        });
    }
}


/* =========================
   ADD TO CART
========================= */

var addButtons =
    document.getElementsByClassName("add-cart");

for (var i = 0; i < addButtons.length; i++) {

    addButtons[i].addEventListener("click", function () {

        var productName =
            this.getAttribute("data-name");

        var productPrice =
            parseInt(this.getAttribute("data-price"));

        var productImage =
            this.getAttribute("data-image");

        var found = false;

        for (var j = 0; j < cart.length; j++) {

            if (cart[j].name === productName) {

                cart[j].quantity++;
                found = true;
                break;
            }
        }

        if (!found) {

            cart.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        saveCart();
        updateCart();

        openCart();
    });
}


/* =========================
   OPEN / CLOSE CART
========================= */

function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
}


function closeCartPanel() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
}


cartBtn.addEventListener("click", function () {
    openCart();
});


closeCart.addEventListener("click", function () {
    closeCartPanel();
});


overlay.addEventListener("click", function () {
    closeCartPanel();
});


/* =========================
   COUPON
========================= */

var copyCoupon =
    document.getElementById("copyCoupon");

copyCoupon.addEventListener("click", function () {

    navigator.clipboard.writeText("GLOW20");

    copyCoupon.innerHTML = "Copied!";

    setTimeout(function () {
        copyCoupon.innerHTML = "Copy Code";
    }, 1500);
});


/* =========================
   CHECKOUT
========================= */

var checkoutBtn =
    document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", function () {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    alert(
        "Thank you for shopping with GlowCart! " +
        "Your order has been received."
    );

    cart = [];

    saveCart();
    updateCart();
    closeCartPanel();
});


/* =========================
   CONTACT FORM
========================= */

var contactForm =
    document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    var name =
        document.getElementById("name").value;

    alert(
        "Thank you " + name +
        "! Your message has been sent."
    );

    contactForm.reset();
});


/* =========================
   INITIAL CART LOAD
========================= */

updateCart();