import React, { useState } from 'react';
import OpenMap from '../components/OpenMap';
import FormSendReport from '../components/FormSendReport';
function MainPage() {
  const [location, setLocation] = useState('');

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div className="content">
        <FormSendReport/>
        <OpenMap location={location} />
    </div>
  );
}

export default MainPage;