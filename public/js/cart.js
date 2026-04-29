import {
  loadProducts,
  showToast,
  cartState,
  updateCart,
  CartItem,
  addtocartfunc,
  subscribeCart,
  subscribeAuth,
  isLoggedIn,
  currentUser,
} from "./common.js";

const table = document.querySelector(".rightCart table");
const recommenationCont = document.querySelector(".recommenationCont");
const totalCart = document.getElementById("totalCart");
const subtotal = document.getElementById("subtotal");
const taxText = document.getElementById("tax");
const totalText = document.getElementById("total");
const shippingText = document.getElementById("shipping");

cartCount.textContent = cartState.length;
subscribeCart((state) => {
  cartCount.textContent = state.length;
});

subscribeAuth(updateHeaderUI);
updateHeaderUI({ isLoggedIn, currentUser });

function updateHeaderUI({ isLoggedIn, currentUser }) {
  if (isLoggedIn) {
    const pfpImage = pfpCircle.querySelector("img");
    console.log(pfpImage);
    pfpImage.src = `images/${currentUser.pfp}`;
    signBtn.style.display = "none";
    pfpCircle.style.display = "block";
  } else {
    signBtn.style.display = "block";
    pfpCircle.style.display = "none";
  }
}

calculator();

function calculator() {
  totalCart.textContent = cartState.length;
  totalCart.textContent = cartState.length;

  const totalPrice = cartState.reduce((accumulator, currentPrice) => {
    return accumulator + currentPrice.itemPrice * currentPrice.quantity;
  }, 0);

  subtotal.textContent = `$${totalPrice.toFixed(2)}`;

  const tax = (8 / 100) * totalPrice;
  let shipping;
  if (cartState.length == 0) {
    shipping = 0;
  } else {
    shipping = totalPrice > 100 ? 0 : 10;
  }

  const total = totalPrice + tax + shipping;

  taxText.textContent = `$${tax.toFixed(2)}`;
  if (totalPrice > 100) {
    shippingText.textContent = "Free Shipping";
    shippingText.style.color = "green";
    shippingText.style.fontSize = "14px";
    shippingText.style.fontWeight = "500";
  } else {
    shippingText.textContent = `$${shipping.toFixed(2)}`;
    shippingText.style.color = "black";
    shippingText.style.fontSize = "16px";
  }

  totalText.textContent = `$${total.toFixed(2)}`;
}

// remove all old rows except header
const tableBody = table.querySelector("tbody");

function renderCart() {
  tableBody.innerHTML = "";
  cartState.forEach((item) => {
    const row = CartItem(
      item,
      (id, newQty) => {
        if (newQty < 1) return;
        const updated = cartState.map((p) =>
          p.itemId === id ? { ...p, quantity: newQty } : p,
        );

        updateCart(updated);
        renderCart();
        calculator();
      },
      (id) => {
        const updated = cartState.filter((p) => p.itemId !== id);

        updateCart(updated);
        renderCart();
        calculator();
      },
    );
    tableBody.appendChild(row);
  });
}

async function renderOthers() {
  const otherProducts = await loadProducts();
  for (let i = 0; i < 5; i++) {
    const productCard = document.createElement("div");
    const productImageContainer = document.createElement("div");
    const productImage = document.createElement("img");
    const productDetail = document.createElement("div");
    const productName = document.createElement("p");
    const description = document.createElement("p");
    const rating = document.createElement("div");
    const stars = document.createElement("div");

    const ratingValue = document.createElement("p");
    const price = document.createElement("p");
    const addtocart = document.createElement("button");

    productCard.classList.add("productCard");
    productImageContainer.classList.add("productimgCont");
    productDetail.classList.add("productDetail");
    description.classList.add("productDesc");
    rating.classList.add("rating");
    stars.classList.add("stars");
    addtocart.classList.add("add-btn");
    price.style.fontWeight = "600";

    productImage.src = `images/${otherProducts[i].image}`;
    productName.textContent = otherProducts[i].name;
    description.textContent = otherProducts[i].description.slice(0, 25) + "...";
    ratingValue.textContent = "5.0";
    price.textContent = `$${otherProducts[i].price}`;
    addtocart.innerHTML = `
        <span class="btn-text">Add to Cart</span>
        <svg class="checkmark" viewBox="0 0 52 52">
          <path d="M14 27 L22 35 L38 18"></path>
        </svg>
      `;

    recommenationCont.appendChild(productCard);
    productCard.appendChild(productImageContainer);
    productCard.appendChild(productDetail);
    productImageContainer.appendChild(productImage);
    productDetail.appendChild(productName);
    productName.style.fontWeight = "600";
    productDetail.appendChild(description);
    productDetail.appendChild(rating);
    rating.appendChild(stars);
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("i");
      star.classList.add("fa-solid");
      star.classList.add("fa-star");
      stars.appendChild(star);
    }
    rating.appendChild(ratingValue);
    productDetail.appendChild(price);
    productDetail.appendChild(addtocart);

    addtocart.addEventListener("click", () => {
      addtocartfunc(otherProducts[i]);
      tableBody.innerHTML = "";
      renderCart();
      showToast("Added to Cart!", "success");
      addtocart.classList.add("added");

      setTimeout(() => {
        addtocart.classList.remove("added");
      }, 1500);
    });
  }
}

window.redirectCheck = function () {
  if (cartState.length === 0) {
    showToast("Your cart is empty!", "warning");
  } else {
    window.location = "checkout.html";
  }
};

window.redirectShop = function () {
  window.location = "product.html";
};

renderCart();
renderOthers();
