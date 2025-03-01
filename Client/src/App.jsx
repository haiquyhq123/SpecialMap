import React, { useState } from 'react';
import OpenMap from './components/OpenMap';
import SearchingInformationPanel from './components/SearchingInformationPanel';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
  };

  const handleLogin = (username, password) => {
    // Verify login credentials
    if (userData && userData.username === username && userData.password === password) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = (data) => {
    setUserData(data);
    setIsRegistering(false);
    setIsLoggedIn(true);
  };

  return (
    <div className="main-container">
      {!isLoggedIn ? (
        isRegistering ? (
          <Register onRegister={handleRegister} />
        ) : (
          <Login onLogin={handleLogin} onRegister={() => setIsRegistering(true)} />
        )
      ) : (
        <div className="content">
          <button className="incident-report-button">Send Incident Report</button>
          <div className="panels">
            <SearchingInformationPanel onSearch={handleSearch} />
            <OpenMap location={location} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;