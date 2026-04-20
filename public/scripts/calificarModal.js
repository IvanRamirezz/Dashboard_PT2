let alumnoActual = null;
let practicaActual = null;


/*
abrir modal al hacer clic
*/
document.addEventListener(

"click",

e => {

if(

e.target.classList.contains(
"teacher-btn-sm"
)

){

const btn = e.target;

alumnoActual =
btn.dataset.alumno;

practicaActual =
btn.dataset.practica;

const respuestas =
JSON.parse(
btn.dataset.json
);

crearPreguntas(respuestas);

abrirModal();

}

}

);



/*
crear inputs
*/
function crearPreguntas(
respuestas
){

const container =
document.getElementById(
"preguntasContainer"
);

container.innerHTML = "";


Object.entries(respuestas)
.forEach(

([pregunta,respuesta],
index)=>{

const div =
document.createElement("div");

div.className =
"pregunta-box";


div.innerHTML = `

<label>

${index+1}.
${pregunta}

</label>


<p>

Respuesta:
${respuesta}

</p>


<input
type="number"
min="0"
max="1"
step="0.01"
placeholder="0 - 1"
class="input-calificacion"
required
>

`;

container.appendChild(div);

}

);

}



/*
mostrar modal
*/
function abrirModal(){

document

.getElementById(
"modalCalificar"
)

.style.display="flex";

}



/*
calcular en tiempo real
*/
document.addEventListener(

"input",

e => {

if(

!e.target.classList.contains(
"input-calificacion"
)

)return;


const inputs =
document.querySelectorAll(
".input-calificacion"
);


let suma = 0;


inputs.forEach(

i => {

const valor =
Number(i.value);


if(!isNaN(valor))

suma += valor;

}

);


const total =
inputs.length
? (suma / inputs.length) * 10
: 0;


document
.getElementById(
"previewCalificacion"
)
.textContent =
total.toFixed(2);

}

);



/*
guardar calificación
*/
document

.addEventListener(

"submit",

async e=>{

if(

e.target.id !==
"formCalificacion"

)return;


e.preventDefault();


const inputs =
document.querySelectorAll(
".input-calificacion"
);


let suma = 0;


inputs.forEach(
i => suma += Number(i.value)
);


const total =
(suma / inputs.length) * 10;


/*
guardar
*/
await fetch(

"/api/profesor/calificar",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

alumno_id:
alumnoActual,

practica_id:
practicaActual,

calificacion:
total

})

}

);


/*
cerrar modal
*/
document

.getElementById(
"modalCalificar"
)

.style.display="none";


location.reload();

}

);



/*
cerrar al dar clic fuera
*/
window.onclick = e =>{

const modal =
document.getElementById(
"modalCalificar"
);

if(e.target === modal)
modal.style.display="none";

};