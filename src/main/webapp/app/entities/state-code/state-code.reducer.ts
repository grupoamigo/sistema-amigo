import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IStateCode, defaultValue } from 'app/shared/model/state-code.model';

export const ACTION_TYPES = {
  SEARCH_STATECODES: 'stateCode/SEARCH_STATECODES',
  FETCH_STATECODE_LIST: 'stateCode/FETCH_STATECODE_LIST',
  FETCH_STATECODE: 'stateCode/FETCH_STATECODE',
  CREATE_STATECODE: 'stateCode/CREATE_STATECODE',
  UPDATE_STATECODE: 'stateCode/UPDATE_STATECODE',
  DELETE_STATECODE: 'stateCode/DELETE_STATECODE',
  RESET: 'stateCode/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IStateCode>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type StateCodeState = Readonly<typeof initialState>;

// Reducer

export default (state: StateCodeState = initialState, action): StateCodeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_STATECODES):
    case REQUEST(ACTION_TYPES.FETCH_STATECODE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_STATECODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_STATECODE):
    case REQUEST(ACTION_TYPES.UPDATE_STATECODE):
    case REQUEST(ACTION_TYPES.DELETE_STATECODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_STATECODES):
    case FAILURE(ACTION_TYPES.FETCH_STATECODE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_STATECODE):
    case FAILURE(ACTION_TYPES.CREATE_STATECODE):
    case FAILURE(ACTION_TYPES.UPDATE_STATECODE):
    case FAILURE(ACTION_TYPES.DELETE_STATECODE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_STATECODES):
    case SUCCESS(ACTION_TYPES.FETCH_STATECODE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_STATECODE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_STATECODE):
    case SUCCESS(ACTION_TYPES.UPDATE_STATECODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_STATECODE):
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

const apiUrl = 'api/state-codes';
const apiSearchUrl = 'api/_search/state-codes';

// Actions

export const getSearchEntities: ICrudSearchAction<IStateCode> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_STATECODES,
  payload: axios.get<IStateCode>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IStateCode> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_STATECODE_LIST,
  payload: axios.get<IStateCode>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IStateCode> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_STATECODE,
    payload: axios.get<IStateCode>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IStateCode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_STATECODE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IStateCode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_STATECODE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IStateCode> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_STATECODE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
