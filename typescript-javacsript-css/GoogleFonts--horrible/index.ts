import { definePluginSettings } from "@api/Settings";
import { disableStyle, enableStyle } from "@api/Styles";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const fontFamilies: Record<string, string> = {

    'Winter.ttf': 'Winter',
};

// Map fontFamilies into options for the selectedFont setting
const fontOptions = Object.entries(fontFamilies).map(([value, label]) => ({
    label: label,
    value: value,
    default: false,
}));

const settings = definePluginSettings({
    selectedFont: {
        type: OptionType.SELECT,
        description: "Select a font",
        options: fontOptions,
    },
});

let fontStyleSheet: HTMLStyleElement | null = null;

const updateStyles = (selectedFont: string) => {
    const fontFamily = fontFamilies[selectedFont];

    if (!fontFamily) {
        console.error(`Font family not found for ${selectedFont}`);
        return;
    }

    if (!fontStyleSheet) {
        fontStyleSheet = document.createElement("style");
        document.head.appendChild(fontStyleSheet);
    }

    fontStyleSheet.textContent = `
    @font-face {
        font-family: '${fontFamily}';
        src: url('https://raw.githubusercontent.com/trebor048/discordddd/main/fonts/${selectedFont}');
        font-style: normal;
    }

    * {
        font-family: '${fontFamily}', sans-serif !important;
    }
  `;
    fontStyleSheet = document.createElement("style");
    document.head.appendChild(fontStyleSheet);

};

// ... (remaining code)

export default definePlugin({
    name: "CustomFontPlugin",
    description: "Applies a custom font to the Discord window",
    authors: [Devs.LuckyCanucky],
    settings,

    start() {
        const selectedFont = settings.store.selectedFont;
        updateStyles(selectedFont);
    },

    stop() {
        if (fontStyleSheet) {
            disableStyle(fontStyleSheet.textContent || "");
            fontStyleSheet.remove();
            fontStyleSheet = null;
        }
    },

    update(selectedFont: string) {
        updateStyles(selectedFont);
    },
});
