import React from "react";
import useTweenBetweenValues from "./useTweenBetweenValues";

function *getNextValue() {
  yield 20
  yield 300
  yield -500
}

let iterator = getNextValue()

const Test = () => {
  const [value, setTarget] = useTweenBetweenValues(10);

  return (
    <div
      onClick={() => {
        let next = iterator.next().value
        if (next) setTarget(next)
      }}
    >
      {value}
    </div>
  );
};

export default Test;
