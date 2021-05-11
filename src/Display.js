import React, {useState, useEffect} from 'react'
import store from './store/store'
import './index.scss'

const Display = () => {
	const [list, setList] = useState(false)

	store.subscribe(() => {
		let data = store.getState().currentState
		
		for (var i=0; i < data.length; i++) {
			data[i] = <div key={i}> {data[i]} </div>
		}

		setList(data)
	})

	return (
		<div className='list-wrapper'>
			{list}
		</div>
	)
}

export default Display