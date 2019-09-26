import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITransport, defaultValue } from 'app/shared/model/transport.model';

export const ACTION_TYPES = {
  SEARCH_TRANSPORTS: 'transport/SEARCH_TRANSPORTS',
  FETCH_TRANSPORT_LIST: 'transport/FETCH_TRANSPORT_LIST',
  FETCH_TRANSPORT: 'transport/FETCH_TRANSPORT',
  CREATE_TRANSPORT: 'transport/CREATE_TRANSPORT',
  UPDATE_TRANSPORT: 'transport/UPDATE_TRANSPORT',
  DELETE_TRANSPORT: 'transport/DELETE_TRANSPORT',
  RESET: 'transport/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITransport>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type TransportState = Readonly<typeof initialState>;

// Reducer

export default (state: TransportState = initialState, action): TransportState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_TRANSPORTS):
    case REQUEST(ACTION_TYPES.FETCH_TRANSPORT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TRANSPORT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TRANSPORT):
    case REQUEST(ACTION_TYPES.UPDATE_TRANSPORT):
    case REQUEST(ACTION_TYPES.DELETE_TRANSPORT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_TRANSPORTS):
    case FAILURE(ACTION_TYPES.FETCH_TRANSPORT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TRANSPORT):
    case FAILURE(ACTION_TYPES.CREATE_TRANSPORT):
    case FAILURE(ACTION_TYPES.UPDATE_TRANSPORT):
    case FAILURE(ACTION_TYPES.DELETE_TRANSPORT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_TRANSPORTS):
    case SUCCESS(ACTION_TYPES.FETCH_TRANSPORT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TRANSPORT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TRANSPORT):
    case SUCCESS(ACTION_TYPES.UPDATE_TRANSPORT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TRANSPORT):
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

const apiUrl = 'api/transports';
const apiSearchUrl = 'api/_search/transports';

// Actions

export const getSearchEntities: ICrudSearchAction<ITransport> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_TRANSPORTS,
  payload: axios.get<ITransport>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<ITransport> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_TRANSPORT_LIST,
  payload: axios.get<ITransport>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ITransport> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TRANSPORT,
    payload: axios.get<ITransport>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITransport> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TRANSPORT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITransport> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TRANSPORT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITransport> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TRANSPORT,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
