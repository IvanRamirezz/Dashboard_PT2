export function openModal(id: string){

const modal =
document.getElementById(id);

if(modal){

modal.classList.remove("hidden");

}

}

export function closeModal(id: string){

const modal =
document.getElementById(id);

if(modal){

modal.classList.add("hidden");

}

if(id==="successModal"){

const url =
new URL(window.location.href);

url.searchParams.delete("updated");

window.history.replaceState({}, "", url);

}

}