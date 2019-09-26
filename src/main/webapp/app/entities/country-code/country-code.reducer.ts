import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICountryCode, defaultValue } from 'app/shared/model/country-code.model';

export const ACTION_TYPES = {
  SEARCH_COUNTRYCODES: 'countryCode/SEARCH_COUNTRYCODES',
  FETCH_COUNTRYCODE_LIST: 'countryCode/FETCH_COUNTRYCODE_LIST',
  FETCH_COUNTRYCODE: 'countryCode/FETCH_COUNTRYCODE',
  CREATE_COUNTRYCODE: 'countryCode/CREATE_COUNTRYCODE',
  UPDATE_COUNTRYCODE: 'countryCode/UPDATE_COUNTRYCODE',
  DELETE_COUNTRYCODE: 'countryCode/DELETE_COUNTRYCODE',
  RESET: 'countryCode/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICountryCode>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CountryCodeState = Readonly<typeof initialState>;

// Reducer

export default (state: CountryCodeState = initialState, action): CountryCodeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_COUNTRYCODES):
    case REQUEST(ACTION_TYPES.FETCH_COUNTRYCODE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_COUNTRYCODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_COUNTRYCODE):
    case REQUEST(ACTION_TYPES.UPDATE_COUNTRYCODE):
    case REQUEST(ACTION_TYPES.DELETE_COUNTRYCODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_COUNTRYCODES):
    case FAILURE(ACTION_TYPES.FETCH_COUNTRYCODE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_COUNTRYCODE):
    case FAILURE(ACTION_TYPES.CREATE_COUNTRYCODE):
    case FAILURE(ACTION_TYPES.UPDATE_COUNTRYCODE):
    case FAILURE(ACTION_TYPES.DELETE_COUNTRYCODE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_COUNTRYCODES):
    case SUCCESS(ACTION_TYPES.FETCH_COUNTRYCODE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_COUNTRYCODE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_COUNTRYCODE):
    case SUCCESS(ACTION_TYPES.UPDATE_COUNTRYCODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_COUNTRYCODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/country-codes';
const apiSearchUrl = 'api/_search/country-codes';

// Actions

export const getSearchEntities: ICrudSearchAction<ICountryCode> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_COUNTRYCODES,
  payload: axios.get<ICountryCode>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<ICountryCode> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_COUNTRYCODE_LIST,
  payload: axios.get<ICountryCode>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICountryCode> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_COUNTRYCODE,
    payload: axios.get<ICountryCode>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICountryCode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_COUNTRYCODE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICountryCode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_COUNTRYCODE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICountryCode> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_COUNTRYCODE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
