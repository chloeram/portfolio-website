import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState } from "react";
import waterVertexShader from './shaders/waterVertex.glsl?raw';
import waterFragmentShader from './shaders/waterFragment.glsl?raw';


// Custom Water Shader
const WaterShader = {
    uniforms: {
        uTime: { value: 0 },
        uRipplePosition: { value: new THREE.Vector2(0.5, 0.5) },
        uRippleStrength: { value: 0.0 },
        uWaterColor: { value: new THREE.Color("#364B45") }, // ✅ Single uniform pond color
        uOpacity: { value: 0.75 },
    },
    vertexShader: `
varying vec2 vUv;
varying float vWave;
uniform float uTime;
uniform vec2 uRipplePosition;
uniform float uRippleStrength;

// Perlin Noise -- Smooth + organic water flow
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix( mix( random(i + vec2(0.0,0.0)), random(i + vec2(1.0,0.0)), u.x),
                mix( random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x), u.y);
}

void main() {
    vUv = uv;
    vec3 pos = position;

    // Wave Flow (Top Left to Bottom Right)**
    float waveFactor = noise((pos.xy * 4.0 - uTime * 0.2)) * 0.04; // Negative uTime to flip direction

    // Ripples size and effect
    float distanceToRipple = length(vUv - uRipplePosition) * 3.0;
    float rippleEffect = exp(-18.0 * distanceToRipple) * sin(uTime * 10.0 - distanceToRipple * 40.0) * uRippleStrength;

    // **Contain Waves Within the Screen**
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                     smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
                     
    pos.z += (waveFactor + rippleEffect) * edgeFade; // Diminish waves near edges
    vWave = (waveFactor + rippleEffect) * edgeFade;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}




    `,
    fragmentShader: `
uniform vec3 uWaterColor;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
varying float vWave;

// Perlin Noise for Artistic Water Flow
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix( mix( random(i + vec2(0.0,0.0)), random(i + vec2(1.0,0.0)), u.x),
                mix( random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x), u.y);
}

void main() {
    // **Pixelation Effect (Lower Resolution Sampling)**
    float pixelSize = 0.005; // Increase for stronger pixelation
    vec2 pixelatedUv = floor(vUv / pixelSize) * pixelSize; // Snap UV coordinates to a pixel grid

    // **Base Water Color with Richer Green-Blue Depth**
    vec3 baseWaterColor = mix(vec3(0.04, 0.16, 0.13), vec3(0.02, 0.22, 0.18), pixelatedUv.y);
    float depthNoise = noise(pixelatedUv * 10.0 + uTime * 0.08) * 0.18;

    // **Wave Motion with Softer Curves (Using Pixelated UV)**
    float waveDetail = noise(pixelatedUv * 15.0 + uTime * 0.20) * 0.1;
    float waveMovement = sin((pixelatedUv.x + pixelatedUv.y) * 10.0 + uTime * 0.2) * 0.01;
    float waveStrength = depthNoise + waveDetail + waveMovement;

    // **Soft Posterization (Balanced Blending)**
    float stepAmount = 50.0;  // More steps for smoother posterization
    float posterizedWave = floor(waveStrength * stepAmount) / stepAmount;

    // **Restored Color Palette (More Depth, Fewer Light Greens)**
    vec3 waveColors[6];
    waveColors[0] = vec3(0.02, 0.08, 0.07);  // Nearly black-green
    waveColors[1] = vec3(0.04, 0.14, 0.12);  // Deep blue-green
    waveColors[2] = vec3(0.07, 0.20, 0.16);  // Teal-blue dusk
    waveColors[3] = vec3(0.09, 0.25, 0.20);  // Dark, desaturated cyan
    waveColors[4] = vec3(0.12, 0.32, 0.26);  // Deep moody sea green
    waveColors[5] = vec3(0.15, 0.38, 0.30);  // Muted dark teal with soft reflections

    vec3 finalWaveColor = mix(
        mix(waveColors[0], waveColors[3], smoothstep(0.7, 0.9, posterizedWave)),
        mix(waveColors[0], waveColors[3], smoothstep(0.4, 0.7, posterizedWave)),
        smoothstep(0.5, 0.8, posterizedWave)
    );

    finalWaveColor = mix(finalWaveColor, waveColors[0], smoothstep(0.2, 0.5, posterizedWave));
    finalWaveColor = mix(finalWaveColor, waveColors[1], smoothstep(0.1, 0.3, posterizedWave));

    // **Final Water Composition**
    gl_FragColor = vec4(finalWaveColor, uOpacity);
}
    `,
};



const Water = () => {
    const ref = useRef();
    const { clock, viewport } = useThree(); // Get viewport dimensions
    const [rippleData, setRippleData] = useState({
        position: new THREE.Vector2(0.5, 0.5),
        strength: 0.0
    });

    useFrame(() => {
        if (ref.current?.material) {
            ref.current.material.uniforms.uTime.value = clock.getElapsedTime();
    
            // ✅ Use a local variable to ensure state updates properly
            setRippleData((prev) => {
                let newStrength = Math.max(0.0, prev.strength - 0.02); // ✅ Decrease ripple strength gradually
                if (newStrength > 0) {
                    console.log("Updated Ripple Strength:", newStrength);
                }
                return { position: prev.position, strength: newStrength };
            });
    
            // ✅ Pass updated values to the shader
            ref.current.material.uniforms.uRipplePosition.value = rippleData.position.clone();
            ref.current.material.uniforms.uRippleStrength.value = rippleData.strength;
        }
    });
    
    const handleClick = (event) => {
        const { offsetX, offsetY, target } = event.nativeEvent;
        const rect = target.getBoundingClientRect();
    
        // Convert click position to UV coordinates (0 to 1)
        const newPosition = new THREE.Vector2(
            offsetX / rect.width,
            1.0 - offsetY / rect.height
        );
    
        console.log("Ripple created at: ", newPosition.x, newPosition.y);
    
        // ✅ Update the ripple time and position in the shader
        setRippleData(() => ({
            position: newPosition,
            startTime: performance.now() / 1000, // Convert to seconds
            strength: 1.0, // Strong initial ripple
        }));
    
        // ✅ Ensure the shader receives the updated values
        ref.current.material.uniforms.uRipplePosition.value = newPosition;
        ref.current.material.uniforms.uRippleStartTime.value = performance.now() / 1000;
        ref.current.material.uniforms.uRippleStrength.value = 1.0;
    };
        

    return (
        <mesh
            ref={ref}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.1, 0]}
            onClick={handleClick}
        >
            <planeGeometry args={[30, 30, 128, 128]} />
            <shaderMaterial args={[WaterShader]} transparent />
        </mesh>
    );
};

export default Water;

/*
const Water = () => {
    const waterRef = useRef();

    useFrame(({ clock }) => {
        waterRef.current.material.uniforms.time.value = clock.getElapsedTime();
    });

    return (
        <mesh ref={waterRef} rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <shaderMaterial
                vertexShader={waterVertexShader}
                fragmentShader={waterFragmentShader}
                uniforms={{
                    time: { value: 0 },
                    normalMap: { value: new THREE.TextureLoader().load('/textures/water_normals.jpg') }
                }}
            />
        </mesh>
    );
};
export default Water;
*/