import {ManaDie, ManaDieFace, ManaType} from "../lib/mana";
import AnimatedDice from "./AnimatedDice";

type ManaDieProps = {
	die: ManaDie
	selected: boolean
	onClick: Function
}

export default function ManaDieC (props: ManaDieProps) {
	const {die, selected, onClick} = props
	const activeFace = die.activeFaceIdx >= 0 ? die.faces[die.activeFaceIdx] : null

	const faces = die.faces.filter(x => x.globes.length).map((f) => {
		return f.globes[0].type
	})

	return <div onClick={() => onClick()} className={`mana-die w-32 h-32 tw-border-solid border-2 flex flex-col justify-between mana-die-${selected ? 'selected' : ''} ${die.spent ? 'mana-die-spent' : ''}`}>
		<div className={'h-2/3 flex justify-center align-center'} style={{fontSize: '75px'}}>
			<AnimatedDice die={die} />
		</div>
		<div className={'flex justify-around'}>
			{die.faces.map((face, idx) => {
				return <ManaDieFaceC face={face} key={idx} highlight={idx === die.activeFaceIdx} />
			})}
		</div>
	</div>
}

function getManaSymbol (type: ManaType) {
	return <img src={'/textures/' + type + '.png'} />
	switch (type) {
		case "fire":
			return "🔥";
		case "ice":
			return "❄";
		case "nature":
			return "🌳";
		case "light":
			return "☀";
		case "dark":
			return "💀";
		case "steel":
			return "🤖";
	}
}

function ManaDieFaceC ({face, highlight}: {face: ManaDieFace, highlight: boolean}) {
	if (!face) {
		return <div>!F</div>
	}

	return <div className={'mana-die-face flex flex-wrap justify-center content-center ' + (highlight ? 'highlight' : '')}>
		{!face.globes.length && <div className={'empty-mana'}>◼</div>}
		{face.globes.map((g, idx) => {


			return <ManaIcon key={idx} type={g.type} />
		})}
	</div>
}

export function ManaIcon ({type}: ManaType) {
	return <span className={'mana-' + type}>
		{getManaSymbol(type)}
	</span>
}
