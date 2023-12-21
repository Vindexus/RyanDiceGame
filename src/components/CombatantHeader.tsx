import {Combatant} from "../lib/game";

type Props = {
	combatant: Combatant
}

export default function CombatantHeader ({combatant}: Props) {
	return  <header>
		<h3 className={'font-bold'}>{combatant.name}</h3>
		<div>Health: {combatant.hp}/{combatant.maxHP}</div>
	</header>
}
