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

    for (let i=0; i<summonerLeague.length; i++) {
        if (summonerLeague[i].queueType === "RANKED_SOLO_5x5") {
            if (summonerLeague[i]) {
                summSoloQIcon.src = `rankedEmblems/Emblem_${summonerLeague[i]?.tier}.png`;
                summSoloQTierRank.innerText = `${summonerLeague[i]?.tier} ${summonerLeague[i]?.rank}`;
                summSoloQLP.innerText = `${summonerLeague[i]?.leaguePoints} LP`;
            } else {
                summSoloQIcon.src = "rankedEmblems/provisional.png";
                summSoloQTierRank.innerText = "Unranked";
                summSoloQLP.innerText = "0 LP";
            }
        } else if (summonerLeague[i].queueType === "RANKED_FLEX_SR") {
            if (summonerLeague[i]) {
                summFlexIcon.src = `rankedEmblems/Emblem_${summonerLeague[i]?.tier}.png`;
                summFlexTierRank.innerText = `${summonerLeague[i]?.tier} ${summonerLeague[i]?.rank}`;
                summFlexLP.innerText = `${summonerLeague[i]?.leaguePoints} LP`;
            } else {
                summFlexIcon.src = "rankedEmblems/provisional.png";
                summFlexTierRank.innerText = "Unranked";
                summFlexLP.innerText = "0 LP";
            }
        }
    }

    const puuid = `${summonerInfo?.puuid}`;
    while (matchDisplayBox.firstChild) {
        matchDisplayBox.removeChild(matchDisplayBox.lastChild);
    }
    getMatchList(region, gameVersion, puuid, 100, sumName);
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
const matchHistoryLength = 20;
const getMatchList = async (region, gameVersion, puuid, count, summName) => {
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

    const matchListResponse = await fetch(`http://localhost:3000/match-list?region=${reg}&puuid=${puuid}&count=${count}`);
    const matchList = await matchListResponse.json();

    matchHistoryContainer.style.display = "flex";
    for (let i = 0; i < matchHistoryLength; i++) {
        const matchInfoResponse = await fetch(`http://localhost:3000/match-info?region=${reg}&matchId=${matchList[i]}`);
        const matchInfo = await matchInfoResponse.json();

        createMatchDisplayRow(matchInfo, gameVersion, summName);
    }
    getPersonalStatistics(matchList, reg, summName);
}
const createMatchDisplayRow = (matchInfo, gameVersion, summName) => {
    const matchDisplayRow = document.createElement("div");
    matchDisplayRow.className = "matchDisplayRow";

    console.log(matchInfo?.info.participants);
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
            switch(matchInfo?.info.gameMode) {
                case "CLASSIC":
                    switch(matchInfo?.info.queueId) {
                        case 430:
                            gameMode.innerText = `BLINDPICK`;
                            break;
                        case 400:
                            gameMode.innerText = `DRAFTPICK`;
                            break;
                        case 420:
                            gameMode.innerText = `SOLOQ`;
                            break;
                        case 440:
                            gameMode.innerText = `FLEX`;
                            break;
                    }
                    break;
                case "DOOMBOTSTEEMO":
                case "ONEFORALL":
                case "FIRSTBLOOD":
                case "KINGPORO":
                case "DARKSTAR":
                case "STARGUARDIAN":
                case "NEXUSBLITZ":
                default:
                    switch(matchInfo?.info.queueId) {
                        case 0:
                            gameMode.innerText = `CUSTOM`;
                            break;
                        case 700:
                            gameMode.innerText = `CLASH`;
                            break;
                        default:
                            gameMode.innerText = `${matchInfo?.info.gameMode}`;
                            break;
                    }
                    break;
            }
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

let latestMatchRegistered; // Esto lo sacaria de la base de datos
const getPersonalStatistics = async (matchListForStats, region, summName) => {
    for (let i=0; i < matchListForStats.length; i++) {
        if (matchListForStats[i] === latestMatchRegistered) {
            break;
        } else {
            const matchInfoForStatsResponse = await fetch(`http://localhost:3000/match-info?region=${region}&matchId=${matchListForStats[i]}`);
            const matchInfoForStats = await matchInfoForStatsResponse.json();

            if (matchInfoForStats?.info.gameMode === "CLASSIC" && matchInfoForStats?.info.gameType === "MATCHED_GAME") {
                for (let j = 0; j < matchInfoForStats?.info.participants.length; j++) {
                    const participantInfo = matchInfoForStats?.info.participants[j];
    
                    if (participantInfo?.summonerName.toLowerCase() === summName.toLowerCase()) {
                        if (matchInfoForStats?.info.queueId === 420) {
                            console.log(i, matchListForStats[i], "RANKED")
                            // Aca sumaria +1 a soloQWins o soloQLoses dependiendo de los campeones usados en la teamPosition
                            // Tambien sumaria +1 a totalWins o totalLoses para las stats generales
                        } else {
                            console.log(i, matchListForStats[i], "NORMAL")
                            // Aca me sumaria +1 a totalWins o totalLoses dependiendo de los campeones usados en la teamPosition
                        }
                    } else {
                        
                    }
                }
            }
        }
    }
    latestMatchRegistered = matchListForStats[0]; // Esto iria a la base de datos
}
// los for de createMatchRow, repito el let i=0. El break para la funcion? o las llaves{} mas inmediatas
// En matchInfoForStats.info.queueId sale si es ranked o normal. 
// 0=Custom, 400=DraftPick, 420=Solo/DuoQ, 430=BlindPick, 440=FlexQ, 450=ARAM, 700=Clash, 830/840/850=Co-op, 900=URF
// 950/960=DoomBots, 1010=ARURF, 1020=OneforAll, 1300=NexusBlitz, 2000/2010/2020=Tutorial
// 430=BLINDPICK, 400=DRAFTPICK, 420=SOLOQ, 440=FLEX | 0=CUSTOM, 700=CLASH
// summoner names con espacio