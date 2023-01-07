import React, { useEffect, useRef, useState } from "react";
import CustomModal from "../Components/CustomModal";
import { Animated, PixelRatio, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { Theme } from "../Scripts/Theme";
import SplashLogo from "../Assets/splash_logo.webp";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { waitTo } from "../Scripts/Utils";
import GlitchText from "../Components/GlitchText";

type IProps = {};

export default React.memo(function SplashScreen(props: IProps) {
    const [visible, setVisible] = useState(true);
    // Animation
    const imageTY = useRef(new Animated.Value(0)).current;
    const imageSC = useRef(new Animated.Value(1)).current;
    const imageOP = useRef(new Animated.Value(1)).current;
    const glitchOP = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
        if (visible) {
            SystemNavigationBar.setNavigationColor('#FF3232', 'light');
            StatusBar.setBackgroundColor('#FF3232');
            StatusBar.setBarStyle('light-content');
        } else {
            SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
            StatusBar.setBackgroundColor('#FFFFFF');
            StatusBar.setBarStyle('dark-content');
        }
    }, [visible]);

    async function startAnimation() {
        // Reset
        Animated.timing(imageTY, { toValue: 0, duration: 0, useNativeDriver: true }).start();
        Animated.timing(imageSC, { toValue: 1, duration: 0, useNativeDriver: true }).start();
        Animated.timing(imageOP, { toValue: 1, duration: 0, useNativeDriver: true }).start();
        Animated.timing(glitchOP, { toValue: 0, duration: 0, useNativeDriver: true }).start();
        // Animation
        await waitTo(500);
        Animated.spring(imageTY, { toValue: -50, useNativeDriver: true }).start();
        await waitTo(350);
        Animated.spring(imageTY, { toValue: 20, useNativeDriver: true }).start();
        await waitTo(128);
        Animated.timing(imageSC, { toValue: 10, duration: 256, useNativeDriver: true }).start();
        Animated.timing(imageOP, { toValue: 0, duration: 256, useNativeDriver: true }).start();
        await waitTo(50);
        Animated.timing(glitchOP, { toValue: 1, duration: 256, useNativeDriver: true }).start();
    }

    return(<CustomModal visible={visible}>
        <Pressable style={styles.content} onPress={startAnimation}>
            <GlitchText
                text={'Project 2022'}
                shadowColor={'green'}
                textStyle={styles.textGlitch}
                style={[styles.contentGlitch, { opacity: glitchOP }]}
                glitchDuration={500}
                glitchAmplitude={10}
                repeatDelay={0}
            />
            <Animated.Image
                source={SplashLogo}
                style={[styles.logoImage, {
                    opacity: imageOP,
                    transform: [{ translateY: imageTY }, { scale: imageSC }]
                }]}
            />
        </Pressable>
    </CustomModal>);
});

const styles = StyleSheet.create({
    content: {
        flex: 1,
        position: 'relative',
        backgroundColor: Theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoImage: {
        width: 100.39,
        height: 100
    },
    textGlitch: {
        fontFamily: 'Organetto-Bold',
        color: '#FF3232',
        fontSize: 28
        //fontSize: 28 / PixelRatio.getFontScale()
    },
    contentGlitch: {
        position: 'absolute'
    }
});