/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Edit(props) {
    return (
        <div {...useBlockProps()}>
            <InnerBlocks allowedBlocks={["plugin-slug/team-member"]} />
        </div>
    );
}
