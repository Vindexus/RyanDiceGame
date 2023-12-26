import {getDiceActiveManas, getDieActiveManas, ManaDie, ManaType} from "./mana";
import {SKILL_TYPES} from "./consts";

export type ManaCost = 'any' | ManaType

export type SkillTypeKey = 'fireball' | 'ice_chains'

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
	const anyMana = skill.cost.filter(x => x === 'any')
	const specificMana = skill.cost.filter(x => x !== 'any')

	const spendable = [...skill.paidMana]
	for (let i = 0; i < specificMana.length; i++) {
		const typeNeeded = specificMana[i]
		const found = spendable.findIndex(x => x === typeNeeded)
		if (found >= 0) {
			spendable.splice(found, 1)
		}
		else {
			return false
		}
	}

	return anyMana.length <= spendable.length
}

export function canAssignManaDiceToSkill (skill: Skill, dice: ManaDie[]) : boolean {
	const mana = getDiceActiveManas(dice)
	return canAssignManaToSkill(skill, mana)
}

export function canAssignManaToSkill (skill: Skill, mana: ManaType[]) : boolean {
	let unallocated = [...mana]

	// Check all the specific mana we have
	for (let i = 0; i < skill.cost.length; i++) {
		const cost = skill.cost[i]
		if (cost === 'any') {
			return
		}
		const foundIdx = unallocated.findIndex(x => x === cost)
		if (foundIdx === -1) {
			return false
		}

		unallocated.splice(foundIdx, 1)
	}

	const remaining = skill.cost.filter(x => x !== 'any')

	return unallocated.length >= remaining.length
}

export function assignManaToSkill (skill: Skill, dice: ManaDie[]) {
	const mana = getDiceActiveManas(dice)
	if (!canAssignManaToSkill(skill, mana)) {
		return
	}

	const added : ManaType[] = []
	mana.forEach((m) => {
		skill.paidMana.push(m)
		added.push(m)
	})
}
