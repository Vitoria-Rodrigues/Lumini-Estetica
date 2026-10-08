/* eslint-disable @typescript-eslint/no-empty-interface */
import type * as THREE from 'three/webgpu';
import type { Object3DNode, MaterialNode } from '@react-three/fiber';
// Important: importing React to ensure this file is treated as a module.
import * as React from 'react';

// =============================================================================
// 1. Module Augmentation for @react-three/fiber
// =============================================================================
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshBasicNodeMaterial: MaterialNode<
      THREE.MeshBasicNodeMaterial,
      typeof THREE.MeshBasicNodeMaterial
    >;
    meshStandardNodeMaterial: MaterialNode<
      THREE.MeshStandardNodeMaterial,
      typeof THREE.MeshStandardNodeMaterial
    >;
    meshPhysicalNodeMaterial: MaterialNode<
      THREE.MeshPhysicalNodeMaterial,
      typeof THREE.MeshPhysicalNodeMaterial
    >;
  }
}

// =============================================================================
// 2. Global JSX Intrinsic Elements Augmentation
// =============================================================================
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshBasicNodeMaterial: Object3DNode<
        THREE.MeshBasicNodeMaterial,
        typeof THREE.MeshBasicNodeMaterial
      >;
      meshStandardNodeMaterial: Object3DNode<
        THREE.MeshStandardNodeMaterial,
        typeof THREE.MeshStandardNodeMaterial
      >;
      meshPhysicalNodeMaterial: Object3DNode<
        THREE.MeshPhysicalNodeMaterial,
        typeof THREE.MeshPhysicalNodeMaterial
      >;
    }
  }
}
