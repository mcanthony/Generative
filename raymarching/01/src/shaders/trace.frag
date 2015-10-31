precision mediump float;

varying vec2 uv;
uniform float time;


const float PI = 3.141592657;


vec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }
vec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }

float snoise(vec3 v){
	const vec2 C = vec2(1.00/6.00, 1.00/3.00) ;
	const vec4 D = vec4(0.00, 0.50, 1.00, 2.00);
	
	vec3 i = floor(v + dot(v, C.yyy) );
	vec3 x0 = v - i + dot(i, C.xxx) ;
	
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.00 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );
	
	vec3 x1 = x0 - i1 + 1.00 * C.xxx;
	vec3 x2 = x0 - i2 + 2.00 * C.xxx;
	vec3 x3 = x0 - 1. + 3.00 * C.xxx;
	
	i = mod(i, 289.00 );
	vec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));
	
	float n_ = 1.00/7.00;
	vec3 ns = n_ * D.wyz - D.xzx;
	
	vec4 j = p - 49.00 * floor(p * ns.z *ns.z);
	
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.00 * x_ );
	
	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.00 - abs(x) - abs(y);
	
	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );
	
	vec4 s0 = floor(b0)*2.00 + 1.00;
	vec4 s1 = floor(b1)*2.00 + 1.00;
	vec4 sh = -step(h, vec4(0.00));
	
	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
	
	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);
	
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	
	vec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);
	m = m * m;
	return 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
	return snoise(vec3(x, y, z));
}


vec2 rotate(vec2 pos, float angle) {
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, s, -s, c) * pos;
}

float plane(vec3 pos) {
	return pos.y;
}

float sphere(vec3 pos, float radius) {
	return length(pos) - radius;
}

float box(vec3 pos, vec3 size) {
    return length(max(abs(pos) - size, 0.0));
}

float map(vec3 pos) {
	float dPlane = plane(pos+vec3(.0, 0.0, .0));

	float range = 6.0;
	pos.xy = rotate(pos.xy, pos.z * .008 * sin(time*.1));
	pos = mod(pos+range, range*2.0)-range;

	float dSphere = sphere(pos+vec3(0.0, 0.0, .0), 2.0);

	return min(dPlane, dSphere);
}

vec3 computeNormal(vec3 pos) {
	vec2 eps = vec2(0.01, 0.0);

	vec3 normal = vec3(
		map(pos + eps.xyy) - map(pos - eps.xyy),
		map(pos + eps.yxy) - map(pos - eps.yxy),
		map(pos + eps.yyx) - map(pos - eps.yyx)
	);
	return normalize(normal);
}

float cubicIn(float t) {
	return t * t * t;
}

vec3 albedo(vec3 pos) {
	vec3 color = vec3(.0);

	pos *= 2.5;
	pos.xz = rotate(pos.xz, -.45*sin(time*.2));
	pos.yz = rotate(pos.yz, -.25*cos(time*.3));
	float f = fract(pos.z-time*.1);
	f = 1.0 - sin(f * PI);
	f = cubicIn(f);
	color = vec3(f);

	return color;
}

const vec3 lightDirection = vec3(1.0, 1.0, -3.0);

float diffuse(vec3 normal) {
	vec3 L = normalize(lightDirection);
	return max(dot(normal, L), 0.0);
	// return dot(normal, L) * .5 + .5;
}


float specular(vec3 normal, vec3 dir) {
	vec3 h = normalize(normal - dir);
	return pow(max(dot(h, normal), 0.0), 40.0);
}

const int NUM_ITER = 64;
const float focus = 1.5;
const vec3 sky = vec3(1.0, 1.0, .96);
const vec3 yellow = vec3(1.0, 1.0, .9);
const vec3 blue = vec3(.9, .9, 1.0);
const vec3 fog = vec3(0.0, 0.0, 0.0);

void main(void) {

	vec3 pos = vec3(sin(time*.212235)*2.0, cos(time*.128152)*2.0+3.0, -9.0+sin(cos(time*.3289475))*1.0);
	vec3 dir = normalize(vec3(uv, focus));
	// dir.xz = rotate(dir.xz, .1);
	vec4 color = vec4(.0);
	float prec = pow(.1, 5.0);
	float d;
	float n;
	
	for(int i=0; i<NUM_ITER; i++) {
		// n = snoise(pos*.1)*.1;
		d = map(pos);

		if(d < prec) {
			float lightDistance = sphere(pos, 1.0);
			vec3 normal = computeNormal(pos);
			float diff = diffuse(normal) * .5;
			float spec = specular(normal, dir) * .5;
			// color = (diff + spec) * yellow;
			color.rgb += diff*yellow + spec*blue;
			color.a = 1.0;
			break;
		}

		pos += d * dir;
	}

	color.rgb += albedo(pos);
	color.a *= color.r;
	float fogFactor = exp(-pos.z * .01);
	color.rgb = mix(fog, color.rgb, fogFactor);

	// color = frpos;
	// color = vec3(d);
	
    gl_FragColor = vec4(color);
}