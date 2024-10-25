import './App.css'
import Dashboard from './components/Dashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard/>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
