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
        imgId: {
            type: "number",
        },
        imgAlt: {
            type: "string",
            source: "attribute",
            selector: "img",
            attribute: "alt",
            default: "",
        },
        imgUrl: {
            type: "string",
            source: "attribute",
            selector: "img",
            attribute: "src",
        },
        socialLinks: {
            type: "array",
            default: [
                { link: "https://www.facebook.com", icon: "facebook" },
                { link: "https://www.instagram.com", icon: "instagram" },
            ],
            source: "query",
            selector: ".wp-block-plugin-slug-team-member-social-links ul li",
            query: {
                icon: {
                    source: "attribute",
                    attribute: "data-icon",
                },
                link: {
                    source: "attribute",
                    selector: "a",
                    attribute: "href",
                },
            },
        },
    },
    description: __("A team member item", "team-members"),
    edit: Edit,
    save: Save,
});
