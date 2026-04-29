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

const allProductsCont = document.querySelector(".allProductsCont");
const pageNumber = document.querySelector(".pageNumber");
const range = document.getElementById("priceRange");
const maxPrice = document.getElementById("maxPrice");
const minPrice = document.getElementById("minPrice");
const categories = document.querySelectorAll(".categroyCheck");
const electronics = document.getElementById("electronicsCheck");
const fitness = document.getElementById("fitnessCheck");
const home = document.getElementById("homeCheck");
const stationary = document.getElementById("stationaryCheck");
const accessories = document.getElementById("accessoriesCheck");
const sideSearch = document.getElementById("productSearch");
const cartCount = document.getElementById("cartCount");

productFilter();

cartCount.textContent = cartState.length;
subscribeCart((state) => {
  cartCount.textContent = state.length;
});

subscribeAuth(updateHeaderUI);
updateHeaderUI({ isLoggedIn, currentUser });

function updateHeaderUI({ isLoggedIn, currentUser }) {
  if (isLoggedIn) {
    const pfpImage = pfpCircle.querySelector("img");
    pfpImage.src = `images/${currentUser.pfp}`;
    signBtn.style.display = "none";
    pfpCircle.style.display = "block";
  } else {
    signBtn.style.display = "block";
    pfpCircle.style.display = "none";
  }
}

let currentPage = 1;

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let totalCount;

maxPrice.value = range.value;

range.addEventListener("change", () => {
  allProductsCont.innerHTML = "";
  maxPrice.value = Number(range.value);
  currentPage = 1;
  pageNumber.textContent = currentPage;
  productFilter();
});

sideSearch.addEventListener("input", () => {
  allProductsCont.innerHTML = "";
  currentPage = 1;
  pageNumber.textContent = currentPage;
  productFilter();
});

categories.forEach((category) => {
  category.addEventListener("change", () => {
    allProductsCont.innerHTML = "";
    currentPage = 1;
    pageNumber.textContent = currentPage;
    productFilter();
  });
});

prev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    allProductsCont.innerHTML = "";
    pageNumber.textContent = currentPage;
    productFilter();
  }
});
next.addEventListener("click", () => {
  const totalPages = totalCount / 9;
  if (currentPage < Math.ceil(totalPages)) {
    currentPage += 1;
  }
  allProductsCont.innerHTML = "";
  pageNumber.textContent = currentPage;
  productFilter();
});

function allProductsRender(products) {
  const startIndex = (currentPage - 1) * 9;
  const endIndex = startIndex + 9;

  for (let x = startIndex; x < endIndex; x++) {
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

    productImage.src = `images/${products[x].image}`;
    productName.textContent = products[x].name;
    description.textContent = products[x].description.slice(0, 25) + "...";
    ratingValue.textContent = "5.0";
    price.textContent = `$${products[x].price}`;
    addtocart.innerHTML = `
        <span class="btn-text">Add to Cart</span>
        <svg class="checkmark" viewBox="0 0 52 52">
          <path d="M14 27 L22 35 L38 18"></path>
        </svg>
      `;

    allProductsCont.appendChild(productCard);
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
      addtocartfunc(products[x]);
      showToast("Added to Cart!", "success");
      addtocart.classList.add("added");

      setTimeout(() => {
        addtocart.classList.remove("added");
      }, 1500);
    });
  }
}

async function productFilter() {
  const filteredProducts = await loadProducts();

  // 1. BUILD STATE (single source of truth)
  const state = {
    electronics: electronics.checked,
    fitness: fitness.checked,
    home: home.checked,
    stationary: stationary.checked,
    accessories: accessories.checked,
  };

  const anyCategorySelected =
    state.electronics ||
    state.fitness ||
    state.home ||
    state.stationary ||
    state.accessories;

  // 2. FILTER PRODUCTS USING STATE
  const result = filteredProducts.filter((product) => {
    // CATEGORY FILTER (only if any is selected)
    if (anyCategorySelected) {
      if (product.category === "Electronics" && !state.electronics)
        return false;
      if (product.category === "Fitness" && !state.fitness) return false;
      if (product.category === "Home" && !state.home) return false;
      if (product.category === "Stationery" && !state.stationary) return false;
      if (product.category === "Accessories" && !state.accessories)
        return false;
    }

    // PRICE FILTER (always active)
    if (product.price > Number(maxPrice.value)) return false;

    // Search Filter
    const keyword = sideSearch.value.toLowerCase().trim();
    if (!product.name.toLowerCase().includes(keyword)) return false;

    return true;
  });
  activeProducts(result);
  totalCount = result.length;
}

function activeProducts(active) {
  allProductsRender(active);
}
