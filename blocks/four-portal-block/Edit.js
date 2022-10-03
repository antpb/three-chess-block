import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { DropZone } from '@wordpress/components';
import './editor.scss';
import {
	useBlockProps,
	ColorPalette,
	InspectorControls,
	MediaUpload,
} from '@wordpress/block-editor';
import {
	Panel,
	PanelBody,
	PanelRow,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { more } from '@wordpress/icons';

import ModelEdit from './components/ModelEdit';

export default function Edit( { attributes, setAttributes, isSelected } ) {

	const onChangePositionX = ( positionX ) => {
		setAttributes( { positionX: positionX } );
	};
	const onChangePositionY = ( positionY ) => {
		setAttributes( { positionY: positionY } );
	};
	const onChangePositionZ = ( positionZ ) => {
		setAttributes( { positionZ: positionZ } );
	};

	const onChangeRotationX = ( rotationX ) => {
		setAttributes( { rotationX: rotationX } );
	};
	const onChangeRotationY = ( rotationY ) => {
		setAttributes( { rotationY: rotationY } );
	};
	const onChangeRotationZ = ( rotationZ ) => {
		setAttributes( { rotationZ: rotationZ } );
	};

	const onChangeScaleX = ( scaleX ) => {
		setAttributes( { scaleX: scaleX } );
	};
	const onChangeScaleY = ( scaleY ) => {
		setAttributes( { scaleY: scaleY } );
	};
	const onChangeScaleZ = ( scaleZ ) => {
		setAttributes( { scaleZ: scaleZ } );
	};

	const onChangeAnimations = ( animations ) => {
		setAttributes( { animations: animations } );
	};

	const onChangeDestinationUrl = ( destination ) => {
		setAttributes( { destinationUrl: destination } );
	};

	const onImageSelect = ( imageObject ) => {
		setAttributes( { threeObjectUrl: null } );
		setAttributes( { threeObjectUrl: imageObject.url } );
	};

	const onChangeCollidable = ( collidableSetting ) => {
		setAttributes( { collidable: collidableSetting } );
	};

	const [ enteredURL, setEnteredURL ] = useState( "" );

	const { mediaUpload } = wp.editor;

	const ALLOWED_MEDIA_TYPES = [
		'model/gltf-binary',
		'application/octet-stream',
	];

	const MyDropZone = () => {
		const [ hasDropped, setHasDropped ] = useState( false );
		return (
			<div>
				{ hasDropped ? 'Dropped!' : 'Drop a glb here or' }
				<DropZone
					onFilesDrop={ ( files ) =>
						mediaUpload( {
							allowedTypes: ALLOWED_MEDIA_TYPES,
							filesList: files,
							onFileChange: ( [ images ] ) => {
								onImageSelect( images );
							},
						} )
					}
				/>
			</div>
		);
	};
	
  function handleClick(objectURL){
		if(objectURL){
			console.log("success good job", objectURL);
			onImageSelect(objectURL);
		}
		console.log("fail", objectURL);
	}
  

	return (
		<div { ...useBlockProps() }>
			<InspectorControls key="setting">
				<Panel header="Settings">
					<PanelBody
						title="GLB Object"
						icon={ more }
						initialOpen={ true }
					>
						<PanelRow>
							<span>
								select a glb file from your media library to
								render an object in the canvas:
							</span>
						</PanelRow>
						<PanelRow>
							<MediaUpload
								onSelect={ ( imageObject ) =>
									onImageSelect( imageObject )
								}
								type="image"
								label="GLB File"
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								value={ attributes.threeObjectUrl }
								render={ ( { open } ) => (
									<button onClick={ open }>
										{ attributes.threeObjectUrl
											? 'Replace Object'
											: 'Select Object' }
									</button>
								) }
							/>
						</PanelRow>
					</PanelBody>
					<PanelBody
						title="Model Attributes"
						icon={ more }
						initialOpen={ true }
					>
						<PanelRow>
							<TextControl
								label="Some custom attribute"
								help="Use this data however you like!"
								value={ attributes.animations }
								onChange={ ( value ) =>
									onChangeAnimations( value )
								}
							/>
						</PanelRow>
					</PanelBody>
				</Panel>
			</InspectorControls>
			{ isSelected ? (
				<>
					{ attributes.threeObjectUrl ? (
						<div className="three-object-viewer-inner">
						<div className="three-object-viewer-inner-edit-container">
							<svg
								class="custom-icon custom-icon-cube"
								viewBox="0 0 40 40"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g transform="matrix(1,0,0,1,-1.1686,0.622128)">
									<path d="M37.485,28.953L21.699,38.067L21.699,19.797L37.485,10.683L37.485,28.953ZM21.218,19.821L21.218,38.065L5.435,28.953L5.435,10.709L21.218,19.821ZM37.207,10.288L21.438,19.392L5.691,10.301L21.46,1.197L37.207,10.288Z" />
								</g>
							</svg>
							<p><b>Custom 3D Block</b></p>
							{/* <p>URL: {attributes.threeObjectUrl}</p> */}
						</div>
					</div>					
				) : (
						<div className="three-object-viewer-inner">
						<div className="three-object-viewer-inner-edit-container">
						<svg
							class="custom-icon custom-icon-cube"
							viewBox="0 0 40 40"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g transform="matrix(1,0,0,1,-1.1686,0.622128)">
								<path d="M37.485,28.953L21.699,38.067L21.699,19.797L37.485,10.683L37.485,28.953ZM21.218,19.821L21.218,38.065L5.435,28.953L5.435,10.709L21.218,19.821ZM37.207,10.288L21.438,19.392L5.691,10.301L21.46,1.197L37.207,10.288Z" />
							</g>
						</svg>
							<MediaUpload
								onSelect={ ( imageObject ) =>
									onImageSelect( imageObject )
								}
								type="image"
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								value={ attributes.threeObjectUrl }
								render={ ( { open } ) => (
									<button className="four-object-viewer-button" onClick={ open }>
										{ attributes.threeObjectUrl
											? 'Replace Object'
											: 'Select Portal' }
									</button>
								) }
							/>
						</div>
						</div>
					) }
				</>
			) : (
				<>
					{ attributes.threeObjectUrl ? (
						<div className="three-object-viewer-inner">
						<div className="three-object-viewer-inner-edit-container">
							<svg
								class="custom-icon custom-icon-cube"
								viewBox="0 0 40 40"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g transform="matrix(1,0,0,1,-1.1686,0.622128)">
									<path d="M37.485,28.953L21.699,38.067L21.699,19.797L37.485,10.683L37.485,28.953ZM21.218,19.821L21.218,38.065L5.435,28.953L5.435,10.709L21.218,19.821ZM37.207,10.288L21.438,19.392L5.691,10.301L21.46,1.197L37.207,10.288Z" />
								</g>
							</svg>
							<p><b>Custom 3D Block</b></p>
							{/* <p>URL: {attributes.threeObjectUrl}</p> */}
						</div>
					</div>					
			) : (
					<div className="three-object-viewer-inner">
					<div className="three-object-viewer-inner-edit-container">
					<svg
						class="custom-icon custom-icon-cube"
						viewBox="0 0 40 40"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g transform="matrix(1,0,0,1,-1.1686,0.622128)">
							<path d="M37.485,28.953L21.699,38.067L21.699,19.797L37.485,10.683L37.485,28.953ZM21.218,19.821L21.218,38.065L5.435,28.953L5.435,10.709L21.218,19.821ZM37.207,10.288L21.438,19.392L5.691,10.301L21.46,1.197L37.207,10.288Z" />
						</g>
					</svg>
						<MediaUpload
								onSelect={ ( imageObject ) =>
									onImageSelect( imageObject )
								}
								type="image"
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								value={ attributes.threeObjectUrl }
								render={ ( { open } ) => (
									<button className="four-object-viewer-button" onClick={ open }>
										Select Portal
									</button>
								) }
							/>
						</div>
						</div>
					) }
				</>
			) }
		</div>
	);
}
