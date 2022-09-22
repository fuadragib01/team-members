import { useBlockProps, RichText } from "@wordpress/block-editor";
import { Icon } from "@wordpress/components";

export default function Save({ attributes }) {
    const { name, bio, imgUrl, imgAlt, imgId, socialLinks } = attributes;
    return (
        <div {...useBlockProps.save()}>
            {imgUrl && (
                <img
                    src={imgUrl}
                    alt={imgAlt}
                    className={imgId ? `wp-image-${imgId}` : ""}
                />
            )}
            {name && <RichText.Content value={name} tagName="h4" />}
            {bio && <RichText.Content value={bio} tagName="p" />}
            {socialLinks.length > 0 && (
                <div className="wp-block-plugin-slug-team-member-social-links">
                    <ul>
                        {socialLinks.map((item, index) => {
                            return (
                                <li key={index} data-icon={item.icon}>
                                    <a href={item.link}>
                                        <Icon icon={item.icon} />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
