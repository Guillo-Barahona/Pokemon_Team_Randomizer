let pokemon_container = document.querySelector('.pokemon_container')
let start_button = document.querySelector('.start_button')

const templateCarrito = document.getElementById('template-carrito').content
const items = document.getElementById('items') //elementos del carrito

const templateFooter = document.getElementById('template-footer').content
const footer = document.getElementById('footer')

const fragment = document.createDocumentFragment() // investigar
let carrito = {} //objeto carrito



let array_magico = []   // array que contiene secuencia de numeros random

let numero_magico1 = random_number()
let numero_magico2 = random_number()
let numero_magico3 = random_number()
let numero_magico4 = random_number()
let numero_magico5 = random_number()
let numero_magico6 = random_number()
let numero_magico7 = random_number()
let numero_magico8 = random_number()
let numero_magico9 = random_number()
let numero_magico10 = random_number()

array_magico.push(numero_magico1);
array_magico.push(numero_magico2);
array_magico.push(numero_magico3);
array_magico.push(numero_magico4);
array_magico.push(numero_magico5);
array_magico.push(numero_magico6);
array_magico.push(numero_magico7);
array_magico.push(numero_magico8);
array_magico.push(numero_magico9);
array_magico.push(numero_magico10);

function random_number(min, max){ // funcion generadora de numero random entre 1 y 905
return Math.floor(Math.random() * (905 - 1) ) + 1;
};


//console.log(numero_magico1)
//console.log(array_magico)


function fetchPokemon (id){
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then (res => res.json())
    .then (data => {
    pintarPokemon(data)
    });

}

// boton de inicio
start_button.addEventListener("click", function boton(event) {
    fetchPokemons(array_magico); 
    console.log('DOM fully loaded');

    this.removeEventListener("click", boton) // para que solo funcione una vez


});
// SE LLAMA A LOS POKEMON)



// Inicio para leer el local storage
document.addEventListener('DOMContentLoaded', () => {
    //console.log('DOM fully loaded and parsed');

    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))   //Lee el local storage
        pintarCarrito()
    }
});




// Llama a funcion para agregar al carrito
const cards = document.getElementById('cards')

cards.addEventListener('click', e => {
    agregarCarrito(e)

});


//evento de botones azul y rojo de elementos dentro del carrito
items.addEventListener('click', e => {
    btnAccion(e)
})




function fetchPokemons (array_magico){   // llama a los pokemon del los numeros del array_magico

    for (let i = 0; i < array_magico.length; i++){
        fetchPokemon(array_magico[i]);
    }
}





/* DOM */

function pintarPokemon(pokemon){
    const tarjeta = document.createElement('div');  //contenedor general
    tarjeta.classList.add('pokemon_block')

    const spriteContainer = document.createElement('div');  //contenedor de la imagen
    spriteContainer.classList.add('img_container')

    const sprite = document.createElement('img');
    sprite.src = pokemon.sprites.front_default   // busca la src dentro del api (en este caso la sprite del back)
    sprite.id = 'sprite'

    spriteContainer.appendChild(sprite);

    const icon = document.createElement ('img');
    icon.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pokemon.id}.png`
    icon.id = 'icon'

    const number = document.createElement('h4');
    number.textContent = `#${pokemon.id.toString().padStart(3,0)}`  //numero

    const name = document.createElement('h5');
    name.textContent = pokemon.name

    const type = document.createElement('h6');  
    type.textContent = pokemon.types[0].type.name


    const boton = document.createElement('button');
    boton.className = 'btn btn-dark'
    boton.dataset.id = pokemon.id // setea el atributo del boton con el numero de id
    boton.textContent = 'Agregar pkmn'



    /* se pinta en el html */
    tarjeta.appendChild(spriteContainer);
/*     tarjeta.appendChild(icon); */ //Se usa despues, pero no de pinta en las tarjetas
    tarjeta.appendChild(number);
    tarjeta.appendChild(name);
    tarjeta.appendChild(type);
    tarjeta.appendChild(boton);

    pokemon_container.appendChild(tarjeta)
}



const agregarCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark')) 
    
    if (e.target.classList.contains('btn-dark')){ // contiene la clase del boton? marca true o false
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)

                    //TOASTIFY
                    Toastify({
                        text: "Agregado exitosamente al equipo!!",
                        duration: 3000,
                        gravity: 'bottom',
                        position: 'right',
                        style: {
                            background: 'linear-gradient(to right, #00b09b, #c92d2d)'
                        },
                        destination: 'https://www.coderhouse.com',
                
                        onClick: () => {
                        
                            Toastify({
                                text: 'Clickeaste un Toast!',
                                duration: 1500,
                                position: 'left'
                            }).showToast()
                        }
                    }).showToast();
    }
    e.stopPropagation() //para evitar que se genere otro evento
} 



const setCarrito = objeto => { // funcion para pushear al carrito

    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,  //accede al id del objeto, titulo, precio... y se genera el objeto
        name: objeto.querySelector('h5').textContent,
        number: objeto.querySelector('h4').textContent,
        type: objeto.querySelector('h6').textContent,
        icon: objeto.querySelector('img'),
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)){       // para aumentar la cantidad en caso de que ya exista dentro del carrito
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto} //spread operator, para sobreescribir  cuando se aumenta la cantidad

    pintarCarrito()
}


const pintarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => { // Regresa un array

        templateCarrito.querySelector('th').textContent = '# ' + producto.id // lo jala del producto que se construyo con el boton 'agregar'
        templateCarrito.querySelectorAll('td')[0].textContent = producto.name 
        templateCarrito.querySelectorAll('td')[1].textContent = producto.type 

        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        
        templateCarrito.querySelector('span').textContent = producto.cantidad // para cargar el icon, desde la api
        templateCarrito.getElementById('span2').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${producto.id}.png`

        const clon = templateCarrito.cloneNode(true)
        fragment.appendChild(clon)

    })
    items.appendChild(fragment)
    //console.log(carrito)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))    // guarda el carrito en el local storage
}


const pintarFooter = () => {
    footer.innerHTML = '' //para vaciar el carrito

    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Arma tu equipo de 6 PKMN</th>
        `
        return
    }    

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0 )
    console.log(nCantidad)

    templateFooter.querySelectorAll('span')[0].textContent = nCantidad + ' de 6'

    if (nCantidad === 6 ){

        /* SWEET ALERT */
        Swal.fire(
            'Buen trabajo!!',
            'Has completado tu equipo!!',
            'success'
        )
        }

    const clon = templateFooter.cloneNode(true)
    fragment.appendChild(clon)
    footer.appendChild(fragment)


    const btn_vaciar = document.getElementById('vaciar-carrito')
    btn_vaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()

        /* TOASTIFY */
        Toastify({
            text: "Equipo eliminado!!",
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #00b09b, #c92d2d)'
            },
            destination: 'https://www.coderhouse.com',
    
            onClick: () => {
            
                Toastify({
                    text: 'Clickeaste un Toast!',
                    duration: 1500,
                    position: 'left'
                }).showToast()
            }
    
    
        }).showToast();
    })
    
}

    //Botones azul y rojo de elementos denttro del carrito
const btnAccion = (e) => {
    console.log(e.target)

    if(e.target.classList.contains('btn-info')){

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ /* = carrito[e.target.dataset.id].cantidad + 1  */
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){

        const producto = carrito[e.target.dataset.id]
        producto.cantidad -- /* = carrito[e.target.dataset.id].cantidad - 1  */
            if(producto.cantidad ===0){
                delete carrito[e.target.dataset.id]
            }
            pintarCarrito()
        }
        e.stopPropagation()
    }
