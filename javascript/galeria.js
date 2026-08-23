let poemasDB = []
const contenedor = document.getElementById("contenedor-poemas")
document.addEventListener("DOMContentLoaded", cargarDatos)
let poema
let indiceActual = null

async function obtenerDatosSheet () {
    const url = "https://script.google.com/macros/s/AKfycbxE4Nlafw0S-XPflTVJGLCdqo0yeoSru6xVlmI7TIrWXADN_tn_mzZ2c0WAyiUb4PefAQ/exec"

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
  <!-- Fondo degradado multicolor en movimiento -->
  <div class="loader-bg-animation"></div>
  
  <!-- Tarjeta flotante glassmorphism -->
  <div class="loader-content">
    
    <!-- PLANETA + ÓRBITAS (Sustituye al spinner) -->
    <div class="universo-container">
      <div class="anillo-orbital violeta"></div>
      <div class="anillo-orbital cian"></div>
      <div class="planeta-sara"></div>
    </div>

    <h2 class="loader-title">Explorando el SaraVerso</h2>
    <p class="loader-subtext">Cargando dimensiones y poemas...</p>
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

function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


const plantillas = {
    iconos: {
        pluma: `<i class="bi bi-feather"></i>`,
        trofeo: `<i class="bi bi-trophy"></i>`,
        mencion: `<i class="bi bi-award"></i>`
    },

    badges:{
        premio: `-premio`,
        mencion: `-mencion` 
    }

}

// Impresiones
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


const normalizarTexto = (texto) => {
    let textoCrudo = texto
    let textoArray = textoCrudo.split("\n")
    
    let textoNormalizado = textoArray.map((verso) => {
        if (verso.length <= 42) return verso

        let lineasProcesadas = []
        let restoDelVerso = verso.trim()
        let esPrimeraLinea = true

        while (restoDelVerso.length > (esPrimeraLinea ? 42 : 40)) {
            let limiteCaracteres = esPrimeraLinea ? 40 : 38
            
            let indiceCorte = restoDelVerso.lastIndexOf(" ", limiteCaracteres)
            if (indiceCorte === -1) indiceCorte = limiteCaracteres

            let partePoema = restoDelVerso.substring(0, indiceCorte)

            if (esPrimeraLinea) {
                lineasProcesadas.push(partePoema)
                esPrimeraLinea = false
            } else {
                lineasProcesadas.push(" [" + partePoema)
            }

            restoDelVerso = restoDelVerso.substring(indiceCorte).trim()
        }

        if (restoDelVerso.length > 0) {
            if (esPrimeraLinea) {
                lineasProcesadas.push(restoDelVerso)
            } else {
                lineasProcesadas.push(" [" + restoDelVerso)
            }
        }

        return lineasProcesadas.join("\n")
    })

    return textoNormalizado.join("\n")
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



const imprimirPoema = (config) => {
    const poema = poemasDB[indiceActual]

    if (config === "ticket"){
    const textoImprimible = normalizarTexto(poema.poema)
    const ticketFinal = plantilla(textoImprimible, poema.título, poema.seudónimo, poema.autoriza_nombre ? poema.nombre : "XXXXX", poema.extra)
    // const cantidadCopias = parseInt(document.getElementById("copias").value) || 1
    
    const ventanaImpresion = window.open("", "_blank")

    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Imprimir SARA-verso</title>
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

                .pie{
                    margin-bottom: 1em; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    text-align: center;
                    gap: 1em;
                }
            </style>
        </head>
        <body>
        
        <div style="text-align: center">
        <img src="./assets/images/versos herrantes - PNG.png" width="200px" alt="">
        </div>
        <div class="ticket-copia">${ticketFinal}</div>
                <div style="text-align: center">
        <img src="./assets/images/encabezado-saraverso.png" width="200px" alt="">

        </div>
        <div class="pie">
            <strong>Conocé otros poemas del Sara-verso entrando a este QR:</strong>
            <img src="./assets/images/QR/QR-saraverso.png" 
                alt="QR" 
                style="max-width: 200px; height: auto;">
        </div>
        <div class="linea-corte"></div>
        </body>
        </html>
    `) 
    const audio = new Audio("./assets/sounds/ring.mp3")
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



const plantilla = (texto, titulo, seudonimo, autoria, reconocimiento) => {
    return `
------------------------------------------
Escuela Sara Bartfeld Rietti
IVA EXENTO - Ingresos Brutos: 67676767
Inicio de actividades: 12/04/2021
A LECTORX FINAL
------------------------------------------
Factura falsa C N°: 0002-${formatear8(obtenerNumeroFactura())}
Fecha: ${insertarFecha()}
------------------------------------------
${lineaConPrecio(titulo)}

   \u00A0 ${seudonimo}
   \u00A0 [${autoria}]
__________________________________________

${texto}

------------------------------------------
* El valor de lo poético se mide con la 
\u00A0\u00A0invisible vara de lo intangible; tan    
\u00A0\u00A0incalculable es como pesar el silencio  
\u00A0\u00A0con las manos.
------------------------------------------
${reconocimiento}
`;
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
        <img src="./assets/images/encabezado-saraverso.png" 
             alt="Saraverso" 
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
            .split(/\n\s*\n/) // separa estrofas por líneas vacías
            .map(estrofa => {

                const versos = estrofa.split("\n")
                    .map(verso => `
                        <span style="display:block;">
                            ${verso}
                        </span>
                    `)
                    .join("");

                return `
                    <div style="
                        text-align: justify;
                        margin-bottom: 1.5em;
                        text-indent: 2em;
                    ">
                        ${versos}
                    </div>
                `;
            })
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
        <img src="./assets/images/versos herrantes - PNG.png" 
             alt="Septiembre con P de Poesía" 
             style="width:240px; margin-bottom:20px;">

        <p><strong>Escaneá este QR para explorar otros poemas de estudiantes de la ESBR:</strong></p>

        <img src="./assets/images/QR/QR-saraverso.png" 
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
                 tipoDeCard.icono = plantillas.iconos.pluma 
                 tipoDeCard.estilo_icono = "icono-estandar"
                 return tipoDeCard
                break;
            }

}

const centrar = (texto, ancho = 42) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2))
    return " ".repeat(espacios) + texto
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
    console.log(indiceActual)
    const poema = poemasDB[index]
    abrirModal(poema)
})

function abrirModal(poema) {
    
    const tipo = tipoDeCard(poema)




    document.getElementById("modalTitulo").innerHTML = `<strong>${poema["título"]}</strong> (${poema["año"]}) <span class="small-icon-${tipo.tipo}"><span>`

    document.getElementById("modalContenido").innerHTML = `
        <p><strong>Autoría:</strong> ${poema["seudónimo"]} ${poema.autoriza_nombre ? "[" + poema.nombre +"]" : ""}</p></p>
        <p><strong>Reconocimiento:</strong> ${poema.extra}</p>
        <hr>
        ${normalizarVersos(poema["poema"])}
    `

  


    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("modalPoema"))
    modal.show()
}

function normalizarVersos(texto) {
    return texto.replace(/\n/g, "<br>");
}

// Reemplazar QR


//
AOS.init()
