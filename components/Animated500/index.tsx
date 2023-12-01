import * as React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useLazyRef } from "../../hooks";
const { useRef, useEffect } = React;
const { modulo, parallel, stagger, Value, spring, timing, sequence } = Animated;
const { useMemo } = React;

const VALUE = 500;

type Props = Readonly<{}>;

export default React.memo<Props>(
  function AnimatedBalance({}: Props): JSX.Element | null {
    const animation = useRef<Animated.CompositeAnimation | undefined>();
    const digits = useLazyRef(
      () =>
        new Array(3).fill(0).map((_, index) => ({
          position: new Value(amountToOdoPos(VALUE, index)),
          opacity: new Value(amountToVisibility(VALUE, index)),
        })) as Tuple<{ position: Animated.Value; opacity: Animated.Value }, 10>
    );
    const [d0, d1, d2] = digits.current;

    useEffect(() => {
      const direction: Direction = "UP"; // or "DOWN"

      if (animation.current) animation.current.stop();

      // Reset all animations to safe starting positions
      digits.current.forEach(({ position, opacity }, index) => {
        position.setValue(amountToOdoPos(0, index));
        opacity.setValue(amountToVisibility(0, index));
      });

      animation.current = sequence([
        Animated.delay(300),
        parallel([
          stagger(
            150,
            digits.current.map(({ position, opacity }, index) =>
              parallel([
                spring(position, {
                  toValue: amountToOdoPos(VALUE, index, direction),
                  damping: 30,
                  mass: 3,
                  useNativeDriver: true,
                }),
                timing(opacity, {
                  toValue: amountToVisibility(VALUE, index),
                  duration: 500,
                  useNativeDriver: true,
                }),
              ])
            )
          ),
        ]),
      ]);

      animation.current.start(() => {
        animation.current = undefined;
      });
    }, []);

    return (
      <View
        style={styles.root}
        pointerEvents="none"
        accessible={false}
        accessibilityLabel=""
      >
        <Animated.View style={StyleSheet.absoluteFill}>
          <Number value={d2.position} visibility={d2.opacity} position={2} />
          <Number value={d1.position} visibility={d1.opacity} position={1} />
          <Number value={d0.position} visibility={d0.opacity} position={0} />
        </Animated.View>
      </View>
    );
  }
);

const AnimatedText = React.memo(function AnimatedText({
  text,
}: Readonly<{ text: string }>): JSX.Element | null {
  return (
    <Text allowFontScaling={false} style={[styles.text]}>
      {text}
    </Text>
  );
});

const Number = React.memo(function Number({
  value,
  visibility,
  position,
  ...props
}: Readonly<{
  value: Animated.Value;
  visibility: Animated.Value;
  position: number;
}>): JSX.Element | null {
  const translateY = useMemo(
    () =>
      lastDigit(value).interpolate({
        inputRange: [0, 10],
        outputRange: [HEIGHT * -5, HEIGHT * -15],
      }),
    [value]
  );

  const { left, top } = numberPosition(position);

  return (
    <>
      <View style={[styles.number, { left, top }]}>
        <Animated.View
          style={[
            styles.numberInner,
            { opacity: visibility, transform: [{ translateY }] },
          ]}
        >
          <AnimatedText {...props} text="5" />
          <AnimatedText {...props} text="6" />
          <AnimatedText {...props} text="7" />
          <AnimatedText {...props} text="8" />
          <AnimatedText {...props} text="9" />
          <AnimatedText {...props} text="0" />
          <AnimatedText {...props} text="1" />
          <AnimatedText {...props} text="2" />
          <AnimatedText {...props} text="3" />
          <AnimatedText {...props} text="4" />
          <AnimatedText {...props} text="5" />
          <AnimatedText {...props} text="6" />
          <AnimatedText {...props} text="7" />
          <AnimatedText {...props} text="8" />
          <AnimatedText {...props} text="9" />
          <AnimatedText {...props} text="0" />
          <AnimatedText {...props} text="1" />
          <AnimatedText {...props} text="2" />
          <AnimatedText {...props} text="3" />
          <AnimatedText {...props} text="4" />
        </Animated.View>
      </View>
    </>
  );
});

function positionFactor(position: number): number {
  return 10 ** position;
}

function amountToOdoPos(
  value: number,
  position: number,
  direction?: Direction
): number {
  const absAmount = Math.abs(value);
  let offset = 0;
  if (direction === "UP") offset = 10;
  if (direction === "DOWN") offset = -10;
  return (Math.floor(absAmount / positionFactor(position)) % 10) + offset;
}

function amountToVisibility(value: number, position: number): number {
  const absAmount = Math.abs(value);
  if (position < MIN_DIGITS) return 1;
  if (absAmount >= positionFactor(position)) return 1;
  return 0;
}

function lastDigit(value: Animated.Value) {
  return modulo(value, 10);
}

function numberPosition(
  position: number
): Readonly<{ left: number; top: number }> {
  let left = 0;
  const top = HEIGHT / 2;
  const positionFromLeft = Math.abs(position - DIGITS) - 1;
  left += positionFromLeft * NUMBER_POSITION_WIDTH;
  return { top, left };
}

type Direction = "UP" | "DOWN";

const DIGITS = 3;
const MIN_DIGITS = 3;
const NUMBER_WIDTH = 54;
const HEIGHT = 81;
const X_SPACING = -1;
const SHADOW_SIZE = 80;

const NUMBER_POSITION_WIDTH = NUMBER_WIDTH + X_SPACING + X_SPACING;

const TOTAL_WIDTH = DIGITS * NUMBER_POSITION_WIDTH + X_SPACING;

const styles = StyleSheet.create({
  root: {
    height: HEIGHT,
    width: TOTAL_WIDTH,
    overflow: "visible",
  },
  number: {
    zIndex: 2,
    position: "absolute",
    width: NUMBER_WIDTH,
    height: HEIGHT,
    marginTop: HEIGHT * -0.5,
    overflow: "hidden",
  },
  text: {
    fontSize: 81,
    fontWeight: "bold",
    height: HEIGHT,
    textAlign: "center",
    color: "#222",
  },
  shadow: {
    position: "absolute",
    marginLeft: SHADOW_SIZE * -0.5,
    marginTop: SHADOW_SIZE * -0.5,
  },
  numberInner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: NUMBER_WIDTH,
    height: HEIGHT * 20,
  },
});
