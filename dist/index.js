var Pl=Object.defineProperty;var Ol=(l)=>l;function Tl(l,f){this[l]=Ol.bind(null,f)}var Al=(l,f)=>{for(var p in f)Pl(l,p,{get:f[p],enumerable:!0,configurable:!0,set:Tl.bind(f,p)})};var _l={};Al(_l,{Commands:()=>V,CommandBuffer:()=>g});var V;((O)=>{O[O.Clear=0]="Clear";O[O.SetColor=1]="SetColor";O[O.DrawLine=2]="DrawLine";O[O.DrawCircle=3]="DrawCircle";O[O.DrawRect=4]="DrawRect";O[O.DrawTriangle=5]="DrawTriangle";O[O.DrawRegularPolygon=6]="DrawRegularPolygon";O[O.DrawPolygon=7]="DrawPolygon";O[O.DrawText=8]="DrawText";O[O.UpdateView=9]="UpdateView"})(V||={});class g{data;length;constructor(l=1e5){this.data=new Float32Array(l),this.length=0}reset(){this.length=0}ensureCapacity(l){if(this.length+l>this.data.length){let f=new Float32Array(this.data.length*2);f.set(this.data),this.data=f}}clear(l,f,p,_){this.ensureCapacity(5),this.data[this.length++]=0,this.data[this.length++]=l,this.data[this.length++]=f,this.data[this.length++]=p,this.data[this.length++]=_}setColor(l,f,p,_){this.ensureCapacity(5),this.data[this.length++]=1,this.data[this.length++]=l,this.data[this.length++]=f,this.data[this.length++]=p,this.data[this.length++]=_}drawLine(l,f,p){this.ensureCapacity(6),this.data[this.length++]=2,this.data[this.length++]=l.x,this.data[this.length++]=l.y,this.data[this.length++]=f.x,this.data[this.length++]=f.y,this.data[this.length++]=p}drawCircle(l,f,p){this.ensureCapacity(4),this.data[this.length++]=3,this.data[this.length++]=l,this.data[this.length++]=f,this.data[this.length++]=p}drawRect(l,f,p,_){this.ensureCapacity(5),this.data[this.length++]=4,this.data[this.length++]=l,this.data[this.length++]=f,this.data[this.length++]=p,this.data[this.length++]=_}drawTriangle(l,f,p,_,Q,j){this.ensureCapacity(7),this.data[this.length++]=5,this.data[this.length++]=l,this.data[this.length++]=f,this.data[this.length++]=p,this.data[this.length++]=_,this.data[this.length++]=Q,this.data[this.length++]=j}drawRegularPolygon(l,f,p,_,Q=0){this.ensureCapacity(6),this.data[this.length++]=6,this.data[this.length++]=l,this.data[this.length++]=f,this.data[this.length++]=p,this.data[this.length++]=_,this.data[this.length++]=Q}drawPolygon(l){let f=l.length,p=2+f*2;this.ensureCapacity(p),this.data[this.length++]=7,this.data[this.length++]=f;for(let _=0;_<f;_++){let Q=l[_];if(Q)this.data[this.length++]=Q.x,this.data[this.length++]=Q.y}}drawText(l,f,p,_,Q){let j=p.length;this.ensureCapacity(5+j),this.data[this.length++]=8,this.data[this.length++]=l,this.data[this.length++]=f,this.data[this.length++]=_,this.data[this.length++]=j,this.data[this.length++]=Q;for(let M=0;M<j;M++)this.data[this.length++]=p.charCodeAt(M)}updateView(l){let f=l.viewProjectionMatrix.data;this.ensureCapacity(f.length+1),this.data[this.length++]=9;for(let p=0;p<f.length;p++)this.data[this.length++]=f[p]}}class x{configs;ctx;constructor(l,f){this.configs=f,this.ctx=l.getContext("2d")}clear(l,f,p,_){this.ctx.fillStyle=`rgba(${l}, ${f}, ${p}, ${_})`,this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}setColor(l,f,p,_){this.ctx.fillStyle=`rgba(${l}, ${f}, ${p}, ${_})`}drawLine(l,f,p,_,Q){this.ctx.lineWidth=Q,this.ctx.beginPath(),this.ctx.moveTo(l,f),this.ctx.lineTo(p,_),this.ctx.closePath(),this.ctx.stroke()}drawCircle(l,f,p){this.ctx.beginPath(),this.ctx.arc(l,f,p,0,Math.PI*2),this.ctx.fill()}drawTriangle(l,f,p,_,Q,j){this.ctx.beginPath(),this.ctx.moveTo(l,f),this.ctx.lineTo(p,_),this.ctx.lineTo(Q,j),this.ctx.lineTo(l,f),this.ctx.closePath(),this.ctx.fill()}drawRect(l,f,p,_){this.ctx.fillRect(l,f,p,_)}drawRegularPolygon(l,f,p,_,Q){Q=Q||0,this.ctx.beginPath();for(let j=Q;j<Math.PI*2+Q;j+=Math.PI*2/_){let M={x:l+p*Math.cos(j),y:f+p*Math.sin(j)};this.ctx[j===Q?"moveTo":"lineTo"](M.x,M.y)}this.ctx.closePath(),this.ctx.fill()}drawPolygon(l){this.ctx.beginPath(),this.ctx.moveTo(l[0]?.[0]??0,l[0]?.[1]??0);for(let f=1;f<l.length;f++)this.ctx.lineTo(l[f]?.[0]??0,l[f]?.[1]??0);this.ctx.closePath(),this.ctx.fill()}processFrame(l,f){let p=this,_=0;while(_<f)switch(l[_++]){case 8:{if(!p.drawText)throw Error("Canvas backend does not implement 'drawText()'.");let j=l[_++],M=l[_++],P=l[_++],A=l[_++],T=l[_++],O="";for(let I=0;I<A;I++)O+=String.fromCharCode(l[_++]);p.drawText(j,M,O,P,T);break}case 0:{if(!p.clear)throw Error("Canvas backend does not implement 'clear()'.");p.clear(l[_++],l[_++],l[_++],l[_++]);break}case 1:{if(!p.setColor)throw Error("WebGL backend does not implement 'setColor()'.");p.setColor(l[_++],l[_++],l[_++],l[_++]);break}case 2:{if(!p.drawLine)throw Error("Canvas backend does not implement 'drawLine()'.");p.drawLine(l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 3:{if(!p.drawCircle)throw Error("Canvas backend does not implement 'drawCircle()'.");p.drawCircle(l[_++],l[_++],l[_++]);break}case 4:{if(!p.drawRect)throw Error("Canvas backend does not implement 'drawRect()'.");p.drawRect(l[_++],l[_++],l[_++],l[_++]);break}case 5:{if(!p.drawTriangle)throw Error("Canvas backend does not implement 'drawTriangle()'.");p.drawTriangle(l[_++],l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 6:{if(!p.drawRegularPolygon)throw Error("Canvas backend does not implement 'drawRegularPolygon()'.");p.drawRegularPolygon(l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 7:{if(!p.drawPolygon)throw Error("Canvas backend does not implement 'drawPolygon()'.");let j=l[_++],M=[];for(let P=0;P<j;P++)M.push([l[_++],l[_++]]);p.drawPolygon(M);break}}}drawText(l,f,p,_,Q){this.ctx.font=`${_}px sans-serif`,this.ctx.textAlign=Q===0?"left":Q===1?"center":"right",this.ctx.fillText(p,l,f)}resize(l,f){}}var pl=`#version 300 es

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
}`;var fl=`#version 300 es

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
}`;class m{configs;ctx;shaderLocations;vao;vertexBuffer;floatsPerVertex=10;trianglesPerBatch=1e4;batchData;batchOffset;currentColor=[1,0,0,1];viewProjectionMatrix=new Float32Array(16);constructor(l,f){this.configs=f,this.ctx=l.getContext("webgl2"),this.shaderLocations=this.initShaderProgram(pl,fl),this.ctx.enable(this.ctx.BLEND),this.ctx.blendFunc(this.ctx.SRC_ALPHA,this.ctx.ONE_MINUS_SRC_ALPHA),this.ctx.useProgram(this.shaderLocations.program),this.vao=this.ctx.createVertexArray(),this.ctx.bindVertexArray(this.vao),this.vertexBuffer=this.ctx.createBuffer(),this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferData(this.ctx.ARRAY_BUFFER,this.floatsPerVertex*this.trianglesPerBatch*3*4,this.ctx.DYNAMIC_DRAW);let p=this.floatsPerVertex*4;this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.position),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.position,3,this.ctx.FLOAT,!1,p,0),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.texCoord),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.texCoord,2,this.ctx.FLOAT,!1,p,12),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.colour),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.colour,4,this.ctx.FLOAT,!1,p,20),this.ctx.enableVertexAttribArray(this.shaderLocations.attributes.type),this.ctx.vertexAttribPointer(this.shaderLocations.attributes.type,1,this.ctx.FLOAT,!1,p,36),this.ctx.bindVertexArray(null),this.batchData=new Float32Array(this.trianglesPerBatch*3*this.floatsPerVertex),this.batchOffset=0,this.resize(500,500)}initShaderProgram(l,f){let p=this.ctx.createProgram();return this.ctx.attachShader(p,this.loadShader(this.ctx.VERTEX_SHADER,l)),this.ctx.attachShader(p,this.loadShader(this.ctx.FRAGMENT_SHADER,f)),this.ctx.linkProgram(p),{program:p,attributes:{position:this.ctx.getAttribLocation(p,"a_position"),texCoord:this.ctx.getAttribLocation(p,"a_texCoord"),colour:this.ctx.getAttribLocation(p,"a_colour"),type:this.ctx.getAttribLocation(p,"a_type")},uniforms:{viewProjection:this.ctx.getUniformLocation(p,"u_viewProjection")}}}loadShader(l,f){let p=this.ctx.createShader(l);if(this.ctx.shaderSource(p,f),this.ctx.compileShader(p),!this.ctx.getShaderParameter(p,this.ctx.COMPILE_STATUS))throw Error("Shader Error: "+this.ctx.getShaderInfoLog(p));return p}flush(){if(this.batchOffset===0)return;this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER,this.vertexBuffer),this.ctx.bufferSubData(this.ctx.ARRAY_BUFFER,0,this.batchData,0,this.batchOffset),this.ctx.bindVertexArray(this.vao),this.ctx.drawArrays(this.ctx.TRIANGLES,0,this.batchOffset/this.floatsPerVertex),this.ctx.bindVertexArray(null),this.batchOffset=0}addVertex(l,f,p=0,_,Q,j,M,P,A,T){if(this.batchOffset+this.floatsPerVertex>this.batchData.length)this.flush();this.batchData[this.batchOffset++]=l,this.batchData[this.batchOffset++]=f,this.batchData[this.batchOffset++]=p,this.batchData[this.batchOffset++]=_,this.batchData[this.batchOffset++]=Q,this.batchData[this.batchOffset++]=j,this.batchData[this.batchOffset++]=M,this.batchData[this.batchOffset++]=P,this.batchData[this.batchOffset++]=A,this.batchData[this.batchOffset++]=T}clear(l,f,p,_){this.flush(),this.ctx.clearColor(l/255,f/255,p/255,_),this.ctx.clear(this.ctx.COLOR_BUFFER_BIT)}setColor(l,f,p,_){this.currentColor=[l/255,f/255,p/255,_]}drawLine(l,f,p,_,Q){let j=p-l,M=_-f,P=Math.hypot(j,M);if(P===0)return;let A=-M/P*(Q/2),T=j/P*(Q/2);this.drawTriangle(l+A,f+T,l-A,f-T,p+A,_+T),this.drawTriangle(p+A,_+T,p-A,_-T,l-A,f-T)}drawCircle(l,f,p){let[_,Q,j,M]=this.currentColor;this.addVertex(l-p,f-p,0,0,0,_,Q,j,M,2),this.addVertex(l+p,f-p,0,1,0,_,Q,j,M,2),this.addVertex(l+p,f+p,0,1,1,_,Q,j,M,2),this.addVertex(l-p,f-p,0,0,0,_,Q,j,M,2),this.addVertex(l-p,f+p,0,0,1,_,Q,j,M,2),this.addVertex(l+p,f+p,0,1,1,_,Q,j,M,2)}drawRect(l,f,p,_){let[Q,j,M,P]=this.currentColor;this.addVertex(l,f,0,0,0,Q,j,M,P,1),this.addVertex(l+p,f,0,1,0,Q,j,M,P,1),this.addVertex(l+p,f+_,0,1,1,Q,j,M,P,1),this.addVertex(l,f,0,0,0,Q,j,M,P,1),this.addVertex(l,f+_,0,0,1,Q,j,M,P,1),this.addVertex(l+p,f+_,0,1,1,Q,j,M,P,1)}drawTriangle(l,f,p,_,Q,j){let[M,P,A,T]=this.currentColor;this.addVertex(l,f,0,0,0,M,P,A,T,1),this.addVertex(p,_,0,0,0,M,P,A,T,1),this.addVertex(Q,j,0,0,0,M,P,A,T,1)}drawRegularPolygon(l,f,p,_,Q=0){if(_<3)return;let j=Math.PI*2/_,M=l+p*Math.cos(Q),P=f+p*Math.sin(Q);for(let A=1;A<=_;A++){let T=Q+A*j,O=l+p*Math.cos(T),I=f+p*Math.sin(T);this.drawTriangle(l,f,M,P,O,I),M=O,P=I}}updateView(){this.flush(),this.ctx.uniformMatrix4fv(this.shaderLocations.uniforms.viewProjection,!1,this.viewProjectionMatrix)}processFrame(l,f){let p=this,_=0;while(_<f)switch(l[_++]){case 0:{if(!p.clear)throw Error("WebGL backend does not implement 'clear()'.");p.clear(l[_++],l[_++],l[_++],l[_++]);break}case 1:{if(!p.setColor)throw Error("WebGL backend does not implement 'setColor()'.");p.setColor(l[_++],l[_++],l[_++],l[_++]);break}case 2:{if(!p.drawLine)throw Error("WebGL backend does not implement 'drawLine()'.");p.drawLine(l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 3:{if(!p.drawCircle)throw Error("WebGL backend does not implement 'drawCircle()'.");p.drawCircle(l[_++],l[_++],l[_++]);break}case 4:{if(!p.drawRect)throw Error("WebGL backend does not implement 'drawRect()'.");p.drawRect(l[_++],l[_++],l[_++],l[_++]);break}case 5:{if(!p.drawTriangle)throw Error("WebGL backend does not implement 'drawTriangle()'.");p.drawTriangle(l[_++],l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 6:{if(!p.drawRegularPolygon)throw Error("WebGL backend does not implement 'drawRegularPolygon()'.");p.drawRegularPolygon(l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 7:{if(!p.drawPolygon)throw Error("WebGL backend does not implement 'drawPolygon()'.");let j=l[_++],M=[];for(let P=0;P<j;P++)M.push([l[_++],l[_++]]);p.drawPolygon(M);break}case 9:{if(!p.updateView)throw Error("WebGL backend does not implement 'updateView()'.");for(let j=0;j<16;j++)this.viewProjectionMatrix[j]=l[_++];p.updateView();break}}this.flush()}resize(l,f){this.ctx.viewport(0,0,l,f)}}var jl=`const PI: f32 = 3.14159265359;

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
`;var Ql=`struct CameraUniform {
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
`;function y(l,f,p,_){let Q=p[0],j=Q+l/_,M=p[1],P=M+f/_;return new Float32Array([2/(j-Q),0,0,0,0,-2/(P-M),0,0,0,0,1,0,-(j+Q)/(j-Q),(P+M)/(P-M),0,1])}class W{static SIZE_BYTES=80;buffer;view;constructor(){this.buffer=new ArrayBuffer(W.SIZE_BYTES),this.view=new Float32Array(this.buffer)}set viewProj(l){this.view.set(l,0)}get viewProj(){return this.view.subarray(0,16)}set cameraPos([l,f]){this.view[16]=l,this.view[17]=f}get cameraPos(){return[this.view[16],this.view[17]]}set zoom(l){this.view[18]=l}get zoom(){return this.view[18]}set aspectRatio(l){this.view[19]=l}get aspectRatio(){return this.view[19]}get bytes(){return this.view}}class d{position;size;rotation;shape_type;sides;fill_style;border_color;border_thickness;extra_param;constructor(l,f,p,_,Q,j,M,P,A){this.position=l,this.size=f,this.rotation=p,this.shape_type=_,this.sides=Q,this.fill_style=j,this.border_color=M,this.border_thickness=P,this.extra_param=A}static desc(){return{arrayStride:68,stepMode:"instance",attributes:[{shaderLocation:0,format:"float32x2",offset:0},{shaderLocation:1,format:"float32x2",offset:8},{shaderLocation:2,format:"float32",offset:16},{shaderLocation:3,format:"uint32",offset:20},{shaderLocation:4,format:"uint32",offset:24},{shaderLocation:5,format:"float32x4",offset:28},{shaderLocation:6,format:"float32x4",offset:44},{shaderLocation:7,format:"float32",offset:60},{shaderLocation:8,format:"float32",offset:64}]}}}class t{canvas;glyphs=new Map;baseSize;spaceAdvance;constructor(l="sans-serif",f=256,p=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",_=2048){this.baseSize=f,this.canvas=new OffscreenCanvas(_,_);let Q=this.canvas.getContext("2d");Q.font=`${f}px ${l}`,Q.textAlign="left",Q.textBaseline="top",Q.fillStyle="white";let j=2,M=0,P=0,A=0;for(let T of p){let O=Q.measureText(T),I=Math.ceil(O.actualBoundingBoxLeft??0),$=Math.ceil(O.actualBoundingBoxRight??O.width),J=Math.ceil(O.actualBoundingBoxAscent),E=Math.ceil(O.actualBoundingBoxDescent),K=I+$+j*2,U=J+E+j*2;if(M+K>_)M=0,P+=A+j,A=0;Q.fillText(T,M+I+j,P+J+j),this.glyphs.set(T,{u0:M/_,v0:P/_,u1:(M+K)/_,v1:(P+U)/_,width:K,height:U,advance:O.width}),M+=K,A=Math.max(A,U)}this.spaceAdvance=this.glyphs.get(" ")?.advance??f*0.3}}class D{configs;ctx;device;queue;render_pipeline;instance_buffer;camera_buffer;camera_bind_group;num_instances=0;width=1;height=1;clearColor=[1,0,0,1];currentColor=[1,1,1,1];frameInstances=[];cameraPos=[0,0];zoom=1;fontAtlas;atlas_texture;atlas_sampler;atlas_bind_group_layout;atlas_bind_group;constructor(l,f){this.ctx=l.getContext("webgpu"),this.configs=f,this.fontAtlas=new t,(async()=>{await this.initializeWebGPU()})()}async initializeWebGPU(){if(!navigator.gpu){alert("WEBGPU IS NOT SUPPORTED ON YOUR DEVICE. YOU CAN UPGRADE YOUR BROWSER OR RESORT TO CANVAS2D/WEBGL.");return}let f=await(await navigator.gpu.requestAdapter())?.requestDevice(),p=f?.queue;if(!f||!p)return;let _=navigator.gpu.getPreferredCanvasFormat();this.ctx.configure({device:f,format:_,alphaMode:"opaque"});let Q=this.ctx.canvas;this.width=Q.width||1,this.height=Q.height||1;let j=new W;j.viewProj=y(this.width,this.height,this.cameraPos,this.zoom),j.cameraPos=[0,0],j.zoom=0.005,j.aspectRatio=this.ctx.canvas.width/this.ctx.canvas.height;let M=f.createBuffer({label:"camera buffer",size:j.bytes.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Float32Array(M.getMappedRange()).set(j.bytes),M.unmap();let P=f.createBindGroupLayout({label:"camera bind group layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!1,minBindingSize:0}}]}),A=f.createBindGroup({label:"camera bind group",layout:P,entries:[{binding:0,resource:{buffer:M}}]}),T=f.createShaderModule({label:"vertex shader",code:Ql}),O=f.createShaderModule({label:"fragment shader",code:jl});this.atlas_texture=f.createTexture({label:"font atlas",size:[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),f.queue.copyExternalImageToTexture({source:this.fontAtlas.canvas},{texture:this.atlas_texture},[this.fontAtlas.canvas.width,this.fontAtlas.canvas.height]),this.atlas_sampler=f.createSampler({magFilter:"linear",minFilter:"linear"}),this.atlas_bind_group_layout=f.createBindGroupLayout({label:"atlas bind group layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),this.atlas_bind_group=f.createBindGroup({label:"atlas bind group",layout:this.atlas_bind_group_layout,entries:[{binding:0,resource:this.atlas_texture.createView()},{binding:1,resource:this.atlas_sampler}]});let I=f.createPipelineLayout({label:"Render pipeline layout",bindGroupLayouts:[P,this.atlas_bind_group_layout],immediateSize:0}),$=f.createRenderPipeline({label:"render pipeline",layout:I,vertex:{module:T,entryPoint:"vs_main",buffers:[d.desc()]},fragment:{module:O,entryPoint:"fs_main",targets:[{format:_,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},depthStencil:void 0,multisample:{count:1,mask:4294967295,alphaToCoverageEnabled:!1},primitive:{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}}),J=f.createBuffer({label:"instance buffer",usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,size:278528,mappedAtCreation:!1});this.device=f,this.queue=p,this.render_pipeline=$,this.instance_buffer=J,this.camera_buffer=M,this.camera_bind_group=A}resize(l,f){if(!this.queue||!this.camera_buffer)return;let p=window.devicePixelRatio,_=Math.floor(l*p),Q=Math.floor(f*p);if(_>0&&Q>0){if(this.width=_,this.height=Q,this.ctx.canvas instanceof HTMLCanvasElement)this.ctx.canvas.width=_,this.ctx.canvas.height=Q;let j=_/Q,M=new W;M.viewProj=y(this.width,this.height,this.cameraPos,this.zoom),M.cameraPos=this.cameraPos,M.zoom=this.zoom,M.aspectRatio=j,this.queue.writeBuffer(this.camera_buffer,0,M.bytes.buffer)}}update(l){if(this.num_instances=l.length,l.length===0)return;let f=17,p=new Float32Array(l.length*f),_=new Uint32Array(p.buffer);l.forEach((j,M)=>{let P=M*f;p[P+0]=j.position[0],p[P+1]=j.position[1],p[P+2]=j.size[0],p[P+3]=j.size[1],p[P+4]=j.rotation,_[P+5]=j.shape_type,_[P+6]=j.sides,p[P+7]=j.fill_style[0],p[P+8]=j.fill_style[1],p[P+9]=j.fill_style[2],p[P+10]=j.fill_style[3],p[P+11]=j.border_color[0],p[P+12]=j.border_color[1],p[P+13]=j.border_color[2],p[P+14]=j.border_color[3],p[P+15]=j.border_thickness,p[P+16]=j.extra_param});let Q=p.byteLength;if(Q>this.instance_buffer.size)this.instance_buffer.destroy(),this.instance_buffer=this.device.createBuffer({label:"dyn instance buffer",size:Q,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Float32Array(this.instance_buffer.getMappedRange()).set(p),this.instance_buffer.unmap();else this.queue.writeBuffer(this.instance_buffer,0,p)}update_camera(l,f){let p=Math.max(1,this.width/this.height),_=new W;_.viewProj=y(this.width,this.height,l,f),_.cameraPos=l,_.zoom=f,_.aspectRatio=p,this.queue.writeBuffer(this.camera_buffer,0,_.bytes.buffer)}render_entities_with_text(l,f,p){if(!l.length)return;this.update_camera(f,p),this.update(l);let Q=this.ctx.getCurrentTexture().createView(),j=this.device.createCommandEncoder({label:"entities render encoder"}),M=j.beginRenderPass({label:"entities render pass",colorAttachments:[{view:Q,resolveTarget:void 0,depthSlice:void 0,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}],depthStencilAttachment:void 0,occlusionQuerySet:void 0,timestampWrites:void 0});M.setPipeline(this.render_pipeline),M.setBindGroup(0,this.camera_bind_group),M.setBindGroup(1,this.atlas_bind_group),M.setVertexBuffer(0,this.instance_buffer),M.draw(6,this.num_instances),M.end(),this.queue.submit([j.finish()])}setCamera(l,f){this.cameraPos=l,this.zoom=f}pushInstance(l){let[f,p,_,Q]=this.currentColor;this.frameInstances.push({position:l.position,size:l.size,rotation:l.rotation,shape_type:l.shape_type,sides:l.sides??0,fill_style:[f,p,_,Q],border_color:[0,0,0,0],border_thickness:0,extra_param:l.extra_param??0})}clear(l,f,p,_){this.clearColor=[l/255,f/255,p/255,_]}setColor(l,f,p,_){this.currentColor=[l/255,f/255,p/255,_]}drawTriangle(l,f,p,_,Q,j){let M=(l+p+Q)/3,P=(f+_+j)/3,A=(Math.hypot(l-M,f-P)+Math.hypot(p-M,_-P)+Math.hypot(Q-M,j-P))/3,T=Math.atan2(f-P,l-M);this.pushInstance({position:[M,P],size:[A*2,A*2],rotation:T,shape_type:3,sides:3})}drawRect(l,f,p,_){this.pushInstance({position:[l+p/2,f+_/2],size:[p,_],rotation:0,shape_type:1})}drawRegularPolygonImpl(l,f,p,_,Q=0){this.pushInstance({position:[l,f],size:[p,p],rotation:Q,shape_type:3,sides:_})}drawCustomSides(l,f,p,_,Q){this.drawRegularPolygonImpl(l,f,p,_,Q)}drawRegularPolygon(l,f,p,_,Q){this.drawRegularPolygonImpl(l,f,p,_,Q)}drawPolygon(l){if(!l.length)return;let f=l.reduce((j,M)=>j+M[0],0)/l.length,p=l.reduce((j,M)=>j+M[1],0)/l.length,_=l.reduce((j,[M,P])=>j+Math.hypot(M-f,P-p),0)/l.length,Q=Math.atan2((l[0]?.[1]??0)-p,(l[0]?.[0]??0)-f);this.pushInstance({position:[f,p],size:[_*2,_*2],rotation:Q,shape_type:3,sides:l.length})}present(){if(!this.device||!this.queue||!this.render_pipeline)return;this.update_camera(this.cameraPos,this.zoom),this.update(this.frameInstances);let l=this.ctx.getCurrentTexture().createView(),f=this.device.createCommandEncoder({label:"immediate-mode frame encoder"}),p=f.beginRenderPass({label:"immediate-mode frame pass",colorAttachments:[{view:l,loadOp:"clear",clearValue:{r:this.clearColor[0],g:this.clearColor[1],b:this.clearColor[2],a:this.clearColor[3]},storeOp:"store"}]});if(this.num_instances>0)p.setPipeline(this.render_pipeline),p.setBindGroup(0,this.camera_bind_group),p.setBindGroup(1,this.atlas_bind_group),p.setVertexBuffer(0,this.instance_buffer),p.draw(6,this.num_instances);p.end(),this.queue.submit([f.finish()]),this.frameInstances=[]}processFrame(l,f){let p=this,_=0;while(_<f)switch(l[_++]){case 0:{if(!p.clear)throw Error("WebGPU backend does not implement 'clear()'.");p.clear(l[_++],l[_++],l[_++],l[_++]);break}case 1:{if(!p.setColor)throw Error("WebGPU backend does not implement 'setColor()'.");p.setColor(l[_++],l[_++],l[_++],l[_++]);break}case 2:{if(!p.drawLine)throw Error("WebGPU backend does not implement 'drawLine()'.");p.drawLine(l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 3:{if(!p.drawCircle)throw Error("WebGPU backend does not implement 'drawCircle()'.");p.drawCircle(l[_++],l[_++],l[_++]);break}case 4:{if(!p.drawRect)throw Error("WebGPU backend does not implement 'drawRect()'.");p.drawRect(l[_++],l[_++],l[_++],l[_++]);break}case 5:{if(!p.drawTriangle)throw Error("WebGPU backend does not implement 'drawTriangle()'.");p.drawTriangle(l[_++],l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 6:{if(!p.drawRegularPolygon)throw Error("WebGPU backend does not implement 'drawRegularPolygon()'.");p.drawRegularPolygon(l[_++],l[_++],l[_++],l[_++],l[_++]);break}case 7:{if(!p.drawPolygon)throw Error("WebGPU backend does not implement 'drawPolygon()'.");let j=l[_++],M=[];for(let P=0;P<j;P++)M.push([l[_++],l[_++]]);p.drawPolygon(M);break}case 8:{let j=l[_++],M=l[_++],P=l[_++],A=l[_++],T=l[_++],O="";for(let I=0;I<A;I++)O+=String.fromCharCode(l[_++]);if(!p.drawText)throw Error("WebGPU backend does not implement 'drawText()'.");p.drawText(j,M,O,P,T);break}}this.present()}pushGlyphInstance(l,f,p){let[_,Q,j,M]=this.currentColor;this.frameInstances.push({position:l,size:f,rotation:0,shape_type:5,sides:0,fill_style:[_,Q,j,M],border_color:p,border_thickness:0,extra_param:0})}drawText(l,f,p,_,Q){if(!this.fontAtlas)return;let j=_/this.fontAtlas.baseSize,M=0;for(let A of p){let T=this.fontAtlas.glyphs.get(A);M+=T?T.advance*j:this.fontAtlas.spaceAdvance*j}let P=l;if(Q===1)P-=M/2;else if(Q===2)P-=M;for(let A of p){let T=this.fontAtlas.glyphs.get(A);if(!T){P+=this.fontAtlas.spaceAdvance*j;continue}let O=T.width*j,I=T.height*j;this.pushGlyphInstance([P+O/2,f+I/2],[O,I],[T.u0,T.v0,T.u1-T.u0,T.v1-T.v0]),P+=T.advance*j}}}class a{commandBuffer;constructor(){this.commandBuffer=new g}resetCommandBuffer(){this.commandBuffer.reset()}clear(l,f,p,_){this.commandBuffer.clear(l,f,p,_)}setColor(l,f,p,_){this.commandBuffer.setColor(l,f,p,_)}drawLine(l,f,p){this.commandBuffer.drawLine(l,f,p)}drawCircle(l,f,p){this.commandBuffer.drawCircle(l,f,p)}drawRect(l,f,p,_){this.commandBuffer.drawRect(l,f,p,_)}drawTriangle(l,f,p,_,Q,j){this.commandBuffer.drawTriangle(l,f,p,_,Q,j)}drawRegularPolygon(l,f,p,_,Q){this.commandBuffer.drawRegularPolygon(l,f,p,_,Q)}drawPolygon(l){this.commandBuffer.drawPolygon(l)}drawPentagon(l,f,p,_){this.commandBuffer.drawRegularPolygon(l,f,p,5,_)}drawHexagon(l,f,p,_){this.commandBuffer.drawRegularPolygon(l,f,p,6,_)}drawSeptagon(l,f,p,_){this.commandBuffer.drawRegularPolygon(l,f,p,7,_)}drawOctogon(l,f,p,_){this.commandBuffer.drawRegularPolygon(l,f,p,8,_)}drawText(l,f,p,_,Q){this.commandBuffer.drawText(l,f,p,_,Q)}setCamera(l){this.commandBuffer.updateView(l)}}var s;((_)=>{_[_.CANVAS=0]="CANVAS";_[_.WEBGL=1]="WEBGL";_[_.WEBGPU=2]="WEBGPU"})(s||={});class e{canvas;configs;backend;renderEvent;active=!1;fps=60;lastFrameTimestamp=performance.now();onFrame=()=>{};constructor(l,f){switch(this.canvas=l,this.configs=f,this.configs.backend){case 0:this.backend=new x(l,f);break;case 2:this.backend=new D(l,f);break;case 1:this.backend=new m(l,f);break;default:throw Error(`Unsupported backend: ${this.configs.backend}`)}this.renderEvent=new a}start(){if(this.active)return;this.active=!0;let l=(f)=>{if(!this.active)return;let p=f-this.lastFrameTimestamp;if(this.lastFrameTimestamp=f,p>0){let _=1000/p;this.fps=this.fps*0.9+_*0.1}if(this.renderEvent.resetCommandBuffer(),this.onFrame(this.renderEvent,f),this.configs.debug)this.renderEvent.setColor(0,0,0,1),this.renderEvent.drawRect(10,10,400,200),this.renderEvent.setColor(255,255,255,1),this.renderEvent.drawText(200,35,"DEBUG PANEL",18,1),this.renderEvent.drawText(20,65,`Command Buffer size: ${this.renderEvent.commandBuffer.length}`,16,0),this.renderEvent.drawText(20,85,`FPS: ${this.fps.toFixed(2)}`,16,0),this.renderEvent.drawText(20,105,`Memory: ${"memory"in performance&&performance.memory?(performance.memory.usedJSHeapSize/1048576).toFixed(2)+"MB / "+(performance.memory.jsHeapSizeLimit/1048576).toFixed(2)+"MB":"N/A"}`,16,0),this.renderEvent.drawText(20,125,`CPU Cores: ${navigator.hardwareConcurrency||"N/A"}`,16,0),this.renderEvent.drawText(20,145,`Resolution: ${window.innerWidth}x${window.innerHeight}`,16,0),this.renderEvent.drawText(20,165,`Network: ${navigator.onLine?"Online":"Offline"} (${navigator.connection?.effectiveType||"unknown"})`,16,0);this.backend.processFrame(this.renderEvent.commandBuffer.data,this.renderEvent.commandBuffer.length),requestAnimationFrame(l)};requestAnimationFrame(l)}resize(l,f){if(this.canvas.width=l,this.canvas.height=f,this.backend.resize)this.backend.resize(l,f);else throw Error("Current backend does not implement 'resize()'.")}}class H{x;y;z;constructor(l,f,p){this.x=l,this.y=f,this.z=p}add(l){return new H(this.x+l.x,this.y+l.y,this.z+l.z)}sub(l){return new H(this.x-l.x,this.y-l.y,this.z-l.z)}mul(l){return new H(this.x*l,this.y*l,this.z*l)}mag(){return Math.sqrt(this.mag_squared())}mag_squared(){return this.x*this.x+this.y*this.y+this.z*this.z}clone(){return new H(this.x,this.y,this.z)}normalize(){let l=this.mag();if(l===0)return H.ZERO;return this.mul(1/l)}dot(l){return this.x*l.x+this.y*l.y+this.z*l.z}cross(l){return new H(this.y*l.z-this.z*l.y,this.z*l.x-this.x*l.z,this.x*l.y-this.y*l.x)}distanceTo(l){let f=this.x-l.x,p=this.y-l.y,_=this.z-l.z;return Math.sqrt(f*f+p*p+_*_)}squaredDistanceTo(l){let f=this.x-l.x,p=this.y-l.y,_=this.z-l.z;return f*f+p*p+_*_}equals(l){return this.x===l.x&&this.y===l.y&&this.z===l.z}angleBetween(l){let f=Math.sqrt(this.mag_squared()*l.mag_squared());if(f===0)return 0;let p=this.dot(l)/f;return Math.acos(Math.max(-1,Math.min(1,p)))}static get ZERO(){return new H(0,0,0)}}class N{x;y;z;w;constructor(l=0,f=0,p=0,_=1){this.x=l,this.y=f,this.z=p,this.w=_}set(l,f,p,_){return this.x=l,this.y=f,this.z=p,this.w=_,this}copy(l){return this.set(l.x,l.y,l.z,l.w)}identity(){return this.set(0,0,0,1)}static identity(l=new N){return l.set(0,0,0,1)}static fromAxisAngle(l,f,p=new N){let _=f*0.5,Q=Math.sin(_);return p.set(l.x*Q,l.y*Q,l.z*Q,Math.cos(_))}magnitudeSquared(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}magnitude(){return Math.sqrt(this.magnitudeSquared())}normalize(l=this){let f=this.magnitudeSquared();if(f===0)return l.set(0,0,0,1);let p=1/Math.sqrt(f);return l.set(this.x*p,this.y*p,this.z*p,this.w*p)}static multiply(l,f,p=new N){let{x:_,y:Q,z:j,w:M}=l,P=f.x,A=f.y,T=f.z,O=f.w;return p.set(M*P+_*O+Q*T-j*A,M*A-_*T+Q*O+j*P,M*T+_*A-Q*P+j*O,M*O-_*P-Q*A-j*T)}multiply(l){return N.multiply(this,l,this)}conjugate(l=this){return l.set(-this.x,-this.y,-this.z,this.w)}}class L{data=new Float32Array(16);constructor(l=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){this.data.set(l)}static fromQuaternion(l,f=new L){l.normalize();let{x:p,y:_,z:Q,w:j}=l,M=p+p,P=_+_,A=Q+Q,T=j*M,O=j*P,I=j*A,$=p*M,J=p*P,E=p*A,K=_*P,U=_*A,F=Q*A,G=f.data;return G[0]=1-K-F,G[1]=J+I,G[2]=E-O,G[3]=0,G[4]=J-I,G[5]=1-$-F,G[6]=U+T,G[7]=0,G[8]=E+O,G[9]=U-T,G[10]=1-$-K,G[11]=0,G[12]=0,G[13]=0,G[14]=0,G[15]=1,f}static fromVector3(l,f=new L){let{x:p,y:_,z:Q}=l,j=f.data;return j[0]=1,j[1]=0,j[2]=0,j[3]=0,j[4]=0,j[5]=1,j[6]=0,j[7]=0,j[8]=0,j[9]=0,j[10]=1,j[11]=0,j[12]=p,j[13]=_,j[14]=Q,j[15]=1,f}static multiply(l,f,p=new L){let _=p.data,Q=l.data,j=f.data,M=Q[0],P=Q[1],A=Q[2],T=Q[3],O=Q[4],I=Q[5],$=Q[6],J=Q[7],E=Q[8],K=Q[9],U=Q[10],F=Q[11],G=Q[12],q=Q[13],B=Q[14],u=Q[15],R=j[0],Z=j[1],k=j[2],b=j[3],S=j[4],Y=j[5],n=j[6],w=j[7],X=j[8],C=j[9],v=j[10],c=j[11],i=j[12],z=j[13],h=j[14],o=j[15];return _[0]=M*R+O*Z+E*k+G*b,_[1]=P*R+I*Z+K*k+q*b,_[2]=A*R+$*Z+U*k+B*b,_[3]=T*R+J*Z+F*k+u*b,_[4]=M*S+O*Y+E*n+G*w,_[5]=P*S+I*Y+K*n+q*w,_[6]=A*S+$*Y+U*n+B*w,_[7]=T*S+J*Y+F*n+u*w,_[8]=M*X+O*C+E*v+G*c,_[9]=P*X+I*C+K*v+q*c,_[10]=A*X+$*C+U*v+B*c,_[11]=T*X+J*C+F*v+u*c,_[12]=M*i+O*z+E*h+G*o,_[13]=P*i+I*z+K*h+q*o,_[14]=A*i+$*z+U*h+B*o,_[15]=T*i+J*z+F*h+u*o,p}static getPerspectiveMatrix(l,f,p,_,Q=new L){if(p<=0||p===_)return console.warn("Invalid near/far values."),Q;let j=Q.data,M=1/Math.tan(l*Math.PI/360),P=1/(p-_);return j[0]=M/f,j[1]=0,j[2]=0,j[3]=0,j[4]=0,j[5]=M,j[6]=0,j[7]=0,j[8]=0,j[9]=0,j[10]=(_+p)*P,j[11]=-1,j[12]=0,j[13]=0,j[14]=2*_*p*P,j[15]=0,Q}static getOrthographicMatrix(l,f,p,_,Q=-1,j=1,M=new L){if(l===f)return console.warn("Invalid left/right values."),M;if(p===_)return console.warn("Invalid bottom/top values."),M;if(Q===j)return console.warn("Invalid near/far values."),M;let P=1/(l-f),A=1/(p-_),T=1/(Q-j),O=M.data;return O[0]=-2*P,O[1]=0,O[2]=0,O[3]=0,O[4]=0,O[5]=-2*A,O[6]=0,O[7]=0,O[8]=0,O[9]=0,O[10]=2*T,O[11]=0,O[12]=(l+f)*P,O[13]=(_+p)*A,O[14]=(j+Q)*T,O[15]=1,M}}class ll{position;rotation;fov;aspectRatio;near;far;projectionMatrix=new L;viewMatrix=new L;viewProjectionMatrix=new L;constructor(l=60,f=1.7777777777777777,p=0.1,_=1000,Q=new H(0,0,0),j=N.identity()){this.fov=l,this.aspectRatio=f,this.near=p,this.far=_,this.position=Q,this.rotation=j,this.updateProjectionMatrix(),this.updateViewMatrix(),this.updateViewProjectionMatrix()}updateProjectionMatrix(){L.getPerspectiveMatrix(this.fov,this.aspectRatio,this.near,this.far,this.projectionMatrix)}updateViewMatrix(){let l=this.rotation.conjugate(),f=L.fromQuaternion(l),p=L.fromVector3(this.position);L.multiply(f,p,this.viewMatrix)}updateViewProjectionMatrix(){L.multiply(this.projectionMatrix,this.viewMatrix,this.viewProjectionMatrix)}}class Gl{position;rotation;left;right;top;bottom;near;far;projectionMatrix=new L;viewMatrix=new L;viewProjectionMatrix=new L;constructor(l,f=1.7777777777777777,p=-1,_=1,Q=new H(0,0,0),j=N.identity()){this.left=-l/2,this.right=l/2,this.top=-(l/f)/2,this.bottom=l/f/2,this.near=p,this.far=_,this.position=Q,this.rotation=j,this.updateProjectionMatrix(),this.updateViewMatrix(),this.updateViewProjectionMatrix()}updateProjectionMatrix(){L.getOrthographicMatrix(this.left,this.right,this.bottom,this.top,this.near,this.far,this.projectionMatrix)}updateViewMatrix(){let l=this.rotation.conjugate(),f=L.fromQuaternion(l),p=L.fromVector3(this.position);L.multiply(f,p,this.viewMatrix)}updateViewProjectionMatrix(){L.multiply(this.projectionMatrix,this.viewMatrix,this.viewProjectionMatrix)}}var Ml=document.createElement("canvas");document.body.appendChild(Ml);var r=new e(Ml,{backend:1,antialias:!1});window.addEventListener("resize",()=>{r.resize(window.innerWidth,window.innerHeight)});r.resize(window.innerWidth,window.innerHeight);r.start();var Hl=new ll(60,window.innerWidth/window.innerHeight,0.1,1000,new H(-100,0,-100),N.fromAxisAngle(new H(0,1,0),Math.PI/4)),Jl=0;r.onFrame=(l,f)=>{l.setCamera(Hl),l.clear(200,200,200,1),l.setColor(255,0,0,1),l.drawRect(0,0,50,50),l.setColor(0,0,255,1),l.drawRect(-50,-50,50,50),Jl=f};export{D as WebGPUBackend,m as WebGLBackend,e as Engine,_l as Commands,x as CanvasBackend,s as Backends};

//# debugId=6D34EC6B931B391564756E2164756E21
//# sourceMappingURL=index.js.map
