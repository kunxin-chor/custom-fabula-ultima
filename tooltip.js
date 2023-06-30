/*
NPC Object Structure:
{"level":"20","species":"monster","ultimaPoints":"0","rank":"2","traits":"Large, Tunnelling, Hungry","baseDex":"10","dexBoost":"0","baseIns":"6","insBoost":"0","baseMig":"12","migBoost":"0","baseWlp":"6","wlpBoost":"0","HP":"0","maxHP":"220","MP":"40","maxMP":"50","init":"9","martialArmor":true,"defenseModifier":"0","magicDefenseModifier":"4","physicalAffinity":"RES","airAffinity":"-","boltAffinity":"-","darkAffinity":"RES","earthAffinity":"-","fireAffinity":"-","iceAffinity":"-","lightAffinity":"VU","poisonAffinity":"RES","psychicAffinity":"-","enraged":false,"enragedAffinity":"-","dazed":true,"dazedAffinity":"-","poisoned":false,"poisonedAffinity":"IM","shaken":true,"shakenAffinity":"-","slow":true,"slowAffinity":"-","weak":true,"weakAffinity":"-","blinded":false,"ensnared":false,"frightened":false,"sealed":false,"stunned":false,"martialArmorDefense":"12","specialRules":{"0":{"name":"Thick Skin","description":"Considered to be wearing martial armor, having DEF 12 and M.DEF 10","revealed":false,"showDescription":"Considered to be wearing martial armor, having DEF 12 and M.DEF 10"}},"basicAttacks":{"0":{"attackName":"Tentacles","damageBonus":"10","isRanged":false,"accuracyModifier":"2","weaponStat1":"DEX","weaponStat2":"MIG","damageType":"physical","effect":"Multi 2. On an opportunity, target is weak. If the target is already weak, then it is slow. If it has both, then it loses one action on its turn until it loses one of both status effects","roll":""},"1":{"attackName":"Bite","damageBonus":"10","isRanged":false,"accuracyModifier":"2","weaponStat1":"DEX","weaponStat2":"DEX","damageType":"physical","effect":"Deals +5 damage for each status effect","roll":""}},"spells":{},"rank10":true,"rank13":false,"rank16":false,"currentDex":"8","currentIns":"6\n","currentMig":"10\n","currentWlp":"6\n","bonusDefenseModifier":"0","bonusMagicDefenseModifier":"0","accuracyModifier":"0","offensiveMagicCheckBonus":"0","magicCheck":"0","currentDefense":"12","currentMagicDefense":"10"}
*/

(async () => {
    let npc = token.actor.system.props;
    let content = `<h1>${token.actor.name}</h1>
    <div style="height:600px;overflow-y:scroll">`;

    if (npc.rank10 === false) {
        content += `Study this creature first to gain more insight into its abilities.`;
    }

    if (npc.rank10) {
        if (npc.rank13) {
            content += `<div style="margin-bottom: 10px;"><i class="fas fa-list-alt"></i> Traits: ${npc.traits}</div>`;
        }
        content += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; width:400px;">
          <div><i class="fas fa-chess-king ml-1"></i> ${npc.rank}</div>
          <div><i class="fas fa-dragon ml-1"></i> ${npc.species}</div>
          <div><i class="fas fa-heart ml-1"></i> ${npc.maxHP}</div>
          <div><i class="fas fa-fire-alt ml-1"></i> ${npc.maxMP}</div>
        </div>`;
    }

    if (npc.rank13) {
        content += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; width:400px;">
          <div><i class="fas fa-fist-raised ml-1"></i> DEX ${npc.currentDex}</div>
          <div><i class="fas fa-fist-raised ml-1"></i> MIG ${npc.currentMig}</div>
          <div><i class="fas fa-brain ml-1"></i> INS ${npc.currentIns}</div>
          <div><i class="fas fa-hat-wizard ml-1"></i> WLP ${npc.currentWlp}</div>
        </div>`;
        content += `
        <div style="display: flex; justify-content: space-evenly; margin-bottom: 10px; width:400px;">
          <div><i class="fas fa-shield-alt ml-1"></i> DEF ${npc.currentDefense}</div>
          <div><i class="fas fa-hat-wizard ml-1"></i> M.DEF ${npc.currentMagicDefense}</div>
        </div>`;

        let affinities = Object.keys(npc)
            .filter(key => key.endsWith('Affinity') && npc[key] !== '-')
            .map(key => ({ element: key.slice(0, -8), affinity: npc[key] }));

        content += `
  <div style="margin-bottom: 10px;"><i class="fas fa-balance-scale"></i> Affinities:</div>
  <table style="width: 100%; text-align: center;">
    <thead>
      <tr>${affinities.map(a => `<th>${a.element}</th>`).join("")}</tr>
    </thead>
    <tbody>
      <tr>${affinities.map(a => `<td>${a.affinity}</td>`).join("")}</tr>
    </tbody>
  </table>`;
    }

    if (npc.rank16) {
        content += `<h3 class="mt-3">Basic Attacks</h3>`;
        for (let attackKey in npc.basicAttacks) {
            let attack = npc.basicAttacks[attackKey];
            content += `
            <div class="mt-2">
            <strong>${attack.attackName}</strong> ${attack.isRanged ? '<i class="fas fa-bow-arrow"></i>' : ''}: ${attack.weaponStat1} + ${attack.weaponStat2} &#9670; [HR + ${attack.damageBonus}] ${attack.damageType} damage.<br/> ${attack.effect}
          </div>`;
        }

        content += `<h3 class="mt-3">Spells</h3>`;
        for (let spellKey in npc.spells) {
            let spell = npc.spells[spellKey];
            let spellIcon = spell.isOffensive ? '<i class="fas fa-bolt"></i>' : '<i class="fas fa-leaf"></i>';
            let effectDetails = '';
          
            if (spell.effect === 'damage') {
              effectDetails = `&#9670; ${spell.potency} ${spell.element} damage`;
            } else if (spell.effect === 'heal') {
              effectDetails = `&#9670; ${spell.potency} healed`;
            }
          
            content += `
              <div style="margin-bottom: 5px;">
                ${spellIcon} <strong>${spell.spellName}</strong> - ${spell.stat1} + ${spell.stat2} - ${spell.mp} MP, ${spell.targets} targets  ${effectDetails}
                <br/>${spell.description}
                </div>`;
          }         
    }

    // for each of the special rules, display them if the `revealed` key is true
    for (let ruleKey in npc.specialRules) {
        let rule = npc.specialRules[ruleKey];
        if (rule.revealed) {
            content += `<h3 class="mt-3">${rule.name}</h3>`;
            content += `<div>${rule.description}</div>`;
        }
    }    

    content +="</div>";

    let dialog = new Dialog({
        title: `${token.actor.name} Stats`,
        content: content,
        buttons: {
            close: {
                icon: '<i class="fas fa-check"></i>',
                label: 'Close',
                callback: () => { }
            },
            createJournalEntry: {
              icon: '<i class="fas fa-book"></i>',
              label: 'Create Journal Entry',
              callback: async () => {
                  const journalName = 'Monster Journal';
                  const entryName = token.actor.name; // The entry name will be the monster's name
                  const htmlContent = content; // The content you built above
                  let journal = game.journal.getName(journalName);
                  if (!journal) {
                      journal = await Journal.create({
                          name: journalName,
                          folder: null,
                          sort: 0,
                          permission: CONST.ENTITY_PERMISSIONS.OBSERVER,
                          flags: {}
                      });
                  }
                  const entryData = {
                      name: entryName,
                      content: htmlContent,
                      img: 'icons/svg/book.svg', // Optional: Set an icon for the journal entry
                      journal: journal.id
                  };
                  const newEntry = await JournalEntry.create(entryData);
                  if (newEntry) {
                      newEntry.sheet.render(true);
                  }
              }
          }
        },
        default: 'close'
    }, {
        width: 500
    });

    dialog.render(true);
})();
