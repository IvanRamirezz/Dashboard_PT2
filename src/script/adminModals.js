function openModal(id){

document
.getElementById(id)
.classList
.remove("hidden");

}

function closeModal(id){

document
.getElementById(id)
.classList
.add("hidden");

}


/* aprobar */

document
.querySelectorAll(".open-approve-modal")
.forEach(btn=>{

btn.addEventListener("click",()=>{

const profesorId = btn.dataset.id;

document
.getElementById("approve-profesor-id")
.value = profesorId;

openModal("approveModal");

});

});


/* rechazar */

document
.querySelectorAll(".open-reject-modal")
.forEach(btn=>{

btn.addEventListener("click",()=>{

const profesorId = btn.dataset.id;

document
.getElementById("reject-profesor-id")
.value = profesorId;

openModal("rejectModal");

});

});


/* hacer funciones globales para botones cancelar */

window.closeModal = closeModal;
window.openModal = openModal;