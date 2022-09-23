import { __ } from "@wordpress/i18n";
import {
	DndContext,
	useSensor,
	useSensors,
	PointerSensor,
} from "@dnd-kit/core";
import {
	SortableContext,
	horizontalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";
import { useEffect, useState, useRef } from "@wordpress/element";
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { useSelect } from "@wordpress/data";
import { usePrevious } from "@wordpress/compose";
import {
	Spinner,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
	Icon,
	Tooltip,
	TextControl,
	Button,
} from "@wordpress/components";
import SortableItem from "./sortable-item";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

function Edit({ attributes, setAttributes, isSelected }) {
	const [blobURL, setBlobURL] = useState();
	const [selectedLink, setSelectedLink] = useState();
	const { name, bio, imgAlt, imgUrl, imgId, socialLinks } = attributes;

	const onChangeName = (newName) => {
		setAttributes({ name: newName });
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		})
	);

	const titleRef = useRef();

	const prevUrl = usePrevious(imgUrl);
	const prevIsSelected = usePrevious(isSelected);

	const imageObject = useSelect(
		(select) => {
			const { getMedia } = select("core");
			return imgId ? getMedia(imgId) : null;
		},
		[imgId]
	);

	const imageSizes = useSelect((select) => {
		return select(blockEditorStore).getSettings().imageSizes;
	}, []);

	const getImageSizeOptions = () => {
		if (!imageObject) return [];
		const options = [];
		const sizes = imageObject.media_details.sizes;
		for (const key in sizes) {
			const size = sizes[key];
			const imageSize = imageSizes.find((s) => s.slug === key);
			if (imageSize) {
				options.push({
					label: imageSize.name,
					value: size.source_url,
				});
			}
		}
		return options;
	};

	const onChangeImageSize = (newUrl) => {
		setAttributes({ imgUrl: newUrl });
	};

	const onChangeBio = (newBio) => {
		setAttributes({ bio: newBio });
	};

	const onChangeAlt = (newAlt) => {
		setAttributes({ imgAlt: newAlt });
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

	const updateSocialItem = (type, value) => {
		const socialLinksCopy = [...socialLinks];
		socialLinksCopy[selectedLink][type] = value;
		setAttributes({ socialLinks: socialLinksCopy });
	};

	const removeSocialItem = () => {
		setAttributes({
			socialLinks: [
				...socialLinks.slice(0, selectedLink),
				...socialLinks.slice(selectedLink + 1),
			],
		});
		setSelectedLink();
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

	const addNewsocialItem = () => {
		setAttributes({
			socialLinks: [...socialLinks, { icon: "wordpress", link: "" }],
		});
		setSelectedLink(socialLinks.length);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = socialLinks.findIndex(
				(i) => active.id === `${i.icon}-${i.link}`
			);
			const newIndex = socialLinks.findIndex(
				(i) => over.id === `${i.icon}-${i.link}`
			);
			setAttributes({
				socialLinks: arrayMove(socialLinks, oldIndex, newIndex),
			});
			setSelectedLink(newIndex);
		}
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

	useEffect(() => {
		if (imgUrl && !prevUrl) {
			titleRef.current.focus();
		}
	}, [imgUrl, prevUrl]);

	useEffect(() => {
		if (prevIsSelected && !isSelected) {
			setSelectedLink();
		}
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Image Settings", "team-members")}>
					{imgId && (
						<SelectControl
							label={__("Image Size", "team-members")}
							options={getImageSizeOptions()}
							value={imgUrl}
							onChange={onChangeImageSize}
						/>
					)}
					{imgUrl && !isBlobURL(imgUrl) && (
						<TextareaControl
							label={__("Alt Text", "team-members")}
							value={imgAlt}
							onChange={onChangeAlt}
							help={__(
								"Alternative text describes yourimage to people can't see it. Add a short description with it's key details.",
								"team-members"
							)}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			{imgUrl && (
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
					ref={titleRef}
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
				<div className="wp-block-plugin-slug-team-member-social-links">
					<ul>
						<DndContext
							sensors={sensors}
							onDragEnd={handleDragEnd}
							modifiers={[restrictToHorizontalAxis]}
						>
							<SortableContext
								items={socialLinks.map(
									(item) => `${item.icon}-${item.link}`
								)}
								strategy={horizontalListSortingStrategy}
							>
								{socialLinks.map((item, index) => {
									return (
										<SortableItem
											key={`${item.icon}-${item.link}`}
											id={`${item.icon}-${item.link}`}
											index={index}
											selectedLink={selectedLink}
											setSelectedLink={setSelectedLink}
											icon={item.icon}
										/>
									);
								})}
							</SortableContext>
						</DndContext>

						{isSelected && (
							<li className="wp-block-plugin-slug-team-member-add-icon-li">
								<Tooltip
									text={__(
										"Add social links",
										"team-members"
									)}
								>
									<button
										aria-label={__(
											"Add social links",
											"team-members"
										)}
										onClick={addNewsocialItem}
									>
										<Icon icon="plus" />
									</button>
								</Tooltip>
							</li>
						)}
					</ul>
				</div>
				{selectedLink !== undefined && (
					<div className="wp-block-plugin-slug-team-member-link-form">
						<TextControl
							label={__("Icon", "team-members")}
							value={socialLinks[selectedLink].icon}
							onChange={(icon) => {
								updateSocialItem("icon", icon);
							}}
						/>
						<TextControl
							label={__("URL", "team-members")}
							value={socialLinks[selectedLink].link}
							onChange={(link) => {
								updateSocialItem("link", link);
							}}
						/>
						<br />
						<Button isDestructive onClick={removeSocialItem}>
							{__("Remove Link", "team-members")}
						</Button>
					</div>
				)}
			</div>
		</>
	);
}

export default Edit;
