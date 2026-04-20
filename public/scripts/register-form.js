const form = document.getElementById("registerForm");

const password = document.querySelector('input[name="password"]');
const confirmPassword = document.querySelector('input[name="passwordConfirm"]');


/*
crear mensaje de error debajo del input
*/
let errorMsg = document.createElement("small");

errorMsg.textContent = "Las contraseñas no coinciden";

errorMsg.style.color = "#ef4444";

errorMsg.style.display = "none";


/*
lo agregamos debajo del input confirmar contraseña
*/
confirmPassword.parentElement.appendChild(errorMsg);



/*
validacion en tiempo real
*/
function validatePasswords() {

  /*
  si el campo confirmacion esta vacio no mostramos error
  */
  if (confirmPassword.value === "") {

    confirmPassword.classList.remove("error");

    errorMsg.style.display = "none";

    return;

  }


  /*
  si las contraseñas no coinciden
  */
  if (password.value !== confirmPassword.value) {

    confirmPassword.classList.add("error");

    password.classList.add("error");

    errorMsg.style.display = "block";

  }


  /*
  si coinciden
  */
  else {

    confirmPassword.classList.remove("error");

    password.classList.remove("error");

    errorMsg.style.display = "none";

  }

}



/*
escucha cambios mientras escriben
*/
password.addEventListener("input", validatePasswords);

confirmPassword.addEventListener("input", validatePasswords);



/*
evita enviar si no coinciden
*/
form.addEventListener("submit", (e) => {

  if (password.value !== confirmPassword.value) {

    e.preventDefault();

    validatePasswords();

  }

});