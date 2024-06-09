import './styles/button.css'

type Props = {
  title: string
  onClick: () => void
}

const Button = ({ title, onClick }: Props) => {
  return (
    <button className="start-game-button" onClick={onClick}>
      {title}
    </button>
  )
}

export default Button
