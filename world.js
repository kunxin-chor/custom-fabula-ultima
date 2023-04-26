// Foundry VTT world script
Hooks.on('ready', () => {
    console.log("Fabula Ultima World Script Ready");
});

Hooks.on('renderActorSheet', (app, html, data) => {
    const sheetBody = html[0];
    // select the last div with .custom-system-sheet-actions
    console.log(data)

    const templateSelect = document.querySelector(`[name="system.template"]`);
    if (!templateSelect) {
        return;
    }
    const templateName = templateSelect.options[templateSelect.selectedIndex].innerHTML;
    console.log("template name=", templateName);

    const header = sheetBody.querySelector(".custom-system-customHeader");
    console.log("header =", header);
    if (header && data.document.type == "character" && templateName == "fb_npc") {
        console.log("executing");
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<button>Import NPC</button>`;
        newDiv.classList.add("custom-sheet-action");
        newDiv.querySelector("button").addEventListener("click", () => {
            // Display a dialog to allow the user to copy and paste in the item import
            new Dialog({
                title: "Import NPC",
                content: `
                    <h1>Import NPC</h1>
                    <div class="alert alert-info">
                        Importing an NPC will overwrite all existing information for this item!
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
                            updateNPCFromJSON(data.data._id, importItem);
                        }
                    }
                }
            }).render(true);
        }
        );

        // Insert the new div after the last div with the same class
        header.appendChild(newDiv);
    }
})




Hooks.on('renderItemSheet', (app, html, data) => {
    const sheetBody = html[0];
    // select the last div with .custom-system-sheet-actions
    const header = sheetBody.querySelector(".custom-system-customHeader");

    if (header && data.document.type == "equippableItem") {
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
    }
    else {
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

const updateAccessoryFromJson = async (itemId, reactState) => {
    const foundryFormattedData = parseJsonToFoundryFormatAccessory(reactState);
    const item = game.items.get(itemId);
    if (item) {
        await item.update(foundryFormattedData);
        ui.notifications.info('Accessory updated successfully');
    } else {
        ui.notifications.error('Accessory not found');
    }
}

const updateNPCFromJSON = async (actorId, reactState) => {
    const foundryFormattedData = parseNPCJsonToFoundryFormat(reactState);
    console.log("data =", foundryFormattedData);
    const actor = game.actors.get(actorId);
    if (actor) {
        await actor.update(foundryFormattedData);
        ui.notifications.info('NPC updated successfully');
    } else {
        ui.notifications.error('NPC not found');
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
/*
Convert from: {"name":"","traits":[],"level":5,"species":"","elementalAffinities":{"dark":"vulnerable","bolt":"resistant","fire":"absorb","ice":"immune"},"attributes":{"DEX":6,"INS":6,"MIG":6,"WLP":6},"attacks":[],"skills":[],"vulnerabilities":[],"extraSkills":0,"initiative":0,"maxHP":0,"crisisScore":0,"maxMP":0,"improvedDefense":{"defenseBonus":0,"magicDefenseBonus":0,"skillPointCost":0},"accuracyBonus":0,"magicBonus":0,"damageBonus":0,"baseSkillPoints":0,"freeResistances":0,"freeImmunities":0,"skillOptions":{"specialized":{"accuracy":false,"magic":false,"opposed-checks":false},"improved_defenses":[{"defense":0,"magic-defense":0},{"defense":0,"magic-defense":0}],"improved_hit_points":0,"improved_initative":0,"use_equipment":false},"weaponAttacks":[],"baseAttacks":[],"spells":[{"name":"Heal","targets":3,"stat1":"INS","stat2":"INS","mpCost":10,"effect":"Restores 25 HP to each target","offensive":false,"damage":15,"element":"ice"}],"customRules":[],"selected_armor":{"armor":{},"customQuality":"","skillCost":0},"selected_shield":{"shield":{},"customQuality":"","skillCost":0}}
to: {"HP":"2","maxHP":"0","MP":"0","maxMP":"0","init":"0","magicDefenseModifier":"1","defenseModifier":"3","physicalAffinity":"-","airAffinity":"-","boltAffinity":"-","darkAffinity":"-","earthAffinity":"-","fireAffinity":"-","coldAffinity":"-","lightAffinity":"-","poisonAffinity":"-","psychicAffinity":"-","enraged":false,"dazed":false,"poisoned":false,"shaken":false,"slow":false,"weak":false,"blinded":false,"ensnared":false,"frightened":false,"sealed":false,"stunned":false,"migBoost":"0","dexBoost":"0","insBoost":"0","wlpBoost":"0","baseDex":"10","baseIns":"10","baseMig":"10","baseWlp":"10","martialArmor":true,"basicAttacks":{"0":{"deleted":false,"attackName":"Claws","attackStat1":"DEX","attackStat2":"DEX","attackDamage":"","attackElement":"physical","roll":null,"isRanged":false,"accuracyModifier":"0","damageBonus":"0","weaponStat1":"DEX","weaponStat2":"DEX","damageType":"physical"},"1":{"deleted":false,"attackName":"Lance","isRanged":false,"weaponStat1":"DEX","weaponStat2":"DEX","accuracyModifier":"0","damageType":"physical","damageBonus":"0","roll":null}},"spells":{"0":{"deleted":false,"spellName":"Fireball","isOffensive":false,"stat1":"INS","stat2":"WLP","mp":"0","targets":"3","effect":"damage","potency":"12","element":"n/a","checkModifier":"0"}},"currentDex":"10","currentIns":"10\n","currentMig":"10\n","currentWlp":"10\n","bonusDefenseModifier":"0","bonusMagicDefenseModifier":"0","accuracyModifier":"0","offensiveMagicCheckBonus":"0","magicCheck":"0","currentDefense":"3","currentMagicDefense":"11"}
*/
const parseNPCJsonToFoundryFormat = (reactJson) => {
    reactJson = JSON.parse(reactJson);
    const maxHP = (reactJson.attributes.MIG * 5 + parseInt(reactJson.level)) * 2 + reactJson.skillOptions.improved_hit_points * reactJson.rank;
    const maxMP = (reactJson.attributes.WLP * 5 + parseInt(reactJson.level)) * (parseInt(reactJson.rank) > 2 ? 2 : 1);
    /*
    const converted = {
        name: reactJson.name,
        "system.props.level": reactJson.level,
        "system.props.species": reactJson.species,
        "system.props.HP": maxHP,
        "system.props.maxHP": maxHP,
        "system.props.MP": maxMP,
        "system.props.maxMP": maxMP,
        "system.props.baseDex": reactJson.attributes.DEX,
        "system.props.baseIns": reactJson.attributes.INS,
        "system.props.baseMig": reactJson.attributes.MIG,
        "system.props.baseWlp": reactJson.attributes.WLP,
        "system.props.martialArmor": reactJson.selected_armor?.armor?.martial || false,
        "system.props.init": reactJson.initiative + reactJson.skillOptions.improved_initative,
        "system.props.defenseModifier": reactJson.skillOptions.improved_defenses.reduce((acc, defense) => {
            return acc + defense.defense;
        }, 0) + parseInt(reactJson.selected_shield?.shield.defense) + (reactJson.selected_armor?.armor?.martial ? 0 : parseInt(reactJson.selected_armor?.armor?.defense)),
        "system.props.martialArmorDefense": reactJson.selected_armor?.armor?.martial ? parseInt(reactJson.selected_armor?.armor?.defense.match(/\d+/)?.[0]) : 0,
        "system.props.magicDefenseModifier": reactJson.skillOptions.improved_defenses.reduce((acc, defense) => {
            return acc + defense["magic-defense"];
        }, 0) + parseInt(reactJson.selected_shield?.shield?.magicDefense) + parseInt(reactJson.selected_armor?.armor?.magicDefense.match(/\d+/)?.[0] ?? 0)

    }
    */

    const selectedArmorDefense = reactJson.selected_armor?.armor?.defense;
    const selectedArmorMagicDefense = reactJson.selected_armor?.armor?.magicDefense?.match(/\d+/)?.[0] ?? 0;
    const selectedShieldDefense = reactJson.selected_shield?.shield.defense;
    const selectedShieldMagicDefense = reactJson.selected_shield?.shield?.magicDefense;

    const defenseModifier = reactJson.skillOptions.improved_defenses.reduce((acc, defense) => {
        return acc + defense.defense;
    }, 0);

    const magicDefenseModifier = reactJson.skillOptions.improved_defenses.reduce((acc, defense) => {
        return acc + defense["magic-defense"];
    }, 0);

    const converted = {
        name: reactJson.name,
        "system.props.rank": reactJson.rank,
        "system.props.level": reactJson.level,
        "system.props.species": reactJson.species,
        "system.props.HP": maxHP,
        "system.props.maxHP": maxHP,
        "system.props.MP": maxMP,
        "system.props.maxMP": maxMP,
        "system.props.baseDex": reactJson.attributes.DEX,
        "system.props.baseIns": reactJson.attributes.INS,
        "system.props.baseMig": reactJson.attributes.MIG,
        "system.props.baseWlp": reactJson.attributes.WLP,
        "system.props.martialArmor": reactJson.selected_armor?.armor?.martial || false,
        "system.props.init": reactJson.initiative + reactJson.skillOptions.improved_initative + (reactJson.rank - 1),
        "system.props.defenseModifier": defenseModifier + (parseInt(selectedShieldDefense) || 0) + (reactJson.selected_armor?.armor?.martial ? 0 : parseInt(selectedArmorDefense) || 0),
        "system.props.martialArmorDefense": reactJson.selected_armor?.armor?.martial ? parseInt(selectedArmorDefense?.match(/\d+/)?.[0]) : 0,
        "system.props.magicDefenseModifier": magicDefenseModifier + (parseInt(selectedShieldMagicDefense) || 0) + (parseInt(selectedArmorMagicDefense) || 0),
    };


    const accuracyModifier = Math.floor(reactJson.level / 10) + (reactJson.skillOptions.specialized.accuracy ? 3 : 0);
    console.log("accuracyModifier =", accuracyModifier);
    const offensiveMagicCheckBonus = Math.floor(reactJson.level / 10) + (reactJson.skillOptions.specialized.magic ? 3 : 0);
    const opposedChecks = reactJson.skillOptions.specialized["opposed-checks"] ? 3 : 0;

    const basicAttacks = reactJson.baseAttacks.reduce((acc, attack, index) => {
        acc[index] = {
            attackName: attack.name || "",
            damageBonus: 5 + Math.floor(reactJson.level / 20) * 5 + (attack.extraDamage ? 5 : 0),
            isRanged: attack.type === "ranged",
            accuracyModifier: accuracyModifier,
            weaponStat1: attack.stat1 || "DEX",
            weaponStat2: attack.stat2 || "DEX",
            damageType: attack.element || "physical",
            roll: '',


        };
        return acc;
    }, {});

    // calculate index offset, which is the largest index in basicAttacks
    const offset = Object.keys(basicAttacks).reduce((acc, key) => {
        return Math.max(acc, parseInt(key));
    }, 0) + 1;

    /*
     Convert: "weaponAttacks": [
        {
            "name": "Blacksteel Pistol",
            "weapon": {
                "name": "Pistol",
                "martial": "Yes",
                "category": "Firearm",
                "reach": "Ranged",
                "hands": "One-Handed",
                "accuracy": "DEX + INS",
                "element": "Physical",
                "damage": "【HR + 8】",
                "qualities": "No Quality",
                "cost": 250
            },
            "extraDamage": false,
            "specialEffect": {
                "description": "",
                "cost": 0
            }
        }
    ]
    */
    const weaponAttacks = reactJson.weaponAttacks.reduce((acc, weapon, index) => {
        acc[index + offset] = {
            attackName: weapon.name || "",
            damageBonus: weapon.weapon.damage.match(/\d+/)?.[0] || 0 + (weapon.extraDamage ? 5 : 0) + Math.floor(reactJson.level / 20) * 5,
            isRanged: weapon.weapon.reach === "Ranged",
            // if accuracy check is in the form of "STAT + STAT + X", account for the +X
            accuracyModifier: accuracyModifier + (weapon.weapon.accuracy.split(" + ").length > 2 ? parseInt(weapon.weapon.accuracy.split(" + ")[2]) : 0),
            weaponStat1: weapon.weapon.accuracy.split(" + ")[0],
            weaponStat2: weapon.weapon.accuracy.split(" + ")[1],
            damageType: weapon.weapon.element.toLowerCase() || "physical",
            roll: '',
            effect: weapon.specialEffect.description

        };
        return acc;
    }, {});


    converted["system.props.basicAttacks"] = { ...basicAttacks, ...weaponAttacks };


    const spells = reactJson.spells.reduce((acc, spell, index) => {
        acc[index] = {
            spellName: spell.name || "",
            isOffensive: spell.offensive,
            stat1: spell.stat1,
            stat2: spell.stat2,
            mp: spell.mpCost,
            targets: spell.targets || 0,
            effect: spell.type,
            description: spell.effect,
            potency: spell.damage,
            element: spell.element,
            checkModifier: offensiveMagicCheckBonus,
        };
        return acc;
    }, {});
    converted["system.props.spells"] = spells;



    const affinityShortcodes = {
        "resistant": "RES",
        "immune": "IM",
        "vulnerable": "VU",
        "absorb": "AB",
        "normal": "-"
    };

    const convertedAffinities = {
        "system.props.physicalAffinity": "-",
        "system.props.airAffinity": "-",
        "system.props.boltAffinity": "-",
        "system.props.darkAffinity": "-",
        "system.props.earthAffinity": "-",
        "system.props.fireAffinity": "-",
        "system.props.iceAffinity": "-",
        "system.props.lightAffinity": "-",
        "system.props.poisonAffinity": "-",
        "system.props.psychicAffinity": "-",
        "system.props.enragedAffinity": "-",
        "system.props.weakAffinity": "-",
        "system.props.poisonedAffinity": "-",
        "system.props.shakenAffinity": "-",
        "system.props.dazedAffinity": "-",
        "system.props.slowAffinity": "-",
    };

    for (const key in reactJson.elementalAffinities) {
        const convertedKey = key + "Affinity";    
        if (convertedAffinities.hasOwnProperty("system.props." + convertedKey)) {
            convertedAffinities["system.props." + convertedKey] = affinityShortcodes[reactJson.elementalAffinities[key]];
        }
    }
    // merge in the affinities
    const finalNPC = {
        ...converted,
        ...convertedAffinities
    };

    return finalNPC;
}