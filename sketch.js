// === Declaração de variáveis globais ===
let base, eixo, tubo;
let rotX = 0, rotY = 0;
let lastMouseX, lastMouseY;
let dragging = false;
let zoom = 0.045;
let ahSlider, decSlider;

// === Pré-carregamento dos modelos 3D ===
function preload() {
  base = loadModel('assets/base.obj', false);
  eixo = loadModel('assets/eixo.obj', false);
  tubo = loadModel('assets/tubo.obj', false);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Sliders para ajuste dos eixos
  ahSlider = createSlider(-12, 12, 0, 0.01).style('width', '180px');
  decSlider = createSlider(-90, 90, 0, 0.1).style('width', '180px');

  // Botão para ativar/desativar rotação pelo mouse
  window.moveBtn = createButton('Desativar rotação pelo mouse')
    .style('font-size', '14px')
    .style('background', '#222')
    .style('color', '#eee')
    .style('border', '1px solid #444')
    .style('margin-top', '12px')
    .position(30, windowHeight / 2 - 330);

  window.moveEnabled = true;
  window.moveBtn.mousePressed(() => {
    window.moveEnabled = !window.moveEnabled;
    window.moveBtn.html(window.moveEnabled ? 'Desativar rotação pelo mouse' : 'Ativar rotação pelo mouse');
  });

  // Labels
  window.ahLabel = createDiv('Ajuste AH (h)')
    .style('color', '#ccc')
    .style('font-size', '15px')
    .style('background', 'transparent')
    .position(30, windowHeight / 2 - 292);

  window.decLabel = createDiv('Ajuste DEC (°)')
    .style('color', '#ccc')
    .style('font-size', '15px')
    .style('background', 'transparent')
    .position(30, windowHeight / 2 - 222);

  ahSlider.position(30, windowHeight / 2 - 260);
  decSlider.position(30, windowHeight / 2 - 190);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  window.ahLabel.position(30, windowHeight / 2 - 292);
  window.decLabel.position(30, windowHeight / 2 - 222);
  ahSlider.position(30, windowHeight / 2 - 260);
  decSlider.position(30, windowHeight / 2 - 190);
  window.moveBtn.position(30, windowHeight / 2 - 330);
}

function draw() {
  background(0);

  push();
  scale(zoom);
  rotateX(rotX);
  rotateY(rotY);

  // BASE - fixa
  push();
  ambientMaterial(200);
  stroke(180);
  rotateY(-150 * PI / 180);
  rotateX(-HALF_PI); // verticaliza a base
  model(base);
  pop();

  // EIXO + TUBO (acoplados)
  push();
  ambientMaterial(220);
  stroke(180);
  rotateY(-150 * PI / 180);
  rotateX(-HALF_PI);
  rotateZ(-ahSlider.value() * 15 * PI / 180); // AH gira eixo e tubo juntos
  translate(0, 0, 2397);
  model(eixo);

  // TUBO - gira só com DEC, mas é filho do eixo
  push();
  ambientMaterial(255);
  stroke(200);
  translate(-508, 0, 0);
  rotateX(-decSlider.value() * PI / 180); // só DEC
  model(tubo);
  pop();

  pop();

  pop();

  // Mostra valores dos sliders
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text(`AH: ${ahSlider.value().toFixed(2)} h\nDEC: ${decSlider.value().toFixed(2)}°`, 30, windowHeight - 80);
}

// Mouse drag para girar
function mousePressed() {
  if (mouseButton === LEFT) {
    dragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (dragging && window.moveEnabled) {
    rotY += (mouseX - lastMouseX) * 0.01;
    rotX += (mouseY - lastMouseY) * 0.01;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

// Zoom com scroll
function mouseWheel(event) {
  zoom -= event.delta * 0.0005;
  zoom = constrain(zoom, 0.01, 0.2);
}
