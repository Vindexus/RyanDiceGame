import seedrandom from 'seedrandom'
import {DieSize} from "./game";

function random (seed: string) {
	const rng = seedrandom(seed)
	return rng()
}

export function getRandomInt (seed: string, min: number, max: number)  : number {
	return Math.round(random(seed) * (max - min) + min);
}

export function rollDie (seed: string, size: DieSize) : number {
	let max = 1
	let min = 1
	// I prefer this to remove the "d" from the string
	switch (size) {
		case "d4":
			max = 4;
			break
		case "d6":
			max = 6;
			break
		case "d8":
			max = 8;
			break
		case "d10":
			max = 10;
			break
		case "d12":
			max = 12;
			break
		case "d20":
			max = 20;
			break
		default:
			throw new Error(`What size is ${size}?`)
	}

	return getRandomInt(seed, min, max)
}
