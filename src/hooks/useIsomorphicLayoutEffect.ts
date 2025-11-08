import { useEffect, useLayoutEffect } from 'react';

/**
 * A hook that uses useLayoutEffect on the client side and useEffect on the server side.
 * This prevents the "useLayoutEffect does nothing on the server" warning.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;