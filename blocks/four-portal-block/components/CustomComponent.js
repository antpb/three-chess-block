import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
	PerspectiveCamera,
	OrbitControls,
	useAnimations,
	Html
} from '@react-three/drei';
import { VRMUtils, VRMLoaderPlugin  } from '@pixiv/three-vrm'
import { GLTFAudioEmitterExtension } from 'three-omi';
import {
	A11y,
} from '@react-three/a11y';

function Markup( model ) {
	const targetLoc = useRef();

	return(<>
		<group ref={ targetLoc }>
          <mesh scale={[1, 1, 1]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
			<meshBasicMaterial wireframe attach="material" color={ 0xffffff } />
			<boxBufferGeometry args={ [ 10, 10, 10 ] } attach="geometry" />
          </mesh>
		</group>

	</>);    
}


export default function CustomComponent( props ) {
	return (
		<>
            <Markup/>
		</>
	);
}