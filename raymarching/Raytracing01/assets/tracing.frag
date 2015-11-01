#version 150

uniform float time;

in vec2		TexCoord;
out vec4 	oColor;


const float     focus = 1.0;
const int       NUM_ITER = 200;
const float     MIN_DIST = .00001;
const float     PI = 3.141592657;

float plane(vec3 pos) {
    return pos.y;
}

float sphere(vec3 pos, float radius) {
    return length(pos) - radius;
}

float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float smin( float a, float b )
{
    return smin(a, b, 7.0);
}


float map(vec3 pos) {
    float dPlane = plane(pos);
    float dSphere = sphere(pos+vec3(sin(time * .1) * 2.0, 0.0, 0.0), 3.0);
    return min(dPlane, dSphere);
}


float getColor(in vec3 pos, out vec4 color) {
    float grey = fract(pos.z-time*.1);
    grey = 1.0 - sin(grey*PI);
    grey = grey * grey * grey;
    
    color.rgb = vec3(grey);
    
    color.a = grey;
    
    return grey;
}

void main( void )
{
    vec2 uv     = TexCoord;
    vec3 pos    = vec3(0.0, 2.0, -10.0);
    vec3 dir    = normalize(vec3(uv, focus));
                         
    vec4 color  = vec4(0.0);
    float d;
                            
    for(int i=0; i<NUM_ITER; i++) {
        d = map(pos);
        if(d < MIN_DIST) {
            float grey = getColor(pos, color);
            break;
        }
        
        pos += d * dir;
    }

    
    oColor = color;

}