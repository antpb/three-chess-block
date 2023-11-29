import React, { useState, useEffect, useRef } from "react";
// import { useThree } from "@react-three/fiber";
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import {
	TransformControls,
	Select
} from "@react-three/drei";

import {
  PlaneGeometry,
  Color,
  Euler,
  OutlineEffect
} from "three";

function ChessBoard({ blocks, colorWhite, colorBlack }) {
    return (
        <>
            {blocks.map((block, index) => (
                <group
                    key={index}
                    position={[Number(block.positionX), Number(block.positionY), Number(block.positionZ)]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <mesh>
                        <planeGeometry args={[Number(block.height), Number(block.width)]} />
                        <meshBasicMaterial color={ block.color === 0xFFFFFF ? new Color(colorWhite) : new Color(colorBlack) } side={2} />
                    </mesh>
                </group>
            ))}
        </>
    );
}

export function ThreeChessBlock(threeChessBlock) {
	const [blocks, setBlocks] = useState([]);
	const [pieces, setPieces] = useState([]);
	useEffect(() => {
		const updateBoard = () => {

			// const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
			const letters = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
			let blocksArray = [];

			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					const blockColor = (i + j) % 2 === 0 ? 0xFFFFFF : 0x000000;
					const name = letters[i] + (j + 1).toString();

					blocksArray.push({
						positionX: i,
						positionY: 0,
						positionZ: j,
						height: 1,
						width: 1,
						color: blockColor,
						name: name
					});
				}
			}

			setBlocks(blocksArray);
		};

		updateBoard();
	
	}, []);

	const mirrorObj = useRef();
	const [isSelected, setIsSelected] = useState();
	const chessBlockAttributes = wp.data
		.select("core/block-editor")
		.getBlockAttributes(threeChessBlock.pluginObjectId);
	const TransformController = ({ condition, wrap, children }) =>
		condition ? wrap(children) : children;

//   const { scene } = useThree();
	const mirror = new Reflector(
		new PlaneGeometry(10, 10),
		{
			color: new Color(0x7f7f7f),
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio
		}
	);

	return ( chessBlockAttributes && (
					<group
						ref={mirrorObj}
					>
        				<ChessBoard blocks={blocks} colorWhite={chessBlockAttributes.colorWhite} colorBlack={chessBlockAttributes.colorBlack} />
					</group>
				)
	);
}
