export type ManaType = 'fire' | 'ice' | 'nature' | 'steel' | 'light' | 'dark'

export type ManaGlobe = {
	type: ManaType
	number?: number // Blank defaults to 1
}

export type ManaDieFace = {
	globes: ManaGlobe[]
}

export type ManaDie = {
	faces: ManaDieFace[]
	activeFaceIdx: number
}

export function newManaDie (types: ManaType[]) : ManaDie {
	const faces : ManaDieFace[] = []
	for (let i = 0; i < 6; i++) {
		faces[i] = {
			globes: [],
		}
	}
	console.log('faces len', faces.length)
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
		activeFaceIdx: -1,
	}
}
