import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';

import './NavBar.css'

import Home from '../../public/home/icons8-home-48.svg'
import Search from '../../public/binoculars/icons8-binoculars-48.svg'
import Sun from '../../public/sun/icons8-sun-48.svg'
import Create from '../../public/plus/icons8-plus-48.svg'
import Pulse from '../../public/Pulse-Logo.svg'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom/dist';



export default function NavBar({ user, setUser }) {

  const location = useLocation()
  const [page, setPage] = useState(location)
  
  useEffect(()=>{
    
    setPage(location.pathname)
    

  }, [location])

  return (
    <footer>
      <nav className='nav'>
        <Link to="/home"><img className='icon' src={ Home } alt='home'  style ={(page ==='/home') ? {filter: 'invert(1)'} : {}} /></Link>
        
        <Link to="/search"><img className='icon' src={ Search } alt='search'  style ={(page ==='/search') ? {filter: 'invert(1)'} : {}}/></Link>

        <Link to="/create"><img className='icon' src={ Create } alt='create'  style ={(page ==='/create') ? {filter: 'invert(1)'} : {}}/></Link>
        
        <Link to="/likes"><img className='icon' src={ Sun } alt='sun'  style ={(page ==='/likes') ? {filter: 'invert(1)'} : {}}/></Link>

        <Link to="/profile"><img className='icon' src={ Pulse } alt='pulse' style ={(page ==='/profile') ? {filter: 'invert(1)'} : {}}/></Link>
        
        {/* <span>Welcome, {user.name}</span> */}
        {/* <Link to="" onClick={handleLogOut}>Log Out</Link> */}
      </nav>
    </footer>
  );
}