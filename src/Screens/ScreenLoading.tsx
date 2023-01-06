import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import CustomModal from "../Components/CustomModal";
import { Image, StyleSheet, View, Animated, StatusBar } from "react-native";
import { LinearGradient } from "../Components/LinearGradient";
import { Theme } from "../Scripts/Theme";
import Logo from "../Assets/logo.webp";
import { ActivityIndicator, Text } from "react-native-paper";
import SystemNavigationBar from "react-native-system-navigation-bar";

type IProps = {};
export type ScreenLoadingRef = {
    open: ()=>void;
    close: ()=>void;
    setText: (visible: boolean, message: string)=>void;
};

export default React.memo(forwardRef(function ScreenLoading(_props: IProps, ref: React.Ref<ScreenLoadingRef>) {
    const [visible, setVisible] = useState<boolean>(false);
    const [viewTex, setViewTex] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('Cargando...');
    let isColored = false;

    const open = ()=>setVisible(true);
    function close() {
        setVisible(false);
        setViewTex(false);
        setMessage('');
    }
    function setText(visible2: boolean, message: string) {
        if (visible2) {
            if (viewTex) setViewTex(visible2);
            return setMessage(message);
        }
        setViewTex(false);
        setMessage('');
    }
    useImperativeHandle(ref, ()=>({ open, close, setText }));

    useEffect(()=>{
        if (visible) {
            if (!isColored) {
                SystemNavigationBar.setNavigationColor("rgba(0, 163, 255, 1)", 'dark');
                StatusBar.setBackgroundColor('rgba(0, 163, 255, 0.001)');
                StatusBar.setBarStyle('dark-content');
                isColored = true;
            }
        } else if (isColored) {
            SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
            StatusBar.setBackgroundColor('#FFFFFF');
            StatusBar.setBarStyle('dark-content');
            isColored = false;
        }
    }, [visible]);

    return(<CustomModal visible={visible} animationIn={'fadeIn'} animationOut={'fadeOut'} animationInTiming={500} animationOutTiming={500}>
        <View style={styles.content}>
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 163, 255, 1)']} style={styles.gradient} />
            <View style={styles.imageContent}>
                <Animated.Image
                    source={Logo}
                    style={styles.imageLogo}
                    resizeMethod={'auto'}
                    resizeMode={'contain'}
                />
            </View>
            <View style={styles.loadingContent}>
                <ActivityIndicator
                    animating={true}
                    size={'large'}
                />
                {(viewTex)&&<Text style={styles.loadingText} numberOfLines={1}>{message}</Text>}
            </View>
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
        height: 200
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
    }
});