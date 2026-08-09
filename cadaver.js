
const verVersoAnterior = true
let versoAnterior = "" 
const nombreEstudiante = ""
let poema = ""
const txt = document.getElementById("nuevo-verso")
const form = document.getElementById("text-input")
const continuarBtn = document.getElementById("continuar")



function censura(texto) {
    const prohibidas = [
        "culo", "culos",
        "puto", "putos", 
        "puta", "putas", 
        "reputa", "reputas", 
        "semen", 
        "caca", "cacas", "sorete", "soretes",
        "cagada", "cagadas", 
        "pelotudo", "pelotudos",
        "pelotuda", "pelotudas",
        "boludo", "boludos",
        "boluda", "boludas",
        "reputísima", "reputísimas",
        "pito", "pitos", 
        "verga", "vergas", 
        "concha", "conchas", 
        "poronga", "porongas", 
        "chupapija", "chupapijas", 
        "petero", "peteros",
        "petera", "peteras", 
        "putita", "putitas", 
        "ojete", "ojetes", 
        "mierda", "mierdas", 
        "trolo", "trolos", 
        "trola", "trolas", 
        "trolazo", "trolazos", 
        "tragaleche", "tragaleches", 
        "waska", "wasca", "guasca", "guazca", 
        "gay", "gays",
        "pedófilo"
    ]
    
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
        title: "¡Santos cielos! ¡Recórcholis! ¡Rayos y centellas!",
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
IVA EXENTO - Escuela Sara Bartfeld Rietti
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
let modalContainer = null
let modalReadyToOpen = false

function abrirModalInicio() {
  if (!modalContainer) {
    modalReadyToOpen = true
    return
  }

  modalContainer.style.display = "flex"
  requestAnimationFrame(() => {
    modalContainer.style.opacity = "1"
    document.getElementById("modal-box").style.transform = "scale(1)"
  })
}

document.addEventListener("DOMContentLoaded", function() {

  modalContainer = document.createElement("div")
  modalContainer.id = "modal-container"
  modalContainer.style.display = "none"

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

  document.getElementById("cerrar-modal").addEventListener("click", () => {
    modalContainer.style.opacity = "0"
    document.getElementById("modal-box").style.transform = "scale(0.9)"
    setTimeout(() => modalContainer.remove(), 300)
  })

  if (modalReadyToOpen) {
    abrirModalInicio()
  }

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


// Loader

function mostrarSpinner() {
    if (document.querySelector(".spinner") !== null) return

    const spinner = `
        
        <div id="loader" class="loader-overlay">
        <!-- Fondo suave animado -->
        <div class="espacio-bg"></div>
        
        <div class="loader-content">
            <!-- SVG Animado de Kiwi -->
            <div class="loader-kiwi">
                
                            
                            <svg width="125px" height="125px" viewBox="0 0 48 48"  xmlns="http://www.w3.org/2000/svg" fill="#ECD078" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.a{fill:none;stroke:#ECD078;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M42.9426,29.8535c-.2706-1.5577-4.7375-5.5846-6.8575-6.0408"></path><path class="a" d="M32.95,27.6523a53.2,53.2,0,0,1,3.6967-4.507c1.0269-.9262,1.9556-5.0592.5447-8.1206S34.69,8.5379,31.83,6.377s-12.9426-2.3411-18.2046.3268-7.99,8.9233-7.7037,9.731,1.5516,1.1116,1.5516,1.1116"></path><path class="a" d="M7.4723,17.5469s.5229-1.261,2.9367-.4768,4.3184,5.3893,2.0694,7.3587-3.71,1.1832-4.7623.3755-.6265,1.49,1.06,3.65"></path><path class="a" d="M8.7763,28.4542s1.4567.4966,1.6867-.723"></path><path class="a" d="M13.6455,33.7655s9.9116.3033,10.7071.0836,1.458-2.79.0572-4.13-2.0366-2.4592-6.3963-2.4169-7.5506.4288-7.5506.4288"></path><path class="a" d="M17.5393,27.6973s-.1461,1.9574.6118,2.2546c.6135.1171,1.6877.314,1.9992-.5454-.2348-.9357-.3858-1.8053-.388-1.8052"></path><path class="a" d="M21.3121,27.921s-.0218,1.1625.5387,1.4364a1.3762,1.3762,0,0,0,1.5807-.3857"></path><path class="a" d="M13.1594,27.7241s-1.3288,2.13.2306,2.5081,3.4858.2793,3.0518-.7854-.5523-1.8584-.4238-1.9219"></path><path class="a" d="M14.06,33.5856s-.9463-1.7316-.3021-1.8047,2.02-.3923,2.5511.5481c.1346.7489.0213.5051-.1311,1.4324"></path><path class="a" d="M21.08,33.8908a5.1023,5.1023,0,0,1-.6043-2.4512c.07-.7875,1.2745-.5637,1.8838-.5637s1.3736.1025,1.2367,1.0837-.396,1.94-.9545,1.93"></path><path class="a" d="M13.1755,32.6788s-1.77,1.1716-1.0666,2.04,1.8268.7072,2.7531.6778"></path><path class="a" d="M14.5448,35.5341s-1.0743,1.7142.1137,2.1464,7.047.2064,7.355.1023,5.4913-2.5373,5.6025-2.73,2.2923-3.2511,2.2923-3.2511"></path><path class="a" d="M28.7881,33.6509a19.1324,19.1324,0,0,0,5.0577-4.279"></path><path class="a" d="M21.3057,37.8927a8.7909,8.7909,0,0,0-1.0514,1.4129A4.3142,4.3142,0,0,0,21.033,43.5"></path><path class="a" d="M33.7964,26.8237s1.5121,9.1693-2.9151,12.8526"></path><path class="a" d="M28.5162,33.95c.4108-.0333,3.0512,3.4963,2.3649,5.727"></path><path class="a" d="M22.83,37.428a11.82,11.82,0,0,0,.077,3.1913A3.3159,3.3159,0,0,0,24.31,41.8171"></path><path class="a" d="M24.7883,36.8885a3.0707,3.0707,0,0,0,2.31,1.391,3.7539,3.7539,0,0,0,2.7986-2.1316"></path><path class="a" d="M25.8215,38.1828s-1.3037,3.8877-1.5479,5.0483"></path><path class="a" d="M29.23,37.2728a35.115,35.115,0,0,0-.5079,5.2719"></path><path class="a" d="M14.0651,11.5707s.9406.8713,2.875-.0808a6.6677,6.6677,0,0,1,4.5761-.6125"></path><path class="a" d="M22.1354,12.8747a4.682,4.682,0,0,0-4.0189.3417c-2.4278,1.3023-5.2864.6766-6.1012-.6841"></path><path class="a" d="M17.808,21.4278a.57.57,0,0,1,.8441.2793c.3433.6159.9947,2.031.4774,2.4209"></path><path class="a" d="M15.6079,22.6462s-.3687-.2554-.71.2338a1.22,1.22,0,0,0-.0479,1.4352"></path><circle class="a" cx="26.2669" cy="19.8733" r="5.0888"></circle><path class="a" d="M34.3564,26.1053s4.302,5.6493,3.0088,11.615"></path><path class="a" d="M12.1884,8.4349A2.806,2.806,0,0,1,10.9949,4.73"></path><path class="a" d="M9.3523,10.0729s-.36-1.946-2.268-.4271-2.1525-1.2247-1.63-1.5252"></path><path class="a" d="M7.84,11.6949a2.459,2.459,0,0,0-2.7821,1.1158"></path><path class="a" d="M30.2677,7.3108c.2113-.1969.8762-2.5676,2.5488-2.8108"></path><path class="a" d="M36.1743,15.4924a2.16,2.16,0,0,1,2.1733-.9718"></path><circle class="a" cx="26.8018" cy="19.5731" r="1"></circle><circle class="a" cx="9.1529" cy="20.9046" r="0.9552"></circle><path class="a" d="M7.3717,24.6246A4.0227,4.0227,0,0,1,5.7732,21.264a4.273,4.273,0,0,1,4.0056-4.3274"></path><path class="a" d="M13.89,31.8138a.9491.9491,0,0,0-.1789-1.4582"></path><path class="a" d="M29.7142,30.0558a8.2744,8.2744,0,0,0,1.584-2.0411c.217-.7034-.3332-1.2169-.1124-1.83a5.3534,5.3534,0,0,1,1.4185-1.5137"></path></g></svg><!-- … -->
                        </svg>
            </div>

            <!-- Textos -->
            <h2 class="loader-title">La poesía no ha muerto, está entre nosotrxs</h2>
            <p class="loader-subtext">Resucitando poetas pretéritos...</p>
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
        abrirModalInicio()
    }, 1000);
}


mostrarSpinner()

setTimeout(()=>{
    ocultarSpinner()
}, 4000)

alertaTexto()


