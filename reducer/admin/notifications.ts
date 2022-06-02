import { Reducer } from 'redux';
import {
    SHOW_NOTIFICATION,
    ShowNotificationAction,
    HIDE_NOTIFICATION,
    HideNotificationAction,
    RESET_NOTIFICATION,
    ResetNotificationAction,
    NotificationPayload,
} from '../../../actions/notificationActions';
import { UNDO, UndoAction } from '../../../actions/undoActions';
import { selector } from 'recoil';
import { atomCoreState, selectorNotifications } from '../../state';


type ActionTypes =
    | ShowNotificationAction
    | HideNotificationAction
    | ResetNotificationAction
    | UndoAction
    | { type: 'OTHER_TYPE'; };

type State = NotificationPayload[];

const initialState = [];

const notificationsReducer: Reducer<State> = (
    previousState = initialState,
    action: ActionTypes
) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return previousState.concat(action.payload);
        case HIDE_NOTIFICATION:
        case UNDO:
            return previousState.slice(1);
        case RESET_NOTIFICATION:
            return initialState;
        default:
            return previousState;
    }
};

export default notificationsReducer;

/**
 * Returns the first available notification to show
 */
export const firstNotification = selector<any>({
    key: 'firstNotification',
    get: ({ get }) => {
        const notifications = get(selectorNotifications);
        return notifications[0];
    }
});