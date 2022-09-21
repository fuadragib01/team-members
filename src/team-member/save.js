import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function Save({ attributes }) {
    const { name, bio } = attributes;
    return (
        <div {...useBlockProps.save()}>
            <RichText.Content value={name} tagName="h4" />
            <RichText.Content value={bio} tagName="p" />
        </div>
    );
}
