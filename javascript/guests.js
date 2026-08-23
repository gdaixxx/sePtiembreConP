async function getData() {
 try{
   const guestsSrc = await fetch("../data/guests.json")
   data = await guestsSrc.json()
   console.log(data)
   guestsLoad(data)
  } catch (err){
    console.error(err)
  }
}

const guestsLoad = (data) => {
  data.forEach(guest => {
     container.insertAdjacentHTML('beforeend', template(guest))
    }
  )

  container.addEventListener("click", (event) =>{
    const guest = event.target.closest(".guest-card")
    if (!guest) return
    console.log("Card clickeada:", guest)
    const id = guest.dataset.id
    const clickedGuest = data.find(g => g.id == id)
    console.log("Guest clickeado:", clickedGuest)
    loadOffcanvas(clickedGuest)
})
}

const container = document.getElementById("guest-container")



const template = (guest) => {
  return `<div class="guest-card card-hover" data-bs-toggle="offcanvas" data-bs-target="#personaInfo" data-aos="flip-up" data-id="${guest.id}">
  <div class="foto">
    <img src="../assets/images/fotos/guests/${guest.id}.png" alt="${guest.nombre} ${guest.apellido}">
  </div>
  <div class="nombre">${guest.nombre} ${guest.apellido}</div>
</div>`
}

const loadOffcanvas = (guest) => {
  const offcanvasTitle = document.querySelector(".offcanvas-title")
  const offcanvasFoto = document.querySelector(".offcanvas-foto")
  const offcanvasBio = document.querySelector(".bio")
  const offcanvasRemark = document.querySelector(".remark")
  const offcanvasInstagram = document.querySelector(".instagram")

  offcanvasTitle.textContent = `${guest.nombre} ${guest.apellido}`

  offcanvasFoto.innerHTML = `<img src="../assets/images/fotos/guests/${guest.id}.png" alt="${guest.nombre} ${guest.apellido}">`

  offcanvasBio.textContent = guest.bio
  offcanvasRemark.textContent = guest.remark
  
  offcanvasInstagram.style.display = guest.instagram ? "inline-block" : "none"
  offcanvasInstagram.href = guest.instagram

}

getData()
AOS.init()