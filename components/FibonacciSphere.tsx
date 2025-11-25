import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SphereConfig } from '../types';

interface FibonacciSphereProps {
  config: SphereConfig;
  theme: 'dark' | 'light';
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~2.3999 radians

const FibonacciSphere: React.FC<FibonacciSphereProps> = ({ config, theme }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const isDark = theme === 'dark';

  // Generate points based on Fibonacci Lattice
  const { positions, colors, lineGeometry } = useMemo(() => {
    const tempPositions = new Float32Array(config.points * 3);
    const tempColors = new Float32Array(config.points * 3);
    const linePoints: number[] = [];
    
    const color1 = new THREE.Color();
    const color2 = new THREE.Color();

    for (let i = 0; i < config.points; i++) {
      // Math: Spherical coordinates
      // y goes from 1 to -1
      const y = 1 - (i / (config.points - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      
      const theta = GOLDEN_ANGLE * i;
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Scale by radius
      tempPositions[i * 3] = x * config.radius;
      tempPositions[i * 3 + 1] = y * config.radius;
      tempPositions[i * 3 + 2] = z * config.radius;

      // Determine Color based on Scheme and Theme
      if (config.colorScheme === 'golden') {
         if (isDark) {
            color1.set('#FACC15'); // Gold
            color2.set('#CA8A04'); // Dark Gold
         } else {
            color1.set('#FF3D00'); // NASA Orange
            color2.set('#992200'); // Darker Orange
         }
        // Gradient based on Y (latitude)
        color1.lerp(color2, (y + 1) / 2); 
      } else if (config.colorScheme === 'rainbow') {
        color1.setHSL(i / config.points, 1.0, 0.5);
      } else {
        // Cyber
        if (isDark) {
            color1.set('#06b6d4'); // Cyan
            color2.set('#ec4899'); // Pink
        } else {
            color1.set('#0000FF'); // Blue
            color2.set('#FF00FF'); // Magenta
        }
        color1.lerp(color2, (Math.sin(theta) + 1) / 2);
      }

      tempColors[i * 3] = color1.r;
      tempColors[i * 3 + 1] = color1.g;
      tempColors[i * 3 + 2] = color1.b;

      // Lines: Connect to neighbor (roughly) - simple visual aid
      if (config.showLines && i < config.points - 1) {
          linePoints.push(x * config.radius, y * config.radius, z * config.radius);
          // Calculate next point for line
          const yNext = 1 - ((i + 1) / (config.points - 1)) * 2;
          const rNext = Math.sqrt(1 - yNext * yNext);
          const tNext = GOLDEN_ANGLE * (i + 1);
          linePoints.push(
             Math.cos(tNext) * rNext * config.radius,
             yNext * config.radius,
             Math.sin(tNext) * rNext * config.radius
          );
      }
    }

    // Create Line Geometry if needed
    let lineGeo = null;
    if (config.showLines) {
        lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    }

    return { positions: tempPositions, colors: tempColors, lineGeometry: lineGeo };
  }, [config.points, config.radius, config.colorScheme, config.showLines, theme, isDark]);

  // Update InstancedMesh
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    const tempObj = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < config.points; i++) {
      tempObj.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      tempObj.scale.setScalar(1); 
      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
      
      color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [positions, colors, config.points]);

  // Rotate the group
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * config.rotationSpeed;
      groupRef.current.rotation.z += delta * (config.rotationSpeed * 0.2);
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, config.points]}
      >
        <sphereGeometry args={[config.pointSize, 16, 16]} />
        <meshStandardMaterial 
            roughness={isDark ? 0.4 : 0.2} 
            metalness={isDark ? 0.8 : 0.5} 
            emissive={isDark ? new THREE.Color(0x222222) : new THREE.Color(0x000000)}
            emissiveIntensity={isDark ? 0.2 : 0}
        />
      </instancedMesh>

      {config.showLines && lineGeometry && (
         <lineSegments geometry={lineGeometry}>
            <lineBasicMaterial 
                color={isDark ? "#ffffff" : "#000000"} 
                transparent 
                opacity={isDark ? 0.2 : 0.15} 
            />
         </lineSegments>
      )}
    </group>
  );
};

export default FibonacciSphere;