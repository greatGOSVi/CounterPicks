const summonerSearchInput = document.getElementById("summonerSearchInput");
const counterSearchInput = document.getElementById("counterSearchInput");
const toggleBar = document.getElementsByClassName("toggleBar")[0];
const toggleArrows = document.getElementsByClassName("toggleArrows")[0];
const championsToggle = document.getElementsByClassName("selectionBox")[0];
let toggleDisplayed = true;
const selectionBox = document.getElementsByClassName("selectionBox")[0];
let champNames = [];


const getSummonerInfo = async(sumName) => {
    try{

        const summonerInfoResponse = await fetch(`https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sumName}?api_key=RGAPI-f057f1f7-0743-4ebd-8a04-20291d0612fa`);
        const summonerInfo = await summonerInfoResponse.json();
        console.log(summonerInfo);

    } catch(e){
        console.error(e)
    }
}

summonerSearchInput.addEventListener("keydown", (evnt) => {
    if (evnt.key === "Enter") {
        getSummonerInfo(evnt.target.value);
    }
});


toggleBar.addEventListener("click", () => {
    toggleDisplayed = !toggleDisplayed;
    championsToggle.style.display = toggleDisplayed ? "flex" : "none";
});
toggleArrows.addEventListener("click", () => {
    toggleDisplayed = !toggleDisplayed;
    championsToggle.style.display = toggleDisplayed ? "flex" : "none";
});


const getChampsInfo = (async() => {
    const champsInfoResponse = await fetch('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json');
    const champsInfo = await champsInfoResponse.json();
    champNames = Object.keys(champsInfo.data);

    createSelectionRows(champNames)
})()


const createSelectionRows = (names) => {
    const champButtons = names.map((name) => {
        const img = document.createElement("img");
        img.src = `http://ddragon.leagueoflegends.com/cdn/11.7.1/img/champion/${name}.png`
        img.className = "champImg";

        const champButton = document.createElement("button");
        champButton.className = "selectionChamp";
        champButton.appendChild(img);      

        return champButton;
    });

    let selectionRow = document.createElement("div");
    selectionRow.className = "selectionRow";

    for (let i = 0; i < champButtons.length; i++){
        if (i%10 === 0 && i !== 0){
            selectionBox.appendChild(selectionRow)

            selectionRow = document.createElement("div");
            selectionRow.className = "selectionRow";
        } else if (i === champButtons.length - 1) {
            selectionBox.appendChild(selectionRow);
        }

        selectionRow.appendChild(champButtons[i]);
    }
}

counterSearchInput.addEventListener("keyup", (evnt) => {
    if (evnt.target.value === "") {
        while (selectionBox.firstChild) {
            selectionBox.removeChild(selectionBox.lastChild);
        }
        createSelectionRows(champNames);
    } else {
        let filteredNames = champNames.filter((name) => {
            return name.toLowerCase().includes(evnt.target.value.toLowerCase());
        })

        while (selectionBox.firstChild) {
            selectionBox.removeChild(selectionBox.lastChild);
        }
        createSelectionRows(filteredNames);
    }
})