import React from 'react';
import styled from 'styled-components';
import { backgroundColor2, fontSize2 } from '../Shared/Styles';
import { AppContext } from '../App/AppProvider';
import _ from 'lodash';
import fuzzy from 'fuzzy';

export default function() {
  return (
    <AppContext.Consumer>
      {({setFilteredCoins, coinList}) => (
        <SearchGrid>
          <h2>Search all coins</h2>
          <SearchInput onKeyUp={(e) => filteredCoins(e, setFilteredCoins, coinList)}/>
        </SearchGrid>
      )}
    </AppContext.Consumer>
  );
}

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
`;

const SearchInput = styled.input`
  ${backgroundColor2}
  ${fontSize2}
  border: 1px solid;
  height: 25px;
  color: #1163c9;
  place-self: center left;
`;

const handleFilter = _.debounce((inputValue, coinList, setFilterCoins) => {
  // Get all the coin symbols
  let coinSymbols = Object.keys(coinList);
  // Get all the coin names, map symbol to name
  let coinNames = coinSymbols.map(sym => coinList[sym].CoinName);
  let allStringToSearch = coinSymbols.concat(coinNames);
  let fuzzyResults = fuzzy
    .filter(inputValue, allStringToSearch, {})
    .map(result => result.string);
    
  let filteredCoins = _.pickBy(coinList, (result, symKey) => {
    let coinName = result.CoinName;
    return (_.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName));
  });
  console.log(filteredCoins);
  setFilterCoins(filteredCoins);
}, 500);

function filteredCoins(e, setFilterCoins, coinList) {
  let inputValue = e.target.value;
  if ( ! inputValue ) {
    setFilterCoins(null);
  }

  handleFilter(inputValue, coinList, setFilterCoins);
}
