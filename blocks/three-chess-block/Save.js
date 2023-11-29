import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
	return (
		<div {...useBlockProps.save()}>
			<>
			<div id="three-chess-block-container"></div>
				<div className="three-object-three-app-three-chess-block">
					<p className="three-chess-block-positionX">
						{attributes.positionX}
					</p>
					<p className="three-chess-block-positionY">
						{attributes.positionY}
					</p>
					<p className="three-chess-block-positionZ">
						{attributes.positionZ}
					</p>
					<p className="three-chess-block-rotationX">
						{attributes.rotationX}
					</p>
					<p className="three-chess-block-rotationY">
						{attributes.rotationY}
					</p>
					<p className="three-chess-block-rotationZ">
						{attributes.rotationZ}
					</p>
					<p className="three-chess-block-colorWhite">
						{attributes.colorWhite}
					</p>
					<p className="three-chess-block-colorBlack">
						{attributes.colorBlack}
					</p>
				</div>
			</>
		</div>
	);
}
