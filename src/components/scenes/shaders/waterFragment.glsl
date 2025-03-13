uniform float time;
uniform sampler2D normalMap;
varying vec2 vUv;

void main() {
    vec3 waterColor = vec3(0.1, 0.4, 0.2);
    vec2 rippleUv = vUv + texture2D(normalMap, vUv + time * 0.02).rg * 0.05;
    vec3 rippleEffect = texture2D(normalMap, rippleUv).rgb;
    float ripple = sin(10.0 * (rippleEffect.r + vUv.y + time * 0.2)) * 0.2;
    vec3 finalColor = waterColor + ripple * 0.3;
    gl_FragColor = vec4(finalColor, 1.0);
}
