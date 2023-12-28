import {getDiceActiveManas, ManaDie, ManaType} from "./mana";
import {SKILL_TYPES} from "./consts";

export type ManaCost = 'any' | ManaType

export type SkillTypeKey = 'fireball' | 'ice_chains' | 'dawn_shield'

export type SkillType = {
	key: SkillTypeKey
	name: string
	cost: ManaCost[]
	description: string
}

export type Skill = {
	type: SkillType
	paidMana: ManaType[]
	id: string,
	cost: ManaCost[]
}

let id = 0
export function newSkill (key: SkillTypeKey) : Skill {
	const type = SKILL_TYPES[key]
	id++
	return {
		id: `s_${id}`,
		type,
		paidMana: [],
		cost: JSON.parse(JSON.stringify(type.cost)),
	}
}

export function canCast (skill: Skill) : boolean {
	return getSkillRemainingCost(skill).length === 0
}

export function canAssignManaDiceToSkill (skill: Skill, dice: ManaDie[]) : boolean {
	console.log('----')
	console.log('can?', skill, dice)
	const spent = dice.filter(x => x.spent)
	if (spent.length) {
		console.log('already spent some of the dice')
		return false
	}

	const missingFaces = dice.filter(x => x.activeFaceIdx === -1)
	console.log('missing faces', missingFaces)
	if (missingFaces.length) {
		console.log('some of these dice have not been rolled')
		return false
	}

	const mana = getDiceActiveManas(dice)
	console.log('mana', mana)
	const canAssignBasedOnMana = canAssignManaToSkill(skill, mana)
	console.log('canAssignBasedOnMana', canAssignBasedOnMana, mana)
	return canAssignBasedOnMana
}

export function getSkillSpecificManaCosts (skill: Skill) : ManaCost[] {
	return skill.cost.filter(x => x !== 'any')
}

export function getSkillGenericManaCosts (skill: Skill) : ManaCost[] {
	return skill.cost.filter(x => x === 'any')
}

/**
 * Returns an array of the costs that the skill needs to be have paid for
 * A skill with a cost of fire,ice,any,any that has had "ice,earth" paid
 * to it should return "fire,any"
 * @param skill
 */
export function getSkillRemainingCost (skill: Skill) : ManaCost[] {
	// Put all the paid mana into a list that we will change as we mark off
	// certain costs as paid
	const uncountedPaidMana : ManaType[] = [...skill.paidMana]
	const remainingCost : ManaCost[] = []

	const specificCosts = getSkillSpecificManaCosts(skill)
	specificCosts.forEach((cost) => {
		const idx = uncountedPaidMana.findIndex(x => x === cost)

		if (idx >= 0) {
			uncountedPaidMana.splice(idx, 1)
		}
		else {
			remainingCost.push(cost)
		}
	})

	// Remove generic costs based on how much mana we have remaining
	// to count that wasn't used for specific mana
	const genericCosts = getSkillGenericManaCosts(skill)
	genericCosts.splice(0, uncountedPaidMana.length)

	return remainingCost.concat(genericCosts)
}

export function canAssignManaToSkill (skill: Skill, mana: ManaType[]) : boolean {
	if (mana.length === 0) {
		return false
	}

	let unallocated = [...mana]
	const unpaidMana = getSkillRemainingCost(skill)
	console.log('unallocated', unallocated.join(','))

	// First go through all the non-generic costs and make sure that all of
	// those have been assigned
	const specific = unpaidMana.filter(x => x !== 'any')
	for (let i = 0; i < specific.length; i++) {
		console.log('=====')
		console.log('i', i)
		const cost = specific[i]
		console.log('cost', cost)
		if (cost === 'any') {
			console.log('skip the any')
			continue
		}
		const foundIdx = unallocated.findIndex(x => x === cost)
		console.log('found', foundIdx)
		if (foundIdx >= 0) {
			unallocated.splice(foundIdx, 1)
		}

	}

	if (unallocated.length === 0) {
		return true
	}

	const generic = unpaidMana.filter(x => x === 'any')
	console.log('gen', generic)
	console.log('unallocated', unallocated.join(','))
	return generic.length > 0 && unallocated.length > 0
}

export function assignManaDiceToSkill (skill: Skill, dice: ManaDie[]) {
	const mana = getDiceActiveManas(dice)
	dice.forEach(d => {
		d.spent = true
	})
	assignManaToSkill(skill, mana)
}

export function assignManaToSkill (skill: Skill, mana: ManaType[]) {
	const added : ManaType[] = []
	mana.forEach((m) => {
		skill.paidMana.push(m)
		added.push(m)
	})
}
