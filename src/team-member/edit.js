import { __ } from "@wordpress/i18n";
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
} from "@wordpress/components";

function Edit({ attributes, setAttributes, isSelected }) {
    const [blobURL, setBlobURL] = useState();
    const { name, bio, imgAlt, imgUrl, imgId, socialLinks } = attributes;

    const onChangeName = (newName) => {
        setAttributes({ name: newName });
    };

    const titleRef = useRef();

    const prevUrl = usePrevious(imgUrl);

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

    useEffect(() => {
        if (imgUrl && !prevUrl) {
            titleRef.current.focus();
        }
    }, [imgUrl, prevUrl]);

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
                        {socialLinks.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Icon icon={item.icon} />
                                </li>
                            );
                        })}
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
                                    >
                                        <Icon icon="plus" />
                                    </button>
                                </Tooltip>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Edit;
