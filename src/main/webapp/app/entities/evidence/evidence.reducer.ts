import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IEvidence, defaultValue } from 'app/shared/model/evidence.model';

export const ACTION_TYPES = {
  SEARCH_EVIDENCES: 'evidence/SEARCH_EVIDENCES',
  FETCH_EVIDENCE_LIST: 'evidence/FETCH_EVIDENCE_LIST',
  FETCH_EVIDENCE: 'evidence/FETCH_EVIDENCE',
  CREATE_EVIDENCE: 'evidence/CREATE_EVIDENCE',
  UPDATE_EVIDENCE: 'evidence/UPDATE_EVIDENCE',
  DELETE_EVIDENCE: 'evidence/DELETE_EVIDENCE',
  SET_BLOB: 'evidence/SET_BLOB',
  RESET: 'evidence/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEvidence>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type EvidenceState = Readonly<typeof initialState>;

// Reducer

export default (state: EvidenceState = initialState, action): EvidenceState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_EVIDENCES):
    case REQUEST(ACTION_TYPES.FETCH_EVIDENCE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EVIDENCE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_EVIDENCE):
    case REQUEST(ACTION_TYPES.UPDATE_EVIDENCE):
    case REQUEST(ACTION_TYPES.DELETE_EVIDENCE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_EVIDENCES):
    case FAILURE(ACTION_TYPES.FETCH_EVIDENCE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EVIDENCE):
    case FAILURE(ACTION_TYPES.CREATE_EVIDENCE):
    case FAILURE(ACTION_TYPES.UPDATE_EVIDENCE):
    case FAILURE(ACTION_TYPES.DELETE_EVIDENCE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_EVIDENCES):
    case SUCCESS(ACTION_TYPES.FETCH_EVIDENCE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVIDENCE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_EVIDENCE):
    case SUCCESS(ACTION_TYPES.UPDATE_EVIDENCE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_EVIDENCE):
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

const apiUrl = 'api/evidences';
const apiSearchUrl = 'api/_search/evidences';

// Actions

export const getSearchEntities: ICrudSearchAction<IEvidence> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_EVIDENCES,
  payload: axios.get<IEvidence>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IEvidence> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_EVIDENCE_LIST,
  payload: axios.get<IEvidence>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IEvidence> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EVIDENCE,
    payload: axios.get<IEvidence>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IEvidence> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EVIDENCE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEvidence> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EVIDENCE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEvidence> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EVIDENCE,
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
