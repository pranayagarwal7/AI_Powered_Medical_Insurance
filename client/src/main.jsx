import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, Router, RouterProvider} from "react-router-dom"
import HeroPage from './pages/HeroPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <h1>Error, page not found</h1>,
    children: [
      {
        index: true,
        element: <HeroPage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
