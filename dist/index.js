var ue=Object.defineProperty;var le=(e)=>e;function he(e,i){this[e]=le.bind(null,i)}var me=(e,i)=>{for(var r in i)ue(e,r,{get:i[r],enumerable:!0,configurable:!0,set:he.bind(i,r)})};var re={};me(re,{CommandBuffer:()=>j,Commands:()=>C});var C;((c)=>{c[c.Clear=0]="Clear";c[c.SetColor=1]="SetColor";c[c.DrawLine=2]="DrawLine";c[c.DrawCircle=3]="DrawCircle";c[c.DrawRect=4]="DrawRect";c[c.DrawTriangle=5]="DrawTriangle";c[c.DrawRegularPolygon=6]="DrawRegularPolygon";c[c.DrawPolygon=7]="DrawPolygon";c[c.DrawText=8]="DrawText";c[c.UpdateView=9]="UpdateView"})(C||={});class j{data;length;constructor(e=1e5){this.data=new Float32Array(e),this.length=0}reset(){this.length=0}ensureCapacity(e){if(this.length+e>this.data.length){let i=new Float32Array(this.data.length*2);i.set(this.data),this.data=i}}clear(e,i,r,t){this.ensureCapacity(5),this.data[this.length++]=0,this.data[this.length++]=e,this.data[this.length++]=i,this.data[this.length++]=r,this.data[this.length++]=t}setColor(e,i,r,t){this.ensureCapacity(5),this.data[this.length++]=1,this.data[this.length++]=e,this.data[this.length++]=i,this.data[this.length++]=r,this.data[this.length++]=t}drawLine(e,i,r){this.ensureCapacity(6),this.data[this.length++]=2,this.data[this.length++]=e.x,this.data[this.length++]=e.y,this.data[this.length++]=i.x,this.data[this.length++]=i.y,this.data[this.length++]=r}drawCircle(e,i,r){this.ensureCapacity(4),this.data[this.length++]=3,this.data[this.length++]=e,this.data[this.length++]=i,this.data[this.length++]=r}drawRect(e,i,r,t){this.ensureCapacity(5),this.data[this.length++]=4,this.data[this.length++]=e,this.data[this.length++]=i,this.data[this.length++]=r,this.data[this.length++]=t}drawTriangle(e,i,r,t,o,n){this.ensureCapacity(7),this.data[this.length++]=5,this.data[this.length++]=e,this.data[this.length++]=i,this.data[this.length++]=r,this.data[this.length++]=t,this.data[this.length++]=o,this.data[this.length++]=n}drawRegularPolygon(e,i,r,t,o=0){this.ensureCapacity(6),this.data[this.length++]=6,this.data[this.length++]=e,this.data[this.length++]=i,this.data[this.length++]=r,this.data[this.length++]=t,this.data[this.length++]=o}drawPolygon(e){let i=e.length,r=2+i*2;this.ensureCapacity(r),this.data[this.length++]=7,this.data[this.length++]=i;for(let t=0;t<i;t++){let o=e[t];if(o)this.data[this.length++]=o.x,this.data[this.length++]=o.y}}drawText(e,i,r,t,o){let n=r.length;this.ensureCapacity(5+n),this.data[this.length++]=8,this.data[this.length++]=e,this.data[this.length++]=i,this.data[this.length++]=t,this.data[this.length++]=n,this.data[this.length++]=o;for(let a=0;a<n;a++)this.data[this.length++]=r.charCodeAt(a)}updateView(e){let i=e.viewProjectionMatrix.data;this.ensureCapacity(i.length+1),this.data[this.length++]=9;for(let r=0;r<i.length;r++)this.data[this.length++]=i[r]}}class N{configs;ctx;constructor(e,i){this.configs=i,this.ctx=e.getContext("2d")}clear(e,i,r,t){this.ctx.fillStyle=`rgba(${e}, ${i}, ${r}, ${t})`,this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}setColor(e,i,r,t){this.ctx.fillStyle=`rgba(${e}, ${i}, ${r}, ${t})`}drawLine(e,i,r,t,o){this.ctx.lineWidth=o,this.ctx.beginPath(),this.ctx.moveTo(e,i),this.ctx.lineTo(r,t),this.ctx.closePath(),this.ctx.stroke()}drawCircle(e,i,r){this.ctx.beginPath(),this.ctx.arc(e,i,r,0,Math.PI*2),this.ctx.fill()}drawTriangle(e,i,r,t,o,n){this.ctx.beginPath(),this.ctx.moveTo(e,i),this.ctx.lineTo(r,t),this.ctx.lineTo(o,n),this.ctx.lineTo(e,i),this.ctx.closePath(),this.ctx.fill()}drawRect(e,i,r,t){this.ctx.fillRect(e,i,r,t)}drawRegularPolygon(e,i,r,t,o){o=o||0,this.ctx.beginPath();for(let n=o;n<Math.PI*2+o;n+=Math.PI*2/t){let a={x:e+r*Math.cos(n),y:i+r*Math.sin(n)};this.ctx[n===o?"moveTo":"lineTo"](a.x,a.y)}this.ctx.closePath(),this.ctx.fill()}drawPolygon(e){this.ctx.beginPath(),this.ctx.moveTo(e[0]?.[0]??0,e[0]?.[1]??0);for(let i=1;i<e.length;i++)this.ctx.lineTo(e[i]?.[0]??0,e[i]?.[1]??0);this.ctx.closePath(),this.ctx.fill()}processFrame(e,i){let r=this,t=0;while(t<i)switch(e[t++]){case 8:{if(!r.drawText)throw Error("Canvas backend does not implement 'drawText()'.");let n=e[t++],a=e[t++],s=e[t++],l=e[t++],u=e[t++],c="";for(let h=0;h<l;h++)c+=String.fromCharCode(e[t++]);r.drawText(n,a,c,s,u);break}case 0:{if(!r.clear)throw Error("Canvas backend does not implement 'clear()'.");r.clear(e[t++],e[t++],e[t++],e[t++]);break}case 1:{if(!r.setColor)throw Error("WebGL backend does not implement 'setColor()'.");r.setColor(e[t++],e[t++],e[t++],e[t++]);break}case 2:{if(!r.drawLine)throw Error("Canvas backend does not implement 'drawLine()'.");r.drawLine(e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 3:{if(!r.drawCircle)throw Error("Canvas backend does not implement 'drawCircle()'.");r.drawCircle(e[t++],e[t++],e[t++]);break}case 4:{if(!r.drawRect)throw Error("Canvas backend does not implement 'drawRect()'.");r.drawRect(e[t++],e[t++],e[t++],e[t++]);break}case 5:{if(!r.drawTriangle)throw Error("Canvas backend does not implement 'drawTriangle()'.");r.drawTriangle(e[t++],e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 6:{if(!r.drawRegularPolygon)throw Error("Canvas backend does not implement 'drawRegularPolygon()'.");r.drawRegularPolygon(e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 7:{if(!r.drawPolygon)throw Error("Canvas backend does not implement 'drawPolygon()'.");let n=e[t++],a=[];for(let s=0;s<n;s++)a.push([e[t++],e[t++]]);r.drawPolygon(a);break}}}drawText(e,i,r,t,o){this.ctx.font=`${t}px sans-serif`,this.ctx.textAlign=o===0?"left":o===1?"center":"right",this.ctx.fillText(r,e,i)}resize(e,i){}}var ie=`#version 300 es

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
}`;var ne=`#version 300 es

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
}`;class q{configs;ctx;shaderLocations;vao;vertexBuffer;floatsPerVertex=10;trianglesPerBatch=1e4;batchData;batchOffset;currentColor=[1,0,0,1];viewProjectionMatrix=new Float32Array(16);constructor(e,i){this.configs=i,this.ctx=e.getContext("webgl2"),this.shaderLocations=this.initShaderProgram(ie,ne),this.ctx.enable(this.ctx.BLEND),this.ctx.blendFunc(this.ctx.SRC_ALPHA,this.ctx.ONE_MINUS_SRC_ALPHA),this.ctx.useProgram(this.shaderLocations.program),this.vao=this.ctx.createVertexArray(),this.ctx.bindVertexArray(this.vao),this.vertexBuffer=this.ctx.createBuffer(),this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferData(this.ctx.ARRAY_BUFFER,this.floatsPerVertex*this.trianglesPerBatch*3*4,this.ctx.DYNAMIC_DRAW);let r=this.floatsPerVertex*4;this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.position),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.position,3,this.ctx.FLOAT,!1,r,0),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.texCoord),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.texCoord,2,this.ctx.FLOAT,!1,r,12),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.colour),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.colour,4,this.ctx.FLOAT,!1,r,20),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.type),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.type,1,this.ctx.FLOAT,!1,r,36),this.ctx.bindVertexArray(null),this.batchData=new Float32Array(this.trianglesPerBatch*3*this.floatsPerVertex),this.batchOffset=0,this.resize(500,500)}initShaderProgram(e,i){let r=this.ctx.createProgram();return this.ctx.attachShader(r,this.loadShader(this.ctx.VERTEX_SHADER,e)),this.ctx.attachShader(r,this.loadShader(this.ctx.FRAGMENT_SHADER,i)),this.ctx.linkProgram(r),{program:r,attributes:{position:this.ctx.getAttribLocation(r,"a_position"),texCoord:this.ctx.getAttribLocation(r,"a_texCoord"),colour:this.ctx.getAttribLocation(r,"a_colour"),type:this.ctx.getAttribLocation(r,"a_type")},uniforms:{viewProjection:this.ctx.getUniformLocation(r,"u_viewProjection")}}}loadShader(e,i){let r=this.ctx.createShader(e);if(this.ctx.shaderSource(r,i),this.ctx.compileShader(r),!this.ctx.getShaderParameter(r,this.ctx.COMPILE_STATUS))throw Error("Shader Error: "+this.ctx.getShaderInfoLog(r));return r}flush(){if(this.batchOffset===0)return;this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferSubData(this.ctx.ARRAY_BUFFER,0,this.batchData,0,this.batchOffset),this.ctx.bindVertexArray(this.vao),this.ctx.drawArrays(this.ctx.TRIANGLES,0,this.batchOffset/this.floatsPerVertex),this.ctx.bindVertexArray(null),this.batchOffset=0}addVertex(e,i,r=0,t,o,n,a,s,l,u){if(this.batchOffset+this.floatsPerVertex>this.batchData.length)this.flush();this.batchData[this.batchOffset++]=e,this.batchData[this.batchOffset++]=i,this.batchData[this.batchOffset++]=r,this.batchData[this.batchOffset++]=t,this.batchData[this.batchOffset++]=o,this.batchData[this.batchOffset++]=n,this.batchData[this.batchOffset++]=a,this.batchData[this.batchOffset++]=s,this.batchData[this.batchOffset++]=l,this.batchData[this.batchOffset++]=u}clear(e,i,r,t){this.flush(),this.ctx.clearColor(e/255,i/255,r/255,t),this.ctx.clear(this.ctx.COLOR_BUFFER_BIT)}setColor(e,i,r,t){this.currentColor=[e/255,i/255,r/255,t]}drawLine(e,i,r,t,o){let n=r-e,a=t-i,s=Math.hypot(n,a);if(s===0)return;let l=-a/s*(o/2),u=n/s*(o/2);this.drawTriangle(e+l,i+u,e-l,i-u,r+l,t+u),this.drawTriangle(r+l,t+u,r-l,t-u,e-l,i-u)}drawCircle(e,i,r){let[t,o,n,a]=this.currentColor;this.addVertex(e-r,i-r,0,0,0,t,o,n,a,2),this.addVertex(e+r,i-r,0,1,0,t,o,n,a,2),this.addVertex(e+r,i+r,0,1,1,t,o,n,a,2),this.addVertex(e-r,i-r,0,0,0,t,o,n,a,2),this.addVertex(e-r,i+r,0,0,1,t,o,n,a,2),this.addVertex(e+r,i+r,0,1,1,t,o,n,a,2)}drawRect(e,i,r,t){let[o,n,a,s]=this.currentColor;this.addVertex(e,i,0,0,0,o,n,a,s,1),this.addVertex(e+r,i,0,1,0,o,n,a,s,1),this.addVertex(e+r,i+t,0,1,1,o,n,a,s,1),this.addVertex(e,i,0,0,0,o,n,a,s,1),this.addVertex(e,i+t,0,0,1,o,n,a,s,1),this.addVertex(e+r,i+t,0,1,1,o,n,a,s,1)}drawTriangle(e,i,r,t,o,n){let[a,s,l,u]=this.currentColor;this.addVertex(e,i,0,0,0,a,s,l,u,1),this.addVertex(r,t,0,0,0,a,s,l,u,1),this.addVertex(o,n,0,0,0,a,s,l,u,1)}drawRegularPolygon(e,i,r,t,o=0){if(t<3)return;let n=Math.PI*2/t,a=e+r*Math.cos(o),s=i+r*Math.sin(o);for(let l=1;l<=t;l++){let u=o+l*n,c=e+r*Math.cos(u),h=i+r*Math.sin(u);this.drawTriangle(e,i,a,s,c,h),a=c,s=h}}updateView(){this.flush(),this.ctx.uniformMatrix4fv(this.shaderLocations.uniforms.viewProjection,!1,this.viewProjectionMatrix)}processFrame(e,i){let r=this,t=0;while(t<i)switch(e[t++]){case 0:{if(!r.clear)throw Error("WebGL backend does not implement 'clear()'.");r.clear(e[t++],e[t++],e[t++],e[t++]);break}case 1:{if(!r.setColor)throw Error("WebGL backend does not implement 'setColor()'.");r.setColor(e[t++],e[t++],e[t++],e[t++]);break}case 2:{if(!r.drawLine)throw Error("WebGL backend does not implement 'drawLine()'.");r.drawLine(e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 3:{if(!r.drawCircle)throw Error("WebGL backend does not implement 'drawCircle()'.");r.drawCircle(e[t++],e[t++],e[t++]);break}case 4:{if(!r.drawRect)throw Error("WebGL backend does not implement 'drawRect()'.");r.drawRect(e[t++],e[t++],e[t++],e[t++]);break}case 5:{if(!r.drawTriangle)throw Error("WebGL backend does not implement 'drawTriangle()'.");r.drawTriangle(e[t++],e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 6:{if(!r.drawRegularPolygon)throw Error("WebGL backend does not implement 'drawRegularPolygon()'.");r.drawRegularPolygon(e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 7:{if(!r.drawPolygon)throw Error("WebGL backend does not implement 'drawPolygon()'.");let n=e[t++],a=[];for(let s=0;s<n;s++)a.push([e[t++],e[t++]]);r.drawPolygon(a);break}case 9:{if(!r.updateView)throw Error("WebGL backend does not implement 'updateView()'.");for(let n=0;n<16;n++)this.viewProjectionMatrix[n]=e[t++];r.updateView();break}}this.flush()}resize(e,i){this.ctx.viewport(0,0,e,i)}}var oe=`const PI: f32 = 3.14159265359;

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
`;function Q(e,i,r,t){let o=r[0],n=o+e/t,a=r[1],s=a+i/t;return new Float32Array([2/(n-o),0,0,0,0,-2/(s-a),0,0,0,0,1,0,-(n+o)/(n-o),(s+a)/(s-a),0,1])}class y{static SIZE_BYTES=80;buffer;view;constructor(){this.buffer=new ArrayBuffer(y.SIZE_BYTES),this.view=new Float32Array(this.buffer)}set viewProj(e){this.view.set(e,0)}get viewProj(){return this.view.subarray(0,16)}set cameraPos([e,i]){this.view[16]=e,this.view[17]=i}get cameraPos(){return[this.view[16],this.view[17]]}set zoom(e){this.view[18]=e}get zoom(){return this.view[18]}set aspectRatio(e){this.view[19]=e}get aspectRatio(){return this.view[19]}get bytes(){return this.view}}class J{position;size;rotation;shape_type;sides;fill_style;border_color;border_thickness;extra_param;constructor(e,i,r,t,o,n,a,s,l){this.position=e,this.size=i,this.rotation=r,this.shape_type=t,this.sides=o,this.fill_style=n,this.border_color=a,this.border_thickness=s,this.extra_param=l}static desc(){return{arrayStride:68,stepMode:"instance",attributes:[{shaderLocation:0,format:"float32x2",offset:0},{shaderLocation:1,format:"float32x2",offset:8},{shaderLocation:2,format:"float32",offset:16},{shaderLocation:3,format:"uint32",offset:20},{shaderLocation:4,format:"uint32",offset:24},{shaderLocation:5,format:"float32x4",offset:28},{shaderLocation:6,format:"float32x4",offset:44},{shaderLocation:7,format:"float32",offset:60},{shaderLocation:8,format:"float32",offset:64}]}}}class K{canvas;glyphs=new Map;baseSize;spaceAdvance;constructor(e="sans-serif",i=256,r=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",t=2048){this.baseSize=i,this.canvas=new OffscreenCanvas(t,t);let o=this.canvas.getContext("2d");o.font=`${i}px ${e}`,o.textAlign="left",o.textBaseline="top",o.fillStyle="white";let n=2,a=0,s=0,l=0;for(let u of r){let c=o.measureText(u),h=Math.ceil(c.actualBoundingBoxLeft??0),w=Math.ceil(c.actualBoundingBoxRight??c.width),d=Math.ceil(c.actualBoundingBoxAscent),g=Math.ceil(c.actualBoundingBoxDescent),p=h+w+n*2,x=d+g+n*2;if(a+p>t)a=0,s+=l+n,l=0;o.fillText(u,a+h+n,s+d+n),this.glyphs.set(u,{u0:a/t,v0:s/t,u1:(a+p)/t,v1:(s+x)/t,width:p,height:x,advance:c.width}),a+=p,l=Math.max(l,x)}this.spaceAdvance=this.glyphs.get(" ")?.advance??i*0.3}}class H{configs;ctx;device;queue;render_pipeline;instance_buffer;camera_buffer;camera_bind_group;num_instances=0;width=1;height=1;clearColor=[1,0,0,1];currentColor=[1,1,1,1];frameInstances=[];cameraPos=[0,0];zoom=1;fontAtlas;atlas_texture;atlas_sampler;atlas_bind_group_layout;atlas_bind_group;constructor(e,i){this.ctx=e.getContext("webgpu"),this.configs=i,this.fontAtlas=new K,(async()=>{await this.initializeWebGPU()})()}async initializeWebGPU(){if(!navigator.gpu){alert("WEBGPU IS NOT SUPPORTED ON YOUR DEVICE. YOU CAN UPGRADE YOUR BROWSER OR RESORT TO CANVAS2D/WEBGL.");return}let i=await(await navigator.gpu.requestAdapter())?.requestDevice(),r=i?.queue;if(!i||!r)return;let t=navigator.gpu.getPreferredCanvasFormat();this.ctx.configure({device:i,format:t,alphaMode:"opaque"});let o=this.ctx.canvas;this.width=o.width||1,this.height=o.height||1;let n=new y;n.viewProj=Q(this.width,this.height,this.cameraPos,this.zoom),n.cameraPos=[0,0],n.zoom=0.005,n.aspectRatio=this.ctx.canvas.width/this.ctx.canvas.height;let a=i.createBuffer({label:"camera buffer",size:n.bytes.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Float32Array(a.getMappedRange()).set(n.bytes),a.unmap();let s=i.createBindGroupLayout({label:"camera bind group layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!1,minBindingSize:0}}]}),l=i.createBindGroup({label:"camera bind group",layout:s,entries:[{binding:0,resource:{buffer:a}}]}),u=i.createShaderModule({label:"vertex shader",code:ae}),c=i.createShaderModule({label:"fragment shader",code:oe});this.atlas_texture=i.createTexture({label:"font atlas",size:[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),i.queue.copyExternalImageToTexture({source:this.fontAtlas.canvas},{texture:this.atlas_texture},[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height]),this.atlas_sampler=i.createSampler({magFilter:"linear",minFilter:"linear"}),this.atlas_bind_group_layout=i.createBindGroupLayout({label:"atlas bind group layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),this.atlas_bind_group=i.createBindGroup({label:"atlas bind group",layout:this.atlas_bind_group_layout,entries:[{binding:0,resource:this.atlas_texture.createView()},{binding:1,resource:this.atlas_sampler}]});let h=i.createPipelineLayout({label:"Render pipeline layout",bindGroupLayouts:[s,this.atlas_bind_group_layout],immediateSize:0}),w=i.createRenderPipeline({label:"render pipeline",layout:h,vertex:{module:u,entryPoint:"vs_main",buffers:[J.desc()]},fragment:{module:c,entryPoint:"fs_main",targets:[{format:t,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},depthStencil:void 0,multisample:{count:1,mask:4294967295,alphaToCoverageEnabled:!1},primitive:{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}}),d=i.createBuffer({label:"instance buffer",usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,size:278528,mappedAtCreation:!1});this.device=i,this.queue=r,this.render_pipeline=w,this.instance_buffer=d,this.camera_buffer=a,this.camera_bind_group=l}resize(e,i){if(!this.queue||!this.camera_buffer)return;let r=window.devicePixelRatio,t=Math.floor(e*r),o=Math.floor(i*r);if(t>0&&o>0){if(this.width=t,this.height=o,this.ctx.canvas instanceof HTMLCanvasElement)this.ctx.canvas.width=t,this.ctx.canvas.height=o;let n=t/o,a=new y;a.viewProj=Q(this.width,this.height,this.cameraPos,this.zoom),a.cameraPos=this.cameraPos,a.zoom=this.zoom,a.aspectRatio=n,this.queue.writeBuffer(this.camera_buffer,0,a.bytes.buffer)}}update(e){if(this.num_instances=e.length,e.length===0)return;let i=17,r=new Float32Array(e.length*i),t=new Uint32Array(r.buffer);e.forEach((n,a)=>{let s=a*i;r[s+0]=n.position[0],r[s+1]=n.position[1],r[s+2]=n.size[0],r[s+3]=n.size[1],r[s+4]=n.rotation,t[s+5]=n.shape_type,t[s+6]=n.sides,r[s+7]=n.fill_style[0],r[s+8]=n.fill_style[1],r[s+9]=n.fill_style[2],r[s+10]=n.fill_style[3],r[s+11]=n.border_color[0],r[s+12]=n.border_color[1],r[s+13]=n.border_color[2],r[s+14]=n.border_color[3],r[s+15]=n.border_thickness,r[s+16]=n.extra_param});let o=r.byteLength;if(o>this.instance_buffer.size)this.instance_buffer.destroy(),this.instance_buffer=this.device.createBuffer({label:"dyn instance buffer",size:o,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Float32Array(this.instance_buffer.getMappedRange()).set(r),this.instance_buffer.unmap();else this.queue.writeBuffer(this.instance_buffer,0,r)}update_camera(e,i){let r=Math.max(1,this.width/this.height),t=new y;t.viewProj=Q(this.width,this.height,e,i),t.cameraPos=e,t.zoom=i,t.aspectRatio=r,this.queue.writeBuffer(this.camera_buffer,0,t.bytes.buffer)}render_entities_with_text(e,i,r){if(!e.length)return;this.update_camera(i,r),this.update(e);let o=this.ctx.getCurrentTexture().createView(),n=this.device.createCommandEncoder({label:"entities render encoder"}),a=n.beginRenderPass({label:"entities render pass",colorAttachments:[{view:o,resolveTarget:void 0,depthSlice:void 0,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}],depthStencilAttachment:void 0,occlusionQuerySet:void 0,timestampWrites:void 0});a.setPipeline(this.render_pipeline),a.setBindGroup(0,this.camera_bind_group),a.setBindGroup(1,this.atlas_bind_group),a.setVertexBuffer(0,this.instance_buffer),a.draw(6,this.num_instances),a.end(),this.queue.submit([n.finish()])}setCamera(e,i){this.cameraPos=e,this.zoom=i}pushInstance(e){let[i,r,t,o]=this.currentColor;this.frameInstances.push({position:e.position,size:e.size,rotation:e.rotation,shape_type:e.shape_type,sides:e.sides??0,fill_style:[i,r,t,o],border_color:[0,0,0,0],border_thickness:0,extra_param:e.extra_param??0})}clear(e,i,r,t){this.clearColor=[e/255,i/255,r/255,t]}setColor(e,i,r,t){this.currentColor=[e/255,i/255,r/255,t]}drawTriangle(e,i,r,t,o,n){let a=(e+r+o)/3,s=(i+t+n)/3,l=(Math.hypot(e-a,i-s)+Math.hypot(r-a,t-s)+Math.hypot(o-a,n-s))/3,u=Math.atan2(i-s,e-a);this.pushInstance({position:[a,s],size:[l*2,l*2],rotation:u,shape_type:3,sides:3})}drawRect(e,i,r,t){this.pushInstance({position:[e+r/2,i+t/2],size:[r,t],rotation:0,shape_type:1})}drawRegularPolygonImpl(e,i,r,t,o=0){this.pushInstance({position:[e,i],size:[r,r],rotation:o,shape_type:3,sides:t})}drawCustomSides(e,i,r,t,o){this.drawRegularPolygonImpl(e,i,r,t,o)}drawRegularPolygon(e,i,r,t,o){this.drawRegularPolygonImpl(e,i,r,t,o)}drawPolygon(e){if(!e.length)return;let i=e.reduce((n,a)=>n+a[0],0)/e.length,r=e.reduce((n,a)=>n+a[1],0)/e.length,t=e.reduce((n,[a,s])=>n+Math.hypot(a-i,s-r),0)/e.length,o=Math.atan2((e[0]?.[1]??0)-r,(e[0]?.[0]??0)-i);this.pushInstance({position:[i,r],size:[t*2,t*2],rotation:o,shape_type:3,sides:e.length})}present(){if(!this.device||!this.queue||!this.render_pipeline)return;this.update_camera(this.cameraPos,this.zoom),this.update(this.frameInstances);let e=this.ctx.getCurrentTexture().createView(),i=this.device.createCommandEncoder({label:"immediate-mode frame encoder"}),r=i.beginRenderPass({label:"immediate-mode frame pass",colorAttachments:[{view:e,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}]});if(this.num_instances>0)r.setPipeline(this.render_pipeline),r.setBindGroup(0,this.camera_bind_group),r.setBindGroup(1,this.atlas_bind_group),r.setVertexBuffer(0,this.instance_buffer),r.draw(6,this.num_instances);r.end(),this.queue.submit([i.finish()]),this.frameInstances=[]}processFrame(e,i){let r=this,t=0;while(t<i)switch(e[t++]){case 0:{if(!r.clear)throw Error("WebGPU backend does not implement 'clear()'.");r.clear(e[t++],e[t++],e[t++],e[t++]);break}case 1:{if(!r.setColor)throw Error("WebGPU backend does not implement 'setColor()'.");r.setColor(e[t++],e[t++],e[t++],e[t++]);break}case 2:{if(!r.drawLine)throw Error("WebGPU backend does not implement 'drawLine()'.");r.drawLine(e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 3:{if(!r.drawCircle)throw Error("WebGPU backend does not implement 'drawCircle()'.");r.drawCircle(e[t++],e[t++],e[t++]);break}case 4:{if(!r.drawRect)throw Error("WebGPU backend does not implement 'drawRect()'.");r.drawRect(e[t++],e[t++],e[t++],e[t++]);break}case 5:{if(!r.drawTriangle)throw Error("WebGPU backend does not implement 'drawTriangle()'.");r.drawTriangle(e[t++],e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 6:{if(!r.drawRegularPolygon)throw Error("WebGPU backend does not implement 'drawRegularPolygon()'.");r.drawRegularPolygon(e[t++],e[t++],e[t++],e[t++],e[t++]);break}case 7:{if(!r.drawPolygon)throw Error("WebGPU backend does not implement 'drawPolygon()'.");let n=e[t++],a=[];for(let s=0;s<n;s++)a.push([e[t++],e[t++]]);r.drawPolygon(a);break}case 8:{let n=e[t++],a=e[t++],s=e[t++],l=e[t++],u=e[t++],c="";for(let h=0;h<l;h++)c+=String.fromCharCode(e[t++]);if(!r.drawText)throw Error("WebGPU backend does not implement 'drawText()'.");r.drawText(n,a,c,s,u);break}}this.present()}pushGlyphInstance(e,i,r){let[t,o,n,a]=this.currentColor;this.frameInstances.push({position:e,size:i,rotation:0,shape_type:5,sides:0,fill_style:[t,o,n,a],border_color:r,border_thickness:0,extra_param:0})}drawText(e,i,r,t,o){if(!this.fontAtlas)return;let n=t/this.fontAtlas.baseSize,a=0;for(let l of r){let u=this.fontAtlas.glyphs.get(l);a+=u?u.advance*n:this.fontAtlas.spaceAdvance*n}let s=e;if(o===1)s-=a/2;else if(o===2)s-=a;for(let l of r){let u=this.fontAtlas.glyphs.get(l);if(!u){s+=this.fontAtlas.spaceAdvance*n;continue}let c=u.width*n,h=u.height*n;this.pushGlyphInstance([s+c/2,i+h/2],[c,h],[u.u0,u.v0,u.u1-u.u0,u.v1-u.v0]),s+=u.advance*n}}}class ee{commandBuffer;constructor(){this.commandBuffer=new j}resetCommandBuffer(){this.commandBuffer.reset()}clear(e,i,r,t){this.commandBuffer.clear(e,i,r,t)}setColor(e,i,r,t){this.commandBuffer.setColor(e,i,r,t)}drawLine(e,i,r){this.commandBuffer.drawLine(e,i,r)}drawCircle(e,i,r){this.commandBuffer.drawCircle(e,i,r)}drawRect(e,i,r,t){this.commandBuffer.drawRect(e,i,r,t)}drawTriangle(e,i,r,t,o,n){this.commandBuffer.drawTriangle(e,i,r,t,o,n)}drawRegularPolygon(e,i,r,t,o){this.commandBuffer.drawRegularPolygon(e,i,r,t,o)}drawPolygon(e){this.commandBuffer.drawPolygon(e)}drawPentagon(e,i,r,t){this.commandBuffer.drawRegularPolygon(e,i,r,5,t)}drawHexagon(e,i,r,t){this.commandBuffer.drawRegularPolygon(e,i,r,6,t)}drawSeptagon(e,i,r,t){this.commandBuffer.drawRegularPolygon(e,i,r,7,t)}drawOctogon(e,i,r,t){this.commandBuffer.drawRegularPolygon(e,i,r,8,t)}drawText(e,i,r,t,o){this.commandBuffer.drawText(e,i,r,t,o)}setCamera(e){this.commandBuffer.updateView(e)}}var Y;((t)=>{t[t.CANVAS=0]="CANVAS";t[t.WEBGL=1]="WEBGL";t[t.WEBGPU=2]="WEBGPU"})(Y||={});class X{canvas;configs;backend;renderEvent;active=!1;fps=60;lastFrameTimestamp=performance.now();onFrame=()=>{};constructor(e,i){switch(this.canvas=e,this.configs=i,this.configs.backend){case 0:this.backend=new N(e,i);break;case 2:this.backend=new H(e,i);break;case 1:this.backend=new q(e,i);break;default:throw Error(`Unsupported backend: ${this.configs.backend}`)}this.renderEvent=new ee}start(){if(this.active)return;this.active=!0;let e=(i)=>{if(!this.active)return;let r=i-this.lastFrameTimestamp;if(this.lastFrameTimestamp=i,r>0){let t=1000/r;this.fps=this.fps*0.9+t*0.1}if(this.renderEvent.resetCommandBuffer(),this.onFrame(this.renderEvent,i),this.configs.debug)this.renderEvent.setColor(0,0,0,1),this.renderEvent.drawRect(10,10,400,200),this.renderEvent.setColor(255,255,255,1),this.renderEvent.drawText(200,35,"DEBUG PANEL",18,1),this.renderEvent.drawText(20,65,`Command Buffer size: ${this.renderEvent.commandBuffer.length}`,16,0),this.renderEvent.drawText(20,85,`FPS: ${this.fps.toFixed(2)}`,16,0),this.renderEvent.drawText(20,105,`Memory: ${"memory"in performance&&performance.memory?(performance.memory.usedJSHeapSize/1048576).toFixed(2)+"MB / "+(performance.memory.jsHeapSizeLimit/1048576).toFixed(2)+"MB":"N/A"}`,16,0),this.renderEvent.drawText(20,125,`CPU Cores: ${navigator.hardwareConcurrency||"N/A"}`,16,0),this.renderEvent.drawText(20,145,`Resolution: ${window.innerWidth}x${window.innerHeight}`,16,0),this.renderEvent.drawText(20,165,`Network: ${navigator.onLine?"Online":"Offline"} (${navigator.connection?.effectiveType||"unknown"})`,16,0);this.backend.processFrame(this.renderEvent.commandBuffer.data,this.renderEvent.commandBuffer.length),requestAnimationFrame(e)};requestAnimationFrame(e)}resize(e,i){if(this.canvas.width=e,this.canvas.height=i,this.backend.resize)this.backend.resize(e,i);else throw Error("Current backend does not implement 'resize()'.")}}class f{x;y;z;constructor(e,i,r){this.x=e,this.y=i,this.z=r}add(e){return new f(this.x+e.x,this.y+e.y,this.z+e.z)}sub(e){return new f(this.x-e.x,this.y-e.y,this.z-e.z)}mul(e){return new f(this.x*e,this.y*e,this.z*e)}mag(){return Math.sqrt(this.mag_squared())}mag_squared(){return this.x*this.x+this.y*this.y+this.z*this.z}clone(){return new f(this.x,this.y,this.z)}normalize(){let e=this.mag();if(e===0)return f.ZERO;return this.mul(1/e)}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}cross(e){return new f(this.y*e.z-this.z*e.y,this.z*e.x-this.x*e.z,this.x*e.y-this.y*e.x)}distanceTo(e){let i=this.x-e.x,r=this.y-e.y,t=this.z-e.z;return Math.sqrt(i*i+r*r+t*t)}squaredDistanceTo(e){let i=this.x-e.x,r=this.y-e.y,t=this.z-e.z;return i*i+r*r+t*t}equals(e){return this.x===e.x&&this.y===e.y&&this.z===e.z}angleBetween(e){let i=Math.sqrt(this.mag_squared()*e.mag_squared());if(i===0)return 0;let r=this.dot(e)/i;return Math.acos(Math.max(-1,Math.min(1,r)))}static get ZERO(){return new f(0,0,0)}}class _{x;y;z;w;constructor(e=0,i=0,r=0,t=1){this.x=e,this.y=i,this.z=r,this.w=t}set(e,i,r,t){return this.x=e,this.y=i,this.z=r,this.w=t,this}copy(e){return this.set(e.x,e.y,e.z,e.w)}identity(){return this.set(0,0,0,1)}static identity(e=new _){return e.set(0,0,0,1)}static fromAxisAngle(e,i,r=new _){let t=i*0.5,o=Math.sin(t);return r.set(e.x*o,e.y*o,e.z*o,Math.cos(t))}magnitudeSquared(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}magnitude(){return Math.sqrt(this.magnitudeSquared())}normalize(e=this){let i=this.magnitudeSquared();if(i===0)return e.set(0,0,0,1);let r=1/Math.sqrt(i);return e.set(this.x*r,this.y*r,this.z*r,this.w*r)}static multiply(e,i,r=new _){let{x:t,y:o,z:n,w:a}=e,s=i.x,l=i.y,u=i.z,c=i.w;return r.set(a*s+t*c+o*u-n*l,a*l-t*u+o*c+n*s,a*u+t*l-o*s+n*c,a*c-t*s-o*l-n*u)}multiply(e){return _.multiply(this,e,this)}conjugate(e=this){return e.set(-this.x,-this.y,-this.z,this.w)}}class b{data=new Float32Array(16);constructor(e=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){this.data.set(e)}static fromQuaternion(e,i=new b){e.normalize();let{x:r,y:t,z:o,w:n}=e,a=r+r,s=t+t,l=o+o,u=n*a,c=n*s,h=n*l,w=r*a,d=r*s,g=r*l,p=t*s,x=t*l,v=o*l,m=i.data;return m[0]=1-p-v,m[1]=d+h,m[2]=g-c,m[3]=0,m[4]=d-h,m[5]=1-w-v,m[6]=x+u,m[7]=0,m[8]=g+c,m[9]=x-u,m[10]=1-w-p,m[11]=0,m[12]=0,m[13]=0,m[14]=0,m[15]=1,i}static fromVector3(e,i=new b){let{x:r,y:t,z:o}=e,n=i.data;return n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=1,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=1,n[11]=0,n[12]=r,n[13]=t,n[14]=o,n[15]=1,i}static multiply(e,i,r=new b){let t=r.data,o=e.data,n=i.data,a=o[0],s=o[1],l=o[2],u=o[3],c=o[4],h=o[5],w=o[6],d=o[7],g=o[8],p=o[9],x=o[10],v=o[11],m=o[12],P=o[13],M=o[14],R=o[15],E=n[0],A=n[1],T=n[2],V=n[3],B=n[4],L=n[5],k=n[6],z=n[7],S=n[8],G=n[9],D=n[10],U=n[11],F=n[12],O=n[13],I=n[14],W=n[15];return t[0]=a*E+c*A+g*T+m*V,t[1]=s*E+h*A+p*T+P*V,t[2]=l*E+w*A+x*T+M*V,t[3]=u*E+d*A+v*T+R*V,t[4]=a*B+c*L+g*k+m*z,t[5]=s*B+h*L+p*k+P*z,t[6]=l*B+w*L+x*k+M*z,t[7]=u*B+d*L+v*k+R*z,t[8]=a*S+c*G+g*D+m*U,t[9]=s*S+h*G+p*D+P*U,t[10]=l*S+w*G+x*D+M*U,t[11]=u*S+d*G+v*D+R*U,t[12]=a*F+c*O+g*I+m*W,t[13]=s*F+h*O+p*I+P*W,t[14]=l*F+w*O+x*I+M*W,t[15]=u*F+d*O+v*I+R*W,r}static getPerspectiveMatrix(e,i,r,t,o=new b){if(r<=0||r===t)return console.warn("Invalid near/far values."),o;let n=o.data,a=1/Math.tan(e*Math.PI/360),s=1/(r-t);return n[0]=a/i,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=a,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=(t+r)*s,n[11]=-1,n[12]=0,n[13]=0,n[14]=2*t*r*s,n[15]=0,o}static getOrthographicMatrix(e,i,r,t,o=-1,n=1,a=new b){if(e===i)return console.warn("Invalid left/right values."),a;if(r===t)return console.warn("Invalid bottom/top values."),a;if(o===n)return console.warn("Invalid near/far values."),a;let s=1/(e-i),l=1/(r-t),u=1/(o-n),c=a.data;return c[0]=-2*s,c[1]=0,c[2]=0,c[3]=0,c[4]=0,c[5]=-2*l,c[6]=0,c[7]=0,c[8]=0,c[9]=0,c[10]=2*u,c[11]=0,c[12]=(e+i)*s,c[13]=(t+r)*l,c[14]=(n+o)*u,c[15]=1,a}}class te{position;rotation;left;right;top;bottom;near;far;projectionMatrix=new b;viewMatrix=new b;viewProjectionMatrix=new b;constructor(e,i=1.7777777777777777,r=-1,t=1,o=new f(0,0,0),n=_.identity()){this.left=-e/2,this.right=e/2,this.top=-(e/i)/2,this.bottom=e/i/2,this.near=r,this.far=t,this.position=o,this.rotation=n,this.updateProjectionMatrix(),this.updateViewMatrix(),this.updateViewProjectionMatrix()}updateProjectionMatrix(){b.getOrthographicMatrix(this.left,this.right,this.bottom,this.top,this.near,this.far,this.projectionMatrix)}updateViewMatrix(){let e=this.rotation.conjugate(),i=b.fromQuaternion(e),r=b.fromVector3(this.position);b.multiply(i,r,this.viewMatrix)}updateViewProjectionMatrix(){b.multiply(this.projectionMatrix,this.viewMatrix,this.viewProjectionMatrix)}}var ce=document.createElement("canvas");document.body.appendChild(ce);var Z=new X(ce,{backend:1,antialias:!1});window.addEventListener("resize",()=>{Z.resize(window.innerWidth,window.innerHeight)});Z.resize(window.innerWidth,window.innerHeight);Z.start();var pe=new te(1920,1.7777777777777777,-1,1,new f(0,0,0)),se=0;Z.onFrame=(e,i)=>{console.log(1000/(i-se)),e.setCamera(pe),e.clear(200,200,200,1),e.setColor(255,0,0,1),e.drawRect(0,0,50,50),e.setColor(0,0,255,1),e.drawRect(-50,-50,50,50),se=i};export{Y as Backends,N as CanvasBackend,re as Commands,X as Engine,q as WebGLBackend,H as WebGPUBackend};

//# debugId=779294464479425C64756E2164756E21
//# sourceMappingURL=index.js.map
