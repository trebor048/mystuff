/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, Settings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType, StartAt } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { Button, Clipboard, Forms, Toasts } from "@webpack/common";

interface ThemePreset {
    bgcol: string;
    accentcol: string;
    textcol: string;
    brand: string;
}


const solarTheme = {
    bgcol: "0e2936",
    accentcol: "0c2430",
    textcol: "99b0bd",
    brand: "124057"
};

const amoledTheme = {
    bgcol: "000000",
    accentcol: "020202",
    textcol: "c0d5e4",
    brand: "070707"
};

const PurplueTheme = {
    bgcol: "0e0e36",
    accentcol: "0e0c30",
    textcol: "bdbfd8",
    brand: "171750" // Purple color from Lofi Purple theme
};

const oceanTheme = {
    bgcol: "4E6B7A", // Pastel Teal
    accentcol: "607D8C", // Slightly Darker Teal
    textcol: "ccd6dd", // Soft Gray
    brand: "6f97ac" // Cyanish color from Ocean theme
};

const mysticForestTheme = {
    bgcol: "496559", // Pastel Green
    accentcol: "5C7A6A", // Slightly Darker Green
    textcol: "AEBBC3", // Soft Gray
    brand: "558375" // Green color from Mystic Forest theme
};

const sunsetOrangeTheme = {
    bgcol: "7D4E3B", // Pastel Orange
    accentcol: "8d5b46", // Slightly Darker Orange
    textcol: "cdd9e2", // Soft Gray
    brand: "ad7861" // Orange color from Sunset Orange theme
};

const galacticPurpleTheme = {
    bgcol: "534361",
    accentcol: "604e6e",
    textcol: "ede3f1",
    brand: "725a83"
};

const frostyWhiteTheme = {
    bgcol: "E0E4E4",
    accentcol: "CED3D3",
    textcol: "2C3E50",
    brand: "ecf0f1"
};


const lemonLimeTheme = {
    bgcol: "C7D46D",
    accentcol: "B4C155",
    textcol: "161616",
    brand: "c8ce44"
};

const rubyRedTheme = {
    bgcol: "A93226",
    accentcol: "8E241D",
    textcol: "fff1d0",
    brand: "#a72015"
};

const themes = [amoledTheme, solarTheme, PurplueTheme, oceanTheme, mysticForestTheme, sunsetOrangeTheme, galacticPurpleTheme, frostyWhiteTheme, lemonLimeTheme, rubyRedTheme];

function LoadPreset() {
    const theme: ThemePreset = themes[settings.store.ColorPreset];
    settings.store.Primary = theme.bgcol;
    settings.store.Accent = theme.accentcol;
    settings.store.Text = theme.textcol;
    settings.store.Brand = theme.brand;
    injectCSS();
}

function mute(hex, amount) {
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    // Lower the brightness component
    r = Math.max(r - amount, 0);
    g = Math.max(g - amount, 0);
    b = Math.max(b - amount, 0);

    // Convert RGB to hexadecimal format
    return "#" + ((r << 16) + (g << 8) + b).toString(16).padStart(6, "0");
}

// Function to darken an RGB color by a certain amount
// Boolean variable to determine whether to add the resize event listener
let addResizeListener = false;
const luckysGuildResizer = false; // Variable to track the status of luckysGuildResizer

// Function to add resize event listener to the .guilds__2b93a element
function addResizeEventListener() {
    const guildsElement = document.querySelector(".guilds__2b93a") as HTMLElement;

    // Check if the .guilds__2b93a element exists
    if (guildsElement) {
        // Mouse position variables
        let startX: number;
        let startWidth: number;

        // Resize event listener callback function
        const resizeHandler = (event: MouseEvent) => {
            // Calculate the new width based on the mouse position
            const newWidth = startWidth + (event.clientX - startX);

            // Update the width of the element
            guildsElement.style.width = `${newWidth}px`;
        };

        // Mouse down event listener callback function
        const mouseDownHandler = (event: MouseEvent) => {
            // Store the initial mouse position and width of the element
            startX = event.clientX;
            startWidth = guildsElement.getBoundingClientRect().width;

            // Add event listeners for mousemove and mouseup events
            window.addEventListener("mousemove", resizeHandler);
            window.addEventListener("mouseup", () => {
                // Remove event listeners when the mouse button is released
                window.removeEventListener("mousemove", resizeHandler);
            });
        };

        // Add mousedown event listener to the right edge of the element
        guildsElement.addEventListener("mousedown", event => {
            // Check if the mousedown event occurred on the right edge of the element
            if (event.offsetX >= guildsElement.offsetWidth - 10) {
                mouseDownHandler(event);
            }
        });

        console.log("Resize event listener added to .guilds__2b93a element.");
    } else {
        console.error(".guilds__2b93a element not found.");
    }
}

// Function to run when the window loads or when luckysGuildResizer changes
function onWindowLoadOrLuckysGuildResizerChange() {
    if (luckysGuildResizer && !addResizeListener) {
        addResizeEventListener();
        addResizeListener = true; // Set to true to prevent adding listener again
    }
}

// Add event listener for window load event
window.addEventListener("load", onWindowLoadOrLuckysGuildResizerChange);


const ColorPicker = findComponentByCodeLazy(".Messages.USER_SETTINGS_PROFILE_COLOR_SELECT_COLOR", ".BACKGROUND_PRIMARY)");

const settings = definePluginSettings({
    luckysTheme: {
        type: OptionType.BOOLEAN,
        description: "Toggle's Lucky's theme and disables all the others from within the plugin",
        default: false,
        onChange: newValue => {
            settings.store.luckysTheme = newValue;
            if (newValue) {
                // Disable other settings when Lucky's theme is activated
                settings.store.serverListAnim = false;
                settings.store.memberListAnim = false;
                settings.store.privacyBlur = false;
                settings.store.flashBang = false;
                settings.store.tooltips = false;
                // Update the UI or trigger necessary actions
            }
            injectCSS();
        }
    },
    luckysGuildResizer: {
        type: OptionType.BOOLEAN,
        description: "Toggles if the guild list has a resizer handle",
        default: false,
        onChange: () => { const luckysGuildResizer = true; }
    },
    serverListAnim: {
        type: OptionType.BOOLEAN,
        description: "Toggles if the server list hides when not hovered",
        default: false,
        onChange: () => injectCSS()
    },
    memberListAnim: {
        type: OptionType.BOOLEAN,
        description: "Toggles if the member list hides when not hovered",
        default: true,
        onChange: () => injectCSS()
    },
    privacyBlur: {
        type: OptionType.BOOLEAN,
        description: "Blurs potentially sensitive information when not tabbed in",
        default: false,
        onChange: () => injectCSS()
    },
    flashBang: {
        type: OptionType.BOOLEAN,
        description: "you dont wanna know",
        default: false,
        onChange: () => injectCSS()
    },
    tooltips: {
        type: OptionType.BOOLEAN,
        description: "If tooltips are displayed in the client",
        default: false,
        onChange: () => injectCSS()
    },
    customFont: {
        type: OptionType.STRING,
        description: "The google fonts @import for a custom font (blank to disable)",
        default: "@import url('https://fonts.googleapis.com/css2?family=Poppins&wght@500&display=swap');",
        onChange: () => injectCSS()
    },
    animationSpeed: {
        type: OptionType.STRING,
        description: "The speed of animations",
        default: "0.2",
        onChange: () => injectCSS()
    },
    ColorPreset: {
        type: OptionType.SELECT,
        description: "A bunch of pre made color presets you can use if you dont feel like making your own :3",
        options: [
            { label: "Amoled", value: 0, default: true },
            { label: "Solar", value: 1 },
            { label: "Purplue", value: 2 },
            { label: "Ocean", value: 3 },
            { label: "Mystic Forest", value: 4 },
            { label: "Sunset Orange", value: 5 },
            { label: "Galactic Purple", value: 6 },
            { label: "Frosty White", value: 7 },
            { label: "Lemon Lime", value: 8 },
            { label: "Ruby Red", value: 9 }
        ],

        onChange: () => { LoadPreset(); }
    },
    Primary: {
        type: OptionType.COMPONENT,
        description: "",
        default: "000000",
        component: () => <ColorPick propertyname="Primary" />
    },
    Accent: {
        type: OptionType.COMPONENT,
        description: "",
        default: "313338",
        component: () => <ColorPick propertyname="Accent" />
    },
    Brand: {
        type: OptionType.COMPONENT,
        description: "",
        default: "ffffff",
        component: () => <ColorPick propertyname="Brand" />
    },
    Text: {
        type: OptionType.COMPONENT,
        description: "",
        default: "ffffff",
        component: () => <ColorPick propertyname="Text" />
    },

    ExportTheme:
    {
        type: OptionType.COMPONENT,
        description: "",
        default: "",
        component: () => <Button onClick={() => {
            copyCSS();
            Toasts.show({
                id: Toasts.genId(),
                message: "Successfully copied theme!",
                type: Toasts.Type.SUCCESS
            });
        }} >Copy The CSS for your current configuration.</Button>
    }
});


export function ColorPick({ propertyname }: { propertyname: string; }) {
    return (

        <div className="color-options-container">
            <Forms.FormTitle tag="h3">{propertyname}</Forms.FormTitle>

            <ColorPicker
                color={parseInt(settings.store[propertyname], 16)}
                onChange={color => {
                    const hexColor = color.toString(16).padStart(6, "0");
                    settings.store[propertyname] = hexColor;
                    injectCSS();
                }
                }
                showEyeDropper={false}
            />
        </div>
    );
}


function copyCSS() {
    if (Clipboard.SUPPORTS_COPY) {
        Clipboard.copy(getCSS(parseFontContent()));
    }
}

function parseFontContent() {
    const fontRegex = /family=([^&;,:]+)/;
    const customFontString: string = Settings.plugins.Glide.customFont;
    if (customFontString == null) { return; }
    const fontNameMatch: RegExpExecArray | null = fontRegex.exec(customFontString);
    const fontName = fontNameMatch ? fontNameMatch[1].replace(/[^a-zA-Z0-9]+/g, " ") : "";
    return fontName;
}
function injectCSS() {

    const fontName = parseFontContent();
    const theCSS = getCSS(fontName);

    var elementToRemove = document.getElementById("GlideStyleInjection");
    if (elementToRemove) {
        elementToRemove.remove();
    }
    const styleElement = document.createElement("style");
    styleElement.id = "GlideStyleInjection";
    styleElement.textContent = theCSS;
    document.documentElement.appendChild(styleElement);
}

function getCSS(fontName) {
    return `

        /* Luckys Theme */
        ${Settings.plugins.Glide.luckysTheme ? `

        :root {
            /*CHANGE THESE COLORS FOR THE BACKGROUND*/
                  --whiteg: rgba(255, 255, 255, 0);
                  --blueg: rgba(0, 90, 180, 0.255);
                  --greeng: rgba(204, 48, 48, 0.275);
                  --yellogw: rgba(255, 226, 68, 0.3);
                  --pinkg: rgba(153, 45, 104, 0.675);
                  --TEXTURE: url(https://i.imgur.com/YLPco54.png);
                  --textureBrightness: 1; /* <---- 0 to 1, 1 for full brightness. 0 for no brightness*/
            /*CHANGE THESE COLORS FOR THE BACKGROUND*/
            }
            #app-mount {
                  background-image: radial-gradient(circle at bottom, var(--blueg), transparent 80%), linear-gradient(to top, var(--greeng), transparent 70%), linear-gradient(to bottom, transparent, var(--whiteg), var(--blueg));
                  animation: bgg 60s infinite
            }
            .platform-win .bg__12180 {
                  background-image: var(--TEXTURE);
                  opacity: var(--textureBrightness);
                  background-size: auto;
                  background-repeat: round;
                  animation: bg 160s ease-in-out infinite
            }



            :root{
                  --transfull: transparent;
                  --background-primary: transparent;
                  --background--secondary: rgba(0, 0, 0, 0);
                  --background--secondary-alt: rgba(0, 0, 0, 0);
                  --background-tertiary: var(--background-main);
                  --background-floating: rgba(0, 0, 0, 0);
                  --bg-backdrop: var(var(--grad));
                  --bg-base-primary: rgba(0, 0, 0, 0);
                  --bg-base-secondary: rgba(0, 0, 0, 0);
                  --bg-base-tertiary: rgba(0, 0, 0, 0);
                  --title-button-right: 10px;
                  --blacktrans: rgba(0, 0, 0, 0.4);
                  --blacktrans2: rgba(0, 0, 0, 0.2);
                  --blacktrans3: rgba(0, 0, 0, 0.075);
                  --gren: #1f842d;
                  --reed: #ed4443;
                  --status-danger: var(--reedtrans) !important;
                  --scrollbar-auto-thumb: var(--white);
                  --scrollbar-auto-track: var(--blacktrans2);
                  --scrollbar-thin-thumb: var(--white);
                  --scrollbar-thin-track: var(--transfull);
                  --guild-list-width: 198px;
                  --guild-list-height: 48px;
                  --guild-item-radius: 5px;
                  --guild-item-spacing: 8px;
                  --guild-item-font-size: 16px;
                  --bradius: 16px;
                  --reedtrans: #f723239f;
                  --brand-experiment: rgb(0, 123, 255);
                  --green-360: var(--brand-experiment);
                  --background-modifier-selected: var(--brand-experiment)
                  --BG-GRADIENT: linear-gradient(120deg, rgba(39, 6, 102, 0.8), rgba(11, 109, 148, 0.65), rgba(71, 78, 7, 0.6), rgba(105, 7, 114, 0.8));
            }@keyframes bgg {
                  0%, to {background-color: var(--blueg)}25% {background-color: var(--greeng)}50% {background-color: var(--yellogw)}75% {background-color: var(--pinkg)}}
            @keyframes bg {0%,to {background-position: 0 0}5% {background-position: 20% 90%}10% {background-position: -30% 110%}15% {background-position: 50% -50%}20% {background-position: 80% 180%}25% {background-position: -40% 200%}30% {background-position: 120% 163%}35% {background-position: 0 300%}40% {background-position: -50% -100% }45% {background-position: 200% 100%}50% {background-position: 0-200%}55% {background-position: -100% 150%}60% {background-position: 250% -50%}65% {background-position: 10% 250%}70% {background-position: -200% 24%}75% { background-position: 150% -150%}80% { background-position: -100% 200%}85% {background-position: 50% -250%}90% {background-position: 300% 50%}95% {background-position: -150% 100%}}
            @keyframes flash {0%,to {opacity: 30%}50% {opacity: 100%}}
            #app-mount,
            body,
            html {
                  border-radius: 16px
            }.vc-channeltabs-tab .baseShapeRound__95d0f {
                  background-color: var(--transfull) !important
            }.vc-channeltabs-container .eyebrow__60985 {
                  font-size: 130%;
                  letter-spacing: 0;
                  line-height: 1
            }.vc-channeltabs-container {
                  box-shadow: var(--guild-header-text-shadow)
            }.vc-channeltabs-separator {
                  background: var(--blacktrans);
                  box-shadow: var(--elevation-high);
                  width: 101%;
                  margin: 0 0 0-5px;
                  padding: 0;
                  min-height: 0;
                  border-radius: 50px
            }.vc-channeltabs-tab {
                  border-radius: 8px 8px 0px 0px;
                  margin-left: 0px;
                  background-color: var(--blacktrans);
                  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, var(--brand-experiment) 0px 2px 0px -3px, var(--brand-experiment) 0px -20px 36px -20px inset
            }.vc-channeltabs-tab-container {
                  width: calc(100vw - 125px)
            }.titleBar__01af6 [aria-label^=Close]>svg:hover {
                  transform: scale(1.6);
                  transition: transform .2s ease-in-out;
                  background-color: #f97a7a !important
            }.titleBar__01af6 [aria-label^=Close]>svg {
                  transform: scale(1.3);
                  transition: transform .4s ease-out;
                  background-color: #f25056 !important;
                  background-size: cover !important;
                  border: 1px rgba(75, 75, 75, .8) solid;
                  border-radius: 25px
            }.svg_ad7356 mask,
            .titleBar__01af6 [aria-label^=Close]>svg>polygon,
            [aria-label^=Maximise]>svg>rect,
            [aria-label^=Minimize]>svg>rect ,[aria-label^=Maximise]>svg>rect,
            [aria-label^=Minimisz]>svg>rect {
                  display: none
            }.titleBar__01af6 [aria-label^=Close],
            [aria-label^=Maximise],
            [aria-label^=Minimise] ,[aria-label^=Maximize],
            [aria-label^=Minimize] {
                  background: 0 0 !important;
                  right: var(--title-button-right);
                  margin-top: -26px;
                  transition: margin-top .15s ease .56s
            }body:hover [aria-label^=Close] {
                  margin-top: 2px;
                  transition: margin-top .8s ease .1s
            }[aria-label^=Maximise]>svg:hover,
            [aria-label^=Minimise]>svg:hover ,[aria-label^=Maximize]>svg:hover,
            [aria-label^=Minimize]>svg:hover{
                  transform: scale(1.6);
                  transition: transform .2s ease-in-out;
                  background-color: #fbe096 !important
            }[aria-label^=Maximise]>svg,
            [aria-label^=Minimise]>svg,[aria-label^=Maximize]>svg,
            [aria-label^=Minimize]>svg{
                  transform: scale(1.3);
                  transition: transform .4s ease-out;
                  background-size: cover !important;
                  border: 1px rgba(75, 75, 75, .8) solid;
                  border-radius: 25px
            }[aria-label^=Minimise]>svg,[aria-label^=Minimize]>svg {
                  background-color: #fac536 !important
            }[aria-label^=Maximise],
            [aria-label^=Minimise] ,[aria-label^=Maximize],
            [aria-label^=Minimize] {
                  margin-top: -40px;
                  transition: margin-top .15s ease .26s
            }body:hover [aria-label^=Minimise],body:hover [aria-label^=Minimize] {
                  margin-top: 2px;
                  transition: margin-top .8s ease .65s
            }[aria-label^=Maximise]>svg:hover,
            [aria-label^=Maximize]>svg:hover  {
                  background-color: #85fb8f !important
            }[aria-label^=Maximise]>svg,[aria-label^=Maximize]>svg {
                  background-color: var(--gren) !important
            }[aria-label^=Maximise],[aria-label^=Maximize] {
                  margin-top: -35px;
                  transition: margin-top .15s ease .4s
            }body:hover [aria-label^=Maximise],body:hover [aria-label^=Maximize] {
                  margin-top: 2px;
                  transition: margin-top .8s ease .4s
            }.toastnotifications-notification {
                  background: rgba(0,0,0,0.55) !important
            }.pictureInPictureVideo_f1081d {
                  resize: both !important;
                  background: var(--transfull);
                  border-radius: var(--bradius);
                  box-shadow: none
            }:root {
                  --PIP-aspect-ratio: 16 / 9
            }.video_bc61e5 {
                  max-height: 100%;
                  aspect-ratio: var(--PIP-aspect-ratio) !important
            }.menu_dc52c6 {
                  background: var(--BG-GRADIENT);
                  border-radius: var(--bradius)
            }.menu_dc52c6 .button__3ecb4 {
                  background-color: var(--blacktrans)
            }.menu_dc52c6 .button__3ecb4:hover {
                  background-color: var(--background-modifier-selected)
            }.theme-dark .tooltipPrimary_e5c00d,
            .theme-light .tooltipPrimary_e5c00d {
                  background-color: var(--brand-experiment)
            }.background__3b30f {
                  background-color: var(--transfull);
                  border-radius: var(--bradius)
            }[class^=avatar-],
            img.avatar__08316,
            svg.Avatar__mask>foreignObject {
                  mask: none !important;
                  border-radius: 20%
            }.svg_ad7356 {
                  border-radius: 0
            }.svg_ad7356 foreignObject {
                  border-radius: 5px
            }.auto_a48086::-webkit-scrollbar-thumb {
                  background-color: #fff !important;
                  border: 0;
                  border-radius: 12px;
            }.thin_b1c063::-webkit-scrollbar-thumb {
                  border: 0;
                  border-radius: 12px;
                  background-color: #fff !important
            }div.drawerSizingWrapper__30274 {
                  height: 80vh;
                  bottom: 0;
                  right: 5px;
                  width: 600px
            }[class^=nameAndDecorator] .vc-platform-indicator {
                  flex-direction: column;
                  margin-left: 2px !important;
                  margin-right: -2px;
                  max-height: 30px
            }[class^=nameAndDecorator] .vc-platform-indicator svg {
                  width: 16px
            }[class^=nameAndDecorator] .vc-platform-indicator :only-child {
                  height: 16px
            }[class^=nameAndDecorator] .vc-platform-indicator :nth-child(3) {
                  position: absolute;
                  height: 16px;
                  margin-left: 20px
            }.container-2nx-BQ:not(.checked-25WXMf) {
                  background-color: #f04747 !important
            }.container-2nx-BQ:not(.checked-25WXMf) path {
                  fill: #f04747 !important
            }.container-2nx-BQ.checked-25WXMf {
                  background-color: var(--brand-experiment) !important
            }.container-2nx-BQ.checked-25WXMf path {
                  fill: var(--brand-experiment) !important
            }[class*=guilds_],
            [class^=childWrapper_],
            [class^=circleIconButton_],
            [class^=expandedFolderBackground_],
            [class^=folderIconWrapper_],
            [class^=folder_],
            [class^=scroller_],
            [class^=typeWindows_] {
                  background: 0 0 !important
            }#channels,
            #vc-spotify-player,
            .appAsidePanelWrapper__714a6,
            .app_b1f720,
            .app_de4237,
            .base__3e6af,
            .bg__12180,
            .channelRow__96673,
            .chatContainer__23434,
            .chatContent__5dca8,
            .chat__52833,
            .container__037ed,
            .container__0a6a9,
            .container__11d72,
            .container__590e2,
            .container__5c7e7,
            .container__93316,
            .container_b2ce9c,
            .container_ca50b9,
            .container_de798d,
            .content__1a4fe,
            .content__1a4fe::after,
            .guilds__2b93a,
            .header_c43d51,
            .layer_3552e0.baseLayer__8fda3,
            .layers__1c917.layers_a23c37,
            .mainTableContainer__5ffe0,
            .member_aa4760,
            .membersWrap__90226,
            .notAppAsidePanel__9d124,
            .nowPlayingColumn_f5023f,
            .pageWrapper_fef757,
            .panels__58331,
            .panels__58331 div,
            .platform-win,
            .platform-win .bg__12180 .app_de4237,
            .privateChannels__93473,
            .scroller__4b984,
            .theme-dark,
            .theme-dark .form__13a2c:after,
            .theme-dark .form__13a2c:before,
            .theme-dark .platform-win,
            .theme-dark .scroller__4b984,
            .title_b7d661,
            .userPanelInner_eddf4c,
            .userPanelOuter__880e5,
            .wrapper_a7e7a8.guilds__2b93a,
            [aria-label=Members],
            body,
            html {
                  background: var(--transfull)
            }.channel_c21703,
            .container__4f20e,
            .messageContent__21e69,
            .side_b4b3f6 .item__48dda,
            .wrapper__7bcde .link__95dc0 {
                  transition: margin-left .1s ease
            }.messageContent__21e69:hover {
                  margin-left: calc(-.8*var(--custom-message-margin-left-content-cozy))
            }.side_b4b3f6 .item__48dda:hover,
            .wrapper__7bcde:hover .link__95dc0 {
                  margin-left: 10px
            }.channel_c21703:hover,
            .container__4f20e:hover {
                  margin-left: 18px
            }.panels__58331>.wrapper__0ed4a {
                  background-color: var(--transfull);
                  margin-top: 10px;
                  border-radius: 12px
            }.theme-dark .container_ca50b9 {
                  background-color: var(--transfull);
                  border-top-right-radius: 16px;
                  border-top-left-radius: 16px
            }.theme-dark .panels__58331 {
                  background: var(--blacktrans);
                  margin-top: 10px
            }[aria-label="Microphone Settings"] {
                  padding: 0;
                  margin: 0;
                  max-height: 10px
            }.panels__58331:not(:has(.wrapper__0ed4a))>.container_ca50b9 {
                  background-color: var(--blacktrans);
                  border-radius: 12px 12px 0 0
            }[aria-label="Disconnect"] {
                  color: var(--status-danger)
            }.panels__58331 {
                  border-top-left-radius: 12px;
                  border-top-right-radius: 12px;
                  box-shadow: rgba(0, 0, 0, .4) 0 2px 4px, rgba(0, 0, 0, .3) 0 7px 13px -3px, rgba(0, 0, 0, .35) 0 -35px 36px -28px inset
            }.panels__58331 * {
                  border: 0
            }.UserPanel__container button.button__4f306,
            .UserPanel__container span.button__4f306 {
                  right: 6px;
                  padding: 0;
                  margin: 0;
                  height: 36px;
                  width: calc((224px/3) - 7px)
            }.button__4f306 svg {
                  padding: 0;
                  height: auto;
                  width: auto
            }.UserPanel__nameTag.nameTag__0e320.UserPanel__canCopy.canCopy__81263 {
                  opacity: 100%
            }.nameTag__0e320>.panelTitleContainer__7a748 {
                  display: none
            }.nameTag__0e320>.panelSubtextContainer_f28bed>div {
                  font-weight: 700;
                  font-size: 18px;
                  padding-top: 2px;
                  height: 100%;
                  margin-right: 1px
            }.nameTag__0e320 div {
                  margin-left: 1px;
                  font-size: 120%
            }.container_d667ff {
                  background: var(--transfull);
                  border-bottom-left-radius: 12px;
                  border-bottom-right-radius: 12px;
                  border-top-right-radius: 0;
                  border-top-left-radius: 0
            }.panels__58331 {
                  margin: 0 5px 5px;
                  border-radius: 12px;
                  overflow: hidden;
                  transition: .2s .4s
            }.panels__58331 .container_ca50b9 {
                  height: 88px;
                  padding: 8px;
                  background: var(--background-floating) !important;
                  margin-bottom: -52px;
                  transition: .4s;
                  display: flex;
                  flex-direction: column
            }.panels__58331:hover .container_ca50b9 {
                  margin-bottom: 0;
                  transition: .2s .4s
            }.panels__58331 .avatarWrapper_ba5175 {
                  margin-right: 0;
                  width: 100%;
                  padding: 6px;
                  box-sizing: border-box;
                  margin-bottom: 4px;
                  border-radius: 8px;
                  transition: .4s .55s;
                  order: 1
            }.panels__58331 .directionRow__2bb0b {
                  gap: 4px
            }.panels__58331 .directionRow__2bb0b>button {
                  border-radius: 8px;
                  transition: .25s;
                  padding: 0;
                  margin: 0;
                  width: 100%;
                  align-items: center
            }.panels__58331 .actionButtons_b58cbb {
                  margin-bottom: -48px;
                  opacity: 0;
                  z-index: 1;
                  transition: .4s .65s
            }.panels__58331:hover .actionButtons_b58cbb {
                  margin-bottom: 0;
                  opacity: 1;
                  transition: .2s ease-in-out .65s
            }.sidebarRegion__60457 {
                  background: var(--blacktrans)
            }.sidebarRegionScroller__1fa7e,
            .sidebarRegion__60457 {
                  border-radius: 12px;
                  justify-content: start;
                  margin-top: -40px;
                  background-color: rgba(255, 255, 255, .035);
                  border-right: #fff 1px inset;
                  max-width: 15vw;
                  min-width: 235px
            }.eyebrow_f53856 {
                  font-size: 115%;
                  color: #fff;
                  text-transform: capitalize bold;
                  margin-left: -10px
            }.side_b4b3f6 .item__48dda {
                  margin-left: 15px
            }.contentColumnDefault_c66386 {
                  padding: 35px;
                  max-width: 100%
            }.closeButton__34341 {
                  border: 0
            }.closeButton__34341 svg {
                  padding: 1px;
                  color: #fff;
                  border-radius: 5px
            }.keybind__57645 {
                  color: #fff
            }.contentRegionScroller__86c79 .tools_c0ff70 {
                  transform: scale(1.3)
            }.container_b2ce9c {
                  Background: var(--transfull);
                  margin-left: -4px;
                  width: 65px;
                  transition: 1.5s ease .075s
            }.members__9f47b.thin_b1c063.scrollerBase_dc3aa9.fade_ba0fa0.customTheme_db4d28 {
                  margin-left: 4px;
                  background: var(--blacktrans);
                  border-radius: 16px 0px 0px 16px;
                  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.45) 0px -60px 36px -28px inset
            }.container_b2ce9c:hover {
                  width: 260px
            }.member_b44d5d,
            .members__9f47b {
                  background: var(--transfull)
            }.memberInner_a32223.layout_bb8e67>.avatar__6337f {
                  transform: scale(1.2);
                  margin: 20px 20px 0 0
            }.container_de798d {
                  font-size: 16px;
                  font-weight: 700;
                  color: #fff
            }#vc-membercount,
            .content_a6999d {
                  opacity: 0;
                  transition: 1.85s ease .075s
            }.container_b2ce9c:hover #vc-membercount,
            .container_b2ce9c:hover .content_a6999d {
                  opacity: 1;
                  transition: 1.85s ease-in-out .075s
            }.channelTextArea__2e60f,
            .channelTextArea__2e60f,
            .themedBackground__6b1b6,
            .scrollableContainer__33e06 {
                  background-color: var(--blacktrans2);
                  background: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 10%) 0px 7px 13px -3px, rgb(0 0 0 / 50%) 0px -35px 36px -28px inset;
            }.scrollableContainer__33e06{border-radius:8px;}
            .form__13a2c {
                  margin-bottom: -18px;
                  margin-right: 10px;
                  margin-top: 3px;
                  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px;
            }.placeholder_e68c63,
            .textAreaSlate_e0e383 div {
                  color: white;
            }.content__1a4fe:before {box-shadow: var(--transfull);}
            .chatContent__5dca8 {
                  border-radius: 12px
            }.jumpToPresentBar__0ff7f {
                  display: none !important;
                  margin-bottom: 42vh;
                  background-color: #000;
                  border-radius: 0 0 14px 14px
            }.newMessagesBar__8b6d7 {
                  height: 6vh;
                  width: 90%;
                  margin-left: 5%;
                  margin-right: 3.5%;
                  background-color: #3194ce;
                  border: #fff 3px inset;
                  border-top: none;
                  animation: flash .8s infinite ease-in-out;
                  border-radius: 0 0 14px 14px
            }.newMessagesBar__8b6d7>.barButtonAlt__4b48f,
            div.HeaderBar__toolbar.toolbar__88c63>a {
                  display: none
            }#app-mount>div.App__appAsidePanelWrapper.appAsidePanelWrapper__714a6>div.App__notAppAsidePanel.notAppAsidePanel__9d124>div.App__app.app_b1f720>div>div.BaseLayer__layers.layers__1c917.AppLayers__layers.layers_a23c37>div>div.LeftSidebar__container.container__037ed>div>div>div.Channel__chat.chat__52833>div>div.ChatContainer__container.container__93316>div.ChatContainer__chatContainer.chatContainer__23434>main>div.Messages__messagesWrapper.messagesWrapper_ea2b0b.group-spacing-16>div.ChatBar__newMessagesBar.newMessagesBar__8b6d7.ChatBar__barBase.barBase__4e0ba>button.ChatBar__barButtonMain.barButtonMain__0f5c6.ChatBar__barButtonBase.barButtonBase__8fa46 {
                  text-align: center;
                  transform: scale(3)
            }.barBase__4e0ba,
            .newMessagesBar__8b6d7.barBase_4e0ba {
                  width: -moz-fit-content;
                  margin-left: auto
            }.sidebar_ded4b5,
            a.link__95dc0,
            div.animatedContainer__341f6 {
                  background: var(--transfull)
            }.sidebar_ded4b5 {
                  width: 210px
            }.theme-dark .container__590e2 {
                  border-radius: 16px 0 16px 16px;
                  background: var(--blacktrans) !important
            }.name__590d6.container_de798d {
                  font-size: 18px;
                  font-weight: 700;
                  color: #fff
            }.containerDefault__23a29 {
                  padding-top: 20px;
                  padding-bottom: 5px
            }.containerDefault__3187b,
            .containerDefault__3187b .link__95dc0 {
                  height: fit-content
            }.containerDefault__3187b {
                  padding-top: 0;
                  padding-bottom: 0;
                  border-radius: 7px
            }.modeUnread_f74c03 .name__8d1ec {
                  color: #fff
            }.platform-win .sidebar_ded4b5 {
                  background: var(--transfull)
            }.theme-dark .scroller__4b984 {
                  background: var(--blacktrans);
                  border-bottom-left-radius: 12px;
                  border-bottom-right-radius: 12px;
                  margin-bottom: 0
            }.mention__1afd3 {
                  border-radius: 8px;
                  box-shadow: none !important
            }.unreadMentionsIndicatorBottom_fdb943,
            .unreadMentionsIndicatorTop_ada847 {
                  border-radius: 6px;
                  box-shadow: none !important
            }.unreadMentionsIndicatorBottom_fdb943 {
                  width: 100%
            }.Scroller__scrollerBase.scrollerBase__2b744>button {
                  width: 95%
            }.GuildChannelInner__unreadImportant.unreadImportant_c775b3,
            .modeUnreadImportant_efb53e .name__8d1ec {
                  color: #fff;
                  font-style: oblique;
                  font-size: 110%;
                  text-transform: uppercase
            }.bar__004d9 {
                  background-color: var(--brand-experiment);
                  border-radius: 5px
            }.searchBar_e0c60b,
            .searchBar_e4ea2a {
                  box-shadow: rgba(0, 0, 0, .4) 0 2px 4px, rgba(0, 0, 0, .3) 0 7px 13px -3px, rgba(0, 0, 0, .45)0-20px 36px -20px inset
            }.searchBar_e0c60b {
                  background: var(--blacktrans2)
            }.searchBar_e4ea2a {
                  background: var(--blacktrans)
            }[id^=chat-messages-] {
                  background-color: var(--blacktrans);
                  margin: 0 15px;
                  border-radius: 0
            }[id=new-messages-bar]:not(:has(+[id^=chat-messages-] [id^=message-username-])) {
                  transform-style: preserve-3d
            }[id=new-messages-bar]:not(:has(+[id^=chat-messages-] [id^=message-username-]))::before {
                  content: "";
                  background-color: #070707;
                  width: calc(100% + 30px);
                  height: 9px;
                  position: absolute;
                  top: -5px;
                  left: -16px;
                  transform: translateZ(-1px)
            }[id^=chat-messages-]:has(.isSystemMessage__2ef37),
            [id^=chat-messages-]:has([id^=message-username-]) {
                  border-top-left-radius: 14px;
                  border-top-right-radius: 14px
            }[id^=chat-messages-]:is(:has(+[class*=scrollerSpacer__]), :has(+:not([id^=chat-messages-])+[id^=chat-messages-] [id^=message-username-]), :has(+[id^=chat-messages-] [id^=message-username-])) {
                  border-bottom-left-radius: 14px;
                  border-bottom-right-radius: 14px;
                  box-shadow: rgba(0, 0, 0, .4) 1px 6px 5px, rgba(0, 0, 0, .3)0 7px 13px -3px, rgba(0, 0, 0, .2)0-3px 0 inset
            }.message__80c10:not(.groupStart__56db5) .headerText_f47574 {
                  display: none
            }.groupStart__56db5 {
                  margin-top: 15px !important
            }[data-list-item-id=guildsnav___home]>div {
                  background-image: url(https://media.discordapp.net/stickers/1092742917535318016.webp?size=96) !important;
                  background-size: contain;
                  background-repeat: no-repeat
            }[data-list-item-id=guildsnav___home]>div>svg {
                  display: none !important
            }.guilds__2b93a {
                  width: var(--guild-list-width)
            }.blobContainer__5ee50,
            .listItem_fa7b36,
            .listItem_fa7b36>.wrapper__3670f+div:not([class]),
            .svg_ad7356,
            .svg_ad7356>foreignObject,
            .wrapper__3af0b,
            .wrapper_ed1dea {
                  width: var(--guild-list-width);
                  mask: none !important
            }.circleIcon__428dd,
            .listItem_fa7b36:not(:has(.guildSeparator_dcb3cc)),
            .svg_ad7356>foreignObject,
            .wrapper__3af0b {
                  height: var(--guild-list-height)
            }.expandedFolderBackground__1bec6 {
                  width: calc(var(--guild-list-width) - 24px);
                  border-radius: min(24px, var(--guild-item-radius))
            }.svg_ad7356>foreignObject {
                  transform: translateX(calc(((var(--guild-list-width)*-1)/2) + 50%))
            }.circleIconButton_d8df29,
            .folder__17546,
            .wrapper_d281dd {
                  margin-left: 12px;
                  width: calc(var(--guild-list-width) - 24px);
                  justify-content: start;
                  border-radius: var(--guild-item-radius) !important;
                  height: var(--guild-list-height)
            }.childWrapper__01b9c,
            .closedFolderIconWrapper__7321f,
            .expandedFolderIconWrapper__458cf,
            .folderIconWrapper__72239,
            .wrapper_d281dd img {
                  border-radius: var(--guild-item-radius) !important;
                  height: var(--guild-list-height);
                  width: var(--guild-list-height)
            }.ColorwaySelectorBtn,
            .wrapperSimple_a34580 {
                  border-radius: 0 !important
            }.svg_ad7356 {
                  position: static
            }[data-dnd-name]:has(.wrapper__3af0b)::after {
                  content: attr(data-dnd-name);
                  width: calc(var(--guild-list-width) - 24px - var(--guild-list-height) - 12px);
                  position: absolute;
                  top: 0;
                  left: calc(12px + var(--guild-list-height) + 6px);
                  flex-wrap: nowrap;
                  align-items: center;
                  color: var(--channels-default);
                  font-size: var(--guild-item-font-size);
                  line-height: var(--guild-list-height);
                  font-weight: 500;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  pointer-events: none;
                  transition: color .15s ease-out, background-color .15s ease-out
            }.circleIconButton_d8df29::after,
            .wrapper_d281dd[data-list-item-id*=guildsnav___]::after {
                  content: attr(aria-label);
                  width: calc(var(--guild-list-width) - 24px - var(--guild-list-height) - 12px);
                  left: calc(12px + var(--guild-list-height) + 6px);
                  transition: color .15s ease-out, background-color .15s ease-out;
                  position: absolute
            }[data-dnd-name]:has(.wrapper__3af0b .selected_f5ec8e, .wrapper__3af0b .hover__043de)::after {
                  color: var(--interactive-active)
            }:has(.wrapper__3af0b .selected_f5ec8e, .wrapper__3af0b .hover__043de) :is(.wrapper_d281dd, .folder__17546, .circleIconButton_d8df29) {
                  background-color: var(--blacktrans) !important
            }.circleIconButton_d8df29::after {
                  top: 0;
                  align-items: center;
                  color: var(--green-360);
                  font-size: var(--guild-item-font-size);
                  line-height: var(--guild-list-height);
                  font-weight: 500;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  pointer-events: none
            }.ColorwaySelectorBtn::before,
            .colorwaySelectorIcon {
                  height: var(--guild-list-height) !important;
                  width: var(--guild-list-height) !important
            }.ColorwaySelectorBtn:hover::after,
            .circleIconButton_d8df29.selected__5250e::after,
            .wrapper_d281dd[data-list-item-id*=guildsnav___].selected_f5ec8e::after {
                  color: var(--interactive-active)
            }.ColorwaySelectorBtn::after,
            .wrapper_d281dd[data-list-item-id*=guildsnav___]::after {
                  top: 0;
                  color: var(--channels-default);
                  font-size: var(--guild-item-font-size);
                  font-weight: 500;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  pointer-events: none
            }.wrapper_d281dd[data-list-item-id*=guildsnav___]::after {
                  line-height: var(--guild-list-height);
                  align-items: center
            }.colorwaySelectorIcon {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer
            }.ColorwaySelectorBtn {
                  position: relative;
                  width: calc(var(--guild-list-width) - 24px) !important;
                  background-color: transparent !important;
                  justify-content: start !important;
                  gap: 6px;
                  height: var(--guild-list-height) !important;
                  row-gap: 0 !important
            }.ColorwaySelectorBtn::before {
                  content: "";
                  position: absolute;
                  background-color: var(--background-primary);
                  border-radius: var(--guild-item-radius);
                  transition: .15s ease-out;
                  left: 0
            }.ColorwaySelectorBtn:hover::before {
                  background-color: var(--brand-experiment)
            }.ColorwaySelectorBtn::after {
                  content: "Colorways";
                  width: calc(var(--guild-list-width) - 24px - 48px - 12px);
                  left: calc(6px + 48px);
                  align-items: center;
                  transition: color .15s ease-out, background-color .15s ease-out;
                  position: static;
                  height: unset !important;
                  line-height: var(--guild-list-height);
                  transform: translateX(6px)
            }.wrapper_ed1dea>[id*=folder-items-] {
                  height: fit-content !important
            }.lowerBadge__669e7,
            .upperBadge_c7cfb3 {
                  transform: translateX(-50%) !important
            }.upperBadge_c7cfb3 {
                  border-radius: 5px;
                  z-index: 2;
                  margin-right: 14px
            }.colorwaysBtnPill,
            .pill__13f64,
            .wrapper__3670f,
            div.pill__6b31b.wrapper__3670f {
                  height: var(--guild-list-height) !important
            }.item_f9d377 {
                  max-height: var(--guild-list-height)
            }.circleIcon__428dd {
                  margin-left: 0;
                  width: var(--guild-list-height);
                  justify-content: center;
                  align-items: center;
                  box-sizing: border-box;
                  padding: calc(var(--guild-list-height)/7)
            }.blobContainer__5ee50 .wrapper_d281dd[data-list-item-id*=guildsnav___]::after {
                  content: none
            }.listItem_fa7b36 {
                  margin: 0 0 var(--guild-item-spacing)
            }.lowerBadge__669e7,
            .numberBadge__50328,
            .upperBadge_c7cfb3 {
                  box-shadow: 0 0 0 0 !important;
                  color: #fff !important
            }.iconBadge_fdf33a,
            .icon__92653,
            .lowerBadge__669e7 {
                  background-color: var(--gren);
                  border-radius: 5px;
                  padding: 3px;
                  min-width: fit-content;
                  min-height: 18px
            }.lowerBadge__669e7 {
                  background-color: var(--transfull);
                  margin-right: 4px
            }.iconBadge_fdf33a {
                  margin-right: -6px
            }.baseShapeRound__95d0f {
                  border-radius: 5px;
                  font-size: 120%;
                  min-height: 22px;
                  min-width: fit-content;
                  padding: 2px
            }.unreadMentionsIndicatorBotto_fdb943,
            .unreadMentionsIndicatorTop_ada847 {
                  align-self: center;
                  width: 100%;
                  box-shadow: var(--elevation-high)
            }.expandedFolderBackground__1bec6 {
                  background-color: rgba(0, 0, 0, .6);
                  width: 94%;
                  margin-left: -10px;
                  height: 100%
            }.folderIconWrapper__72239 {
                  width: 174px;
                  margin: 0 !important
            }.scroller__3d071 {
                  padding: 12px 12px 0 5px !important
            }.GuildListFolder__folder.folder__17546,
            .GuildListItemIcon__wrapper.wrapper_d281dd {
                  margin-left: 6px;
                  transition: .55s ease-in-out .075s
            }.GuildListFolder__folder.folder__17546 {
                  width: 48px
            }.GuildListFolder__expanded {
                  background-color: var(--blacktrans2) !important
            }.GuildListFolder__collapsed,
            .GuildListFolder__folderIconWrapper,
            .GuildListItemIcon__wrapper.wrapper_d281dd {
                  width: 174px
            }.guilds__2b93a {
                  transition: .75s ease-out .075s;
                  width: 198px
            }.lowerBadge__669e7>div {
                  margin-left: 2px;
                  opacity: 100%
            }.upperBadge_c7cfb3>div {
                  margin-left: 16px;
                  opacity: 100%
            }.flex_f5fbb7.horizontal__992f6.justifyStart__42744.alignStretch_e239ef.noWrap__5c413 {
                  margin-left: 12px
            }
        ` : ""}
        /* ROOTS */

        /* IMPORTS */

        /* Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');
        ${Settings.plugins.Glide.customFont}

    /*Settings things*/
        /*Server list animation*/
        ${Settings.plugins.Glide.serverListAnim ? `
        .guilds__2b93a {
            width: 10px;
            transition: width var(--animspeed) ease 0.1s, opacity var(--animspeed) ease 0.1s;
            opacity: 0;
        }
        .guilds__2b93a:hover {
            width: 65px;
            opacity: 100;
        }
        ` : ""}
        /*Member list anim toggle*/
        ${Settings.plugins.Glide.memberListAnim ? `
            .container_b2ce9c
            {
                width: 60px;
                opacity: 0.2;
                transition: width var(--animspeed) ease 0.1s, opacity var(--animspeed) ease 0.1s;

            }
            .container_b2ce9c:hover
            {
                width: 250px;
                opacity: 1;
            }
        ` : ""}
        /*Privacy blur*/
        ${Settings.plugins.Glide.privacyBlur ? `
                .header__39b23,
                .container__590e2,
                .title_b7d661,
                .layout__59abc,
                [aria-label="Members"] {
                filter: blur(0);
                transition: filter 0.2s ease-in-out;
                }

                body:not(:hover) .header__39b23,
                body:not(:hover) .container__590e2,
                body:not(:hover) .title_b7d661,
                body:not(:hover) [aria-label="Members"],
                body:not(:hover) .layout__59abc {
                filter: blur(5px);
                }
        ` : ""}
        /*Tooltips*/
        ${!Settings.plugins.Glide.tooltips ? `
            [class*="tooltip"]
            {
                display: none !important;
            }
        ` : ""}
        /*Root configs*/
        :root
        {
            --animspeed: ${Settings.plugins.Glide.animationSpeed + "s"};
            --font-primary: ${(fontName.length > 0 ? fontName : "Nunito")};
            --accent: #${Settings.plugins.Glide.Accent};
            --bgcol: #${Settings.plugins.Glide.Primary};
            --text: #${Settings.plugins.Glide.Text};
            --brand: #${Settings.plugins.Glide.Brand};
            --mutedtext: ${mute(Settings.plugins.Glide.Text, 30)};
        }
:root
{

    /*VARIABLES*/

        /*editable variables. Feel free to mess around with these to your hearts content, i recommend not editing the logic variables unless you have an understanding of css*/
        --glowcol: rgba(0, 0, 0, 0);
        --mentioncol: rgb(0, 0, 0);
        --mentionhighlightcol: rgb(0, 0, 0);
        --linkcol: rgb(95, 231, 255);
        --highlightcol: rgb(95, 231, 255);



    /*COLOR ASSIGNING  (most of these probably effect more than whats commented)*/

        /*accent based*/

            /*buttons*/
            --button-secondary-background: var(--accent);

            /*also buttons*/
            --brand-experiment: var(--brand);
            --brand-experiment-560: var(--brand);

            /*message bar*/
            --channeltextarea-background: var(--accent);

            /*selected dm background*/
            --background-modifier-selected: var(--accent);

            /*emoji autofill*/
            --primary-630: var(--accent);

            /*plugin grid square and nitro shop*/
            --background-secondary-alt: var(--accent);

            /*modal background, self explanatory*/
            --modal-background: var(--accent);

            /*color of the background of mention text*/
            --mention-background: var(--accent);
            --input-background: var(--accent);

            /*the side profile thingy*/
            --profile-body-background-color: var(--accent);


        /*background based*/

            /*primary color, self explanatory*/
            --background-primary: var(--bgcol);

            /*dm list*/
            --background-secondary: var(--bgcol);

            /*outer frame and search background*/
            --background-tertiary: var(--bgcol);


            /*friends header bar*/
            --bg-overlay-2: var(--bgcol);

            /*user panel*/
            --bg-overlay-1: var(--bgcol);

            /*call thingy*/
            --bg-overlay-app-frame: var(--bgcol);

            /*shop*/
            --background-floating: var(--bgcol);
            --background-mentioned-hover: var(--bgcol) !important;
            --background-mentioned: var(--bgcol) !important;




        /*other*/

            /*mention side line color color*/
            --info-warning-foreground: var(--mentionhighlightcol);

            /*text color of mention text*/
            --mention-foreground: white;

            /*Link color*/
            --text-link: var(--linkcol);
            --header-primary: var(--text);
            --header-secondary: var(--text);
            --font-display: var(--text);
            --text-normal: var(--text);
            --text-muted: var(--mutedtext);
            --channels-default: var(--mutedtext);
            --interactive-normal: var(--text) !important;
            --white-500: var(--text);
}


        /*EXTRA COLORS*/

                /*sorry, forgot to document what these are when i was adding them*/
                .inspector__993e1, .scroller_e89578, .unicodeShortcut__1dd6b
                {
                    background-color: var(--bgcol);
                }
                .inner__178b2
                {
                    background-color: var(--accent);
                }
                /*recolor embeds*/
                [class^="embedWrap"]
                {
                    border-color: var(--accent) !important;
                    background: var(--accent);
                }
                /*emoji menu recolor*/
                .contentWrapper__321ed, .header_c3c744
                {
                background-color: var(--bgcol);
                }
                /*vc background recolor*/
                .root__3eef0
                {
                    background-color: var(--bgcol);
                }


                /*Fix the forum page*/
                /*Set the bg color*/
                .container_b181b6
                {
                    background-color: var(--bgcol);
                }
                /*Recolor the posts to the accent*/
                .container__99b06
                {
                    background-color: var(--accent);
                }

                /*Recolor the background of stickers in the sticker picker that dont take up the full 1:1 ratio*/
                [id^="sticker-picker-grid"]
                {
                    background-color: var(--bgcol);
                }
                /* profile sidebar*/
                [class="none__51a8f scrollerBase_dc3aa9"]
                {
                    background-color: var(--bgcol) !important;
                }
                /*Recolor the emoji, gif, and sticker picker selected button*/
                .navButtonActive__735cb, .stickerCategoryGenericSelected__44ec4, .categoryItemDefaultCategorySelected__8245a
                {
                    background-color: var(--accent) !important;
                }
        /*ROUNDING (rounding)*/

                /*round message bar, some buttons, dm list button, new messages notif bar, channel buttons, emoji menu search bar, context menus, account connections(in that order)*/
                .button_afdfd9, .interactive__776ee, .newMessagesBar__8b6d7, .link__95dc0, .searchBar__8f956, .menu_dc52c6, .connectedAccountContainer__23f00
                {
                    border-radius: 25px;
                }
                /*round emojis seperately (and spotify activity icons)*/
                [data-type="emoji"], [class*="Spotify"]
                {
                    border-radius: 5px;
                }
                /*round gifs and stickers (and maybe images idk lmao), and embeds*/
                [class^="imageWr"], [data-type="sticker"], [class^="embed"]
                {
                    border-radius: 20px;
                }

                .item__183e8
                {
                  border-radius: 15px;
                }



                /*slightly move messages right when hovered*/
                .cozyMessage__64ce7
                {
                    left: 0px;

                    transition-duration: 0.2s;
                }
                .cozyMessage__64ce7:hover
                {
                    left: 3px;
                }



        /*CONTENT (Typically changing values or hiding elements)*/

                /*Hide most of the ugly useless scrollbars*/
                ::-webkit-scrollbar
                {
                    display:none;
                }


                /*Hide user profile button, the dm favourite, dm close, support, gift buttons, the now playing column, and the channel + favourite icons*/
                [aria-label="Hide User Profile"], .favoriteIcon_b001ac, .closeButton__8f1fd, [href="https://support.discord.com"], .nowPlayingColumn-1eCBCN, button[aria-label="Send a gift"], .icon_eff5d4, .iconContainer__3f9b0
                {
                    display :none;
                }

                /*yeet the shitty nitro and family link tabs that no one likes*/
                .channel_c21703[aria-posinset="2"],
                .familyCenterLinkButton__893e2
                {
                    display: none;

                }
                /*Remove the buttons at the bottom of the user pop out (seriously, who wanted this?)*/
                .addFriendSection__413d3
                {
                    display: none;
                }

                /*No more useless spotify activity header*/
                .headerContainer__2ec4e
                {
                    display: none;
                }
                /*hide sidebar connections*/
                .profilePanelConnections__3c232
                {
                  display: none;
                }
                /*pad the message bar right slightly. Not sure what caused the buttons to flow out of it, might be something in the theme :shrug:*/
                .inner__9fd0b
                {
                    padding-right: 10px;
                }

                /*Yeet hypesquad badges (who cares)*/
                [aria-label*="HypeSquad"]
                {
                    display: none !important;
                }

                /*Hide icon on file uploading status*/
                .icon__30aa7
                {
                    display: none;
                }

                /*hide the play button while a soundmoji is playing*/
                .playing_c91456 [viewBox="0 0 24 24"]
                {
                    display:none;
                }
                /*hide the public servers button on member list*/
                [aria-label="Explore Discoverable Servers"]
                {
                    display: none;
                }
                /*fix context menu being not symmetrical*/
                .scroller__750f5
                {
                    padding: 6px 8px !important;
                }
                /*Hide the icon that displays what platform the user is listening with on spotify status*/
                .platformIcon__05c5e
                {
                    display: none !important;
                }
                /*hide the album name on spotify statuses (who cares)*/
                [class="state_a85ac0 ellipsis__427eb textRow__4750e"]
                {
                    display: none;
                }
                /*space the connections a bit better*/
                .userInfoSection__1daf8
                {
                    margin-bottom: 0px;
                    padding-bottom: 0px;
                }
                /*Space channels*/
                .containerDefault__3187b
                {
                padding-top: 5px;
                }

                /*round banners in profile popout*/
                .banner__6d414:not(.panelBanner__90b8a)
                {
                  border-radius: 20px;
                }
                /*round the user popout*/
                .userPopoutOuter_d739b2
                {
                  border-radius: 25px;
                }
                /*round the inner profile popout*/
                [class="userPopoutInner_f545a3 userProfileInner__8065b userProfileInnerThemedWithBanner_d5f991"]::before
                {
                border-radius: 20px;
                }

        /*STYLING (Modification of content to fit the theme)*/

                /*Round and scale down the users banner*/
                .panelBanner__90b8a
                {
                border-radius: 20px;
                transform: scale(0.95);
                }
                /*add a soft glow to message bar contents, user panel, dms, channel names (in that order)*/
                .inner__9fd0b .layout__59abc, .name__8d1ec
                {
                filter: drop-shadow(0px 0px 3px var(--glowcol));
                }
                [type="button"]
                {
                        transition: all 0.1s ease-in-out;
                }
                [type="button"]:hover
                {
                        filter: drop-shadow(0px 0px 3px var(--glowcol));
                }

                /*Change the font*/
                :root
                {
                    --font-code: "Fira Code";
                }

                /*Round all status symbols. basically does what that one plugin does but easier (disabled because of a bug)
                .pointerEvents__33f6a
                {
                    mask: url(#svg-mask-status-online);
                }
                */


                /*change highlighted text color*/
                ::selection
                {
                    color: inherit;
                    background-color: transparent;
                    text-shadow: 0px 0px 3px var(--highlightcol);
                }
                /*hide the line between connections and note*/
                [class="connectedAccounts_dc0a56 userInfoSection__1daf8"]
                {
                    border-top: transparent !important;
                }
`;
}
export default definePlugin({
    name: "Glide",
    description: "A sleek, rounded theme for discord.",
    authors:
        [
            Devs.lucky
        ],
    settings,
    start() {
        injectCSS();
    },
    stop() {
        const injectedStyle = document.getElementById("GlideStyleInjection");
        if (injectedStyle) {
            injectedStyle.remove();
        }
    },
    startAt: StartAt.DOMContentLoaded

});


