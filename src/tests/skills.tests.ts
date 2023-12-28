import { expect, test } from 'vitest'
import {canAssignManaToSkill, canCast, newSkill} from "../lib/skill";

test('skill cannot be cast right away', () => {
	const fireball = newSkill('fireball')
	expect(canCast(fireball)).toBe(false)
})

test('skill needs correct mana to assign', () => {
	const fireball = newSkill('fireball')
	fireball.cost = ['fire', 'fire', 'any'];
	expect(canAssignManaToSkill(fireball, ['fire', 'ice', 'ice'])).toBe(false)
	expect(canAssignManaToSkill(fireball, [])).toBe(false)
	expect(canAssignManaToSkill(fireball, ['light'])).toBe(false)
	expect(canAssignManaToSkill(fireball, ['fire', 'fire'])).toBe(false)

	expect(canAssignManaToSkill(fireball, ['ice', 'fire', 'fire'])).toBe(true)
	expect(canAssignManaToSkill(fireball, ['fire', 'fire', 'fire'])).toBe(true)
	expect(canAssignManaToSkill(fireball, ['fire', 'fire', 'fire', 'ice'])).toBe(true)
})
