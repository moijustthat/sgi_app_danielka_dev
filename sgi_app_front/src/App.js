import { useEffect } from 'react';
import './App.css'
import './Fonts.css'
import SideBar from './components/SideBar/SideBar';
import { Outlet } from 'react-router-dom';

import { useStateContext } from './Contexts/ContextProvider';
import { Navigate } from 'react-router-dom';

function App() {

  useEffect(() => {
    const preventNavigationGestures = (event) => {
        if (event.deltaX !== 0 && Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            event.stopImmediatePropagation();
        }
    };

    window.addEventListener('wheel', preventNavigationGestures, { passive: false });

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            event.stopImmediatePropagation();
        }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
        window.removeEventListener('wheel', preventNavigationGestures);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
    };
}, []);


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
