import React from "react";
import { Platform, Pressable, PressableAndroidRippleConfig, StyleProp, ViewStyle } from "react-native";
import { TouchableRipple } from "react-native-paper";

type IProps = {
    disabled?: boolean;
    onPress?: ()=>void;
    onLongPress?: ()=>void;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
};

const pressableRipple: PressableAndroidRippleConfig = { color: 'rgba(0, 0, 0, 0.3)', foreground: true, borderless: false }

export default React.memo(function CredentialTouchable(props: IProps) {
    const APIHIGH = Platform.Version > 25;
    return((APIHIGH)? <TouchableRipple borderless={true} disabled={props.disabled} onPress={props.onPress} onLongPress={props.onLongPress} style={props.style}>{props.children}</TouchableRipple>:
    <Pressable disabled={props.disabled} onPress={props.onPress} onLongPress={props.onLongPress} style={props.style} android_ripple={pressableRipple}>{props.children}</Pressable>);
});