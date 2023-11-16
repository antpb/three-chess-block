import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
	return (
		<div {...useBlockProps.save()}>
			<>
			<div id="three-custom-block-container"></div>
				<div className="three-object-three-app-three-custom-block">
					<p className="three-custom-block-scaleX">{attributes.scaleX}</p>
					<p className="three-custom-block-scaleY">{attributes.scaleY}</p>
					<p className="three-custom-block-scaleZ">{attributes.scaleZ}</p>
					<p className="three-custom-block-positionX">
						{attributes.positionX}
					</p>
					<p className="three-custom-block-positionY">
						{attributes.positionY}
					</p>
					<p className="three-custom-block-positionZ">
						{attributes.positionZ}
					</p>
					<p className="three-custom-block-rotationX">
						{attributes.rotationX}
					</p>
					<p className="three-custom-block-rotationY">
						{attributes.rotationY}
					</p>
					<p className="three-custom-block-rotationZ">
						{attributes.rotationZ}
					</p>
					<p className="three-custom-block-height">
						{attributes.height}
					</p>
					<p className="three-custom-block-width">
						{attributes.width}
					</p>
				</div>
			</>
		</div>
	);
}
