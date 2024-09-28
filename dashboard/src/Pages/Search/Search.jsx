import { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rating, setRating] = useState('');

  axios.defaults.withCredentials = true;
    const searchHandler = async(event) => {
        event.preventDefault()
        if(query === "" || query.length < 1){
          alert("Please enter a search")
          setResult([])
          setSearched(true)
          return
        }
        setLoading(true);
        setSearched(true);

        try {
            let req_query = `http://localhost:5000/api/trainer/search?search=${query}`;

            // Append additional filters to the query string if they exist
            if (startPrice) req_query  += `&startPrice=${startPrice}`;
            if (endPrice) req_query  += `&endPrice=${endPrice}`;
            if (startDate) req_query   += `&startDate=${startDate}`;
            if (endDate) req_query   += `&endDate=${endDate}`;
            if (rating) req_query  += `&rating=${rating}`;
            console.log(req_query )
            // Send the GET request with the query parameters
            const res = await axios.get(req_query);
            const data = await res.data;
            console.log(data);
            setResult(data);

        } catch (error) {
            // dispatch(signInFailure(error));
            console.log(error)
        }
        setLoading(false)
    }
  return (
    <div className='container'> 
      <section>
        <Box
          // component="form"
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <form onSubmit={searchHandler}>
            <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(e) => setQuery(e.target.value)}></TextField>
            
              <div className='search_input'>
                <div>
                  <input
                      type="number"
                      value={startPrice}
                      onChange={(e) => setStartPrice(e.target.value)}
                      placeholder="Start Price"
                  />
                  <input
                      type="number"
                      value={endPrice}
                      onChange={(e) => setEndPrice(e.target.value)}
                      placeholder="End Price"
                  />
                </div>
                <div>
                  <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Start Date"
                  />
                  <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End Date"
                  />
                </div>
                <input
                    type="text"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="Rating (asc/desc)"
                />
              </div>
              {/* <button onClick={handleSearch}>Search</button> */}
            <button type='submit'>Search</button> 
          </form>
        </Box>
      </section>

      <section>
      {isLoading && <div>
        <img src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif" width={300} alt="" /></div>}
      {
          !isLoading && searched &&
         (
          result.length > 0   ? 
            (
              isLoading ? "Loading....":
              (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 2fr))', justifyContent: 'center', gap: '20px', placeContent:'center', margin:'40px' }}>
                {result.map((trainer) => (
                  <div key={trainer._id} style={cardStyle}>
                    <h3>{trainer.name}</h3>
                    <p><strong>Trainer ID:</strong> {trainer.trainerId}</p>
                    <p><strong>Type:</strong> {trainer.type_of_trainer}</p>
                    <p><strong>Email:</strong> {trainer.contact_Details.email_id}</p>
                    <p><strong>Mobile:</strong> {trainer.contact_Details.mobile_number}</p>
                    <p><strong>NDA Accepted:</strong> {trainer.nda_Accepted ? 'Yes' : 'No'}</p>
                    <p><strong>Available Dates:</strong> {trainer.availableDate.map((date, index) => (
                      <span key={index}>
                        {new Date(date.startDate).toLocaleDateString()} - {new Date(date.endDate).toLocaleDateString()}
                      </span>
                    ))}
                    </p>
                    <p><strong>Resume:</strong></p>
                    <ul>
                      {trainer.resume_details?.professionalSummary.length > 0 && (
                        <li><strong>Professional Summary:</strong> {trainer.resume_details.professionalSummary.join(', ')}</li>
                      )}
                      {trainer.resume_details?.technicalSkills.length > 0 && (
                        <li><strong>Technical Skills:</strong> {trainer.resume_details.technicalSkills.join(', ')}</li>
                      )}
                      {trainer.resume_details?.careerHistory.length > 0 && (
                        <li><strong>Career History:</strong> {trainer.resume_details.careerHistory.join(', ')}</li>
                      )}
                      {trainer.resume_details?.certifications.length > 0 && (
                        <li><strong>Certifications:</strong> {trainer.resume_details.certifications.join(', ')}</li>
                      )}
                      {trainer.resume_details?.clientele.length > 0 && (
                        <li><strong>clientele:</strong> {trainer.resume_details.clientele.join(', ')}</li>
                      )}
                      {trainer.resume_details?.education.length > 0 && (
                        <li><strong>Education:</strong> {trainer.resume_details.education.join(', ')}</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
              ) 
            )
          
          : <div>No Search Found</div>
         )
        
      }
      </section>

    </div>
  )
}

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  width: '400px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'left',
  backgroundColor: '#f9f9f9'
};

export default Search
