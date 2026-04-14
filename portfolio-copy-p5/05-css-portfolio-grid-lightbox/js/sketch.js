let canvas;
let xPos = 0;
let yPos = 0;
let easing = 0.05;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", -2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    clear();

    xPos = xPos + ((mouseX - xPos) * easing);
    yPos = yPos + ((mouseY - yPos) * easing);

    drawThing(xPos, yPos);
}

function drawThing(_x, _y) {
    // Face
    noStroke();
    fill(255, 230, 80);
    ellipse(_x, _y, 40, 40);

    // Eyes
    fill(0);
    ellipse(_x - 7, _y - 5, 4, 4);
    ellipse(_x + 7, _y - 5, 4, 4);

    // Smile
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(_x, _y + 2, 16, 12, 0, PI);
}