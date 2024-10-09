vec3 color1 = vec3(0.5, 0.1, 0.9);
vec3 color2 = vec3(0.1, 0.6, 0.9);

vec3 color = mix(color1, color2, vStripe);

vec4 diffuseColor = vec4(color, opacity);