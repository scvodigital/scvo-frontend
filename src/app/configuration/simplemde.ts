import * as SimpleMDE from 'simplemde';
export const SimpleMDEOptions = {
    autoDownloadFontAwesome: false,
	forceSync: true,
    toolbar: [
	{
		name: "bold",
		action: SimpleMDE.toggleBold,
		className: "fa fa-bold",
		title: "Bold",
		default: true
	},
	{
		name: "italic",
		action: SimpleMDE.toggleItalic,
		className: "fa fa-italic",
		title: "Italic",
		default: true
	},
	{
		name: "strikethrough",
		action: SimpleMDE.toggleStrikethrough,
		className: "fa fa-strike",
		title: "Strikethrough"
	},
	{
		name: "heading",
		action: SimpleMDE.toggleHeadingSmaller,
		className: "fa fa-header",
		title: "Heading",
		default: true
	},
	{
		name: "heading-1",
		action: SimpleMDE.toggleHeading1,
		className: "fa fa-header fa-header-x fa-header-1",
		title: "Big Heading"
	},
	{
		name: "heading-2",
		action: SimpleMDE.toggleHeading2,
		className: "fa fa-header fa-header-x fa-header-2",
		title: "Medium Heading"
	},
	{
		name: "heading-3",
		action: SimpleMDE.toggleHeading3,
		className: "fa fa-header fa-header-x fa-header-3",
		title: "Small Heading"
	},
	"|",
	{
		name: "code",
		action: SimpleMDE.toggleCodeBlock,
		className: "fa fa-code",
		title: "Code"
	},
	{
		name: "quote",
		action: SimpleMDE.toggleBlockquote,
		className: "fa fa-quote-left",
		title: "Quote",
		default: true
	},
	{
		name: "unordered-list",
		action: SimpleMDE.toggleUnorderedList,
		className: "fa fa-list-bullet",
		title: "Generic List",
		default: true
	},
	{
		name: "ordered-list",
		action: SimpleMDE.toggleOrderedList,
		className: "fa fa-list-numbered",
		title: "Numbered List",
		default: true
	},
	{
		name: "clean-block",
		action: SimpleMDE.cleanBlock,
		className: "fa fa-eraser fa-clean-block",
		title: "Clean block"
	},
	"|",
	{
		name: "link",
		action: SimpleMDE.drawLink,
		className: "fa fa-link",
		title: "Create Link",
		default: true
	},
	{
		name: "image",
		action: SimpleMDE.drawImage,
		className: "fa fa-picture",
		title: "Insert Image",
		default: true
	},
	{
		name: "table",
		action: SimpleMDE.drawTable,
		className: "fa fa-table",
		title: "Insert Table"
	},
	{
		name: "horizontal-rule",
		action: SimpleMDE.drawHorizontalRule,
		className: "fa fa-minus",
		title: "Insert Horizontal Line"
	},
	"|",
	{
		name: "preview",
		action: SimpleMDE.togglePreview,
		className: "fa fa-eye no-disable",
		title: "Toggle Preview",
		default: true
	},
	{
		name: "side-by-side",
		action: SimpleMDE.toggleSideBySide,
		className: "fa fa-columns no-disable no-mobile",
		title: "Toggle Side by Side",
		default: true
	},
	{
		name: "fullscreen",
		action: SimpleMDE.toggleFullScreen,
		className: "fa fa-arrows-alt no-disable no-mobile",
		title: "Toggle Fullscreen",
		default: true
	},
	"|",
	{
		name: "undo",
		action: SimpleMDE.undo,
		className: "fa fa-undo no-disable",
		title: "Undo"
	},
	{
		name: "redo",
		action: SimpleMDE.redo,
		className: "fa fa-repeat no-disable",
		title: "Redo"
	}
    ]
}
/* */