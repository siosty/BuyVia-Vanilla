export let cartState = JSON.parse(localStorage.getItem("cartItems")) || [];
export let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
export let currentUser =
  JSON.parse(localStorage.getItem("currentUser")) || null;

let authListeners = [];

export function subscribeAuth(listener) {
  authListeners.push(listener);
}

export function login(user) {
  isLoggedIn = true;
  currentUser = user;

  localStorage.setItem("isLoggedIn", true);
  localStorage.setItem("currentUser", JSON.stringify(user));

  authListeners.forEach((fn) => fn({ isLoggedIn, currentUser }));
}

export function logout() {
  isLoggedIn = false;
  currentUser = null;

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");

  authListeners.forEach((fn) => fn({ isLoggedIn, currentUser }));
}

export async function loadProducts() {
  const myApi = "data/product.json";
  try {
    const response = await fetch(myApi);
    if (!response.ok) {
      throw new Error("Could not fetch products!");
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function loadUsers() {
  const myApi = "data/users.json";
  try {
    const response = await fetch(myApi);
    if (!response.ok) {
      throw new Error("Could not fetch users!");
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export function addtocartfunc(product) {
  const existing = cartState.find((item) => item.itemId === product.id);

  let updated;

  if (existing) {
    updated = cartState.map((item) =>
      item.itemId === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
  } else {
    const newItem = {
      itemId: product.id,
      itemImage: product.image,
      itemName: product.name,
      itemDescription: product.description,
      itemPrice: product.price,
      quantity: 1,
    };

    updated = [...cartState, newItem];
  }

  updateCart(updated);
}

export function updateCart(newState) {
  cartState = newState;
  localStorage.setItem("cartItems", JSON.stringify(cartState));
  listeners.forEach((fn) => fn(cartState));
}

export function CartItem(item, onUpdate, onRemove) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="productCell">
      <div class="cartProductImgCont">
        <img src="images/${item.itemImage}" alt="${item.itemName}" />
      </div>

      <div class="cartProductDetail">
        <p>${item.itemName}</p>
        <p>${item.itemDescription.slice(0, 25)}...</p>
        <p>In Stock</p>
      </div>
    </td>

    <td>$${item.itemPrice}</td>

    <td>
      <button class="minus">-</button>
      <span class="qtyNo">${item.quantity}</span>
      <button class="plus">+</button>
    </td>

    <td>$${(item.itemPrice * item.quantity).toFixed(2)}</td>

    <td>
      <button class="remove">X</button>
    </td>
  `;
  row.querySelector(".plus").addEventListener("click", () => {
    onUpdate(item.itemId, item.quantity + 1);
  });

  row.querySelector(".minus").addEventListener("click", () => {
    onUpdate(item.itemId, item.quantity - 1);
  });

  row.querySelector(".remove").addEventListener("click", () => {
    onRemove(item.itemId);
  });

  return row;
}

let listeners = [];

export function subscribeCart(listener) {
  listeners.push(listener);
}

export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  // normalize input (VERY important)
  type = type.trim().toLowerCase();

  const themes = {
    success: {
      bg: "rgba(40, 167, 69, 0.15)",
      border: "rgba(40, 167, 69, 0.8)",
      text: "#2ecc71",
    },
    error: {
      bg: "rgba(220, 53, 69, 0.15)",
      border: "rgba(220, 53, 69, 0.8)",
      text: "#ff6b6b",
    },
    info: {
      bg: "rgba(30, 136, 229, 0.15)",
      border: "rgba(30, 136, 229, 0.8)",
      text: "#64b5f6",
    },
    warning: {
      bg: "rgba(255, 193, 7, 0.15)",
      border: "rgba(255, 193, 7, 0.8)",
      text: "#ffcc00",
    },
  };

  // fallback if unknown type
  const theme = themes[type] || themes.info;

  const toast = document.createElement("div");
  toast.textContent = message;

  // BASE GLASS STYLE
  Object.assign(toast.style, {
    minWidth: "240px",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    background: theme.bg,
    border: `1px solid ${theme.border}`,
    color: theme.text,

    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",

    opacity: "0",
    transform: "translateX(100%)",
    transition: "all 0.3s ease",
  });

  container.appendChild(toast);

  // animate in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  // remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";

    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
