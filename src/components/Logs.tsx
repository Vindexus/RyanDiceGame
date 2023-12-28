import {AnimatePresence, motion} from "framer-motion"
import {Game} from "../lib/game";

type Props = {
	game: Game
}
export default function Logs (props: Props) {
	const game = props.game

	return <>
		<h3 className={'text-lg'}>Logs</h3>
		<div className={'relative'}>
			<AnimatePresence initial={false}>
				{game.logs.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: index * 20 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{ duration: 0.25, delay: (0.5 - (index * 0.5)) }}
						style={{position: 'absolute'}}
					>
						{item.text}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	</>
}
