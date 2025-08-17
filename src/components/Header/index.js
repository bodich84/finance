import {useState, useEffect} from 'react'
import {useTransactions} from '../../context/TransactionsContext'
import './styles.css'
import {
  AiFillSetting,
  AiOutlineDashboard,
  AiOutlineBarChart,
  AiOutlineFundProjectionScreen,
  AiOutlineMenu,
} from 'react-icons/ai'
import UserProfile from '../UserProfileFeture'
import {Link} from 'react-router-dom'
import {Drawer, Grid} from 'antd'
import HeaderWithAddButton from '../HeaderWithAddButton'

const Header = () => {
  const {transactions} = useTransactions()

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [currentBalance, setCurrentBalance] = useState(0)

  useEffect(() => {
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach((transaction) => {
      if (transaction.type === 'income')
        totalIncome += parseFloat(transaction.amount)
      else if (transaction.type === 'expense')
        totalExpense += parseFloat(transaction.amount)
    })

    setIncome(totalIncome)
    setExpense(totalExpense)
    setCurrentBalance(totalIncome - totalExpense)
  }, [transactions])

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const {useBreakpoint} = Grid
  const screens = useBreakpoint()

  const toggleProfile = () => setIsProfileOpen((prev) => !prev)
  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  const menuItems = [
    {to: '/dashboard', icon: <AiOutlineDashboard />, label: 'Дашборд'},
    {to: '/statistics', icon: <AiOutlineBarChart />, label: 'Статистика'},
    {
      to: '/business-model',
      icon: <AiOutlineFundProjectionScreen />,
      label: 'Фін-модель',
    },
  ]

  return (
    <>
      <div className='navbar'>
        <HeaderWithAddButton />
        <div className='logo-wrap'>
          <div>₴ {currentBalance} / ₴ {income} / ₴ -{expense}</div>
        </div>

        {/* Desktop menu */}
        {screens.md ? (
          <nav className='menu'>
            {menuItems.map(({to, icon, label}) => (
              <Link key={to} to={to} title={label} className='menu-link'>
                {icon}
              </Link>
            ))}
          </nav>
        ) : (
          // Mobile menu button
          <AiOutlineMenu className='menu-btn' onClick={openDrawer} />
        )}

        {/* Settings icon */}
        <AiFillSetting className='menu-btn' onClick={toggleProfile} />
      </div>

      {/* UserProfile */}
      {isProfileOpen && <UserProfile className='profile' />}

      {/* Drawer for mobile menu */}
      <Drawer
        title='Меню'
        placement='left'
        onClose={closeDrawer}
        open={isDrawerOpen}
      >
        {menuItems.map(({to, icon, label}) => (
          <Link key={to} to={to} className='drawer-link' onClick={closeDrawer}>
            <span style={{marginRight: 8, fontSize: '18px'}}>{icon}</span>
            {label}
          </Link>
        ))}
      </Drawer>
    </>
  )
}

export default Header
