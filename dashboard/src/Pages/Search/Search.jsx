import SearchBar from '@/Layout/Search/SearchBar';
import SearchResult from '@/Layout/Search/SearchResult';
import { useSelector } from 'react-redux';


function Search() {
  const {domainResults, isSearching} = useSelector(state => state.searchTrainer)
  
  
  return (
    <div className='main-container'> 
      {/* Main Container */}
      <div className='w-max p-4 grid place-content-center'>
        {/* Search Component */}
        <SearchBar />
        {/* Result COntainer */}
        {
          domainResults?.length > 0 && <SearchResult />
        }
      </div>
    </div>
  )
}

export default Search

