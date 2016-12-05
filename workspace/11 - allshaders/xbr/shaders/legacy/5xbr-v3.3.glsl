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
COMPAT_VARYING     vec4 _t1;
COMPAT_VARYING     vec2 _texCoord1;
COMPAT_VARYING     vec4 _color1;
COMPAT_VARYING     vec4 _position1;
COMPAT_VARYING     float _frame_rotation;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
    float _frame_direction;
    float _frame_rotation;
};
struct out_vertex {
    vec4 _position1;
    vec4 _color1;
    vec2 _texCoord1;
    vec4 _t1;
};
out_vertex _ret_0;
input_dummy _IN1;
vec4 _r0008;
COMPAT_ATTRIBUTE vec4 VertexCoord;
COMPAT_ATTRIBUTE vec4 COLOR;
COMPAT_ATTRIBUTE vec4 TexCoord;
COMPAT_VARYING vec4 COL0;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
 
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
    _r0008 = VertexCoord.x*MVPMatrix[0];
    _r0008 = _r0008 + VertexCoord.y*MVPMatrix[1];
    _r0008 = _r0008 + VertexCoord.z*MVPMatrix[2];
    _r0008 = _r0008 + VertexCoord.w*MVPMatrix[3];
    _ps = vec2(1.00000000E+00/TextureSize.x, 1.00000000E+00/TextureSize.y);
    _OUT._t1.xy = vec2(0.00000000E+00, -_ps.y);
    _OUT._t1.zw = vec2(-_ps.x, 0.00000000E+00);
    _ret_0._position1 = _r0008;
    _ret_0._color1 = COLOR;
    _ret_0._texCoord1 = TexCoord.xy;
    _ret_0._t1 = _OUT._t1;
    gl_Position = _r0008;
    COL0 = COLOR;
    TEX0.xy = TexCoord.xy;
    TEX1 = _OUT._t1;
    return;
    COL0 = _ret_0._color1;
    TEX0.xy = _ret_0._texCoord1;
    TEX1 = _ret_0._t1;
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
COMPAT_VARYING     vec4 _t1;
COMPAT_VARYING     vec2 _texCoord;
COMPAT_VARYING     vec4 _color1;
COMPAT_VARYING     float _frame_rotation;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
    float _frame_direction;
    float _frame_rotation;
};
struct out_vertex {
    vec4 _color1;
    vec2 _texCoord;
    vec4 _t1;
};
vec4 _ret_0;
vec3 _TMP58;
vec3 _TMP59;
vec3 _TMP60;
vec3 _TMP55;
float _TMP56;
vec3 _TMP62;
vec3 _TMP52;
float _TMP53;
vec3 _TMP49;
float _TMP50;
float _TMP47;
float _TMP46;
float _TMP45;
float _TMP44;
float _TMP43;
float _TMP42;
float _TMP41;
float _TMP40;
float _TMP39;
float _TMP37;
float _TMP36;
float _TMP35;
float _TMP34;
float _TMP33;
float _TMP32;
float _TMP31;
float _TMP30;
float _TMP29;
float _TMP27;
float _TMP26;
float _TMP25;
float _TMP24;
float _TMP23;
float _TMP22;
float _TMP21;
float _TMP20;
float _TMP19;
vec4 _TMP18;
vec4 _TMP17;
vec4 _TMP16;
vec4 _TMP15;
vec4 _TMP14;
vec4 _TMP13;
vec4 _TMP12;
vec4 _TMP11;
vec4 _TMP10;
vec4 _TMP9;
vec4 _TMP8;
vec4 _TMP7;
vec4 _TMP6;
vec4 _TMP5;
vec4 _TMP4;
vec4 _TMP3;
vec4 _TMP2;
vec4 _TMP1;
vec4 _TMP0;
uniform sampler2D Texture;
input_dummy _IN1;
vec2 _x0071;
vec2 _c0075;
vec2 _c0077;
vec2 _c0079;
vec2 _c0081;
vec2 _c0085;
vec2 _c0087;
vec2 _c0089;
vec2 _c0091;
vec2 _c0093;
vec2 _c0095;
vec2 _c0097;
vec2 _c0099;
vec2 _c0101;
vec2 _c0103;
vec2 _c0105;
vec2 _c0107;
vec2 _c0109;
vec2 _c0111;
float _TMP116;
float _TMP120;
float _TMP124;
float _TMP128;
float _TMP132;
float _TMP136;
float _TMP140;
float _TMP144;
vec3 _r0191;
vec3 _v0191;
vec3 _r0203;
vec3 _v0203;
vec3 _r0215;
vec3 _v0215;
vec3 _r0227;
vec3 _v0227;
vec3 _r0239;
vec3 _v0239;
vec3 _r0251;
vec3 _v0251;
vec3 _r0263;
vec3 _v0263;
vec3 _r0275;
vec3 _v0275;
vec3 _r0287;
vec3 _v0287;
vec3 _r0299;
vec3 _v0299;
vec3 _r0311;
vec3 _v0311;
vec3 _r0323;
vec3 _v0323;
vec3 _r0335;
vec3 _v0335;
vec3 _r0347;
vec3 _v0347;
vec3 _r0359;
vec3 _v0359;
vec3 _r0371;
vec3 _v0371;
vec3 _r0383;
vec3 _v0383;
vec3 _r0395;
vec3 _v0395;
vec3 _r0407;
vec3 _v0407;
vec3 _r0419;
vec3 _v0419;
vec3 _r0431;
vec3 _v0431;
vec3 _r0443;
vec3 _v0443;
vec3 _r0455;
vec3 _v0455;
vec3 _r0467;
vec3 _v0467;
vec3 _r0479;
vec3 _v0479;
vec3 _r0491;
vec3 _v0491;
vec3 _r0503;
vec3 _v0503;
vec3 _r0515;
vec3 _v0515;
vec3 _r0527;
vec3 _v0527;
vec3 _r0539;
vec3 _v0539;
vec3 _r0551;
vec3 _v0551;
vec3 _r0563;
vec3 _v0563;
vec3 _r0575;
vec3 _v0575;
vec3 _r0587;
vec3 _v0587;
vec3 _r0599;
vec3 _v0599;
vec3 _r0611;
vec3 _v0611;
vec3 _r0623;
vec3 _v0623;
vec3 _r0635;
vec3 _v0635;
vec3 _r0647;
vec3 _v0647;
vec3 _r0659;
vec3 _v0659;
vec3 _r0671;
vec3 _v0671;
vec3 _r0683;
vec3 _v0683;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
 
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec2 _fp;
    vec2 _st;
    vec2 _g1;
    vec2 _g2;
    float _AO;
    float _BO;
    float _CO;
    float _AX;
    float _BX;
    float _CX;
    float _AY;
    float _BY;
    float _CY;
    bool _ex;
    bool _e_i;
    bool _kei;
    bool _mei;
    bool _ex_ck;
    bool _ex_em;
    bool _ex2;
    bool _ex3;
    bool _exkm;
    bool _fx_1;
    bool _fx_2;
    bool _fx_3;
    bool _fx_4;
    bool _fx_5;
    float _ke;
    float _ki;
    float _kek;
    float _kem;
    float _kik;
    float _kim;
    bool _r1;
    bool _r2;
    bool _r3;
    _x0071 = TEX0.xy*TextureSize;
    _fp = fract(_x0071);
    _st = vec2(float((_fp.x >= 5.00000000E-01)), float((_fp.y >= 5.00000000E-01)));
    _g1 = TEX1.xy*((_st.x + _st.y) - 1.00000000E+00) + TEX1.zw*(_st.x - _st.y);
    _g2 = TEX1.xy*(_st.y - _st.x) + TEX1.zw*((_st.x + _st.y) - 1.00000000E+00);
    _AO = 2.00000000E+00*_st.y - 1.00000000E+00;
    _BO = 2.00000000E+00*_st.x - 1.00000000E+00;
    _CO = (_st.x + _st.y) - 5.00000000E-01;
    _AX = (5.00000000E-01*_st.x + 1.50000000E+00*_st.y) - 1.00000000E+00;
    _BX = (1.50000000E+00*_st.x - 5.00000000E-01*_st.y) - 5.00000000E-01;
    _CX = (_st.x + 5.00000000E-01*_st.y) - 5.00000000E-01;
    _AY = (-5.00000000E-01*_st.x + 1.50000000E+00*_st.y) - 5.00000000E-01;
    _BY = (1.50000000E+00*_st.x + 5.00000000E-01*_st.y) - 1.00000000E+00;
    _CY = (5.00000000E-01*_st.x + _st.y) - 5.00000000E-01;
    _c0075 = TEX0.xy + _g1 + _g2;
    _TMP0 = COMPAT_TEXTURE(Texture, _c0075);
    _c0077 = TEX0.xy + _g1;
    _TMP1 = COMPAT_TEXTURE(Texture, _c0077);
    _c0079 = (TEX0.xy + _g1) - _g2;
    _TMP2 = COMPAT_TEXTURE(Texture, _c0079);
    _c0081 = TEX0.xy + _g2;
    _TMP3 = COMPAT_TEXTURE(Texture, _c0081);
    _TMP4 = COMPAT_TEXTURE(Texture, TEX0.xy);
    _c0085 = TEX0.xy - _g2;
    _TMP5 = COMPAT_TEXTURE(Texture, _c0085);
    _c0087 = (TEX0.xy - _g1) + _g2;
    _TMP6 = COMPAT_TEXTURE(Texture, _c0087);
    _c0089 = TEX0.xy - _g1;
    _TMP7 = COMPAT_TEXTURE(Texture, _c0089);
    _c0091 = (TEX0.xy - _g1) - _g2;
    _TMP8 = COMPAT_TEXTURE(Texture, _c0091);
    _c0093 = (TEX0.xy + 2.00000000E+00*_g1) - _g2;
    _TMP9 = COMPAT_TEXTURE(Texture, _c0093);
    _c0095 = (TEX0.xy - _g1) + 2.00000000E+00*_g2;
    _TMP10 = COMPAT_TEXTURE(Texture, _c0095);
    _c0097 = (TEX0.xy + _g1) - 2.00000000E+00*_g2;
    _TMP11 = COMPAT_TEXTURE(Texture, _c0097);
    _c0099 = TEX0.xy - 2.00000000E+00*_g2;
    _TMP12 = COMPAT_TEXTURE(Texture, _c0099);
    _c0101 = (TEX0.xy - _g1) - 2.00000000E+00*_g2;
    _TMP13 = COMPAT_TEXTURE(Texture, _c0101);
    _c0103 = (TEX0.xy - 2.00000000E+00*_g1) + _g2;
    _TMP14 = COMPAT_TEXTURE(Texture, _c0103);
    _c0105 = TEX0.xy - 2.00000000E+00*_g1;
    _TMP15 = COMPAT_TEXTURE(Texture, _c0105);
    _c0107 = (TEX0.xy - 2.00000000E+00*_g1) - _g2;
    _TMP16 = COMPAT_TEXTURE(Texture, _c0107);
    _c0109 = TEX0.xy + 2.00000000E+00*_g1;
    _TMP17 = COMPAT_TEXTURE(Texture, _c0109);
    _c0111 = TEX0.xy + 2.00000000E+00*_g2;
    _TMP18 = COMPAT_TEXTURE(Texture, _c0111);
    _TMP116 = dot(_TMP1.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _TMP120 = dot(_TMP2.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _TMP124 = dot(_TMP3.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _TMP128 = dot(_TMP4.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _TMP132 = dot(_TMP5.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _TMP136 = dot(_TMP6.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _TMP140 = dot(_TMP7.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _TMP144 = dot(_TMP8.xyz, vec3( 6.55360000E+04, 2.55000000E+02, 1.00000000E+00));
    _fx_1 = _AO*_fp.y + _BO*_fp.x > _CO;
    _fx_2 = _AX*_fp.y + _BX*_fp.x > _CX;
    _fx_3 = _AY*_fp.y + _BY*_fp.x > _CY;
    _fx_4 = _BY*_fp.y + _AY*(1.00000000E+00 - _fp.x) > _CY;
    _fx_5 = _BX*(1.00000000E+00 - _fp.y) + _AX*_fp.x > _CX;
    _v0191 = _TMP4.xyz - _TMP2.xyz;
    _r0191.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0191);
    _r0191.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0191);
    _r0191.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0191);
    _TMP62 = abs(_r0191);
    _TMP19 = _TMP62.x;
    _v0203 = _TMP4.xyz - _TMP6.xyz;
    _r0203.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0203);
    _r0203.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0203);
    _r0203.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0203);
    _TMP62 = abs(_r0203);
    _TMP20 = _TMP62.x;
    _v0215 = _TMP8.xyz - _TMP15.xyz;
    _r0215.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0215);
    _r0215.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0215);
    _r0215.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0215);
    _TMP62 = abs(_r0215);
    _TMP21 = _TMP62.x;
    _v0227 = _TMP8.xyz - _TMP12.xyz;
    _r0227.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0227);
    _r0227.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0227);
    _r0227.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0227);
    _TMP62 = abs(_r0227);
    _TMP22 = _TMP62.x;
    _v0239 = _TMP7.xyz - _TMP5.xyz;
    _r0239.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0239);
    _r0239.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0239);
    _r0239.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0239);
    _TMP62 = abs(_r0239);
    _TMP23 = _TMP62.x;
    _v0251 = _TMP7.xyz - _TMP3.xyz;
    _r0251.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0251);
    _r0251.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0251);
    _r0251.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0251);
    _TMP62 = abs(_r0251);
    _TMP24 = _TMP62.x;
    _v0263 = _TMP7.xyz - _TMP16.xyz;
    _r0263.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0263);
    _r0263.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0263);
    _r0263.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0263);
    _TMP62 = abs(_r0263);
    _TMP25 = _TMP62.x;
    _v0275 = _TMP5.xyz - _TMP13.xyz;
    _r0275.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0275);
    _r0275.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0275);
    _r0275.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0275);
    _TMP62 = abs(_r0275);
    _TMP26 = _TMP62.x;
    _v0287 = _TMP5.xyz - _TMP1.xyz;
    _r0287.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0287);
    _r0287.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0287);
    _r0287.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0287);
    _TMP62 = abs(_r0287);
    _TMP27 = _TMP62.x;
    _v0299 = _TMP4.xyz - _TMP8.xyz;
    _r0299.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0299);
    _r0299.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0299);
    _r0299.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0299);
    _TMP62 = abs(_r0299);
    _e_i = _TMP19 + _TMP20 + _TMP21 + _TMP22 + 4.00000000E+00*_TMP23 < _TMP24 + _TMP25 + _TMP26 + _TMP27 + 4.00000000E+00*_TMP62.x;
    _v0311 = _TMP4.xyz - _TMP0.xyz;
    _r0311.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0311);
    _r0311.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0311);
    _r0311.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0311);
    _TMP62 = abs(_r0311);
    _TMP29 = _TMP62.x;
    _v0323 = _TMP4.xyz - _TMP8.xyz;
    _r0323.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0323);
    _r0323.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0323);
    _r0323.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0323);
    _TMP62 = abs(_r0323);
    _TMP30 = _TMP62.x;
    _v0335 = _TMP2.xyz - _TMP12.xyz;
    _r0335.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0335);
    _r0335.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0335);
    _r0335.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0335);
    _TMP62 = abs(_r0335);
    _TMP31 = _TMP62.x;
    _v0347 = _TMP2.xyz - _TMP17.xyz;
    _r0347.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0347);
    _r0347.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0347);
    _r0347.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0347);
    _TMP62 = abs(_r0347);
    _TMP32 = _TMP62.x;
    _v0359 = _TMP5.xyz - _TMP1.xyz;
    _r0359.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0359);
    _r0359.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0359);
    _r0359.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0359);
    _TMP62 = abs(_r0359);
    _TMP33 = _TMP62.x;
    _v0371 = _TMP5.xyz - _TMP7.xyz;
    _r0371.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0371);
    _r0371.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0371);
    _r0371.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0371);
    _TMP62 = abs(_r0371);
    _TMP34 = _TMP62.x;
    _v0383 = _TMP5.xyz - _TMP11.xyz;
    _r0383.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0383);
    _r0383.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0383);
    _r0383.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0383);
    _TMP62 = abs(_r0383);
    _TMP35 = _TMP62.x;
    _v0395 = _TMP1.xyz - _TMP9.xyz;
    _r0395.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0395);
    _r0395.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0395);
    _r0395.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0395);
    _TMP62 = abs(_r0395);
    _TMP36 = _TMP62.x;
    _v0407 = _TMP1.xyz - _TMP3.xyz;
    _r0407.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0407);
    _r0407.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0407);
    _r0407.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0407);
    _TMP62 = abs(_r0407);
    _TMP37 = _TMP62.x;
    _v0419 = _TMP4.xyz - _TMP2.xyz;
    _r0419.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0419);
    _r0419.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0419);
    _r0419.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0419);
    _TMP62 = abs(_r0419);
    _kei = _TMP29 + _TMP30 + _TMP31 + _TMP32 + 4.00000000E+00*_TMP33 < _TMP34 + _TMP35 + _TMP36 + _TMP37 + 4.00000000E+00*_TMP62.x;
    _v0431 = _TMP4.xyz - _TMP8.xyz;
    _r0431.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0431);
    _r0431.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0431);
    _r0431.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0431);
    _TMP62 = abs(_r0431);
    _TMP39 = _TMP62.x;
    _v0443 = _TMP4.xyz - _TMP0.xyz;
    _r0443.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0443);
    _r0443.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0443);
    _r0443.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0443);
    _TMP62 = abs(_r0443);
    _TMP40 = _TMP62.x;
    _v0455 = _TMP6.xyz - _TMP18.xyz;
    _r0455.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0455);
    _r0455.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0455);
    _r0455.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0455);
    _TMP62 = abs(_r0455);
    _TMP41 = _TMP62.x;
    _v0467 = _TMP6.xyz - _TMP15.xyz;
    _r0467.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0467);
    _r0467.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0467);
    _r0467.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0467);
    _TMP62 = abs(_r0467);
    _TMP42 = _TMP62.x;
    _v0479 = _TMP3.xyz - _TMP7.xyz;
    _r0479.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0479);
    _r0479.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0479);
    _r0479.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0479);
    _TMP62 = abs(_r0479);
    _TMP43 = _TMP62.x;
    _v0491 = _TMP3.xyz - _TMP1.xyz;
    _r0491.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0491);
    _r0491.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0491);
    _r0491.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0491);
    _TMP62 = abs(_r0491);
    _TMP44 = _TMP62.x;
    _v0503 = _TMP3.xyz - _TMP10.xyz;
    _r0503.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0503);
    _r0503.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0503);
    _r0503.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0503);
    _TMP62 = abs(_r0503);
    _TMP45 = _TMP62.x;
    _v0515 = _TMP7.xyz - _TMP14.xyz;
    _r0515.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0515);
    _r0515.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0515);
    _r0515.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0515);
    _TMP62 = abs(_r0515);
    _TMP46 = _TMP62.x;
    _v0527 = _TMP7.xyz - _TMP5.xyz;
    _r0527.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0527);
    _r0527.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0527);
    _r0527.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0527);
    _TMP62 = abs(_r0527);
    _TMP47 = _TMP62.x;
    _v0539 = _TMP4.xyz - _TMP6.xyz;
    _r0539.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0539);
    _r0539.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0539);
    _r0539.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0539);
    _TMP62 = abs(_r0539);
    _mei = _TMP39 + _TMP40 + _TMP41 + _TMP42 + 4.00000000E+00*_TMP43 < _TMP44 + _TMP45 + _TMP46 + _TMP47 + 4.00000000E+00*_TMP62.x;
    _v0551 = _TMP5.xyz - _TMP6.xyz;
    _r0551.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0551);
    _r0551.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0551);
    _r0551.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0551);
    _TMP62 = abs(_r0551);
    _ke = _TMP62.x;
    _v0563 = _TMP1.xyz - _TMP8.xyz;
    _r0563.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0563);
    _r0563.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0563);
    _r0563.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0563);
    _TMP62 = abs(_r0563);
    _kek = _TMP62.x;
    _v0575 = _TMP3.xyz - _TMP8.xyz;
    _r0575.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0575);
    _r0575.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0575);
    _r0575.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0575);
    _TMP62 = abs(_r0575);
    _kem = _TMP62.x;
    _v0587 = _TMP7.xyz - _TMP2.xyz;
    _r0587.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0587);
    _r0587.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0587);
    _r0587.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0587);
    _TMP62 = abs(_r0587);
    _ki = _TMP62.x;
    _v0599 = _TMP5.xyz - _TMP0.xyz;
    _r0599.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0599);
    _r0599.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0599);
    _r0599.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0599);
    _TMP62 = abs(_r0599);
    _kik = _TMP62.x;
    _v0611 = _TMP7.xyz - _TMP0.xyz;
    _r0611.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0611);
    _r0611.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0611);
    _r0611.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0611);
    _TMP62 = abs(_r0611);
    _kim = _TMP62.x;
    _ex2 = _TMP128 != _TMP136;
    _exkm = _TMP128 != _TMP144;
    _ex3 = _TMP128 != _TMP120;
    _v0623 = _TMP4.xyz - _TMP5.xyz;
    _r0623.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0623);
    _r0623.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0623);
    _r0623.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0623);
    _TMP62 = abs(_r0623);
    _TMP50 = _TMP62.x;
    _v0635 = _TMP4.xyz - _TMP7.xyz;
    _r0635.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0635);
    _r0635.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0635);
    _r0635.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0635);
    _TMP62 = abs(_r0635);
    if (_TMP50 <= _TMP62.x) { 
        _TMP49 = _TMP5.xyz;
    } else {
        _TMP49 = _TMP7.xyz;
    } 
    _v0647 = _TMP4.xyz - _TMP1.xyz;
    _r0647.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0647);
    _r0647.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0647);
    _r0647.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0647);
    _TMP62 = abs(_r0647);
    _TMP53 = _TMP62.x;
    _v0659 = _TMP4.xyz - _TMP5.xyz;
    _r0659.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0659);
    _r0659.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0659);
    _r0659.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0659);
    _TMP62 = abs(_r0659);
    if (_TMP53 <= _TMP62.x) { 
        _TMP52 = _TMP1.xyz;
    } else {
        _TMP52 = _TMP5.xyz;
    } 
    _v0671 = _TMP4.xyz - _TMP7.xyz;
    _r0671.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0671);
    _r0671.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0671);
    _r0671.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0671);
    _TMP62 = abs(_r0671);
    _TMP56 = _TMP62.x;
    _v0683 = _TMP4.xyz - _TMP3.xyz;
    _r0683.x = dot(vec3( 1.43520002E+01, 2.81760006E+01, 5.47200012E+00), _v0683);
    _r0683.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.50000000E+00), _v0683);
    _r0683.z = dot(vec3( 3.00000000E+00, -2.51399994E+00, -4.86000001E-01), _v0683);
    _TMP62 = abs(_r0683);
    if (_TMP56 <= _TMP62.x) { 
        _TMP55 = _TMP7.xyz;
    } else {
        _TMP55 = _TMP3.xyz;
    } 
    _ex = _TMP128 != _TMP132 || _TMP128 != _TMP140;
    _ex_ck = _TMP128 != _TMP116 || _TMP128 != _TMP132;
    _ex_em = _TMP128 != _TMP140 || _TMP128 != _TMP124;
    _r1 = _e_i && _ex && (_fx_1 || 2.50000000E+00*_ke <= _ki && _ex2 && _fx_2 || _ke >= 2.50000000E+00*_ki && _ex3 && _fx_3);
    _r2 = 2.50000000E+00*_kek <= _kik && _exkm && _fx_5 && _kei && _ex_ck;
    _r3 = 2.50000000E+00*_kem <= _kim && _exkm && _fx_4 && _mei && _ex_em;
    if (_r1) { 
        _TMP58 = _TMP49;
    } else {
        if (_r2) { 
            _TMP59 = _TMP52;
        } else {
            if (_r3) { 
                _TMP60 = _TMP55;
            } else {
                _TMP60 = _TMP4.xyz;
            } 
            _TMP59 = _TMP60;
        } 
        _TMP58 = _TMP59;
    } 
    _ret_0 = vec4(_TMP58.x, _TMP58.y, _TMP58.z, 1.00000000E+00);
    FragColor = _ret_0;
    return;
} 
#endif
