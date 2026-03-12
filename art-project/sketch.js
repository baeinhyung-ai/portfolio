let stems = [];
let particles = [];
let monogramColors = ['#FF45D1', '#45FF70', '#458BFF', '#FFD145', '#FF7A45', '#BA45FF']; 

function setup() {
  // 셰이더(WEBGL)를 사용하지 않는 기본 2D 모드로 설정하여 충돌을 방지합니다.
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 3; i++) {
    stems.push(new Stem(width * (0.25 + i * 0.25)));
  }
}

function draw() {
  background(248); // 밝은 배경 (화면이 나오면 이 색이 보여야 합니다)
  
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

  let burstColor = random(monogramColors);
  for (let i = 0; i < 12; i++) {
    particles.push(new MonogramGroup(target.tip.x, target.tip.y, burstColor));
  }
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

class MonogramGroup {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 5));
    this.color = col;
    this.lifespan = 255;
    this.size = random(25, 50); 
    this.type = floor(random(3)); 
    this.rot = random(TWO_PI);
  }
  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.96);
    this.lifespan -= 4;
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);
    let c = color(this.color);
    c.setAlpha(this.lifespan);
    noFill();
    stroke(c);
    strokeWeight(1.5);
    
    if (this.type === 0) { // 십자꽃
      line(-6, 0, 6, 0); line(0, -6, 0, 6);
      for (let a = 0; a < TWO_PI; a += 0.1) {
        let r = this.size * cos(2 * a);
        point(cos(a) * r, sin(a) * r);
      }
    } else if (this.type === 1) { // 다이아몬드
      rectMode(CENTER); push(); rotate(PI/4); rect(0, 0, this.size*1.2, this.size*1.2); pop();
      for (let a = 0; a < TWO_PI; a += 0.15) {
        let r = this.size * 0.8 * cos(2 * a);
        ellipse(cos(a) * r, sin(a) * r, 1, 1);
      }
    } else { // 노드꽃
      for (let a = 0; a < TWO_PI; a += HALF_PI) {
        fill(c); noStroke(); ellipse(cos(a)*this.size*0.8, sin(a)*this.size*0.8, this.size*0.3);
      }
      noFill(); stroke(c);
      for (let a = 0; a < TWO_PI; a += 0.1) {
        let r = this.size * cos(2 * a);
        point(cos(a) * r, sin(a) * r);
      }
    }
    pop();
  }
  isDead() { return this.lifespan < 0; }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
