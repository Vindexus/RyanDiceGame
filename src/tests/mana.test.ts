import {expect, test} from 'vitest'
import {getDiceActiveManas, getDieActiveManas, newManaDie} from "../lib/mana";

test('skill can be cast', () => {
	const die = newManaDie([])
	die.faces[0] = {
		globes: [
			{
				type: 'fire',
				number: 1,
			},
			{
				type: 'ice',
				number: 2,
			}
		]
	}
	die.activeFaceIdx = 0

	const mana = getDieActiveManas(die)
	expect(mana.length).toBe(3)

	const ices = mana.filter(x => x === 'ice')
	expect(ices.length).toBe(2)

	const manaList = getDiceActiveManas([die])
	expect(mana.toString()).toEqual(manaList.toString())
})
