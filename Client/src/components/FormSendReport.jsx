import React, { useState } from 'react';

function FormSendReport({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [postedDate, setPostedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
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
      const response = await fetch('http://10.144.112.60:3000/api/police-news/incidents/upload', {
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
      setPostedDate(new Date().toISOString().split('T')[0]);
      setIncidentDescription('');
      setIncidentDate('');
      setLocation('');
      onSuccess(location); 
    } catch (error) {
      console.error('Error submitting incident report:', error);
    }
  };

  return (
    <div className="form-send-report" style={{ marginBottom: '30px' }}>
      <h2>Submit Incident Report</h2>
      <form onSubmit={handleSubmit}>
          <table style={{ width: '800px' }}>
        <tbody>
              <tr style={{ width: '800px' }}>
              <td>
                <label>
                  Title:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>
              </td>
              <td>
              <label>
                  Incident Description
                  <input
                    type="text"
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    required
                  />
                </label>
              </td>
              <td>
                <label>
                  Posted Date:
                  <input 
                    type="date" 
                    name="postedDate" 
                    value={postedDate} 
                    onChange={(e) => setPostedDate(e.target.value)} 
                  />
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  Location:
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </label>
              </td>
            <td>
              <label>
                Incident Date:
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                />
              </label>
            </td>
            <td>
              <button type="submit">Submit</button>
            </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default FormSendReport;
