import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { clearState } from '../actions/clearActions';
import { Path, useLocation, useNavigate } from 'react-router-dom';

/**
 * Get a callback for calling the authProvider.logout() method,
 * redirect to the login page, and clear the Redux state.
 *
 * @see useAuthProvider
 *
 * @returns {Function} logout callback
 *
 * @example
 *
 * import { useLogout } from '../app';
 *
 * const LogoutButton = () => {
 *     const logout = useLogout();
 *     const handleClick = () => logout();
 *     return <button onClick={handleClick}>Logout</button>;
 * }
 */
const useLogout = (): Logout => {
  const authProvider = useAuthProvider();
  const dispatch = useDispatch();

  /**
   * We need the current location to pass in the router state
   * so that the login hook knows where to redirect to as next route after login.
   *
   * But if we used useLocation to get it, the logout function
   * would be rebuilt each time the user changes location. Consequently, that
   * would force a rerender of all components using this hook upon navigation
   * (BaseAppRouter for example).
   *
   * To avoid that, we read the location directly from history which is mutable.
   * See: https://reacttraining.com/react-router/web/api/history/history-is-mutable
   */
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useCallback(
    (
      params = {},
      redirectTo = defaultAuthParams.loginUrl,
      redirectToCurrentLocationAfterLogin = true
    ) =>
      authProvider.logout(params).then(redirectToFromProvider => {
        dispatch(clearState());
        if (redirectToFromProvider === false) {
          // do not redirect
          return;
        }
        // redirectTo can contain a query string, e.g. '/login?foo=bar'
        // we must split the redirectTo to pass a structured location to navigate()
        const redirectToParts = (
          redirectToFromProvider || redirectTo
        ).split('?');
        const newLocation: Partial<Path> = {
          pathname: redirectToParts[0],
        };
        let state: any = {};
        if (
          redirectToCurrentLocationAfterLogin &&
          location.pathname
        ) {
          state = {
            nextPathname: location.pathname,
            nextSearch: location.search,
          };
        }
        if (redirectToParts[1]) {
          newLocation.search = redirectToParts[1];
        }
        navigate(newLocation, state);
        return redirectToFromProvider;
      }),
    [authProvider, history, dispatch]
  );

  const logoutWithoutProvider = useCallback(
    _ => {
      navigate({
        pathname: defaultAuthParams.loginUrl,
      }, {
        state: {
          nextPathname: location.pathname,
        }
      });
      dispatch(clearState());
      return Promise.resolve();
    },
    [dispatch, history]
  );

  return authProvider ? logout : logoutWithoutProvider;
};

/**
 * Log the current user out by calling the authProvider.logout() method,
 * and redirect them to the login screen.
 *
 * @param {Object} params The parameters to pass to the authProvider
 * @param {string} redirectTo The path name to redirect the user to (optional, defaults to login)
 * @param {boolean} redirectToCurrentLocationAfterLogin Whether the button shall record the current location to redirect to it after login. true by default.
 *
 * @return {Promise} The authProvider response
 */
type Logout = (
  params?: any,
  redirectTo?: string,
  redirectToCurrentLocationAfterLogin?: boolean
) => Promise<any>;

export default useLogout;
