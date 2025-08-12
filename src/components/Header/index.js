import {useState} from 'react'
import './styles.css'
import {AiFillSetting} from 'react-icons/ai'
import UserProfile from '../UserProfileFeture'
import {Link} from 'react-router-dom'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [openOrder, setIsOpenOrder] = useState(0)
  const handleOpen = () => {
    if (openOrder === 0) {
      setIsOpen(true)
      setIsOpenOrder(1)
    } else if (openOrder === 1) {
      setIsOpen(false)
      setIsOpenOrder(0)
    }
  }
  return (
    <>
      <div className='navbar'>
        <div className='logo'>TrePoїsty</div>

          <nav className="menu">
            <Link to='/dashboard'>Дашборд</Link>
            <Link to='/statistics'>Статистика</Link>
            <Link to='/business-model'>Фін-модель</Link>
          </nav>

        <AiFillSetting className='menu-btn' onClick={handleOpen} />
      </div>
      {isOpen && <UserProfile className='profile' />}
    </>
  )
}

export default Header
