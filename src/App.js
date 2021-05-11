import React, {useState, useEffect} from 'react'
import store from './store/store'
import action_add_new_value from './store/actions/action_add_new_value'
import action_delete_value from './store/actions/action_delete_value'
import action_move_value from './store/actions/action_move_value'
import './index.scss'
import Display from './Display'

function uniq_arr(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}


function isEmpty(value) {
    return Boolean(value && typeof value === 'object') && !Object.keys(value).length;
}


function App() {
  const [time, setTime] = useState(0)
  const [data, setData] = useState(false)
  const [stateOfFetch, setStateOfFetch] = useState('Загрузка')
  const [structuredArr, setStructuredArr] = useState(false)
  let checkedList = []

  const handleChangeCheckbox = (a) => {

    checkedList.unshift(a)
    store.dispatch( action_add_new_value(checkedList) )

  }

  const misclickCheckbox = (a) => {
    
    for (var i = 0; i< checkedList.length; i++) {
      if (a == checkedList[i]) { checkedList.splice(i, 1); break }
    }
    
    store.dispatch( action_add_new_value(checkedList))

  }

  const cleanState = () => {
    store.dispatch( action_delete_value('') )
    createSelect(structuredArr)
  }

  const moveState = (val) => {
    store.dispatch( action_move_value(val))
  }


  const smoothArr = (arr) => {
    let result = []

    for (var i = 0; i < arr.length; i++) {

      if ( !(arr[i] instanceof Array) ) {
        result.push( arr[i] )
      } else {
        result = [ ...result, ...smoothArr(arr[i]) ]
      }

    }

    return result 
  }


  const toStructureArr = (arr) => {
    let result = []
    let types = []

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== null) {
        types.push(typeof arr[i])
      }
    }

    types = uniq_arr(types);

    for (var i = 0; i< types.length; i++) {
      result.push([])
    }

    for (var i = 0; i < arr.length; i++) {
      for (var k = 0; k < types.length; k++) {
        if ((typeof arr[i] == types[k]) && (arr[i] !== null) && (!isEmpty(arr[i])) ) {
          result[k].push(arr[i])
          break
        }
      }
    }

    for (var i = 0; i < result.length; i++) {
      if (result[i][0] == undefined) {
        delete result[i]
        --result.length
      }
      
    }

    return result
  }

  const createSelect = (arr) => {
    let result = []

    for (var i = 0; i < arr.length; i++) {
      let options = []

      // код ниже - стандартный способ создания селекта со множественным выбором, 
      //однако он мало подходит для выполнения данного задания, 
      //поэтому я позволил себе использовать input type=checkbox

      for (var k = 0; k < arr[i].length; k++) {
        options.push(<label key={k}><input type='checkbox' value={arr[i][k]} onChange={ (e) => { if (e.target.checked ) { handleChangeCheckbox(e.target.value)} else {misclickCheckbox(e.target.value)}} } />{arr[i][k]}</label>)
      }
      result[i] = <div key={i} className='option-wrapper'>{options}</div>


    }

    setData(result)
  }

  const getData = () => {
    const timeBefore = Date.now()

    try {
      return fetch('https://raw.githubusercontent.com/WilliamRu/TestAPI/master/db.json')
        .then( res => { return res.json() })
        .then( obj => {

          setTime("Загружено за " + (Date.now() - timeBefore) + " миллисекунды")

          let smoothArray = smoothArr(obj.testArr) //задание 2

          let structuredArr = toStructureArr(smoothArray) // задание 3
          setStructuredArr(structuredArr )

          setStateOfFetch('Готово')
            
          createSelect(structuredArr)
          
        })
        .catch( () => setStateOfFetch('Ошибка'))


    } catch (e) {
      setStateOfFetch('Ошибка')
    }
  }

  useEffect(()=> {

    getData()

  }, [])

  return (
    <div  className="App">
      <p>{stateOfFetch}</p>
      <p>{time}</p>
      <div className='select-wrapper' >
        {data}
      </div>

      <div className='control-panel-wrapper'>
        <button onClick={ () => { moveState('back') } }>Назад</button>
        <button onClick={ () => { moveState('next') } }>Вперёд</button>
        <button onClick={ () => {cleanState()}}>Очистить</button>
      </div>
      <Display />
    </div>
  );
}

export default App;
