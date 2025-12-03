import { Outlet } from 'react-router-dom';
import '../src/App.css'
import Navbar from './components/Navbar';
const App = () => {
    return (
      <>
        <Navbar/>
        <main>
          <Outlet />
        </main>
      </>
    )
}

export default App