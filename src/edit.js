/**
 * WordPress dependencies
 */
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { PanelBody, RangeControl } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
    const { columns } = attributes;
    const onChangeColumns = (newColumns) => {
        setAttributes({ columns: newColumns });
    };
    return (
        <div
            {...useBlockProps({
                className: `has-${columns}-columns`,
            })}
        >
            <InspectorControls>
                <PanelBody>
                    <RangeControl
                        label={__("Columns", "team-members")}
                        min={1}
                        max={6}
                        value={columns}
                        onChange={onChangeColumns}
                    />
                </PanelBody>
            </InspectorControls>
            <InnerBlocks
                allowedBlocks={["plugin-slug/team-member"]}
                template={[
                    ["plugin-slug/team-member"],
                    ["plugin-slug/team-member"],
                    ["plugin-slug/team-member"],
                ]}
                // templateLock="insert"
            />
        </div>
    );
}
