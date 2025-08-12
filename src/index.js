import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {TransactionsProvider} from './context/TransactionsContext'
import {ExpenseCategoriesProvider} from './context/ExpenseCategoriesContext'
import "./index.css";
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// serviceWorkerRegistration.register();

ReactDOM.render(
  <React.StrictMode>
    <ExpenseCategoriesProvider>
    <TransactionsProvider>
      <App />
    </TransactionsProvider>
    </ExpenseCategoriesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
