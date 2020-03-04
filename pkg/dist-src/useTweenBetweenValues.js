import { useEffect, useRef, useState, useCallback } from 'react';
const useTweenBetweenValues = (initialTarget, { duration = 1000, delay = 0 } = {
    duration: 1000,
    delay: 0,
}) => {
    const timeoutTimer = useRef();
    const rafTimer = useRef(0);
    const startedAt = useRef(0);
    const [target, setTarget] = useState(initialTarget);
    const perviousTarget = useRef(target);
    const previousValue = useRef(target);
    const [value, setValue] = useState(target);
    const getNextValue = useCallback(() => {
        const startedFor = Date.now() - startedAt.current;
        const percentTime = Math.max(0, Math.min(1, startedFor / duration));
        const nextValue = previousValue.current + percentTime * (target - previousValue.current);
        setValue(nextValue);
        return percentTime !== 1;
    }, [target, duration]);
    const nextStep = useCallback(() => {
        if (rafTimer.current)
            cancelAnimationFrame(rafTimer.current);
        rafTimer.current = requestAnimationFrame(() => {
            if (getNextValue())
                nextStep();
        });
    }, [getNextValue]);
    useEffect(() => {
        if (perviousTarget.current === target)
            return;
        previousValue.current = value;
        perviousTarget.current = target;
        if (timeoutTimer.current)
            clearTimeout(timeoutTimer.current);
        timeoutTimer.current = setTimeout(() => {
            startedAt.current = Date.now();
            nextStep();
        }, delay);
    }, [value, target, delay, nextStep]);
    useEffect(() => {
        return () => {
            if (timeoutTimer.current)
                clearTimeout(timeoutTimer.current);
            if (rafTimer.current)
                cancelAnimationFrame(rafTimer.current);
        };
    }, []);
    const setTargetOrValue = useCallback((arg, force) => {
        if (force) {
            setValue(arg);
        }
        else {
            setTarget(arg);
        }
    }, [setTarget, setValue]);
    return [value, setTargetOrValue];
};
export default useTweenBetweenValues;
