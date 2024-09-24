const poke_container = document.getElementById('poke-container');
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');
const modal = document.getElementById('pokemon-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-pokemon-img');
const modalName = document.getElementById('modal-pokemon-name');
const modalType = document.getElementById('modal-pokemon-type');
const modalId = document.getElementById('modal-pokemon-id');
const modalHp = document.getElementById('modal-pokemon-hp');
const modalAttack = document.getElementById('modal-pokemon-attack');
const modalDefense = document.getElementById('modal-pokemon-defense');
const modalSpeed = document.getElementById('modal-pokemon-speed');
const modalAbilities = document.getElementById('modal-pokemon-abilities');

const pokemon_count = 1010; 
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

const main_types = Object.keys(colors);
let allPokemonData = []; 
const fetchPokemons = async () => {
    for (let i = 1; i <= pokemon_count; i++) {
        const data = await getPokemon(i);
        allPokemonData.push(data);
    }
};

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    createPokemonCard(data);
    return data;
};

const createPokemonCard = (pokemon) => {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');

    const poke_types = pokemon.types.map(type => type.type.name);
    const type = main_types.find(type => poke_types.indexOf(type) > -1);
    const color = colors[type];

    pokemonEl.style.backgroundColor = color;

    const pokemonInnerHTML = `
    <div class="img-container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}">
    </div>
    <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Type: <span>${type}</span></small>
    </div>
    `;

    pokemonEl.innerHTML = pokemonInnerHTML;

    
    pokemonEl.addEventListener('click', () => {
        showPokemonDetails(pokemon);
    });

    poke_container.appendChild(pokemonEl);
};

const showPokemonDetails = (pokemon) => {
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');
    const poke_types = pokemon.types.map(type => type.type.name).join(', ');
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    const hp = pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
    const attack = pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat;
    const defense = pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;
    const speed = pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat;

    const abilities = pokemon.abilities.map(ability => ability.ability.name);

    modalImg.src = imageUrl;
    modalName.textContent = name;
    modalType.textContent = poke_types;
    modalId.textContent = `#${id}`;
    modalHp.textContent = hp;
    modalAttack.textContent = attack;
    modalDefense.textContent = defense;
    modalSpeed.textContent = speed;

    modalAbilities.innerHTML = '';
    abilities.forEach(ability => {
        const abilityItem = document.createElement('li');
        abilityItem.textContent = ability;
        modalAbilities.appendChild(abilityItem);
    });

    modal.style.display = 'block';
};

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    poke_container.innerHTML = '';

    const filteredPokemon = allPokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));

    if (filteredPokemon.length === 0) {
        poke_container.innerHTML = '<p>No Pokémon found.</p>';
    } else {
        filteredPokemon.forEach(pokemon => createPokemonCard(pokemon));
    }
});


closeModal.onclick = () => {
    modal.style.display = 'none';
};


window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

fetchPokemons();

