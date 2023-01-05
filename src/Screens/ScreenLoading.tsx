import React, { forwardRef, useImperativeHandle, useState } from "react";
import CustomModal from "../Components/CustomModal";
import { Image, StyleSheet, View, Animated } from "react-native";
import { LinearGradient } from "../Components/LinearGradient";
import { Theme } from "../Scripts/Theme";
import Logo from "../Assets/logo.webp";

type IProps = {};
export type ScreenLoadingRef = {
    open: ()=>void;
};

export default React.memo(forwardRef(function ScreenLoading(props: IProps, ref: React.Ref<ScreenLoadingRef>) {
    const [visible, setVisible] = useState(true);

    useImperativeHandle(ref, ()=>({
        open: ()=>setVisible(true)
    }));

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
    }
});