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
COMPAT_VARYING     float _frame_rotation;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
    float _frame_direction;
    float _frame_rotation;
};
vec4 _oPosition1;
input_dummy _IN1;
vec4 _r0008;
COMPAT_ATTRIBUTE vec4 VertexCoord;
COMPAT_ATTRIBUTE vec4 COLOR;
COMPAT_VARYING vec4 COL0;
COMPAT_ATTRIBUTE vec4 TexCoord;
COMPAT_VARYING vec4 TEX0;
COMPAT_ATTRIBUTE vec4 LUTTexCoord;
COMPAT_VARYING vec4 TEX1;
 
uniform mat4 MVPMatrix;
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec4 _oColor;
    vec2 _oTex;
    vec2 _otex_border;
    vec2 _scale;
    vec2 _middle;
    vec2 _diff;
    vec2 _dist;
    _r0008 = VertexCoord.x*MVPMatrix[0];
    _r0008 = _r0008 + VertexCoord.y*MVPMatrix[1];
    _r0008 = _r0008 + VertexCoord.z*MVPMatrix[2];
    _r0008 = _r0008 + VertexCoord.w*MVPMatrix[3];
    _oPosition1 = _r0008;
    _oColor = COLOR;
    _scale = (OutputSize/vec2( 3.20000000E+02, 2.40000000E+02))/6.00000000E+00;
    _middle = (5.00000000E-01*InputSize)/TextureSize;
    _diff = TexCoord.xy - _middle;
    _oTex = _middle + _diff*_scale;
    _dist = LUTTexCoord.xy - vec2( 4.99989986E-01, 4.99989986E-01);
    _otex_border = vec2( 4.99989986E-01, 4.99989986E-01) + (_dist*OutputSize)/vec2( 2.56000000E+03, 1.60000000E+03);
    gl_Position = _r0008;
    COL0 = COLOR;
    TEX0.xy = _oTex;
    TEX1.xy = _otex_border;
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
COMPAT_VARYING     float _frame_rotation;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
    float _frame_direction;
    float _frame_rotation;
};
vec4 _ret_0;
vec4 _TMP16;
float _TMP15;
float _TMP19;
float _TMP14;
float _TMP13;
float _TMP12;
float _TMP11;
vec2 _TMP10;
vec2 _TMP9;
vec2 _TMP18;
vec3 _TMP7;
vec3 _TMP5;
vec3 _TMP4;
vec2 _TMP3;
float _TMP2;
float _TMP17;
float _TMP1;
uniform sampler2D Texture;
uniform sampler2D bg;
input_dummy _IN1;
float _a0030;
float _x0032;
vec3 _r0042;
vec2 _TMP53;
vec2 _a0060;
vec2 _x0062;
vec2 _a0064;
float _a0066;
float _b0066;
float _a0070;
float _a0072;
float _b0074;
float _x0076;
float _TMP77;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
 
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec2 _uv;
    vec3 _acc;
    float _dof;
    int _i1;
    float _fi1;
    vec2 _q1;
    vec3 _n1;
    vec3 _m1;
    vec3 _mp1;
    vec3 _r1;
    vec2 _s1;
    float _d1;
    float _edge1;
    vec4 _snowscape;
    vec4 _frame;
    vec4 _background;
    _uv = TEX0.xy*(TextureSize.xy/InputSize.xy);
    _acc = vec3( 0.00000000E+00, 0.00000000E+00, 0.00000000E+00);
    _a0030 = float(FrameCount)*1.00000001E-01;
    _TMP1 = sin(_a0030);
    _dof = 5.00000000E+00*_TMP1;
    _i1 = 0;
    for (; float(_i1) < 1.50000000E+01; _i1 = _i1 + 1) { 
        _fi1 = float(_i1);
        _q1 = _uv*(1.00000000E+00 + _fi1);
        _x0032 = _fi1*7.23891687E+00;
        _TMP17 = floor(_x0032);
        _TMP2 = _x0032 - _TMP17;
        _q1 = _q1 + vec2(_q1.y*(7.50000000E-01*_TMP2 - 3.75000000E-01), (-2.99999993E-02*float(FrameCount))/(1.00000000E+00 + _fi1*2.99999993E-02));
        _TMP3 = floor(_q1);
        _n1 = vec3(_TMP3.x, _TMP3.y, 3.11889992E+01 + _fi1);
        _TMP4 = floor(_n1);
        _TMP5 = fract(_n1);
        _m1 = _TMP4*9.99999975E-06 + _TMP5;
        _r0042.x = dot(vec3( 1.33231220E+01, 2.11212006E+01, 2.18111992E+01), _m1);
        _r0042.y = dot(vec3( 2.35112000E+01, 2.87311993E+01, 1.47212000E+01), _m1);
        _r0042.z = dot(vec3( 2.17112293E+01, 1.19312000E+01, 6.13933983E+01), _m1);
        _TMP7 = fract(_r0042);
        _mp1 = (3.14159004E+04 + _m1)/_TMP7;
        _r1 = fract(_mp1);
        _TMP18 = floor(_q1);
        _TMP53 = _q1 - _TMP18;
        _a0060 = ((_TMP53 - 5.00000000E-01) + 8.99999976E-01*_r1.xy) - 4.49999988E-01;
        _s1 = abs(_a0060);
        _x0062 = 1.00000000E+01*_q1.yx;
        _TMP9 = fract(_x0062);
        _a0064 = 2.00000000E+00*_TMP9 - 1.00000000E+00;
        _TMP10 = abs(_a0064);
        _s1 = _s1 + 9.99999978E-03*_TMP10;
        _a0066 = _s1.x - _s1.y;
        _b0066 = _s1.x + _s1.y;
        _TMP11 = max(_a0066, _b0066);
        _TMP12 = max(_s1.x, _s1.y);
        _d1 = (6.00000024E-01*_TMP11 + _TMP12) - 9.99999978E-03;
        _a0070 = (_fi1 - 5.00000000E+00) - _dof;
        _TMP13 = abs(_a0070);
        _a0072 = 5.00000000E-01*_TMP13;
        _TMP14 = min(_a0072, 1.00000000E+00);
        _edge1 = 5.00000007E-02 + 5.00000007E-02*_TMP14;
        _b0074 = -_edge1;
        _x0076 = (_d1 - _edge1)/(_b0074 - _edge1);
        _TMP19 = min(1.00000000E+00, _x0076);
        _TMP77 = max(0.00000000E+00, _TMP19);
        _TMP15 = _TMP77*_TMP77*(3.00000000E+00 - 2.00000000E+00*_TMP77);
        _acc = _acc + vec3(_TMP15*(_r1.x/(1.00000000E+00 + 1.99999996E-02*_fi1)), _TMP15*(_r1.x/(1.00000000E+00 + 1.99999996E-02*_fi1)), _TMP15*(_r1.x/(1.00000000E+00 + 1.99999996E-02*_fi1)));
    } 
    _snowscape = vec4(_acc.x, _acc.y, _acc.z, 1.00000000E+00);
    _frame = COMPAT_TEXTURE(Texture, TEX0.xy);
    _TMP16 = COMPAT_TEXTURE(bg, TEX1.xy);
    _background = vec4(_TMP16.x, _TMP16.y, _TMP16.z, _TMP16.w);
    _ret_0 = _frame + _background.w*(_snowscape - _frame);
    FragColor = _ret_0;
    return;
} 
#endif
