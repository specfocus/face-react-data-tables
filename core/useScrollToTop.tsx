import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Scroll the window to top when the target location contains the _scrollToTop state
 *
 * @see BaseAppRouter where it's enabled by default
 *
 * @example // usage in buttons
 * import { Link } from 'react-router-dom';
 * import { Button } from '@mui/material';
 *
 * const FooButton = () => (
 *     <Button
 *         component={Link}
 *         to={'/foo'}
 *         state={{ _scrollToTop: true }}
 *     >
 *         Go to foo
 *     </Button>
 * );
 */
export const useScrollToTop = () => {
    const location = useLocation();
    // const history = useNavigate</*{ _scrollToTop?: boolean; }>();
    useEffect(
        () => {
            // location.listen((location, action) => {
            if (
                // action !== 'POP' &&
                // location.state?._scrollToTop &&
                typeof window != 'undefined'
            ) {
                window.scrollTo(0, 0);
            }
        },
        [location]
    );
};
