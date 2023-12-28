import { expect, test } from 'vitest'
import {
	assignManaToSkill,
	canAssignManaDiceToSkill,
	canAssignManaToSkill,
	canCast, getSkillRemainingCost,
	ManaCost,
	newSkill
} from "../lib/skill";
import {exp} from "three/examples/jsm/nodes/math/MathNode";
import {ManaType, newManaDie} from "../lib/mana";

function getTestFireball () {
	const fireball = newSkill('fireball')
	fireball.cost = ['fire', 'fire', 'any'];
	return fireball
}

test('skill cannot be cast right away', () => {
	const fireball = newSkill('fireball')
	expect(canCast(fireball)).toBe(false)
})

test.only('skill remaining cost', () => {
	type PaymentTest = {
		paid: ManaType[]
		remaining: ManaCost[]
	}

	const tests : PaymentTest[] = [
		{
			paid: ['fire'],
			remaining: ['fire', 'any'],
		},
		{
			paid: ['fire', 'fire', 'fire'],
			remaining: [],
		},
		{
			paid: ['ice', 'fire'],
			remaining: ['fire']
		},
		{
			paid: ['fire', 'fire'],
			remaining: ['any']
		},
		{
			paid: ['fire', 'ice'],
			remaining: ['fire'],
		},
	]

	for (let i = 0; i < tests.length; i++) {
		const pt = tests[i]
		const skill = getTestFireball()
		skill.paidMana = pt.paid
		const remaining = getSkillRemainingCost(skill)
		console.log('=--')
		console.log('i', i)
		console.log('cost', skill.cost)
		console.log('paid', skill.paidMana)
		console.log('remaining', remaining)
		expect(remaining.toString()).toBe(pt.remaining.toString())
	}
})

test('skill needs correct mana to assign', () => {
	const fireball = getTestFireball()
	expect(canAssignManaToSkill(fireball, ['fire', 'ice', 'ice'])).toBe(false)
	expect(canAssignManaToSkill(fireball, [])).toBe(false)
	expect(canAssignManaToSkill(fireball, ['light'])).toBe(false)
	expect(canAssignManaToSkill(fireball, ['fire'])).toBe(true)
	expect(canAssignManaToSkill(fireball, ['fire', 'fire'])).toBe(true)

	expect(canAssignManaToSkill(fireball, ['ice', 'fire', 'fire'])).toBe(true)
	expect(canAssignManaToSkill(fireball, ['fire', 'fire', 'fire'])).toBe(true)
	expect(canAssignManaToSkill(fireball, ['fire', 'fire', 'fire', 'ice'])).toBe(true)
})

test('skill needs correct mana dice to assign', () => {
	const fireball = getTestFireball()
	const die = newManaDie(['fire', 'ice'])

	expect(canAssignManaDiceToSkill(fireball, [die])).toBe(false)

	die.activeFaceIdx = 0
	expect(canAssignManaDiceToSkill(fireball, [die])).toBe(true)

	die.spent = true
	expect(canAssignManaDiceToSkill(fireball, [die])).toBe(false)

	// This face has no mana on it
	die.activeFaceIdx = 4
	expect(canAssignManaDiceToSkill(fireball, [die])).toBe(false)

	// Should be good now
	die.activeFaceIdx = 1
	die.spent = false
	expect(canAssignManaDiceToSkill(fireball, [die])).toBe(true)


	// Can't add ice when ice has already been assigned
	fireball.paidMana = ['ice']
	expect(canAssignManaDiceToSkill(fireball, [die])).toBe(false)
})

test('assigning mana to skill changes it', () => {
	const fireball = getTestFireball()

	assignManaToSkill(fireball, ['fire', 'ice'])

	expect(fireball.paidMana.length).toBe(2)
	expect(fireball.paidMana[0]).toBe('fire')
})
