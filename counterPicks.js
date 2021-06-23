const summRegion = document.getElementById("summRegion");
const summonerSearchInput = document.getElementById("summonerSearchInput");

const provisionalPIcon = (min, max) => Math.ceil(Math.random() * (max - min)) + 1;
const summPIcon = document.getElementsByClassName("summPIcon")[0];
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

let actualVersion = "11.12.1";
const latestGameVersion = (async () => {
    const versionsResponse = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    const versions = await versionsResponse.json();
    actualVersion = versions[0];

    summPIcon.src = `http://ddragon.leagueoflegends.com/cdn/${actualVersion}/img/profileicon/${provisionalPIcon(1, 28)}.png`;

    getChampsInfo(actualVersion);
})();

const getSummonerInfo = async (sumName, region, gameVersion) => {
    const summonerInfoResponse = await fetch(`http://localhost:3000/summoner-info?region=${region}&sumName=${sumName}`);
    const summonerInfo = await summonerInfoResponse.json();
    const summonerLeagueResponse = await fetch(`http://localhost:3000/summoner-league?region=${region}&sumID=${summonerInfo?.id}`);
    const summonerLeague = await summonerLeagueResponse.json();

    if (summonerInfo.profileIconId) {
        summPIcon.src = `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${summonerInfo?.profileIconId}.png`;
        summLvl.innerText = `${summonerInfo?.summonerLevel}`;
        summName.innerText = `${summonerInfo?.name}`;
    } else {
        summPIcon.src = `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${provisionalPIcon(1, 28)}.png`;
        summLvl.innerText = "Lvl";
        summName.innerText = "NOT-FOUND";
    }
    if (summonerLeague[1]) {
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

    const puuid = `${summonerInfo?.puuid}`;
    while (matchDisplayBox.firstChild) {
        matchDisplayBox.removeChild(matchDisplayBox.lastChild);
    }
    getMatchList(region, gameVersion, puuid, sumName);
}

summonerSearchInput.addEventListener("keydown", (evnt) => {
    if (evnt.key === "Enter") {
        if (evnt.target.value.length > 2) {
            getSummonerInfo(evnt.target.value, summRegion.value, actualVersion);
        }
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


const getChampsInfo = async (gameVersion) => {
    const champsInfoResponse = await fetch(`http://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/champion.json`);
    const champsInfo = await champsInfoResponse.json();
    champNames = Object.keys(champsInfo.data);

    createSelectionRows(champNames, gameVersion);
};


const createSelectionRows = (names, gameVersion) => {
    const champButtons = names.map((name) => {
        const img = document.createElement("img");
        img.src = `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${name}.png`
        img.className = "champImg";

        const champButton = document.createElement("button");
        champButton.className = "selectionChamp";
        champButton.appendChild(img);

        return champButton;
    });

    let selectionRow = document.createElement("div");
    selectionRow.className = "selectionRow";

    for (let i = 0; i < champButtons.length; i++) {
        if (i % 10 === 0 && i !== 0) {
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
        createSelectionRows(champNames, actualVersion);
    } else {
        let filteredNames = champNames.filter((name) => {
            return name.toLowerCase().includes(evnt.target.value.toLowerCase());
        })

        while (selectionBox.firstChild) {
            selectionBox.removeChild(selectionBox.lastChild);
        }
        createSelectionRows(filteredNames, actualVersion);
    }
});

const matchHistoryContainer = document.getElementsByClassName("whiteBigContainer")[1];
const matchDisplayBox = document.getElementsByClassName("matchDisplayBox")[0];
const getMatchList = async (region, gameVersion, puuid, sumName) => {
    let reg = "americas";

    switch (region) {
        case "na":
        case "la1":
        case "la2":
        case "br1":
        case "oc1":
            reg = "americas";
            break;
        case "euw1":
        case "eun1":
        case "ru":
        case "tr1":
            reg = "europe";
            break;
        case "kr":
        case "jp1":
            reg = "asia";
            break;
    };

    const matchListResponse = await fetch(`http://localhost:3000/match-list?region=${reg}&puuid=${puuid}`);
    const matchList = await matchListResponse.json();

    matchHistoryContainer.style.display = "flex";
    for (let i = 0; i < matchList.length; i++) {
        const matchInfoResponse = await fetch(`http://localhost:3000/match-info?region=${reg}&matchId=${matchList[i]}`);
        const matchInfo = await matchInfoResponse.json();

        createMatchDisplayRow(matchInfo, gameVersion, sumName);
    }
}
const createMatchDisplayRow = (matchInfo, gameVersion, summName) => {
    const matchDisplayRow = document.createElement("div");
    matchDisplayRow.className = "matchDisplayRow";

    for (let i = 0; i < matchInfo?.info.participants.length; i++) {
        if (matchInfo?.info.participants[i].summonerName.toLowerCase() === summName.toLowerCase()) {
            const info = matchInfo?.info.participants[i];

            if (info?.win) {
                matchDisplayRow.style.backgroundColor = "#90EE90";
            } else {
                matchDisplayRow.style.backgroundColor = "#F27573";
            }

            const gameInfo = document.createElement("div");
            gameInfo.className = "matchGameInfo";
            const gameMode = document.createElement("strong");
            gameMode.innerText = `${matchInfo?.info.gameMode}`;
            gameInfo.appendChild(gameMode);
            const gameTime = document.createElement("div");
            const gameDuration = (matchInfo?.info.gameDuration/60000).toFixed();
            gameTime.innerText = `${gameDuration}min`;
            gameInfo.appendChild(gameTime)
            matchDisplayRow.appendChild(gameInfo);

            const champInfo = document.createElement("div");
            champInfo.className = "matchChampInfo";
            const champImg = document.createElement("img");
            champImg.className = "matchChampImg";
            champImg.src = `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${info?.championName}.png`;
            champInfo.appendChild(champImg);
            const champLvl = document.createElement("div");
            champLvl.innerText = `${info?.champLevel}`;
            champImg.appendChild(champLvl);
            const name = document.createElement("strong");
            if (info?.championName === "MonkeyKing") {
                name.innerText = "Wukong";
            } else {
                name.innerText = `${info?.championName}`;
            }
            champInfo.appendChild(name);
            matchDisplayRow.appendChild(champInfo);

            const summs = document.createElement("div");
            summs.className = "matchSummonerSpellsInfo";
            matchDisplayRow.appendChild(summs);
            const getSummonerSpellsInfo = (async () => {
                const summ1Img = document.createElement("img");
                const summ2Img = document.createElement("img");
                summ1Img.className = "matchSummonerSpells";
                summ2Img.className = "matchSummonerSpells";

                const spellsInfoResponse = await fetch(`http://ddragon.leagueoflegends.com/cdn/${actualVersion}/data/en_US/summoner.json`);
                const spellsInfo = await spellsInfoResponse.json();
                const spellsInfoKeys = Object.keys(spellsInfo.data);
                for (let i = 0; i < spellsInfoKeys.length; i++) {
                    
                    console.log(spellsInfo.data[spellsInfoKeys[i]].key, info?.summoner1Id, info?.summoner2Id, spellsInfoKeys[i])

                    if (parseInt(spellsInfo.data[spellsInfoKeys[i]].key) === info?.summoner1Id) {
                        summ1Img.src = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/spell/${spellsInfoKeys[i]}.png`;
                    } else if (parseInt(spellsInfo.data[spellsInfoKeys[i]].key) === info?.summoner2Id) {
                        summ2Img.src = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/spell/${spellsInfoKeys[i]}.png`;
                    }
                }
                summ1Img.id = "test";
                summ2Img.id = "test";
                summs.appendChild(summ1Img);
                summs.appendChild(summ2Img);
            })();

            const items = document.createElement("div");
            items.className = "matchItemsInfo";
            const itemsArr = ["item0", "item1", "item2", "item3", "item4", "item5", "item6"];
            for (let i = 0; i < itemsArr.length; i++) {
                if (info[itemsArr[i]] === 0) {
                    const item = document.createElement("div");
                    item.className = "matchNoItem";
                    items.appendChild(item);
                } else if (itemsArr[i] === "item6") {
                    const item = document.createElement("img");
                    item.className = "matchItem";
                    item.src = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${info[itemsArr[i]]}.png`;
                    const visionScore = document.createElement("div");
                    visionScore.innerText = `${info?.visionScore}`;
                    item.appendChild(visionScore);
                    items.appendChild(item);
                } else {
                    const item = document.createElement("img");
                    item.className = "matchItem";
                    item.src = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${info[itemsArr[i]]}.png`;
                    items.appendChild(item);
                }
            }
            matchDisplayRow.appendChild(items);

            const matchScoreInfo = document.createElement("div");
            matchScoreInfo.className = "matchScoreInfo";
            const kdaInfo = document.createElement("strong");
            kdaInfo.innerText = `${info?.kills}/${info?.deaths}/${info?.assists}`;
            matchScoreInfo.appendChild(kdaInfo);
            const creepScoreInfo = document.createElement("strong");
            const creepScore = info?.totalMinionsKilled + info?.neutralMinionsKilled;
            creepScoreInfo.innerText = `${creepScore} CS`;
            matchScoreInfo.appendChild(creepScoreInfo);
            matchDisplayRow.appendChild(matchScoreInfo);

            matchDisplayBox.appendChild(matchDisplayRow);
            break;
        }
    }
}