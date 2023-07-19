import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import NavBar from '../../components/NavBar/NavBar';
import HomePage from '../HomePage/HomePage';
import SearchPage from '../SearchPage/SearchPage';
import CreatePage from '../CreatePage/CreatePage';
import LikesPage from '../ActivityPage/ActivityPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import ChangeAvatarPage from '../ChangeAvatarPage/ChangeAvatarPage';
import sendRequest from '../../utilities/send-request';

export default function App(props) {
  const [userToken, setUserToken] = useState(getUser());
  const [user, setUser] = useState({displayName: '', username: '', bio: '', avatar: ''})


  useEffect(() =>{
    
    const getHistory = async () =>{
      const response = await sendRequest('/api/users/get_history')
      const data = await response
      setUser(data.settings)
      
      
    }
    
    getHistory()
  },[])
  



  return (
    <main className="App">
      { userToken ?
          <>
            <NavBar user={user} setUser={setUser} />
            <Routes>
              {/* Route components in here */}
              <Route path="/home" element={<HomePage user={user}/>} />
              <Route path="/search" element={<SearchPage user={user}/>} />
              <Route path="/create" element={<CreatePage user={user} />} />
              <Route path="/likes" element={<LikesPage/>} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} userToken={userToken} setUserToken={setUserToken} />} />
              <Route path="/avatar" element={<ChangeAvatarPage user={user} setUser={setUser} />} />
            </Routes>
          </>
          :
          
          <AuthPage setUserToken={setUserToken} />
      }
    
    </main>
  );
}
