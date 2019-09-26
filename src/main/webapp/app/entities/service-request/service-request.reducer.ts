import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IServiceRequest, defaultValue } from 'app/shared/model/service-request.model';

export const ACTION_TYPES = {
  SEARCH_SERVICEREQUESTS: 'serviceRequest/SEARCH_SERVICEREQUESTS',
  FETCH_SERVICEREQUEST_LIST: 'serviceRequest/FETCH_SERVICEREQUEST_LIST',
  FETCH_SERVICEREQUEST: 'serviceRequest/FETCH_SERVICEREQUEST',
  CREATE_SERVICEREQUEST: 'serviceRequest/CREATE_SERVICEREQUEST',
  UPDATE_SERVICEREQUEST: 'serviceRequest/UPDATE_SERVICEREQUEST',
  DELETE_SERVICEREQUEST: 'serviceRequest/DELETE_SERVICEREQUEST',
  RESET: 'serviceRequest/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IServiceRequest>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ServiceRequestState = Readonly<typeof initialState>;

// Reducer

export default (state: ServiceRequestState = initialState, action): ServiceRequestState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_SERVICEREQUESTS):
    case REQUEST(ACTION_TYPES.FETCH_SERVICEREQUEST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SERVICEREQUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SERVICEREQUEST):
    case REQUEST(ACTION_TYPES.UPDATE_SERVICEREQUEST):
    case REQUEST(ACTION_TYPES.DELETE_SERVICEREQUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_SERVICEREQUESTS):
    case FAILURE(ACTION_TYPES.FETCH_SERVICEREQUEST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SERVICEREQUEST):
    case FAILURE(ACTION_TYPES.CREATE_SERVICEREQUEST):
    case FAILURE(ACTION_TYPES.UPDATE_SERVICEREQUEST):
    case FAILURE(ACTION_TYPES.DELETE_SERVICEREQUEST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_SERVICEREQUESTS):
    case SUCCESS(ACTION_TYPES.FETCH_SERVICEREQUEST_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SERVICEREQUEST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SERVICEREQUEST):
    case SUCCESS(ACTION_TYPES.UPDATE_SERVICEREQUEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SERVICEREQUEST):
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

const apiUrl = 'api/service-requests';
const apiSearchUrl = 'api/_search/service-requests';

// Actions

export const getSearchEntities: ICrudSearchAction<IServiceRequest> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_SERVICEREQUESTS,
  payload: axios.get<IServiceRequest>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IServiceRequest> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_SERVICEREQUEST_LIST,
  payload: axios.get<IServiceRequest>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IServiceRequest> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SERVICEREQUEST,
    payload: axios.get<IServiceRequest>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IServiceRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SERVICEREQUEST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IServiceRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SERVICEREQUEST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IServiceRequest> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SERVICEREQUEST,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
