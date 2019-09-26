import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICargo, defaultValue } from 'app/shared/model/cargo.model';

export const ACTION_TYPES = {
  SEARCH_CARGOS: 'cargo/SEARCH_CARGOS',
  FETCH_CARGO_LIST: 'cargo/FETCH_CARGO_LIST',
  FETCH_CARGO: 'cargo/FETCH_CARGO',
  CREATE_CARGO: 'cargo/CREATE_CARGO',
  UPDATE_CARGO: 'cargo/UPDATE_CARGO',
  DELETE_CARGO: 'cargo/DELETE_CARGO',
  RESET: 'cargo/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICargo>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CargoState = Readonly<typeof initialState>;

// Reducer

export default (state: CargoState = initialState, action): CargoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CARGOS):
    case REQUEST(ACTION_TYPES.FETCH_CARGO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CARGO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CARGO):
    case REQUEST(ACTION_TYPES.UPDATE_CARGO):
    case REQUEST(ACTION_TYPES.DELETE_CARGO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CARGOS):
    case FAILURE(ACTION_TYPES.FETCH_CARGO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CARGO):
    case FAILURE(ACTION_TYPES.CREATE_CARGO):
    case FAILURE(ACTION_TYPES.UPDATE_CARGO):
    case FAILURE(ACTION_TYPES.DELETE_CARGO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CARGOS):
    case SUCCESS(ACTION_TYPES.FETCH_CARGO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CARGO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CARGO):
    case SUCCESS(ACTION_TYPES.UPDATE_CARGO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CARGO):
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

const apiUrl = 'api/cargos';
const apiSearchUrl = 'api/_search/cargos';

// Actions

export const getSearchEntities: ICrudSearchAction<ICargo> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_CARGOS,
  payload: axios.get<ICargo>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<ICargo> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CARGO_LIST,
  payload: axios.get<ICargo>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICargo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CARGO,
    payload: axios.get<ICargo>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICargo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CARGO,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICargo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CARGO,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICargo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CARGO,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
