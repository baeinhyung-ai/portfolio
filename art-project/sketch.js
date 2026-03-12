let plants = [];
let particles = [];
let bloomShader;
let graphics;
const PHI = 1.61803398875; 

function preload() {
  bloomShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  graphics = createGraphics(windowWidth, windowHeight);
  graphics.noStroke();
  
  // 황금 비율 기반 식물 배치
  let x1 = width / PHI;
  let x2 = width - (width / (PHI * PHI));
  
  plants.push(new Plant(x1 - width/2, height/2, 130, -PI/2)); 
  plants.push(new Plant(x2 - width/2, height/2, 100, -PI/2.3));
  plants.push(new Plant(0, height/2, 160, -PI/1.9));
}

function draw() {
  graphics.background(10, 10, 15);

  for (let p of plants) p.show(graphics);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show(graphics);
    if (particles[i].isDead()) particles.splice(i, 1);
  }

  shader(bloomShader);
  bloomShader.setUniform('tex0', graphics);
  bloomShader.setUniform('intensity', 3.5); // 강력한 글로우
  bloomShader.setUniform('radius', 15.0);
  bloomShader.setUniform('threshold', 0.15); 

  rect(-width / 2, -height / 2, width, height);
}

function mousePressed() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  for (let i = 0; i < 20; i++) {
    particles.push(new MonogramParticle(mx, my));
  }
}

class Plant {
  constructor(x, y, len, angle) {
    this.x = x; this.y = y; this.len = len; this.angle = angle;
  }
  show(pg) {
    pg.push();
    pg.translate(this.x + width/2, this.y + height/2);
    this.branch(pg, this.len, this.angle, 12);
    pg.pop();
  }
  branch(pg, len, angle, weight) {
    pg.strokeWeight(weight);
    pg.stroke(255, map(len, 0, 160, 60, 200)); 
    let x2 = cos(angle) * len;
    let y2 = sin(angle) * len;
    pg.line(0, 0, x2, y2);
    if (len > 18) {
      pg.push();
      pg.translate(x2, y2);
      this.branch(pg, len * 0.76, angle + 0.45 + sin(frameCount * 0.02) * 0.05, weight * 0.7);
      this.branch(pg, len * 0.76, angle - 0.45 - sin(frameCount * 0.02) * 0.05, weight * 0.7);
      pg.pop();
    }
  }
}

class MonogramParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(4, 10));
    this.acc = createVector(0, 0.2);
    this.lifespan = 255;
    this.type = floor(random(3));
    this.size = random(15, 35);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 4;
  }
  show(pg) {
    pg.push();
    pg.translate(this.pos.x + width/2, this.pos.y + height/2);
    pg.rotate(this.vel.heading());
    pg.noFill();
    pg.stroke(255, this.lifespan);
    pg.strokeWeight(2.5);
    if (this.type === 0) {
      for (let i = 0; i < 4; i++) { pg.rotate(PI/2); pg.ellipse(this.size/2, 0, this.size, this.size/2); }
    } else if (this.type === 1) {
      pg.rotate(PI/4); pg.rectMode(CENTER); pg.rect(0, 0, this.size, this.size);
    } else {
      pg.ellipse(0, 0, this.size); pg.ellipse(0, 0, this.size * 0.5);
    }
    pg.pop();
  }
  isDead() { return this.lifespan < 0; }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); graphics = createGraphics(windowWidth, windowHeight); }
