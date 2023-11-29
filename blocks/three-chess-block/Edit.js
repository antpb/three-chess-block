import { __ } from "@wordpress/i18n";
import React, { useState, useEffect } from "react";
import { DropZone } from "@wordpress/components";
import "./editor.scss";
import {
	useBlockProps,
	ColorPalette,
	InspectorControls,
	MediaUpload
} from "@wordpress/block-editor";
import {
	Panel,
	PanelBody,
	PanelRow,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextControl
} from "@wordpress/components";
import { more } from "@wordpress/icons";
import { ThreeChessBlock } from "./three-chess-block-editor";

export default function Edit({ attributes, setAttributes, isSelected, clientId }) {
	window.addEventListener('registerEditorPluginReady', function() {
		window.registerEditorPlugin(
			<ThreeChessBlock
				positionX={attributes.positionX}
				positionY={attributes.positionY}
				positionZ={attributes.positionZ}
				rotationX={attributes.rotationX}
				rotationY={attributes.rotationY}
				rotationZ={attributes.rotationZ}
				transformMode={"translate"}
				pluginObjectId={clientId}
			/>
		);
	});


	const { select, dispatch } = wp.data;
	const { onSelectionChange, getSelectedBlock } = wp.blocks;
	useEffect(() => {
		if( isSelected ){
				dispatch( 'three-object-environment-events' ).setFocusEvent( clientId );
			}
	}, [isSelected]);

	const onImageSelect = (imageObject) => {
		setAttributes({ imageUrl: null });
		setAttributes({
			imageUrl: imageObject.url,
			aspectHeight: imageObject.height,
			aspectWidth: imageObject.width
		});
	};

	const onChangePositionX = (positionX) => {
		setAttributes({ positionX });
	};
	const onChangePositionY = (positionY) => {
		setAttributes({ positionY });
	};
	const onChangePositionZ = (positionZ) => {
		setAttributes({ positionZ });
	};

	const onChangeRotationX = (rotationX) => {
		setAttributes({ rotationX });
	};
	const onChangeRotationY = (rotationY) => {
		setAttributes({ rotationY });
	};
	const onChangeRotationZ = (rotationZ) => {
		setAttributes({ rotationZ });
	};

	const onChangeWhiteColor = (color) => {
		setAttributes({ colorWhite: color });
	};
	const onChangeBlackColor = (color) => {
		setAttributes({ colorBlack: color });
	};


	const { mediaUpload } = wp.editor;

	const ALLOWED_MEDIA_TYPES = ["image"];

	const MyDropZone = () => {
		const [hasDropped, setHasDropped] = useState(false);
		return (
			<div>
				{hasDropped ? "Dropped!" : "Drop an image here or"}
				<DropZone
					onFilesDrop={(files) =>
						mediaUpload({
							allowedTypes: ALLOWED_MEDIA_TYPES,
							filesList: files,
							onFileChange: ([images]) => {
								onImageSelect(images);
							}
						})
					}
				/>
			</div>
		);
	};

	function handleClick(objectURL) {
		if (objectURL) {
			onImageSelect(objectURL);
		}
		console.log("fail", objectURL);
	}

	return (
		<div {...useBlockProps()}>
			<InspectorControls key="setting">
				<Panel 
					header="Settings"
					className="three-object-environment-edit-container three-object-viewer-edit-panel"
				>
					<PanelBody
						title="Three Chess Block Settings"
						icon={more}
						initialOpen={true}
					>
						<PanelRow>
							<TextControl
								className="position-inputs"
								label="X"
								// help="position x"
								value={attributes.positionX}
								onChange={(value) => onChangePositionX(value)}
							/>
							<TextControl
								className="position-inputs"
								label="Y"
								// help="position y"
								value={attributes.positionY}
								onChange={(value) => onChangePositionY(value)}
							/>
							<TextControl
								className="position-inputs"
								label="Z"
								// help="position z"
								value={attributes.positionZ}
								onChange={(value) => onChangePositionZ(value)}
							/>
						</PanelRow>
						<PanelRow>
							<legend className="blocks-base-control__label">
								{__("Rotation", "three-object-viewer")}
							</legend>
						</PanelRow>
						<PanelRow>
							<TextControl
								className="position-inputs"
								label="X"
								// help="position x"
								value={attributes.rotationX}
								onChange={(value) => onChangeRotationX(value)}
							/>
							<TextControl
								className="position-inputs"
								label="Y"
								// help="position y"
								value={attributes.rotationY}
								onChange={(value) => onChangeRotationY(value)}
							/>
							<TextControl
								className="position-inputs"
								label="Z"
								// help="position z"
								value={attributes.rotationZ}
								onChange={(value) => onChangeRotationZ(value)}
							/>
						</PanelRow>
						<PanelRow>
							<legend className="blocks-base-control__label">
								{__("White Squares Color", "three-object-viewer")}
							</legend>
						</PanelRow>
						<PanelRow>
							<ColorPalette
								value={attributes.colorWhite}
								label={__( "White Squares Color", "three-object-viewer" )}
								onChange={onChangeWhiteColor}
							/>
						</PanelRow>
						<PanelRow>
							<legend className="blocks-base-control__label">
								{__("White Squares Color", "three-object-viewer")}
							</legend>
						</PanelRow>
						<PanelRow>
							<ColorPalette
								value={attributes.colorBlack}
								label={__( "Black Squares Color", "three-object-viewer" )}
								onChange={onChangeBlackColor}
							/>
						</PanelRow>
					</PanelBody>
				</Panel>
			</InspectorControls>
			{isSelected ? (
				<>
						<div className="three-object-viewer-inner">
							<div className="three-object-viewer-inner-edit-container">
								<svg
									className="custom-icon custom-icon-cube"
									viewBox="0 0 40 40"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g transform="matrix(1,0,0,1,-1.1686,0.622128)">
										<path d="M37.485,28.953L21.699,38.067L21.699,19.797L37.485,10.683L37.485,28.953ZM21.218,19.821L21.218,38.065L5.435,28.953L5.435,10.709L21.218,19.821ZM37.207,10.288L21.438,19.392L5.691,10.301L21.46,1.197L37.207,10.288Z" />
									</g>
								</svg>
								<p>
									<b>Three Chess Block</b>
								</p>
							</div>
						</div>
				</>
			) : (
				<>
					<div className="three-object-viewer-inner">
						<div className="three-object-viewer-inner-edit-container">
							<svg
								className="custom-icon custom-icon-cube"
								viewBox="0 0 40 40"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g transform="matrix(1,0,0,1,-1.1686,0.622128)">
									<path d="M37.485,28.953L21.699,38.067L21.699,19.797L37.485,10.683L37.485,28.953ZM21.218,19.821L21.218,38.065L5.435,28.953L5.435,10.709L21.218,19.821ZM37.207,10.288L21.438,19.392L5.691,10.301L21.46,1.197L37.207,10.288Z" />
								</g>
							</svg>
							<p>
								<b>Three Chess Block</b>
							</p>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
