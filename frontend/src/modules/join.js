import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
// import {getMeetingInfo} from '../actions/index'

// const prefix = "join";
const DELETE_POPUP = `DELETE_POPUP`;
const CREATE_COPIED_POPUP = `CREATE_COPIED_POPUP`;
const CREATE_JOINED_POPUP = `CREATE_JOINED_POPUP`;
const GET_MEETING_INFO = `GET_MEETING_INFO`;
// const DELETE_POPUP = `${prefix}/DELETE_POPUP`;
// const CREATE_COPIED_POPUP = `${prefix}/CREATE_COPIED_POPUP`;
// const CREATE_JOINED_POPUP = `${prefix}/CREATE_JOINED_POPUP`;
// const GET_MEETING_INFO = `${prefix}/GET_MEETING_INFO`;


const initialState = Map({
    is_joined: false,
    is_copied: false,
    is_joined_done: false,
    meeting: Map({
        id: 3,
        starting_date: "2019-04-24T10:00:00.000Z",
        mid_date: "2019-05-25T10:00:00.000Z",
        meeting_date: "2019-12-25T22:00:00.000Z",
        location: "Hongdae",
        cutline: 0,
    }),
}); 

export default handleActions({
    [DELETE_POPUP]: (state, action) => {
        return state.set('is_joined', false)
                    .set('is_copied', false);
    },
    [CREATE_COPIED_POPUP]: (state, action) => {
        return state.set('is_copied', true);
    },
    [CREATE_JOINED_POPUP]: (state, action) => {
        return state.set('is_joined', true)
                    .set('is_joined_done', true);
    },
    [GET_MEETING_INFO]: (state, action) => {
        return
    },
}, initialState);

export const deletePopup = createAction(DELETE_POPUP, payload => payload);
export const createCopiedPopup = createAction(CREATE_COPIED_POPUP, payload => payload);
export const createJoinedPopup = createAction(CREATE_JOINED_POPUP, payload => payload);
export const getMeetingInfo = createAction(GET_MEETING_INFO, payload => payload);