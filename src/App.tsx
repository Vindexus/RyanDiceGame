import {useEffect, useState} from 'react'
import './App.css'
import {
	Game,
	newGame,
	newRound,
	rerollEnemyDice,
	rerollSelectedManaDice,
	rollEnemyDice,
	rollManaDice, assignMana
} from "./lib/game";
import EnemyCard from "./components/EnemyCard";
import CombatantHeader from "./components/CombatantHeader";
import ManaDieC, {ManaIcon} from "./components/ManaDie";
import AnimatedDice from "./components/AnimatedDice";
import {canCast} from "./lib/skill";
import Logs from "./components/Logs";
rollEnemyDice
const styles = {
	btn: `rounded bg-teal-800 text-sm px-4 py-2 bg-gray ms-1`
}

function App() {
	const [game, setGame] = useState<Game>(newGame())
	const [selectedManaDice, setSelectedManaDice] = useState<number[]>([])

	function clickManaDie (idx: number) {
		if (game.manaDice[idx].spent) {
			return
		}

		if (selectedManaDice.includes(idx)) {
			setSelectedManaDice(selectedManaDice.filter(x => {
				return x !== idx
			}))
		}
		else {
			setSelectedManaDice([
				...selectedManaDice,
				idx,
			])
		}
	}

	function clickSkill (id: string) {
		setGame(assignMana(game, id, selectedManaDice))
		setSelectedManaDice([])
	}

	useEffect(() => {
		setGame(newRound(game))
	}, [])

  return (
    <>
			<div className={'container mx-auto px-4'}>
				<header className={'w-full border p-2 flex justify-between content-center'}>
					<span className={'text-xl'}>
						Round {game.roundNumber}
					</span>
					<div>
						<button className={styles.btn} type={'button'} onClick={() => {
							if (game.enemies[0].damageRoll === null) {
								return
							}
							if (selectedManaDice.length === 0) {
								return
							}

							setGame(rerollSelectedManaDice(game, selectedManaDice))
							setSelectedManaDice([])
						}}>
							Reroll {selectedManaDice.length} Mana and Enemies
						</button>
						<button className={styles.btn} type={'button'} onClick={() => {
							setGame(newRound(game))
						}}>
							New Round
						</button>
						{/*<button className={styles.btn} type={'button'} onClick={() => {
							setGame(rerollEnemyDice(game))
						}}>
							Reroll Enemies
						</button>*/}
					</div>
				</header>
				<main className={'w-full flex flex-row'}>
					<div className={'w-2/3 mt-3 me-3 border p-2'}>
						<section>
							<h3>Enemies</h3>
							{game.enemies.map((e) => {
								return <EnemyCard enemy={e} key={e.id} />
							})}
						</section>
						<hr className={'divider'} />
						<section>
							<CombatantHeader combatant={game.player} />
						</section>
						<section>
							<h3>Mana</h3>
							<div className={'flex w-full justify-around p-2'}>
								{game.manaDice.map((md, idx) => {
									return <ManaDieC
										data-name={"mana-die"}
										die={md}
										selected={selectedManaDice.includes(idx)}
										key={idx}
										onClick={() => {
											clickManaDie(idx)
										}} />
								})}
							</div>
						</section>
						<hr className={'divider'} />
						<section>
							<h3>Skills</h3>
							{game.skills.map((skill) => {
								const {type, id, paidMana} = skill
								const castable = canCast(skill)
								return <div className={'skill my-2 border p-2 ' + (castable ? ' castable' : ' disabled')} key={id} onClick={() => {
									clickSkill(id)
								}}>
									<header>
										<h3 className={'text-lg font-bold'}>{type.name}</h3>
										<div className={'font-semibold'}>
											Cost: {skill.cost.map((m, idx) => {
												return <span className={'mana-cost'} key={idx}>
													{m === 'any' ? 'x' : <ManaIcon type={m} />}
												</span>
											})} ({skill.paidMana.length
												? skill.paidMana.map((pm, idx) => <ManaIcon type={pm} key={idx} />)
												: <em>no mana allocated</em>})
										</div>
									</header>
									<div>
										{type.description}
									</div>
								</div>
							})}
						</section>
            <hr className={'divider'} />
					</div>
					<aside className={'border p-2 w-1/3 mt-3'}>
						<Logs game={game} />
					</aside>
				</main>
			</div>
    </>
  )
}

export default App
