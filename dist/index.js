var te;((i)=>{i[i.CANVAS=0]="CANVAS";i[i.WEBGL=1]="WEBGL";i[i.WEBGPU=2]="WEBGPU"})(te||={});class d{x;y;z;w;constructor(e=0,t=0,r=0,i=1){this.x=e,this.y=t,this.z=r,this.w=i}set(e,t,r,i){return this.x=e,this.y=t,this.z=r,this.w=i,this}copy(e){return this.set(e.x,e.y,e.z,e.w)}identity(){return this.set(0,0,0,1)}static identity(e=new d){return e.set(0,0,0,1)}static fromAxisAngle(e,t,r=new d){let i=t*0.5,a=Math.sin(i);return r.set(e.x*a,e.y*a,e.z*a,Math.cos(i))}magnitudeSquared(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}magnitude(){return Math.sqrt(this.magnitudeSquared())}normalize(e=this){let t=this.magnitudeSquared();if(t===0)return e.set(0,0,0,1);let r=1/Math.sqrt(t);return e.set(this.x*r,this.y*r,this.z*r,this.w*r)}static multiply(e,t,r=new d){let{x:i,y:a,z:n,w:s}=e,o=t.x,u=t.y,c=t.z,h=t.w;return r.set(s*o+i*h+a*c-n*u,s*u-i*c+a*h+n*o,s*c+i*u-a*o+n*h,s*h-i*o-a*u-n*c)}multiply(e){return d.multiply(this,e,this)}conjugate(e=this){return e.set(-this.x,-this.y,-this.z,this.w)}}class y{x;y;z;constructor(e,t,r){this.x=e,this.y=t,this.z=r}add(e){return new y(this.x+e.x,this.y+e.y,this.z+e.z)}sub(e){return new y(this.x-e.x,this.y-e.y,this.z-e.z)}mul(e){return new y(this.x*e,this.y*e,this.z*e)}negative(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}mag(){return Math.sqrt(this.mag_squared())}mag_squared(){return this.x*this.x+this.y*this.y+this.z*this.z}clone(){return new y(this.x,this.y,this.z)}normalize(){let e=this.mag();if(e===0)return y.ZERO;return this.mul(1/e)}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}cross(e){return new y(this.y*e.z-this.z*e.y,this.z*e.x-this.x*e.z,this.x*e.y-this.y*e.x)}distanceTo(e){let t=this.x-e.x,r=this.y-e.y,i=this.z-e.z;return Math.sqrt(t*t+r*r+i*i)}squaredDistanceTo(e){let t=this.x-e.x,r=this.y-e.y,i=this.z-e.z;return t*t+r*r+i*i}equals(e){return this.x===e.x&&this.y===e.y&&this.z===e.z}angleBetween(e){let t=Math.sqrt(this.mag_squared()*e.mag_squared());if(t===0)return 0;let r=this.dot(e)/t;return Math.acos(Math.max(-1,Math.min(1,r)))}static get ZERO(){return new y(0,0,0)}}class q{configs;ctx;constructor(e,t){this.configs=t,this.ctx=e.getContext("2d")}clear(e,t,r,i){this.ctx.fillStyle=`rgba(${e}, ${t}, ${r}, ${i})`,this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}setColor(e,t,r,i){this.ctx.fillStyle=`rgba(${e}, ${t}, ${r}, ${i})`}drawLine(e,t,r,i,a){this.ctx.lineWidth=a,this.ctx.beginPath(),this.ctx.moveTo(e,t),this.ctx.lineTo(r,i),this.ctx.closePath(),this.ctx.stroke()}drawCircle(e,t,r){this.ctx.beginPath(),this.ctx.arc(e,t,r,0,Math.PI*2),this.ctx.fill()}drawTriangle(e,t,r,i,a,n){this.ctx.beginPath(),this.ctx.moveTo(e,t),this.ctx.lineTo(r,i),this.ctx.lineTo(a,n),this.ctx.lineTo(e,t),this.ctx.closePath(),this.ctx.fill()}drawRect(e,t,r,i){this.ctx.fillRect(e,t,r,i)}drawRegularPolygon(e,t,r,i,a){a=a||0,this.ctx.beginPath();for(let n=a;n<Math.PI*2+a;n+=Math.PI*2/i){let s={x:e+r*Math.cos(n),y:t+r*Math.sin(n)};this.ctx[n===a?"moveTo":"lineTo"](s.x,s.y)}this.ctx.closePath(),this.ctx.fill()}drawPolygon(e){this.ctx.beginPath(),this.ctx.moveTo(e[0].x,e[0].y);for(let t=1;t<e.length;t++)this.ctx.lineTo(e[t].x,e[t].y);this.ctx.closePath(),this.ctx.fill()}drawText(e,t,r,i,a){this.ctx.font=`${i}px sans-serif`,this.ctx.textAlign=a===0?"left":a===1?"center":"right",this.ctx.fillText(r,e,t)}resize(e,t){}flush(){}}var re=`#version 300 es

layout(location = 0) in vec3 a_position;
layout(location = 3) in vec2 a_texCoord;
layout(location = 4) in vec4 a_colour;
layout(location = 5) in float a_type;

out vec2 v_texCoord;
out vec4 v_colour;
out float v_type;

uniform mat4 u_viewProjection;

void main() {
    v_texCoord = a_texCoord;
    v_colour = a_colour;
    v_type = a_type;

    gl_Position = u_viewProjection * vec4(a_position, 1.0);
}`;var ie=`#version 300 es

precision highp float;

in vec2 v_texCoord;
in vec4 v_colour;
in float v_type;

uniform sampler2D u_textures[8];

out vec4 outColour;

void main() {
    if (int(v_type) == 0) {
        vec4 texColor;
        texColor = texture(u_textures[0], v_texCoord);
        outColour = texColor * v_colour;
    } else if (int(v_type) == 1) {
        outColour = v_colour;
    } else {
        vec2 uv = v_texCoord - vec2(0.5);
        float distSq = dot(uv, uv);
        if(distSq > 0.25) discard;
        outColour = v_colour;
    }
}`;class Y{configs;ctx;shaderLocations;vao;vertexBuffer;floatsPerVertex=10;trianglesPerBatch=1e4;batchData;batchOffset;currentColor=[1,0,0,1];viewProjectionMatrix=new Float32Array(16);constructor(e,t){this.configs=t,this.ctx=e.getContext("webgl2"),this.shaderLocations=this.initShaderProgram(re,ie),this.ctx.enable(this.ctx.BLEND),this.ctx.blendFunc(this.ctx.SRC_ALPHA,this.ctx.ONE_MINUS_SRC_ALPHA),this.ctx.useProgram(this.shaderLocations.program),this.vao=this.ctx.createVertexArray(),this.ctx.bindVertexArray(this.vao),this.vertexBuffer=this.ctx.createBuffer(),this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferData(this.ctx.ARRAY_BUFFER,this.floatsPerVertex*this.trianglesPerBatch*3*4,this.ctx.DYNAMIC_DRAW);let r=this.floatsPerVertex*4;this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.position),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.position,3,this.ctx.FLOAT,!1,r,0),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.texCoord),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.texCoord,2,this.ctx.FLOAT,!1,r,12),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.colour),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.colour,4,this.ctx.FLOAT,!1,r,20),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.type),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.type,1,this.ctx.FLOAT,!1,r,36),this.ctx.bindVertexArray(null),this.batchData=new Float32Array(this.trianglesPerBatch*3*this.floatsPerVertex),this.batchOffset=0,this.resize(500,500)}initShaderProgram(e,t){let r=this.ctx.createProgram();return this.ctx.attachShader(r,this.loadShader(this.ctx.VERTEX_SHADER,e)),this.ctx.attachShader(r,this.loadShader(this.ctx.FRAGMENT_SHADER,t)),this.ctx.linkProgram(r),{program:r,attributes:{position:this.ctx.getAttribLocation(r,"a_position"),texCoord:this.ctx.getAttribLocation(r,"a_texCoord"),colour:this.ctx.getAttribLocation(r,"a_colour"),type:this.ctx.getAttribLocation(r,"a_type")},uniforms:{viewProjection:this.ctx.getUniformLocation(r,"u_viewProjection")}}}loadShader(e,t){let r=this.ctx.createShader(e);if(this.ctx.shaderSource(r,t),this.ctx.compileShader(r),!this.ctx.getShaderParameter(r,this.ctx.COMPILE_STATUS))throw Error("Shader Error: "+this.ctx.getShaderInfoLog(r));return r}flush(){if(this.batchOffset===0)return;this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferSubData(this.ctx.ARRAY_BUFFER,0,this.batchData,0,this.batchOffset),this.ctx.bindVertexArray(this.vao),this.ctx.drawArrays(this.ctx.TRIANGLES,0,this.batchOffset/this.floatsPerVertex),this.ctx.bindVertexArray(null),this.batchOffset=0}addVertex(e,t,r=0,i,a,n,s,o,u,c){if(this.batchOffset+this.floatsPerVertex>this.batchData.length)this.flush();this.batchData[this.batchOffset++]=e,this.batchData[this.batchOffset++]=t,this.batchData[this.batchOffset++]=r,this.batchData[this.batchOffset++]=i,this.batchData[this.batchOffset++]=a,this.batchData[this.batchOffset++]=n,this.batchData[this.batchOffset++]=s,this.batchData[this.batchOffset++]=o,this.batchData[this.batchOffset++]=u,this.batchData[this.batchOffset++]=c}clear(e,t,r,i){this.ctx.clearColor(e/255,t/255,r/255,i),this.ctx.clear(this.ctx.COLOR_BUFFER_BIT)}setColor(e,t,r,i){this.currentColor=[e/255,t/255,r/255,i]}drawLine(e,t,r,i,a){let n=r-e,s=i-t,o=Math.hypot(n,s);if(o===0)return;let u=-s/o*(a/2),c=n/o*(a/2);this.drawTriangle(e+u,t+c,e-u,t-c,r+u,i+c),this.drawTriangle(r+u,i+c,r-u,i-c,e-u,t-c)}drawCircle(e,t,r){let[i,a,n,s]=this.currentColor;this.addVertex(e-r,t-r,0,0,0,i,a,n,s,2),this.addVertex(e+r,t-r,0,1,0,i,a,n,s,2),this.addVertex(e+r,t+r,0,1,1,i,a,n,s,2),this.addVertex(e-r,t-r,0,0,0,i,a,n,s,2),this.addVertex(e-r,t+r,0,0,1,i,a,n,s,2),this.addVertex(e+r,t+r,0,1,1,i,a,n,s,2)}drawRect(e,t,r,i){let[a,n,s,o]=this.currentColor;this.addVertex(e,t,0,0,0,a,n,s,o,1),this.addVertex(e+r,t,0,1,0,a,n,s,o,1),this.addVertex(e+r,t+i,0,1,1,a,n,s,o,1),this.addVertex(e,t,0,0,0,a,n,s,o,1),this.addVertex(e,t+i,0,0,1,a,n,s,o,1),this.addVertex(e+r,t+i,0,1,1,a,n,s,o,1)}drawTriangle(e,t,r,i,a,n){let[s,o,u,c]=this.currentColor;this.addVertex(e,t,0,0,0,s,o,u,c,1),this.addVertex(r,i,0,0,0,s,o,u,c,1),this.addVertex(a,n,0,0,0,s,o,u,c,1)}drawRegularPolygon(e,t,r,i,a=0){if(i<3)return;let n=Math.PI*2/i,s=e+r*Math.cos(a),o=t+r*Math.sin(a);for(let u=1;u<=i;u++){let c=a+u*n,h=e+r*Math.cos(c),l=t+r*Math.sin(c);this.drawTriangle(e,t,s,o,h,l),s=h,o=l}}updateView(e){this.flush(),this.ctx.uniformMatrix4fv(this.shaderLocations.uniforms.viewProjection,!1,e.viewProjectionMatrix.data)}resize(e,t){this.ctx.viewport(0,0,e,t)}}var ne=`const PI: f32 = 3.14159265359;

@group(1) @binding(0) var atlas_tex: texture_2d<f32>;
@group(1) @binding(1) var atlas_samp: sampler;

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) world_pos: vec2<f32>,
    @location(2) @interpolate(flat) shape_type: u32,
    @location(3) @interpolate(flat) sides: u32,
    @location(4) @interpolate(flat) fill_color: vec4<f32>,
    @location(5) @interpolate(flat) border_color: vec4<f32>,
    @location(6) @interpolate(flat) border_thickness: f32,
    @location(7) @interpolate(flat) extra_param: f32,
    @location(8) @interpolate(flat) size: vec2<f32>,
};

fn draw_grid(
    world_pos: vec2<f32>,
    cell_size: f32,
    line_width: f32,
    bg_color: vec4<f32>,
    line_color: vec4<f32>,
    line_alpha: f32,
    line_aa: f32,
) -> vec4<f32> {
    let grid_coord = abs(fract(world_pos / cell_size - 0.5) - 0.5) * cell_size;

    let half_width = line_width * 0.5;
    let aa = line_aa;

    let factor_x = 1.0 - smoothstep(half_width - aa, half_width + aa, grid_coord.x);
    let factor_y = 1.0 - smoothstep(half_width - aa, half_width + aa, grid_coord.y);

    let line_factor = max(factor_x, factor_y);

    let factor = line_factor * line_alpha;

    return vec4<f32>(
        mix(bg_color.rgb, line_color.rgb, factor),
        1.0,
    );
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let world_fwidth = fwidth(in.world_pos);
    let grid_line_aa = max(world_fwidth.x, world_fwidth.y);

    let uv_fwidth = fwidth(in.uv);
    let delta = max(uv_fwidth.x, uv_fwidth.y);

    if (in.shape_type == 2u) {
        let cell_size = in.extra_param;
        return draw_grid(
            in.world_pos,
            cell_size,
            in.border_thickness,
            in.fill_color,
            in.border_color,
            in.border_color.a,
            grid_line_aa,
        );
    }

    let min_size = min(in.size.x, in.size.y);
    let border_uv_width = in.border_thickness * (2.0 / min_size);

    if (in.shape_type == 0u) {
        let dist_circle = length(in.uv);
        let alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, dist_circle);
        if (alpha < 0.001) {
            discard;
        }

        let border_mix = smoothstep(1.0 - border_uv_width - delta, 1.0 - border_uv_width + delta, dist_circle);

        let final_color = mix(in.fill_color, in.border_color, border_mix);
        return vec4<f32>(final_color.rgb, final_color.a * alpha);
    }

    if (in.shape_type == 1u) {
        let dist_box = max(abs(in.uv.x), abs(in.uv.y));
        let alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, dist_box);
        if (alpha < 0.001) {
            discard;
        }

        let border_mix = smoothstep(1.0 - border_uv_width - delta, 1.0 - border_uv_width + delta, dist_box);

        let final_color = mix(in.fill_color, in.border_color, border_mix);
        return vec4<f32>(final_color.rgb, final_color.a * alpha);
    }

    if (in.shape_type == 4u) {
        let radius = in.extra_param;
        let q = abs(in.uv) - 1.0 + radius;
        let dist_rounded = length(max(q, vec2<f32>(0.0))) + min(max(q.x, q.y), 0.0) - radius;

        let alpha = 1.0 - smoothstep(0.0 - delta, 0.0 + delta, dist_rounded);
        if (alpha < 0.001) {
            discard;
        }
        return vec4<f32>(in.fill_color.rgb, in.fill_color.a * alpha);
    }

    if (in.shape_type == 3u && in.sides >= 3u) {
        let sides_f = f32(in.sides);
        let angle = atan2(in.uv.y, in.uv.x);
        let slice = (2.0 * PI) / sides_f;

        let apothem = cos(PI / sides_f);
        let dist_poly = (cos(floor(0.5 + angle / slice) * slice - angle) * length(in.uv)) / apothem;

        let alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, dist_poly);
        if (alpha < 0.001) {
            discard;
        }

        let border_mix = smoothstep(1.0 - border_uv_width - delta, 1.0 - border_uv_width + delta, dist_poly);

        let final_color = mix(in.fill_color, in.border_color, border_mix);
        return vec4<f32>(final_color.rgb, final_color.a * alpha);
    }

    if (in.shape_type == 5u) {
        let local01 = (in.uv * 0.5) + vec2<f32>(0.5, 0.5);
        // border_color is repurposed for glyphs: [u0, v0, uWidth, vHeight]
        let atlas_uv = in.border_color.xy + local01 * in.border_color.zw;
        let coverage = textureSampleLevel(atlas_tex, atlas_samp, atlas_uv, 0.0).a;

        if (coverage < 0.01) {
            discard;
        }

        return vec4<f32>(in.fill_color.rgb, in.fill_color.a * coverage);
    }

    return in.fill_color;
}
`;var ae=`struct CameraUniform {
    view_proj: mat4x4<f32>,
    camera_pos: vec3<f32>,
    zoom: f32,
    aspect_ratio: f32,
};

@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct InstanceInput {
    @location(0) pos: vec3<f32>,
    @location(1) size: vec2<f32>,
    @location(2) rotation: f32,
    @location(3) shape_type: u32,
    @location(4) sides: u32,
    @location(5) fill_color: vec4<f32>,
    @location(6) border_color: vec4<f32>,
    @location(7) border_thickness: f32,
    @location(8) extra_param: f32,
};

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) world_pos: vec2<f32>,
    @location(2) @interpolate(flat) shape_type: u32,
    @location(3) @interpolate(flat) sides: u32,
    @location(4) @interpolate(flat) fill_color: vec4<f32>,
    @location(5) @interpolate(flat) border_color: vec4<f32>,
    @location(6) @interpolate(flat) border_thickness: f32,
    @location(7) @interpolate(flat) extra_param: f32,
    @location(8) @interpolate(flat) size: vec2<f32>,
};

const QUAD_VERTICES: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0)
);

@vertex
fn vs_main(
    @builtin(vertex_index) vertex_index: u32,
    instance: InstanceInput,
) -> VertexOutput {
    var out: VertexOutput;
    let local_position = QUAD_VERTICES[vertex_index];
    let cos_r = cos(instance.rotation);
    let sin_r = sin(instance.rotation);
    let rot_mat = mat2x2<f32>(cos_r, sin_r, -sin_r, cos_r);
    let local_scaled = local_position * (instance.size * 0.5);
    let rotated_pos = rot_mat * local_scaled;
    let world_pos_2d = instance.pos.xy + rotated_pos;

    out.clip_position = camera.view_proj * vec4<f32>(world_pos_2d, instance.pos.z, 1.0);
    out.uv = local_position;
    out.world_pos = world_pos_2d;
    out.shape_type = instance.shape_type;
    out.sides = instance.sides;
    out.fill_color = instance.fill_color;
    out.border_color = instance.border_color;
    out.border_thickness = instance.border_thickness;
    out.extra_param = instance.extra_param;
    out.size = instance.size;

    return out;
}
`;class g{x;y;constructor(e,t){this.x=e,this.y=t}add(e){return new g(this.x+e.x,this.y+e.y)}sub(e){return new g(this.x-e.x,this.y-e.y)}mul(e){return new g(this.x*e,this.y*e)}mag(){return Math.sqrt(this.mag_squared())}mag_squared(){return this.x*this.x+this.y*this.y}clone(){return new g(this.x,this.y)}normalize(){let e=this.mag();if(e===0)return g.ZERO;return this.mul(1/e)}dot(e){return this.x*e.x+this.y*e.y}distanceTo(e){let t=this.x-e.x,r=this.y-e.y;return Math.sqrt(t*t+r*r)}squaredDistanceTo(e){let t=this.x-e.x,r=this.y-e.y;return t*t+r*r}equals(e){return this.x===e.x&&this.y===e.y}angle(){return Math.atan2(this.y,this.x)}angleBetween(e){let t=Math.sqrt(this.mag_squared()*e.mag_squared());if(t===0)return 0;let r=this.dot(e)/t;return Math.acos(Math.max(-1,Math.min(1,r)))}rotate(e){let t=Math.cos(e),r=Math.sin(e);return new g(this.x*t-this.y*r,this.x*r+this.y*t)}static get ZERO(){return new g(0,0)}}function Be(e,t,r){return new g((e.x+1)/2*t,(1-(e.y+1)/2)*r)}function Le(e){return new g(e.x/e.z,e.y/e.z)}function W(e,t,r,i){let a=r[0],n=a+e/i,s=r[1],o=s+t/i;return new Float32Array([2/(n-a),0,0,0,0,-2/(o-s),0,0,0,0,1,0,-(n+a)/(n-a),(o+s)/(o-s),0,1])}function se(e){let t=e.positions,r=new Float32Array(t.length),i=e.indices,a=i?i.length/3:t.length/9;for(let n=0;n<a;n++){let s=(i?i[n*3]:n*3)*3,o=(i?i[n*3+1]:n*3+1)*3,u=(i?i[n*3+2]:n*3+2)*3,c=t[o]-t[s],h=t[o+1]-t[s+1],l=t[o+2]-t[s+2],m=t[u]-t[s],v=t[u+1]-t[s+1],x=t[u+2]-t[s+2],p=h*x-l*v,b=l*m-c*x,_=c*v-h*m,f=Math.hypot(p,b,_)||1;p/=f,b/=f,_/=f;for(let M of[s,o,u])r[M]=p,r[M+1]=b,r[M+2]=_}return r}class C{static SIZE_BYTES=96;buffer;view;constructor(){this.buffer=new ArrayBuffer(C.SIZE_BYTES),this.view=new Float32Array(this.buffer)}set viewProj(e){this.view.set(e,0)}get viewProj(){return this.view.subarray(0,16)}set cameraPos([e,t,r]){this.view[16]=e,this.view[17]=t,this.view[18]=r}get cameraPos(){return[this.view[16],this.view[17],this.view[18]]}set zoom(e){this.view[19]=e}get zoom(){return this.view[19]}set aspectRatio(e){this.view[20]=e}get aspectRatio(){return this.view[20]}get bytes(){return this.view}}class Q{position;size;rotation;shape_type;sides;fill_style;border_color;border_thickness;extra_param;constructor(e,t,r,i,a,n,s,o,u){this.position=e,this.size=t,this.rotation=r,this.shape_type=i,this.sides=a,this.fill_style=n,this.border_color=s,this.border_thickness=o,this.extra_param=u}static desc(){return{arrayStride:72,stepMode:"instance",attributes:[{shaderLocation:0,format:"float32x3",offset:0},{shaderLocation:1,format:"float32x2",offset:12},{shaderLocation:2,format:"float32",offset:20},{shaderLocation:3,format:"uint32",offset:24},{shaderLocation:4,format:"uint32",offset:28},{shaderLocation:5,format:"float32x4",offset:32},{shaderLocation:6,format:"float32x4",offset:48},{shaderLocation:7,format:"float32",offset:64},{shaderLocation:8,format:"float32",offset:68}]}}}class X{canvas;glyphs=new Map;baseSize;spaceAdvance;constructor(e="sans-serif",t=256,r=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",i=2048){this.baseSize=t,this.canvas=new OffscreenCanvas(i,i);let a=this.canvas.getContext("2d");a.font=`${t}px ${e}`,a.textAlign="left",a.textBaseline="top",a.fillStyle="white";let n=2,s=0,o=0,u=0;for(let c of r){let h=a.measureText(c),l=Math.ceil(h.actualBoundingBoxLeft??0),m=Math.ceil(h.actualBoundingBoxRight??h.width),v=Math.ceil(h.actualBoundingBoxAscent),x=Math.ceil(h.actualBoundingBoxDescent),p=l+m+n*2,b=v+x+n*2;if(s+p>i)s=0,o+=u+n,u=0;a.fillText(c,s+l+n,o+v+n),this.glyphs.set(c,{u0:s/i,v0:o/i,u1:(s+p)/i,v1:(o+b)/i,width:p,height:b,advance:h.width}),s+=p,u=Math.max(u,b)}this.spaceAdvance=this.glyphs.get(" ")?.advance??t*0.3}}var oe=`struct CameraUniform {
    view_proj: mat4x4<f32>,
    camera_pos: vec3<f32>,
    zoom: f32,
    aspect_ratio: f32,
};

@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct MeshVertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
};

struct MeshInstanceInput {
    @location(2) model_col0: vec4<f32>,
    @location(3) model_col1: vec4<f32>,
    @location(4) model_col2: vec4<f32>,
    @location(5) model_col3: vec4<f32>,
    @location(6) color: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_normal: vec3<f32>,
    @location(1) world_position: vec3<f32>,
    @location(2) @interpolate(flat) color: vec4<f32>,
};

@vertex
fn vs_main(vertex: MeshVertexInput, instance: MeshInstanceInput) -> VertexOutput {
    let model = mat4x4<f32>(
        instance.model_col0,
        instance.model_col1,
        instance.model_col2,
        instance.model_col3,
    );

    var out: VertexOutput;
    let world_position = model * vec4<f32>(vertex.position, 1.0);
    out.clip_position = camera.view_proj * world_position;

    out.world_normal = (model * vec4<f32>(vertex.normal, 0.0)).xyz;
    out.world_position = world_position.xyz;
    out.color = instance.color;
    return out;
}
`;var ce=`struct CameraUniform {
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
`;class H{configs;ctx;device;queue;render_pipeline;instance_buffer;camera_buffer;camera_bind_group;num_instances=0;width=1;height=1;clearColor=[1,0,0,1];currentColor=[1,1,1,1];frameInstances=[];cameraPos=[0,0];zoom=1;viewProjectionMatrix=new Float32Array(16);currentZ=0;depth_texture;depth_texture_view;mesh_pipeline;mesh_instance_buffer;meshes=new Map;pendingMeshes=[];frameMeshInstances=[];meshDraws=[];cameraPos3=[0,0,0];fontAtlas;atlas_texture;atlas_sampler;atlas_bind_group_layout;atlas_bind_group;constructor(e,t){this.ctx=e.getContext("webgpu"),this.configs=t,this.fontAtlas=new X,(async()=>{await this.initializeWebGPU()})()}async initializeWebGPU(){if(!navigator.gpu){alert("WEBGPU IS NOT SUPPORTED ON YOUR DEVICE. YOU CAN UPGRADE YOUR BROWSER OR RESORT TO CANVAS/WEBGL.");return}let t=await(await navigator.gpu.requestAdapter())?.requestDevice(),r=t?.queue;if(!t||!r)return;let i=navigator.gpu.getPreferredCanvasFormat();this.ctx.configure({device:t,format:i,alphaMode:"opaque"});let a=this.ctx.canvas;this.width=a.width||1,this.height=a.height||1,this.depth_texture=t.createTexture({label:"depth texture",size:[this.width,this.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.depth_texture_view=this.depth_texture.createView();let n=new C;n.viewProj=W(this.width,this.height,this.cameraPos,this.zoom),n.cameraPos=[0,0,0],n.zoom=0.005,n.aspectRatio=this.ctx.canvas.width/this.ctx.canvas.height;let s=t.createBuffer({label:"camera buffer",size:n.bytes.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Float32Array(s.getMappedRange()).set(n.bytes),s.unmap();let o=t.createBindGroupLayout({label:"camera bind group layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!1,minBindingSize:0}}]}),u=t.createBindGroup({label:"camera bind group",layout:o,entries:[{binding:0,resource:{buffer:s}}]}),c=t.createShaderModule({label:"vertex shader",code:ae}),h=t.createShaderModule({label:"fragment shader",code:ne});this.atlas_texture=t.createTexture({label:"font atlas",size:[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),t.queue.copyExternalImageToTexture({source:this.fontAtlas.canvas},{texture:this.atlas_texture},[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height]),this.atlas_sampler=t.createSampler({magFilter:"linear",minFilter:"linear"}),this.atlas_bind_group_layout=t.createBindGroupLayout({label:"atlas bind group layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),this.atlas_bind_group=t.createBindGroup({label:"atlas bind group",layout:this.atlas_bind_group_layout,entries:[{binding:0,resource:this.atlas_texture.createView()},{binding:1,resource:this.atlas_sampler}]});let l=t.createPipelineLayout({label:"Render pipeline layout",bindGroupLayouts:[o,this.atlas_bind_group_layout],immediateSize:0}),m=t.createRenderPipeline({label:"render pipeline",layout:l,vertex:{module:c,entryPoint:"vs_main",buffers:[Q.desc()]},fragment:{module:h,entryPoint:"fs_main",targets:[{format:i,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"},multisample:{count:1,mask:4294967295,alphaToCoverageEnabled:!1},primitive:{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}}),v=t.createBuffer({label:"instance buffer",usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,size:294912,mappedAtCreation:!1}),x=t.createShaderModule({label:"mesh vertex shader",code:oe}),p=t.createShaderModule({label:"mesh fragment shader",code:ce}),b={arrayStride:24,attributes:[{shaderLocation:0,format:"float32x3",offset:0},{shaderLocation:1,format:"float32x3",offset:12}]},_={arrayStride:80,stepMode:"instance",attributes:[{shaderLocation:2,format:"float32x4",offset:0},{shaderLocation:3,format:"float32x4",offset:16},{shaderLocation:4,format:"float32x4",offset:32},{shaderLocation:5,format:"float32x4",offset:48},{shaderLocation:6,format:"float32x4",offset:64}]};this.mesh_pipeline=t.createRenderPipeline({label:"mesh render pipeline",layout:t.createPipelineLayout({label:"mesh pipeline layout",bindGroupLayouts:[o]}),vertex:{module:x,entryPoint:"vs_main",buffers:[b,_]},fragment:{module:p,entryPoint:"fs_main",targets:[{format:i}]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"},multisample:{count:1,mask:4294967295,alphaToCoverageEnabled:!1},primitive:{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}}),this.mesh_instance_buffer=t.createBuffer({label:"mesh instance buffer",usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,size:81920}),this.device=t,this.queue=r,this.render_pipeline=m,this.instance_buffer=v,this.camera_buffer=s,this.camera_bind_group=u,this.depth_texture=this.depth_texture,this.depth_texture_view=this.depth_texture_view;for(let[f,M]of this.pendingMeshes)this.uploadMesh(f,M);this.pendingMeshes.length=0}resize(e,t){if(!this.queue||!this.camera_buffer||!this.device)return;let r=window.devicePixelRatio,i=Math.floor(e*r),a=Math.floor(t*r);if(i>0&&a>0){if(this.width=i,this.height=a,this.ctx.canvas instanceof HTMLCanvasElement)this.ctx.canvas.width=i,this.ctx.canvas.height=a;this.depth_texture?.destroy(),this.depth_texture=this.device.createTexture({label:"depth texture",size:[i,a],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.depth_texture_view=this.depth_texture.createView()}}update(e){if(this.num_instances=e.length,e.length===0)return;let t=18,r=new Float32Array(e.length*t),i=new Uint32Array(r.buffer);e.forEach((n,s)=>{let o=s*t;r[o+0]=n.position[0],r[o+1]=n.position[1],r[o+2]=n.position[2],r[o+3]=n.size[0],r[o+4]=n.size[1],r[o+5]=n.rotation,i[o+6]=n.shape_type,i[o+7]=n.sides,r[o+8]=n.fill_style[0],r[o+9]=n.fill_style[1],r[o+10]=n.fill_style[2],r[o+11]=n.fill_style[3],r[o+12]=n.border_color[0],r[o+13]=n.border_color[1],r[o+14]=n.border_color[2],r[o+15]=n.border_color[3],r[o+16]=n.border_thickness,r[o+17]=n.extra_param});let a=r.byteLength;if(a>this.instance_buffer.size)this.instance_buffer.destroy(),this.instance_buffer=this.device.createBuffer({label:"dyn instance buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Float32Array(this.instance_buffer.getMappedRange()).set(r),this.instance_buffer.unmap();else this.queue.writeBuffer(this.instance_buffer,0,r)}update_camera(e,t){let r=Math.max(1,this.width/this.height),i=new C;i.viewProj=W(this.width,this.height,e,t),i.cameraPos=[...e,0],i.zoom=t,i.aspectRatio=r,this.queue.writeBuffer(this.camera_buffer,0,i.bytes.buffer)}render_entities_with_text(e,t,r){if(!e.length)return;this.update_camera(t,r),this.update(e);let a=this.ctx.getCurrentTexture().createView(),n=this.device.createCommandEncoder({label:"entities render encoder"}),s=n.beginRenderPass({label:"entities render pass",colorAttachments:[{view:a,resolveTarget:void 0,depthSlice:void 0,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}],depthStencilAttachment:{view:this.depth_texture_view,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"},occlusionQuerySet:void 0,timestampWrites:void 0});s.setPipeline(this.render_pipeline),s.setBindGroup(0,this.camera_bind_group),s.setBindGroup(1,this.atlas_bind_group),s.setVertexBuffer(0,this.instance_buffer),s.draw(6,this.num_instances),s.end(),this.queue.submit([n.finish()])}pushInstance(e){let[t,r,i,a]=this.currentColor;this.frameInstances.push({position:[...e.position,this.currentZ],size:e.size,rotation:e.rotation,shape_type:e.shape_type,sides:e.sides??0,fill_style:[t,r,i,a],border_color:[0,0,0,0],border_thickness:0,extra_param:e.extra_param??0})}clear(e,t,r,i){this.clearColor=[e/255,t/255,r/255,i]}setColor(e,t,r,i){this.currentColor=[e/255,t/255,r/255,i]}drawTriangle(e,t,r,i,a,n){let s=(e+r+a)/3,o=(t+i+n)/3,u=(Math.hypot(e-s,t-o)+Math.hypot(r-s,i-o)+Math.hypot(a-s,n-o))/3,c=Math.atan2(t-o,e-s);this.pushInstance({position:[s,o],size:[u*2,u*2],rotation:c,shape_type:3,sides:3})}drawRect(e,t,r,i){this.pushInstance({position:[e+r/2,t+i/2],size:[r,i],rotation:0,shape_type:1})}drawRegularPolygonImpl(e,t,r,i,a=0){this.pushInstance({position:[e,t],size:[r,r],rotation:a,shape_type:3,sides:i})}drawCustomSides(e,t,r,i,a){this.drawRegularPolygonImpl(e,t,r,i,a)}drawRegularPolygon(e,t,r,i,a){this.drawRegularPolygonImpl(e,t,r,i,a)}drawPolygon(e){if(!e.length)return;let t=e.reduce((n,s)=>n+s.x,0)/e.length,r=e.reduce((n,s)=>n+s.y,0)/e.length,i=e.reduce((n,{x:s,y:o})=>n+Math.hypot(s-t,o-r),0)/e.length,a=Math.atan2(e[0].y-r,e[0].x-t);this.pushInstance({position:[t,r],size:[i*2,i*2],rotation:a,shape_type:3,sides:e.length})}drawLine(e,t,r,i,a){let n=(e+r)/2,s=(t+i)/2,o=Math.hypot(r-e,i-t),u=Math.atan2(i-t,r-e);this.pushInstance({position:[n,s],size:[o,a],rotation:u,shape_type:1})}drawCircle(e,t,r){this.pushInstance({position:[e,t],size:[r*2,r*2],rotation:0,shape_type:3,sides:32})}flush(){if(!this.device||!this.queue||!this.render_pipeline){this.frameInstances.length=0,this.frameMeshInstances.length=0;return}this.update(this.frameInstances),this.updateMeshInstances();let e=this.ctx.getCurrentTexture().createView(),t=this.device.createCommandEncoder({label:"immediate-mode frame encoder"}),r=t.beginRenderPass({label:"immediate-mode frame pass",colorAttachments:[{view:e,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}],depthStencilAttachment:{view:this.depth_texture_view,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});if(this.meshDraws.length>0){r.setPipeline(this.mesh_pipeline),r.setBindGroup(0,this.camera_bind_group);for(let i of this.meshDraws)if(r.setVertexBuffer(0,i.mesh.vertexBuffer),r.setVertexBuffer(1,this.mesh_instance_buffer,i.byteOffset),i.mesh.indexBuffer)r.setIndexBuffer(i.mesh.indexBuffer,"uint32"),r.drawIndexed(i.mesh.indexCount,i.instanceCount);else r.draw(i.mesh.vertexCount,i.instanceCount)}if(this.num_instances>0)r.setPipeline(this.render_pipeline),r.setBindGroup(0,this.camera_bind_group),r.setBindGroup(1,this.atlas_bind_group),r.setVertexBuffer(0,this.instance_buffer),r.draw(6,this.num_instances);r.end(),this.queue.submit([t.finish()]),this.frameInstances=[],this.frameMeshInstances=[]}pushGlyphInstance(e,t,r){let[i,a,n,s]=this.currentColor;this.frameInstances.push({position:[...e,this.currentZ],size:t,rotation:0,shape_type:5,sides:0,fill_style:[i,a,n,s],border_color:r,border_thickness:0,extra_param:0})}setDepth(e){this.currentZ=e}drawText(e,t,r,i,a){if(!this.fontAtlas)return;let n=i/this.fontAtlas.baseSize,s=0;for(let u of r){let c=this.fontAtlas.glyphs.get(u);s+=c?c.advance*n:this.fontAtlas.spaceAdvance*n}let o=e;if(a===1)o-=s/2;else if(a===2)o-=s;for(let u of r){let c=this.fontAtlas.glyphs.get(u);if(!c){o+=this.fontAtlas.spaceAdvance*n;continue}let h=c.width*n,l=c.height*n;this.pushGlyphInstance([o+h/2,t+l/2],[h,l],[c.u0,c.v0,c.u1-c.u0,c.v1-c.v0]),o+=c.advance*n}}updateView(e){if(!this.queue||!this.camera_buffer)return;this.viewProjectionMatrix.set(e.viewProjectionMatrix.data),this.cameraPos3=[e.position.x,e.position.y,e.position.z];let t=new C;t.viewProj=this.viewProjectionMatrix,t.cameraPos=this.cameraPos3,t.zoom=this.zoom,t.aspectRatio=this.width/Math.max(1,this.height),this.queue.writeBuffer(this.camera_buffer,0,t.bytes.buffer)}createMesh(e,t){if(!this.device){this.pendingMeshes.push([e,t]);return}this.uploadMesh(e,t)}uploadMesh(e,t){if(t.positions.length%3!==0)throw Error("meshdata.positions length must be a multiple of 3");let r=t.normals??se(t),i=t.positions.length/3,a=new Float32Array(i*6);for(let c=0;c<i;c++)a[c*6+0]=t.positions[c*3],a[c*6+1]=t.positions[c*3+1],a[c*6+2]=t.positions[c*3+2],a[c*6+3]=r[c*3],a[c*6+4]=r[c*3+1],a[c*6+5]=r[c*3+2];let n=this.device.createBuffer({label:`mesh ${e} vertices`,size:a.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Float32Array(n.getMappedRange()).set(a),n.unmap();let s,o=0;if(t.indices&&t.indices.length>0)o=t.indices.length,s=this.device.createBuffer({label:`mesh ${e} indices`,size:t.indices.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Uint32Array(s.getMappedRange()).set(t.indices),s.unmap();let u=this.meshes.get(e);this.meshes.set(e,{vertexBuffer:n,indexBuffer:s,vertexCount:i,indexCount:o}),u?.vertexBuffer.destroy(),u?.indexBuffer?.destroy()}updateMeshInstances(){if(this.meshDraws=[],!this.frameMeshInstances.length)return;let e=20,t=new Map;for(let n of this.frameMeshInstances){let s=t.get(n.meshId);if(s)s.push(n);else t.set(n.meshId,[n])}let r=new Float32Array(this.frameMeshInstances.length*e),i=0;for(let[n,s]of t){let o=this.meshes.get(n);if(!o){console.warn(`WebGPUBackend: drawMesh referenced unknown mesh id ${n}`);continue}let u=i;for(let c of s)this.composeModelMatrix(c,r,i),r[i+16]=c.color[0],r[i+17]=c.color[1],r[i+18]=c.color[2],r[i+19]=c.color[3],i+=e;this.meshDraws.push({mesh:o,byteOffset:u*4,instanceCount:s.length})}if(i===0)return;let a=i*4;if(a>this.mesh_instance_buffer.size)this.mesh_instance_buffer.destroy(),this.mesh_instance_buffer=this.device.createBuffer({label:"dyn mesh instance buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Float32Array(this.mesh_instance_buffer.getMappedRange()).set(r.subarray(0,i)),this.mesh_instance_buffer.unmap();else this.queue.writeBuffer(this.mesh_instance_buffer,0,r,0,i)}composeModelMatrix(e,t,r){let[i,a,n]=e.position,[s,o,u,c]=e.rotation,[h,l,m]=e.scale,v=Math.hypot(s,o,u,c)||1,x=s/v,p=o/v,b=u/v,_=c/v;t[r+0]=(1-2*(p*p+b*b))*h,t[r+1]=2*(x*p+_*b)*h,t[r+2]=2*(x*b-_*p)*h,t[r+3]=0,t[r+4]=2*(x*p-_*b)*l,t[r+5]=(1-2*(x*x+b*b))*l,t[r+6]=2*(p*b+_*x)*l,t[r+7]=0,t[r+8]=2*(x*b+_*p)*m,t[r+9]=2*(p*b-_*x)*m,t[r+10]=(1-2*(x*x+p*p))*m,t[r+11]=0,t[r+12]=i,t[r+13]=a,t[r+14]=n,t[r+15]=1}drawMesh(e,t,r,i){let[a,n,s,o]=this.currentColor;this.frameMeshInstances.push({meshId:e,position:[t.x,t.y,t.z],rotation:[r.x,r.y,r.z,r.w],scale:[i.x,i.y,i.z],color:[a,n,s,o]})}}class Z{configs;backend;warnedNoView=!1;constructor(e,t){switch(this.configs=t,t.backend){case 0:this.backend=new q(e,t);break;case 2:this.backend=new H(e,t);break;case 1:this.backend=new Y(e,t);break;default:throw Error(`Unsupported backend: ${String(t.backend)}`)}}fn(e){let t=this.backend[e];if(typeof t!=="function")throw Error(`${this.backend.constructor.name} does not implement '${String(e)}()'.`);return t}clear(e,t,r,i){this.fn("clear").call(this.backend,e,t,r,i)}setColor(e,t,r,i){this.fn("setColor").call(this.backend,e,t,r,i)}drawLine(e,t,r){this.fn("drawLine").call(this.backend,e.x,e.y,t.x,t.y,r)}drawCircle(e,t,r){this.fn("drawCircle").call(this.backend,e,t,r)}drawRect(e,t,r,i,a){this.fn("drawRect").call(this.backend,e,t,r,i,a)}drawTriangle(e,t,r,i,a,n){this.fn("drawTriangle").call(this.backend,e,t,r,i,a,n)}drawRegularPolygon(e,t,r,i,a){this.fn("drawRegularPolygon").call(this.backend,e,t,r,i,a)}drawPolygon(e){this.fn("drawPolygon").call(this.backend,e)}drawText(e,t,r,i,a){this.fn("drawText").call(this.backend,e,t,r,i,a)}setDepth(e){this.fn("setDepth").call(this.backend,e)}createMesh(e,t){this.fn("createMesh").call(this.backend,e,t)}drawMesh(e,t,r=d.identity(),i=new y(1,1,1)){this.fn("drawMesh").call(this.backend,e,t,r,i)}updateView(e){if(typeof this.backend.updateView!=="function"){if(!this.warnedNoView)console.warn(`${this.backend.constructor.name} does not implement 'updateView()'.`),this.warnedNoView=!0;return}this.backend.updateView(e)}setCamera(e){this.updateView(e)}resize(e,t){this.backend.resize?.(e,t)}drawPentagon(e,t,r,i){this.drawRegularPolygon(e,t,r,5,i)}drawHexagon(e,t,r,i){this.drawRegularPolygon(e,t,r,6,i)}drawSeptagon(e,t,r,i){this.drawRegularPolygon(e,t,r,7,i)}drawOctagon(e,t,r,i){this.drawRegularPolygon(e,t,r,8,i)}processFrame(e){if(this.configs.debug)this.drawDebugPanel(e);this.fn("flush").call(this.backend)}drawDebugPanel(e){this.setColor(0,0,0,1),this.drawRect(10,10,400,200),this.setColor(255,255,255,1),this.drawText(200,35,"DEBUG PANEL",18,1),this.drawText(20,85,`FPS: ${e.toFixed(2)}`,16,0);let t=performance.memory;this.drawText(20,105,`Memory: ${t?`${(t.usedJSHeapSize/1048576).toFixed(2)}MB / ${(t.jsHeapSizeLimit/1048576).toFixed(2)}MB`:"N/A"}`,16,0),this.drawText(20,125,`CPU Cores: ${navigator.hardwareConcurrency||"N/A"}`,16,0),this.drawText(20,145,`Resolution: ${window.innerWidth}x${window.innerHeight}`,16,0),this.drawText(20,165,`Network: ${navigator.onLine?"Online":"Offline"} (${navigator.connection?.effectiveType||"unknown"})`,16,0)}}class pe{canvas;activeCamera;renderEvent;active=!1;fps=60;lastFrameTimestamp=performance.now();width;height;onFrame=()=>{};constructor(e,t){this.canvas=e,this.width=e.width||100,this.height=e.height||100,this.renderEvent=new Z(e,t)}start(){if(this.active)return;this.active=!0,this.lastFrameTimestamp=performance.now();let e=(t)=>{if(!this.active)return;let r=Math.min(t-this.lastFrameTimestamp,100);if(this.lastFrameTimestamp=t,r>0){let i=1000/r;this.fps=this.fps*0.9+i*0.1}if(this.onFrame(this.renderEvent,t,r),this.activeCamera)this.renderEvent.updateView(this.activeCamera);this.renderEvent.processFrame(this.fps),requestAnimationFrame(e)};requestAnimationFrame(e)}stop(){this.active=!1}setCamera(e){this.activeCamera=e,this.activeCamera.resize(this.width,this.height),this.renderEvent.updateView(this.activeCamera)}resize(e,t){if(this.width=e,this.height=t,this.canvas.width=e,this.canvas.height=t,this.renderEvent.resize(e,t),this.activeCamera)this.activeCamera.resize(e,t),this.renderEvent.updateView(this.activeCamera)}}class P{elements;rows;cols;constructor(e,t,r){this.rows=e,this.cols=t;let i=e*t;if(r){if(r.length!==i)throw Error(`Expected ${i} elements for a ${e}x${t} matrix, but got ${r.length}.`);this.elements=[...r]}else this.elements=Array(i).fill(0)}get(e,t){if(e<0||e>=this.rows||t<0||t>=this.cols)throw Error(`Index (${e}, ${t}) out of bounds for a ${this.rows}x${this.cols} matrix.`);return this.elements[e*this.cols+t]}set(e,t,r){if(e<0||e>=this.rows||t<0||t>=this.cols)throw Error(`Index (${e}, ${t}) out of bounds for a ${this.rows}x${this.cols} matrix.`);return this.elements[e*this.cols+t]=r,this}static identity(e){let t=new P(e,e);for(let r=0;r<e;r++)t.elements[r*e+r]=1;return t}static zeros(e,t){return new P(e,t)}clone(){return new P(this.rows,this.cols,this.elements)}transpose(){let e=new P(this.cols,this.rows);for(let t=0;t<this.rows;t++)for(let r=0;r<this.cols;r++)e.set(r,t,this.get(t,r));return e}multiply(e){let t=this.rows,r=e.cols,i=this.cols,a=Array(t*r).fill(0);for(let n=0;n<t;n++)for(let s=0;s<r;s++){let o=0;for(let u=0;u<i;u++)o+=this.get(n,u)*e.get(u,s);a[n*r+s]=o}return new P(t,r,a)}add(e){let t=this.elements.map((r,i)=>r+e.elements[i]);return new P(this.rows,this.cols,t)}sub(e){let t=this.elements.map((r,i)=>r-e.elements[i]);return new P(this.rows,this.cols,t)}scale(e){let t=this.elements.map((r)=>r*e);return new P(this.rows,this.cols,t)}equals(e){if(this.rows!==e.rows||this.cols!==e.cols)return!1;return this.elements.every((t,r)=>t===e.elements[r])}}class w{data=new Float32Array(16);constructor(e=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){this.data.set(e)}static fromQuaternion(e,t=new w){e.normalize();let{x:r,y:i,z:a,w:n}=e,s=r+r,o=i+i,u=a+a,c=n*s,h=n*o,l=n*u,m=r*s,v=r*o,x=r*u,p=i*o,b=i*u,_=a*u,f=t.data;return f[0]=1-p-_,f[1]=v+l,f[2]=x-h,f[3]=0,f[4]=v-l,f[5]=1-m-_,f[6]=b+c,f[7]=0,f[8]=x+h,f[9]=b-c,f[10]=1-m-p,f[11]=0,f[12]=0,f[13]=0,f[14]=0,f[15]=1,t}static fromVector3(e,t=new w){let{x:r,y:i,z:a}=e,n=t.data;return n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=1,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=1,n[11]=0,n[12]=r,n[13]=i,n[14]=a,n[15]=1,t}static multiply(e,t,r=new w){let i=r.data,a=e.data,n=t.data,s=a[0],o=a[1],u=a[2],c=a[3],h=a[4],l=a[5],m=a[6],v=a[7],x=a[8],p=a[9],b=a[10],_=a[11],f=a[12],M=a[13],A=a[14],V=a[15],z=n[0],E=n[1],R=n[2],T=n[3],B=n[4],L=n[5],S=n[6],D=n[7],U=n[8],I=n[9],G=n[10],O=n[11],k=n[12],F=n[13],j=n[14],N=n[15];return i[0]=s*z+h*E+x*R+f*T,i[1]=o*z+l*E+p*R+M*T,i[2]=u*z+m*E+b*R+A*T,i[3]=c*z+v*E+_*R+V*T,i[4]=s*B+h*L+x*S+f*D,i[5]=o*B+l*L+p*S+M*D,i[6]=u*B+m*L+b*S+A*D,i[7]=c*B+v*L+_*S+V*D,i[8]=s*U+h*I+x*G+f*O,i[9]=o*U+l*I+p*G+M*O,i[10]=u*U+m*I+b*G+A*O,i[11]=c*U+v*I+_*G+V*O,i[12]=s*k+h*F+x*j+f*N,i[13]=o*k+l*F+p*j+M*N,i[14]=u*k+m*F+b*j+A*N,i[15]=c*k+v*F+_*j+V*N,r}static getPerspectiveMatrix(e,t,r,i,a=new w){if(r<=0||r===i)return console.warn("Invalid near/far values."),a;let n=a.data,s=1/Math.tan(e*Math.PI/360),o=1/(r-i);return n[0]=s/t,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=s,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=(i+r)*o,n[11]=-1,n[12]=0,n[13]=0,n[14]=2*i*r*o,n[15]=0,a}static getOrthographicMatrix(e,t,r,i,a=-1,n=1,s=new w){if(e===t)return console.warn("Invalid left/right values."),s;if(r===i)return console.warn("Invalid bottom/top values."),s;if(a===n)return console.warn("Invalid near/far values."),s;let o=1/(e-t),u=1/(r-i),c=1/(a-n),h=s.data;return h[0]=-2*o,h[1]=0,h[2]=0,h[3]=0,h[4]=0,h[5]=-2*u,h[6]=0,h[7]=0,h[8]=0,h[9]=0,h[10]=2*c,h[11]=0,h[12]=(e+t)*o,h[13]=(i+r)*u,h[14]=(n+a)*c,h[15]=1,s}}class de{position;rotation;fov;aspectRatio;near;far;projectionMatrix=new w;viewMatrix=new w;viewProjectionMatrix=new w;constructor(e=60,t=1.7777777777777777,r=0.1,i=1000,a=new y(0,0,0),n=d.identity()){this.fov=e,this.aspectRatio=t,this.near=r,this.far=i,this.position=a,this.rotation=n,this.updateProjectionMatrix(),this.updateViewMatrix(),this.updateViewProjectionMatrix()}update(){this.updateViewMatrix(),this.updateViewProjectionMatrix()}updateProjectionMatrix(){w.getPerspectiveMatrix(this.fov,this.aspectRatio,this.near,this.far,this.projectionMatrix)}updateViewMatrix(){let e=this.rotation.conjugate(new d),t=w.fromQuaternion(e),r=new w;r.data[12]=-this.position.x,r.data[13]=-this.position.y,r.data[14]=-this.position.z,w.multiply(t,r,this.viewMatrix)}resize(e,t){if(t<=0)return;this.aspectRatio=e/t,this.updateProjectionMatrix(),this.updateViewProjectionMatrix()}updateViewProjectionMatrix(){w.multiply(this.projectionMatrix,this.viewMatrix,this.viewProjectionMatrix)}}class be{position;rotation;left;right;top;bottom;near;far;projectionMatrix=new w;viewMatrix=new w;viewProjectionMatrix=new w;constructor(e,t=1.7777777777777777,r=-1,i=1,a=new y(0,0,0),n=d.identity()){this.left=-e/2,this.right=e/2,this.top=e/t/2,this.bottom=-(e/t)/2,this.near=r,this.far=i,this.position=a,this.rotation=n,this.updateProjectionMatrix(),this.updateViewMatrix(),this.updateViewProjectionMatrix()}update(){this.updateViewMatrix(),this.updateViewProjectionMatrix()}updateProjectionMatrix(){w.getOrthographicMatrix(this.left,this.right,this.bottom,this.top,this.near,this.far,this.projectionMatrix)}updateViewMatrix(){let e=this.rotation.conjugate(new d),t=w.fromQuaternion(e),r=new w;r.data[12]=-this.position.x,r.data[13]=-this.position.y,r.data[14]=-this.position.z,w.multiply(t,r,this.viewMatrix)}updateViewProjectionMatrix(){w.multiply(this.projectionMatrix,this.viewMatrix,this.viewProjectionMatrix)}resize(e,t){if(t<=0)return;this.left=-e/2,this.right=e/2,this.top=t/2,this.bottom=-t/2,this.updateProjectionMatrix(),this.updateViewProjectionMatrix()}}var K=new y(1,0,0),J=new y(0,1,0);function ee(e,t,r,i){let a=2*(e.y*i-e.z*r),n=2*(e.z*t-e.x*i),s=2*(e.x*r-e.y*t);return[t+e.w*a+(e.y*s-e.z*n),r+e.w*n+(e.z*a-e.x*s),i+e.w*s+(e.x*n-e.y*a)]}class fe{camera;enabled=!0;target;distance;yaw;pitch;minDistance;maxDistance;minPitch;maxPitch;rotateSpeed;panSpeed;zoomSpeed;dragMode=0;lastX=0;lastY=0;constructor(e,t={}){this.camera=e,this.target=t.target??new y(0,0,0),this.distance=t.distance??10,this.yaw=t.yaw??0,this.pitch=t.pitch??Math.PI/6,this.minDistance=t.minDistance??0.1,this.maxDistance=t.maxDistance??2000,this.minPitch=t.minPitch??-Math.PI/2+0.01,this.maxPitch=t.maxPitch??Math.PI/2-0.01,this.rotateSpeed=t.rotateSpeed??0.005,this.panSpeed=t.panSpeed??0.002,this.zoomSpeed=t.zoomSpeed??0.001}attach(e){let t=(s)=>{if(!this.enabled)return;this.dragMode=s.button===0&&!s.shiftKey?1:2,this.lastX=s.clientX,this.lastY=s.clientY,e.setPointerCapture(s.pointerId)},r=(s)=>{if(!this.enabled||this.dragMode===0)return;let o=s.clientX-this.lastX,u=s.clientY-this.lastY;if(this.lastX=s.clientX,this.lastY=s.clientY,this.dragMode===1)this.yaw-=o*this.rotateSpeed,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,this.pitch+u*this.rotateSpeed));else this.pan(o,u)},i=()=>{this.dragMode=0},a=(s)=>{if(!this.enabled)return;s.preventDefault(),this.distance=Math.min(this.maxDistance,Math.max(this.minDistance,this.distance*Math.exp(s.deltaY*this.zoomSpeed)))},n=(s)=>s.preventDefault();return e.addEventListener("pointerdown",t),e.addEventListener("pointermove",r),e.addEventListener("pointerup",i),e.addEventListener("wheel",a,{passive:!1}),e.addEventListener("contextmenu",n),this}update(e=0){let t=Math.cos(this.pitch),r=t*Math.sin(this.yaw),i=Math.sin(this.pitch),a=t*Math.cos(this.yaw);this.camera.position.x=this.target.x+r*this.distance,this.camera.position.y=this.target.y+i*this.distance,this.camera.position.z=this.target.z+a*this.distance;let n=d.fromAxisAngle(J,this.yaw,new d),s=d.fromAxisAngle(K,-this.pitch,new d);d.multiply(n,s,this.camera.rotation),this.camera.update()}pan(e,t){let r=d.fromAxisAngle(J,this.yaw,new d),i=d.fromAxisAngle(K,-this.pitch,new d),a=d.multiply(r,i,new d),[n,s,o]=ee(a,1,0,0),[u,c,h]=ee(a,0,1,0),l=this.distance*this.panSpeed;this.target.x+=(-n*e+u*t)*l,this.target.y+=(-s*e+c*t)*l,this.target.z+=(-o*e+h*t)*l}}class xe{camera;enabled=!0;yaw;pitch;speed;fastMultiplier;sensitivity;keys=new Set;constructor(e,t={}){this.camera=e,this.yaw=t.yaw??0,this.pitch=t.pitch??0,this.speed=t.speed??5,this.fastMultiplier=t.fastMultiplier??4,this.sensitivity=t.sensitivity??0.002}attach(e){let t=(s)=>{if(!this.enabled||s.button!==0)return;e.requestPointerLock?.()},r=(s)=>{if(!this.enabled||document.pointerLockElement!==e)return;this.yaw-=s.movementX*this.sensitivity,this.pitch=Math.max(-Math.PI/2+0.001,Math.min(Math.PI/2-0.001,this.pitch-s.movementY*this.sensitivity))},i=(s)=>this.keys.add(s.code),a=(s)=>this.keys.delete(s.code),n=()=>this.keys.clear();return e.addEventListener("pointerdown",t),document.addEventListener("mousemove",r),window.addEventListener("keydown",i),window.addEventListener("keyup",a),window.addEventListener("blur",n),this}update(e){let t=Math.min(e,0.1),r=this.speed*(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?this.fastMultiplier:1)*t,i=d.fromAxisAngle(J,this.yaw,new d),a=d.fromAxisAngle(K,this.pitch,new d);d.multiply(i,a,this.camera.rotation);let[n,s,o]=this.forward(),[u,,c]=ee(this.camera.rotation,1,0,0),h=this.camera.position;if(this.keys.has("KeyW"))h.x+=n*r,h.y+=s*r,h.z+=o*r;if(this.keys.has("KeyS"))h.x-=n*r,h.y-=s*r,h.z-=o*r;if(this.keys.has("KeyA"))h.x-=u*r,h.z-=c*r;if(this.keys.has("KeyD"))h.x+=u*r,h.z+=c*r;if(this.keys.has("Space"))h.y+=r;if(this.keys.has("KeyC"))h.y-=r;this.camera.update()}forward(){let e=Math.cos(this.pitch);return[-e*Math.sin(this.yaw),Math.sin(this.pitch),-e*Math.cos(this.yaw)]}}class ve{static box(e=1,t=1,r=1){let i=e/2,a=t/2,n=r/2,s=[],o=[],u=[],c=[[[0,0,1],[[-i,-a,n],[i,-a,n],[i,a,n],[-i,a,n]]],[[0,0,-1],[[i,-a,-n],[-i,-a,-n],[-i,a,-n],[i,a,-n]]],[[1,0,0],[[i,-a,n],[i,-a,-n],[i,a,-n],[i,a,n]]],[[-1,0,0],[[-i,-a,-n],[-i,-a,n],[-i,a,n],[-i,a,-n]]],[[0,1,0],[[-i,a,n],[i,a,n],[i,a,-n],[-i,a,-n]]],[[0,-1,0],[[-i,-a,-n],[i,-a,-n],[i,-a,n],[-i,-a,n]]]];for(let[h,l]of c){let m=s.length/3;for(let v of l)s.push(v[0],v[1],v[2]),o.push(h[0],h[1],h[2]);u.push(m,m+1,m+2,m,m+2,m+3)}return{positions:new Float32Array(s),normals:new Float32Array(o),indices:new Uint32Array(u)}}static plane(e=1,t=1,r=1){let i=[],a=[],n=[],s=e/2,o=t/2;for(let c=0;c<=r;c++){let h=-o+c/r*t;for(let l=0;l<=r;l++)i.push(-s+l/r*e,0,h),a.push(0,1,0)}let u=r+1;for(let c=0;c<r;c++)for(let h=0;h<r;h++){let l=c*u+h;n.push(l,l+u,l+u+1,l,l+u+1,l+1)}return{positions:new Float32Array(i),normals:new Float32Array(a),indices:new Uint32Array(n)}}static sphere(e=1,t=32,r=16){let i=[],a=[],n=[];for(let s=0;s<=r;s++){let o=s/r*Math.PI;for(let u=0;u<=t;u++){let c=u/t*Math.PI*2,h=-Math.cos(c)*Math.sin(o),l=Math.cos(o),m=Math.sin(c)*Math.sin(o);i.push(h*e,l*e,m*e),a.push(h,l,m)}}for(let s=0;s<r;s++)for(let o=0;o<t;o++){let u=s*(t+1)+o,c=u+t+1;n.push(u,c,u+1,c,c+1,u+1)}return{positions:new Float32Array(i),normals:new Float32Array(a),indices:new Uint32Array(n)}}static cylinder(e=1,t=1,r=32){let i=[],a=[],n=[],s=t/2;for(let o=0;o<=r;o++){let u=o/r*Math.PI*2,c=Math.cos(u),h=Math.sin(u);i.push(c*e,-s,h*e,c*e,s,h*e),a.push(c,0,h,c,0,h)}for(let o=0;o<r;o++){let u=o*2;n.push(u,u+1,u+3,u,u+3,u+2)}for(let o of[1,-1]){let u=s*o,c=i.length/3;i.push(0,u,0),a.push(0,o,0);let h=c+1;for(let l=0;l<=r;l++){let m=l/r*Math.PI*2;i.push(Math.cos(m)*e,u,Math.sin(m)*e),a.push(0,o,0)}for(let l=0;l<r;l++)if(o===1)n.push(c,h+l+1,h+l);else n.push(c,h+l,h+l+1)}return{positions:new Float32Array(i),normals:new Float32Array(a),indices:new Uint32Array(n)}}}export{te as Backends,pe as Engine,xe as FPSController,P as Matrix,w as Matrix4,ve as MeshBuilder,fe as OrbitCameraController,be as OrthographicCamera,de as PerspectiveCamera,d as Quaternion,Z as RenderEvent,g as Vector2,y as Vector3,se as computeFlatNormals,W as computeViewProjMatrix,Be as normalizedToScreenCoords,Le as project};

//# debugId=BDBB05D171376F6364756E2164756E21
//# sourceMappingURL=index.js.map
