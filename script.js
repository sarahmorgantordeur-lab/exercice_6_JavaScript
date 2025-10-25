let offset = 0;
updateButtons();

function updateButtons() {
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    // Désactive Previous si on est à la première page
    if (offset < 20) {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'inline';
    };
    if (offset>=20 && offset<1300) {
        btnNext.style.display = 'inline';
        btnPrev.style.display = 'inline';
    };
    if(offset==1300) {
        btnNext.style.display = 'none';
        btnPrev.style.display = 'inline';
    };
};

function changerPage (){
    offset += 20;
    createPokeCard();
    updateButtons();
};

function firstPage() {
    offset = 0;
    createPokeCard();
    updateButtons();
};

function lastPage() {
    offset = 1300;
    createPokeCard();
    updateButtons();
};

function pagePrecedente (){
    offset -= 20;
    createPokeCard();
    updateButtons();
};

async function recupResults(urlPage) {
    try {
        const listResults = [];
        const res = await fetch(urlPage);
        const data = await res.json();
        data.results.forEach(element => {
            listResults.push(element);
        });
        return listResults;
    } catch {};
};

async function createPokeCard() {
    try {
        let poke = document.getElementById("poke");
        poke.innerHTML='';
        const res = await recupResults(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
        for (const element of res) {
            const name = await recupFrenchNames(element.url);
            const img = await recupImg(element.url);
            const stats = await recupStats(element.url)
            const types = await recupType(element.url)
            const div = document.createElement("div");
            div.className = "m-[19px] p-[10px] rounded-xl outline-current bg-red-50";
            div.innerHTML = `
                <h2 class ='flex justify-center font-mono rounded-xl text-2xl antialiased bg-sky-200'>${name}</h2>
                <p>Type : ${types}</p>
                <p>Stats : ${stats}</p>
                <div class='flex justify-self-center items-enter h-48'>
                <img src=${img} alt='image'>
                </div>
                `
            poke.appendChild(div);
        };
        return offset;
    } catch {};
};

async function recupStats(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        const statistiques = data.stats;
        let listStats = [];
        for (const element of statistiques) {
            listStats.push(element.base_stat);
        };
        const newListStats = listStats.join(', ');
        return newListStats;
    } catch {};
};

async function recupType (url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        const type = data.types;
        let listTypes = [];
        for (const element of type) {
            listTypes.push(' ' + element.type.name);
        };
        return listTypes;
    } catch {};
};

async function recupImg (url) {
    try {
        let img = '';
        const res = await fetch(url);
        const data = await res.json();
        if (data.sprites.other.dream_world.front_default !== null) {
            img = data.sprites.other.dream_world.front_default;
            console.log(data.sprites.other.dream_world.front_default)
        } else if (data.sprites.other.home.front_default !== null) {
            img = data.sprites.other.home.front_default;
            console.log('2')
        } else if (data.sprites.other["official-artwork"].front_default !== null) {
                img = data.sprites.other["official-artwork"].front_default
        } else if (data.sprites.front_default !== null) {
            img = data.sprites.front_default;
        } else {
            console.log('tot');
            img = './poke-generique.png';
        };
        return img; // URL de l'image du Pokémon
    } catch {};
};

async function recupFrenchNames(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        let species = await fetch(data.species.url);
        let speciesData = await species.json();
        for(const element of speciesData.names){
            if (element.language.name ==='fr'){
                return element.name ;
            };
        }
        return "Nom non trouvé";     
    } catch {};
};

createPokeCard();