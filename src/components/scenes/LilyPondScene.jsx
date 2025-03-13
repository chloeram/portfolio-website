import { React, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Water from "/src/components/scenes/components/Pond.jsx";

const LilyPondScene = () => {
    return (
        <div className="threejs-background">
            <Canvas>
                <CameraSetup /> {/* Correctly use CameraSetup */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <Water />
                <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
            </Canvas>
        </div>
    );
};

// Custom Camera Component
const CameraSetup = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 10, 0); // Directly above the scene
        camera.lookAt(0, 0, 0); // Look straight at the center
    }, [camera]);

    return null;
};

export default LilyPondScene;
