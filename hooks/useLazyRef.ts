import { useRef } from "react";

const UNSET = Symbol("unset");

export default function useLazyRef<T>(getValue: () => T): {
  current: T;
} {
  const ref = useRef<T | typeof UNSET>(UNSET);
  if (ref.current === UNSET) ref.current = getValue();

  // @ts-expect-error: This type isn't refining correctly to T, even though it can't be UNSET anymore
  return ref;
}
