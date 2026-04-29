import {
  loadProducts,
  cartState,
  showToast,
  addtocartfunc,
  subscribeCart,
  subscribeAuth,
  isLoggedIn,
  currentUser,
} from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ duration: 800, once: true });
});

const cartCount = document.getElementById("cartCount");
const signBtn = document.getElementById("signBtn");
const pfpCircle = document.getElementById("pfpCircle");

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

featuredProducts();
newArrivalProducts();

async function featuredProducts() {
  const featured = document.querySelector(".featuredCont");
  const products = await loadProducts();

  products.forEach((product, index) => {
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

    if (index < 5) {
      productImage.src = `images/${product.image}`;
      productName.textContent = product.name;
      description.textContent = product.description.slice(0, 25) + "...";
      ratingValue.textContent = "5.0";
      price.textContent = `$${product.price}`;
      addtocart.innerHTML = `
        <span class="btn-text">Add to Cart</span>
        <svg class="checkmark" viewBox="0 0 52 52">
          <path d="M14 27 L22 35 L38 18"></path>
        </svg>
      `;

      featured.appendChild(productCard);
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
    }

    addtocart.addEventListener("click", () => {
      addtocartfunc(product);
      showToast("Added to Cart!", "success");
      addtocart.classList.add("added");

      setTimeout(() => {
        addtocart.classList.remove("added");
      }, 1500);
    });
  });
}

async function newArrivalProducts() {
  const newArrivals = document.querySelector(".newArrivalCont");
  const newProducts = await loadProducts();
  newProducts.forEach((product, index) => {
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
    productName.style.fontWeight = "600";
    description.classList.add("productDesc");
    rating.classList.add("rating");
    stars.classList.add("stars");
    addtocart.classList.add("add-btn");
    price.style.fontWeight = "600";

    if (index >= 5 && index <= 14) {
      productImage.src = `images/${product.image}`;
      productName.textContent = product.name;
      description.textContent = product.description.slice(0, 25) + "...";
      ratingValue.textContent = "5.0";
      price.textContent = `$${product.price}`;
      addtocart.innerHTML = `
        <span class="btn-text">Add to Cart</span>
        <svg class="checkmark" viewBox="0 0 52 52">
          <path d="M14 27 L22 35 L38 18"></path>
        </svg>
      `;

      newArrivals.appendChild(productCard);
      productCard.appendChild(productImageContainer);
      productCard.appendChild(productDetail);
      productImageContainer.appendChild(productImage);
      productDetail.appendChild(productName);
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
    }

    addtocart.addEventListener("click", () => {
      addtocartfunc(product);
      showToast("Added to Cart!", "success");
      addtocart.classList.add("added");

      setTimeout(() => {
        addtocart.classList.remove("added");
      }, 1500);
    });
  });
}
