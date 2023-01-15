import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import CustomModal from "../Components/CustomModal";
import { StyleSheet, View, Animated, StatusBar, Easing, Dimensions, EmitterSubscription, ScaledSize } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Theme } from "../Scripts/Theme";
import Logo from "../Assets/logo.webp";
import { ActivityIndicator, ProgressBar, Text } from "react-native-paper";
import SystemNavigationBar from "react-native-system-navigation-bar";
import CogImage from "../Assets/Cog.webp";
import ImageLazyLoad from "../Components/ImageLazyLoad";
import { getForScale, waitTo } from "../Scripts/Utils";

type IProps = {};
export type ScreenLoadingRef = {
    open: ()=>void;
    close: ()=>void;
    setText: (visible: boolean, message: string)=>void;
    setEndHere: (value: boolean)=>void;
    setShowLoading: (visible: boolean)=>void;
    setInformation: (image: string, name: string)=>void;
    startAnimation: ()=>void;
    endAnimation: ()=>void;
};

export default React.memo(forwardRef(function ScreenLoading(_props: IProps, ref: React.Ref<ScreenLoadingRef>) {
    const [visible, setVisible] = useState<boolean>(false);
    const [viewLoading, setViewLoading] = useState<boolean>(true);
    const [viewText, setViewTex] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('Cargando...');
    const [endHere, setEndHere2] = useState(false);
    // StudentData
    const [image, setImage] = useState<string>('none');
    const [name, setName] = useState<string>('Nombre del estudiante');
    // ###########
    let isAnimating = false;
    const duration: number = 300;
    // Animations Cogs
    const rotate = useRef(new Animated.Value(0)).current;
    const rotateCog = rotate.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
    const cog1X = useRef(new Animated.Value(-150)).current;
    const cog2Y = useRef(new Animated.Value(300)).current, cog2X = useRef(new Animated.Value(300)).current;
    const cog3Y = useRef(new Animated.Value(-220)).current, cog3X = useRef(new Animated.Value(-190)).current;
    const animationCogs =  Animated.loop(Animated.timing(rotate, { toValue: 360, duration: 2500, useNativeDriver: true, easing: Easing.linear }), { iterations: -1 });
    // Animation 
    const loadView1Op = useRef(new Animated.Value(1)).current, loadView1Ty = useRef(new Animated.Value(0)).current;
    const loadView2Op = useRef(new Animated.Value(0)).current, loadView2Ty = useRef(new Animated.Value(20)).current;
    const opacityImage1 = useRef(new Animated.Value(1)).current, opacityImage2 = useRef(new Animated.Value(0)).current;
    const opacityText2 = useRef(new Animated.Value(0)).current;
    const [scale, setScale] = useState(Math.fround(Dimensions.get('window').width/1080));
    var event: EmitterSubscription | undefined = undefined;
    const [sizeCogs, setSizeCogs] = useState([
        getForScale(scale, 600),
        getForScale(scale, 1200),
        getForScale(scale, 800)
    ]);

    const open = ()=>setVisible(true);
    const setShowLoading = (visible: boolean)=>setViewLoading(visible);
    async function close() {
        setVisible(false);
        await waitTo(300);
        setViewTex(false);
        setViewLoading(true);
        setMessage('');
        if (isAnimating) setTimeout(endAnimation, 500);
    }
    function setText(visible2: boolean, message: string) {
        if (visible2) {
            if (!viewText) setViewTex(visible2);
            return setMessage(message);
        }
        setViewTex(false);
        setMessage('');
    }
    function setEndHere(value: boolean) {
        return setEndHere2(value);
    }
    function setInformation(name: string, image: string) {
        setImage(image);
        setName(name);
    }
    function startAnimation() {
        isAnimating = true;
        setStateCogs(true);
        setStateLoading(true);
    }
    function endAnimation() {
        isAnimating = false;
        setStateCogs(false);
        setStateLoading(false);
    }
    useImperativeHandle(ref, ()=>({
        open,
        close,
        setText,
        setEndHere,
        setShowLoading,
        setInformation,
        startAnimation,
        endAnimation
    }));


    // Animations Cog
    function setStateCogs(show: boolean) {
        if (!show) {
            animationCogs.stop();
            Animated.parallel([
                Animated.timing(rotate, { toValue: 0, duration: 0, useNativeDriver: true, easing: Easing.linear }),
                Animated.timing(cog1X, { toValue: -150, duration: 0, useNativeDriver: true, easing: Easing.linear }),
                Animated.timing(cog2X, { toValue: 300, duration: 0, useNativeDriver: true, easing: Easing.linear }),
                Animated.timing(cog2Y, { toValue: 300, duration: 0, useNativeDriver: true, easing: Easing.linear }),
                Animated.timing(cog3X, { toValue: -190, duration: 0, useNativeDriver: true, easing: Easing.linear }),
                Animated.timing(cog3Y, { toValue: -220, duration: 0, useNativeDriver: true, easing: Easing.linear })
            ]).start();
            return;
        }
        Animated.parallel([
            Animated.timing(cog1X, { toValue: 0, duration, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(cog2X, { toValue: 0, duration, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(cog2Y, { toValue: 0, duration, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(cog3X, { toValue: 0, duration, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(cog3Y, { toValue: 0, duration, useNativeDriver: true, easing: Easing.linear })
        ]).start();
        setTimeout(animationCogs.start, duration);
    }
    function setStateLoading(show: boolean) {
        Animated.parallel([
            Animated.timing(loadView1Op, { toValue: (show)? 0: 1, duration: (show)? duration: 0, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(loadView1Ty, { toValue: (show)? 20: 0, duration: (show)? duration: 0, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(loadView2Op, { toValue: (show)? 1: 0, duration: (show)? duration: 0, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(loadView2Ty, { toValue: (show)? 0: 20, duration: (show)? duration: 0, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(opacityImage1, { toValue: (show)? 0: 1, duration: (show)? duration: 0, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(opacityImage2, { toValue: (show)? 1: 0, duration: (show)? duration: 0, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(opacityText2, { toValue: (show)? 1: 0, duration: (show)? duration: 0, delay: 1000, useNativeDriver: true, easing: Easing.linear })
        ]).start();
    }
    // ##############

    function setNewSizes({ window }: { window: ScaledSize; screen: ScaledSize; }) {
        setScale(window.width/1080);
        setSizeCogs([getForScale(scale, 600), getForScale(scale, 1200), getForScale(scale, 800)]);
    }

    useEffect(()=>{
        event = Dimensions.addEventListener('change', setNewSizes);
        //setTimeout(startAnimation, 1000);
        return ()=>{
            //endAnimation();
            event?.remove();
        }
    }, []);
    useEffect(()=>{
        if (visible) {
            SystemNavigationBar.setNavigationColor("rgba(0, 163, 255, 1)", 'dark');
            StatusBar.setBackgroundColor('rgba(0, 163, 255, 0.001)');
            StatusBar.setBarStyle('dark-content');
        } else {
            setTimeout(endAnimation, 499);
            if (endHere) {
                setTimeout(()=>{
                    SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
                    StatusBar.setBackgroundColor(Theme.colors.background);
                    StatusBar.setBarStyle('dark-content');
                }, 300);
                setEndHere2(false);
            }
        }
    }, [visible]);

    return(<CustomModal visible={visible} animationIn={'fadeIn'} animationOut={'fadeOut'} animationInTiming={500} animationOutTiming={500}>
        <View style={styles.content}>
            <View style={styles.contentCogs}>
                <Animated.Image
                    source={CogImage}
                    style={[styles.cog1, { width: sizeCogs[0], height: sizeCogs[0], transform: [{ rotate: rotateCog }, { translateX: cog1X }] }]}
                    blurRadius={12}
                    resizeMethod={'scale'}
                    resizeMode={'contain'}
                />
                <Animated.Image
                    source={CogImage}
                    style={[styles.cog2, { width: sizeCogs[1], height: sizeCogs[1], transform: [{ rotate: rotateCog }, { translateY: cog2Y }, { translateX: cog2X }] }]}
                    blurRadius={8}
                    resizeMethod={'scale'}
                    resizeMode={'contain'}
                />
                <Animated.Image
                    source={CogImage}
                    style={[styles.cog3, { width: sizeCogs[2], height: sizeCogs[2], transform: [{ rotate: rotateCog }, { translateY: cog3Y }, { translateX: cog3X }] }]}
                    blurRadius={10}
                    resizeMethod={'scale'}
                    resizeMode={'contain'}
                />
            </View>
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 163, 255, 1)']} style={styles.gradient} />
            <Animated.View style={[styles.imageContent, { opacity: opacityImage2 }]}>
                <View style={{ width: '100%', height: '100%' }}>
                    <ImageLazyLoad
                        source={{ uri: image }}
                        style={styles.imageLogo}
                        circle={true}
                        size={200}
                    />
                </View>
                <Animated.Text style={[styles.nameText, { opacity: opacityText2 }]}>{name}</Animated.Text>
            </Animated.View>
            <Animated.View style={[styles.imageContent, { opacity: opacityImage1 }]}>
                <Animated.Image
                    source={Logo}
                    style={styles.imageLogo}
                    resizeMethod={'auto'}
                    resizeMode={'contain'}
                />
            </Animated.View>
            <Animated.View style={[styles.loadingContent, { opacity: loadView1Op, transform: [{ translateY: loadView1Ty }] }]}>
                {(viewLoading)&&<ActivityIndicator
                    animating={true}
                    size={'large'}
                />}
                {(viewText)&&<Text style={styles.loadingText} numberOfLines={1}>{message}</Text>}
            </Animated.View>
            <Animated.View style={[styles.loadingContent, { opacity: loadView2Op, transform: [{ translateY: loadView2Ty }] }]}>
                {(viewLoading)&&<View style={{ width: '80%' }}>
                    <ProgressBar indeterminate={true} />
                </View>}
                {(viewText)&&<Text style={styles.loadingText} numberOfLines={1}>{message}</Text>}
            </Animated.View>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    content: {
        flex: 1,
        position: 'relative',
        backgroundColor: Theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradient: {
        width: '100%',
        height: '100%'
    },
    imageContent: {
        position: 'absolute',
        width: 200,
        height: 200,
        alignItems: 'center'
    },
    imageLogo: {
        width: '100%',
        height: '100%',
        marginTop: -40
    },
    loadingContent: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        height: '20%',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 16,
        color: '#000000',
        fontSize: 20
    },
    contentCogs: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    cog1: {
        position: 'absolute',
        top: 80,
        left: -150,
        width: 300,
        height: 300
    },
    cog2: {
        position: 'absolute',
        bottom: -200,
        left: -200,
        width: 500,
        height: 500
    },
    cog3: {
        position: 'absolute',
        top: -120,
        right: -150,
        width: 340,
        height: 340
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        minWidth: 300,
        textAlign: 'center',
        marginTop: 12,
        color: '#000000'
    }
});