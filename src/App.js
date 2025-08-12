import './App.css'
import Header from './components/Header'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Statistics from './pages/Statistics'
import BusinessModel from './pages/BusinessModel'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className='App'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/statistics' element={<Statistics />} />
          <Route path='/business-model' element={<BusinessModel />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
