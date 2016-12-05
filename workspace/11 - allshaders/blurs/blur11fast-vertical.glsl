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
COMPAT_VARYING     vec2 _blur_dxdy;
COMPAT_VARYING     vec2 _tex_uv1;
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
    vec2 _tex_uv1;
    vec2 _blur_dxdy;
};
out_vertex _ret_0;
input_dummy _IN1;
vec4 _r0006;
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
    vec2 _dxdy_scale;
    vec2 _dxdy;
    _r0006 = VertexCoord.x*MVPMatrix[0];
    _r0006 = _r0006 + VertexCoord.y*MVPMatrix[1];
    _r0006 = _r0006 + VertexCoord.z*MVPMatrix[2];
    _r0006 = _r0006 + VertexCoord.w*MVPMatrix[3];
    _dxdy_scale = InputSize/OutputSize;
    _dxdy = _dxdy_scale/TextureSize;
    _OUT._blur_dxdy = vec2(0.00000000E+00, _dxdy.y);
    _ret_0._position1 = _r0006;
    _ret_0._tex_uv1 = TexCoord.xy;
    _ret_0._blur_dxdy = _OUT._blur_dxdy;
    gl_Position = _r0006;
    TEX0.xy = TexCoord.xy;
    TEX1.xy = _OUT._blur_dxdy;
    return;
    TEX0.xy = _ret_0._tex_uv1;
    TEX1.xy = _ret_0._blur_dxdy;
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
COMPAT_VARYING     vec2 _blur_dxdy;
COMPAT_VARYING     vec2 _tex_uv1;
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
    vec2 _tex_uv1;
    vec2 _blur_dxdy;
};
vec4 _TMP6;
uniform sampler2D Texture;
vec3 _TMP11;
float _weight_sum_inv0014;
float _w010014;
float _w230014;
float _w450014;
float _w01_ratio0014;
float _w23_ratio0014;
float _w45_ratio0014;
vec3 _sum0014;
float _TMP15;
float _TMP19;
float _TMP23;
float _TMP27;
float _TMP31;
vec2 _tex_coords0036;
vec2 _tex_coords0042;
vec2 _tex_coords0048;
vec2 _tex_coords0054;
vec2 _tex_coords0060;
vec2 _tex_coords0066;
vec4 _color0072;
COMPAT_VARYING vec4 TEX0;
COMPAT_VARYING vec4 TEX1;
 
uniform float FrameDirection;
uniform float FrameCount;
uniform COMPAT_PRECISION vec2 OutputSize;
uniform COMPAT_PRECISION vec2 TextureSize;
uniform COMPAT_PRECISION vec2 InputSize;
void main()
{
    _TMP15 = pow(2.71828198E+00, -1.07180931E-01);
    _TMP19 = pow(2.71828198E+00, -4.28723723E-01);
    _TMP23 = pow(2.71828198E+00, -9.64628398E-01);
    _TMP27 = pow(2.71828198E+00, -1.71489489E+00);
    _TMP31 = pow(2.71828198E+00, -2.67952323E+00);
    _weight_sum_inv0014 = 1.00000000E+00/(1.00000000E+00 + 2.00000000E+00*(_TMP15 + _TMP19 + _TMP23 + _TMP27 + _TMP31));
    _w010014 = 5.00000000E-01 + _TMP15;
    _w230014 = _TMP19 + _TMP23;
    _w450014 = _TMP27 + _TMP31;
    _w01_ratio0014 = _TMP15/_w010014;
    _w23_ratio0014 = _TMP23/_w230014;
    _w45_ratio0014 = _TMP31/_w450014;
    _tex_coords0036 = TEX0.xy - (4.00000000E+00 + _w45_ratio0014)*TEX1.xy;
    _TMP6 = COMPAT_TEXTURE(Texture, _tex_coords0036);
    _sum0014 = _w450014*_TMP6.xyz;
    _tex_coords0042 = TEX0.xy - (2.00000000E+00 + _w23_ratio0014)*TEX1.xy;
    _TMP6 = COMPAT_TEXTURE(Texture, _tex_coords0042);
    _sum0014 = _sum0014 + _w230014*_TMP6.xyz;
    _tex_coords0048 = TEX0.xy - _w01_ratio0014*TEX1.xy;
    _TMP6 = COMPAT_TEXTURE(Texture, _tex_coords0048);
    _sum0014 = _sum0014 + _w010014*_TMP6.xyz;
    _tex_coords0054 = TEX0.xy + _w01_ratio0014*TEX1.xy;
    _TMP6 = COMPAT_TEXTURE(Texture, _tex_coords0054);
    _sum0014 = _sum0014 + _w010014*_TMP6.xyz;
    _tex_coords0060 = TEX0.xy + (2.00000000E+00 + _w23_ratio0014)*TEX1.xy;
    _TMP6 = COMPAT_TEXTURE(Texture, _tex_coords0060);
    _sum0014 = _sum0014 + _w230014*_TMP6.xyz;
    _tex_coords0066 = TEX0.xy + (4.00000000E+00 + _w45_ratio0014)*TEX1.xy;
    _TMP6 = COMPAT_TEXTURE(Texture, _tex_coords0066);
    _sum0014 = _sum0014 + _w450014*_TMP6.xyz;
    _TMP11 = _sum0014*_weight_sum_inv0014;
    _color0072 = vec4(_TMP11.x, _TMP11.y, _TMP11.z, 1.00000000E+00);
    FragColor = _color0072;
    return;
} 
#endif
