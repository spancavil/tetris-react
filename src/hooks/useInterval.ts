import {useRef, useEffect} from 'react'
/**
 * 
 * @param callback what to do after the delay pass
 * @param delay represent the tick speed
 */
export function useInterval(callback: () => void, delay: number | null): void {
    const callbackRef = useRef(callback)
    useEffect (()=> {
        callbackRef.current = callback
    }, [callback])

    useEffect(()=> {
        if (delay === null) return
        const intervalId = setInterval(()=> callbackRef.current(), delay)
        return () => clearInterval(intervalId)
    }, [delay])
}