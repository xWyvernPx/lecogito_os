
// import React, { useEffect, useMemo } from "react";
// import { 
//     useCreateBlockNote, 
//     SuggestionMenuController, 
//     getDefaultReactSlashMenuItems,
// } from "@blocknote/react";
// import {
// 	BlockNoteView,
// 	lightDefaultTheme,
// 	darkDefaultTheme,
//     Theme,
// } from "@blocknote/mantine";
// import {
// 	Block,
// 	BlockNoteSchema,
// 	defaultBlockSpecs,
// 	defaultInlineContentSpecs,
// 	// filterSuggestionItems,
//     PartialBlock,
    
// } from "@blocknote/core";
// import {filterSuggestionItems,} from "@blocknote/core/extensions"
// import { useOSStore } from "../../features/os/stores/os-store";

// // Define custom theme based on user requirements (The "Red" Theme)
// const lightRedTheme = {
// 	colors: {
// 		editor: {
// 			text: "#222222",
// 			background: "transparent",
// 		},
// 		menu: {
// 			text: "#ffffff",
// 			background: "#9b0000",
// 		},
// 		tooltip: {
// 			text: "#ffffff",
// 			background: "#b00000",
// 		},
// 		hovered: {
// 			text: "#ffffff",
// 			background: "#b00000",
// 		},
// 		selected: {
// 			text: "#ffffff",
// 			background: "#c50000",
// 		},
// 		disabled: {
// 			text: "#9b0000",
// 			background: "#7d0000",
// 		},
// 		shadow: "#640000",
// 		border: "#870000",
// 		sideMenu: "#bababa",
// 		highlights: lightDefaultTheme.colors.highlights,
// 	},
// 	borderRadius: 4,
// 	fontFamily: "Merriweather, serif",
// } satisfies Theme;

// const darkRedTheme = {
// 	...lightRedTheme,
// 	colors: {
// 		...lightRedTheme.colors,
// 		editor: {
// 			text: "#e5e5e5",
// 			background: "transparent",
// 		},
// 		menu: {
// 			text: "#ffffff",
// 			background: "#4a0404",
// 		},
// 		sideMenu: "#ffffff",
// 		highlights: darkDefaultTheme.colors.highlights,
// 	},
// } satisfies Theme;

// interface BlockEditorProps {
// 	onChange?: (content: string) => void; // We return JSON string
// 	initialContent?: string; // Expects JSON string or Markdown string
// 	readonly?: boolean;
// }

// const schema = BlockNoteSchema.create({
// 	blockSpecs: {
// 		...defaultBlockSpecs,
//         // Note: Custom blocks (Mermaid, Code, etc.) from the reference 
//         // require external libraries not easily available in this environment.
//         // We are using the default blocks for stability.
// 	},
// 	inlineContentSpecs: {
// 		...defaultInlineContentSpecs,
// 	}
// });

// export const BlockEditor: React.FC<BlockEditorProps> = ({ onChange, initialContent, readonly }) => {
// 	const { theme } = useOSStore();
//     const isDark = theme === 'night' || theme === 'gruvbox' || theme === 'seraph';

//     // Parse initial content safely
//     const parsedContent = useMemo(() => {
//         if (!initialContent) return undefined;
//         try {
//             // Try to parse as JSON blocks
//             const blocks = JSON.parse(initialContent);
//             if (Array.isArray(blocks)) return blocks as PartialBlock[];
//             return undefined;
//         } catch (e) {
//             // If JSON parse fails, it might be raw Markdown.
//             return undefined; 
//         }
//     }, [initialContent]);

// 	const editor = useCreateBlockNote({
// 		initialContent: parsedContent,
// 		schema,
// 	});

//     // Handle Markdown conversion if JSON parsing failed but we have content
//     useEffect(() => {
//         const loadMarkdown = async () => {
//             if (initialContent && !parsedContent) {
//                 const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
//                 editor.replaceBlocks(editor.document, blocks);
//             }
//         };
//         loadMarkdown();
//     }, [editor, initialContent, parsedContent]);

// 	useEffect(() => {
// 		editor.isEditable = !readonly;
// 	}, [readonly, editor]);

//     // Use a class to apply specific font styles regardless of inline theme
//     const containerClass = "bn-container font-serif"; 

//     // Render Read-Only View
//     if (readonly) {
//         return (
//             <div className={containerClass}>
//                 <BlockNoteView
//                     editor={editor}
//                     theme={isDark ? darkRedTheme : lightRedTheme}
//                     editable={false}
//                     className="bg-transparent"
//                 />
//             </div>
//         );
//     }

//     // Render Editable View
// 	return (
//         <div className={`h-full overflow-y-auto ${containerClass}`}>
//             <BlockNoteView
//                 editor={editor}
//                 theme={isDark ? darkRedTheme : lightRedTheme}
//                 onChange={() => {
//                     const json = JSON.stringify(editor.document);
//                     onChange?.(json);
//                 }}
//                 className="min-h-full"
//             >
//                 <SuggestionMenuController
//                     triggerCharacter={"/"}
//                     getItems={async (query) =>
//                         filterSuggestionItems(
//                             getDefaultReactSlashMenuItems(editor),
//                             query
//                         )
//                     }
//                 />
//             </BlockNoteView>
//         </div>
// 	);
// };
