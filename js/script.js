function rugbyShopLogica() {

  let urlBack = "./back.json"
  fetch(urlBack)
    .then(Response => Response.json())
    .then((data) => {

      let articulos = data.articulos

      // ASIGNANDO CONTENEDOR PARA CARDS
      let contenedor = document.getElementById("articulos")

      // RECUPERANDO CARRITO DEL STORAGE
      let contenidoCarritoJSON = JSON.parse(localStorage.getItem("contenidoCarrito"))
      let contenidoCarrito = contenidoCarritoJSON ? contenidoCarritoJSON : []

      mostrarContenidoCarrito(contenidoCarrito)

      // LOGICA FINALIZAR COMPRA
      let btnComprar = document.getElementById("comprar")
      btnComprar.addEventListener("click", () => {
        let totalCompra = calcularTotalCompra(contenidoCarrito)
        comprar(contenidoCarrito, totalCompra)
      })


      // LOGICA BIENVENIDA
      let inputNombre = document.getElementById("nUser")
      let bUser = document.getElementById("bUser")
      let btnLogin = document.getElementById("login")
      bienvenida(inputNombre, bUser, btnLogin)

      // FILTRAR POR INPUT
      let filtrador = document.getElementById("filtroInp")
      filtrador.addEventListener("input", () => filtrar(articulos, contenedor, filtrador, contenidoCarrito))

      // LOGICA BOTONES FILTRO
      let btnFiltroCat = document.getElementsByClassName("filtroCat")
      for (const button of btnFiltroCat) {
        button.addEventListener("click", (button) => filtroCat(articulos, contenedor, button, contenidoCarrito))
      }

      //QUITAR FILTROS
      let btnQuitarFiltros = document.getElementById("quitarFiltros")
      btnQuitarFiltros.addEventListener("click", () => quitarFiltros(articulos, contenedor, contenidoCarrito))

      // ABRIR CARRITO
      let btnCarrito = document.getElementById("carrito")
      btnCarrito.addEventListener("click", abrirCarrito)

      // BOTON INICIO
      let btnInicio = document.getElementById("inicio")
      btnInicio.addEventListener("click", abrirCarrito)

      // CREADOR TARJETAS
      creadorCard(articulos, contenedor, contenidoCarrito)
    })

    .catch(() => {
      Swal.fire('ERROR 404')
      let body = document.getElementById("body")
      body.classList.add("oculto")
    })

}
rugbyShopLogica()

function calcularTotalCompra(contenidoCarrito) {
  let total = 0
  contenidoCarrito.forEach(({ precio, cantidad }) => {
    total += precio * cantidad
  })
  return total
}


// LOGICA BIENVENIDA
function bienvenida(inputNombre, bUser, btnLogin) {
  let nombreRecuperado = localStorage.getItem("nombre")
  if (nombreRecuperado) {
    inputNombre.classList.add("oculto")
    bUser.innerHTML = `- ${nombreRecuperado}`
    btnLogin.classList.toggle("oculto")
  } else {
    btnLogin.addEventListener("click", () => {
      if (inputNombre.value !== "") {
        Ot(inputNombre, bUser, btnLogin)
        btnLogin.classList.add("oculto")
      }
    })
  }
}

// LOGICA BIENVENIDA
function Ot(inputNombre, bUser, btnLogin) {
  let nombre = inputNombre.value
  localStorage.setItem("nombre", nombre)
  inputNombre.classList.add("oculto")
  bUser.innerHTML = `- ${nombre}`
  bienvenida(inputNombre, bUser, btnLogin)
}

// CREADOR TARJETAS
function creadorCard(array, contenedor, contenidoCarrito) {
  contenedor.innerHTML = ""
  array.forEach(({ id, nombre, precio, srcImg }) => {
    let x = document.createElement("div")
    x.className = "card"

    x.innerHTML = `
          <div class="bg">
              <h3 class="titleCard">${nombre}</h3>
              <img class="imgCard" src="./img/${srcImg}">
              <div class="c2">
                  <h3 class="precioCard">$-${precio}</h3>
                  <button id=${id}>Agregar al carrito</button>
              </div>
          </div>
          <div class="blob"></div>
      `
    contenedor.append(x)

    let btnAgregarCarrito = document.getElementById(id)
    btnAgregarCarrito.addEventListener("click", () => pushArticuloCarrito(array, id, contenidoCarrito))
  })
}

// FUNCION PUSHEAR ARTICULOS CARRITO
function pushArticuloCarrito(array, id, contenidoCarrito) {
  contenidoCarrito = contenidoCarrito ? contenidoCarrito : []
  let articuloPushCarrito = array.find(articulo => articulo.id === parseInt(id))
  let posicionDeArticulo = contenidoCarrito.findIndex(articulo => articulo.id === articuloPushCarrito.id)

  if (posicionDeArticulo !== -1) {
    contenidoCarrito[posicionDeArticulo].cantidad++
  } else {
    contenidoCarrito.push({
      id: articuloPushCarrito.id,
      nombre: articuloPushCarrito.nombre,
      precio: articuloPushCarrito.precio,
      cantidad: 1,
    })
  }
  lanzarTostada()
  localStorage.setItem("contenidoCarrito", JSON.stringify(contenidoCarrito))
  mostrarContenidoCarrito(contenidoCarrito)
}

function mostrarContenidoCarrito(contenidoCarrito) {
  let contenidoCarritoPusheado = document.getElementById("contenidoCarrito")
  contenidoCarritoPusheado.innerHTML = `
      <table>
          <tr id="tr">
              <td>CANTIDAD</td>
              <td>NOMBRE</td>
              <td class="tdPrecios"><span>PRECIO</span><span>SUBTOTAL</span></td>
          </tr>
          <table id="table"></table>
      </table>
  `;

  let total = 0
  contenidoCarrito.forEach(({ cantidad, nombre, precio }) => {
    let articuloUnitarioCarrito = document.createElement("tr")
    articuloUnitarioCarrito.classList.add("articuloUnitarioCarrito")

    let tdCantidad = document.createElement("td")
    tdCantidad.innerHTML = `
          <button class="restar">-</button>
          ${cantidad}
          <button class="sumar">+</button>
          `
    articuloUnitarioCarrito.appendChild(tdCantidad)

    let tdNombre = document.createElement("td")
    tdNombre.textContent = nombre
    articuloUnitarioCarrito.appendChild(tdNombre)

    let tdPrecioySubtotal = document.createElement("td")
    tdPrecioySubtotal.innerHTML = `<span>$-${precio}</span> <span>$-${precio * cantidad
      }</span>`;
    tdPrecioySubtotal.classList.add("precioySubtot")
    articuloUnitarioCarrito.appendChild(tdPrecioySubtotal)

    contenidoCarritoPusheado.appendChild(articuloUnitarioCarrito)

    let subtotal = precio * cantidad
    total += subtotal
  })

  // Mostrar el total de la compra en el carrito
  let totalCompra = document.createElement("tr")
  totalCompra.innerHTML = `
    <td id="cajaTotal" colspan="2">Total:</td>
    <td class="precioySubtot"><span></span><span>$-${total}</span></td>
  `
  contenidoCarritoPusheado.appendChild(totalCompra)

  let botonesSumar = document.getElementsByClassName("sumar")
  let botonesRestar = document.getElementsByClassName("restar")

  for (let i = 0; i < botonesSumar.length; i++) {
    botonesSumar[i].addEventListener("click", () =>
      sumarUnidad(i, contenidoCarrito)
    )
  }

  for (let i = 0; i < botonesRestar.length; i++) {
    botonesRestar[i].addEventListener("click", () =>
      restarUnidad(i, contenidoCarrito)
    )
  }

  let cantidadArticulosCarrito = calcularCantidadArticulosCarrito(contenidoCarrito)
  contadorCantidadCarrito(cantidadArticulosCarrito)
}

function calcularCantidadArticulosCarrito(contenidoCarrito) {
  let cantidadArticulos = 0
  contenidoCarrito.forEach(({ cantidad }) => {
    cantidadArticulos += cantidad
  })
  return cantidadArticulos
}


function sumarUnidad(posicionArticulo, contenidoCarrito) {
  contenidoCarrito[posicionArticulo].cantidad++
  localStorage.setItem("contenidoCarrito", JSON.stringify(contenidoCarrito))
  mostrarContenidoCarrito(contenidoCarrito)
}

function restarUnidad(posicionArticulo, contenidoCarrito) {
  if (contenidoCarrito[posicionArticulo].cantidad > 0) {
    contenidoCarrito[posicionArticulo].cantidad--
    if (contenidoCarrito[posicionArticulo].cantidad === 0) {
      contenidoCarrito.splice(posicionArticulo, 1)
    }
    localStorage.setItem("contenidoCarrito", JSON.stringify(contenidoCarrito))
  }
  mostrarContenidoCarrito(contenidoCarrito)
}

function abrirCarrito() {
  let articulosCaja = document.getElementById("articulos")
  let contenedorCaja = document.getElementById("contenedorArticulos")
  let carrito = document.getElementById("padreCarrito")
  let elementosDeCarrito = document.getElementById("contenedorCarrito")
  let filtros = document.getElementById("filtros")
  let footer = document.getElementById("footer")
  let esconder = document.getElementsByClassName("esconder")
  let botonesCarritoComprar = document.getElementById("comprar")
  let botonesCarritoInicio = document.getElementById("inicio")
  articulosCaja.classList.toggle("oculto")
  carrito.classList.toggle("oculto")
  botonesCarritoComprar.classList.toggle("oculto")
  botonesCarritoInicio.classList.toggle("oculto")
  elementosDeCarrito.classList.toggle("oculto")
  contenedorCaja.classList.toggle("oculto")
  filtros.classList.toggle("oculto")
  footer.classList.toggle("oculto")

  // RECORRO Y APLICO POR CADA ELEMENTO CON CLASS "ESCONDER"
  for (let i = 0; i < esconder.length; i++) {
    esconder[i].classList.toggle("oculto")
  }
}

// FILTRO INPUT
function filtrar(articulos, contenedor, filtrador, contenidoCarrito) {
  let filtroMin = filtrador.value.toLocaleLowerCase()
  let arrayFiltro = articulos.filter(articulo => articulo.nombre.toLocaleLowerCase().includes(filtroMin))
  creadorCard(arrayFiltro, contenedor, contenidoCarrito)
}

// FILTRO BOTONES
function filtroCat(articulos, contenedor, button, contenidoCarrito) {
  let arrayCat = articulos.filter(articulo => articulo.categoria === button.target.value)
  creadorCard(arrayCat, contenedor, contenidoCarrito)
}

//FUNCION QUITAR FILTROS
function quitarFiltros(articulos, contenedor, contenidoCarrito) {
  creadorCard(articulos, contenedor, contenidoCarrito)
}


//CONTADOR CARRITO
function contadorCantidadCarrito(cantidadArticulosCarrito) {
  let numeroCantidad = document.getElementById("contadorCarrito")
  numeroCantidad.innerText = `${cantidadArticulosCarrito}`
}


// COMPRAR
function comprar(contenidoCarrito, total) {
  lanzarAlertCompra(contenidoCarrito, total)
}

function lanzarAlertCompra(contenidoCarrito, total) {
  if (total === 0) {
    Swal.fire('PRIMERO AGREGA PRODUCTOS')
  } else {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
        popup: "alert--carrito"
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'ESTAS A PUNTO DE COMPRAR',
      text: `TOTAL A PAGAR: $-${total}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR COMPRA',
      cancelButtonText: 'CANCELAR',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'COMPRA PROCESADA',
          '',
          'success'
        )
        let contenidoCarritoPusheado = document.getElementById("contenidoCarrito")
        contenidoCarritoPusheado.innerHTML = ""
        contenidoCarrito.splice(0, contenidoCarrito.length)
        contenidoCarrito = []
        localStorage.removeItem("contenidoCarrito")
        mostrarContenidoCarrito(contenidoCarrito)
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'COMPRA CANCELADA',
          '',
          'error'
        )
      }
    })
  }
}

//funcion lanzar Tostada
function lanzarTostada() {
  Toastify({
    text: "AGREGADO AL CARRITO",
    className: "info",
    duration: 1500
  }).showToast()
}
