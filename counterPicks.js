const toggleButton = document.getElementById("toggleButton");
const championsToggle = document.getElementsByClassName("selectionBox")[0];

let toggleDisplayed = true;

toggleButton.addEventListener("click", () => {
    toggleDisplayed = !toggleDisplayed;
    championsToggle.style.display = toggleDisplayed ? "flex" : "none";
});