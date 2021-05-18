const summRegion = document.getElementById("summRegion");
const summonerSearchInput = document.getElementById("summonerSearchInput");

const summPIcon = document.getElementsByClassName("summPIcon")[0];
const provisionalPIcon = (min, max) => Math.ceil(Math.random() * (max - min)) + 1;
summPIcon.src = `http://ddragon.leagueoflegends.com/cdn/11.9.1/img/profileicon/${provisionalPIcon(1, 28)}.png`;
const summLvl = document.getElementById("summLvl");
const summName = document.getElementById("summName");
const summSoloQIcon = document.getElementsByClassName("summLIcon")[0];
const summSoloQTierRank = document.getElementById("summSoloQTierRank");
const summSoloQLP = document.getElementById("summSoloQLP");
const summFlexIcon = document.getElementsByClassName("summLIcon")[1];
const summFlexTierRank = document.getElementById("summFlexTierRank");
const summFlexLP = document.getElementById("summFlexLP");

const counterSearchInput = document.getElementById("counterSearchInput");
const toggleBar = document.getElementsByClassName("toggleBar")[0];
const toggleArrows = document.getElementsByClassName("toggleArrows")[0];
const championsToggle = document.getElementsByClassName("selectionBox")[0];
let toggleDisplayed = true;
const selectionBox = document.getElementsByClassName("selectionBox")[0];
let champNames = [];


const getSummonerInfo = async(sumName, region) => {
        const summonerInfoResponse = await fetch(`http://localhost:3000/summoner-info?region=${region}&sumName=${sumName}/`);
        const summonerInfo = await summonerInfoResponse.json();
        const summonerLeagueResponse = await fetch(`http://localhost:3000/summoner-league?region=${region}&sumID=${summonerInfo?.id}/`);
        const summonerLeague = await summonerLeagueResponse.json();

        if (summonerInfo.profileIconId) {
            summPIcon.src = `http://ddragon.leagueoflegends.com/cdn/11.9.1/img/profileicon/${summonerInfo?.profileIconId}.png`;
            summLvl.innerText = `${summonerInfo?.summonerLevel}`;
            summName.innerText = `${summonerInfo?.name}`;
        } else {
            summPIcon.src = `http://ddragon.leagueoflegends.com/cdn/11.9.1/img/profileicon/${provisionalPIcon(1, 28)}.png`;
            summLvl.innerText = "Lvl";
            summName.innerText = "NOT-FOUND";
        }
        console.log(summonerInfo);
        if (summonerLeague[1]){
            summSoloQIcon.src = `rankedEmblems/Emblem_${summonerLeague[1]?.tier}.png`;
            summSoloQTierRank.innerText = `${summonerLeague[1]?.tier} ${summonerLeague[1]?.rank}`;
            summSoloQLP.innerText = `${summonerLeague[1]?.leaguePoints} LP`;
        } else {
            summSoloQIcon.src = "rankedEmblems/provisional.png";
            summSoloQTierRank.innerText = "Unranked";
            summSoloQLP.innerText = "0 LP";
        }
        if (summonerLeague[0]) {
            summFlexIcon.src = `rankedEmblems/Emblem_${summonerLeague[0]?.tier}.png`;
            summFlexTierRank.innerText = `${summonerLeague[0]?.tier} ${summonerLeague[0]?.rank}`;
            summFlexLP.innerText = `${summonerLeague[0]?.leaguePoints} LP`;
        } else {
            summFlexIcon.src = "rankedEmblems/provisional.png";
            summFlexTierRank.innerText = "Unranked";
            summFlexLP.innerText = "0 LP";
        }
}

summonerSearchInput.addEventListener("keydown", (evnt) => {
    if (evnt.key === "Enter") {
        getSummonerInfo(evnt.target.value,summRegion.value);
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

/*
const getData = (async () => {
    const response = await fetch("http://localhost:3000");
    const data = await response.json();
    console.log(data);
})()
*/