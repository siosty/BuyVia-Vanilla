import {
  loadProducts,
  cartState,
  showToast,
  subscribeCart,
  subscribeAuth,
  isLoggedIn,
  currentUser,
} from "./common.js";

const order = document.getElementById("order");
const email = document.getElementById("emailInfo");
const fullName = document.getElementById("fullName");
const phoneNumber = document.getElementById("phoneNumber");
const addressInfo = document.getElementById("addressInfo");
const city = document.getElementById("cityInfo");
const state = document.getElementById("stateInfo");
const zip = document.getElementById("ZIPInfo");
const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("code");
const holder = document.getElementById("cardHolder");
const checkProductsCont = document.querySelector(".checkProductsCont");
const subtotalSummary = document.getElementById("subtotalSummary");
const shippingSummary = document.getElementById("shippingSummary");
const taxSummary = document.getElementById("taxSummary");
const totalSumm = document.getElementById("totalSumm");
const successMsg = document.querySelector(".success");
const checkoutHolder = document.querySelector(".checkoutCont");

const cartCount = document.getElementById("cartCount");

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
renderCheckout();

cardNumber.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.substring(0, 16);
  value = value.replace(/(.{4})/g, "$1 ").trim();
  e.target.value = value;
});

expiry.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.substring(0, 4);

  if (value.length >= 3) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }

  e.target.value = value;
});

cvv.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.substring(0, 4);
  e.target.value = value;
});

holder.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
});

function calculator() {
  const totalPrice = cartState.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.itemPrice * currentItem.quantity;
  }, 0);

  subtotalSummary.textContent = `$${totalPrice.toFixed(2)}`;

  const tax = (8 / 100) * totalPrice;
  let shipping;
  if (cartState.length == 0) {
    shipping = 0;
  } else {
    shipping = totalPrice > 100 ? 0 : 10;
  }

  const total = totalPrice + tax + shipping;

  taxSummary.textContent = `$${tax.toFixed(2)}`;

  if (totalPrice > 100) {
    shippingSummary.textContent = "Free Shipping";
    shippingSummary.style.color = "green";
    shippingSummary.style.fontSize = "14px";
    shippingSummary.style.fontWeight = "500";
  } else {
    shippingSummary.textContent = `$${shipping.toFixed(2)}`;
    shippingSummary.style.color = "black";
    shippingSummary.style.fontSize = "16px";
  }

  totalSumm.textContent = `$${total.toFixed(2)}`;
}

function renderCheckout() {
  cartState.forEach((item) => {
    const allPCont = document.createElement("div");
    allPCont.classList.add("allPCont");
    allPCont.innerHTML = `
            <div class="rightPcheck">
                <div class="checkImgCont">
                  <img src="images/${item.itemImage}" alt="" />
                </div>
                <div class="checkDetial">
                  <p>${item.itemName.slice(0, 15) + "....."}</p>
                  <p>Qty : <span>${item.quantity}</span></p>
                </div>
              </div>
              <div class="leftPcheck">
                <p>$${item.itemPrice * item.quantity}</p>
              </div>
        `;
    checkProductsCont.prepend(allPCont);
  });
}
const selectedOption = state.options[state.selectedIndex];

let isValid = {
  emailField: false,
  fullNameField: false,
  phoneNumberField: false,
  addressInfoField: false,
  cityField: false,
  stateField: false,
  zipField: false,
  cardNumberField: false,
  holderField: false,
  cvvField: false,
  expiryField: false,
};

function orderSuccess() {
  checkoutHolder.style.display = "none";
  successMsg.style.display = "flex";
  setTimeout(() => {
    localStorage.removeItem("cartItems");
    localStorage.setItem("cartItems", JSON.stringify([]));
    window.location = "index.html";
  }, 3000);
}

order.addEventListener("click", () => {
  if (cartState.length === 0) {
    showToast("Nothing to purchase!", "error");
  } else {
    if (email.value === "") {
      isValid.emailField = false;
      email.style.border = "1px solid red";
    } else {
      isValid.emailField = true;
      email.style.border = "1px solid black";
    }
    if (fullName.value === "") {
      isValid.fullNameField = false;
      fullName.style.border = "1px solid red";
    } else {
      isValid.fullNameField = true;
      fullName.style.border = "1px solid black";
    }
    if (phoneNumber.value === "") {
      isValid.phoneNumberField = false;
      phoneNumber.style.border = "1px solid red";
    } else {
      isValid.phoneNumberField = true;
      phoneNumber.style.border = "1px solid black";
    }
    if (addressInfo.value === "") {
      isValid.addressInfoField = false;
      addressInfo.style.border = "1px solid red";
    } else {
      isValid.addressInfoField = true;
      addressInfo.style.border = "1px solid black";
    }
    if (city.value === "") {
      isValid.cityField = false;
      city.style.border = "1px solid red";
    } else {
      isValid.cityField = true;
      city.style.border = "1px solid black";
    }
    if (state.value === "") {
      isValid.stateField = false;
      state.style.border = "1px solid red";
    } else {
      isValid.stateField = true;
      state.style.border = "1px solid black";
    }
    if (zip.value === "") {
      isValid.zipField = false;
      zip.style.border = "1px solid red";
    } else {
      isValid.zipField = true;
      zip.style.border = "1px solid black";
    }
    if (cardNumber.value === "" || cardNumber.value.length < 16) {
      isValid.cardNumberField = false;
      cardNumber.style.border = "1px solid red";
    } else {
      isValid.cardNumberField = true;
      cardNumber.style.border = "1px solid black";
    }
    if (holder.value === "") {
      isValid.holderField = false;
      holder.style.border = "1px solid red";
    } else {
      isValid.holderField = true;
      holder.style.border = "1px solid black";
    }
    if (cvv.value === "" || cvv.value.length < 4) {
      isValid.cvvField = false;
      cvv.style.border = "1px solid red";
    } else {
      isValid.cvvField = true;
      cvv.style.border = "1px solid black";
    }
    if (expiry.value === "" || expiry.value < 5) {
      isValid.expiryField = false;
      expiry.style.border = "1px solid red";
    } else {
      isValid.expiryField = true;
      expiry.style.border = "1px solid black";
    }

    if (
      isValid.emailField === true &&
      isValid.fullNameField === true &&
      isValid.phoneNumberField === true &&
      isValid.addressInfoField === true &&
      isValid.cityField === true &&
      isValid.stateField === true &&
      isValid.zipField === true &&
      isValid.cardNumberField === true &&
      isValid.holderField === true &&
      isValid.expiryField === true &&
      isValid.cvvField === true
    ) {
      order.classList.add("loading");

      // simulate delay
      setTimeout(() => {
        order.classList.remove("loading");

        // call your success function here
        orderSuccess();
      }, 2000);
    }
  }
});
