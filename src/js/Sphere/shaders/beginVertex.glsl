vec3 transformed = vec3( position );

float time = u_time * 0.001;
vec2 pos = position.xy / u_noiseScale;

float x = pos.x + sin(time * 2.0) + + simplexNoiseFBM(
  vec3(pos.xy, time)
);

vStripe = sin(x * u_stripeFactor);

transformed *= 1.0 + vStripe * u_noiseBulge;