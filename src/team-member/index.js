/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

registerBlockType("plugin-slug/team-member", {
	title: __("Team member", "team-members"),
	icon: "admin-users",
	parent: ["plugin-slug/team-members"],
	description: __("A team member item", "team-members"),
	edit: () => <p>Edit</p>,
	save: () => <p>Save</p>,
});
