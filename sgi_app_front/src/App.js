import './App.css'
import SideBar from './components/SideBar/SideBar';
import { Outlet } from 'react-router-dom';

import { useStateContext } from './Contexts/ContextProvider';
import { Navigate } from 'react-router-dom';

function App() {

  const {user, token} = useStateContext()
  if (!token) return <Navigate to='/login' /> 

  return (
    <div id='app' className="App">
       <div className='AppGlass'>
        <SideBar/>
        <Outlet />
       </div>
    </div>
  );
}

export default App;
