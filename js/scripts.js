let pokemonRepository =(function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


  function add(pokemon) {
    if (typeof pokemon === 'object'){
      return pokemonList.push(pokemon);
    } 
  }

  function getAll(){
     return pokemonList;
 }  
 
 function addListItem(pokemon) {
  let list = document.querySelector('.list-group');
  let listPokemon = document.createElement('li');
  listPokemon.classList.add('group-list-item');
  let button = document.createElement('button');
  button.innerText = pokemon.name;
  button.classList.add('pokebutton');
  button.classList.add('btn', 'btn-secondary');
  button.setAttribute('data-target', '#pokemonModal');
  button.setAttribute('data-toggle', 'modal');

  button.addEventListener('click', function(){
     console.log(pokemon);
     showDetails(pokemon);
     
  });
 
  listPokemon.appendChild(button);
  list.appendChild(listPokemon);
 }


 //add fetch to load list from url
 async function loadList() {
  try {
     const response = await fetch(apiUrl);
     const json = await response.json();
     json.results.forEach(function (item) {
       let pokemon = {
         name: item.name,
         detailsUrl: item.url
       };
       add(pokemon);
     });
   } catch (e) {
     console.error(e);
   }
}
//add details fetched from api
  async function loadDetails(item) {
    let url = item.detailsUrl;
      return fetch(url)
        .then(response => response.json())
        .then(details =>{
           // Now we add the details to the item
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.types = details.types;
          item.weight = details.weight;
          item.abilities = details.abilities;
        })
}

function showDetails(pokemon) {
  loadDetails(pokemon)
  .then(function () {
    showModal(pokemon);
   
  })
}



  function showModal(pokemon){
   let modalBody= $('.modal-body');
   let modalTitle= $('.modal-title');

   modalTitle.empty();
   modalBody.empty();

   let nameElement =  $('<h>' + pokemon.name + '</h>');
   let imageElementFront= $('<img class="modal-img">');
   imageElementFront.attr('src', pokemon.imageUrl);
   let heightElement= $('<p>' + 'height : ' + pokemon.height + '</p>');
   let weightElement= $('<p>' + 'weight : ' + pokemon.weight + '</p>');
   let types = pokemon.types.map(pokemon => pokemon.type.name)
   let typesElement= $('<p>' + 'types : ' + types.join(', ') + '</p>');
   let abilities = pokemon.abilities.map(pokemon => pokemon.ability.name)
   let abilitiesElement= $('<p>' + 'abilities : ' + abilities.join(', ') + '</p>'); 

  modalTitle.append(nameElement);
  modalBody.append(imageElementFront);
  modalBody.append(heightElement);
  modalBody.append(weightElement);
  modalBody.append(typesElement);
  modalBody.append(abilitiesElement);
  
  setTimeout( () => imageElementFront.addClass('showImage'), 1000)
 }

  $('#pokemonModal').hide('modalContainer');
 return {
   add: add,
   getAll: getAll,
   addListItem: addListItem,
   loadList: loadList,
   loadDetails: loadDetails,
   showDetails: showDetails,

  };
 })();

  document.getElementById('search').addEventListener('input', e =>{
    const searchTerm = e.target.value;
    let buttons = document.getElementsByClassName('pokebutton');
    for(let i=0; i < buttons.length; i++){
      if(buttons[i].innerText.includes(searchTerm)){
        buttons[i].style.display = 'inline-block';
      }else{
        buttons[i].style.display = 'none';
      }
    }
  })


pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
  pokemonRepository.addListItem(pokemon);
  });
});
