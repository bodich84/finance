import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {TransactionsProvider} from './context/TransactionsContext'
import {ExpenseCategoriesProvider} from './context/ExpenseCategoriesContext'
import {DateRangeProvider} from './context/DateRangeContext'
import {AccountsProvider} from './context/AccountsContext'
import './index.css'
import {register} from './serviceWorkerRegistration'

register()

ReactDOM.render(
  <React.StrictMode>
    <ExpenseCategoriesProvider>
      <TransactionsProvider>
        <DateRangeProvider>
          <AccountsProvider>
            <App />
          </AccountsProvider>
        </DateRangeProvider>
      </TransactionsProvider>
    </ExpenseCategoriesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
