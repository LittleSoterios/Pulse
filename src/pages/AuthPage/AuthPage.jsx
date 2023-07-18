import { useState } from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LoginForm/LoginForm';

export default function AuthPage({ setUserToken }) {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <main>
      {showLogin ? <LoginForm setUserToken={setUserToken} setShowLogin={setShowLogin} showLogin={showLogin}/> : <SignUpForm setUserToken={setUserToken} setShowLogin={setShowLogin} showLogin={showLogin} />}
    </main>
  );
}