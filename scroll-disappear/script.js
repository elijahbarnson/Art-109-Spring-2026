const title = document.getElementById("main-title");
const intro = document.getElementById("intro-text");
const loadingScreen = document.getElementById("loading-screen");
const popupLayer = document.getElementById("popup-layer");
const finalLine = document.getElementById("final-line");
const endingSection = document.querySelector(".ending");

const popupMessages = [
    "THIS HAS MARKET VOLATILITY",
    "YOU HAVE BEEN ONLINE FOR 6 HOURS",
    "THE WORLD CONTINUES WHILE YOU SCROLL",
    "DON'T WASTE TIME",
    "ARE YOU POLARIZED YET?",
    "YOU CAN'T AFFORD ANYTHING",
    "YOU'RE BAD AT WHAT YOU ENJOY",
    "YOUR SELF WORTH IS CLEARLY BUILT FROM THE INTERNET"
];

let popupCount = 0;

window.addEventListener("scroll", () => {

    // how far the user has scrolled
    let scrollPosition = window.scrollY;

    // fade title as user scrolls
    title.style.opacity = 1 - scrollPosition / 400;

    // fade intro text slower
    intro.style.opacity = 1 - scrollPosition / 700;

    // darken background over time
    let darkness = Math.min(scrollPosition / 8, 180);

    document.body.style.backgroundColor =
        `rgb(${244 - darkness}, ${241 - darkness}, ${234 - darkness})`;

    const whispers = document.querySelectorAll(".whisper");

    whispers.forEach((whisper, index) => {

        let movement = scrollPosition * 0.02 * (index + 1);

        whisper.style.transform =
            `translateY(${movement}px)`;
    });

    if (scrollPosition > 6500) {
        document.body.classList.add("hide-cursor");
    } else {
        document.body.classList.remove("hide-cursor");
    }

    let endingPosition = endingSection.getBoundingClientRect().top;

    if (endingPosition < window.innerHeight * 0.6) {
        finalLine.style.opacity = 1;
    } else {
        finalLine.style.opacity = 0;
    }

    if (endingPosition < window.innerHeight) {
        popupLayer.innerHTML = "";
        popupCount = 0;
    }

    if (scrollPosition > 2800 && scrollPosition < 4200) {
        loadingScreen.classList.add("active");
    } else {
        loadingScreen.classList.remove("active");
    }

if (
    scrollPosition > 4300 &&
    endingPosition > 0 &&
    popupCount < 25
) {
    createPopup();
}

if (endingPosition < window.innerHeight * 0.6) {
    popupLayer.innerHTML = "";
    popupCount = 0;
}

    if (scrollPosition < 4300) {
        popupLayer.innerHTML = "";
        popupCount = 0;
    }

});

function createPopup() {
    const popup = document.createElement("div");

    popup.classList.add("generated-popup");

    popup.textContent =
        popupMessages[Math.floor(Math.random() * popupMessages.length)];

    popup.style.left = Math.random() * 85 + "vw";
    popup.style.top = Math.random() * 85 + "vh";

    popupLayer.appendChild(popup);

    popupCount++;
}