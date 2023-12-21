import {Draft, produce} from "immer";
import {ENEMY_TYPES} from "./consts";
import {getRandomInt, rollDie} from "./random";
import {ManaDie, newManaDie} from "./mana";
import {newSkill, Skill} from "./skill";

export type Game = {
	player: Player
	enemies: Enemy[]
	roundNumber: number
	logs: string[]
	over: boolean
	manaDice: ManaDie[]
	skills: Skill[]
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
		roundNumber: 0,
		over: false,
		logs: [],
		manaDice: [
			newManaDie(['fire', 'fire', 'fire', 'ice']),
			newManaDie(['ice', 'ice', 'ice', 'light']),
			newManaDie(['light', 'light', 'light', 'fire']),
		],
		skills: [
			newSkill('fireball'),
			newSkill('ice_chains'),
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

/**
 * User has decided to reroll their dice
 * @param game
 * @param manaDiceIndices
 */
export function rerollSelectedManaDice (game: Game, manaDiceIndices: number[]) : Game {
	// TODO: Have a number of rerolls to subtract
	const updated = rerollEnemyDice(game)
	return rollSelectedManaDice(updated, manaDiceIndices)
}

export function rollSelectedManaDice (game: Game, manaDiceIndices: number[]): Game {
	return produce<Game>(game,(draft: Draft<Game>) => {
		manaDiceIndices.forEach((idx) => {
			const md = draft.manaDice[idx]
			const activeIdx = getRandomInt(Math.random().toString(), 0, md.faces.length-1)
			md.activeFaceIdx = activeIdx
		})
	})
}

export function rollManaDice (game: Game) : Game {
	return rollSelectedManaDice(game, game.manaDice.map((_, idx) => idx))
}

export function newRound (game: Game) : Game {
	const updated = rollManaDice(rollEnemyDice(game))
	return produce<Game>(updated, (draft: Draft<Game>) => {
		draft.manaDice.forEach((md) => {
			md.spent = false
		})
		draft.roundNumber += 1
	})
}

export function assignMana (game: Game, skillId: string, selectedManaIndices: number[]) : Game {
	return produce<Game>(game, (draft: Draft<Game>) => {
		const skill = draft.skills.find(x => x.id === skillId)!
		selectedManaIndices.forEach((idx) => {
			const die = draft.manaDice[idx]
			die.spent = true

			die.faces[die.activeFaceIdx].globes.forEach((g) => {
				for (let i = 1; i <= g.number; g++) {
					skill.paidMana.push(g.type)
				}
			})
		})
	})
}
