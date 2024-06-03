import { CellOptions } from '../types'
import './styles/cell.css'

type Props = {
    type: CellOptions
}

const Cell = ({type}: Props) => {
  return (
    <div className={`cell ${type}`}/>
  )
}

export default Cell