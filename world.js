// Foundry VTT world script
Hooks.on('ready', () => {
    console.log("Fabula Ultima World Script Ready");
});

Hooks.on('renderItemSheet', (app, html, data) => {
    const sheetBody = html[0];
    // select the last div with .custom-system-sheet-actions
    const header = sheetBody.querySelector(".custom-system-customHeader");
    //console.log(data);

    if (header && data.document.type != "_equippableItemTemplate") {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<button>Import Item</button>`;
        newDiv.classList.add("custom-sheet-action");
        newDiv.querySelector("button").addEventListener("click", () => {
            // Display a dialog to allow the user to copy and paste in the item import
            new Dialog({
                title: "Import Item",
                content: `
                    <h1>Import Item</h1>
                    <div class="alert alert-info">
                        Importing an item will overwrite all existing information for this item!
                    </div>
                    <p>Copy and paste the item JSON below</p>
                    <textarea id="importItem" style="width: 100%; height: 100px;"></textarea>                    
                `,
                buttons: {
                    'import': {
                        'label': 'Import',
                        'callback': function () {
                            const importItem = document.querySelector("#importItem").value;
                            // get name of the option from the system.template <select>
                            const templateSelect = document.querySelector(`[name="system.template"]`);
                            const templateName = templateSelect.options[templateSelect.selectedIndex].innerHTML;
                            if (templateName == 'fb_weapon') {
                                updateWeaponFromJson(data.data._id, importItem);
                            } else if (templateName === 'fb_armor' || templateName === 'fb_shield') {
                                updateArmorShieldFromJson(data.data._id, importItem);
                            } else if (templateName === 'fb_accessory') {
                                updateAccessoryFromJson(data.data._id, importItem);
                            }
                        }
                    }
                }
            }).render(true);
        })

        // Insert the new div after the last div with the same class
        header.appendChild(newDiv);
    } else {
        console.log("Custom header not found");
    }
});

// LIBRARY FUNCTIONS
const parseJsonToFoundryFormat = (reactJson) => {
    const input = JSON.parse(reactJson);
    return {
        "name": input.itemName,
        "system.props.weaponStat1": input.accuracyCheck.stat1,
        "system.props.weaponStat2": input.accuracyCheck.stat2,
        "system.props.accuracyModifier": input.accuracyModifier,
        "system.props.damageBonus": parseInt(input.damage.match(/\d+/)[0], 10),
        "system.props.hands": input.hands,
        "system.props.isRanged": input.reach === "ranged" ? true : false,
        "system.props.damageType": input.damageType,
        "system.props.weaponQuality": `<ul>${input.qualities.map(q => `<li>${q.name}:${q.effect}</li>`)}</ul>`,
        "system.props.totalCost": input.totalCost,

    };
};

const updateWeaponFromJson = async (itemId, reactState) => {
    const foundryFormattedData = parseJsonToFoundryFormat(reactState);
    console.log(foundryFormattedData);
    const item = game.items.get(itemId);
    if (item) {
        await item.update(foundryFormattedData);
        ui.notifications.info('Item updated successfully');
    } else {
        ui.notifications.error('Item not found');
    }
};

const updateArmorShieldFromJson = async (itemId, reactState) => {
    const foundryFormattedData = parseJsonToFoundryFormatArmorShield(reactState);    
    const item = game.items.get(itemId);
    if (item) {
        await item.update(foundryFormattedData);
        ui.notifications.info('Armor/Shield updated successfully');
    } else {
        ui.notifications.error('Armor/Shield not found');
    }
};

const updateAccessoryFromJson = async(itemId, reactState) => {
    const foundryFormattedData = parseJsonToFoundryFormatAccessory(reactState);    
    const item = game.items.get(itemId);
    if (item) {
        await item.update(foundryFormattedData);
        ui.notifications.info('Accessory updated successfully');
    } else {
        ui.notifications.error('Accessory not found');
    }
}

const parseJsonToFoundryFormatArmorShield = (reactJson) => {
    const input = JSON.parse(reactJson);
    const qualities = input.qualities.map(quality => `<li>${quality.name}: ${quality.effect}</li>`).join('');

    return {
        "name": input.name,
        "system.props.armorDefense": parseInt(input.defense, 10),
        "system.props.armorMagicDefense": parseInt(input.magicDefense.match(/\d+/)[0], 10),
        "system.props.armorInit": parseInt(input.initiative.match(/\d+/)[0], 10),
        "system.props.martial": input.martial,
        "system.props.armorQuality": `<ul>${qualities}</ul>`,
    };
};

const parseJsonToFoundryFormatAccessory = (json) => {
    const input = JSON.parse(json);
    const qualities = input.qualities.map(quality => `<li>${quality.name}: ${quality.effect}</li>`).join('');
    return {
        "name": input.name,
        "system.props.qualities": qualities,
        "system.props.cost": input.cost
    }
}