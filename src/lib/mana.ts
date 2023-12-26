export type ManaType = 'fire' | 'ice' | 'nature' | 'steel' | 'light' | 'dark'

export type ManaGlobe = {
	type: ManaType
	number: number
}

export type ManaDieFace = {
	globes: ManaGlobe[]
}

export type ManaDie = {
	faces: ManaDieFace[]
	activeFaceIdx: number
	spent: boolean
}

export function newManaDie (types: ManaType[]) : ManaDie {
	const faces : ManaDieFace[] = []
	for (let i = 0; i < 6; i++) {
		faces[i] = {
			globes: [],
		}
	}
	types.forEach((type, idx) => {
		faces[idx] = {
			globes: [
				{
					type,
					number: 1,
				}
			]
		}
	})

	return {
		faces,
		spent: false,
		activeFaceIdx: -1,
	}
}
export function getDieActiveManas (die: ManaDie) : ManaType[] {
	const mana :ManaType[] = []
	die.faces[die.activeFaceIdx].globes.forEach((g) => {
		for (let i = 1; i <= g.number; i++) {
			mana.push(g.type)
		}
	})
	return mana
}

export function getDiceActiveManas (dice: ManaDie[]) : ManaType[] {
	return dice.reduce((mana: ManaType[], die) => {
		const dieManas = getDieActiveManas(die)
		dieManas.forEach((m) => {
			mana.push(m)
		})
		return mana
	}, [])
}
