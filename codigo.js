
let carrito=[];
let productosJSON=[];

//se cargan los productos que hayan quedado en el carrito
carrito = JSON.parse(localStorage.getItem('carrito')) || [];

let lista=document.getElementById("miLista");

document.getElementById("miSeleccion").setAttribute("option", "pordefecto");
    document.getElementById("miSeleccion").onchange=()=>ordenar();



//Carga cartas con los productos
renderizarProductos();

function renderizarProductos() {
  for (const producto of productosJSON) {
      lista.innerHTML+=`<div class="card" style="width: 18rem;">
      <img src="${producto.imagen}" class="card-img-top" alt="...">
      <div class="card-body">
      <h5>${producto.nombre}</h5>
        <h5 class="card-title">ID ${producto.id}</h5>
        <p class="card-text">$ ${producto.precio}</p>
        <a href="#" class="btn btn-dark"id="btn${producto.id}">Comprar</a>
      </div>
    </div>
      
  `
  }

  
  productosJSON.forEach(producto => {
    
    document.getElementById(`btn${producto.id}`).addEventListener("click",function() 
    {agregrarAlCarrito(producto)
    });
  });
}

// Funcion agregar productos al carrito
function agregrarAlCarrito(producto) {
  let encontrado = carrito.find(p => p.id == producto.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = {
            ...producto,
            cantidad:1
        };
  carrito.push(prodACarrito);
  console.log(carrito);
  Swal.fire(
    "producto: "+producto.nombre,
    "Agregado al carrito",
    "success",
  )

  //Tabla para los productos a comprar
  document.getElementById("tabBody").innerHTML+=(`
  <tr id='fila${prodACarrito.id}'>
  <td> ${prodACarrito.id} </td>
  <td> ${prodACarrito.nombre}</td>
  <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
  <td> $ ${prodACarrito.precio}</td>
  <td> <button class='btn btn-dark' onclick='eliminar(${prodACarrito.id})'>Eliminar</button>`);

} else {
  
 
  let posicion = carrito.findIndex(p => p.id == producto.id);
  console.log(posicion);
  carrito[posicion].cantidad += 1;
  document.getElementById(producto.id).innerHTML=carrito[posicion].cantidad;
}
//Recalcular el total
document.getElementById("gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
localStorage.setItem("carrito",JSON.stringify(carrito));
}

//Calcular total de la compra
function calcularTotal() {
let suma = 0;
for (const elemento of carrito) {
  suma = suma + (elemento.precio * elemento.cantidad);
}
return suma;
}
//Eliminar producto del carrito
function eliminar(id){
  let indice=carrito.findIndex(prod => prod.id==id);
  carrito.splice(indice,1);//eliminando del carro
  let fila=document.getElementById(`fila${id}`);
  document.getElementById("tabBody").removeChild(fila);//eliminando de la tabla
  document.getElementById("gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
  localStorage.setItem("carrito",JSON.stringify(carrito));
  Swal.fire("Producto eliminado del carro!")
}

//Funcion para terminar compra, formulario de sweetalert para completar datos personales con inputs validados
//Vacia el carrito de compras y el storage
  function terminarCompra(){
  document.getElementById("finalizar").addEventListener("click", function(){
    Swal.fire({
      title: "Completa los siguientes datos para finalizar tu compra",
      html: `<form action="">
  <input type="text" class="swal2-input" id="nombre" placeholder="Nombre Completo">
  <input type="email" class="swal2-input" id="email" placeholder="Email">
  <input type="tel" class="swal2-input" id="telefono" placeholder="Teléfono">
  <input type="text" class="swal2-input" id="direccion" placeholder="Dirección">
  <input type="number" class="swal2-input" id="codigo" placeholder="Codigo Postal">
  <input type="text" class="swal2-input" id="ciudad" placeholder="Ciudad">
  </form>`,
  confirmBottonText: "Confirmar",
  customClass: "compra",
  focusConfirm: false,
  preConfirm: () => {
      const nombre = Swal.getPopup().querySelector("#nombre").value;
      const email = Swal.getPopup().querySelector("#email").value;
      const telefono = Swal.getPopup().querySelector("#telefono").value;
      const direccion = Swal.getPopup().querySelector("#direccion").value;
      const codigo = Swal.getPopup().querySelector("#codigo").value;
      const ciudad = Swal.getPopup().querySelector("#ciudad").value;
      
      !isNaN(ciudad)? Swal.showValidationMessage('La ciudad no puede estar compuesta por números'): '';
      !ciudad? Swal.showValidationMessage('Ciudad obligatoria'): '';
      isNaN(codigo)? Swal.showValidationMessage('El Código Postal debe estar compuesto por números'): '';
      !codigo? Swal.showValidationMessage('Código Postal obligatorio'): '';
      !direccion? Swal.showValidationMessage('Dirección obligatoria'): '';
      isNaN(telefono)?Swal.showValidationMessage('El Teléfono debe estar compuesto por números'): '';
      !telefono? Swal.showValidationMessage('Teléfono obligatorio'): '';
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      !email.match(validRegex)? Swal.showValidationMessage('Email invalido'): '';
      !email? Swal.showValidationMessage('Email obligatorio'): '';
      !isNaN(nombre)? Swal.showValidationMessage('El nombre no puede estar compuesto por números'): '';
      !nombre? Swal.showValidationMessage('Nombre obligatorio'): '';


      return { nombre: nombre, email: email, telefono: telefono, direccion: direccion, codigo: codigo, ciudad: ciudad}
            } 
          }).then((resultado) => {
            Swal.fire({
                html: `
                <p>Nombre completo: ${resultado.value.nombre}</p>
                <p>Email: ${resultado.value.email}</p>
                <p>Teléfono: ${resultado.value.telefono}</p>
                <p>Dirección: ${resultado.value.direccion}</p>
                <p>Código Postal: ${resultado.value.codigo}</p>
                <p>Ciudad: ${resultado.value.ciudad}</p>
                `,
                confirmButtonText: "Pagar",
            }).then(() => {
                Swal.fire({
                    title: "¡Gracias por su compra! El pedido sera despachado en 72hs",
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                carrito =[]
              tabBody.innerHTML= "";
              localStorage.removeItem("carrito",JSON.stringify(carrito));
              agregrarAlCarrito();
            })
        })
    });
}

terminarCompra();

//ordernas productos 
function ordenar() {
  let seleccion = document.getElementById("miSeleccion").value;
  console.log(seleccion)
  if (seleccion == "menor") {
      productosJSON.sort(function(a, b) {
          return a.precio - b.precio
      });
  } else if (seleccion == "mayor") {
      productosJSON.sort(function(a, b) {
          return b.precio - a.precio
      });
  } else if (seleccion == "alfabetico") {
      productosJSON.sort(function(a, b) {
          return a.nombre.localeCompare(b.nombre);
      });
  }
  lista.innerHTML="";
  renderizarProductos();
}


//pruductos traidos de IP local
async function obtenerJSON() {
  const URLJSON="productos.json"
  const resp=await fetch(URLJSON)
  const data= await resp.json()
  productosJSON = data;
  
  renderizarProductos();
}

obtenerJSON();

