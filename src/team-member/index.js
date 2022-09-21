/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencis
 */
import Edit from "./edit";
import Save from "./save";

registerBlockType("plugin-slug/team-member", {
    title: __("Team member", "team-members"),
    icon: "admin-users",
    parent: ["plugin-slug/team-members"],
    supports: {
        reusable: false,
        html: false,
    },
    attributes: {
        name: {
            type: "string",
            source: "html",
            selector: "h4",
        },
        bio: {
            type: "string",
            source: "html",
            selector: "p",
        },
    },
    description: __("A team member item", "team-members"),
    edit: Edit,
    save: Save,
});
