
// we use this vertex shader for the post process steps. All we do is copy the uv value and set position appropriately

varying vec2 f_uv;
varying vec3 f_position;

void main() {
    f_uv = uv;
    f_position = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}