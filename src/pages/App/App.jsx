import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import NewOrderPage from '../NewOrderPage/NewOrderPage';
import OrderHistoryPage from '../OrderHistoryPage/OrderHistoryPage';
import NavBar from '../../components/NavBar/NavBar';
import HomePage from '../HomePage/HomePage';
import SearchPage from '../SearchPage/SearchPage';
import CreatePage from '../CreatePage/CreatePage';
import LikesPage from '../ActivityPage/ActivityPage';
import ProfilePage from '../ProfilePage/ProfilePage';

export default function App(props) {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      { user ?
          <>
            <NavBar user={user} setUser={setUser} />
            <Routes>
              {/* Route components in here */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/create" element={<CreatePage user={user} />} />
              <Route path="/likes" element={<LikesPage/>} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    
    </main>
  );
}
