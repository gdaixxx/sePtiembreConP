let poemasDB = []
let indiceActual = null
document.addEventListener("DOMContentLoaded", cargarDatos)


async function obtenerDatosSheet () {
    const url = "https://script.google.com/macros/s/AKfycbzE9Px6gNv0CGQVzWAu_NNg_48Z2Q1hM2NQh84gdtyapb-nK_KAMEVeC_BoV0nmi3BATg/exec"

    const respuesta = await fetch(url) // hago la petición
    const datos = await respuesta.json() // convierto a JSON

    const encabezados = datos[0].map(h =>
    h.toLowerCase().replace(/\s+/g, "_")
)

   
    const filas = datos.slice(1) // separar datos desde la fila 1 hasta el final, array sin titulos

    const objetos = filas.map(fila => {
        let obj = {}
        fila.forEach((dato, i) => {
            obj[encabezados[i]] = dato // key = encabezado, value = dato
        });
        return obj
    })

    return objetos
}

async function cargarDatos() {
      mostrarSpinner()
  try{
      poemasDB = await obtenerDatosSheet()
  } catch (err){
    console.error(err)
  }finally{
      console.log("Datos cargados:", poemasDB)
      poemasDB = mezclar(poemasDB)
      cargarPoemas()
      ocultarSpinner()
  }
}


function mostrarSpinner() {
    if (document.querySelector(".spinner") !== null) return

    const spinner = `
   

<div id="loader" class="loader-overlay">
  <!-- Fondo suave animado -->
  <div class="espacio-bg"></div>
  
  <div class="loader-content">
    <!-- SVG Animado de Kiwi -->
    <div class="loader-kiwi">
      <svg class="kiwi-svg" viewBox="0 0 417 384" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0,384) scale(0.1,-0.1)" fill="#ECD078">        
          <path d="M2934 3665 c-137 -30 -269 -100 -393 -207 -77 -68 -145 -102 -231 -118 -85 -15 -120 -9 -352 60 -248 75 -297 87 -433 100 -253 23 -545 -41 -765 -170 -357 -208 -588 -553 -645 -961 -19 -137 -19 -363 0 -494 45 -320 202 -605 442 -805 136 -113 267 -177 426 -207 l87 -17 0 -243 0 -243 -95 0 -95 0 0 -112 0 -113 810 0 810 0 0 113 0 112 -270 0 -270 0 0 259 0 258 45 17 c74 29 193 112 270 191 69 69 105 120 283 397 81 126 204 271 302 354 83 71 199 154 216 154 7 0 31 -48 54 -107 23 -60 111 -283 195 -498 84 -214 172 -438 195 -497 26 -69 47 -108 56 -108 13 0 276 78 280 83 9 11 24 333 24 522 -1 345 -25 575 -91 834 l-29 118 36 54 c98 144 138 279 138 464 0 147 -16 225 -69 342 -109 238 -302 398 -556 462 -97 25 -277 28 -375 6z m349 -229 c279 -89 463 -365 428 -645 -37 -294 -235 -488 -541 -532 -97 -13 -154 -39 -286 -128 -229 -154 -425 -368 -590 -643 -143 -241 -264 -354 -437 -413 -124 -41 -130 -36 -50 48 64 70 133 176 167 259 l16 36 -83 35 c-134 56 -123 56 -151 -7 -59 -132 -179 -263 -291 -315 -94 -45 -157 -56 -300 -55 -122 0 -136 2 -230 35 -55 19 -125 51 -155 71 -192 128 -346 344 -415 583 -55 192 -56 511 -2 705 67 238 207 447 396 591 92 70 267 154 386 185 87 24 121 27 260 28 183 1 199 -2 473 -85 248 -75 292 -83 405 -76 153 9 276 62 404 174 101 88 212 145 323 167 47 9 225 -3 273 -18z m306 -1323 c38 -171 60 -340 72 -547 9 -161 5 -415 -8 -403 -2 3 -82 203 -177 445 l-173 441 68 22 c37 12 94 37 126 54 32 18 63 33 70 34 6 0 16 -20 22 -46z m-2119 -1254 c39 -12 106 -23 168 -26 l102 -6 0 -233 0 -234 -225 0 -225 0 2 247 3 247 50 12 c28 6 52 12 55 13 3 0 34 -9 70 -20z"/>  
          <path d="M2987 2853 c-4 -3 -7 -55 -7 -115 l0 -108 115 0 115 0 0 115 0 115 -108 0 c-60 0 -112 -3 -115 -7z"/>
        </g>
      </svg>
    </div>

    <!-- Textos -->
    <h2 class="loader-title">Explorando la PROSA pía pía pía...</h2>
    <p class="loader-subtext">Cargando cuentos de estudiantes</p>
  </div>
</div>

    `;

    document.body.insertAdjacentHTML("afterbegin", spinner);
}

function ocultarSpinner(){
    

   
    // Seleccionamos el overlay completo del loader
    const loader = document.querySelector("#loader"); // o ".loader-overlay"
    
    if (!loader) return;

    // 1. Activa el fundido en CSS
    loader.classList.add("fadeout");

    // 2. Elimina el elemento del HTML tras completar la transición
    setTimeout(() => {
        loader.remove();
    }, 1000);
}





const plantillas = {
    iconos: {
        parrafo: `<i class="bi bi-justify-left"></i>`,
        trofeo: `<i class="bi bi-trophy"></i>`,
        mencion: `<i class="bi bi-award"></i>`
    },

    badges:{
        premio: `-premio`,
        mencion: `-mencion` 
    }

}








const contenedor = document.getElementById("contenedor-poemas")

function cargarPoemas () {

    poemasDB.forEach(
        (poema, i) => {
            const tipo = tipoDeCard(poema)
            console.log(tipo)
            const nuevaCard =  `<div class="card" data-index=${i} data-aos="flip-up">
            <span class="badge badge${tipo.badge}">${poema.reconocimiento}</span>
            <div class="icono ${tipo.estilo_icono}">
            ${tipo.icono} 
            </div>
            <div class="titulo">${poema.título}</div>
            <div class="nombre">
            <span class="nombre-fantasia">${poema.seudónimo}</span>
            <span class="nombre-real">${poema.autoriza_nombre ? poema.nombre : ""}</span>
            </div>
            </div>`
            
            contenedor.insertAdjacentHTML('beforeend', nuevaCard)
        }
    )
} 
    
        function tipoDeCard(poema){
            let tipoDeCard = {
                tipo: "",
                badge: "",
                icono: "",
                estilo_icono: ""
                
            }

            switch (poema.reconocimiento){
                case "Premio":
                 tipoDeCard.badge = plantillas.badges.premio
                 tipoDeCard.icono = plantillas.iconos.trofeo 
                 tipoDeCard.estilo_icono = "icono-premio"
                 tipoDeCard.tipo ="premio"
                 return tipoDeCard
                break;

                case "Mención":
                 tipoDeCard.badge = plantillas.badges.mencion
                 tipoDeCard.icono = plantillas.iconos.mencion 
                tipoDeCard.estilo_icono = "icono-mencion"
                tipoDeCard.tipo = "mencion"
                 return tipoDeCard
                break;

                default:
                 tipoDeCard.icono = plantillas.iconos.parrafo 
                 tipoDeCard.estilo_icono = "icono-estandar"
                 return tipoDeCard
                break;
            }

        }




contenedor.addEventListener("click", (event) => {
    const card = event.target.closest(".card")
    if (!card) return

    // acá ya tenés la card clickeada
    console.log("Card clickeada:", card)

    // si querés leer un atributo:
    const id = card.dataset.index   // si le agregás data-id
    console.log("ID del poema:", id)
    const index = card.dataset.index
    indiceActual = index
    const poema = poemasDB[index]
    abrirModal(poema)
})

function abrirModal(poema) {
    
    const tipo = tipoDeCard(poema)


    let html = `
        <p><strong>Autoría:</strong> ${poema["seudónimo"]} ${poema.autoriza_nombre ? "[" + poema.nombre +"]" : ""}</p>
        <p><strong>Reconocimiento:</strong> ${poema.extra}</p>
        <hr>
        ${normalizarVersos(poema["poema"])}
        `;

    if (poema.plataforma === "borogove") {

        html += 
            '<div style="text-align:center;font-family:Quicksand,sans-serif;color:#cbd5e1;margin:2em auto;padding:2em;max-width:500px;background:rgba(11,27,43,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:16px;backdrop-filter:blur(8px);">' +
                '<p style="margin:0;font-size:1.1rem;">Lo siento, no se puede abrir aquí.</p>' +
                '<a href="' + poema.poema + '" target="_blank" ' +
                    'style="display:inline-block;margin-top:1.2em;padding:0.8em 1.6em;background:#ECD078;color:#0b1b2b;font-weight:600;border-radius:10px;text-decoration:none;transition:all 0.2s ease;" ' +
                    'onmouseover="this.style.transform=\'translateY(-3px)\'; this.style.boxShadow=\'0 0 12px rgba(236,208,120,0.6)\'" ' +
                    'onmouseout="this.style.transform=\'none\'; this.style.boxShadow=\'none\'">' +
                    'Acceder a la historia' +
                '</a>' +
            '</div>';
    }


    document.getElementById("modalTitulo").innerHTML = `<strong>${poema["título"]}</strong> (${poema["año"]}) <span class="small-icon-${tipo.tipo}"><span>`

    document.getElementById("modalContenido").innerHTML = html

  


    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("modalPoema"))
    modal.show()
}

function normalizarVersos(texto) {
    return texto.replace(/\n/g, "<br>");
}


function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// IMPRIMIR CUENTO


const imprimirPoema = (config) => {
    
    const poema = poemasDB[indiceActual]

    if (config === "ticket"){

    const ticketFinal = plantilla(poema.poema, poema.título, poema.seudónimo, poema.autoriza_nombre ? poema.nombre : "XXXXX", poema.extra)
    
    const ventanaImpresion = window.open("", "_blank")

    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Imprimir PROSA-pía</title>
            <style>
                body {
                    font-family: 'FontA2x2', 'FontA', consolas;
                    font-size: 14px;
                    line-height: 1.2;
                    // padding: 15px;
                    width: 97%; 
                }
                .ticket-copia { 
                    white-space: pre-line; 
                    margin-bottom: 20px;
                }
                .linea-corte { 
                    border-top: 1px dashed #000; 
                    margin: 20px 0; 
                    text-align: center;
                }
            </style>
        </head>
        <body>
        
        <div style="text-align: center">
        <img src="../assets/images/encabezado-prosapia.png" width="200px" alt="">
        </div>
        <div class="ticket-copia">${ticketFinal}</div>
        <div style="text-align: center; margin-bottom:1em">
        <hr>
         <img src="../assets/images/versos herrantes - PNG.png" width="200px" alt="">
          <hr>
        <strong>Escaneá este QR para conocer el final de esta historia y explorar otras:</strong>
            <img src="../assets/images/QR/QR-prosapia.png" alt="QR" style="max-width: 200px; height: auto;">
            </div>
        </body>
        </html>
    `) 
    const audio = new Audio("../assets/sounds/ring.mp3")
    audio.play()
    ventanaImpresion.document.close()
    ventanaImpresion.print()
} else if (config === "a4") {

    const poema = poemasDB[indiceActual]
    const htmlA4 = plantillaA4(
        poema.poema,
        poema.título,
        poema.seudónimo,
        poema.autoriza_nombre ? poema.nombre : "XXXXX",
        poema.extra
    )

    const ventanaImpresion = window.open("", "_blank")

    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Imprimir A4</title>
        </head>
        <body>
            ${htmlA4}
        </body>
        </html>
    `)

    ventanaImpresion.document.close()
    ventanaImpresion.print()
}

}

const plantillaA4 = (texto, titulo, seudonimo, autoria, reconocimiento) => {
    return `
<div style="
    font-family: 'Georgia', serif;
    font-size: 17px;
    line-height: 1.7;
    margin: 20px auto;        
    width: 95%;           
    color: #222;
">

    <!-- Encabezado PROSAPIA -->
    <div style="text-align:center; margin-bottom: 20px;">
        <img src="../assets/images/encabezado-prosapia.png" 
             alt="PROSAPIA" 
             style="width:240px; margin-bottom:15px;">
    </div>

    <!-- HR antes del título -->
    <hr style="border: 0; border-top: 1px solid #999; margin: 25px 0;">

    <!-- Título -->
    <h1 style="
        font-size: 32px;
        margin: 0 0 10px 0;
        text-align: center;
        font-weight: bold;
    ">
        ${titulo}
    </h1>

    <!-- Autoría -->
    <p style="
        font-size: 18px;
        margin: 0;
        text-align: center;
    ">
        <strong>${seudonimo}</strong> 
        <span style="color:#777;">[${autoria}]</span>
    </p>

    <!-- HR antes del cuerpo del texto -->
    <hr style="border: 0; border-top: 1px solid #999; margin: 25px 0;">

    <!-- Cuerpo del cuento -->
    <div style="
        text-align: justify;
        font-size: 18px;
    ">
        ${texto
            .split("\n")
            .map(p => `
                <p style="
                    text-indent: 2em; 
                    margin: 0 0 1em 0;
                ">
                    ${p}
                </p>
            `)
            .join("")}
    </div>

    <div style="border-top: 1px solid #999; margin: 25px 0;"></div>

    <!-- Reconocimiento -->
    <p style="
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 30px;
    ">
        ${reconocimiento}
    </p>

    <!-- Pie con imagen de septiembre + QR -->
    <div style="text-align:center; margin-top:30px;">
        <img src="../assets/images/versos herrantes - PNG.png" 
             alt="Septiembre con P de Poesía" 
             style="width:240px; margin-bottom:20px;">

        <p><strong>Escaneá este QR para explorar otras narraciones escritas por estudiantes de la ESBR:</strong></p>

        <img src="../assets/images/QR/QR-prosapia.png" 
             alt="QR" 
             style="width:200px;">
    </div>
    <!-- Cita poética -->
    <blockquote style="
        font-style: italic;
        color: #444;
        border-left: 4px solid #ccc;
        padding-left: 15px;
        margin: 20px 0;
        text-align: justify;
    ">
        El valor de lo poético se mide con la invisible vara de lo intangible;  
        tan incalculable es como pesar el silencio con las manos.
    </blockquote>

</div>
`;
}

const acortarCuento = (cuento) => {
    const arrayPalabras = cuento.split(" ")
    const cuentoRecortado = arrayPalabras.splice(0, 250).join(" ") + "... [¡¡CONTINUARÁ!!]"
    return cuentoRecortado    
}

const plantilla = (texto, titulo, seudonimo, autoria, reconocimiento) => {
    return `
------------------------------------------
Escuela Sara Bartfeld Rietti
IVA EXENTO - Ingresos Brutos: 67676767
Inicio de actividades: 12/04/2021
A LECTORX FINAL
------------------------------------------
Factura falsa C N°: 0003-${formatear8(obtenerNumeroFactura())}
Fecha: ${insertarFecha()}
------------------------------------------
${lineaConPrecio(titulo)}

   \u00A0 ${seudonimo}
   \u00A0 [${autoria}]
__________________________________________

${acortarCuento(texto)}

------------------------------------------
* El valor de lo poético se mide con la 
\u00A0\u00A0invisible vara de lo intangible; tan    
\u00A0\u00A0incalculable es como pesar el silencio  
\u00A0\u00A0con las manos.
------------------------------------------
${reconocimiento}
`;
}

const lineaConPrecio = (titulo, precio = "0*", ancho = 42) => {
    const derecha = `$ ${precio}`

    // 1) Cortar sin romper palabras (máximo 25 caracteres)
    let primeraLinea = titulo.slice(0, 25)

    // Si el corte rompe una palabra, retrocedemos al último espacio
    if (titulo.length > 25 && titulo[25] !== " ") {
        const ultimoEspacio = primeraLinea.lastIndexOf(" ")
        if (ultimoEspacio !== -1) {
            primeraLinea = primeraLinea.slice(0, ultimoEspacio)
        }
    }

    // 2) Segunda línea: resto del título
    const segundaLineaTitulo = titulo.slice(primeraLinea.length)

    // 3) Construir la segunda línea con el precio alineado a la derecha
    const izquierdaSegunda = "\u00A0" + segundaLineaTitulo
    const espacios = Math.max(0, ancho - izquierdaSegunda.length - derecha.length -2)
    const segundaLinea = izquierdaSegunda + ".".repeat(espacios) + derecha

    // 4) Si el título cabe en una sola línea
    if (!segundaLineaTitulo) {
        const izquierda = `1  ${primeraLinea}`
        const espaciosUnaLinea = Math.max(0, ancho - izquierda.length - derecha.length -2)
        return izquierda + ".".repeat(espaciosUnaLinea) + derecha
    }

    // 5) Si el título tiene dos líneas
    return (
        `1  ${primeraLinea}\n` +
        segundaLinea
    )
}


const formatear8 = (num) => num.toString().padStart(8, "0")

 const insertarFecha = () => {
    return new Date().toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
 }

const obtenerNumeroFactura = () => {
    let numero = parseInt(localStorage.getItem("facturaNumero"), 10)

    if (!numero || isNaN(numero)) {
        numero = 1
    }

    const actual = numero++   // devuelve el número actual
    localStorage.setItem("facturaNumero", numero.toString()) // guarda el incrementado

    return actual
}

//
AOS.init()
