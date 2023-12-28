import {Enemy} from "../lib/game";
import {ReactNode} from "react";

type Props = {
	enemy: Enemy
}

export default function EnemyCard ({enemy}: Props) {
	let intent : ReactNode = '...'

	return  <div className={'mb-1 border p-2 enemy-card'}>
		<span className={'enemy-name font-bold'}>{enemy.name}</span>
		<span className={'hp'}>💗{enemy.hp}/{enemy.maxHP}</span>
		<span className={'damage'}> ({enemy.damageDie}) {enemy.damageRoll ? `⚔${enemy.damageRoll}` : '...'}</span>
	</div>
}
