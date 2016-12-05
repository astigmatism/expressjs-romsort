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
COMPAT_VARYING     vec4 _t7;
COMPAT_VARYING     vec4 _t6;
COMPAT_VARYING     vec4 _t5;
COMPAT_VARYING     vec4 _t4;
COMPAT_VARYING     vec4 _t3;
COMPAT_VARYING     vec4 _t2;
COMPAT_VARYING     vec4 _t1;
COMPAT_VARYING     vec2 _texCoord2;
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
    vec2 _texCoord2;
    vec4 _t1;
    vec4 _t2;
    vec4 _t3;
    vec4 _t4;
    vec4 _t5;
    vec4 _t6;
    vec4 _t7;
};
out_vertex _ret_0;
input_dummy _IN1;
vec4 _r0007;
COMPAT_ATTRIBUTE vec4 VertexCoord;
COMPAT_ATTRIBUTE vec4 COLOR;
COMPAT_ATTRIBUTE vec4 TexCoord;
COMPAT_VARYING vec4 COL0;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
COMPAT_VARYING vec4 TEX2;
COMPAT_VARYING vec4 TEX3;
COMPAT_VARYING vec4 TEX4;
COMPAT_VARYING vec4 TEX5;
COMPAT_VARYING vec4 TEX6;
COMPAT_VARYING vec4 TEX7;
 
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
    vec2 _texCoord;
    _r0007 = VertexCoord.x*MVPMatrix[0];
    _r0007 = _r0007 + VertexCoord.y*MVPMatrix[1];
    _r0007 = _r0007 + VertexCoord.z*MVPMatrix[2];
    _r0007 = _r0007 + VertexCoord.w*MVPMatrix[3];
    _ps = vec2(1.00000000E+00/TextureSize.x, 1.00000000E+00/TextureSize.y);
    _texCoord = TexCoord.xy + vec2( 1.00000001E-07, 1.00000001E-07);
    _OUT._t1 = _texCoord.xxxy + vec4(-_ps.x, 0.00000000E+00, _ps.x, -2.00000000E+00*_ps.y);
    _OUT._t2 = _texCoord.xxxy + vec4(-_ps.x, 0.00000000E+00, _ps.x, -_ps.y);
    _OUT._t3 = _texCoord.xxxy + vec4(-_ps.x, 0.00000000E+00, _ps.x, 0.00000000E+00);
    _OUT._t4 = _texCoord.xxxy + vec4(-_ps.x, 0.00000000E+00, _ps.x, _ps.y);
    _OUT._t5 = _texCoord.xxxy + vec4(-_ps.x, 0.00000000E+00, _ps.x, 2.00000000E+00*_ps.y);
    _OUT._t6 = _texCoord.xyyy + vec4(-2.00000000E+00*_ps.x, -_ps.y, 0.00000000E+00, _ps.y);
    _OUT._t7 = _texCoord.xyyy + vec4(2.00000000E+00*_ps.x, -_ps.y, 0.00000000E+00, _ps.y);
    _ret_0._position1 = _r0007;
    _ret_0._color1 = COLOR;
    _ret_0._texCoord2 = _texCoord;
    _ret_0._t1 = _OUT._t1;
    _ret_0._t2 = _OUT._t2;
    _ret_0._t3 = _OUT._t3;
    _ret_0._t4 = _OUT._t4;
    _ret_0._t5 = _OUT._t5;
    _ret_0._t6 = _OUT._t6;
    _ret_0._t7 = _OUT._t7;
    gl_Position = _r0007;
    COL0 = COLOR;
    TEX0.xy = _texCoord;
    TEX1 = _OUT._t1;
    TEX2 = _OUT._t2;
    TEX3 = _OUT._t3;
    TEX4 = _OUT._t4;
    TEX5 = _OUT._t5;
    TEX6 = _OUT._t6;
    TEX7 = _OUT._t7;
    return;
    COL0 = _ret_0._color1;
    TEX0.xy = _ret_0._texCoord2;
    TEX1 = _ret_0._t1;
    TEX2 = _ret_0._t2;
    TEX3 = _ret_0._t3;
    TEX4 = _ret_0._t4;
    TEX5 = _ret_0._t5;
    TEX6 = _ret_0._t6;
    TEX7 = _ret_0._t7;
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
COMPAT_VARYING     vec4 _t7;
COMPAT_VARYING     vec4 _t6;
COMPAT_VARYING     vec4 _t5;
COMPAT_VARYING     vec4 _t4;
COMPAT_VARYING     vec4 _t3;
COMPAT_VARYING     vec4 _t2;
COMPAT_VARYING     vec4 _t1;
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
    vec4 _t1;
    vec4 _t2;
    vec4 _t3;
    vec4 _t4;
    vec4 _t5;
    vec4 _t6;
    vec4 _t7;
};
vec4 _ret_0;
float _TMP53;
vec3 _TMP46;
vec3 _TMP48;
vec3 _TMP50;
vec3 _TMP51;
vec3 _TMP49;
vec3 _TMP47;
vec3 _TMP40;
vec3 _TMP42;
vec3 _TMP44;
vec3 _TMP45;
vec3 _TMP43;
vec3 _TMP41;
vec4 _TMP33;
vec4 _TMP32;
bvec4 _TMP31;
bvec4 _TMP30;
bvec4 _TMP29;
bvec4 _TMP28;
bvec4 _TMP27;
bvec4 _TMP26;
bvec4 _TMP25;
bvec4 _TMP24;
bvec4 _TMP23;
bvec4 _TMP22;
bvec4 _TMP21;
vec4 _TMP20;
vec4 _TMP19;
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
vec2 _x0073;
vec4 _r0117;
vec4 _r0127;
vec4 _r0137;
vec4 _r0147;
vec4 _r0157;
vec4 _r0167;
vec4 _TMP178;
vec4 _a0181;
vec4 _TMP184;
vec4 _a0187;
vec4 _TMP190;
vec4 _a0193;
vec4 _TMP196;
vec4 _a0199;
vec4 _TMP202;
vec4 _a0205;
vec4 _TMP208;
vec4 _a0211;
vec4 _TMP214;
vec4 _a0217;
vec4 _TMP220;
vec4 _a0223;
vec4 _TMP226;
vec4 _a0229;
vec4 _TMP232;
vec4 _a0235;
vec4 _TMP238;
vec4 _a0241;
vec4 _TMP244;
vec4 _a0247;
vec4 _TMP248;
vec4 _a0251;
vec4 _TMP252;
vec4 _a0255;
vec4 _TMP256;
vec4 _a0259;
vec4 _TMP260;
vec4 _a0263;
vec4 _TMP266;
vec4 _a0269;
vec4 _TMP270;
vec4 _a0273;
vec4 _TMP274;
vec4 _a0277;
vec4 _TMP278;
vec4 _a0281;
vec4 _TMP282;
vec4 _a0285;
vec4 _TMP286;
vec4 _a0289;
vec4 _TMP290;
vec4 _a0293;
vec4 _TMP294;
vec4 _a0297;
vec4 _TMP298;
vec4 _a0301;
vec4 _TMP302;
vec4 _a0305;
vec4 _TMP306;
vec4 _a0309;
vec2 _r0311;
vec2 _a0317;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
COMPAT_VARYING vec4 TEX2;
COMPAT_VARYING vec4 TEX3;
COMPAT_VARYING vec4 TEX4;
COMPAT_VARYING vec4 TEX5;
COMPAT_VARYING vec4 TEX6;
COMPAT_VARYING vec4 TEX7;
 
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    bvec4 _edr;
    bvec4 _edr_left;
    bvec4 _edr_up;
    bvec4 _px;
    bvec4 _interp_restriction_lv1;
    bvec4 _interp_restriction_lv2_left;
    bvec4 _interp_restriction_lv2_up;
    bvec4 _nc;
    bvec4 _fx;
    bvec4 _fx_left;
    bvec4 _fx_up;
    vec2 _fp;
    vec2 _df12;
    vec3 _res;
    _x0073 = TEX0.xy*TextureSize;
    _fp = fract(_x0073);
    _TMP0 = COMPAT_TEXTURE(Texture, TEX1.xw);
    _TMP1 = COMPAT_TEXTURE(Texture, TEX1.yw);
    _TMP2 = COMPAT_TEXTURE(Texture, TEX1.zw);
    _TMP3 = COMPAT_TEXTURE(Texture, TEX2.xw);
    _TMP4 = COMPAT_TEXTURE(Texture, TEX2.yw);
    _TMP5 = COMPAT_TEXTURE(Texture, TEX2.zw);
    _TMP6 = COMPAT_TEXTURE(Texture, TEX3.xw);
    _TMP7 = COMPAT_TEXTURE(Texture, TEX3.yw);
    _TMP8 = COMPAT_TEXTURE(Texture, TEX3.zw);
    _TMP9 = COMPAT_TEXTURE(Texture, TEX4.xw);
    _TMP10 = COMPAT_TEXTURE(Texture, TEX4.yw);
    _TMP11 = COMPAT_TEXTURE(Texture, TEX4.zw);
    _TMP12 = COMPAT_TEXTURE(Texture, TEX5.xw);
    _TMP13 = COMPAT_TEXTURE(Texture, TEX5.yw);
    _TMP14 = COMPAT_TEXTURE(Texture, TEX5.zw);
    _TMP15 = COMPAT_TEXTURE(Texture, TEX6.xy);
    _TMP16 = COMPAT_TEXTURE(Texture, TEX6.xz);
    _TMP17 = COMPAT_TEXTURE(Texture, TEX6.xw);
    _TMP18 = COMPAT_TEXTURE(Texture, TEX7.xy);
    _TMP19 = COMPAT_TEXTURE(Texture, TEX7.xz);
    _TMP20 = COMPAT_TEXTURE(Texture, TEX7.xw);
    _r0117.x = dot(_TMP4.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0117.y = dot(_TMP6.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0117.z = dot(_TMP10.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0117.w = dot(_TMP8.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0127.x = dot(_TMP5.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0127.y = dot(_TMP3.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0127.z = dot(_TMP9.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0127.w = dot(_TMP11.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0137.x = dot(_TMP7.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0137.y = dot(_TMP7.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0137.z = dot(_TMP7.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0137.w = dot(_TMP7.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0147.x = dot(_TMP20.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0147.y = dot(_TMP2.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0147.z = dot(_TMP15.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0147.w = dot(_TMP12.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0157.x = dot(_TMP14.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0157.y = dot(_TMP18.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0157.z = dot(_TMP0.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0157.w = dot(_TMP17.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0167.x = dot(_TMP13.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0167.y = dot(_TMP19.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0167.z = dot(_TMP1.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0167.w = dot(_TMP16.xyz, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _fx = bvec4((vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 1.00000000E+00, 1.00000000E+00, -1.00000000E+00, -1.00000000E+00)*_fp.x).x > 1.50000000E+00, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 1.00000000E+00, 1.00000000E+00, -1.00000000E+00, -1.00000000E+00)*_fp.x).y > 5.00000000E-01, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 1.00000000E+00, 1.00000000E+00, -1.00000000E+00, -1.00000000E+00)*_fp.x).z > -5.00000000E-01, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 1.00000000E+00, 1.00000000E+00, -1.00000000E+00, -1.00000000E+00)*_fp.x).w > 5.00000000E-01);
    _fx_left = bvec4((vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 5.00000000E-01, 2.00000000E+00, -5.00000000E-01, -2.00000000E+00)*_fp.x).x > 1.00000000E+00, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 5.00000000E-01, 2.00000000E+00, -5.00000000E-01, -2.00000000E+00)*_fp.x).y > 1.00000000E+00, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 5.00000000E-01, 2.00000000E+00, -5.00000000E-01, -2.00000000E+00)*_fp.x).z > -5.00000000E-01, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 5.00000000E-01, 2.00000000E+00, -5.00000000E-01, -2.00000000E+00)*_fp.x).w > 0.00000000E+00);
    _fx_up = bvec4((vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 2.00000000E+00, 5.00000000E-01, -2.00000000E+00, -5.00000000E-01)*_fp.x).x > 2.00000000E+00, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 2.00000000E+00, 5.00000000E-01, -2.00000000E+00, -5.00000000E-01)*_fp.x).y > 0.00000000E+00, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 2.00000000E+00, 5.00000000E-01, -2.00000000E+00, -5.00000000E-01)*_fp.x).z > -1.00000000E+00, (vec4( 1.00000000E+00, -1.00000000E+00, -1.00000000E+00, 1.00000000E+00)*_fp.y + vec4( 2.00000000E+00, 5.00000000E-01, -2.00000000E+00, -5.00000000E-01)*_fp.x).w > 5.00000000E-01);
    _a0181 = _r0117.wxyz - _r0117;
    _TMP178 = abs(_a0181);
    _TMP21 = bvec4(_TMP178.x < 1.50000000E+01, _TMP178.y < 1.50000000E+01, _TMP178.z < 1.50000000E+01, _TMP178.w < 1.50000000E+01);
    _a0187 = _r0117.wxyz - _r0127;
    _TMP184 = abs(_a0187);
    _TMP22 = bvec4(_TMP184.x < 1.50000000E+01, _TMP184.y < 1.50000000E+01, _TMP184.z < 1.50000000E+01, _TMP184.w < 1.50000000E+01);
    _a0193 = _r0117.zwxy - _r0117.yzwx;
    _TMP190 = abs(_a0193);
    _TMP23 = bvec4(_TMP190.x < 1.50000000E+01, _TMP190.y < 1.50000000E+01, _TMP190.z < 1.50000000E+01, _TMP190.w < 1.50000000E+01);
    _a0199 = _r0117.zwxy - _r0127.zwxy;
    _TMP196 = abs(_a0199);
    _TMP24 = bvec4(_TMP196.x < 1.50000000E+01, _TMP196.y < 1.50000000E+01, _TMP196.z < 1.50000000E+01, _TMP196.w < 1.50000000E+01);
    _a0205 = _r0137 - _r0127.wxyz;
    _TMP202 = abs(_a0205);
    _TMP25 = bvec4(_TMP202.x < 1.50000000E+01, _TMP202.y < 1.50000000E+01, _TMP202.z < 1.50000000E+01, _TMP202.w < 1.50000000E+01);
    _a0211 = _r0117.wxyz - _r0167.yzwx;
    _TMP208 = abs(_a0211);
    _TMP26 = bvec4(_TMP208.x < 1.50000000E+01, _TMP208.y < 1.50000000E+01, _TMP208.z < 1.50000000E+01, _TMP208.w < 1.50000000E+01);
    _a0217 = _r0117.wxyz - _r0147;
    _TMP214 = abs(_a0217);
    _TMP27 = bvec4(_TMP214.x < 1.50000000E+01, _TMP214.y < 1.50000000E+01, _TMP214.z < 1.50000000E+01, _TMP214.w < 1.50000000E+01);
    _a0223 = _r0117.zwxy - _r0167;
    _TMP220 = abs(_a0223);
    _TMP28 = bvec4(_TMP220.x < 1.50000000E+01, _TMP220.y < 1.50000000E+01, _TMP220.z < 1.50000000E+01, _TMP220.w < 1.50000000E+01);
    _a0229 = _r0117.zwxy - _r0157;
    _TMP226 = abs(_a0229);
    _TMP29 = bvec4(_TMP226.x < 1.50000000E+01, _TMP226.y < 1.50000000E+01, _TMP226.z < 1.50000000E+01, _TMP226.w < 1.50000000E+01);
    _a0235 = _r0137 - _r0127.zwxy;
    _TMP232 = abs(_a0235);
    _TMP30 = bvec4(_TMP232.x < 1.50000000E+01, _TMP232.y < 1.50000000E+01, _TMP232.z < 1.50000000E+01, _TMP232.w < 1.50000000E+01);
    _a0241 = _r0137 - _r0127;
    _TMP238 = abs(_a0241);
    _TMP31 = bvec4(_TMP238.x < 1.50000000E+01, _TMP238.y < 1.50000000E+01, _TMP238.z < 1.50000000E+01, _TMP238.w < 1.50000000E+01);
    _interp_restriction_lv1 = bvec4(_r0137.x != _r0117.w && _r0137.x != _r0117.z && (!_TMP21.x && !_TMP22.x || !_TMP23.x && !_TMP24.x || _TMP25.x && (!_TMP26.x && !_TMP27.x || !_TMP28.x && !_TMP29.x) || _TMP30.x || _TMP31.x), _r0137.y != _r0117.x && _r0137.y != _r0117.w && (!_TMP21.y && !_TMP22.y || !_TMP23.y && !_TMP24.y || _TMP25.y && (!_TMP26.y && !_TMP27.y || !_TMP28.y && !_TMP29.y) || _TMP30.y || _TMP31.y), _r0137.z != _r0117.y && _r0137.z != _r0117.x && (!_TMP21.z && !_TMP22.z || !_TMP23.z && !_TMP24.z || _TMP25.z && (!_TMP26.z && !_TMP27.z || !_TMP28.z && !_TMP29.z) || _TMP30.z || _TMP31.z), _r0137.w != _r0117.z && _r0137.w != _r0117.y && (!_TMP21.w && !_TMP22.w || !_TMP23.w && !_TMP24.w || _TMP25.w && (!_TMP26.w && !_TMP27.w || !_TMP28.w && !_TMP29.w) || _TMP30.w || _TMP31.w));
    _interp_restriction_lv2_left = bvec4(_r0137.x != _r0127.z && _r0117.y != _r0127.z, _r0137.y != _r0127.w && _r0117.z != _r0127.w, _r0137.z != _r0127.x && _r0117.w != _r0127.x, _r0137.w != _r0127.y && _r0117.x != _r0127.y);
    _interp_restriction_lv2_up = bvec4(_r0137.x != _r0127.x && _r0117.x != _r0127.x, _r0137.y != _r0127.y && _r0117.y != _r0127.y, _r0137.z != _r0127.z && _r0117.z != _r0127.z, _r0137.w != _r0127.w && _r0117.w != _r0127.w);
    _a0247 = _r0137 - _r0127;
    _TMP244 = abs(_a0247);
    _a0251 = _r0137 - _r0127.zwxy;
    _TMP248 = abs(_a0251);
    _a0255 = _r0127.wxyz - _r0167;
    _TMP252 = abs(_a0255);
    _a0259 = _r0127.wxyz - _r0167.yzwx;
    _TMP256 = abs(_a0259);
    _a0263 = _r0117.zwxy - _r0117.wxyz;
    _TMP260 = abs(_a0263);
    _TMP32 = _TMP244 + _TMP248 + _TMP252 + _TMP256 + 4.00000000E+00*_TMP260;
    _a0269 = _r0117.zwxy - _r0117.yzwx;
    _TMP266 = abs(_a0269);
    _a0273 = _r0117.zwxy - _r0157;
    _TMP270 = abs(_a0273);
    _a0277 = _r0117.wxyz - _r0147;
    _TMP274 = abs(_a0277);
    _a0281 = _r0117.wxyz - _r0117;
    _TMP278 = abs(_a0281);
    _a0285 = _r0137 - _r0127.wxyz;
    _TMP282 = abs(_a0285);
    _TMP33 = _TMP266 + _TMP270 + _TMP274 + _TMP278 + 4.00000000E+00*_TMP282;
    _edr = bvec4(_TMP32.x < _TMP33.x && _interp_restriction_lv1.x, _TMP32.y < _TMP33.y && _interp_restriction_lv1.y, _TMP32.z < _TMP33.z && _interp_restriction_lv1.z, _TMP32.w < _TMP33.w && _interp_restriction_lv1.w);
    _a0289 = _r0117.wxyz - _r0127.zwxy;
    _TMP286 = abs(_a0289);
    _a0293 = _r0117.zwxy - _r0127;
    _TMP290 = abs(_a0293);
    _edr_left = bvec4((2.00000000E+00*_TMP286).x <= _TMP290.x && _interp_restriction_lv2_left.x, (2.00000000E+00*_TMP286).y <= _TMP290.y && _interp_restriction_lv2_left.y, (2.00000000E+00*_TMP286).z <= _TMP290.z && _interp_restriction_lv2_left.z, (2.00000000E+00*_TMP286).w <= _TMP290.w && _interp_restriction_lv2_left.w);
    _a0297 = _r0117.wxyz - _r0127.zwxy;
    _TMP294 = abs(_a0297);
    _a0301 = _r0117.zwxy - _r0127;
    _TMP298 = abs(_a0301);
    _edr_up = bvec4(_TMP294.x >= (2.00000000E+00*_TMP298).x && _interp_restriction_lv2_up.x, _TMP294.y >= (2.00000000E+00*_TMP298).y && _interp_restriction_lv2_up.y, _TMP294.z >= (2.00000000E+00*_TMP298).z && _interp_restriction_lv2_up.z, _TMP294.w >= (2.00000000E+00*_TMP298).w && _interp_restriction_lv2_up.w);
    _nc = bvec4(_edr.x && (_fx.x || _edr_left.x && _fx_left.x || _edr_up.x && _fx_up.x), _edr.y && (_fx.y || _edr_left.y && _fx_left.y || _edr_up.y && _fx_up.y), _edr.z && (_fx.z || _edr_left.z && _fx_left.z || _edr_up.z && _fx_up.z), _edr.w && (_fx.w || _edr_left.w && _fx_left.w || _edr_up.w && _fx_up.w));
    _a0305 = _r0137 - _r0117.wxyz;
    _TMP302 = abs(_a0305);
    _a0309 = _r0137 - _r0117.zwxy;
    _TMP306 = abs(_a0309);
    _px = bvec4(_TMP302.x <= _TMP306.x, _TMP302.y <= _TMP306.y, _TMP302.z <= _TMP306.z, _TMP302.w <= _TMP306.w);
    if (_nc.x) { 
        if (_px.x) { 
            _TMP41 = _TMP8.xyz;
        } else {
            _TMP41 = _TMP10.xyz;
        } 
        _TMP40 = _TMP41;
    } else {
        if (_nc.y) { 
            if (_px.y) { 
                _TMP43 = _TMP4.xyz;
            } else {
                _TMP43 = _TMP8.xyz;
            } 
            _TMP42 = _TMP43;
        } else {
            if (_nc.z) { 
                if (_px.z) { 
                    _TMP45 = _TMP6.xyz;
                } else {
                    _TMP45 = _TMP4.xyz;
                } 
                _TMP44 = _TMP45;
            } else {
                _TMP44 = _TMP7.xyz;
            } 
            _TMP42 = _TMP44;
        } 
        _TMP40 = _TMP42;
    } 
    if (_nc.w) { 
        if (_px.w) { 
            _TMP47 = _TMP10.xyz;
        } else {
            _TMP47 = _TMP6.xyz;
        } 
        _TMP46 = _TMP47;
    } else {
        if (_nc.z) { 
            if (_px.z) { 
                _TMP49 = _TMP6.xyz;
            } else {
                _TMP49 = _TMP4.xyz;
            } 
            _TMP48 = _TMP49;
        } else {
            if (_nc.y) { 
                if (_px.y) { 
                    _TMP51 = _TMP4.xyz;
                } else {
                    _TMP51 = _TMP8.xyz;
                } 
                _TMP50 = _TMP51;
            } else {
                _TMP50 = _TMP7.xyz;
            } 
            _TMP48 = _TMP50;
        } 
        _TMP46 = _TMP48;
    } 
    _r0311.x = dot(_TMP40, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _r0311.y = dot(_TMP46, vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00));
    _a0317 = _r0311 - _r0137.xy;
    _df12 = abs(_a0317);
    _TMP53 = float((_df12.y >= _df12.x));
    _res = _TMP40 + _TMP53*(_TMP46 - _TMP40);
    _ret_0 = vec4(_res.x, _res.y, _res.z, 1.00000000E+00);
    FragColor = _ret_0;
    return;
} 
#endif
