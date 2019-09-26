import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IContactCard, defaultValue } from 'app/shared/model/contact-card.model';

export const ACTION_TYPES = {
  SEARCH_CONTACTCARDS: 'contactCard/SEARCH_CONTACTCARDS',
  FETCH_CONTACTCARD_LIST: 'contactCard/FETCH_CONTACTCARD_LIST',
  FETCH_CONTACTCARD: 'contactCard/FETCH_CONTACTCARD',
  CREATE_CONTACTCARD: 'contactCard/CREATE_CONTACTCARD',
  UPDATE_CONTACTCARD: 'contactCard/UPDATE_CONTACTCARD',
  DELETE_CONTACTCARD: 'contactCard/DELETE_CONTACTCARD',
  RESET: 'contactCard/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IContactCard>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ContactCardState = Readonly<typeof initialState>;

// Reducer

export default (state: ContactCardState = initialState, action): ContactCardState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CONTACTCARDS):
    case REQUEST(ACTION_TYPES.FETCH_CONTACTCARD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CONTACTCARD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CONTACTCARD):
    case REQUEST(ACTION_TYPES.UPDATE_CONTACTCARD):
    case REQUEST(ACTION_TYPES.DELETE_CONTACTCARD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CONTACTCARDS):
    case FAILURE(ACTION_TYPES.FETCH_CONTACTCARD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CONTACTCARD):
    case FAILURE(ACTION_TYPES.CREATE_CONTACTCARD):
    case FAILURE(ACTION_TYPES.UPDATE_CONTACTCARD):
    case FAILURE(ACTION_TYPES.DELETE_CONTACTCARD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CONTACTCARDS):
    case SUCCESS(ACTION_TYPES.FETCH_CONTACTCARD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONTACTCARD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONTACTCARD):
    case SUCCESS(ACTION_TYPES.UPDATE_CONTACTCARD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CONTACTCARD):
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

const apiUrl = 'api/contact-cards';
const apiSearchUrl = 'api/_search/contact-cards';

// Actions

export const getSearchEntities: ICrudSearchAction<IContactCard> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_CONTACTCARDS,
  payload: axios.get<IContactCard>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IContactCard> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CONTACTCARD_LIST,
  payload: axios.get<IContactCard>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IContactCard> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CONTACTCARD,
    payload: axios.get<IContactCard>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IContactCard> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CONTACTCARD,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IContactCard> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CONTACTCARD,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IContactCard> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CONTACTCARD,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
