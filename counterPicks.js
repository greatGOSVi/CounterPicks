const toggleBar = document.getElementsByClassName("toggleBar")[0];
const toggleArrows = document.getElementsByClassName("toggleArrows")[0];
const championsToggle = document.getElementsByClassName("selectionBox")[0];
let toggleDisplayed = false;

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
    const champsNames = Object.keys(champsInfo.data);

    createSelectionRows(champsNames)
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

    const selectionBox = document.getElementsByClassName("selectionBox")[0];
    let selectionRow = document.createElement("div");
    selectionRow.className = "selectionRow";
    for (let i = 0; i < champButtons.length; i++){
        if (i%10 === 0 && i !== 0){
            selectionBox.appendChild(selectionRow)

            selectionRow = document.createElement("div");
            selectionRow.className = "selectionRow";
            console.log()
        }
        selectionRow.appendChild(champButtons[i]);
    }
}