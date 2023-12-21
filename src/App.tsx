import { useState } from 'react'
import './App.css'
import {Game, newGame, rerollEnemyDice, rollEnemyDice, rollManaDice} from "./lib/game";
import EnemyCard from "./components/EnemyCard";
import CombatantHeader from "./components/CombatantHeader";
import ManaDieC from "./components/ManaDie";
rollEnemyDice
const styles = {
	btn: `btn text-sm border-gray px-2 py-1 bg-gray`
}

function App() {
	const [game, setGame] = useState<Game>(newGame())
  return (
    <>
			<div className={'container mx-auto px-4'}>
				<header className={'w-full border p-2 text-xl flex justify-between'}>
					<div>
						Game!
					</div>
					<div>
						<button className={styles.btn} type={'button'} onClick={() => {
							setGame(rollManaDice(game))
						}}>
							Roll Mana Dice
						</button>
						<button className={styles.btn} type={'button'} onClick={() => {
							setGame(rollEnemyDice(game))
						}}>
							New Enemy Attacks
						</button>
						<button className={styles.btn} type={'button'} onClick={() => {
							setGame(rerollEnemyDice(game))
						}}>
							Reroll Enemies
						</button>
					</div>
				</header>
				<main className={'w-full flex flex-row'}>
					<div className={'w-2/3 mt-3 me-3 border p-2'}>
						<section>
							<h3 className={'font-bold text-lg'}>Enemies</h3>
							{game.enemies.map((e) => {
								return <EnemyCard enemy={e} key={e.id} />
							})}
						</section>
						<hr className={'my-4'} />
						<section>
							<CombatantHeader combatant={game.player} />
						</section>
						<section>
							<div className={'flex w-full justify-around p-2'}>
								{game.manaDice.map((md, idx) => {
									return <ManaDieC die={md} key={idx} />
								})}
							</div>
						</section>
					</div>
					<aside className={'border p-2 w-1/3 mt-3'}>
						<h3 className={'text-lg'}>Logs</h3>
						{game.logs.map((l, i) => {
							return <p key={i}>{l}</p>
						})}
					</aside>
				</main>
			</div>
    </>
  )
}

export default App
