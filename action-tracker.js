export const runActionTracker = function () {

    Hooks.on("updateCombat", (combat, changed, options, userId) => {
        // Iterate over each combatant in the combat
        for (const combatant of combat.turns) {
            if (combatant.actor) {
                console.log(combatant);
                const actor = combatant.actor;
                console.log(actor);
                // Get the token for the combatant
                let token = null;
                // if (actor.token) {
                //     token = actor.token._object;
                // } else if (actor.prototypeToken) {
                //     // find the actual token by its id
                //     token = canvas.tokens.placeables.find(t => t.id === actor.prototypeToken._id);
                // }

                token = combatant.token.object;

                // const token = actor.token?._object ?? actor.prototypeToken._source;
                console.log(token);
                // Get the number of activations for the combatant
                let activations = combatant.flags["lancer-initiative"]["activations"].value || 0;

                // Draw the number of activations on the combatant's token
                if (token) {
                    const size = 24; // Set the font size
                    const color = "#ffffff"; // Set the font color
                    const text = new PIXI.Text(activations, { fontSize: size, fill: color }); // Create the text object
                    // set an id for the text
                    text.name = "activations";
                    text.anchor.set(1, 0.5); // Set the anchor point to the right center
                    text.position.set(token.w + 5, 0); // Set the position to the right side of the token

                    // Remove any existing text objects from the token
                    if (token.children) {
                        token.children.forEach(child => {
                            if (child.name === "activations") {
                                child.destroy();
                            }
                        });
                    }
                   

                    token.addChild(text); // Add the text object as a child of the token
                }
            }
        }
    });
}

