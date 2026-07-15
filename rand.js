// Elementos del DOM
const poemaTexto = document.querySelector(".texto-poema")
const poemaTitulo = document.querySelector(".titulo-poema")
const poemaAutoria = document.querySelector(".autoria-poema")
const poemaContainer = document.querySelector(".poema")

// Poemas al azar

let poemasDB = []

// Funciones asíncronas
async function obtenerDatosSheet() {
  const url = "https://script.google.com/macros/s/AKfycbz8OJ2N4pG5L2fa-5jdPYbHlLYG2IoSxFJDHFsjga7i9PTuos2MObU2iwN8naupAF9U/exec"

  const respuesta = await fetch(url)
  const datos = await respuesta.json()

  const encabezado = datos[0]          // primera fila: títulos
  const filas = datos.slice(1)         // resto de filas: datos

  const objetos = filas.map(fila => {
    let obj = {}
    fila.forEach((dato, i) => {
      obj[encabezado[i]] = dato        // key = encabezado, value = dato
    })
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
      ocultarSpinner()
  }
}


//

//Función de botón
const randomPoemHandler = () => {
    document.querySelector(".poema-wrapper").classList.remove("d-none")
    document.querySelector(".imprimir.d-md-none").disabled = false
    document.querySelector(".imprimir.d-md-inline").disabled = false
    document.querySelector(".imprimir.d-md-none").classList.add("btn-warning")
    document.querySelector(".imprimir.d-md-inline").classList.add("btn-warning")
    document.querySelector(".imprimir.d-md-none").classList.remove("cursor-not-allowed")
    document.querySelector(".imprimir.d-md-inline").classList.remove("cursor-not-allowed")
    const randomPoemNumber = Math.floor(Math.random() * poemasDB.length)
    const poemaRandom = poemasDB[randomPoemNumber]
    poemaTitulo.textContent = poemaRandom.Título
    poemaAutoria.textContent = poemaRandom.Autoría
    poemaTexto.innerHTML = poemaRandom.Poema.replace(/\n/g, "<br>")
    poema = poemaRandom.Poema
    autoria = poemaRandom.Autoría
    titulo  = poemaRandom.Título
    dato = poemaRandom.Dato
    const audio = new Audio("./assets/sounds/send-sound/coin.mp3")
    audio.play()
    
}



// Eventlisteners
document.addEventListener("DOMContentLoaded", cargarDatos)

// document.addEventListener("DOMContentLoaded", () => {
//     const btn = document.getElementById("btn-random-poem")

//     // Si el usuario nunca hizo clic → activar glow
//     if (!localStorage.getItem("poemaRandomClicked")) {
//         btn.classList.add("btn-glow")
//     }

//     // Cuando hace clic → desactivar glow y guardar estado
//     btn.addEventListener("click", () => {
//         btn.classList.remove("btn-glow")
//         localStorage.setItem("poemaRandomClicked", "true")
//     })
// })


// Tecla P o botón 5 del numpad cambia poema

window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(evt) {
    
    switch (evt.keyCode){

        case  101: 
        case 32:
            randomPoemHandler()
            break
        
        case 80:
        case 13: 
            imprimirPoema()
            break
    
        }
}



function generarCodigoPoema() {
return Array.from(crypto.getRandomValues(new Uint8Array(3)), b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

let poema
let autoria
let titulo
let dato


const imprimirPoema = () => {
    const textoImprimible = normalizarTexto(poema)
    const ticketFinal = plantilla(textoImprimible, titulo, autoria, dato)
    // const cantidadCopias = parseInt(document.getElementById("copias").value) || 1
    
    const ventanaImpresion = window.open("", "_blank")

    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Imprimir Poema std::rand()</title>
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
        <div class="ticket-copia">${ticketFinal}</div>
        </body></html>
    `) 
    const audio = new Audio("./assets/sounds/ring.mp3")
    audio.play()
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



const centrar = (texto, ancho = 42) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2))
    return " ".repeat(espacios) + texto
}

const restaurarSaltos = texto => texto.replace(/\\n/g, "\n")


const obtenerNumeroFactura = () => {
    let numero = parseInt(localStorage.getItem("facturaNumero"), 10)

    if (!numero || isNaN(numero)) {
        numero = 1
    }

    const actual = numero++   // devuelve el número actual
    localStorage.setItem("facturaNumero", numero.toString()) // guarda el incrementado

    return actual
}

const formatear8 = (num) => num.toString().padStart(8, "0")



const plantilla = (texto, titulo, autoria, dato) => {
    return `
------------------------------------------
***  SePtiembre con P de Poesía 2026 ***
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

   \u00A0 ${autoria}
   \u00A0 SKU: ${generarCodigoPoema()}
__________________________________________

${texto}

------------------------------------------
* El valor de lo poético se mide con la 
\u00A0\u00A0invisible vara de lo intangible; tan    
\u00A0\u00A0incalculable es como pesar el silencio  
\u00A0\u00A0con las manos.
------------------------------------------

❯❯ ${dato}

Conocé más entrando a este QR:

[Espacio para código QR]
------------------------------------------`;
}


function ocultarSpinner(){
    
    const sp = document.querySelector(".spinner");
    
    if (!sp) return

    // activa el fundido
    sp.classList.add("fadeout")

    // elimina después del fundido
    setTimeout(() => {
        sp.remove()
    }, 1200)
}

function mostrarSpinner() {
    if (document.querySelector(".spinner") !== null) return

    const spinner = `
    <div class="spinner active">
      <div class="wave-bg">
        <div class="wave">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="content-loading">
          <div class="spinner-border text-light" role="status"></div>
          <div class="loading-text">Cargando poemas...</div>
        </div>
      </div>
    </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", spinner);
}


// Luciérnagas
const canvas = document.getElementById("fireflies");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// CONFIGURACIÓN
const FIREFLIES = 80;        // cantidad de luciérnagas
const SPEED = 0.4;           // velocidad base
const SIZE_MIN = 1.2;        // tamaño mínimo
const SIZE_MAX = 3.5;        // tamaño máximo
const BLUR = 0.25;           // blur del halo

// Crear luciérnagas
const fireflies = [];
for (let i = 0; i < FIREFLIES; i++) {
  fireflies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN),
    dx: (Math.random() - 0.5) * (SPEED * 1.8),
    dy: (Math.random() - 0.5) * (SPEED * 0.8),
    alpha: 0.4 + Math.random() * 0.6
  });
}

// Animación
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireflies.forEach(f => {
    // movimiento aleatorio
    f.x += f.dx;
    f.y += f.dy;

    f.dx += (Math.random() - 0.5) * 0.02;

    // rebote suave
    if (f.x < 0 || f.x > canvas.width) f.dx *= -1;
    if (f.y < 0 || f.y > canvas.height) f.dy *= -1;

    // brillo suave
    f.alpha += (Math.random() - 0.5) * 0.02;
    f.alpha = Math.max(0.2, Math.min(1, f.alpha));

    // dibujar
    ctx.beginPath();
    ctx.fillStyle = `rgba(150, 200, 255, ${f.alpha})`; // azul celeste
    ctx.shadowBlur = f.r * 8 * BLUR;
    ctx.shadowColor = `rgba(150, 200, 255, ${f.alpha})`;
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}




animate()
