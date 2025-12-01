import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, Router, RouterProvider} from "react-router-dom"
import HeroPage from './pages/HeroPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import QuotePage from './pages/QuotePage.jsx'
import ResultsPage from './components/ResultsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <h1>Error, page not found</h1>,
    children: [
      {
        index: true,
        element: <HeroPage/>
      },
      {
        path: "/signup",
        element: <SignupPage/>
      },
      {
        path: "/login",
        element: <LoginPage/>
      },
      {
        path: "/about",
        element: <AboutPage/>
      },
      {
        path: "/quote",
        element: <QuotePage/>
      },
      {
        path: "/results",
        element: <ResultsPage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
