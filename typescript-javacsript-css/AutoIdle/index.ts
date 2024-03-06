import definePlugin from "@utils/types";
import { Devs } from "@utils/constants";


export default definePlugin({
    name: "AutoIdleOnAFK",
    description: "changes your status to 'idle' wen you are tabbed out of discord for 5 minutes (originally created by RoguedBear but ported to Vencord)",
    authors: [ Devs.lucky
    ],
    patches: [],
    // Delete these two below if you are only using code patches
    start() {},
    stop() {},
});