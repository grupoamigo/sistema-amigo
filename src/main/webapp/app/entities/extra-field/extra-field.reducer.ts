import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IExtraField, defaultValue } from 'app/shared/model/extra-field.model';

export const ACTION_TYPES = {
  SEARCH_EXTRAFIELDS: 'extraField/SEARCH_EXTRAFIELDS',
  FETCH_EXTRAFIELD_LIST: 'extraField/FETCH_EXTRAFIELD_LIST',
  FETCH_EXTRAFIELD: 'extraField/FETCH_EXTRAFIELD',
  CREATE_EXTRAFIELD: 'extraField/CREATE_EXTRAFIELD',
  UPDATE_EXTRAFIELD: 'extraField/UPDATE_EXTRAFIELD',
  DELETE_EXTRAFIELD: 'extraField/DELETE_EXTRAFIELD',
  RESET: 'extraField/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IExtraField>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ExtraFieldState = Readonly<typeof initialState>;

// Reducer

export default (state: ExtraFieldState = initialState, action): ExtraFieldState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_EXTRAFIELDS):
    case REQUEST(ACTION_TYPES.FETCH_EXTRAFIELD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EXTRAFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_EXTRAFIELD):
    case REQUEST(ACTION_TYPES.UPDATE_EXTRAFIELD):
    case REQUEST(ACTION_TYPES.DELETE_EXTRAFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_EXTRAFIELDS):
    case FAILURE(ACTION_TYPES.FETCH_EXTRAFIELD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EXTRAFIELD):
    case FAILURE(ACTION_TYPES.CREATE_EXTRAFIELD):
    case FAILURE(ACTION_TYPES.UPDATE_EXTRAFIELD):
    case FAILURE(ACTION_TYPES.DELETE_EXTRAFIELD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_EXTRAFIELDS):
    case SUCCESS(ACTION_TYPES.FETCH_EXTRAFIELD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_EXTRAFIELD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_EXTRAFIELD):
    case SUCCESS(ACTION_TYPES.UPDATE_EXTRAFIELD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_EXTRAFIELD):
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

const apiUrl = 'api/extra-fields';
const apiSearchUrl = 'api/_search/extra-fields';

// Actions

export const getSearchEntities: ICrudSearchAction<IExtraField> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_EXTRAFIELDS,
  payload: axios.get<IExtraField>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IExtraField> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_EXTRAFIELD_LIST,
  payload: axios.get<IExtraField>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IExtraField> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EXTRAFIELD,
    payload: axios.get<IExtraField>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IExtraField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EXTRAFIELD,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IExtraField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EXTRAFIELD,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IExtraField> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EXTRAFIELD,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
