import { __ } from "@wordpress/i18n";
import {
    useBlockProps,
    RichText,
    MediaPlaceholder,
} from "@wordpress/block-editor";
import { isBlobURL } from "@wordpress/blob";
import { Spinner } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
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

    return (
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
                onSelectURL={(val) => console.log(val)}
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
    );
}
