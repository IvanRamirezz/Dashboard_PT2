import type { APIRoute }
from "astro";

import { supabaseAdmin }
from "../../../lib/supabaseAdmin";

export const POST: APIRoute =
async ({ request }) => {

const {
alumno_id,
practica_id,
calificacion
}

= await request.json();


const { error } =
await supabaseAdmin

.from("resultados")

.update({

calificacion

})

.eq("alumno_id", alumno_id)

.eq("practica_id", practica_id);


if(error){

return new Response(

JSON.stringify({
error:error.message
}),

{ status:500 }

);

}


return new Response(

JSON.stringify({

ok:true

})

);

};