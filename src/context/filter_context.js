import React, { useEffect, useContext, useReducer } from 'react'
import reducer from '../reducers/filter_reducer'
import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions';

import { useProductsContext } from './products_context';

const initialState = {
  all_products: [],
  filtered_products: [],
  grid_view: true,
  sort: 'price_lowest',
  filters: {
    text: '',
    company: 'all',
    category: 'all',
    color: 'all',
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false
  }
}

const FilterContext = React.createContext({});

export const FilterProvider = ({ children }) => {
  const { products } = useProductsContext();
  const [state, disptach] = useReducer(reducer, initialState);

  useEffect(() => {
    disptach({ type: LOAD_PRODUCTS, payload: products });
  }, [products]);

  useEffect(() => {
    disptach({ type: FILTER_PRODUCTS })
    disptach({ type: SORT_PRODUCTS });
  }, [products, state.sort, state.filters]);

  const setGridView = () => {
    disptach({ type: SET_GRIDVIEW });
  };
  const seListView = () => {
    disptach({ type: SET_LISTVIEW });
  };

  const updateSort = (e) => {
    // const name = e.target.name;
    const value = e.target.value;
    disptach({ type: UPDATE_SORT, payload: value });
  };

  const updateFilters = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === 'category') {
      value = e.target.textContent;
    }
    if (name === 'color') {
      value = e.target.dataset['color'];
    }
    if (name === 'price') {
      value = Number(value)
    }
    if (name === 'shipping') {
      value = e.target.checked
    }

    disptach({ type: UPDATE_FILTERS, payload: { name, value } });
  };

  const clearFilters = () => {
    disptach({ type: CLEAR_FILTERS });
  };

  return (
    <FilterContext.Provider value={{
      ...state,
      setGridView,
      seListView,
      updateSort,
      updateFilters,
      clearFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext);
};
