let stems = [];
let particles = [];
// 무라카미 다카시 특유의 비비드한 컬러셋
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

  // 클릭 시 30개의 모노그램 파티클 생성
  for (let i = 0; i < 30; i++) {
    particles.push(new MonogramParticle(target.tip.x, target.tip.y));
  }
}

function drawUI() {
  textAlign(CENTER);
  fill(0);
  noStroke();
  textSize(22);
  textFont('Georgia'); // 약간 더 고급스러운 폰트
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
    bezierVertex(this.baseX, height * 0.7, this.tip.x, height * 0.6, this.tip.x, this.tip.y);
    endShape();

    fill(0, 15);
    noStroke();
    ellipse(this.tip.x, this.tip.y, 40);
    fill(180);
    ellipse(this.tip.x, this.tip.y, 8);
  }
}

class MonogramParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 6));
    this.color = random(monogramColors);
    this.lifespan = 255;
    this.size = random(10, 20);
    this.type = floor(random(4)); // 0: 둥근꽃, 1: 별모양, 2: LV, 3: 원형꽃
    this.rot = random(TWO_PI);
    this.rotVel = random(-0.05, 0.05);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.97); // 부드럽게 감속
    this.rot += this.rotVel;
    this.lifespan -= 3;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);
    let c = color(this.color);
    c.setAlpha(this.lifespan);
    stroke(c);
    strokeWeight(1.5);
    noFill();

    // 루이비통 모노그램 타입별 그리기
    if (this.type === 0) {
      // 1. 둥근 4잎 꽃 (Rounded Flower)
      for (let i = 0; i < 4; i++) {
        rotate(HALF_PI);
        ellipse(this.size * 0.4, 0, this.size * 0.8, this.size * 0.5);
      }
    } else if (this.type === 1) {
      // 2. 뾰족한 4잎 별 (Pointed Flower / Star)
      beginShape();
      for (let i = 0; i < 8; i++) {
        let r = i % 2 === 0 ? this.size : this.size * 0.3;
        let x = cos(QUARTER_PI * i) * r;
        let y = sin(QUARTER_PI * i) * r;
        vertex(x, y);
      }
      endShape(CLOSE);
    } else if (this.type === 2) {
      // 3. LV 로고 텍스트
      noStroke();
      fill(c);
      textSize(this.size);
      textAlign(CENTER, CENTER);
      text('LV', 0, 0);
    } else {
      // 4. 원 안의 꽃 (Circle Flower)
      ellipse(0, 0, this.size * 1.5);
      for (let i = 0; i < 4; i++) {
        rotate(HALF_PI);
        ellipse(this.size * 0.3, 0, this.size * 0.6, this.size * 0.3);
      }
    }
    pop();
  }

  isDead() { return this.lifespan < 0; }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
