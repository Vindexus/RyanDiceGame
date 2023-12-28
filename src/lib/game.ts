import {Draft, produce} from "immer";
import {ENEMY_TYPES} from "./consts";
import {getRandomInt, rollDie} from "./random";
import {ManaDie, ManaType, newManaDie} from "./mana";
import {canAssignManaToSkill, newSkill, Skill} from "./skill";

export type Game = {
	player: Player
	enemies: Enemy[]
	roundNumber: number
	logs: Log[]
	over: boolean
	manaDice: ManaDie[]
	skills: Skill[]
}

export type Log = {
	id: number
	text: string
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
	damageRoll: null | number
}


export function dealPlayerDamage (draft: Draft<Game>, dmg: number) {
	draft.player.hp = Math.max(0, draft.player.hp - dmg)

	const dead = draft.player.hp <= 0
	addLog(draft, `Player lost ${dmg}${dead ? ' and DIED!' : '.'}`)

	if (dead) {
		draft.over = true
	}
}

function addLog (draft: Draft<Game>, msg: string) {
	draft.logs.unshift({
		id: draft.logs.length,
		text: msg,
	})
}

function newCombatant (name: string, hp: number) : Combatant {
	return {
		name: name,
		hp,
		maxHP: hp,
	}
}


let ids = 0
function newEnemy (typeKey: EnemyTypeKey, extraName?: string) : Enemy {
	const type = ENEMY_TYPES[typeKey]
	return {
		id: 'm_' + (++ids),
		name: type.name + (extraName ? (' '+extraName) : ''),
		type,
		hp: type.hp,
		maxHP: type.hp,
		damageDie: type.damageDie,
		damageRoll: null,
	}
}

export function newGame () : Game {
	return {
		player: newCombatant('Player 1', 30),
		enemies: [
			newEnemy('spider'),
			newEnemy('goblin', '1'),
			newEnemy('goblin', '2'),
		],
		roundNumber: 0,
		over: false,
		logs: [],
		manaDice: [
			newManaDie(['ice', 'fire', 'ice', 'ice']),
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
			e.damageRoll = rollDie(new Date().toISOString(), e.damageDie)
			addLog(draft, e.name + ' rolled a ' + e.damageRoll)
		})
	})
}

export function rerollEnemyDice (game: Game) : Game {
	return produce<Game>(game,(draft: Draft<Game>) => {
		draft.enemies.forEach((e) => {
			const newer = rollDie(new Date().toISOString(), e.damageDie)
			if (newer > e.damageRoll) {
				e.damageRoll = newer
				addLog(draft, e.name + ' rerolled up to ' + newer)
			}
			else {
				addLog(draft, e.name + ' stays at ' + e.damageRoll + ' after rerolling a ' + newer)
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
		addLog(draft, `Rerolled ${manaDiceIndices.length === draft.manaDice.length ? 'all' : manaDiceIndices.length} mana dice`)
	})
}

export function rollManaDice (game: Game) : Game {
	return rollSelectedManaDice(game, game.manaDice.map((_, idx) => idx))
}

export function newRound (game: Game) : Game {
	const updated = produce<Game>(game, (draft: Draft<Game>) => {
		draft.roundNumber += 1
		addLog(draft, `Started round ${draft.roundNumber}`)
		draft.manaDice.forEach((md) => {
			md.spent = false
		})
	})
	return rollManaDice(rollEnemyDice(updated))
}

export function assignMana (game: Game, skillId: string, selectedManaIndices: number[]) : Game {
	return produce<Game>(game, (draft: Draft<Game>) => {
		const skill = draft.skills.find(x => x.id === skillId)!
		const dice = selectedManaIndices.map((idx) => {
			return draft.manaDice[idx]
		})
		if (!canAssignManaToSkill(skill, dice)) {
			return
		}
		addLog(draft, `Assigned ${dice}`)
	})
}
