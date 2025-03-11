import { useRef, useEffect } from "react";
import * as THREE from "three";

const LilyPondScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Set up scene
        const scene = new THREE.Scene();

        // Set up camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, 10);

        // Set up renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Create pond (a simple plane)
        const pondGeometry = new THREE.PlaneGeometry(20, 20);
        const pondMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e90ff, 
            side: THREE.DoubleSide 
        });
        const pond = new THREE.Mesh(pondGeometry, pondMaterial);
        pond.rotation.x = -Math.PI / 2; // Flat Layout
        scene.add(pond);

        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 5);
        scene.add(light);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Handle cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default LilyPondScene;
