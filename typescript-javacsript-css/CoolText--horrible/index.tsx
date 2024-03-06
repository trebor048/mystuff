/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import { ApplicationCommandOptionType } from "../../api/Commands";
import { CoolTextMap } from "./CoolTextMap";

interface CoolText {
    label: string;
    name: string;
    value: string;
}

export const uniqueCoolTexts: CoolText[] = CoolTextMap.map(coolText => ({
    label: coolText.displayname,
    name: coolText.fontId,
    value: coolText.url,
}));

async function createCoolTextImage(fontId: string, text: string, color: string): Promise<string> {
    const postChangeUrl = "https://cooltext.com/PostChange";
    const postChangeHeaders = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    };

    const postChangeBody = `LogoID=${fontId}&Text=${text}&FontSize=70&Color1_color=${color}&Color2_color=0088FF&Color3_color=000000&Integer1=5&Integer5=2&Integer7=1&Integer8=1&Integer14_color=000000&Integer6=75&Integer9=0&Integer13=on&Integer12=on&FileFormat=6&BackgroundColor_color=FFFFFF`;

    try {
        const postChangeResponse = await fetch(postChangeUrl, {
            method: "POST",
            headers: postChangeHeaders,
            body: postChangeBody
        });

        if (!postChangeResponse.ok) {
            throw new Error(`HTTP error! status: ${postChangeResponse.status}`);
        }

        const postData = await postChangeResponse.json();
        if (!postData.renderLocation) {
            throw new Error("Missing renderLocation in response");
        }

        return postData.renderLocation;
    } catch (error) {
        console.error("Failed to create image with CoolText:", error);
        return "";
    }
}

export default definePlugin({
    name: "CoolText",
    authors: [Devs.lucky], // Ensure Devs.lucky is a string or an array of strings
    description: "Add a command to send images created with CoolText",
    dependencies: ["CommandsAPI"],
    commands: [{
        name: "cooltext",
        description: "Send images created with CoolText",
        options: [
            {
                name: "font",
                description: "Font to use for the image",
                type: ApplicationCommandOptionType.STRING,
                required: true,
                choices: uniqueCoolTexts,
            },
            {
                name: "text",
                description: "Text to render",
                type: ApplicationCommandOptionType.STRING,
                required: true,
            },
            {
                name: "color",
                description: "Color of the text (default white)",
                type: ApplicationCommandOptionType.STRING,
                required: false,
            },
        ],
        async execute(args) {
            try {
                const fontId = args.find(arg => arg.name === "font")?.value || "";
                const text = encodeURIComponent(args.find(arg => arg.name === "text")?.value || "");
                const color = args.find(arg => arg.name === "color")?.value || "#FFFFFF"; // Default color constant
                const imageUrl = await createCoolTextImage(fontId, text, color);
                return { content: imageUrl || "Failed to generate or send the CoolText image." };
            } catch (error) {
                console.error("Error creating CoolText image:", error);
                return { content: "Failed to generate or send the CoolText image." };
            }
        }
    }]
});
