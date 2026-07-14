
const verVersoAnterior = true
let versoAnterior = "" 
const nombreEstudiante = ""
let poema = ""
const txt = document.getElementById("nuevo-verso")
const form = document.getElementById("text-input")
const continuarBtn = document.getElementById("continuar")



function censura(texto) {
    const prohibidas = ["culo", "puto", "puta", "reputa", "semen", "caca", "cagada", "pelotudo", "pelotuda", "boludo", "boluda", "reputísima", "pito", "verga", "concha", "poronga", "chupapija", "petera", "putita", "ojete", "mierda", "trolo", "trola", "trolazo", "tragaleche", "waska", "wasca", "guasca", "guazca", "gay"]
    
    // Convertimos a minúsculas para que no esquiven el filtro con Mayúsculas
 

    const palabras = texto.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¡?¿!"]/g, "").split(" ")
    const resultado = palabras.some(palabra => prohibidas.includes(palabra))
    // some() devuelve true si encuentra alguna prohibida, o false si no
    return resultado
}

const reiniciarAlerta = () => {
    const alertaTextoElemento = document.getElementById("alertas")
    alertaTextoElemento.innerHTML = `Caracteres: <span id="contador-caracteres">0</span>/42`        
}


function guardarVersoExitoso(nuevoVerso){
    poema += nuevoVerso + "\n"

    document.getElementById("poema-container").classList.remove("d-none")
    document.getElementById("nuevo-verso").value = ""
    
    const versos = poema.split("\n")
    versoAnterior = versos[versos.length -2]
    
    document.getElementById("ultimo-verso").innerText = versoAnterior
    document.getElementById("titulo-seccion").textContent = "VERSO ANTERIOR..."
    
    reiniciarAlerta()
    reproducirSonidoAzar()
    habilitarTerminar() 

}

function procesarVersoConAdvertencia(verso) {

    const errorSound = new Audio('./assets/sounds/error.mp3')
    const dignidadSound = new Audio('./assets/sounds/you-have-no-dignity.mp3')
    errorSound.play()

    Swal.fire({
        title: "¡Santos cielos! ¡Recórcholis!",
        text: "Ingresaste una palabra que puede tener connotaciones ofensivas o discriminatorias. ¿Deseás continuar de todos modos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#474d54",
        cancelButtonColor: "#0b486b",
        confirmButtonText: "Sí, continuar 💩",
        cancelButtonText: "Perdón, corregir 😳",
        reverseButtons: true,
        focusCancel: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario insiste, llamamos a la función que ya tenías
            dignidadSound.playbackRate = 1.8
            dignidadSound.play()
            setTimeout(() => {guardarVersoExitoso(verso)}, "1300");
            
        }
    })
}

function errorMsgNoHayVerso (){
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "¡La caja de texto está vacía!",
  confirmButtonColor: "#0b486b",
});
}



function acumularVerso(event, autor = "Anónimo") {
    event.preventDefault()

    const verso = document.getElementById("nuevo-verso")
    
    if (!verso.value) {
        errorMsgNoHayVerso()
        return
    }

    // Pasamos el valor del input a la función de censura
    if (censura(verso.value)) {
        procesarVersoConAdvertencia(verso.value)
    } else {
        // Si no hay censura, pasa directo
        guardarVersoExitoso(verso.value)
    }
}

const terminarPoema = () => {
    if(!poema) {alert("Tu cadáver está vacío...")} else{
        document.getElementById("poema-terminado").innerText = poema
        document.getElementById("poema-terminado").hidden = false
        document.getElementById("ultimo-verso").hidden = true
        document.getElementById("terminar").disabled = true
        document.getElementById("terminar").classList.remove("btn-warning")

        habilitarImprimir()

        document.getElementById("continuar").disabled = true
        document.getElementById("anonimo").disabled = true
        document.getElementById("nuevo-verso").disabled = true
        document.getElementById("titulo-seccion").textContent = "POEMA TERMINADO"
        const video = document.getElementById("video-fondo")
        // const sonido = document.getElementById("sonido-final")
        video.playbackRate = 2
        video.play()  
        reproducirSonido("./assets/sounds/funebre.mp3", 1.2, 0.8)
        document.getElementById("nuevo-poema").disabled = false // efecto de destacar
    }
}

function generarCodigoPoema() {
return Array.from(crypto.getRandomValues(new Uint8Array(3)), b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

const nuevoPoema = () => {
        document.getElementById("poema-terminado").hidden = true
        // document.getElementById("poema-terminado").textContent = ""
        poema = ""
        versoAnterior = ""
            document.getElementById("poema-terminado").innerText = poema
    
    document.getElementById("terminar").disabled = false
    document.getElementById("continuar").disabled = true
    document.getElementById("anonimo").disabled = false
    document.getElementById("poema-container").classList.add("d-none")
    document.getElementById("nuevo-poema").disabled = true
    document.getElementById("nuevo-verso").disabled = false
    document.getElementById("alertas").innerHTML = ""
    document.getElementById("video-fondo").currentTime = 0
    document.getElementById("video-fondo").playbackRate  = 1
    document.getElementById("video-fondo").pause() 
    habilitarTerminar()   
    deshabilitarImprimir()
    reproducirSonido("./assets/sounds/cancel.mp3", 1, 1)
}


const imprimirCadaver = () => {
    const textoImprimible = normalizarTexto(poema)
    const ticketFinal = plantillaCadaver(textoImprimible)
    const cantidadCopias = parseInt(document.getElementById("copias").value) || 1
    
    const ventanaImpresion = window.open("", "_blank")

    // 1. Escribimos la cabecera del HTML una sola vez
    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Imprimir Cadáver Exquisito</title>
            <style>
                body {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    padding: 15px;
                    width: 340px; 
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
    `);

    // 2. El bucle ahora sí escribe solo las copias de los tickets
    for (let i = 0; i < cantidadCopias; i++) {
        ventanaImpresion.document.write(`
            <div class="ticket-copia">${ticketFinal}</div>
        `);

        // Si no es la última copia, metemos la línea de puntos para cortar
        if (i < cantidadCopias - 1) {
            ventanaImpresion.document.write(`
                <div class="linea-corte">✂ - - - - - - - - - - - - - -</div>
            `);
        }
    } 

    reproducirSonido("./assets/sounds/ring.mp3", 1, 1)
    ventanaImpresion.document.write('</body></html>')
    ventanaImpresion.document.close()
    ventanaImpresion.print()
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


 const insertarFecha = () => {
    return new Date().toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
 }

const plantillaCadaver = (texto) => {
    return `
------------------------------------------
***  SePtiembre con P de Poesía 2026 ***
------------------------------------------
Fecha: ${insertarFecha()}
IVA EXENTO - Escuela Sara Bartfeld
ID poema: ${generarCodigoPoema()}
------------------------------------------
${texto}
------------------------------------------
UD. SE LLEVA ENTRE MANOS UN CADAVER 
EXQUISITO, UN POEMA ESCRITO POR MUCHXS 
QUE AHORA YA NO ES DE NADIE Y A LA VEZ
ES DE TODXS. FELICITACIONES, HAS MATADO 
LA FIGURA DEL AUTOR.

[Espacio para código QR]
------------------------------------------`;
}



// VALIDACION 

document.addEventListener("DOMContentLoaded", () => {
    continuarBtn.disabled = true
})

function alertaTexto () {

    // const contador = document.getElementById("contador-de-caracteres")
    const alertaTextoElemento = document.getElementById("alertas")

    txt.addEventListener("input", (event) => {
        const longitud = txt.value.trim().length

        if(longitud > 42){
            txt.classList.add("border-warning", "shadow-none")
            alertaTextoElemento.classList.remove("text-muted")
            alertaTextoElemento.classList.add("text-warning")
            alertaTextoElemento.innerHTML = `Caracteres: <strong> ${longitud}</strong>/42. ¡Verso largo! Se imprimirá en dos renglones con [ ]`
        } else {
            txt.classList.remove("border-warning")
            alertaTextoElemento.classList.remove("text-warning")
            alertaTextoElemento.classList.add("text-muted")
            alertaTextoElemento.innerHTML = `Caracteres: <span id="contador-caracteres">${longitud}</span>/42`
        
        }
        
        document.getElementById("continuar").disabled = (longitud === 0)

    })

}


// Destacado - confiar en la IA

form.addEventListener("submit", (event) => {

    continuarBtn.classList.add("btn-highlight")
    setTimeout(() => continuarBtn.classList.remove("btn-highlight"), 1000)

    txt.classList.add("input-energia-carga")
    setTimeout(() => txt.classList.remove("input-energia-carga"), 1000)

})

// Cambio de color de botones
function setEstadoBoton(boton, activo) {
    boton.disabled = !activo

    if (activo) {
        boton.classList.add("btn-warning")
    } else {
        boton.classList.remove("btn-warning")
    }
}

// Estilado de pesudoboton segun este activo o no
function deshabilitarImprimir() {
    const wrapper = document.getElementById("imprimir-wrapper")
    const btn = document.getElementById("imprimir")
    const input = document.getElementById("copias")

    wrapper.classList.add("disabled")
    btn.disabled = true
    input.disabled = true
}

function habilitarImprimir() {
    const wrapper = document.getElementById("imprimir-wrapper")
    const btn = document.getElementById("imprimir")
    const input = document.getElementById("copias")

    wrapper.classList.remove("disabled")
    btn.disabled = false
    input.disabled = false
}

// Reproducir sonido
function reproducirSonido(ruta, velocidad = 1, volumen = 1) {
    const audio = new Audio(ruta)
    audio.playbackRate = velocidad
    audio.volume = volumen
    audio.play()
}


// Audios al azar para nuevo

const sonidosPool = [
    "./assets/sounds/send-sound/aldeano1.mp3",
    "./assets/sounds/send-sound/coin.mp3",
    "./assets/sounds/send-sound/Witch_celebrate.mp3",
    "./assets/sounds/send-sound/sendo (1).mp3",
    "./assets/sounds/send-sound/sendo (2).mp3",
    "./assets/sounds/send-sound/sendo (3).mp3",
    "./assets/sounds/send-sound/sendo (4).mp3",
    "./assets/sounds/send-sound/sendo (5).mp3",
    "./assets/sounds/send-sound/sendo (1).ogg",
    "./assets/sounds/send-sound/sendo (2).ogg",
    "./assets/sounds/send-sound/sendo (3).ogg",
    "./assets/sounds/send-sound/sendo (4).ogg",
    "./assets/sounds/send-sound/sendo (5).ogg",
    "./assets/sounds/send-sound/sendo (6).ogg",
    "./assets/sounds/send-sound/sendo (7).ogg",
    "./assets/sounds/send-sound/sendo (8).ogg",
    "./assets/sounds/send-sound/sendo (9).ogg",
    "./assets/sounds/send-sound/sendo (10).ogg",
    "./assets/sounds/send-sound/sendo (11).ogg",
];

function reproducirSonidoAzar() {
    const indiceAzar = Math.floor(Math.random() * sonidosPool.length);
    const rutaSeleccionada = sonidosPool[indiceAzar];
    const audioAzar = new Audio(rutaSeleccionada);
    //audioAzar.volume = 0.8; 
    audioAzar.play();
}

function habilitarTerminar() {
    const terminarBtn = document.getElementById("terminar")
    const desecharBtn = document.getElementById("nuevo-poema")
    if(poema.length > 0){
        terminarBtn.disabled = false
        terminarBtn.classList.add("btn-warning")
        desecharBtn.disabled = false
        desecharBtn.classList.add("btn-warning")
    } else{
        terminarBtn.disabled = true
        terminarBtn.classList.remove("btn-warning")
        desecharBtn.disabled = true
        desecharBtn.classList.remove("btn-warning")
    }
}

// Modal de incio
document.addEventListener("DOMContentLoaded", function() {

  const modalContainer = document.createElement("div")
  modalContainer.id = "modal-container"

  modalContainer.innerHTML = `
    <div id="modal-box">
      <h2 style="text-align:center; padding-bottom:0.5em">¿Primera vez por acá?</h2>

      <p>Te contamos cómo funciona este cadáver tecno-exquisito. </p>

      <p>Primero lo primero: no se juega en solitario. Necesitás a otras personas. Por turnos, cada participante se acerca a la pantalla y escribe lo primero que le venga a la mente: onomatopeyas, palabras, frases... <strong>No hay que pensar demasiado</strong>: la gracia es dejarse llevar y renunciar a la coherencia.</p>

      <p>Podés leer lo que escribió quien pasó antes, pero <strong>solo eso</strong>. Lo que ingreses será un verso dentro de un poema colectivo.</p>
<hr>
      <p><strong>Reglas básicas:</strong><br>
      🧠 No pensar de más<br>
      🫣 No espiar a tus compañerxs mientras escriben<br>
      💩 Evitar lenguaje soez y expresiones discriminatorias<br>
      🖨️ Cuando todxs hayan participado, finalizá el poema e imprimí una copia</p>
    <hr>
      <p> ¿Estás solx? No importa. Podés fingir demencia y probar igual escribir de corrido, un verso atrás del otro, sin pensar demasiado y probar.</p>
      <p>¡El resultado te sorprenderá! 🧟</p>
    <div id=cerrar-modal-btn-container>
      <button id="cerrar-modal">Entendido</button></div>
    </div>
  `

  document.body.appendChild(modalContainer)

  requestAnimationFrame(() => {
    modalContainer.style.opacity = "1"
    document.getElementById("modal-box").style.transform = "scale(1)"
  })

  document.getElementById("cerrar-modal").addEventListener("click", () => {
    modalContainer.style.opacity = "0"
    document.getElementById("modal-box").style.transform = "scale(0.9)"
    setTimeout(() => modalContainer.remove(), 300)
  })

})

// Ocultar el btn info si aparece el teclado en la pantalla del celular
window.visualViewport.addEventListener("resize", () => {
  const btn = document.getElementById("btn-info")

  // Si el viewport se achicó mucho, asumimos que apareció el teclado
  if (window.visualViewport.height < window.innerHeight * 0.75) {
    btn.style.display = "none"
  } else {
    btn.style.display = "flex"
  }
})




//
alertaTexto()
