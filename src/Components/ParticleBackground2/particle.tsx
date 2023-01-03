import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { randomIntFromInterval } from "./utils";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type IProps = {
  initialX: number;
  initialY: number;
  parentHeight: number;
  parentWidth: number;
  size: number;
  color: string;
};

const Particle = ({
  initialX,
  initialY,
  parentHeight,
  parentWidth,
  size,
  color
}: IProps) => {
  const animationTiming = randomIntFromInterval(800, 1800);
  var interval: any;
  
  // Variables
  const topOffSet = parentHeight - initialY;
  const leftOffSet = parentWidth - initialX;
  let yOffset = topOffSet * Math.cos(randomIntFromInterval(0, 360));
  let xOffset = leftOffSet * Math.sin(randomIntFromInterval(0, 360));

  // Animations
  const animOpacity = useSharedValue(randomIntFromInterval(0, 1));
  const animPositionX = useSharedValue(-1);
  const animPositionY = useSharedValue(-1);
  const animStyles = useAnimatedStyle(()=>({
    opacity: withTiming(animOpacity.value, { duration: animationTiming }),
    transform: [
      { translateX: withTiming(animPositionX.value, { duration: 2000, easing: Easing.out(Easing.quad) }) },
      { translateY: withTiming(animPositionY.value, { duration: 2000, easing: Easing.out(Easing.quad) }) }
    ]
  }), []);


  const loopBouncingAnimate = () => {
    let reversed = false;
    interval = setInterval(() => {
      reversed = !reversed;
      animPositionX.value = (reversed)? 0: xOffset;
      animPositionY.value = (reversed)? 0: yOffset;
      animOpacity.value = (reversed)? 0.4: 1;
    }, animationTiming);
  };

  useEffect(()=>{
    loopBouncingAnimate();
    return ()=>{
      clearInterval(interval);
    };
  }, []);

  return (
    <Animated.View
      style={[
        animStyles,
        styles.container,
        {
          top: initialY,
          left: initialX,
          width: size,
          height: size,
          backgroundColor: color
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    position: "absolute",
    borderRadius: 100
  }
});

export default Particle;
