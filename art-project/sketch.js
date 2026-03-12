let stems = [];
let particles = [];
let colors = ['#FF007F', '#00FF00', '#0000FF', '#FFFF00', '#FF7F00', '#7F00FF']; // 무라카미 컬러셋

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 줄기 3개를 화면 하단에 일정 간격으로 배치
  for (let i = 0; i < 3; i++) {
    let x = width * (0.25 + i * 0.25);
    stems.push(new Stem(x));
  }
}

function draw() {
  background(240); // 영상과 같은 밝은 배경
  
  // 상단 텍스트 레이아웃
  drawBrandText();

  // 줄기 업데이트 및 출력
  for (let s of stems) {
    s.update();
    s.show();
  }

  // 입자 업데이트 및 출력
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

// 클릭 시 가장 가까운 줄기 끝에서 파티클 폭발
function mousePressed() {
  let closestStem = stems[0];
  let minDist = dist(mouseX, mouseY, stems[0].tip.x, stems[0].tip.y);
  
  for (let s of stems) {
    let d = dist(mouseX, mouseY, s.tip.x, s.tip.y);
    if (d < minDist) {
      minDist = d;
      closestStem = s;
    }
  }
  
  // 모노그램 모양으로 파티클 생성
  let color = random(colors);
  for (let i = 0; i < 60; i++) {
    particles.push(new MonogramPoint(closestStem.tip.x, closestStem.tip.y, color));
  }
}

function drawBrandText() {
  fill(0);
  noStroke();
  textAlign(CENTER);
  textFont('Helvetica');
  textSize(24);
  text('L O U I S   V U I T T O N', width / 2, 60);
  textSize(10);
  fill(100);
  text('MURAKAMI ULTRA-FINE EDITION / TACTILE STILLNESS', width / 2, 85);
}

// --- 가느다란 줄기 클래스 ---
class Stem {
  constructor(x) {
    this.baseX = x;
    this.tip = createVector(x, height * 0.3);
    this.off = random(1000);
  }

  update() {
    // 마우스 위치에 따라 부드럽게 흔들림
    let targetX = this.baseX + map(noise(this.off + frameCount * 0.01), 0, 1, -30, 30);
    this.tip.x = lerp(this.tip.x, targetX, 0.1);
    this.off += 0.01;
  }

  show() {
    stroke(0);
    strokeWeight(3);
    noFill();
    // 부드러운 곡선 줄기
    beginShape();
    vertex(this.baseX, height);
    bezierVertex(this.baseX, height * 0.7, this.tip.x, height * 0.5, this.tip.x, this.tip.y);
    endShape();

    // 줄기 끝의 발광 구체 (Blur 효과 대용)
    noStroke();
    for (let i = 10; i > 0; i--) {
      fill(0, 10);
      ellipse(this.tip.x, this.tip.y, i * 8);
    }
    fill(200);
    ellipse(this.tip.x, this.tip.y, 15);
  }
}

// --- 루이비통 도트 파티클 클래스 ---
class MonogramPoint {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.acc = createVector(0, -0.02); // 위로 살짝 떠오르는 효과
    this.color = col;
    this.lifespan = 255;
    this.size = random(2, 4);
    
    // 무라카미 꽃 모양의 좌표 오프셋 계산 (수학적 형태)
    this.shapeOffset = this.calculateMonogram();
  }

  calculateMonogram() {
    let angle = random(TWO_PI);
    // 루이비통 꽃잎 4개 공식: r = cos(2 * theta)
    let r = 40 * cos(2 * angle); 
    return createVector(cos(angle) * r, sin(angle) * r);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.lifespan -= 2;
  }

  show() {
    noStroke();
    let c = color(this.color);
    c.setAlpha(this.lifespan);
    fill(c);
    // 중심점 주변으로 형태를 이루며 퍼짐
    ellipse(this.pos.x + this.shapeOffset.x * map(this.lifespan, 255, 0, 0, 2), 
            this.pos.y + this.shapeOffset.y * map(this.lifespan, 255, 0, 0, 2), 
            this.size);
  }

  isDead() { return this.lifespan < 0; }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
