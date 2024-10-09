float simplexNoiseFBM(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);

	for (int i = 0; i < 3; ++i) {
		v += a * snoise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}
