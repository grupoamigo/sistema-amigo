import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDamage, defaultValue } from 'app/shared/model/damage.model';

export const ACTION_TYPES = {
  SEARCH_DAMAGES: 'damage/SEARCH_DAMAGES',
  FETCH_DAMAGE_LIST: 'damage/FETCH_DAMAGE_LIST',
  FETCH_DAMAGE: 'damage/FETCH_DAMAGE',
  CREATE_DAMAGE: 'damage/CREATE_DAMAGE',
  UPDATE_DAMAGE: 'damage/UPDATE_DAMAGE',
  DELETE_DAMAGE: 'damage/DELETE_DAMAGE',
  RESET: 'damage/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDamage>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type DamageState = Readonly<typeof initialState>;

// Reducer

export default (state: DamageState = initialState, action): DamageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_DAMAGES):
    case REQUEST(ACTION_TYPES.FETCH_DAMAGE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DAMAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_DAMAGE):
    case REQUEST(ACTION_TYPES.UPDATE_DAMAGE):
    case REQUEST(ACTION_TYPES.DELETE_DAMAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_DAMAGES):
    case FAILURE(ACTION_TYPES.FETCH_DAMAGE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DAMAGE):
    case FAILURE(ACTION_TYPES.CREATE_DAMAGE):
    case FAILURE(ACTION_TYPES.UPDATE_DAMAGE):
    case FAILURE(ACTION_TYPES.DELETE_DAMAGE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_DAMAGES):
    case SUCCESS(ACTION_TYPES.FETCH_DAMAGE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DAMAGE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_DAMAGE):
    case SUCCESS(ACTION_TYPES.UPDATE_DAMAGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_DAMAGE):
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

const apiUrl = 'api/damages';
const apiSearchUrl = 'api/_search/damages';

// Actions

export const getSearchEntities: ICrudSearchAction<IDamage> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_DAMAGES,
  payload: axios.get<IDamage>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IDamage> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_DAMAGE_LIST,
  payload: axios.get<IDamage>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IDamage> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DAMAGE,
    payload: axios.get<IDamage>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IDamage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DAMAGE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDamage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DAMAGE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDamage> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DAMAGE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
