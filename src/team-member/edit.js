import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
} from "@wordpress/block-editor";
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { Spinner, ToolbarButton } from "@wordpress/components";

function Edit({ attributes, setAttributes }) {
	const [blobURL, setBlobURL] = useState();
	const { name, bio, imgAlt, imgUrl, imgId } = attributes;
	const onChangeName = (newName) => {
		setAttributes({ name: newName });
	};
	const onChangeBio = (newBio) => {
		setAttributes({ bio: newBio });
	};
	const onSelectImage = (image) => {
		if (!image || !image.url) {
			setAttributes({ imgId: undefined, imgUrl: undefined, imgAlt: "" });
			return;
		}
		setAttributes({
			imgId: image.id,
			imgUrl: image.url,
			imgAlt: image.alt,
		});
	};
	const onSelectURL = (newURL) => {
		setAttributes({ imgUrl: newURL, imgId: undefined, imgAlt: "" });
	};
	const removeImage = () => {
		setAttributes({
			imgAlt: "",
			imgId: undefined,
			imgUrl: undefined,
		});
	};
	useEffect(() => {
		if (!imgId && isBlobURL(imgUrl)) {
			setAttributes({ imgUrl: undefined, imgAlt: "" });
		}
	}, []);
	useEffect(() => {
		if (isBlobURL(imgUrl)) {
			setBlobURL(imgUrl);
		} else {
			revokeBlobURL(imgUrl);
			setBlobURL();
		}
	});

	return (
		<>
			{url && (
				<BlockControls groupe="inline">
					<MediaReplaceFlow
						name={__("Replace Image", "team-members")}
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
						onError={(val) => console.log(val)}
						accept="image/*"
						allowedTypes={["image"]}
						mediaId={imgId}
						mediaURL={imgUrl}
					/>
					<ToolbarButton onClick={removeImage}>
						{__("Remove Image", "team-members")}
					</ToolbarButton>
				</BlockControls>
			)}
			<div {...useBlockProps()}>
				{imgUrl && (
					<div
						className={`wp-block-plugin-slug-team-member-img ${
							isBlobURL(imgUrl) ? "is-loading" : ""
						}`}
					>
						<img src={imgUrl} alt={imgAlt} />
						{isBlobURL(imgUrl) && <Spinner />}
					</div>
				)}
				<MediaPlaceholder
					icon="admin-users"
					onSelect={onSelectImage}
					onSelectURL={onSelectURL}
					onError={(val) => console.log(val)}
					accept="image/*"
					allowedTypes={["image"]}
					disableMediaButtons={imgUrl}
				/>
				<RichText
					placeholder={__("Member name", "team-members")}
					tagName="h4"
					value={name}
					onChange={onChangeName}
					allowedFormats={[]}
				/>
				<RichText
					placeholder={__("Member bio", "team-members")}
					tagName="p"
					value={bio}
					onChange={onChangeBio}
					allowedFormats={[]}
				/>
			</div>
		</>
	);
}

export default Edit;
