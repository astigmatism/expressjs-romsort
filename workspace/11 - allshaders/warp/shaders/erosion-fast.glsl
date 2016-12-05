// GLSL shader autogenerated by cg2glsl.py.
#if defined(VERTEX)

#if __VERSION__ >= 130
#define COMPAT_VARYING out
#define COMPAT_ATTRIBUTE in
#define COMPAT_TEXTURE texture
#else
#define COMPAT_VARYING varying
#define COMPAT_ATTRIBUTE attribute
#define COMPAT_TEXTURE texture2D
#endif

#ifdef GL_ES
#define COMPAT_PRECISION mediump
#else
#define COMPAT_PRECISION
#endif
COMPAT_VARYING     vec2 VARt1;
COMPAT_VARYING     vec2 _texCoord1;
COMPAT_VARYING     vec4 _color1;
COMPAT_VARYING     vec4 _position1;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
};
struct out_vertex {
    vec4 _position1;
    vec4 _color1;
    vec2 _texCoord1;
    vec2 VARt1;
};
out_vertex _ret_0;
input_dummy _IN1;
vec4 _r0006;
COMPAT_ATTRIBUTE vec4 VertexCoord;
COMPAT_ATTRIBUTE vec4 COLOR;
COMPAT_ATTRIBUTE vec4 TexCoord;
COMPAT_VARYING vec4 COL0;
COMPAT_VARYING vec4 TEX0;
 
uniform mat4 MVPMatrix;
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    out_vertex _OUT;
    vec2 _ps;
    _r0006 = VertexCoord.x*MVPMatrix[0];
    _r0006 = _r0006 + VertexCoord.y*MVPMatrix[1];
    _r0006 = _r0006 + VertexCoord.z*MVPMatrix[2];
    _r0006 = _r0006 + VertexCoord.w*MVPMatrix[3];
    _ps = vec2(1.00000000E+00/TextureSize.x, 1.00000000E+00/TextureSize.y);
    _OUT.VARt1 = vec2(_ps.x, _ps.y);
    _ret_0._position1 = _r0006;
    _ret_0._color1 = COLOR;
    _ret_0._texCoord1 = TexCoord.xy;
    VARt1 = _OUT.VARt1;
    gl_Position = _r0006;
    COL0 = COLOR;
    TEX0.xy = TexCoord.xy;
    return;
    COL0 = _ret_0._color1;
    TEX0.xy = _ret_0._texCoord1;
} 
#elif defined(FRAGMENT)

#if __VERSION__ >= 130
#define COMPAT_VARYING in
#define COMPAT_TEXTURE texture
out vec4 FragColor;
#else
#define COMPAT_VARYING varying
#define FragColor gl_FragColor
#define COMPAT_TEXTURE texture2D
#endif

#ifdef GL_ES
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define COMPAT_PRECISION mediump
#else
#define COMPAT_PRECISION
#endif
COMPAT_VARYING     vec2 VARt1;
COMPAT_VARYING     vec2 _texCoord;
COMPAT_VARYING     vec4 _color;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
};
struct out_vertex {
    vec4 _color;
    vec2 _texCoord;
    vec2 VARt1;
};
vec4 _ret_0;
vec3 _TMP7;
vec3 _TMP6;
vec3 _TMP5;
vec4 _TMP4;
vec4 _TMP3;
vec4 _TMP2;
vec4 _TMP1;
vec4 _TMP0;
out_vertex _VAR1;
uniform sampler2D Texture;
vec2 _c0013;
vec2 _c0015;
vec2 _c0019;
vec2 _c0021;
COMPAT_VARYING vec4 TEX0;
 
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec3 _res;
    _c0013 = TEX0.xy + vec2( 0.00000000E+00, -1.00000000E+00)*VARt1;
    _TMP0 = COMPAT_TEXTURE(Texture, _c0013);
    _c0015 = TEX0.xy + vec2( -1.00000000E+00, 0.00000000E+00)*VARt1;
    _TMP1 = COMPAT_TEXTURE(Texture, _c0015);
    _TMP2 = COMPAT_TEXTURE(Texture, TEX0.xy);
    _c0019 = TEX0.xy + vec2( 1.00000000E+00, 0.00000000E+00)*VARt1;
    _TMP3 = COMPAT_TEXTURE(Texture, _c0019);
    _c0021 = TEX0.xy + vec2( 0.00000000E+00, 1.00000000E+00)*VARt1;
    _TMP4 = COMPAT_TEXTURE(Texture, _c0021);
    _TMP5 = min(_TMP3.xyz, _TMP1.xyz);
    _TMP6 = min(_TMP0.xyz, _TMP4.xyz);
    _TMP7 = min(_TMP5, _TMP6);
    _res = min(_TMP2.xyz, _TMP7);
    _ret_0 = vec4(_res.x, _res.y, _res.z, 1.00000000E+00);
    FragColor = _ret_0;
    return;
} 
#endif
