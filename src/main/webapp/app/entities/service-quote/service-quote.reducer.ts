import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IServiceQuote, defaultValue } from 'app/shared/model/service-quote.model';

export const ACTION_TYPES = {
  SEARCH_SERVICEQUOTES: 'serviceQuote/SEARCH_SERVICEQUOTES',
  FETCH_SERVICEQUOTE_LIST: 'serviceQuote/FETCH_SERVICEQUOTE_LIST',
  FETCH_SERVICEQUOTE: 'serviceQuote/FETCH_SERVICEQUOTE',
  CREATE_SERVICEQUOTE: 'serviceQuote/CREATE_SERVICEQUOTE',
  UPDATE_SERVICEQUOTE: 'serviceQuote/UPDATE_SERVICEQUOTE',
  DELETE_SERVICEQUOTE: 'serviceQuote/DELETE_SERVICEQUOTE',
  SET_BLOB: 'serviceQuote/SET_BLOB',
  RESET: 'serviceQuote/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IServiceQuote>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ServiceQuoteState = Readonly<typeof initialState>;

// Reducer

export default (state: ServiceQuoteState = initialState, action): ServiceQuoteState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_SERVICEQUOTES):
    case REQUEST(ACTION_TYPES.FETCH_SERVICEQUOTE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SERVICEQUOTE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SERVICEQUOTE):
    case REQUEST(ACTION_TYPES.UPDATE_SERVICEQUOTE):
    case REQUEST(ACTION_TYPES.DELETE_SERVICEQUOTE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_SERVICEQUOTES):
    case FAILURE(ACTION_TYPES.FETCH_SERVICEQUOTE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SERVICEQUOTE):
    case FAILURE(ACTION_TYPES.CREATE_SERVICEQUOTE):
    case FAILURE(ACTION_TYPES.UPDATE_SERVICEQUOTE):
    case FAILURE(ACTION_TYPES.DELETE_SERVICEQUOTE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_SERVICEQUOTES):
    case SUCCESS(ACTION_TYPES.FETCH_SERVICEQUOTE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SERVICEQUOTE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SERVICEQUOTE):
    case SUCCESS(ACTION_TYPES.UPDATE_SERVICEQUOTE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SERVICEQUOTE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/service-quotes';
const apiSearchUrl = 'api/_search/service-quotes';

// Actions

export const getSearchEntities: ICrudSearchAction<IServiceQuote> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_SERVICEQUOTES,
  payload: axios.get<IServiceQuote>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IServiceQuote> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_SERVICEQUOTE_LIST,
  payload: axios.get<IServiceQuote>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IServiceQuote> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SERVICEQUOTE,
    payload: axios.get<IServiceQuote>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IServiceQuote> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SERVICEQUOTE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IServiceQuote> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SERVICEQUOTE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IServiceQuote> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SERVICEQUOTE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
