import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	return (
		<div>
			<InnerBlocks.Content />
		</div>
	);
};

export default Save;
