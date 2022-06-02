export const CHANGE_LOCALE = 'CHANGE_LOCALE';

export interface ChangeLocaleAction {
    readonly type: typeof CHANGE_LOCALE;
    readonly payload: string;
}

export const changeLocale = (locale: string): ChangeLocaleAction => ({
    type: CHANGE_LOCALE,
    payload: locale,
});

export const CHANGE_LOCALE_SUCCESS = 'CHANGE_LOCALE_SUCCESS';

export interface ChangeLocaleSuccessAction {
    readonly type: typeof CHANGE_LOCALE_SUCCESS;
    readonly payload: {
        locale: string;
        messages: any;
    };
}

export const changeLocaleSuccess = (
    locale: string,
    messages: any
): ChangeLocaleSuccessAction => ({
    type: CHANGE_LOCALE_SUCCESS,
    payload: {
        locale,
        messages,
    },
});

export const CHANGE_LOCALE_FAILURE = 'CHANGE_LOCALE_FAILURE';

export interface ChangeLocaleFailureAction {
    readonly type: typeof CHANGE_LOCALE_FAILURE;
    readonly error: any;
    readonly payload: {
        locale: string;
    };
}
export const changeLocaleFailure = (
    locale: string,
    error: any
): ChangeLocaleFailureAction => ({
    type: CHANGE_LOCALE_FAILURE,
    error,
    payload: {
        locale,
    },
});
