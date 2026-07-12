
const verVersoAnterior = true
let versoAnterior = "" 
const nombreEstudiante = ""
let poema = ""

function acumularVerso(event, autor = "Anónimo") {
    event.preventDefault()
    const verso = document.getElementById("nuevo-verso")
    // !verso ? poema : poema += verso.value + " - " + autor + "\n"
    if (!verso.value) {
        alert("No se puede enviar un verso vacío")
        return
    } else{
        poema += verso.value + "\n"
        document.getElementById("ultimo-verso").hidden = false
        //        poema += verso.value + " - " + autor + "\n"    
    }
    document.getElementById("poema-container").classList.remove("d-none")
    verso.value = ""
    const versos = poema.split("\n")
    versoAnterior = versos[versos.length -2]
    document.getElementById("ultimo-verso").innerText = versoAnterior
    document.getElementById("titulo-seccion").textContent = "VERSO ANTERIOR..."
    document.getElementById("sonido-aldeano").play()
}

const terminarPoema = () => {
    if(!poema) {alert("Tu cadáver está vacío...")} else{
        document.getElementById("poema-terminado").innerText = poema
        document.getElementById("poema-terminado").hidden = false
        document.getElementById("ultimo-verso").hidden = true
        document.getElementById("terminar").disabled = true
        document.getElementById("continuar").disabled = true
        document.getElementById("anonimo").disabled = true
        document.getElementById("imprimir").disabled = false
        document.getElementById("titulo-seccion").textContent = "POEMA TERMINADO"
        const video = document.getElementById("video-fondo")
        // const sonido = document.getElementById("sonido-final")
        video.playbackRate = 2
        video.play()  
        // sonido.play()
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
    document.getElementById("continuar").disabled = false
    document.getElementById("anonimo").disabled = false
    document.getElementById("imprimir").disabled = true
    document.getElementById("poema-container").classList.add("d-none")
    document.getElementById("nuevo-poema").disabled = true
    document.getElementById("alertas").innerHTML = ""
    document.getElementById("alertas").hidden = true
    document.getElementById("video-fondo").currentTime = 0
    document.getElementById("video-fondo").playbackRate  = 1
    document.getElementById("video-fondo").pause()
    
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

        


        // if (verso.length > 42) {
        //     // Buscamos el último espacio en blanco antes del carácter 40
        //     let indiceCorte = verso.lastIndexOf(" ", 40)
            
        //     // Si no encuentra ningún espacio, corta forzado en el 40
        //     if (indiceCorte === -1) indiceCorte = 40
            
        //     // Dividimos el verso en dos partes limpias e insertamos el salto de línea
        //     let parte1 = verso.substring(0, indiceCorte)
        //     let parte2 = verso.substring(indiceCorte).trim()
            
        //     return `${parte1}\n [${parte2}`
        // }    
        
        // Regla de oro de MAP: si mide menos de 42, lo devolvemos intacto
        // return verso; 
    // });

    // Unimos el array de nuevo en un solo string para mandarlo a la ticketera
    // return textoNormalizado.join("\n");
// }


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

function alertaTexto () {
    const txt = document.getElementById("nuevo-verso")
    // const contador = document.getElementById("contador-de-caracteres")
    const alertaTextoElemento = document.getElementById("alertas")

    txt.addEventListener("input", (event) => {
        const longitud = txt.value.length
        // contador.innerText = longitud
        
        console.log (longitud)
        if(longitud > 42){
            txt.classList.add("border-warning", "shadow-none")
            alertaTextoElemento.classList.remove("text-muted")
            alertaTextoElemento.classList.add("text-warning")
            alertaTextoElemento.innerHTML = `Caracteres: <strong>${longitud}</strong>/42. ¡Verso largo! Se imprimirá en dos renglones con [ ]`
        } else {
            txt.classList.remove("border-warning")
            alertaTextoElemento.classList.remove("text-warning")
            alertaTextoElemento.classList.add("text-muted")
            alertaTextoElemento.innerHTML = `Caracteres: <span>${longitud}</span>/42`
        
        }})
}



//
alertaTexto()