let stems = [];
let particles = [];
let monogramColors = ['#FF45D1', '#45FF70', '#458BFF', '#FFD145', '#FF7A45', '#BA45FF']; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 3; i++) {
    stems.push(new Stem(width * (0.25 + i * 0.25)));
  }
}

function draw() {
  background(248); 
  drawUI();

  for (let s of stems) {
    s.update();
    s.show();
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function mousePressed() {
  let target = stems[0];
  let dMin = dist(mouseX, mouseY, stems[0].tip.x, stems[0].tip.y);
  for (let s of stems) {
    let d = dist(mouseX, mouseY, s.tip.x, s.tip.y);
    if (d < dMin) { dMin = d; target = s; }
  }

  // 한 번 클릭 시 단일 색상 테마 유지
  let burstColor = random(monogramColors);

  // 폭발 시 다양한 종류의 모노그램 생성
  for (let i = 0; i < 15; i++) {
    particles.push(new MonogramGroup(target.tip.x, target.tip.y, burstColor));
  }
}

function drawUI() {
  textAlign(CENTER);
  fill(0);
  noStroke();
  textSize(22);
  textFont('Georgia');
  text('L O U I S   V U I T T O N', width / 2, height * 0.1);
  textSize(10);
  fill(150);
  textFont('Helvetica');
  text('MURAKAMI ULTRA-FINE EDITION / TACTILE STILLNESS', width / 2, height * 0.13);
}

class Stem {
  constructor(x) {
    this.baseX = x;
    this.tip = createVector(x, height * 0.35);
    this.noiseOff = random(1000);
  }
  update() {
    let sw = sin(frameCount * 0.02 + this.noiseOff) * 15;
    this.tip.x = this.baseX + sw;
  }
  show() {
    stroke(0);
    strokeWeight(1.2); 
    noFill();
    beginShape();
    vertex(this.baseX, height);
    bezierVertex(this.baseX, height * 0.7, this.tip.x, height * 0.6, this.tip.x, this.tip
