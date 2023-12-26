import {EnemyType, EnemyTypeKey} from "./game";
import {SkillType, SkillTypeKey} from "./skill";

export const ENEMY_TYPES : Record<EnemyTypeKey, EnemyType> = {
	goblin: {
		damageDie: 'd6',
		name: 'Goblin',
		key: 'goblin',
		hp: 7,
	},
	spider: {
		damageDie: 'd8',
		name: 'Spider',
		key: 'spider',
		hp: 16,
	}
}

export const SKILL_TYPES : Record<SkillTypeKey, SkillType> = {
	fireball: {
		name: 'Fireball',
		cost: ['fire', 'fire', 'any'],
		description: 'Deal fire damage to a target',
		key: 'fireball',
	},
	ice_chains: {
		key: 'ice_chains',
		name: 'Ice Chains',
		description: 'Deal ice damage to a target.',
		cost: ['any', 'ice'],
	},
}
