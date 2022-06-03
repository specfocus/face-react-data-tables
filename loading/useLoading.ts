import { useSelector } from 'react-redux';
import { ReduxState } from '../redux/types';

/**
 * Get the loading status, i.e. a boolean indicating if at least one request is pending
 *
 * @see useLoad
 *
 * @example
 *
 * import { useLoading } from '../app';
 *
 * const MyComponent = () => {
 *      const loading = useLoading();
 *      return loading ? <Skeleton /> : <RealContent>;
 * }
 */
export default () =>
    useSelector((state: ReduxState) => state.admin.loading > 0);
