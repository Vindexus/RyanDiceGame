import {ManaDie, ManaDieFace, ManaType} from "../lib/mana";

type ManaDieProps = {
	die: ManaDie
}

export default function ManaDieC (props: ManaDieProps) {
	const {die} = props
	const active = die.activeFaceIdx >= 0 ? die.faces[die.activeFaceIdx] : null
	return <div className={'w-32 h-32 border flex flex-col justify-between'}>
		<div className={'h-2/3 flex justify-center align-center'} style={{fontSize: '55px'}}>
			{active ? <ManaDieFaceC face={active} /> : <>&nbsp;</>}
		</div>
		<div className={'flex justify-around'}>
			{die.faces.map((face, idx) => {
				return <ManaDieFaceC face={face} key={idx} />
			})}
		</div>
	</div>
}

function getManaSymbol (type: ManaType) {
	switch (type) {
		case "fire":
			return "🔥";
		case "ice":
			return "❄";
		case "nature":
			return "🌳";
		case "light":
			return "☀";
	}
}

function ManaDieFaceC ({face}: {face: ManaDieFace}) {
	return <div className={'flex flex-wrap justify-center content-center'}>
		{!face.globes.length && <div className={'empty-mana'}>◼</div>}
		{face.globes.map((g, idx) => {


			return <span key={idx} className={'mana-' + g.type}>
				{getManaSymbol(g.type)}
				{g.number !== 1 ? `x${g.number}` : ''}
			</span>
		})}
	</div>
}
