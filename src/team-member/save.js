import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function Save({ attributes }) {
	const { name, bio, imgUrl, imgAlt, imgId } = attributes;
	return (
		<div {...useBlockProps.save()}>
			{imgUrl && (
				<img
					src={imgUrl}
					alt={imgAlt}
					className={imgId ? `wp-image-${imgId}` : ""}
				/>
			)}
			<RichText.Content value={name} tagName="h4" />
			<RichText.Content value={bio} tagName="p" />
		</div>
	);
}
