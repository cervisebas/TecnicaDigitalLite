import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Text, Animated, StyleSheet, StyleProp, TextStyle, ViewStyle, RegisteredStyle } from 'react-native';

const SHADOW_COLOR = '#add8e6';
const ANIMATION_DURATION = 1500;
const GLITCH_AMPLITUDE = 5;
const REPEAT_DELAY = 2000;

type IProps = {
    text?: string;
    glitchHeight?: number;
    glitchAmplitude?: number;
    glitchDuration?: number;
    repeatDelay?: number;
    shadowColor?: string;
    textStyle?: StyleProp<TextStyle>;
    //style?: StyleProp<ViewStyle>;
    style?: false | Animated.Value | Animated.AnimatedInterpolation<string | number> | RegisteredStyle<ViewStyle> | Animated.WithAnimatedObject<ViewStyle> | Animated.WithAnimatedArray<ViewStyle> | null | undefined;
    heightInputRange?: number[];
    positionYInputRange?: number[];
    outOfTextRange?: boolean;
    disableAutoAnimation?: boolean;
};

const defaultProps = {
    text: '',
    glitchHeight: 80,
    glitchAmplitude: GLITCH_AMPLITUDE,
    glitchDuration: ANIMATION_DURATION,
    repeatDelay: REPEAT_DELAY,
    shadowColor: SHADOW_COLOR,
    heightInputRange: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    positionYInputRange: [0, 10, 20, 30, 60, 65, 70, 80, 90, 100],
    outOfTextRange: false,
    disableAutoAnimation: false
};

const GlitchText = forwardRef(({
    text,
    glitchHeight,
    glitchAmplitude,
    glitchDuration,
    repeatDelay,
    shadowColor,
    textStyle,
    style,
    heightInputRange,
    positionYInputRange,
    outOfTextRange,
    disableAutoAnimation
}: IProps, ref) => {
  const mainAnimatedValue = useRef(new Animated.Value(0)).current;
  const animatedX = useRef(new Animated.Value(0)).current;

  const runAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(animatedX, {
          toValue: -glitchAmplitude!,
          useNativeDriver: false,
          speed: 1000,
          bounciness: 1000,
        }),
        Animated.spring(animatedX, {
          toValue: glitchAmplitude!,
          useNativeDriver: false,
          speed: 1000,
          bounciness: 1000,
        }),
      ]),
    ).start();

    Animated.timing(mainAnimatedValue, {
      toValue: 100,
      duration: glitchDuration,
      useNativeDriver: false,
    }).start(() => {
      mainAnimatedValue.setValue(0);
      if (!disableAutoAnimation) {
        setTimeout(() => runAnimation(), repeatDelay);
      }
    });
  };

  useEffect(() => {
    if (!disableAutoAnimation) {
      runAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    animate: runAnimation,
  }));

  const height = mainAnimatedValue.interpolate({
    inputRange: heightInputRange!,
    outputRange: [
      0.01,
      glitchHeight! / 4,
      glitchHeight! / 8,
      glitchHeight! / 2.5,
      glitchHeight! / 2.5,
      glitchHeight! / 2.5,
      glitchHeight! / 5.5,
      glitchHeight! / 4,
      glitchHeight! / 8,
      glitchHeight! / 8,
      glitchHeight! / 4,
    ],
  });

  const positionY = mainAnimatedValue.interpolate({
    inputRange: positionYInputRange!,
    outputRange: [
      glitchHeight! / 2.5,
      glitchHeight! / 2,
      glitchHeight! / 4,
      glitchHeight! / 1.3,
      glitchHeight! / 1.3,
      glitchHeight! / 4,
      glitchHeight! / 16,
      0,
      0,
      glitchHeight! / 4,
    ],
  });

  const renderText = (isCover = false) => {
    return (
      <Text
        allowFontScaling={false}
        style={[
          styles.text,
          {fontSize: glitchHeight! / 2.5},
          textStyle,
          isCover ? styles.glitchText : null,
          isCover ? {textShadowColor: shadowColor} : null,
        ]}>
        {text?.toUpperCase()}
      </Text>
    );
  };

  return (
    <Animated.View style={[styles.row, style]}>
      {renderText()}
      <Animated.View
        style={[
          styles.row,
          styles.coverContainer,
          {height},
          {transform: [{translateX: animatedX}, {translateY: positionY}]},
        ]}>
        <Animated.View
          style={[
            styles.row,
            {
              transform: [
                {
                  translateY: outOfTextRange
                    ? Animated.multiply(animatedX, -1)
                    : Animated.multiply(positionY, -1),
                },
              ],
              height: glitchHeight,
            },
          ]}>
          {renderText(true)}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
});

GlitchText.defaultProps = defaultProps;
export default React.memo(GlitchText);

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 200,
  },
  row: {
    flexDirection: 'row',
  },
  rightSide: {
    borderRightWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContainer: {
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    zIndex: 1,
  },
  text: {
    color: '#000000',
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  glitchText: {
    textShadowOffset: {width: 3, height: 2},
    textShadowRadius: 1,
  },
  glitchImage: {
    shadowOffset: {width: 3, height: 2},
    shadowRadius: 1,
  },
});