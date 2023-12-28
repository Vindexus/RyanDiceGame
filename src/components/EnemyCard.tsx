import {Enemy} from "../lib/game";

type Props = {
	enemy: Enemy
}

export default function EnemyCard ({enemy}: Props) {
	return  <div className={'mb-1 border p-2 enemy-card'}>
		<span className={'enemy-name font-bold'}>{enemy.name}</span>
		<span className={'hp'}>💗{enemy.hp}/{enemy.maxHP}</span>
		<span className={'damage'}> ({enemy.damageDie}) {enemy.damageRoll ? `⚔${enemy.damageRoll}` : '...'}</span>
	</div>
}
