import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
    const { columns } = attributes;
    return (
        <div
            {...useBlockProps.save({
                className: `has-${columns}-columns`,
            })}
        >
            <InnerBlocks.Content />
        </div>
    );
};

export default Save;
