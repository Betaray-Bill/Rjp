import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchDomain: "",
    domainResults: [],
    isSearching: false
};

const searchTrainerSlice = createSlice({
    name: 'searchTrainer',
    initialState,
    reducers: {
        setSearchDomain: (state, action) => {
            state.searchDomain = action.payload;
        },
        setIsSearching: (state, action) => {
            state.isSearching = action.payload;
        },
        setDomainResults: (state, action) => {
            state.domainResults = action.payload;
        },
        resetDomainResultsAndSearch: (state) => {
            state.domainResults = [];
            state.searchDomain = "";
        }
    },
});

export const {
    setSearchDomain,
    setDomainResults,
    setIsSearching,
    resetDomainResultsAndSearch
} = searchTrainerSlice.actions;

export default searchTrainerSlice.reducer;