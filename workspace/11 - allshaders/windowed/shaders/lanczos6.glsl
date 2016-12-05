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
COMPAT_VARYING     vec4 _color1;
struct output_dummy {
    vec4 _color1;
};
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
    float _frame_direction;
    float _frame_rotation;
};
vec4 _oPosition1;
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
    vec4 _oColor;
    vec2 _otexCoord;
    _r0006 = VertexCoord.x*MVPMatrix[0];
    _r0006 = _r0006 + VertexCoord.y*MVPMatrix[1];
    _r0006 = _r0006 + VertexCoord.z*MVPMatrix[2];
    _r0006 = _r0006 + VertexCoord.w*MVPMatrix[3];
    _oPosition1 = _r0006;
    _oColor = COLOR;
    _otexCoord = TexCoord.xy;
    gl_Position = _r0006;
    COL0 = COLOR;
    TEX0.xy = TexCoord.xy;
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
COMPAT_VARYING     vec4 _color;
struct output_dummy {
    vec4 _color;
};
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
    float _frame_direction;
    float _frame_rotation;
};
vec3 _TMP9;
vec3 _TMP8;
vec3 _TMP7;
vec3 _TMP6;
vec3 _TMP5;
vec3 _TMP4;
vec3 _TMP17;
vec3 _TMP16;
vec3 _TMP15;
vec3 _TMP14;
vec3 _TMP13;
vec4 _TMP22;
float _TMP3;
float _TMP2;
float _TMP1;
float _TMP0;
vec3 _TMP12;
vec3 _TMP11;
float _TMP21;
float _TMP20;
float _TMP19;
vec3 _TMP10;
input_dummy _IN1;
uniform sampler2D Texture;
vec2 _x0028;
float _x0030;
vec3 _a0032;
vec3 _TMP33;
vec3 _x0046;
float _x0054;
vec3 _a0056;
vec3 _TMP57;
vec3 _x0070;
float _x0078;
vec3 _a0080;
vec3 _TMP81;
vec3 _x0094;
float _x0102;
vec3 _a0104;
vec3 _TMP105;
vec3 _x0118;
vec2 _c0138;
vec2 _c0142;
vec2 _c0146;
vec2 _c0150;
vec2 _c0154;
vec2 _c0158;
float _ypos0160;
vec2 _c0164;
vec2 _c0168;
vec2 _c0172;
vec2 _c0176;
vec2 _c0180;
vec2 _c0184;
float _ypos0186;
vec2 _c0190;
vec2 _c0194;
vec2 _c0198;
vec2 _c0202;
vec2 _c0206;
vec2 _c0210;
float _ypos0212;
vec2 _c0216;
vec2 _c0220;
vec2 _c0224;
vec2 _c0228;
vec2 _c0232;
vec2 _c0236;
float _ypos0238;
vec2 _c0242;
vec2 _c0246;
vec2 _c0250;
vec2 _c0254;
vec2 _c0258;
vec2 _c0262;
float _ypos0264;
vec2 _c0268;
vec2 _c0272;
vec2 _c0276;
vec2 _c0280;
vec2 _c0284;
vec2 _c0288;
COMPAT_VARYING vec4 TEX0;
 
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec2 _stepxy;
    vec2 _pos;
    vec2 _f;
    vec3 _linetaps11;
    vec3 _linetaps21;
    vec3 _columntaps1;
    vec3 _columntaps2;
    float _suml;
    float _sumc;
    vec2 _xystart;
    vec3 _xpos11;
    vec3 _xpos21;
    output_dummy _OUT;
    vec3 _TMP26;
    _stepxy = 1.00000000E+00/TextureSize.xy;
    _pos = TEX0.xy + _stepxy*5.00000000E-01;
    _x0028 = _pos/_stepxy;
    _f = fract(_x0028);
    _x0030 = 5.00000000E-01 - _f.x*5.00000000E-01;
    _a0032 = 6.28318548E+00*vec3(_x0030 - 1.50000000E+00, _x0030 - 5.00000000E-01, _x0030 + 5.00000000E-01);
    _TMP10 = abs(_a0032);
    _TMP33 = max(_TMP10, vec3( 9.99999975E-06, 9.99999975E-06, 9.99999975E-06));
    _TMP19 = sin(_TMP33.x);
    _TMP20 = sin(_TMP33.y);
    _TMP21 = sin(_TMP33.z);
    _TMP11 = vec3(_TMP19, _TMP20, _TMP21);
    _x0046 = _TMP33/3.00000000E+00;
    _TMP19 = sin(_x0046.x);
    _TMP20 = sin(_x0046.y);
    _TMP21 = sin(_x0046.z);
    _TMP12 = vec3(_TMP19, _TMP20, _TMP21);
    _linetaps11 = (_TMP11*_TMP12)/(_TMP33*_TMP33);
    _x0054 = 1.00000000E+00 - _f.x*5.00000000E-01;
    _a0056 = 6.28318548E+00*vec3(_x0054 - 1.50000000E+00, _x0054 - 5.00000000E-01, _x0054 + 5.00000000E-01);
    _TMP10 = abs(_a0056);
    _TMP57 = max(_TMP10, vec3( 9.99999975E-06, 9.99999975E-06, 9.99999975E-06));
    _TMP19 = sin(_TMP57.x);
    _TMP20 = sin(_TMP57.y);
    _TMP21 = sin(_TMP57.z);
    _TMP11 = vec3(_TMP19, _TMP20, _TMP21);
    _x0070 = _TMP57/3.00000000E+00;
    _TMP19 = sin(_x0070.x);
    _TMP20 = sin(_x0070.y);
    _TMP21 = sin(_x0070.z);
    _TMP12 = vec3(_TMP19, _TMP20, _TMP21);
    _linetaps21 = (_TMP11*_TMP12)/(_TMP57*_TMP57);
    _x0078 = 5.00000000E-01 - _f.y*5.00000000E-01;
    _a0080 = 6.28318548E+00*vec3(_x0078 - 1.50000000E+00, _x0078 - 5.00000000E-01, _x0078 + 5.00000000E-01);
    _TMP10 = abs(_a0080);
    _TMP81 = max(_TMP10, vec3( 9.99999975E-06, 9.99999975E-06, 9.99999975E-06));
    _TMP19 = sin(_TMP81.x);
    _TMP20 = sin(_TMP81.y);
    _TMP21 = sin(_TMP81.z);
    _TMP11 = vec3(_TMP19, _TMP20, _TMP21);
    _x0094 = _TMP81/3.00000000E+00;
    _TMP19 = sin(_x0094.x);
    _TMP20 = sin(_x0094.y);
    _TMP21 = sin(_x0094.z);
    _TMP12 = vec3(_TMP19, _TMP20, _TMP21);
    _columntaps1 = (_TMP11*_TMP12)/(_TMP81*_TMP81);
    _x0102 = 1.00000000E+00 - _f.y*5.00000000E-01;
    _a0104 = 6.28318548E+00*vec3(_x0102 - 1.50000000E+00, _x0102 - 5.00000000E-01, _x0102 + 5.00000000E-01);
    _TMP10 = abs(_a0104);
    _TMP105 = max(_TMP10, vec3( 9.99999975E-06, 9.99999975E-06, 9.99999975E-06));
    _TMP19 = sin(_TMP105.x);
    _TMP20 = sin(_TMP105.y);
    _TMP21 = sin(_TMP105.z);
    _TMP11 = vec3(_TMP19, _TMP20, _TMP21);
    _x0118 = _TMP105/3.00000000E+00;
    _TMP19 = sin(_x0118.x);
    _TMP20 = sin(_x0118.y);
    _TMP21 = sin(_x0118.z);
    _TMP12 = vec3(_TMP19, _TMP20, _TMP21);
    _columntaps2 = (_TMP11*_TMP12)/(_TMP105*_TMP105);
    _TMP0 = dot(_linetaps11, vec3( 1.00000000E+00, 1.00000000E+00, 1.00000000E+00));
    _TMP1 = dot(_linetaps21, vec3( 1.00000000E+00, 1.00000000E+00, 1.00000000E+00));
    _suml = _TMP0 + _TMP1;
    _TMP2 = dot(_columntaps1, vec3( 1.00000000E+00, 1.00000000E+00, 1.00000000E+00));
    _TMP3 = dot(_columntaps2, vec3( 1.00000000E+00, 1.00000000E+00, 1.00000000E+00));
    _sumc = _TMP2 + _TMP3;
    _linetaps11 = _linetaps11/_suml;
    _linetaps21 = _linetaps21/_suml;
    _columntaps1 = _columntaps1/_sumc;
    _columntaps2 = _columntaps2/_sumc;
    _xystart = (-2.50000000E+00 - _f)*_stepxy + _pos;
    _xpos11 = vec3(_xystart.x, _xystart.x + _stepxy.x, _xystart.x + _stepxy.x*2.00000000E+00);
    _xpos21 = vec3(_xystart.x + _stepxy.x*3.00000000E+00, _xystart.x + _stepxy.x*4.00000000E+00, _xystart.x + _stepxy.x*5.00000000E+00);
    _c0138 = vec2(_xpos11.x, _xystart.y);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0138);
    _TMP13 = _TMP22.xyz;
    _c0142 = vec2(_xpos11.y, _xystart.y);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0142);
    _TMP14 = _TMP22.xyz;
    _c0146 = vec2(_xpos11.z, _xystart.y);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0146);
    _TMP15 = _TMP22.xyz;
    _c0150 = vec2(_xpos21.x, _xystart.y);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0150);
    _TMP16 = _TMP22.xyz;
    _c0154 = vec2(_xpos21.y, _xystart.y);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0154);
    _TMP17 = _TMP22.xyz;
    _c0158 = vec2(_xpos21.z, _xystart.y);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0158);
    _TMP4 = _TMP13*_linetaps11.x + _TMP14*_linetaps21.x + _TMP15*_linetaps11.y + _TMP16*_linetaps21.y + _TMP17*_linetaps11.z + _TMP22.xyz*_linetaps21.z;
    _ypos0160 = _xystart.y + _stepxy.y;
    _c0164 = vec2(_xpos11.x, _ypos0160);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0164);
    _TMP13 = _TMP22.xyz;
    _c0168 = vec2(_xpos11.y, _ypos0160);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0168);
    _TMP14 = _TMP22.xyz;
    _c0172 = vec2(_xpos11.z, _ypos0160);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0172);
    _TMP15 = _TMP22.xyz;
    _c0176 = vec2(_xpos21.x, _ypos0160);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0176);
    _TMP16 = _TMP22.xyz;
    _c0180 = vec2(_xpos21.y, _ypos0160);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0180);
    _TMP17 = _TMP22.xyz;
    _c0184 = vec2(_xpos21.z, _ypos0160);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0184);
    _TMP5 = _TMP13*_linetaps11.x + _TMP14*_linetaps21.x + _TMP15*_linetaps11.y + _TMP16*_linetaps21.y + _TMP17*_linetaps11.z + _TMP22.xyz*_linetaps21.z;
    _ypos0186 = _xystart.y + _stepxy.y*2.00000000E+00;
    _c0190 = vec2(_xpos11.x, _ypos0186);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0190);
    _TMP13 = _TMP22.xyz;
    _c0194 = vec2(_xpos11.y, _ypos0186);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0194);
    _TMP14 = _TMP22.xyz;
    _c0198 = vec2(_xpos11.z, _ypos0186);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0198);
    _TMP15 = _TMP22.xyz;
    _c0202 = vec2(_xpos21.x, _ypos0186);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0202);
    _TMP16 = _TMP22.xyz;
    _c0206 = vec2(_xpos21.y, _ypos0186);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0206);
    _TMP17 = _TMP22.xyz;
    _c0210 = vec2(_xpos21.z, _ypos0186);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0210);
    _TMP6 = _TMP13*_linetaps11.x + _TMP14*_linetaps21.x + _TMP15*_linetaps11.y + _TMP16*_linetaps21.y + _TMP17*_linetaps11.z + _TMP22.xyz*_linetaps21.z;
    _ypos0212 = _xystart.y + _stepxy.y*3.00000000E+00;
    _c0216 = vec2(_xpos11.x, _ypos0212);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0216);
    _TMP13 = _TMP22.xyz;
    _c0220 = vec2(_xpos11.y, _ypos0212);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0220);
    _TMP14 = _TMP22.xyz;
    _c0224 = vec2(_xpos11.z, _ypos0212);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0224);
    _TMP15 = _TMP22.xyz;
    _c0228 = vec2(_xpos21.x, _ypos0212);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0228);
    _TMP16 = _TMP22.xyz;
    _c0232 = vec2(_xpos21.y, _ypos0212);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0232);
    _TMP17 = _TMP22.xyz;
    _c0236 = vec2(_xpos21.z, _ypos0212);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0236);
    _TMP7 = _TMP13*_linetaps11.x + _TMP14*_linetaps21.x + _TMP15*_linetaps11.y + _TMP16*_linetaps21.y + _TMP17*_linetaps11.z + _TMP22.xyz*_linetaps21.z;
    _ypos0238 = _xystart.y + _stepxy.y*4.00000000E+00;
    _c0242 = vec2(_xpos11.x, _ypos0238);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0242);
    _TMP13 = _TMP22.xyz;
    _c0246 = vec2(_xpos11.y, _ypos0238);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0246);
    _TMP14 = _TMP22.xyz;
    _c0250 = vec2(_xpos11.z, _ypos0238);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0250);
    _TMP15 = _TMP22.xyz;
    _c0254 = vec2(_xpos21.x, _ypos0238);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0254);
    _TMP16 = _TMP22.xyz;
    _c0258 = vec2(_xpos21.y, _ypos0238);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0258);
    _TMP17 = _TMP22.xyz;
    _c0262 = vec2(_xpos21.z, _ypos0238);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0262);
    _TMP8 = _TMP13*_linetaps11.x + _TMP14*_linetaps21.x + _TMP15*_linetaps11.y + _TMP16*_linetaps21.y + _TMP17*_linetaps11.z + _TMP22.xyz*_linetaps21.z;
    _ypos0264 = _xystart.y + _stepxy.y*5.00000000E+00;
    _c0268 = vec2(_xpos11.x, _ypos0264);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0268);
    _TMP13 = _TMP22.xyz;
    _c0272 = vec2(_xpos11.y, _ypos0264);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0272);
    _TMP14 = _TMP22.xyz;
    _c0276 = vec2(_xpos11.z, _ypos0264);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0276);
    _TMP15 = _TMP22.xyz;
    _c0280 = vec2(_xpos21.x, _ypos0264);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0280);
    _TMP16 = _TMP22.xyz;
    _c0284 = vec2(_xpos21.y, _ypos0264);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0284);
    _TMP17 = _TMP22.xyz;
    _c0288 = vec2(_xpos21.z, _ypos0264);
    _TMP22 = COMPAT_TEXTURE(Texture, _c0288);
    _TMP9 = _TMP13*_linetaps11.x + _TMP14*_linetaps21.x + _TMP15*_linetaps11.y + _TMP16*_linetaps21.y + _TMP17*_linetaps11.z + _TMP22.xyz*_linetaps21.z;
    _TMP26 = _TMP4*_columntaps1.x + _TMP5*_columntaps2.x + _TMP6*_columntaps1.y + _TMP7*_columntaps2.y + _TMP8*_columntaps1.z + _TMP9*_columntaps2.z;
    _OUT._color = vec4(_TMP26.x, _TMP26.y, _TMP26.z, 1.00000000E+00);
    FragColor = _OUT._color;
    return;
} 
#endif
