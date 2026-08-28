class N{configs;ctx;constructor(t,r){this.configs=r,this.ctx=t.getContext("2d")}clear(t,r,e,i){this.ctx.fillStyle=`rgba(${t}, ${r}, ${e}, ${i})`,this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}setColor(t,r,e,i){this.ctx.fillStyle=`rgba(${t}, ${r}, ${e}, ${i})`}drawLine(t,r,e,i,a){this.ctx.lineWidth=a,this.ctx.beginPath(),this.ctx.moveTo(t,r),this.ctx.lineTo(e,i),this.ctx.closePath(),this.ctx.stroke()}drawCircle(t,r,e){this.ctx.beginPath(),this.ctx.arc(t,r,e,0,Math.PI*2),this.ctx.fill()}drawTriangle(t,r,e,i,a,n){this.ctx.beginPath(),this.ctx.moveTo(t,r),this.ctx.lineTo(e,i),this.ctx.lineTo(a,n),this.ctx.lineTo(t,r),this.ctx.closePath(),this.ctx.fill()}drawRect(t,r,e,i){this.ctx.fillRect(t,r,e,i)}drawRegularPolygon(t,r,e,i,a){a=a||0,this.ctx.beginPath();for(let n=a;n<Math.PI*2+a;n+=Math.PI*2/i){let o={x:t+e*Math.cos(n),y:r+e*Math.sin(n)};this.ctx[n===a?"moveTo":"lineTo"](o.x,o.y)}this.ctx.closePath(),this.ctx.fill()}drawPolygon(t){this.ctx.beginPath(),this.ctx.moveTo(t[0].x,t[0].y);for(let r=1;r<t.length;r++)this.ctx.lineTo(t[r].x,t[r].y);this.ctx.closePath(),this.ctx.fill()}drawText(t,r,e,i,a){this.ctx.font=`${i}px sans-serif`,this.ctx.textAlign=a===0?"left":a===1?"center":"right",this.ctx.fillText(e,t,r)}resize(t,r){}}var tt=`#version 300 es

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
}`;var et=`#version 300 es

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
}`;class q{configs;ctx;shaderLocations;vao;vertexBuffer;floatsPerVertex=10;trianglesPerBatch=1e4;batchData;batchOffset;currentColor=[1,0,0,1];viewProjectionMatrix=new Float32Array(16);constructor(t,r){this.configs=r,this.ctx=t.getContext("webgl2"),this.shaderLocations=this.initShaderProgram(tt,et),this.ctx.enable(this.ctx.BLEND),this.ctx.blendFunc(this.ctx.SRC_ALPHA,this.ctx.ONE_MINUS_SRC_ALPHA),this.ctx.useProgram(this.shaderLocations.program),this.vao=this.ctx.createVertexArray(),this.ctx.bindVertexArray(this.vao),this.vertexBuffer=this.ctx.createBuffer(),this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferData(this.ctx.ARRAY_BUFFER,this.floatsPerVertex*this.trianglesPerBatch*3*4,this.ctx.DYNAMIC_DRAW);let e=this.floatsPerVertex*4;this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.position),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.position,3,this.ctx.FLOAT,!1,e,0),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.texCoord),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.texCoord,2,this.ctx.FLOAT,!1,e,12),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.colour),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.colour,4,this.ctx.FLOAT,!1,e,20),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.type),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.type,1,this.ctx.FLOAT,!1,e,36),this.ctx.bindVertexArray(null),this.batchData=new Float32Array(this.trianglesPerBatch*3*this.floatsPerVertex),this.batchOffset=0,this.resize(500,500)}initShaderProgram(t,r){let e=this.ctx.createProgram();return this.ctx.attachShader(e,this.loadShader(this.ctx.VERTEX_SHADER,t)),this.ctx.attachShader(e,this.loadShader(this.ctx.FRAGMENT_SHADER,r)),this.ctx.linkProgram(e),{program:e,attributes:{position:this.ctx.getAttribLocation(e,"a_position"),texCoord:this.ctx.getAttribLocation(e,"a_texCoord"),colour:this.ctx.getAttribLocation(e,"a_colour"),type:this.ctx.getAttribLocation(e,"a_type")},uniforms:{viewProjection:this.ctx.getUniformLocation(e,"u_viewProjection")}}}loadShader(t,r){let e=this.ctx.createShader(t);if(this.ctx.shaderSource(e,r),this.ctx.compileShader(e),!this.ctx.getShaderParameter(e,this.ctx.COMPILE_STATUS))throw Error("Shader Error: "+this.ctx.getShaderInfoLog(e));return e}flush(){if(this.batchOffset===0)return;this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferSubData(this.ctx.ARRAY_BUFFER,0,this.batchData,0,this.batchOffset),this.ctx.bindVertexArray(this.vao),this.ctx.drawArrays(this.ctx.TRIANGLES,0,this.batchOffset/this.floatsPerVertex),this.ctx.bindVertexArray(null),this.batchOffset=0}addVertex(t,r,e=0,i,a,n,o,s,u,c){if(this.batchOffset+this.floatsPerVertex>this.batchData.length)this.flush();this.batchData[this.batchOffset++]=t,this.batchData[this.batchOffset++]=r,this.batchData[this.batchOffset++]=e,this.batchData[this.batchOffset++]=i,this.batchData[this.batchOffset++]=a,this.batchData[this.batchOffset++]=n,this.batchData[this.batchOffset++]=o,this.batchData[this.batchOffset++]=s,this.batchData[this.batchOffset++]=u,this.batchData[this.batchOffset++]=c}clear(t,r,e,i){this.ctx.clearColor(t/255,r/255,e/255,i),this.ctx.clear(this.ctx.COLOR_BUFFER_BIT)}setColor(t,r,e,i){this.currentColor=[t/255,r/255,e/255,i]}drawLine(t,r,e,i,a){let n=e-t,o=i-r,s=Math.hypot(n,o);if(s===0)return;let u=-o/s*(a/2),c=n/s*(a/2);this.drawTriangle(t+u,r+c,t-u,r-c,e+u,i+c),this.drawTriangle(e+u,i+c,e-u,i-c,t-u,r-c)}drawCircle(t,r,e){let[i,a,n,o]=this.currentColor;this.addVertex(t-e,r-e,0,0,0,i,a,n,o,2),this.addVertex(t+e,r-e,0,1,0,i,a,n,o,2),this.addVertex(t+e,r+e,0,1,1,i,a,n,o,2),this.addVertex(t-e,r-e,0,0,0,i,a,n,o,2),this.addVertex(t-e,r+e,0,0,1,i,a,n,o,2),this.addVertex(t+e,r+e,0,1,1,i,a,n,o,2)}drawRect(t,r,e,i){let[a,n,o,s]=this.currentColor;this.addVertex(t,r,0,0,0,a,n,o,s,1),this.addVertex(t+e,r,0,1,0,a,n,o,s,1),this.addVertex(t+e,r+i,0,1,1,a,n,o,s,1),this.addVertex(t,r,0,0,0,a,n,o,s,1),this.addVertex(t,r+i,0,0,1,a,n,o,s,1),this.addVertex(t+e,r+i,0,1,1,a,n,o,s,1)}drawTriangle(t,r,e,i,a,n){let[o,s,u,c]=this.currentColor;this.addVertex(t,r,0,0,0,o,s,u,c,1),this.addVertex(e,i,0,0,0,o,s,u,c,1),this.addVertex(a,n,0,0,0,o,s,u,c,1)}drawRegularPolygon(t,r,e,i,a=0){if(i<3)return;let n=Math.PI*2/i,o=t+e*Math.cos(a),s=r+e*Math.sin(a);for(let u=1;u<=i;u++){let c=a+u*n,l=t+e*Math.cos(c),m=r+e*Math.sin(c);this.drawTriangle(t,r,o,s,l,m),o=l,s=m}}updateView(t){this.flush(),this.ctx.uniformMatrix4fv(this.shaderLocations.uniforms.viewProjection,!1,t.viewProjectionMatrix.data)}resize(t,r){this.ctx.viewport(0,0,t,r)}}var rt=`const PI: f32 = 3.14159265359;

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
`;var it=`struct CameraUniform {
    view_proj: mat4x4<f32>,
    camera_pos: vec2<f32>,
    zoom: f32,
    aspect_ratio: f32,
};

@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct InstanceInput {
    @location(0) pos: vec2<f32>,
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
    let world_pos = instance.pos + rotated_pos;

    out.clip_position = camera.view_proj * vec4<f32>(world_pos, 0.0, 1.0);
    out.uv = local_position;
    out.world_pos = world_pos;
    out.shape_type = instance.shape_type;
    out.sides = instance.sides;
    out.fill_color = instance.fill_color;
    out.border_color = instance.border_color;
    out.border_thickness = instance.border_thickness;
    out.extra_param = instance.extra_param;
    out.size = instance.size;

    return out;
}
`;function W(t,r,e,i){let a=e[0],n=a+t/i,o=e[1],s=o+r/i;return new Float32Array([2/(n-a),0,0,0,0,-2/(s-o),0,0,0,0,1,0,-(n+a)/(n-a),(s+o)/(s-o),0,1])}class y{static SIZE_BYTES=80;buffer;view;constructor(){this.buffer=new ArrayBuffer(y.SIZE_BYTES),this.view=new Float32Array(this.buffer)}set viewProj(t){this.view.set(t,0)}get viewProj(){return this.view.subarray(0,16)}set cameraPos([t,r]){this.view[16]=t,this.view[17]=r}get cameraPos(){return[this.view[16],this.view[17]]}set zoom(t){this.view[18]=t}get zoom(){return this.view[18]}set aspectRatio(t){this.view[19]=t}get aspectRatio(){return this.view[19]}get bytes(){return this.view}}class X{position;size;rotation;shape_type;sides;fill_style;border_color;border_thickness;extra_param;constructor(t,r,e,i,a,n,o,s,u){this.position=t,this.size=r,this.rotation=e,this.shape_type=i,this.sides=a,this.fill_style=n,this.border_color=o,this.border_thickness=s,this.extra_param=u}static desc(){return{arrayStride:68,stepMode:"instance",attributes:[{shaderLocation:0,format:"float32x2",offset:0},{shaderLocation:1,format:"float32x2",offset:8},{shaderLocation:2,format:"float32",offset:16},{shaderLocation:3,format:"uint32",offset:20},{shaderLocation:4,format:"uint32",offset:24},{shaderLocation:5,format:"float32x4",offset:28},{shaderLocation:6,format:"float32x4",offset:44},{shaderLocation:7,format:"float32",offset:60},{shaderLocation:8,format:"float32",offset:64}]}}}class Z{canvas;glyphs=new Map;baseSize;spaceAdvance;constructor(t="sans-serif",r=256,e=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",i=2048){this.baseSize=r,this.canvas=new OffscreenCanvas(i,i);let a=this.canvas.getContext("2d");a.font=`${r}px ${t}`,a.textAlign="left",a.textBaseline="top",a.fillStyle="white";let n=2,o=0,s=0,u=0;for(let c of e){let l=a.measureText(c),m=Math.ceil(l.actualBoundingBoxLeft??0),x=Math.ceil(l.actualBoundingBoxRight??l.width),d=Math.ceil(l.actualBoundingBoxAscent),w=Math.ceil(l.actualBoundingBoxDescent),p=m+x+n*2,v=d+w+n*2;if(o+p>i)o=0,s+=u+n,u=0;a.fillText(c,o+m+n,s+d+n),this.glyphs.set(c,{u0:o/i,v0:s/i,u1:(o+p)/i,v1:(s+v)/i,width:p,height:v,advance:l.width}),o+=p,u=Math.max(u,v)}this.spaceAdvance=this.glyphs.get(" ")?.advance??r*0.3}}class Q{configs;ctx;device;queue;render_pipeline;instance_buffer;camera_buffer;camera_bind_group;num_instances=0;width=1;height=1;clearColor=[1,0,0,1];currentColor=[1,1,1,1];frameInstances=[];cameraPos=[0,0];zoom=1;fontAtlas;atlas_texture;atlas_sampler;atlas_bind_group_layout;atlas_bind_group;constructor(t,r){this.ctx=t.getContext("webgpu"),this.configs=r,this.fontAtlas=new Z,(async()=>{await this.initializeWebGPU()})()}async initializeWebGPU(){if(!navigator.gpu){alert("WEBGPU IS NOT SUPPORTED ON YOUR DEVICE. YOU CAN UPGRADE YOUR BROWSER OR RESORT TO CANVAS2D/WEBGL.");return}let r=await(await navigator.gpu.requestAdapter())?.requestDevice(),e=r?.queue;if(!r||!e)return;let i=navigator.gpu.getPreferredCanvasFormat();this.ctx.configure({device:r,format:i,alphaMode:"opaque"});let a=this.ctx.canvas;this.width=a.width||1,this.height=a.height||1;let n=new y;n.viewProj=W(this.width,this.height,this.cameraPos,this.zoom),n.cameraPos=[0,0],n.zoom=0.005,n.aspectRatio=this.ctx.canvas.width/this.ctx.canvas.height;let o=r.createBuffer({label:"camera buffer",size:n.bytes.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Float32Array(o.getMappedRange()).set(n.bytes),o.unmap();let s=r.createBindGroupLayout({label:"camera bind group layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!1,minBindingSize:0}}]}),u=r.createBindGroup({label:"camera bind group",layout:s,entries:[{binding:0,resource:{buffer:o}}]}),c=r.createShaderModule({label:"vertex shader",code:it}),l=r.createShaderModule({label:"fragment shader",code:rt});this.atlas_texture=r.createTexture({label:"font atlas",size:[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),r.queue.copyExternalImageToTexture({source:this.fontAtlas.canvas},{texture:this.atlas_texture},[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height]),this.atlas_sampler=r.createSampler({magFilter:"linear",minFilter:"linear"}),this.atlas_bind_group_layout=r.createBindGroupLayout({label:"atlas bind group layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),this.atlas_bind_group=r.createBindGroup({label:"atlas bind group",layout:this.atlas_bind_group_layout,entries:[{binding:0,resource:this.atlas_texture.createView()},{binding:1,resource:this.atlas_sampler}]});let m=r.createPipelineLayout({label:"Render pipeline layout",bindGroupLayouts:[s,this.atlas_bind_group_layout],immediateSize:0}),x=r.createRenderPipeline({label:"render pipeline",layout:m,vertex:{module:c,entryPoint:"vs_main",buffers:[X.desc()]},fragment:{module:l,entryPoint:"fs_main",targets:[{format:i,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},depthStencil:void 0,multisample:{count:1,mask:4294967295,alphaToCoverageEnabled:!1},primitive:{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}}),d=r.createBuffer({label:"instance buffer",usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,size:278528,mappedAtCreation:!1});this.device=r,this.queue=e,this.render_pipeline=x,this.instance_buffer=d,this.camera_buffer=o,this.camera_bind_group=u}resize(t,r){if(!this.queue||!this.camera_buffer)return;let e=window.devicePixelRatio,i=Math.floor(t*e),a=Math.floor(r*e);if(i>0&&a>0){if(this.width=i,this.height=a,this.ctx.canvas instanceof HTMLCanvasElement)this.ctx.canvas.width=i,this.ctx.canvas.height=a;let n=i/a,o=new y;o.viewProj=W(this.width,this.height,this.cameraPos,this.zoom),o.cameraPos=this.cameraPos,o.zoom=this.zoom,o.aspectRatio=n,this.queue.writeBuffer(this.camera_buffer,0,o.bytes.buffer)}}update(t){if(this.num_instances=t.length,t.length===0)return;let r=17,e=new Float32Array(t.length*r),i=new Uint32Array(e.buffer);t.forEach((n,o)=>{let s=o*r;e[s+0]=n.position[0],e[s+1]=n.position[1],e[s+2]=n.size[0],e[s+3]=n.size[1],e[s+4]=n.rotation,i[s+5]=n.shape_type,i[s+6]=n.sides,e[s+7]=n.fill_style[0],e[s+8]=n.fill_style[1],e[s+9]=n.fill_style[2],e[s+10]=n.fill_style[3],e[s+11]=n.border_color[0],e[s+12]=n.border_color[1],e[s+13]=n.border_color[2],e[s+14]=n.border_color[3],e[s+15]=n.border_thickness,e[s+16]=n.extra_param});let a=e.byteLength;if(a>this.instance_buffer.size)this.instance_buffer.destroy(),this.instance_buffer=this.device.createBuffer({label:"dyn instance buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Float32Array(this.instance_buffer.getMappedRange()).set(e),this.instance_buffer.unmap();else this.queue.writeBuffer(this.instance_buffer,0,e)}update_camera(t,r){let e=Math.max(1,this.width/this.height),i=new y;i.viewProj=W(this.width,this.height,t,r),i.cameraPos=t,i.zoom=r,i.aspectRatio=e,this.queue.writeBuffer(this.camera_buffer,0,i.bytes.buffer)}render_entities_with_text(t,r,e){if(!t.length)return;this.update_camera(r,e),this.update(t);let a=this.ctx.getCurrentTexture().createView(),n=this.device.createCommandEncoder({label:"entities render encoder"}),o=n.beginRenderPass({label:"entities render pass",colorAttachments:[{view:a,resolveTarget:void 0,depthSlice:void 0,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}],depthStencilAttachment:void 0,occlusionQuerySet:void 0,timestampWrites:void 0});o.setPipeline(this.render_pipeline),o.setBindGroup(0,this.camera_bind_group),o.setBindGroup(1,this.atlas_bind_group),o.setVertexBuffer(0,this.instance_buffer),o.draw(6,this.num_instances),o.end(),this.queue.submit([n.finish()])}pushInstance(t){let[r,e,i,a]=this.currentColor;this.frameInstances.push({position:t.position,size:t.size,rotation:t.rotation,shape_type:t.shape_type,sides:t.sides??0,fill_style:[r,e,i,a],border_color:[0,0,0,0],border_thickness:0,extra_param:t.extra_param??0})}clear(t,r,e,i){this.clearColor=[t/255,r/255,e/255,i]}setColor(t,r,e,i){this.currentColor=[t/255,r/255,e/255,i]}drawTriangle(t,r,e,i,a,n){let o=(t+e+a)/3,s=(r+i+n)/3,u=(Math.hypot(t-o,r-s)+Math.hypot(e-o,i-s)+Math.hypot(a-o,n-s))/3,c=Math.atan2(r-s,t-o);this.pushInstance({position:[o,s],size:[u*2,u*2],rotation:c,shape_type:3,sides:3})}drawRect(t,r,e,i){this.pushInstance({position:[t+e/2,r+i/2],size:[e,i],rotation:0,shape_type:1})}drawRegularPolygonImpl(t,r,e,i,a=0){this.pushInstance({position:[t,r],size:[e,e],rotation:a,shape_type:3,sides:i})}drawCustomSides(t,r,e,i,a){this.drawRegularPolygonImpl(t,r,e,i,a)}drawRegularPolygon(t,r,e,i,a){this.drawRegularPolygonImpl(t,r,e,i,a)}drawPolygon(t){if(!t.length)return;let r=t.reduce((n,o)=>n+o.x,0)/t.length,e=t.reduce((n,o)=>n+o.y,0)/t.length,i=t.reduce((n,o)=>n+Math.hypot(o.x-r,o.y-e),0)/t.length,a=0;this.pushInstance({position:[r,e],size:[i*2,i*2],rotation:a,shape_type:3,sides:t.length})}flush(){if(!this.device||!this.queue||!this.render_pipeline)return;this.update_camera(this.cameraPos,this.zoom),this.update(this.frameInstances);let t=this.ctx.getCurrentTexture().createView(),r=this.device.createCommandEncoder({label:"immediate-mode frame encoder"}),e=r.beginRenderPass({label:"immediate-mode frame pass",colorAttachments:[{view:t,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}]});if(this.num_instances>0)e.setPipeline(this.render_pipeline),e.setBindGroup(0,this.camera_bind_group),e.setBindGroup(1,this.atlas_bind_group),e.setVertexBuffer(0,this.instance_buffer),e.draw(6,this.num_instances);e.end(),this.queue.submit([r.finish()]),this.frameInstances=[]}pushGlyphInstance(t,r,e){let[i,a,n,o]=this.currentColor;this.frameInstances.push({position:t,size:r,rotation:0,shape_type:5,sides:0,fill_style:[i,a,n,o],border_color:e,border_thickness:0,extra_param:0})}drawText(t,r,e,i,a){if(!this.fontAtlas)return;let n=i/this.fontAtlas.baseSize,o=0;for(let u of e){let c=this.fontAtlas.glyphs.get(u);o+=c?c.advance*n:this.fontAtlas.spaceAdvance*n}let s=t;if(a===1)s-=o/2;else if(a===2)s-=o;for(let u of e){let c=this.fontAtlas.glyphs.get(u);if(!c){s+=this.fontAtlas.spaceAdvance*n;continue}let l=c.width*n,m=c.height*n;this.pushGlyphInstance([s+l/2,r+m/2],[l,m],[c.u0,c.v0,c.u1-c.u0,c.v1-c.v0]),s+=c.advance*n}}}var st={};var H;((i)=>{i[i.CANVAS=0]="CANVAS";i[i.WEBGL=1]="WEBGL";i[i.WEBGPU=2]="WEBGPU"})(H||={});class J{configs;backend;constructor(t,r){switch(this.configs=r,this.configs.backend){case 0:this.backend=new N(t,r);break;case 2:this.backend=new Q(t,r);break;case 1:this.backend=new q(t,r);break;default:throw Error(`Unsupported backend: ${this.configs.backend}`)}}clear(t,r,e,i){if(!this.backend.clear)throw Error(this.backend.constructor.name+" does not implement 'clear()'.");this.backend.clear(t,r,e,i)}setColor(t,r,e,i){if(!this.backend.setColor)throw Error(this.backend.constructor.name+" does not implement 'setColor()'.");this.backend.setColor(t,r,e,i)}drawLine(t,r,e){if(!this.backend.drawLine)throw Error(this.backend.constructor.name+" does not implement 'drawLine()'.");this.backend.drawLine(t.x,t.y,r.x,r.y,e)}drawCircle(t,r,e){if(!this.backend.drawCircle)throw Error(this.backend.constructor.name+" does not implement 'drawCircle()'.");this.backend.drawCircle(t,r,e)}drawRect(t,r,e,i){if(!this.backend.drawRect)throw Error(this.backend.constructor.name+" does not implement 'drawRect()'.");this.backend.drawRect(t,r,e,i)}drawTriangle(t,r,e,i,a,n){if(!this.backend.drawTriangle)throw Error(this.backend.constructor.name+" does not implement 'drawTriangle()'.");this.backend.drawTriangle(t,r,e,i,a,n)}drawRegularPolygon(t,r,e,i,a){if(!this.backend.drawRegularPolygon)throw Error(this.backend.constructor.name+" does not implement 'drawRegularPolygon()'.");this.backend.drawRegularPolygon(t,r,e,i,a)}drawPolygon(t){if(!this.backend.drawPolygon)throw Error(this.backend.constructor.name+" does not implement 'drawPolygon()'.");this.backend.drawPolygon(t)}drawPentagon(t,r,e,i){if(!this.backend.drawRegularPolygon)throw Error(this.backend.constructor.name+" does not implement 'drawRegularPolygon()'.");this.backend.drawRegularPolygon(t,r,e,5,i)}drawHexagon(t,r,e,i){if(!this.backend.drawRegularPolygon)throw Error(this.backend.constructor.name+" does not implement 'drawRegularPolygon()'.");this.backend.drawRegularPolygon(t,r,e,6,i)}drawSeptagon(t,r,e,i){if(!this.backend.drawRegularPolygon)throw Error(this.backend.constructor.name+" does not implement 'drawRegularPolygon()'.");this.backend.drawRegularPolygon(t,r,e,7,i)}drawOctogon(t,r,e,i){if(!this.backend.drawRegularPolygon)throw Error(this.backend.constructor.name+" does not implement 'drawRegularPolygon()'.");this.backend.drawRegularPolygon(t,r,e,8,i)}drawText(t,r,e,i,a){if(!this.backend.drawText)throw Error(this.backend.constructor.name+" does not implement 'drawText()'.");this.backend.drawText(t,r,e,i,a)}updateView(t){if(!this.backend.updateView)throw Error(this.backend.constructor.name+" does not implement 'updateView()'.");this.backend.updateView(t)}processFrame(t){if(this.configs.debug)this.setColor(0,0,0,1),this.drawRect(10,10,400,200),this.setColor(255,255,255,1),this.drawText(200,35,"DEBUG PANEL",18,1),this.drawText(20,85,`FPS: ${t.toFixed(2)}`,16,0),this.drawText(20,105,`Memory: ${"memory"in performance&&performance.memory?(performance.memory.usedJSHeapSize/1048576).toFixed(2)+"MB / "+(performance.memory.jsHeapSizeLimit/1048576).toFixed(2)+"MB":"N/A"}`,16,0),this.drawText(20,125,`CPU Cores: ${navigator.hardwareConcurrency||"N/A"}`,16,0),this.drawText(20,145,`Resolution: ${window.innerWidth}x${window.innerHeight}`,16,0),this.drawText(20,165,`Network: ${navigator.onLine?"Online":"Offline"} (${navigator.connection?.effectiveType||"unknown"})`,16,0);if(this.backend.flush)this.backend.flush();else throw Error(this.backend.constructor.name.constructor.name+" does not implement 'flush()'.")}}class Y{canvas;activeCamera;renderEvent;active=!1;fps=60;lastFrameTimestamp=performance.now();width=100;height=100;onFrame=()=>{};constructor(t,r){this.canvas=t,this.renderEvent=new J(t,r)}start(){if(this.active)return;this.active=!0;let t=(r)=>{if(!this.active)return;let e=r-this.lastFrameTimestamp;if(this.lastFrameTimestamp=r,e>0){let i=1000/e;this.fps=this.fps*0.9+i*0.1}this.onFrame(this.renderEvent,r),this.renderEvent.processFrame(this.fps),requestAnimationFrame(t)};requestAnimationFrame(t)}setCamera(t){this.activeCamera=t,this.activeCamera.resize(this.width,this.height),this.renderEvent.updateView(this.activeCamera)}resize(t,r){if(this.canvas.width=t,this.canvas.height=r,this.activeCamera)this.activeCamera.resize(this.canvas.width,this.canvas.height),this.renderEvent.updateView(this.activeCamera)}}class f{x;y;z;constructor(t,r,e){this.x=t,this.y=r,this.z=e}add(t){return new f(this.x+t.x,this.y+t.y,this.z+t.z)}sub(t){return new f(this.x-t.x,this.y-t.y,this.z-t.z)}mul(t){return new f(this.x*t,this.y*t,this.z*t)}mag(){return Math.sqrt(this.mag_squared())}mag_squared(){return this.x*this.x+this.y*this.y+this.z*this.z}clone(){return new f(this.x,this.y,this.z)}normalize(){let t=this.mag();if(t===0)return f.ZERO;return this.mul(1/t)}negative(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}cross(t){return new f(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}distanceTo(t){let r=this.x-t.x,e=this.y-t.y,i=this.z-t.z;return Math.sqrt(r*r+e*e+i*i)}squaredDistanceTo(t){let r=this.x-t.x,e=this.y-t.y,i=this.z-t.z;return r*r+e*e+i*i}equals(t){return this.x===t.x&&this.y===t.y&&this.z===t.z}angleBetween(t){let r=Math.sqrt(this.mag_squared()*t.mag_squared());if(r===0)return 0;let e=this.dot(t)/r;return Math.acos(Math.max(-1,Math.min(1,e)))}static get ZERO(){return new f(0,0,0)}}class _{x;y;z;w;constructor(t=0,r=0,e=0,i=1){this.x=t,this.y=r,this.z=e,this.w=i}set(t,r,e,i){return this.x=t,this.y=r,this.z=e,this.w=i,this}copy(t){return this.set(t.x,t.y,t.z,t.w)}identity(){return this.set(0,0,0,1)}static identity(t=new _){return t.set(0,0,0,1)}static fromAxisAngle(t,r,e=new _){let i=r*0.5,a=Math.sin(i);return e.set(t.x*a,t.y*a,t.z*a,Math.cos(i))}magnitudeSquared(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}magnitude(){return Math.sqrt(this.magnitudeSquared())}normalize(t=this){let r=this.magnitudeSquared();if(r===0)return t.set(0,0,0,1);let e=1/Math.sqrt(r);return t.set(this.x*e,this.y*e,this.z*e,this.w*e)}static multiply(t,r,e=new _){let{x:i,y:a,z:n,w:o}=t,s=r.x,u=r.y,c=r.z,l=r.w;return e.set(o*s+i*l+a*c-n*u,o*u-i*c+a*l+n*s,o*c+i*u-a*s+n*l,o*l-i*s-a*u-n*c)}multiply(t){return _.multiply(this,t,this)}conjugate(t=this){return t.set(-this.x,-this.y,-this.z,this.w)}}class b{data=new Float32Array(16);constructor(t=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){this.data.set(t)}static fromQuaternion(t,r=new b){t.normalize();let{x:e,y:i,z:a,w:n}=t,o=e+e,s=i+i,u=a+a,c=n*o,l=n*s,m=n*u,x=e*o,d=e*s,w=e*u,p=i*s,v=i*u,g=a*u,h=r.data;return h[0]=1-p-g,h[1]=d+m,h[2]=w-l,h[3]=0,h[4]=d-m,h[5]=1-x-g,h[6]=v+c,h[7]=0,h[8]=w+l,h[9]=v-c,h[10]=1-x-p,h[11]=0,h[12]=0,h[13]=0,h[14]=0,h[15]=1,r}static fromVector3(t,r=new b){let{x:e,y:i,z:a}=t,n=r.data;return n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=1,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=1,n[11]=0,n[12]=e,n[13]=i,n[14]=a,n[15]=1,r}static multiply(t,r,e=new b){let i=e.data,a=t.data,n=r.data,o=a[0],s=a[1],u=a[2],c=a[3],l=a[4],m=a[5],x=a[6],d=a[7],w=a[8],p=a[9],v=a[10],g=a[11],h=a[12],M=a[13],C=a[14],R=a[15],A=n[0],V=n[1],E=n[2],z=n[3],T=n[4],k=n[5],B=n[6],L=n[7],S=n[8],G=n[9],U=n[10],O=n[11],F=n[12],I=n[13],D=n[14],j=n[15];return i[0]=o*A+l*V+w*E+h*z,i[1]=s*A+m*V+p*E+M*z,i[2]=u*A+x*V+v*E+C*z,i[3]=c*A+d*V+g*E+R*z,i[4]=o*T+l*k+w*B+h*L,i[5]=s*T+m*k+p*B+M*L,i[6]=u*T+x*k+v*B+C*L,i[7]=c*T+d*k+g*B+R*L,i[8]=o*S+l*G+w*U+h*O,i[9]=s*S+m*G+p*U+M*O,i[10]=u*S+x*G+v*U+C*O,i[11]=c*S+d*G+g*U+R*O,i[12]=o*F+l*I+w*D+h*j,i[13]=s*F+m*I+p*D+M*j,i[14]=u*F+x*I+v*D+C*j,i[15]=c*F+d*I+g*D+R*j,e}static getPerspectiveMatrix(t,r,e,i,a=new b){if(e<=0||e===i)return console.warn("Invalid near/far values."),a;let n=a.data,o=1/Math.tan(t*Math.PI/360),s=1/(e-i);return n[0]=o/r,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=o,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=(i+e)*s,n[11]=-1,n[12]=0,n[13]=0,n[14]=2*i*e*s,n[15]=0,a}static getOrthographicMatrix(t,r,e,i,a=-1,n=1,o=new b){if(t===r)return console.warn("Invalid left/right values."),o;if(e===i)return console.warn("Invalid bottom/top values."),o;if(a===n)return console.warn("Invalid near/far values."),o;let s=1/(t-r),u=1/(e-i),c=1/(a-n),l=o.data;return l[0]=-2*s,l[1]=0,l[2]=0,l[3]=0,l[4]=0,l[5]=-2*u,l[6]=0,l[7]=0,l[8]=0,l[9]=0,l[10]=2*c,l[11]=0,l[12]=(t+r)*s,l[13]=(i+e)*u,l[14]=(n+a)*c,l[15]=1,o}}class K{position;rotation;fov;aspectRatio;near;far;projectionMatrix=new b;viewMatrix=new b;viewProjectionMatrix=new b;constructor(t=60,r=1.7777777777777777,e=0.1,i=1000,a=new f(0,0,0),n=_.identity()){this.fov=t,this.aspectRatio=r,this.near=e,this.far=i,this.position=a,this.rotation=n,this.updateProjectionMatrix(),this.updateViewMatrix(),this.updateViewProjectionMatrix()}updateProjectionMatrix(){b.getPerspectiveMatrix(this.fov,this.aspectRatio,this.near,this.far,this.projectionMatrix)}updateViewMatrix(){let t=this.rotation.conjugate(),r=b.fromQuaternion(t),e=b.fromVector3(this.position.negative());b.multiply(r,e,this.viewMatrix)}updateViewProjectionMatrix(){b.multiply(this.projectionMatrix,this.viewMatrix,this.viewProjectionMatrix)}resize(t,r){this.aspectRatio=t/r,this.updateProjectionMatrix(),this.updateViewProjectionMatrix()}}var nt=document.createElement("canvas");document.body.appendChild(nt);var P=new Y(nt,{backend:1,antialias:!1});window.addEventListener("resize",()=>{P.resize(window.innerWidth,window.innerHeight)});P.resize(window.innerWidth,window.innerHeight);P.start();var ct=new K(60,window.innerWidth/window.innerHeight,0.1,1000,new f(0,0,100));P.setCamera(ct);var ut=0;P.onFrame=(t,r)=>{t.clear(200,200,200,1),t.setColor(255,0,0,1),t.drawRect(0,0,50,50),t.setColor(0,0,255,1),t.drawRect(-50,-50,50,50),ut=r};export{H as Backends,N as CanvasBackend,st as Commands,Y as Engine,q as WebGLBackend,Q as WebGPUBackend};

//# debugId=80EBD425A9CA8D7764756E2164756E21
//# sourceMappingURL=index.js.map
