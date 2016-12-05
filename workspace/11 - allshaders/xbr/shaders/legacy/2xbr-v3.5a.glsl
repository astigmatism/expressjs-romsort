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
    vec2 _texCoord1;
    vec4 _t1;
};
out_vertex _ret_0;
input_dummy _IN1;
vec4 _r0008;
COMPAT_ATTRIBUTE vec4 VertexCoord;
COMPAT_ATTRIBUTE vec4 TexCoord;
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
    _OUT._t1.xy = vec2(_ps.x, 0.00000000E+00);
    _OUT._t1.zw = vec2(0.00000000E+00, _ps.y);
    _ret_0._position1 = _r0008;
    _ret_0._texCoord1 = TexCoord.xy;
    _ret_0._t1 = _OUT._t1;
    gl_Position = _r0008;
    TEX0.xy = TexCoord.xy;
    TEX1 = _OUT._t1;
    return;
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
    vec2 _texCoord;
    vec4 _t1;
};
vec4 _ret_0;
vec3 _TMP33;
vec3 _TMP35;
vec3 _TMP34;
vec3 _TMP32;
vec3 _TMP31;
vec3 _TMP30;
vec3 _TMP29;
vec4 _TMP22;
vec4 _TMP21;
vec3 _TMP43;
vec3 _TMP41;
vec3 _TMP39;
vec3 _TMP37;
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
vec2 _x0081;
vec2 _c0083;
vec2 _c0085;
vec2 _c0087;
vec2 _c0089;
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
vec2 _c0113;
vec2 _c0115;
vec2 _c0117;
vec2 _c0119;
vec2 _c0121;
vec2 _c0123;
vec3 _r0169;
vec3 _r0179;
vec3 _r0189;
vec3 _r0199;
vec3 _r0211;
vec3 _r0221;
vec3 _r0231;
vec3 _r0241;
vec3 _r0253;
vec3 _r0263;
vec3 _r0273;
vec3 _r0283;
vec3 _r0295;
vec3 _r0305;
vec3 _r0315;
vec3 _r0325;
vec3 _r0337;
vec3 _r0347;
vec3 _r0357;
vec3 _r0367;
vec3 _r0379;
vec3 _r0389;
vec3 _r0399;
vec3 _r0409;
vec3 _r0421;
vec3 _r0431;
vec3 _r0441;
vec3 _r0451;
vec3 _r0463;
vec3 _r0473;
vec3 _r0483;
vec3 _r0493;
vec3 _r0715;
vec3 _r0725;
vec3 _r0735;
vec3 _r0745;
vec3 _r0799;
vec3 _r0809;
vec3 _r0819;
vec3 _r0829;
vec3 _r0925;
vec3 _r0935;
vec3 _r0945;
vec3 _r0955;
vec3 _r0967;
vec3 _r0977;
vec3 _r0987;
vec3 _r0997;
vec4 _TMP1008;
vec4 _a1011;
vec4 _TMP1012;
vec4 _a1015;
vec4 _TMP1016;
vec4 _a1019;
vec4 _TMP1020;
vec4 _a1023;
vec4 _TMP1024;
vec4 _a1027;
vec4 _TMP1030;
vec4 _a1033;
vec4 _TMP1034;
vec4 _a1037;
vec4 _TMP1038;
vec4 _a1041;
vec4 _TMP1042;
vec4 _a1045;
vec4 _TMP1046;
vec4 _a1049;
vec4 _TMP1050;
vec4 _a1053;
vec4 _TMP1054;
vec4 _a1057;
vec4 _TMP1058;
vec4 _a1061;
vec4 _TMP1062;
vec4 _a1065;
vec4 _TMP1066;
vec4 _a1069;
vec4 _TMP1070;
vec4 _a1073;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
 
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
    vec2 _fp;
    vec4 _b2;
    vec4 _c2;
    vec4 _d2;
    vec4 _e1;
    vec4 _f1;
    vec4 _g1;
    vec4 _h1;
    vec4 _i;
    vec4 _i4;
    vec4 _i5;
    vec4 _h5;
    vec4 _f4;
    vec3 _E0;
    vec3 _E1;
    vec3 _E2;
    vec3 _E3;
    _x0081 = TEX0.xy*TextureSize;
    _fp = fract(_x0081);
    _c0083 = (TEX0.xy - TEX1.xy) - TEX1.zw;
    _TMP0 = COMPAT_TEXTURE(Texture, _c0083);
    _c0085 = TEX0.xy - TEX1.zw;
    _TMP1 = COMPAT_TEXTURE(Texture, _c0085);
    _c0087 = (TEX0.xy + TEX1.xy) - TEX1.zw;
    _TMP2 = COMPAT_TEXTURE(Texture, _c0087);
    _c0089 = TEX0.xy - TEX1.xy;
    _TMP3 = COMPAT_TEXTURE(Texture, _c0089);
    _TMP4 = COMPAT_TEXTURE(Texture, TEX0.xy);
    _c0093 = TEX0.xy + TEX1.xy;
    _TMP5 = COMPAT_TEXTURE(Texture, _c0093);
    _c0095 = (TEX0.xy - TEX1.xy) + TEX1.zw;
    _TMP6 = COMPAT_TEXTURE(Texture, _c0095);
    _c0097 = TEX0.xy + TEX1.zw;
    _TMP7 = COMPAT_TEXTURE(Texture, _c0097);
    _c0099 = TEX0.xy + TEX1.xy + TEX1.zw;
    _TMP8 = COMPAT_TEXTURE(Texture, _c0099);
    _c0101 = (TEX0.xy - TEX1.xy) - 2.00000000E+00*TEX1.zw;
    _TMP9 = COMPAT_TEXTURE(Texture, _c0101);
    _c0103 = (TEX0.xy + TEX1.xy) - 2.00000000E+00*TEX1.zw;
    _TMP10 = COMPAT_TEXTURE(Texture, _c0103);
    _c0105 = (TEX0.xy - 2.00000000E+00*TEX1.xy) - TEX1.zw;
    _TMP11 = COMPAT_TEXTURE(Texture, _c0105);
    _c0107 = (TEX0.xy - 2.00000000E+00*TEX1.xy) + TEX1.zw;
    _TMP12 = COMPAT_TEXTURE(Texture, _c0107);
    _c0109 = (TEX0.xy + 2.00000000E+00*TEX1.xy) - TEX1.zw;
    _TMP13 = COMPAT_TEXTURE(Texture, _c0109);
    _c0111 = TEX0.xy + 2.00000000E+00*TEX1.xy + TEX1.zw;
    _TMP14 = COMPAT_TEXTURE(Texture, _c0111);
    _c0113 = (TEX0.xy - TEX1.xy) + 2.00000000E+00*TEX1.zw;
    _TMP15 = COMPAT_TEXTURE(Texture, _c0113);
    _c0115 = TEX0.xy + TEX1.xy + 2.00000000E+00*TEX1.zw;
    _TMP16 = COMPAT_TEXTURE(Texture, _c0115);
    _c0117 = TEX0.xy - 2.00000000E+00*TEX1.zw;
    _TMP17 = COMPAT_TEXTURE(Texture, _c0117);
    _c0119 = TEX0.xy - 2.00000000E+00*TEX1.xy;
    _TMP18 = COMPAT_TEXTURE(Texture, _c0119);
    _c0121 = TEX0.xy + 2.00000000E+00*TEX1.zw;
    _TMP19 = COMPAT_TEXTURE(Texture, _c0121);
    _c0123 = TEX0.xy + 2.00000000E+00*TEX1.xy;
    _TMP20 = COMPAT_TEXTURE(Texture, _c0123);
    _r0169.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP1.xyz);
    _r0169.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP1.xyz);
    _r0169.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP1.xyz);
    _TMP37 = abs(_r0169);
    _r0179.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP3.xyz);
    _r0179.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP3.xyz);
    _r0179.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP3.xyz);
    _TMP39 = abs(_r0179);
    _r0189.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP7.xyz);
    _r0189.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP7.xyz);
    _r0189.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP7.xyz);
    _TMP41 = abs(_r0189);
    _r0199.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP5.xyz);
    _r0199.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP5.xyz);
    _r0199.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP5.xyz);
    _TMP43 = abs(_r0199);
    _b2 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0211.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP2.xyz);
    _r0211.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP2.xyz);
    _r0211.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP2.xyz);
    _TMP37 = abs(_r0211);
    _r0221.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP0.xyz);
    _r0221.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP0.xyz);
    _r0221.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP0.xyz);
    _TMP39 = abs(_r0221);
    _r0231.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP6.xyz);
    _r0231.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP6.xyz);
    _r0231.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP6.xyz);
    _TMP41 = abs(_r0231);
    _r0241.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP8.xyz);
    _r0241.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP8.xyz);
    _r0241.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP8.xyz);
    _TMP43 = abs(_r0241);
    _c2 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0253.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP3.xyz);
    _r0253.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP3.xyz);
    _r0253.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP3.xyz);
    _TMP37 = abs(_r0253);
    _r0263.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP7.xyz);
    _r0263.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP7.xyz);
    _r0263.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP7.xyz);
    _TMP39 = abs(_r0263);
    _r0273.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP5.xyz);
    _r0273.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP5.xyz);
    _r0273.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP5.xyz);
    _TMP41 = abs(_r0273);
    _r0283.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP1.xyz);
    _r0283.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP1.xyz);
    _r0283.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP1.xyz);
    _TMP43 = abs(_r0283);
    _d2 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0295.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP4.xyz);
    _r0295.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP4.xyz);
    _r0295.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP4.xyz);
    _TMP37 = abs(_r0295);
    _r0305.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP4.xyz);
    _r0305.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP4.xyz);
    _r0305.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP4.xyz);
    _TMP39 = abs(_r0305);
    _r0315.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP4.xyz);
    _r0315.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP4.xyz);
    _r0315.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP4.xyz);
    _TMP41 = abs(_r0315);
    _r0325.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP4.xyz);
    _r0325.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP4.xyz);
    _r0325.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP4.xyz);
    _TMP43 = abs(_r0325);
    _e1 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0337.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP5.xyz);
    _r0337.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP5.xyz);
    _r0337.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP5.xyz);
    _TMP37 = abs(_r0337);
    _r0347.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP1.xyz);
    _r0347.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP1.xyz);
    _r0347.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP1.xyz);
    _TMP39 = abs(_r0347);
    _r0357.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP3.xyz);
    _r0357.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP3.xyz);
    _r0357.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP3.xyz);
    _TMP41 = abs(_r0357);
    _r0367.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP7.xyz);
    _r0367.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP7.xyz);
    _r0367.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP7.xyz);
    _TMP43 = abs(_r0367);
    _f1 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0379.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP6.xyz);
    _r0379.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP6.xyz);
    _r0379.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP6.xyz);
    _TMP37 = abs(_r0379);
    _r0389.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP8.xyz);
    _r0389.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP8.xyz);
    _r0389.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP8.xyz);
    _TMP39 = abs(_r0389);
    _r0399.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP2.xyz);
    _r0399.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP2.xyz);
    _r0399.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP2.xyz);
    _TMP41 = abs(_r0399);
    _r0409.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP0.xyz);
    _r0409.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP0.xyz);
    _r0409.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP0.xyz);
    _TMP43 = abs(_r0409);
    _g1 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0421.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP7.xyz);
    _r0421.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP7.xyz);
    _r0421.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP7.xyz);
    _TMP37 = abs(_r0421);
    _r0431.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP5.xyz);
    _r0431.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP5.xyz);
    _r0431.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP5.xyz);
    _TMP39 = abs(_r0431);
    _r0441.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP1.xyz);
    _r0441.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP1.xyz);
    _r0441.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP1.xyz);
    _TMP41 = abs(_r0441);
    _r0451.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP3.xyz);
    _r0451.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP3.xyz);
    _r0451.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP3.xyz);
    _TMP43 = abs(_r0451);
    _h1 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0463.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP8.xyz);
    _r0463.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP8.xyz);
    _r0463.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP8.xyz);
    _TMP37 = abs(_r0463);
    _r0473.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP2.xyz);
    _r0473.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP2.xyz);
    _r0473.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP2.xyz);
    _TMP39 = abs(_r0473);
    _r0483.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP0.xyz);
    _r0483.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP0.xyz);
    _r0483.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP0.xyz);
    _TMP41 = abs(_r0483);
    _r0493.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP6.xyz);
    _r0493.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP6.xyz);
    _r0493.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP6.xyz);
    _TMP43 = abs(_r0493);
    _i = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0715.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP14.xyz);
    _r0715.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP14.xyz);
    _r0715.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP14.xyz);
    _TMP37 = abs(_r0715);
    _r0725.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP10.xyz);
    _r0725.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP10.xyz);
    _r0725.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP10.xyz);
    _TMP39 = abs(_r0725);
    _r0735.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP11.xyz);
    _r0735.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP11.xyz);
    _r0735.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP11.xyz);
    _TMP41 = abs(_r0735);
    _r0745.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP15.xyz);
    _r0745.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP15.xyz);
    _r0745.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP15.xyz);
    _TMP43 = abs(_r0745);
    _i4 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0799.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP16.xyz);
    _r0799.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP16.xyz);
    _r0799.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP16.xyz);
    _TMP37 = abs(_r0799);
    _r0809.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP13.xyz);
    _r0809.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP13.xyz);
    _r0809.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP13.xyz);
    _TMP39 = abs(_r0809);
    _r0819.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP9.xyz);
    _r0819.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP9.xyz);
    _r0819.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP9.xyz);
    _TMP41 = abs(_r0819);
    _r0829.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP12.xyz);
    _r0829.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP12.xyz);
    _r0829.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP12.xyz);
    _TMP43 = abs(_r0829);
    _i5 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0925.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP19.xyz);
    _r0925.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP19.xyz);
    _r0925.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP19.xyz);
    _TMP37 = abs(_r0925);
    _r0935.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP20.xyz);
    _r0935.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP20.xyz);
    _r0935.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP20.xyz);
    _TMP39 = abs(_r0935);
    _r0945.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP17.xyz);
    _r0945.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP17.xyz);
    _r0945.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP17.xyz);
    _TMP41 = abs(_r0945);
    _r0955.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP18.xyz);
    _r0955.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP18.xyz);
    _r0955.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP18.xyz);
    _TMP43 = abs(_r0955);
    _h5 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _r0967.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP20.xyz);
    _r0967.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP20.xyz);
    _r0967.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP20.xyz);
    _TMP37 = abs(_r0967);
    _r0977.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP17.xyz);
    _r0977.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP17.xyz);
    _r0977.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP17.xyz);
    _TMP39 = abs(_r0977);
    _r0987.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP18.xyz);
    _r0987.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP18.xyz);
    _r0987.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP18.xyz);
    _TMP41 = abs(_r0987);
    _r0997.x = dot(vec3( 1.43519993E+01, 2.81760006E+01, 5.47200012E+00), _TMP19.xyz);
    _r0997.y = dot(vec3( -1.18299997E+00, -2.31699991E+00, 3.49300003E+00), _TMP19.xyz);
    _r0997.z = dot(vec3( 2.99399996E+00, -2.50800014E+00, -4.87800002E-01), _TMP19.xyz);
    _TMP43 = abs(_r0997);
    _f4 = vec4(_TMP37.x, _TMP39.x, _TMP41.x, _TMP43.x);
    _interp_restriction_lv1 = bvec4(_e1.x != _f1.x && _e1.x != _h1.x, _e1.y != _f1.y && _e1.y != _h1.y, _e1.z != _f1.z && _e1.z != _h1.z, _e1.w != _f1.w && _e1.w != _h1.w);
    _interp_restriction_lv2_left = bvec4(_e1.x != _g1.x && _d2.x != _g1.x, _e1.y != _g1.y && _d2.y != _g1.y, _e1.z != _g1.z && _d2.z != _g1.z, _e1.w != _g1.w && _d2.w != _g1.w);
    _interp_restriction_lv2_up = bvec4(_e1.x != _c2.x && _b2.x != _c2.x, _e1.y != _c2.y && _b2.y != _c2.y, _e1.z != _c2.z && _b2.z != _c2.z, _e1.w != _c2.w && _b2.w != _c2.w);
    _a1011 = _e1 - _c2;
    _TMP1008 = abs(_a1011);
    _a1015 = _e1 - _g1;
    _TMP1012 = abs(_a1015);
    _a1019 = _i - _h5;
    _TMP1016 = abs(_a1019);
    _a1023 = _i - _f4;
    _TMP1020 = abs(_a1023);
    _a1027 = _h1 - _f1;
    _TMP1024 = abs(_a1027);
    _TMP21 = _TMP1008 + _TMP1012 + _TMP1016 + _TMP1020 + 4.00000000E+00*_TMP1024;
    _a1033 = _h1 - _d2;
    _TMP1030 = abs(_a1033);
    _a1037 = _h1 - _i5;
    _TMP1034 = abs(_a1037);
    _a1041 = _f1 - _i4;
    _TMP1038 = abs(_a1041);
    _a1045 = _f1 - _b2;
    _TMP1042 = abs(_a1045);
    _a1049 = _e1 - _i;
    _TMP1046 = abs(_a1049);
    _TMP22 = _TMP1030 + _TMP1034 + _TMP1038 + _TMP1042 + 4.00000000E+00*_TMP1046;
    _edr = bvec4(_TMP21.x < _TMP22.x && _interp_restriction_lv1.x, _TMP21.y < _TMP22.y && _interp_restriction_lv1.y, _TMP21.z < _TMP22.z && _interp_restriction_lv1.z, _TMP21.w < _TMP22.w && _interp_restriction_lv1.w);
    _a1053 = _f1 - _g1;
    _TMP1050 = abs(_a1053);
    _a1057 = _h1 - _c2;
    _TMP1054 = abs(_a1057);
    _edr_left = bvec4((2.00000000E+00*_TMP1050).x <= _TMP1054.x && _interp_restriction_lv2_left.x, (2.00000000E+00*_TMP1050).y <= _TMP1054.y && _interp_restriction_lv2_left.y, (2.00000000E+00*_TMP1050).z <= _TMP1054.z && _interp_restriction_lv2_left.z, (2.00000000E+00*_TMP1050).w <= _TMP1054.w && _interp_restriction_lv2_left.w);
    _a1061 = _f1 - _g1;
    _TMP1058 = abs(_a1061);
    _a1065 = _h1 - _c2;
    _TMP1062 = abs(_a1065);
    _edr_up = bvec4(_TMP1058.x >= (2.00000000E+00*_TMP1062).x && _interp_restriction_lv2_up.x, _TMP1058.y >= (2.00000000E+00*_TMP1062).y && _interp_restriction_lv2_up.y, _TMP1058.z >= (2.00000000E+00*_TMP1062).z && _interp_restriction_lv2_up.z, _TMP1058.w >= (2.00000000E+00*_TMP1062).w && _interp_restriction_lv2_up.w);
    _E0 = _TMP4.xyz;
    _E1 = _TMP4.xyz;
    _E2 = _TMP4.xyz;
    _E3 = _TMP4.xyz;
    _a1069 = _e1 - _f1;
    _TMP1066 = abs(_a1069);
    _a1073 = _e1 - _h1;
    _TMP1070 = abs(_a1073);
    _px = bvec4(_TMP1066.x <= _TMP1070.x, _TMP1066.y <= _TMP1070.y, _TMP1066.z <= _TMP1070.z, _TMP1066.w <= _TMP1070.w);
    if (_px.x) { 
        _TMP29 = _TMP5.xyz;
    } else {
        _TMP29 = _TMP7.xyz;
    } 
    if (_px.y) { 
        _TMP30 = _TMP1.xyz;
    } else {
        _TMP30 = _TMP5.xyz;
    } 
    if (_px.z) { 
        _TMP31 = _TMP3.xyz;
    } else {
        _TMP31 = _TMP1.xyz;
    } 
    if (_px.w) { 
        _TMP32 = _TMP7.xyz;
    } else {
        _TMP32 = _TMP3.xyz;
    } 
    if (_edr.x) { 
        if (_edr_left.x && _edr_up.x) { 
            _E3 = _TMP4.xyz + 8.33333015E-01*(_TMP29 - _TMP4.xyz);
            _E2 = _TMP4.xyz + 2.50000000E-01*(_TMP29 - _TMP4.xyz);
            _E1 = _TMP4.xyz + 2.50000000E-01*(_TMP29 - _TMP4.xyz);
        } else {
            if (_edr_left.x) { 
                _E3 = _TMP4.xyz + 7.50000000E-01*(_TMP29 - _TMP4.xyz);
                _E2 = _TMP4.xyz + 2.50000000E-01*(_TMP29 - _TMP4.xyz);
            } else {
                if (_edr_up.x) { 
                    _E3 = _TMP4.xyz + 7.50000000E-01*(_TMP29 - _TMP4.xyz);
                    _E1 = _TMP4.xyz + 2.50000000E-01*(_TMP29 - _TMP4.xyz);
                } else {
                    _E3 = _TMP4.xyz + 5.00000000E-01*(_TMP29 - _TMP4.xyz);
                } 
            } 
        } 
    } 
    if (_edr.y) { 
        if (_edr_left.y && _edr_up.y) { 
            _E1 = _E1 + 8.33333015E-01*(_TMP30 - _E1);
            _E3 = _E3 + 2.50000000E-01*(_TMP30 - _E3);
            _E0 = _TMP4.xyz + 2.50000000E-01*(_TMP30 - _TMP4.xyz);
        } else {
            if (_edr_left.y) { 
                _E1 = _E1 + 7.50000000E-01*(_TMP30 - _E1);
                _E3 = _E3 + 2.50000000E-01*(_TMP30 - _E3);
            } else {
                if (_edr_up.y) { 
                    _E1 = _E1 + 7.50000000E-01*(_TMP30 - _E1);
                    _E0 = _TMP4.xyz + 2.50000000E-01*(_TMP30 - _TMP4.xyz);
                } else {
                    _E1 = _E1 + 5.00000000E-01*(_TMP30 - _E1);
                } 
            } 
        } 
    } 
    if (_edr.z) { 
        if (_edr_left.z && _edr_up.z) { 
            _E0 = _E0 + 8.33333015E-01*(_TMP31 - _E0);
            _E1 = _E1 + 2.50000000E-01*(_TMP31 - _E1);
            _E2 = _E2 + 2.50000000E-01*(_TMP31 - _E2);
        } else {
            if (_edr_left.z) { 
                _E0 = _E0 + 7.50000000E-01*(_TMP31 - _E0);
                _E1 = _E1 + 2.50000000E-01*(_TMP31 - _E1);
            } else {
                if (_edr_up.z) { 
                    _E0 = _E0 + 7.50000000E-01*(_TMP31 - _E0);
                    _E2 = _E2 + 2.50000000E-01*(_TMP31 - _E2);
                } else {
                    _E0 = _E0 + 5.00000000E-01*(_TMP31 - _E0);
                } 
            } 
        } 
    } 
    if (_edr.w) { 
        if (_edr_left.w && _edr_up.w) { 
            _E2 = _E2 + 8.33333015E-01*(_TMP32 - _E2);
            _E0 = _E0 + 2.50000000E-01*(_TMP32 - _E0);
            _E3 = _E3 + 2.50000000E-01*(_TMP32 - _E3);
        } else {
            if (_edr_left.w) { 
                _E2 = _E2 + 7.50000000E-01*(_TMP32 - _E2);
                _E0 = _E0 + 2.50000000E-01*(_TMP32 - _E0);
            } else {
                if (_edr_up.w) { 
                    _E2 = _E2 + 7.50000000E-01*(_TMP32 - _E2);
                    _E3 = _E3 + 2.50000000E-01*(_TMP32 - _E3);
                } else {
                    _E2 = _E2 + 5.00000000E-01*(_TMP32 - _E2);
                } 
            } 
        } 
    } 
    if (_fp.x < 5.00000000E-01) { 
        if (_fp.y < 5.00000000E-01) { 
            _TMP34 = _E0;
        } else {
            _TMP34 = _E2;
        } 
        _TMP33 = _TMP34;
    } else {
        if (_fp.y < 5.00000000E-01) { 
            _TMP35 = _E1;
        } else {
            _TMP35 = _E3;
        } 
        _TMP33 = _TMP35;
    } 
    _ret_0 = vec4(_TMP33.x, _TMP33.y, _TMP33.z, 1.00000000E+00);
    FragColor = _ret_0;
    return;
} 
#endif
