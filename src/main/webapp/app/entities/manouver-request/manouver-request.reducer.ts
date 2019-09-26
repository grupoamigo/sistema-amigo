import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IManouverRequest, defaultValue } from 'app/shared/model/manouver-request.model';

export const ACTION_TYPES = {
  SEARCH_MANOUVERREQUESTS: 'manouverRequest/SEARCH_MANOUVERREQUESTS',
  FETCH_MANOUVERREQUEST_LIST: 'manouverRequest/FETCH_MANOUVERREQUEST_LIST',
  FETCH_MANOUVERREQUEST: 'manouverRequest/FETCH_MANOUVERREQUEST',
  CREATE_MANOUVERREQUEST: 'manouverRequest/CREATE_MANOUVERREQUEST',
  UPDATE_MANOUVERREQUEST: 'manouverRequest/UPDATE_MANOUVERREQUEST',
  DELETE_MANOUVERREQUEST: 'manouverRequest/DELETE_MANOUVERREQUEST',
  SET_BLOB: 'manouverRequest/SET_BLOB',
  RESET: 'manouverRequest/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IManouverRequest>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ManouverRequestState = Readonly<typeof initialState>;

// Reducer

export default (state: ManouverRequestState = initialState, action): ManouverRequestState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_MANOUVERREQUESTS):
    case REQUEST(ACTION_TYPES.FETCH_MANOUVERREQUEST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_MANOUVERREQUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_MANOUVERREQUEST):
    case REQUEST(ACTION_TYPES.UPDATE_MANOUVERREQUEST):
    case REQUEST(ACTION_TYPES.DELETE_MANOUVERREQUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_MANOUVERREQUESTS):
    case FAILURE(ACTION_TYPES.FETCH_MANOUVERREQUEST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_MANOUVERREQUEST):
    case FAILURE(ACTION_TYPES.CREATE_MANOUVERREQUEST):
    case FAILURE(ACTION_TYPES.UPDATE_MANOUVERREQUEST):
    case FAILURE(ACTION_TYPES.DELETE_MANOUVERREQUEST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_MANOUVERREQUESTS):
    case SUCCESS(ACTION_TYPES.FETCH_MANOUVERREQUEST_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_MANOUVERREQUEST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_MANOUVERREQUEST):
    case SUCCESS(ACTION_TYPES.UPDATE_MANOUVERREQUEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_MANOUVERREQUEST):
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

const apiUrl = 'api/manouver-requests';
const apiSearchUrl = 'api/_search/manouver-requests';

// Actions

export const getSearchEntities: ICrudSearchAction<IManouverRequest> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_MANOUVERREQUESTS,
  payload: axios.get<IManouverRequest>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IManouverRequest> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_MANOUVERREQUEST_LIST,
  payload: axios.get<IManouverRequest>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IManouverRequest> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_MANOUVERREQUEST,
    payload: axios.get<IManouverRequest>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IManouverRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_MANOUVERREQUEST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IManouverRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_MANOUVERREQUEST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IManouverRequest> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_MANOUVERREQUEST,
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
