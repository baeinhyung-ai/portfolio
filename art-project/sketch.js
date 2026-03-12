let stems = [];
let particles = [];
let monogramColors = ['#FF45D1', '#45FF70', '#458BFF', '#FFD145', '#FF7A45']; // 무라카미 컬러 팔레트

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 영상처럼 수직으로 뻗은 가느다란 줄기 3개 배치
  for (let i = 0; i < 3; i++) {
    stems.push(new Stem(width * (0.25 + i * 0.25)));
  }
}

function draw() {
  background(248); // 밝은 오프화이트 배경
  
  // 텍스트 배치 (영상 상단 레이아웃)
  drawUI();

  // 줄기 그리기
  for (let s of stems) {
    s.update();
    s.show();
  }

  // 파티클 처리
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function mousePressed() {
  // 클릭하면 가장 가까운 줄기 끝에서 파티클 팡!
  let target = stems[0];
  let dMin = dist(mouseX, mouseY, stems[0].tip.x, stems[0].tip.y);
  for (let s of stems) {
    let d = dist(mouseX, mouseY, s.tip.x, s.tip.y);
    if (d < dMin) { dMin = d; target = s; }
  }

  let col = random(monogramColors);
  for (let i = 0; i < 80; i++) {
    particles.push(new DotParticle(target.tip.x, target.tip.y, col));
  }
}

function drawUI() {
  textAlign(CENTER);
  fill(0);
  noStroke();
  textSize(22);
  text('L O U I S   V U I T T O N', width / 2, height * 0.1);
  textSize(10);
  fill(150);
  text('MURAKAMI ULTRA-FINE EDITION / TACTILE STILLNESS', width / 2, height * 0.13);
}

class Stem {
  constructor(x) {
    this.baseX = x;
    this.tip = createVector(x, height * 0.35);
    this.noiseOff = random(1000);
  }
  update() {
    // 줄기가 아주 미세하게 살랑거리는 움직임
    let sw = sin(frameCount * 0.02 + this.noiseOff) * 15;
    this.tip.x = this.baseX + sw;
  }
  show() {
    stroke(0);
    strokeWeight(1.5); // 영상처럼 아주 가늘게
    noFill();
    beginShape();
    vertex(this.baseX, height);
    bezierVertex(this.baseX, height * 0.7, this.tip.x, height * 0.6, this.tip.x, this.tip.y);
    endShape();

    // 줄기 끝 발광체
    fill(0, 20);
    noStroke();
    ellipse(this.tip.x, this.tip.y, 40, 40);
    fill(100);
    ellipse(this.tip.x, this.tip.y, 10, 10);
  }
}

class DotParticle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 5));
    this.color = col;
    this.lifespan = 255;
    // LV 꽃 모양 오프셋 (수학적 형태)
    let angle = random(TWO_PI);
    let r = 50 * cos(2 * angle); // 4잎 꽃 형태 공식
    this.targetOffset = createVector(cos(angle) * r, sin(angle) * r);
  }
  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.96); // 서서히 멈춤
    this.lifespan -= 3;
  }
  show() {
    noStroke();
    let c = color(this.color);
    c.setAlpha(this.lifespan);
    fill(c);
    // 도트들이 꽃 모양을 형성하며 퍼지도록 함
    let drawX = this.pos.x + this.targetOffset.x * map(this.lifespan, 255, 0, 0, 1.5);
    let drawY = this.pos.y + this.targetOffset.y * map(this.lifespan, 255, 0, 0, 1.5);
    ellipse(drawX, drawY, 3, 3);
  }
  isDead() { return this.lifespan < 0; }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
