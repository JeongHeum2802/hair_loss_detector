import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {mode === 'login' ? (
        <LoginModal
          onSignupClick={() => setMode('signup')}
          onClose={onClose}
        />
      ) : (
        <SignupModal
          onLoginClick={() => setMode('login')}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default AuthModal;
