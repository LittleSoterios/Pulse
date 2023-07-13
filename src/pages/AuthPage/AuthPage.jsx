import { useState } from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LoginForm/LoginForm';

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <main>
      {showLogin ? <LoginForm setUser={setUser} setShowLogin={setShowLogin} showLogin={showLogin}/> : <SignUpForm setUser={setUser} setShowLogin={setShowLogin} showLogin={showLogin} />}
    </main>
  );
}