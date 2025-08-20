import {useState, useEffect, useMemo} from 'react'
import {useTransactions} from '../../context/TransactionsContext'
import {useAccounts} from '../../context/AccountsContext'
import './styles.css'
import {
  AiFillSetting,
  AiOutlineDashboard,
  AiOutlineBarChart,
  AiOutlineFundProjectionScreen,
  AiOutlineMenu,
  AiOutlineSetting,
} from 'react-icons/ai'
import UserProfile from '../UserProfileFeture'
import {Link} from 'react-router-dom'
import {Drawer, Grid} from 'antd'
import HeaderWithAddButton from '../HeaderWithAddButton'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../../firebase'

const Header = () => {
  const {transactions} = useTransactions()
  const {accounts} = useAccounts()
  const [user] = useAuthState(auth)

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [dividend, setDividend] = useState(0)
  const [investment, setInvestment] = useState(0)
  const [currentBalance, setCurrentBalance] = useState(0)

  useEffect(() => {
    let totalIncome = 0
    let totalExpense = 0
    let totalDividend = 0
    let totalInvestment = 0

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') totalIncome += parseFloat(transaction.amount)
      else if (transaction.type === 'expense') totalExpense += parseFloat(transaction.amount)
      else if (transaction.type === 'dividend') totalDividend += parseFloat(transaction.amount)
      else if (transaction.type === 'investment') totalInvestment += parseFloat(transaction.amount)
    })

    setIncome(totalIncome)
    setExpense(totalExpense)
    setDividend(totalDividend)
    setInvestment(totalInvestment)
    setCurrentBalance(totalIncome - totalExpense - totalDividend + totalInvestment)
  }, [transactions])

  const accountBalances = useMemo(() => {
    const balances = {}
    transactions.forEach((t) => {
      const amt = parseFloat(t.amount)
      if (!Number.isFinite(amt) || !t.account) return
      if (t.type === 'income' || t.type === 'investment')
        balances[t.account] = (balances[t.account] || 0) + amt
      else if (t.type === 'expense' || t.type === 'dividend')
        balances[t.account] = (balances[t.account] || 0) - amt
    })
    return balances
  }, [transactions])

  const accountNames = useMemo(() => {
    const names = new Set([
      ...accounts.map((a) => a.name),
      ...Object.keys(accountBalances),
    ])
    return Array.from(names)
  }, [accounts, accountBalances])

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
    { to: '/settings', icon: <AiOutlineSetting />, label: 'Налаштування' },
  ]

  if (!user) return null

  return (
    <>
      <div className='navbar'>
        <HeaderWithAddButton />
        <div className='logo-wrap'>
          <div>
            ₴ {currentBalance} / ₴ {income} / ₴ -{expense} / Дивіденди ₴ -{dividend} /
            Інвестиції ₴ {investment}
          </div>
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

      <div className='account-balances container'>
        {accountNames.map((name) => (
          <div key={name}>
            {name}: ₴{' '}
            {(accountBalances[name] || 0).toLocaleString('uk-UA', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ))}
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
