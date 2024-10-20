import { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Slider from '@mui/material/Slider';


function Search() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rating, setRating] = useState('asc');
  console.log(rating)
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
        // http://localhost:5000/api/trainer/search?price[lte]=5000&price[gte]=200&domain=PMP
        try {
            let req_query = `http://localhost:5000/api/trainer/search?domain=${query}`;

            // Append additional filters to the query string if they exist
            if (startPrice) req_query  += `&price[gte]=${startPrice}`;
            if (endPrice) req_query  += `&price[lte]=${endPrice}`;
            // if (startDate) req_query   += `&startDate=${startDate}`;
            // if (endDate) req_query   += `&endDate=${endDate}`;
            // if (rating) req_query  += `&rating=${rating}`;
            console.log(req_query)
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
          <form onSubmit={searchHandler} style={{width:"70vw"}}>
            <TextField id="outlined-basic" label="Search Trainers by domain" variant="outlined" onChange={(e) => setQuery(e.target.value)} style={{width:"60vw", borderRadius:"40px"}}></TextField>
            
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
                <div>
                <Box sx={{ width: 150 }}>
                  <label htmlFor="">Rating</label>
                  <Slider
                    size="small"
                    defaultValue={8}
                    aria-label="Small" name="rating"
                    min={0}
                    max={10}
                    onChange={(e) => setRating(Number(e.target.value))}
                    valueLabelDisplay="auto"
                  />
                  </Box>
                  {/* <input type="range" name="rating" id="" min={0} max={10} onChange={(e) => setRating(Number(e.target.value))} /> */}
                  {/* <label htmlFor="">Rating</label> */}
                  {/* <input
                    type="text"
                    value={rating}
                    max="10"
                    onChange={(e) => setRating(Number(e.target.value))}
                /> */}
                  {/* <select name="rating" id="" onChange={(e) => setRating(Number(e.target.value))}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>

                  </select> */}
                </div>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 2fr))', justifyContent: 'center', gap: '20px', placeContent:'center', margin:'40px' }}>
                {result.map((trainer) => (
                  <div key={trainer._id} style={cardStyle}>
                    <h3>{trainer.generalDetails.name}</h3>
                    <p><strong>Trainer Email:</strong> {trainer.generalDetails.email}</p>

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
