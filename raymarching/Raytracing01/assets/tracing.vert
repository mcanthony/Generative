#version 150

uniform mat4	ciModelViewProjection;
uniform mat3	ciNormalMatrix;
uniform vec2    resolution;

in vec4		ciPosition;

out highp vec2	TexCoord;

void main( void )
{
    vec4 V      = ciModelViewProjection * ciPosition;
    gl_Position	= V;

	TexCoord	= ciPosition.xy/resolution;
    TexCoord.y  = 1.0 - TexCoord.y;
    TexCoord    = (TexCoord - vec2(.5)) * 2.0;
}
