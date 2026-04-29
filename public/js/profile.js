import {
  loadUsers,
  showToast,
  cartState,
  subscribeCart,
  login,
  subscribeAuth,
  isLoggedIn,
  currentUser,
  logout,
} from "./common.js";

const allusers = await loadUsers();

const { users } = allusers;

const form = document.getElementById("signinForm");
const email = document.getElementById("logemail");
const password = document.getElementById("logpassword");
const userDetail = document.querySelector(".myProfileCont");
const loginPage = document.querySelector(".signInCont");
const logOutBtn = document.getElementById("logout");

const fullName = document.getElementById("fullName");
const userEmail = document.getElementById("email");
const number = document.getElementById("phoneNumber");
const pfp = document.getElementById("pfp");
const signBtn = document.getElementById("signBtn");
const pfpCircle = document.getElementById("pfpCircle");

const cartCount = document.getElementById("cartCount");

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

if (isLoggedIn) {
  loginPage.style.display = "none";
  userDetail.style.display = "block";

  pfp.src = `images/${currentUser.pfp}`;
  fullName.textContent = currentUser.firstName + " " + currentUser.lastName;
  userEmail.textContent = currentUser.email;
  number.textContent = currentUser.phoneNumber;
}

cartCount.textContent = cartState.length;
subscribeCart((state) => {
  cartCount.textContent = state.length;
});

let isValid = {
  emailField: false,
  passwordField: false,
};

const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (email.value === "") {
    isValid.emailField = false;
    email.style.border = "1px solid red";
  } else {
    if (!isValidEmail(email.value)) {
      isValid.emailField = false;
      email.style.border = "1px solid red";
    } else {
      isValid.emailField = true;
      email.style.border = "1px solid black";
    }
  }
  if (password.value === "") {
    isValid.passwordField = false;
    password.style.border = "1px solid red";
  } else {
    isValid.passwordField = true;
    password.style.border = "1px solid black";
  }

  function isThere(user) {
    return user.email == email.value;
  }
  const user = users.find(isThere);

  if (isValid.emailField == true && isValid.passwordField == true) {
    if (user) {
      if (user.password == password.value) {
        login(user);
        subscribeAuth(({ isLoggedIn, currentUser }) => {
          if (isLoggedIn) {
            loginPage.style.display = "none";
            userDetail.style.display = "block";

            pfp.src = `images/${currentUser.pfp}`;
            fullName.textContent =
              currentUser.firstName + " " + currentUser.lastName;
            userEmail.textContent = currentUser.email;
            number.textContent = currentUser.phoneNumber;
          } else {
            loginPage.style.display = "block";
            userDetail.style.display = "none";
          }
        });
      } else {
        showToast("Password is incorrect!", "error");
      }
    } else {
      showToast("User Not Found!", "error");
    }
  }
});

logOutBtn.addEventListener("click", () => {
  loginPage.style.display = "flex";
  userDetail.style.display = "none";
  logout();
});
