import {Draft, produce} from "immer";
import {ENEMY_TYPES} from "./consts";
import {getRandomInt, rollDie} from "./random";
import {ManaDie, newManaDie} from "./mana";

export type Game = {
	player: Player
	enemies: Enemy[]
	roundNumber: number
	logs: string[]
	over: boolean
	manaDice: ManaDie[]
}

export type Combatant = {
	name: string
	hp: number
	maxHP: number
}

export type Player = Combatant & {

}

export type DieSize = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20'

export type EnemyTypeKey = 'goblin' | 'spider'

export type EnemyType = {
	key: EnemyTypeKey,
	damageDie: DieSize
	name: string
	hp: number
}

export type Enemy = Combatant & {
	type: EnemyType
	id: string
	damageDie: DieSize
	roll: null | number
}


export function dealPlayerDamage (draft: Draft<Game>, dmg: number) {
	draft.player.hp = Math.max(0, draft.player.hp - dmg)

	const dead = draft.player.hp <= 0
	draft.logs.push(`Player lost ${dmg}${dead ? ' and DIED!' : '.'}`)

	if (dead) {
		draft.over = true
	}
}

function newCombatant (name: string, hp: number) : Combatant {
	return {
		name: name,
		hp,
		maxHP: hp,
	}
}


let ids = 0
function newEnemy (typeKey: EnemyTypeKey) : Enemy {
	const type = ENEMY_TYPES[typeKey]
	return {
		id: 'm_' + (++ids),
		name: type.name,
		type,
		hp: type.hp,
		maxHP: type.hp,
		damageDie: type.damageDie,
		roll: null,
	}
}

export function newGame () : Game {
	return {
		player: newCombatant('Player 1', 30),
		enemies: [
			newEnemy('spider'),
			newEnemy('goblin'),
			newEnemy('goblin'),
		],
		roundNumber: 1,
		over: false,
		logs: [],
		manaDice: [
			newManaDie(['fire', 'fire', 'fire', 'ice']),
			newManaDie(['ice', 'ice', 'ice', 'light']),
			newManaDie(['light', 'light', 'light', 'fire']),
		]
	}
}

export function rollEnemyDice (game: Game) : Game {
	return produce<Game>(game,(draft: Draft<Game>) => {
		draft.enemies.forEach((e) => {
			e.roll = rollDie(new Date().toISOString(), e.damageDie)
		})
	})
}

export function rerollEnemyDice (game: Game) : Game {
	return produce<Game>(game,(draft: Draft<Game>) => {
		draft.enemies.forEach((e) => {
			const newer = rollDie(new Date().toISOString(), e.damageDie)
			if (newer > e.roll) {
				e.roll = newer
			}
		})
	})
}

export function rollManaDice (game: Game) : Game {
	return produce<Game>(game,(draft: Draft<Game>) => {
		draft.manaDice.forEach((md) => {
			const activeIdx = getRandomInt(Math.random().toString(), 0, md.faces.length-1)
			md.activeFaceIdx = activeIdx
		})
	})
}
