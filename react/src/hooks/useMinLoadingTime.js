import { useEffect, useRef, useState } from 'react';

export const useMinLoadingTime = (isLoading, minTime = 1500) => {
    const [show, setShow] = useState(isLoading);
    const startRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            startRef.current = Date.now();
            setShow(true);
            return;
        }
        if (startRef.current === null) {
            setShow(false);
            return;
        }
        const remaining = minTime - (Date.now() - startRef.current);
        if (remaining <= 0) {
            setShow(false);
            return;
        }
        const timeout = setTimeout(() => setShow(false), remaining);
        return () => clearTimeout(timeout);
    }, [isLoading, minTime]);

    return show;
};
