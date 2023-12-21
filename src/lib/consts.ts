import {EnemyType, EnemyTypeKey} from "./game";

export const ENEMY_TYPES : Record<EnemyTypeKey, EnemyType> = {
	goblin: {
		damageDie: 'd4',
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
