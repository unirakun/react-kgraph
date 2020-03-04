import { useEffect, useRef, useState, useCallback } from 'react'

const useTweenBetweenValues = (
  initialTarget: number,
  { duration = 1000, delay = 0 }: { duration: number; delay: number } = {
    duration: 1000,
    delay: 0,
  },
): [number, Function] => {
  const timeoutTimer = useRef<number>()
  const rafTimer = useRef(0)
  const startedAt = useRef(0)
  const [target, setTarget] = useState<number>(initialTarget)
  const perviousTarget = useRef(target)
  const previousValue = useRef(target)
  const [value, setValue] = useState(target)

  const getNextValue = useCallback(() => {
    const startedFor = Date.now() - startedAt.current
    const percentTime = Math.max(0, Math.min(1, startedFor / duration))

    const nextValue =
      previousValue.current + percentTime * (target - previousValue.current)
    setValue(nextValue)

    return percentTime !== 1
  }, [target, duration])

  const nextStep = useCallback(() => {
    if (rafTimer.current) cancelAnimationFrame(rafTimer.current)
    rafTimer.current = requestAnimationFrame(() => {
      if (getNextValue()) nextStep()
    })
  }, [getNextValue])

  useEffect(() => {
    if (perviousTarget.current === target) return

    previousValue.current = value
    perviousTarget.current = target

    if (timeoutTimer.current) clearTimeout(timeoutTimer.current)
    timeoutTimer.current = setTimeout(() => {
      startedAt.current = Date.now()
      nextStep()
    }, delay) as any
  }, [value, target, delay, nextStep])

  useEffect(() => {
    return () => {
      if (timeoutTimer.current) clearTimeout(timeoutTimer.current)
      if (rafTimer.current) cancelAnimationFrame(rafTimer.current)
    }
  }, [])

  const setTargetOrValue = useCallback(
    (arg: any, force: boolean) => {
      if (force) {
        setValue(arg)
      } else {
        setTarget(arg)
      }
    },
    [setTarget, setValue],
  )

  return [value, setTargetOrValue]
}

export default useTweenBetweenValues
