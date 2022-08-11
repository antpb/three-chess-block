import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	return (
		<div { ...useBlockProps.save() }>
			<>
				<div className="environment-sky-block">
					<p className="sky-block-url">
						{ attributes.skyUrl }
					</p>
				</div>
			</>
		</div>
	);
}