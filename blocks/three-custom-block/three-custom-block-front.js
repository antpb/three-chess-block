import React, { useState, useEffect } from 'react';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { PlaneGeometry, Color } from "three";

function ThreeCustomBlockRender() {
	const [blocks, setBlocks] = useState([]);

	useEffect(() => {
		let blocksArray = [];
		window.threeApp.forEach((item) => {
			if (item.className === "three-object-three-app-three-custom-block") {

				const block = {
					scaleX: item.querySelector("p.three-custom-block-scaleX").innerText,
					scaleY: item.querySelector("p.three-custom-block-scaleY").innerText ,
					scaleZ: item.querySelector("p.three-custom-block-scaleZ").innerText,
					positionX: item.querySelector("p.three-custom-block-positionX").innerText,
					positionY: item.querySelector("p.three-custom-block-positionY").innerText,
					positionZ: item.querySelector("p.three-custom-block-positionZ").innerText,
					rotationX: item.querySelector("p.three-custom-block-rotationX").innerText,
					rotationY: item.querySelector("p.three-custom-block-rotationY").innerText,
					rotationZ: item.querySelector("p.three-custom-block-rotationZ").innerText,
					height: item.querySelector("p.three-custom-block-height").innerText,
					width: item.querySelector("p.three-custom-block-width").innerText
				};
				blocksArray.push(block);
			}
		});

		setBlocks(blocksArray);

	}, []);

	return (
		<>
			{blocks.map((block, index) => (
				<group
					key={index}
					position={[Number(block.positionX), Number(block.positionY), Number(block.positionZ)]}
					rotation={[Number(block.rotationX), Number(block.rotationY), Number(block.rotationZ)]}
					scale={[Number(block.scaleX), Number(block.scaleY), Number(block.scaleZ)]}
				>
					<primitive object={new Reflector(
						new PlaneGeometry(Number(block.height), Number(block.width)),
						{
							color: new Color(0x7f7f7f),
							textureWidth: window.innerWidth * window.devicePixelRatio,
							textureHeight: window.innerHeight * window.devicePixelRatio
						}
					)} />
				</group>
			))}
		</>
	);
}

window.addEventListener('registerFrontPluginReady', function () {
	window.registerFrontPlugin(<ThreeCustomBlockRender />);
});
