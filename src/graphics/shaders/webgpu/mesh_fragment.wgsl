struct CameraUniform {
    view_proj: mat4x4<f32>,
    camera_pos: vec3<f32>,
    zoom: f32,
    aspect_ratio: f32,
};

@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct VertexOutput {
    @location(0) world_normal: vec3<f32>,
    @location(1) world_position: vec3<f32>,
    @location(2) @interpolate(flat) color: vec4<f32>,
};

// notes:
// camera.camera_pos is the world space eye position
@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let n = normalize(in.world_normal);

    // right now its fixed
    let light_dir = normalize(vec3<f32>(0.4, 1.0, 0.3));

    // i do NOT know what most of this does
    // i will learn and then improve the lighting system drastically
    // (i remember a tiny bit from when i made minecraft shaders :thumbsup:)
    // this was from a tutorial though
    let lambert = max(dot(n, light_dir), 0.0);
    let ambient = 0.25;
    let shade = ambient + 0.75 * lambert;

    let view_dir = normalize(camera.camera_pos - in.world_position);
    let half_dir = normalize(light_dir + view_dir);
    let specular = pow(max(dot(n, half_dir), 0.0), 32.0) * 0.35;

    return vec4<f32>(in.color.rgb * shade + vec3<f32>(specular), in.color.a);
}
