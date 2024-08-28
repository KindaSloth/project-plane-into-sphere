import { OrbitControls, Plane, Sphere, useTexture, Cylinder } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WireframeSphere = () => {
  const texture = useTexture('/test-texture.jpg');
  const sphereRef = useRef<THREE.Mesh>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  const [planeRotation, setPlaneRotation] = useState<[number, number, number]>([0, 0, 0]);

  const wrap = useCallback(() => {
    if (!planeRef.current || !sphereRef.current) return;

    const planeMesh = planeRef.current;
    const sphereMesh = sphereRef.current;

    let numCollisions = 0;
    const planePositionAttribute = planeMesh.geometry.getAttribute('position');

    for (let vertexIndex = 0; vertexIndex < planePositionAttribute.count; vertexIndex++) {
        const localVertex = new THREE.Vector3();
        localVertex.fromBufferAttribute(planePositionAttribute, vertexIndex);
        localVertex.z = 3;
        const directionVector = new THREE.Vector3();
        directionVector.subVectors(sphereMesh.position, localVertex);
        directionVector.normalize();

        const ray = new THREE.Raycaster(localVertex, directionVector);
        const collisionResults = ray.intersectObject(sphereMesh);
        numCollisions += collisionResults.length;

        if (collisionResults.length > 0) {
          planePositionAttribute.setZ(vertexIndex, collisionResults[0].point.z + 0.01);
        }
    }

    console.log('Number of collisions:', numCollisions);

    planePositionAttribute.needsUpdate = true;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setPlaneRotation((prev) => [prev[0] - 0.05, prev[1], prev[2]]);
          break;
        case 'ArrowDown':
          setPlaneRotation((prev) => [prev[0] + 0.05, prev[1], prev[2]]);
          break;
        case 'Enter':
          wrap();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <mesh>
      <Sphere ref={sphereRef} args={[2, 32, 32]}>
        <meshBasicMaterial color="green" wireframe />
      </Sphere>

      <Plane ref={planeRef} args={[1, 1, 10, 10]} rotation={planeRotation}>
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </Plane>
    </mesh>
  );
};

const WireframeCylinder = () => {
  const texture = useTexture('/test-texture.jpg');
  const cylinderRef = useRef<THREE.Mesh>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  const [planePosition, setPlanePosition] = useState<[number, number, number]>([0, 0, 0]);

  const wrap = useCallback(() => {
    if (!planeRef.current || !cylinderRef.current) return;

    const planeMesh = planeRef.current;
    const cylinderMesh = cylinderRef.current;

    let numCollisions = 0;
    const planePositionAttribute = planeMesh.geometry.getAttribute('position');

    for (let vertexIndex = 0; vertexIndex < planePositionAttribute.count; vertexIndex++) {
        const localVertex = new THREE.Vector3();
        localVertex.fromBufferAttribute(planePositionAttribute, vertexIndex);
        localVertex.z = 1;
        const directionVector = new THREE.Vector3();
        directionVector.subVectors(cylinderMesh.position, localVertex);
        directionVector.normalize();

        const ray = new THREE.Raycaster(localVertex, directionVector);
        const collisionResults = ray.intersectObject(cylinderMesh);
        numCollisions += collisionResults.length;

        if (collisionResults.length > 0) {
          planePositionAttribute.setZ(vertexIndex, collisionResults[0].point.z + 0.01);
        }
    }

    console.log('Number of collisions:', numCollisions);

    planePositionAttribute.needsUpdate = true;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setPlanePosition((prev) => [prev[0], prev[1] - 0.05, prev[2]]);
          break;
        case 'ArrowDown':
          setPlanePosition((prev) => [prev[0], prev[1] + 0.05, prev[2]]);
          break;
        case 'Enter':
          wrap();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <mesh>
      <Cylinder ref={cylinderRef} args={[1, 1, 5, 32]}>
        <meshBasicMaterial color="green" wireframe />
      </Cylinder>

      <Plane ref={planeRef} args={[1, 1, 10, 10]} position={planePosition}>
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </Plane>
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas style={{ height: '100vh', width: '100vw', backgroundColor: '#000' }}>
        <ambientLight />

        {/* <WireframeSphere /> */}
        <WireframeCylinder />

        <OrbitControls />
    </Canvas>
  );
};

export default Scene;
