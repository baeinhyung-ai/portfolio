precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform float intensity;
uniform float radius;
uniform float threshold;

void main() {
  vec4 col = texture2D(tex0, vTexCoord);
  vec3 blurColor = vec3(0.0);
  vec2 texelSize = 1.0 / vec2(800.0, 800.0);

  // 고품질 가우시안 블러 커널
  for (float i = -2.0; i <= 2.0; i++) {
    for (float j = -2.0; j <= 2.0; j++) {
      vec2 offset = vec2(i, j) * texelSize * radius;
      vec3 sample = texture2D(tex0, vTexCoord + offset).rgb;
      float brightness = max(sample.r, max(sample.g, sample.b));
      if (brightness > threshold) {
        blurColor += sample;
      }
    }
  }
  blurColor = (blurColor / 25.0) * intensity;
  gl_FragColor = vec4(col.rgb + blurColor, col.a);
}
