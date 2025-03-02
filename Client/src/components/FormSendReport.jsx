import React, { useState } from 'react';

function FormSendReport() {
  const [title, setTitle] = useState('');
  const [postedDate, setPostedDate] = useState(() => {
    // Calculated only once when component is initialized
    return new Date().toISOString().split('T')[0];
  });
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [location, setLocation] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    const incidentReport = {
      title,
      posted_date: postedDate,
      incident_description: incidentDescription,
      incident_date: incidentDate,
      location
    };

    try {
      const response = await fetch('http://10.144.112.60/api/incidents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(incidentReport)
      });

      if (!response.ok) {
        throw new Error('Failed to submit incident report');
      }

      const result = await response.json();
      console.log('Incident report submitted:', result);

      // Clear form fields
      setTitle('');
      setPostedDate('');
      setIncidentDescription('');
      setIncidentDate('');
      setLocation('');
    } catch (error) {
      console.error('Error submitting incident report:', error);
    }
  };

  return (
    <div className="form-send-report" style={{ marginBottom: '30px' }}>
      <h2>Submit Incident Report</h2>
      <form onSubmit={handleSubmit}>
        <table style={{width: '800px', }}>
          <tr style={{width: '800px', }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Incident Description
            <input
              type="text"
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Posted Date:
            <input 
              type="date" 
              name="postedDate" 
              value={postedDate} 
              onChange={(e) => setPostedDate(e.target.value)} 
            />
          </label>
          </tr>
          <tr>
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
          <label>
            Incident Date:
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              required
            />
          </label>

          <button type="submit">Submit</button>
          </tr>
        </table>
      </form>
    </div>
  );
}

export default FormSendReport;