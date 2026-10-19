"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraPreset } from "@/types";

interface ShirtModelProps {
  colorHex?: string;
  cameraPreset?: CameraPreset;
  isFrontView?: boolean;
  wireframe?: boolean;
}

export function ShirtModel({
  colorHex = "#232328",
  cameraPreset = "hero",
  isFrontView = true,
  wireframe = false,
}: ShirtModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const { camera } = useThree();

  // Create high-res dynamic fabric texture with fbfy neck print and fbfy by {name} hem print
  const { diffuseTexture, bumpTexture } = useMemo(() => {
    if (typeof window === "undefined") {
      return { diffuseTexture: null, bumpTexture: null };
    }

    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");

    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 1024;
    bumpCanvas.height = 1024;
    const bumpCtx = bumpCanvas.getContext("2d");

    if (ctx && bumpCtx) {
      // 1. Base fabric tone
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 2048, 2048);

      // Micro fabric cotton grain
      const imgData = ctx.getImageData(0, 0, 2048, 2048);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 18;
        const val = Math.min(255, Math.max(0, 240 + noise));
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
      ctx.putImageData(imgData, 0, 0);

      // Subtle fabric weave
      ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 2048; x += 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 2048);
        ctx.stroke();
      }

      // 2. Neck Logo: "FBF" inside collar back
      ctx.save();
      ctx.fillStyle = "#111113";
      ctx.font = "900 86px 'Syne', -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("FBF", 1024, 380);

      ctx.font = "600 32px -apple-system, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("L", 1024, 440);

      ctx.font = "400 20px monospace";
      ctx.letterSpacing = "2px";
      ctx.fillText("280 GSM • 100% COTTON", 1024, 480);
      ctx.restore();

      // 3. Lower Corner Hem Signature: "fbfy by {NAME}"
      ctx.save();
      ctx.fillStyle = "#f0f0ee";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // fbfy by (small and understated)
      ctx.font = "700 44px -apple-system, sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText("fbfy by", 1440, 1680);

      // Customer name directly underneath
      ctx.font = "800 44px -apple-system, sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText("YOU", 1440, 1735);
      ctx.restore();

      // 4. Generate Bump Map for tactile cotton texture
      bumpCtx.fillStyle = "#808080";
      bumpCtx.fillRect(0, 0, 1024, 1024);
      const bImgData = bumpCtx.getImageData(0, 0, 1024, 1024);
      const bData = bImgData.data;
      for (let i = 0; i < bData.length; i += 4) {
        const noise = (Math.random() - 0.5) * 45;
        const val = Math.min(255, Math.max(0, 128 + noise));
        bData[i] = val;
        bData[i + 1] = val;
        bData[i + 2] = val;
      }
      bumpCtx.putImageData(bImgData, 0, 0);
    }

    const diffTex = new THREE.CanvasTexture(canvas);
    diffTex.wrapS = THREE.RepeatWrapping;
    diffTex.wrapT = THREE.RepeatWrapping;

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;

    return { diffuseTexture: diffTex, bumpTexture: bumpTex };
  }, []);

  // Material setup with increased specular and lighter tone for luxury visibility
  const garmentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      map: diffuseTexture || undefined,
      bumpMap: bumpTexture || undefined,
      bumpScale: 0.02,
      roughness: 0.82,
      metalness: 0.08,
      wireframe: wireframe,
      side: THREE.DoubleSide,
    });
  }, [colorHex, diffuseTexture, bumpTexture, wireframe]);

  const collarMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex).multiplyScalar(1.15),
      roughness: 0.78,
      metalness: 0.05,
      bumpMap: bumpTexture || undefined,
      bumpScale: 0.03,
      wireframe: wireframe,
    });
  }, [colorHex, bumpTexture, wireframe]);

  // Refined proportional geometry with proper scaling and dropped shoulders
  const {
    bodyGeometry,
    sleeveLeftGeometry,
    sleeveRightGeometry,
    collarGeometry,
    neckTagGeometry,
    hemPatchGeometry,
  } = useMemo(() => {
    // 1. Proportional Oversized Torso
    const bodyGeo = new THREE.CylinderGeometry(0.85, 0.92, 1.95, 36, 32, false);
    const pos = bodyGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Flatter depth and gentle side drape
      pos.setZ(i, z * 0.46 + Math.sin(y * 2) * 0.02);
      // Gentle flare at waist
      if (y < -0.4) {
        pos.setX(i, x * 1.04);
      }
    }
    bodyGeo.computeVertexNormals();

    // 2. Proportional Dropped Sleeves
    const sleeveLeftGeo = new THREE.CylinderGeometry(0.36, 0.32, 0.95, 24, 16);
    const sleeveRightGeo = new THREE.CylinderGeometry(0.36, 0.32, 0.95, 24, 16);

    // 3. Collar Ring
    const collarGeo = new THREE.TorusGeometry(0.42, 0.055, 20, 48);

    // 4. Inner Neck Tag
    const neckTagGeo = new THREE.PlaneGeometry(0.48, 0.3);

    // 5. Hem Patch
    const hemPatchGeo = new THREE.PlaneGeometry(0.48, 0.28);

    return {
      bodyGeometry: bodyGeo,
      sleeveLeftGeometry: sleeveLeftGeo,
      sleeveRightGeometry: sleeveRightGeo,
      collarGeometry: collarGeo,
      neckTagGeometry: neckTagGeo,
      hemPatchGeometry: hemPatchGeo,
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetCamPos = new THREE.Vector3();
    const targetCamLookAt = new THREE.Vector3();

    switch (cameraPreset) {
      case "neck":
        targetCamPos.set(0, 0.85, 1.3);
        targetCamLookAt.set(0, 0.75, 0);
        targetRotationY.current = 0;
        targetRotationX.current = 0.2;
        break;
      case "signature":
        targetCamPos.set(0.5, -0.75, 1.2);
        targetCamLookAt.set(0.45, -0.85, 0.15);
        targetRotationY.current = -0.15;
        targetRotationX.current = -0.05;
        break;
      case "inspect":
        targetCamPos.set(0, 0, 3.8);
        targetCamLookAt.set(0, -0.05, 0);
        break;
      case "hero":
      default:
        targetCamPos.set(0, 0.05, 3.8);
        targetCamLookAt.set(0, -0.05, 0);
        targetRotationY.current =
          Math.sin(state.clock.elapsedTime * 0.5) * 0.3 +
          state.pointer.x * 0.2;
        targetRotationX.current =
          Math.sin(state.clock.elapsedTime * 0.3) * 0.05 -
          state.pointer.y * 0.12;
        break;
    }

    if (!isFrontView) {
      targetRotationY.current += Math.PI;
    }

    camera.position.lerp(targetCamPos, delta * 3.5);
    camera.lookAt(targetCamLookAt);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY.current,
      delta * 4
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX.current,
      delta * 4
    );

    if (cameraPreset === "hero") {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Main Oversized Torso */}
      <mesh
        geometry={bodyGeometry}
        material={garmentMaterial}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      />

      {/* Dropped Left Shoulder & Sleeve */}
      <mesh
        geometry={sleeveLeftGeometry}
        material={garmentMaterial}
        castShadow
        receiveShadow
        position={[-1.05, 0.35, 0]}
        rotation={[0.08, 0, 0.65]}
      />

      {/* Dropped Right Shoulder & Sleeve */}
      <mesh
        geometry={sleeveRightGeometry}
        material={garmentMaterial}
        castShadow
        receiveShadow
        position={[1.05, 0.35, 0]}
        rotation={[-0.08, 0, -0.65]}
      />

      {/* Ribbed Collar Ring */}
      <mesh
        geometry={collarGeometry}
        material={collarMaterial}
        position={[0, 0.92, 0.01]}
        rotation={[Math.PI / 2.3, 0, 0]}
        castShadow
      />

      {/* Inner Neck Label: "FBF" Monogram */}
      <mesh
        geometry={neckTagGeometry}
        position={[0, 0.82, -0.16]}
        rotation={[0.15, 0, 0]}
      >
        <meshBasicMaterial
          map={diffuseTexture || undefined}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Bottom Hem Corner Signature: "fbfy by {name}" */}
      <mesh
        geometry={hemPatchGeometry}
        position={[0.55, -0.85, 0.24]}
        rotation={[-0.05, 0.1, 0]}
      >
        <meshBasicMaterial
          map={diffuseTexture || undefined}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  );
}
