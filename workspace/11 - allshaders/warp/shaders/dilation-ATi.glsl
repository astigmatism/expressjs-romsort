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
vec4 _r0010;
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
    _r0010 = VertexCoord.x*MVPMatrix[0];
    _r0010 = _r0010 + VertexCoord.y*MVPMatrix[1];
    _r0010 = _r0010 + VertexCoord.z*MVPMatrix[2];
    _r0010 = _r0010 + VertexCoord.w*MVPMatrix[3];
    _ps = vec2(1.00000000E+00/TextureSize.x, 1.00000000E+00/TextureSize.y);
    _OUT.VARt1 = vec2(_ps.x, _ps.y);
    _ret_0._position1 = _r0010;
    _ret_0._color1 = COLOR;
    _ret_0._texCoord1 = TexCoord.xy;
    VARt1 = _OUT.VARt1;
    gl_Position = vec4(float(_r0010.x), float(_r0010.y), float(_r0010.z), float(_r0010.w));
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
vec3 _TMP10;
vec3 _TMP11;
vec3 _TMP12;
vec3 _TMP13;
float _TMP9;
float _TMP7;
float _TMP8;
float _TMP14;
vec4 _TMP4;
vec4 _TMP3;
vec4 _TMP2;
vec4 _TMP1;
vec4 _TMP0;
out_vertex _VAR1;
uniform sampler2D Texture;
vec2 _c0024;
vec2 _c0026;
vec2 _c0030;
vec2 _c0032;
vec4 _r0034;
vec4 _r0044;
COMPAT_VARYING vec4 TEX0;
 
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec3 _B;
    vec3 _D;
    vec3 _E;
    vec3 _F;
    vec3 _H;
    vec4 _b;
    vec4 _e;
    float _di;
    _c0024 = TEX0.xy + vec2( 0.00000000E+00, -1.00000000E+00)*VARt1;
    _TMP0 = COMPAT_TEXTURE(Texture, _c0024);
    _B = vec3(float(_TMP0.x), float(_TMP0.y), float(_TMP0.z));
    _c0026 = TEX0.xy + vec2( -1.00000000E+00, 0.00000000E+00)*VARt1;
    _TMP1 = COMPAT_TEXTURE(Texture, _c0026);
    _D = vec3(float(_TMP1.x), float(_TMP1.y), float(_TMP1.z));
    _TMP2 = COMPAT_TEXTURE(Texture, TEX0.xy);
    _E = vec3(float(_TMP2.x), float(_TMP2.y), float(_TMP2.z));
    _c0030 = TEX0.xy + vec2( 1.00000000E+00, 0.00000000E+00)*VARt1;
    _TMP3 = COMPAT_TEXTURE(Texture, _c0030);
    _F = vec3(float(_TMP3.x), float(_TMP3.y), float(_TMP3.z));
    _c0032 = TEX0.xy + vec2( 0.00000000E+00, 1.00000000E+00)*VARt1;
    _TMP4 = COMPAT_TEXTURE(Texture, _c0032);
    _H = vec3(float(_TMP4.x), float(_TMP4.y), float(_TMP4.z));
    _TMP14 = dot(vec3(float(_B.x), float(_B.y), float(_B.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0034.x = float(_TMP14);
    _TMP14 = dot(vec3(float(_D.x), float(_D.y), float(_D.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0034.y = float(_TMP14);
    _TMP14 = dot(vec3(float(_H.x), float(_H.y), float(_H.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0034.z = float(_TMP14);
    _TMP14 = dot(vec3(float(_F.x), float(_F.y), float(_F.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0034.w = float(_TMP14);
    _b = vec4(float(_r0034.x), float(_r0034.y), float(_r0034.z), float(_r0034.w));
    _TMP14 = dot(vec3(float(_E.x), float(_E.y), float(_E.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0044.x = float(_TMP14);
    _TMP14 = dot(vec3(float(_E.x), float(_E.y), float(_E.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0044.y = float(_TMP14);
    _TMP14 = dot(vec3(float(_E.x), float(_E.y), float(_E.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0044.z = float(_TMP14);
    _TMP14 = dot(vec3(float(_E.x), float(_E.y), float(_E.z)), vec3( 1.43593750E+01, 2.81718750E+01, 5.47265625E+00));
    _r0044.w = float(_TMP14);
    _e = vec4(float(_r0044.x), float(_r0044.y), float(_r0044.z), float(_r0044.w));
    _TMP7 = max(_b.x, _b.y);
    _TMP8 = max(_b.w, _e.x);
    _TMP9 = max(_b.z, _TMP8);
    _di = max(_TMP7, _TMP9);
    if (_di == _b.x) { 
        _TMP10 = _B;
    } else {
        if (_di == _b.y) { 
            _TMP11 = _D;
        } else {
            if (_di == _b.z) { 
                _TMP12 = _H;
            } else {
                if (_di == _b.w) { 
                    _TMP13 = _F;
                } else {
                    _TMP13 = _E;
                } 
                _TMP12 = _TMP13;
            } 
            _TMP11 = _TMP12;
        } 
        _TMP10 = _TMP11;
    } 
    _ret_0 = vec4(_TMP10.x, _TMP10.y, _TMP10.z, 1.00000000E+00);
    FragColor = vec4(float(_ret_0.x), float(_ret_0.y), float(_ret_0.z), float(_ret_0.w));
    return;
} 
#endif
