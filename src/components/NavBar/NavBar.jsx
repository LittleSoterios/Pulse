import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';

import './NavBar.css'

import Home from '../../public/home/icons8-home-48.svg'
import Search from '../../public/binoculars/icons8-binoculars-48.svg'
import Sun from '../../public/sun/icons8-sun-48.svg'
import Create from '../../public/plus/icons8-plus-48.svg'
import Pulse from '../../public/Pulse-Logo.svg'



export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <footer>
      <nav className=''>
        <Link to="/home"><img className='icon' src={ Home } alt='home'/></Link>
        
        <Link to="/search"><img className='icon' src={ Search } alt='search'/></Link>
        <Link to="/create"><img className='icon' src={ Create } alt='create'/></Link>
        
        <Link to="/likes"><img className='icon' src={ Sun } alt='sun'/></Link>
        <Link to="/profile"><img className='icon' src={ Pulse } alt='pulse'/></Link>
        
        {/* <span>Welcome, {user.name}</span> */}
        {/* <Link to="" onClick={handleLogOut}>Log Out</Link> */}
      </nav>
    </footer>
  );
}