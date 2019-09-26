import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISeal, defaultValue } from 'app/shared/model/seal.model';

export const ACTION_TYPES = {
  SEARCH_SEALS: 'seal/SEARCH_SEALS',
  FETCH_SEAL_LIST: 'seal/FETCH_SEAL_LIST',
  FETCH_SEAL: 'seal/FETCH_SEAL',
  CREATE_SEAL: 'seal/CREATE_SEAL',
  UPDATE_SEAL: 'seal/UPDATE_SEAL',
  DELETE_SEAL: 'seal/DELETE_SEAL',
  RESET: 'seal/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISeal>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type SealState = Readonly<typeof initialState>;

// Reducer

export default (state: SealState = initialState, action): SealState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_SEALS):
    case REQUEST(ACTION_TYPES.FETCH_SEAL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SEAL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SEAL):
    case REQUEST(ACTION_TYPES.UPDATE_SEAL):
    case REQUEST(ACTION_TYPES.DELETE_SEAL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_SEALS):
    case FAILURE(ACTION_TYPES.FETCH_SEAL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SEAL):
    case FAILURE(ACTION_TYPES.CREATE_SEAL):
    case FAILURE(ACTION_TYPES.UPDATE_SEAL):
    case FAILURE(ACTION_TYPES.DELETE_SEAL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_SEALS):
    case SUCCESS(ACTION_TYPES.FETCH_SEAL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SEAL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SEAL):
    case SUCCESS(ACTION_TYPES.UPDATE_SEAL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SEAL):
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

const apiUrl = 'api/seals';
const apiSearchUrl = 'api/_search/seals';

// Actions

export const getSearchEntities: ICrudSearchAction<ISeal> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_SEALS,
  payload: axios.get<ISeal>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<ISeal> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_SEAL_LIST,
  payload: axios.get<ISeal>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ISeal> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SEAL,
    payload: axios.get<ISeal>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ISeal> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SEAL,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISeal> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SEAL,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISeal> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SEAL,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
