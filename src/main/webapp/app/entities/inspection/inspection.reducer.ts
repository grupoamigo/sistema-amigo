import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IInspection, defaultValue } from 'app/shared/model/inspection.model';

export const ACTION_TYPES = {
  SEARCH_INSPECTIONS: 'inspection/SEARCH_INSPECTIONS',
  FETCH_INSPECTION_LIST: 'inspection/FETCH_INSPECTION_LIST',
  FETCH_INSPECTION: 'inspection/FETCH_INSPECTION',
  CREATE_INSPECTION: 'inspection/CREATE_INSPECTION',
  UPDATE_INSPECTION: 'inspection/UPDATE_INSPECTION',
  DELETE_INSPECTION: 'inspection/DELETE_INSPECTION',
  SET_BLOB: 'inspection/SET_BLOB',
  RESET: 'inspection/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IInspection>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type InspectionState = Readonly<typeof initialState>;

// Reducer

export default (state: InspectionState = initialState, action): InspectionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_INSPECTIONS):
    case REQUEST(ACTION_TYPES.FETCH_INSPECTION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_INSPECTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_INSPECTION):
    case REQUEST(ACTION_TYPES.UPDATE_INSPECTION):
    case REQUEST(ACTION_TYPES.DELETE_INSPECTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_INSPECTIONS):
    case FAILURE(ACTION_TYPES.FETCH_INSPECTION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_INSPECTION):
    case FAILURE(ACTION_TYPES.CREATE_INSPECTION):
    case FAILURE(ACTION_TYPES.UPDATE_INSPECTION):
    case FAILURE(ACTION_TYPES.DELETE_INSPECTION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_INSPECTIONS):
    case SUCCESS(ACTION_TYPES.FETCH_INSPECTION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_INSPECTION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_INSPECTION):
    case SUCCESS(ACTION_TYPES.UPDATE_INSPECTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_INSPECTION):
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

const apiUrl = 'api/inspections';
const apiSearchUrl = 'api/_search/inspections';

// Actions

export const getSearchEntities: ICrudSearchAction<IInspection> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_INSPECTIONS,
  payload: axios.get<IInspection>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IInspection> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_INSPECTION_LIST,
  payload: axios.get<IInspection>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IInspection> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_INSPECTION,
    payload: axios.get<IInspection>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IInspection> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_INSPECTION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IInspection> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_INSPECTION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IInspection> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_INSPECTION,
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
