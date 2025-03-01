import React, { useState } from 'react';

function FormSendReport() {
  const [title, setTitle] = useState('');
  const [postedDate, setPostedDate] = useState('');
  const [incidentNumber, setIncidentNumber] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incidentReport = {
      title,
      posted_date: postedDate,
      incident_number: incidentNumber,
      incident_date: incidentDate,
      location
    };

    try {
      const response = await fetch('http://localhost:3000/api/incidents/upload', {
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
      setIncidentNumber('');
      setIncidentDate('');
      setLocation('');
    } catch (error) {
      console.error('Error submitting incident report:', error);
    }
  };

  return (
    <div className="form-send-report">
      <h2>Submit Incident Report</h2>
      <form onSubmit={handleSubmit}>
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
          Posted Date:
          <input
            type="date"
            value={postedDate}
            onChange={(e) => setPostedDate(e.target.value)}
            required
          />
        </label>
        <label>
          Incident Number:
          <input
            type="text"
            value={incidentNumber}
            onChange={(e) => setIncidentNumber(e.target.value)}
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
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormSendReport;