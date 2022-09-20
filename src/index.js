/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import "./team-member";
import Save from "./save";
import Edit from "./edit";
import Attributes from "./attributes";
import example from "./example";
import deprecated from "./deprecated";
import "./style.scss";
import metadata from "../block.json";

registerBlockType(
	{
		name: "plugin-slug/team-members",
		...metadata,
	},
	{
		icon: "groups",
		attributes: Attributes,
		keywords: [
			__("team", "essential-blocks"),
			__("members", "essential-blocks"),
			__("block", "essential-blocks"),
		],
		edit: Edit,
		save: Save,
		example,
		deprecated,
	}
);
