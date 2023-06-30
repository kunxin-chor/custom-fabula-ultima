//${ref('level')+5*ref('mig_base')+5*count(fetchFromDynamicTable('classesList','classBenefit', 'classBenefit', 'hpPlus'))+ref('skillBonusHp')}$

//${5 * ref('baseMig') + ref('level') + 5*count(fetchFromDynamicTable('classesList','classBenefit', 'classBenefit', 'hpPlus')) + ref('skillBonusHp')}$

//${5 * ref('baseWlp') + ref('level') + 5*count(fetchFromDynamicTable('classesList','classBenefit', 'classBenefit', 'mpPlus')) + ref('skillBonusHp')}$//

//${6 + 2*count(fetchFromDynamicTable('classesList','classBenefit', 'classBenefit', 'ipPlus')) + ref('skillBonusIp')}$

/*
${#modifier:= ref('rollModifier')}$
<h2>Rolling a ${!rollStat1}$ + ${!rollStat2}$ ${modifier < 0 ? modifier : concat('+', string(modifier))}$ Check </h2>


${#dice1:= equalText(string(rollStat1) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(rollStat1) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(rollStat1) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(rollStat1) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(rollStat2) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(rollStat2) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(rollStat2) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(rollStat2) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(rollStat1)}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(rollStat2)}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><strong>Result: ${D1+D2+modifier}$ HR: ${max(D1, D2)}$</strong></p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$

*/


/* For weapons and spells */
/*
<h2>${!item.name}$</h2>
<hr/>

${#dice1:= equalText(string(item.weaponStat1) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(item.weaponStat1) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(item.weaponStat1) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(item.weaponStat1) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(item.weaponStat2) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(item.weaponStat2) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(item.weaponStat2) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(item.weaponStat2) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(item.weaponStat1)}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(item.weaponStat2)}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${item.accuracyModifier}$ = <b>${D1+D2+item.accuracyModifier}$</b> vs. DEF</p>
 
<p><b>Damage:</b> HR + ${!item.damageBonus}$  = <b>${max(D1, D2)+item.damageBonus}$</b>  ${!item.damageType}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$




*/

/* Calculate defense *
/*
${ref('martial') == true ? ref('armorDefense') : ref('armorDefense') + getPropertyDataFromActor('attached', 'coreDefense')}$
${ref('armorMagicDefense') + getPropertyDataFromActor('attached', 'coreMagicDefense')}$


${ref('equipped') == true ? (ref('martial') == true ? ref('armorDefense') : ref('armorDefense') + getPropertyDataFromActor('attached', 'coreDefense')) : getPropertyDataFromActor('attached', 'coreDefense')}$


${ref('equipped') == true ?  ref('armorMagicDefense') + getPropertyDataFromActor('attached', 'coreMagicDefense') : getPropertyDataFromActor('attached', 'coreMagicDefense')}$


${ref('equipped') == true ?  ref('armorDefense')  :0}$

${ref('equipped') == true ?  ref('armorMagicDefense')  :0}$

${ref('equipped') == true ?  "resistant" : getPropertyDataFromActor('attached', 'fireAffinity')}$


<h2>Initiative Roll</h2>
${#dice1:= ref('currentDex')}$

${#dice2:= ref('currentIns')}$

<p><b>DEX</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>
<p><b>INS</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>
<p><strong>Result: ${!D1}$ + ${!D2}$ + ${ref('coreInit')}$ = ${D1+D2+ref('coreInit')}$</p>
${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$
${! smallerEq(D1 + D2 + ref('coreInit'), 4) ? string('<p><b>STUMBLE!</b></p>'): string('')}$
${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$


FORMULA FOR DEFENSE
${ ref('martialArmor') ? ref('armorDefenseModifier') + ref('defenseModifier') : ref('armorDefenseModifier') + ref('currentDex') + ref('defenseModifier')}$

${ ref('equipped') ? ref('armorDefense') : 0}$
${ ref('equipped') ? ref('armorMagicDefense') : 0}$
${ ref('equipped') ? ref('martial') : 0}$

FORMULA FOR MONSTER ATTACK
<h2>${!sameRow('attackName')}$</h2>
<hr/>

${#dice1:= equalText(string(sameRow('weaponStat1')) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(sameRow('weaponStat1')) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(sameRow('weaponStat1')) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(sameRow('weaponStat1')) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(sameRow('weaponStat2')) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(sameRow('weaponStat2')) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(sameRow('weaponStat2')) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(sameRow('weaponStat2')) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(sameRow('weaponStat1'))}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(sameRow('weaponStat2'))}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${sameRow('accuracyModifier')}$  + ${ref('accuracyModifier')}$ = <b>${D1+D2+sameRow('accuracyModifier')+ref('accuracyModifier')}$</b> vs. DEF</p>
 
<p><b>Damage:</b> HR + ${!sameRow('damageBonus')}$  = <b>${max(D1, D2)+sameRow('damageBonus')}$</b>  ${!sameRow('damageType')}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$
*/

/*
Roll ability


<h2>${!item.spellName}$</h2>
<hr/>
<div>
<p>Effect: ${sameRow('effect')}$</p>
<p>Targets: ${sameRow('targets')}$</p>
</div>

${#dice1:= equalText(string(item.stat1) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(item.stat1) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(item.stat1) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(item.stat1) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(item.stat2) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(item.stat2) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(item.stat2) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(item.stat2) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(item.stat1)}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(item.stat2)}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${item.checkModifier}$  + ${ref('accuracyModifier')}$ = <b>${D1+D2+item.checkModifier+accuracyModifier}$</b> vs. DEF</p>
 
<p><b>Potency:</b> HR + ${!sameRow('potency')}$  = <b>${max(D1, D2)+sameRow('potency')}$</b>  ${!item.element}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$




Roll NPC Ability


<h2>${!sameRow('spellName')}$</h2>
<hr/>
<div>
<p>Effect: ${sameRow('effect')}$</p>
<p>Targets: ${sameRow('targets')}$</p>
${sameRow('description')}$
</div>

${#dice1:= equalText(string(sameRow('stat1')) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(sameRow('stat1')) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(sameRow('stat1')) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(sameRow('stat1')) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(sameRow('stat2')) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(sameRow('stat2')) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(sameRow('stat2')) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(sameRow('stat2')) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(sameRow('stat1'))}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(sameRow('stat2'))}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${sameRow('checkModifier')}$  + ${ref('accuracyModifier')}$ = <b>${D1+D2+sameRow('checkModifier')+accuracyModifier}$</b> vs. DEF</p>
 
<p><b>Potency:</b> HR + ${!sameRow('potency')}$  = <b>${max(D1, D2)+sameRow('potency')}$</b>  ${!sameRow('element')}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$


MODIFIED WEAPON ROLL:
<h2>${!item.name}$</h2>
<hr/>

${#dice1:= equalText(string(item.weaponStat1) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(item.weaponStat1) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(item.weaponStat1) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(item.weaponStat1) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(item.weaponStat2) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(item.weaponStat2) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(item.weaponStat2) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(item.weaponStat2) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(item.weaponStat1)}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(item.weaponStat2)}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${item.accuracyModifier}$  + ${ref('accuracyModifier')}$ = <b>${D1+D2+item.accuracyModifier+accuracyModifier}$</b> vs. ${!item.targetDefense}$</p>
 
<p><b>Damage:</b> HR + ${!item.damageBonus}$  = <b>${max(D1, D2)+item.damageBonus}$</b>  ${!item.damageType}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$

<span class="hidden roll-result">${! D1+D2+item.accuracyModifier+accuracyModifier}$</span>
<span class="hidden roll-damage">${! max(D1, D2)+item.damageBonus}$</span>
<span class="hidden roll-opportunity">${! largerEq(D1, 6) and D1 == D2 ? 1 : 0}$</span>
<span class="hidden roll-fumble">${! D1 == D2 and D1 == 1 ? 1 : 0}$</span>
<span class="hidden roll-HR">${! max(D1, D2)}$</span>
<span class="hidden roll-target-defense">${! item.targetDefense}$</span>
<span class="hidden roll-damage-type">${! item.damageType}$</span>

MODIFIED ABILITY ROLL
<h2>${!item.name}$</h2>
<hr/>
<div>
${!item.fullDescription}$
</div>

<p class="mp-cost">MP: ${item.mpCost}$<span class="mp-cost-button"></span></p>

${#dice1:= equalText(string(item.stat1) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(item.stat1) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(item.stat1) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(item.stat1) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(item.stat2) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(item.stat2) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(item.stat2) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(item.stat2) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(item.stat1)}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(item.stat2)}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${item.checkModifier}$  + ${ref('accuracyModifier')}$ = <b>${D1+D2+item.checkModifier+accuracyModifier}$</b> vs. ${! item.targetDefense}$</p>
 
<p><b>Damage:</b> HR + ${!item.damageModifier}$  = <b>${max(D1, D2)+item.damageModifier}$</b>  ${!item.damageType}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$

<span class="hidden roll-result">${! D1+D2+item.checkModifier+accuracyModifier}$</span>
<span class="hidden roll-damage">${! max(D1, D2)+item.damageModifier}$</span>
<span class="hidden roll-opportunity">${! largerEq(D1, 6) and D1 == D2 ? 1 : 0}$</span>
<span class="hidden roll-fumble">${! D1 == D2 and D1 == 1 ? 1 : 0}$</span>
<span class="hidden roll-HR">${! max(D1, D2)}$</span>
<span class="hidden roll-target-defense">${! item.targetDefense}$</span>
<span class="hidden roll-damage-type">${! item.damageType}$</span>
<span class="hidden roll-MP-cost">${! item.mpCost}$</span>

MODIFIED MONSTER ATTACK
<h2>${!sameRow('attackName')}$</h2>
<hr/>

${#dice1:= equalText(string(sameRow('weaponStat1')) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(sameRow('weaponStat1')) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(sameRow('weaponStat1')) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(sameRow('weaponStat1')) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(sameRow('weaponStat2')) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(sameRow('weaponStat2')) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(sameRow('weaponStat2')) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(sameRow('weaponStat2')) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(sameRow('weaponStat1'))}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(sameRow('weaponStat2'))}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${sameRow('accuracyModifier')}$  + ${ref('accuracyModifier')}$ = <b>${D1+D2+sameRow('accuracyModifier')+ref('accuracyModifier')}$</b> vs. ${! sameRow('targetDefense')}$</p>
 
<p><b>Damage:</b> HR + ${!sameRow('damageBonus')}$  = <b>${max(D1, D2)+sameRow('damageBonus')}$</b>  ${!sameRow('damageType')}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$

<span class="hidden roll-result">${! D1+D2+sameRow('accuracyModifier')+accuracyModifier}$</span>
<span class="hidden roll-damage">${! max(D1, D2)+sameRow('damageBonus')}$</span>
<span class="hidden roll-opportunity">${! largerEq(D1, 6) and D1 == D2 ? 1 : 0}$</span>
<span class="hidden roll-fumble">${! D1 == D2 and D1 == 1 ? 1 : 0}$</span>
<span class="hidden roll-HR">${! max(D1, D2)}$</span>
<span class="hidden roll-target-defense">${! sameRow('targetDefense')}$</span>
<span class="hidden roll-damage-type">${! sameRow('damageType')}$</span>

MODIFIED MONSTER SPELL ATTACK
<h2>${!sameRow('spellName')}$</h2>
${!sameRow('description')}$
<hr/>
<div>
<p class="mp-cost">MP: ${sameRow('mp')}$<span class="mp-cost-button"></span></p>
<p>Effect: ${sameRow('effect')}$</p>
<p>Targets: ${sameRow('targets')}$</p>

</div>

${#dice1:= equalText(string(sameRow('stat1')) ,'DEX') == true ? ref('currentDex') : 0}$
${#dice1:= equalText(string(sameRow('stat1')) ,'INS') == true and isZero(dice1) == true ? ref('currentIns') : dice1}$
${#dice1:= equalText(string(sameRow('stat1')) ,'MIG') == true and isZero(dice1) == true ? ref('currentMig') : dice1}$
${#dice1:= equalText(string(sameRow('stat1')) ,'WLP') == true and isZero(dice1) == true ? ref('currentWlp') : dice1}$

${#dice2:= equalText(string(sameRow('stat2')) ,'DEX') == true ? ref('currentDex') : 0}$ 
${#dice2:= equalText(string(sameRow('stat2')) ,'INS') == true and isZero(dice2) == true ? ref('currentIns') : dice2}$
${#dice2:= equalText(string(sameRow('stat2')) ,'MIG') == true and isZero(dice2) == true ? ref('currentMig') : dice2}$
${#dice2:= equalText(string(sameRow('stat2')) ,'WLP') == true and isZero(dice2) == true ? ref('currentWlp') : dice2}$

<p><b>${!string(sameRow('stat1'))}$</b> = 1d${!dice1}$ = ${D1:=[1d:dice1:]}$</p>

<p><b>${!string(sameRow('stat2'))}$</b> = 1d${!dice2}$ = ${D2:=[1d:dice2:]}$</p>

<p><b>Check:</b> ${!D1}$ + ${!D2}$ + ${sameRow('checkModifier')}$  + ${ref('accuracyModifier')}$ = <b>${D1+D2+sameRow('checkModifier')+accuracyModifier}$</b> vs. ${! sameRow('targetDefense')}$</p>
 
<p><b>Potency:</b> HR + ${!sameRow('potency')}$  = <b>${max(D1, D2)+sameRow('potency')}$</b>  ${!sameRow('element')}$</p>

${! largerEq(D1, 6) and D1 == D2 ? string('<p><b>CRITICAL SUCCESS! Gain an Opportunity</b></p>'): string('')}$

${!D1 == D2 and D1 == 1 ? string('<p><b>FUMBLE<b></p>'): string('')}$

<span class="hidden roll-result">${! D1+D2+sameRow('checkModifier')+accuracyModifier}$</span>
<span class="hidden roll-damage">${! max(D1, D2)+sameRow('potency')}$</span>
<span class="hidden roll-opportunity">${! largerEq(D1, 6) and D1 == D2 ? 1 : 0}$</span>
<span class="hidden roll-fumble">${! D1 == D2 and D1 == 1 ? 1 : 0}$</span>
<span class="hidden roll-HR">${! max(D1, D2)}$</span>
<span class="hidden roll-target-defense">${! sameRow('targetDefense')}$</span>
<span class="hidden roll-damage-type">${! sameRow('element')}$</span>
<span class="hidden roll-MP-cost">${! sameRow('mp')}$</span>

*/


