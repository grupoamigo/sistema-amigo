import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IManouver, defaultValue } from 'app/shared/model/manouver.model';

export const ACTION_TYPES = {
  SEARCH_MANOUVERS: 'manouver/SEARCH_MANOUVERS',
  FETCH_MANOUVER_LIST: 'manouver/FETCH_MANOUVER_LIST',
  FETCH_MANOUVER: 'manouver/FETCH_MANOUVER',
  CREATE_MANOUVER: 'manouver/CREATE_MANOUVER',
  UPDATE_MANOUVER: 'manouver/UPDATE_MANOUVER',
  DELETE_MANOUVER: 'manouver/DELETE_MANOUVER',
  RESET: 'manouver/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IManouver>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ManouverState = Readonly<typeof initialState>;

// Reducer

export default (state: ManouverState = initialState, action): ManouverState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_MANOUVERS):
    case REQUEST(ACTION_TYPES.FETCH_MANOUVER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_MANOUVER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_MANOUVER):
    case REQUEST(ACTION_TYPES.UPDATE_MANOUVER):
    case REQUEST(ACTION_TYPES.DELETE_MANOUVER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_MANOUVERS):
    case FAILURE(ACTION_TYPES.FETCH_MANOUVER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_MANOUVER):
    case FAILURE(ACTION_TYPES.CREATE_MANOUVER):
    case FAILURE(ACTION_TYPES.UPDATE_MANOUVER):
    case FAILURE(ACTION_TYPES.DELETE_MANOUVER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_MANOUVERS):
    case SUCCESS(ACTION_TYPES.FETCH_MANOUVER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_MANOUVER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_MANOUVER):
    case SUCCESS(ACTION_TYPES.UPDATE_MANOUVER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_MANOUVER):
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

const apiUrl = 'api/manouvers';
const apiSearchUrl = 'api/_search/manouvers';

// Actions

export const getSearchEntities: ICrudSearchAction<IManouver> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_MANOUVERS,
  payload: axios.get<IManouver>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IManouver> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_MANOUVER_LIST,
  payload: axios.get<IManouver>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IManouver> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_MANOUVER,
    payload: axios.get<IManouver>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IManouver> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_MANOUVER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IManouver> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_MANOUVER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IManouver> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_MANOUVER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
