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
COMPAT_VARYING     vec2 _upper_bound;
COMPAT_VARYING     vec2 _lower_bound;
COMPAT_VARYING     vec2 _tex_coord_4;
COMPAT_VARYING     vec2 _tex_coord_3;
COMPAT_VARYING     vec2 _tex_coord_2;
COMPAT_VARYING     vec2 _tex_coord_1;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
float _placeholder33;
};
struct pass_1 {
float _placeholder37;
};
struct blur_coords {
    vec2 _tex_coord_1;
    vec2 _tex_coord_2;
    vec2 _tex_coord_3;
    vec2 _tex_coord_4;
    vec2 _lower_bound;
    vec2 _upper_bound;
};
vec4 _oPosition1;
blur_coords _oBlurCoords1;
input_dummy _IN1;
vec4 _r0007;
COMPAT_ATTRIBUTE vec4 VertexCoord;
COMPAT_ATTRIBUTE vec4 TexCoord;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
COMPAT_VARYING vec4 TEX2;
COMPAT_VARYING vec4 TEX3;
COMPAT_VARYING vec4 TEX4;
COMPAT_VARYING vec4 TEX5;
COMPAT_VARYING vec4 TEX6;
 
uniform mat4 MVPMatrix;
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec2 _oTexCoord;
    vec2 _texel;
    blur_coords _TMP3;
    _r0007 = VertexCoord.x*MVPMatrix[0];
    _r0007 = _r0007 + VertexCoord.y*MVPMatrix[1];
    _r0007 = _r0007 + VertexCoord.z*MVPMatrix[2];
    _r0007 = _r0007 + VertexCoord.w*MVPMatrix[3];
    _oPosition1 = _r0007;
    _oTexCoord = TexCoord.xy;
    _texel = vec2(float((1.00000000E+00/TextureSize).x), float((1.00000000E+00/TextureSize).y));
    _TMP3._tex_coord_1 = vec2(float((TexCoord.xy + vec2(0.00000000E+00, float(_texel.y))).x), float((TexCoord.xy + vec2(0.00000000E+00, float(_texel.y))).y));
    _TMP3._tex_coord_2 = vec2(float((TexCoord.xy + vec2(0.00000000E+00, float(-_texel.y))).x), float((TexCoord.xy + vec2(0.00000000E+00, float(-_texel.y))).y));
    _TMP3._tex_coord_3 = vec2(float((TexCoord.xy + vec2(float(_texel.x), 0.00000000E+00)).x), float((TexCoord.xy + vec2(float(_texel.x), 0.00000000E+00)).y));
    _TMP3._tex_coord_4 = vec2(float((TexCoord.xy + vec2(float(-_texel.x), 0.00000000E+00)).x), float((TexCoord.xy + vec2(float(-_texel.x), 0.00000000E+00)).y));
    _TMP3._upper_bound = vec2(float((vec2(float(_texel.x), float(_texel.y))*(OutputSize - 2.00000000E+00)).x), float((vec2(float(_texel.x), float(_texel.y))*(OutputSize - 2.00000000E+00)).y));
    _oBlurCoords1._tex_coord_1 = _TMP3._tex_coord_1;
    _oBlurCoords1._tex_coord_2 = _TMP3._tex_coord_2;
    _oBlurCoords1._tex_coord_3 = _TMP3._tex_coord_3;
    _oBlurCoords1._tex_coord_4 = _TMP3._tex_coord_4;
    _oBlurCoords1._lower_bound = vec2( 0.00000000E+00, 0.00000000E+00);
    _oBlurCoords1._upper_bound = _TMP3._upper_bound;
    gl_Position = _r0007;
    TEX0.xy = TexCoord.xy;
    TEX1.xy = _TMP3._tex_coord_1;
    TEX2.xy = _TMP3._tex_coord_2;
    TEX3.xy = _TMP3._tex_coord_3;
    TEX4.xy = _TMP3._tex_coord_4;
    TEX5.xy = vec2( 0.00000000E+00, 0.00000000E+00);
    TEX6.xy = _TMP3._upper_bound;
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
COMPAT_VARYING     vec2 _upper_bound;
COMPAT_VARYING     vec2 _lower_bound;
COMPAT_VARYING     vec2 _tex_coord_4;
COMPAT_VARYING     vec2 _tex_coord_3;
COMPAT_VARYING     vec2 _tex_coord_2;
COMPAT_VARYING     vec2 _tex_coord_1;
struct input_dummy {
    vec2 _video_size;
    vec2 _texture_size;
    vec2 _output_dummy_size;
    float _frame_count;
float _placeholder31;
};
struct pass_1 {
float _placeholder35;
};
struct blur_coords {
    vec2 _tex_coord_1;
    vec2 _tex_coord_2;
    vec2 _tex_coord_3;
    vec2 _tex_coord_4;
    vec2 _lower_bound;
    vec2 _upper_bound;
};
vec4 _TMP6;
vec4 _TMP5;
vec4 _TMP2;
vec4 _TMP1;
vec2 _TMP7;
vec2 _TMP9;
vec2 _TMP8;
pass_1 _PASS11;
input_dummy _IN2;
vec4 _adjacent_texel_10016;
vec4 _adjacent_texel_20016;
vec4 _COLOR0016;
vec2 _TMP17;
vec2 _TMP23;
vec2 _c0042;
vec2 _c0044;
vec2 _c0050;
vec2 _c0052;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
COMPAT_VARYING vec4 TEX2;
COMPAT_VARYING vec4 TEX5;
COMPAT_VARYING vec4 TEX6;
 
uniform sampler2D Texture;
uniform sampler2D Pass1Texture;
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    vec4 _out_color;
    _out_color = COMPAT_TEXTURE(Pass1Texture, TEX0.xy);
    if (_out_color.w == 0.00000000E+00) { 
        _COLOR0016 = vec4(float(_out_color.x), float(_out_color.y), float(_out_color.z), float(_out_color.w));
        _TMP8 = min(vec2(float(TEX6.x), float(TEX6.y)), vec2(float(TEX1.x), float(TEX1.y)));
        _TMP7 = vec2(float(_TMP8.x), float(_TMP8.y));
        _TMP9 = max(vec2(float(TEX5.x), float(TEX5.y)), vec2(float(_TMP7.x), float(_TMP7.y)));
        _TMP17 = vec2(float(_TMP9.x), float(_TMP9.y));
        _TMP8 = min(vec2(float(TEX6.x), float(TEX6.y)), vec2(float(TEX2.x), float(TEX2.y)));
        _TMP7 = vec2(float(_TMP8.x), float(_TMP8.y));
        _TMP9 = max(vec2(float(TEX5.x), float(TEX5.y)), vec2(float(_TMP7.x), float(_TMP7.y)));
        _TMP23 = vec2(float(_TMP9.x), float(_TMP9.y));
        _c0042 = vec2(float(_TMP17.x), float(_TMP17.y));
        _TMP1 = COMPAT_TEXTURE(Texture, _c0042);
        _adjacent_texel_10016 = vec4(float(_TMP1.x), float(_TMP1.y), float(_TMP1.z), float(_TMP1.w));
        _c0044 = vec2(float(_TMP23.x), float(_TMP23.y));
        _TMP2 = COMPAT_TEXTURE(Texture, _c0044);
        _adjacent_texel_20016 = vec4(float(_TMP2.x), float(_TMP2.y), float(_TMP2.z), float(_TMP2.w));
        _COLOR0016.xyz = _COLOR0016.xyz - ((_COLOR0016.xyz - _adjacent_texel_10016.xyz) + (_COLOR0016.xyz - _adjacent_texel_20016.xyz))*4.00390625E-01;
        _c0050 = vec2(float(_TMP17.x), float(_TMP17.y));
        _TMP5 = COMPAT_TEXTURE(Pass1Texture, _c0050);
        _adjacent_texel_10016 = vec4(float(_TMP5.x), float(_TMP5.y), float(_TMP5.z), float(_TMP5.w));
        _c0052 = vec2(float(_TMP23.x), float(_TMP23.y));
        _TMP6 = COMPAT_TEXTURE(Pass1Texture, _c0052);
        _adjacent_texel_20016 = vec4(float(_TMP6.x), float(_TMP6.y), float(_TMP6.z), float(_TMP6.w));
        _COLOR0016.xyz = _COLOR0016.xyz - ((_COLOR0016.xyz - _adjacent_texel_10016.xyz) + (_COLOR0016.xyz - _adjacent_texel_20016.xyz))*2.99804688E-01;
        _out_color = vec4(float(_COLOR0016.x), float(_COLOR0016.y), float(_COLOR0016.z), 1.00000000E+00);
    } 
    FragColor = _out_color;
    return;
} 
#endif
