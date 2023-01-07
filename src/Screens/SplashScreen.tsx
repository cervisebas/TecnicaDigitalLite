import React, { createRef, useEffect, useRef, useState } from "react";
import CustomModal from "../Components/CustomModal";
import { Animated, Pressable, StatusBar, StyleSheet } from "react-native";
import { Theme } from "../Scripts/Theme";
import SplashLogo from "../Assets/splash_logo.webp";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { waitTo } from "../Scripts/Utils";
import GlitchText from "../Components/GlitchText";
import TextAnimationShake from "../Components/TextAnimationShake";
import RNSplashScreen from "react-native-splash-screen";

type IProps = {};

export default React.memo(function SplashScreen(props: IProps) {
    const [visible, setVisible] = useState(true);
    const refTextAnimationShake = createRef<TextAnimationShake>();
    // Animation
    const imageTY = useRef(new Animated.Value(0)).current;
    const imageSC = useRef(new Animated.Value(1)).current;
    const imageOP = useRef(new Animated.Value(1)).current;
    const glitchOP = useRef(new Animated.Value(0)).current;
    const viewSizeY = useRef(new Animated.Value(0)).current;
    const brandOP = useRef(new Animated.Value(0)).current;
    //const viewBorder = useRef(new Animated.Value(100)).current;

    useEffect(()=>{
        if (visible) {
            SystemNavigationBar.setNavigationColor('#FF3232', 'light');
            StatusBar.setBackgroundColor('#FF3232');
            StatusBar.setBarStyle('light-content');
        } else {
            setTimeout(() => {
                SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
                StatusBar.setBackgroundColor('#FFFFFF');
                StatusBar.setBarStyle('dark-content');
            }, 500);
        }
    }, [visible]);

    async function startAnimation() {
        await waitTo(1000);
        RNSplashScreen.hide();
        // Reset
        Animated.parallel([
            Animated.timing(imageTY, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(imageSC, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(imageOP, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(glitchOP, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(viewSizeY, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(brandOP, { toValue: 0, duration: 0, useNativeDriver: true }),
            //Animated.timing(viewBorder, { toValue: 100, duration: 0, useNativeDriver: false })
        ]).start();
        // Animation
        await waitTo(500);
        Animated.parallel([
            Animated.spring(imageTY, { toValue: -50, useNativeDriver: true }),
            Animated.spring(imageTY, { toValue: 20, delay: 350, useNativeDriver: true }),
            Animated.timing(imageSC, { toValue: 10, duration: 256, delay: 478, useNativeDriver: true }),
            Animated.timing(imageOP, { toValue: 0, duration: 350, delay: 528, useNativeDriver: true }),
            Animated.timing(glitchOP, { toValue: 1, duration: 256, delay: 528, useNativeDriver: true })
        ]).start(function () {
            Animated.parallel([
                Animated.timing(viewSizeY, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(glitchOP, { toValue: 0, duration: 256, delay: 128, useNativeDriver: true })
                //Animated.timing(viewBorder, { toValue: 0, duration: 500, useNativeDriver: false })
            ]).start(function () {
                refTextAnimationShake.current?.start();
                Animated.timing(brandOP, { toValue: 1, duration: 512, useNativeDriver: true }).start(async function () {
                    await waitTo(1000);
                    setVisible(false);
                });
            });
        });
    }

    return(<CustomModal visible={visible} removeAnimationIn animationOut={'fadeOut'} animationOutTiming={500}>
        <Pressable style={styles.content}>
            <Animated.View style={[styles.viewBackground, { transform: [{ scaleY: viewSizeY }] }]} />
            <TextAnimationShake
                ref={refTextAnimationShake}
                value={'</> SCDEV'}
                style={[
                    styles.contentGlitch,
                    styles.textBrand,
                    { opacity: brandOP as any }
                ]}
                styleText={styles.textBrand2}
            />
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
                onLoad={startAnimation}
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
    },
    viewBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: '#FF3232'
    },
    textBrand: {
        position: 'absolute',
        color: '#FF2E2E',
        fontSize: 36,
        fontFamily: 'Organetto-Bold'
    },
    textBrand2: {
        color: '#FFFFFF',
        fontSize: 36,
        fontFamily: 'Organetto-Bold'
    }
});