import { useRef } from "react";
import { Animated } from "react-native";

export default function useAnimatedValue(
  initialValue: number | Animated.Value = 0
): Animated.Value {
  const ref = useRef<null | Animated.Value>(null);
  if (ref.current == null)
    ref.current =
      typeof initialValue === "number"
        ? new Animated.Value(initialValue)
        : initialValue;
  return ref.current;
}
