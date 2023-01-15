import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Dimensions, EmitterSubscription, ScaledSize, StyleSheet, View, Animated, Easing, PermissionsAndroid } from "react-native";
import CardComponent, { CardComponentRef } from "../../Components/CardComponent";
import ViewShot, { captureRef, releaseCapture } from "react-native-view-shot";
import { getRandomInt, safeDecode, waitTo } from "../../Scripts/Utils";
import { ActivityIndicator, Button, Card, IconButton, Tooltip } from "react-native-paper";
import { Theme } from "../../Scripts/Theme";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import Color from "color";
import CredentialTouchable from "./CredentialTouchable";

type IProps = {
    dni: string;
    name: string;
    curse: string;
    image: string;
    openChangeDesign: ()=>void;
    openImageViewer: (source: string)=>void;
    controllerAlert: (visible: boolean, title?: string, message?: string)=>void;
};
export type CardCredentialRef = {
    setDesign: (id: number)=>void
};

export default React.memo(forwardRef(function CardCredential(props: IProps, ref: React.Ref<CardCredentialRef>) {
    const [disable, setDisable] = useState(false);
    const [design, setDesign] = useState(0);
    const [loading, setLoading] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const refCardComponent = createRef<CardComponentRef>();
    const refViewShot = createRef<ViewShot>();
    var event: EmitterSubscription | undefined = undefined;
    var actualSize = 0;

    function setNewScaleCard({ window }: { window: ScaledSize; }) {
        let width = window.width;
        if (width > 600) width = 600;
        let calc = Math.fround((width-58)/1200);
        actualSize = calc;
        refCardComponent.current?.setScale(calc);
    }
    function checkScale() {
        let window = Dimensions.get('window');
        let subWidth = (window.width > 600)? 600: window.width;
        let calc = Math.fround((subWidth - 58)/1200);
        if (calc !== actualSize) setNewScaleCard({ window });
    }

    useEffect(()=>{
        event = Dimensions.addEventListener('change', setNewScaleCard);
        let window = Dimensions.get('window');
        setNewScaleCard({ window });
        return ()=>{
            event?.remove();
        };
    }, []);
    useEffect(()=>{
        let curse = safeDecode(props.curse).toLowerCase();
        let isTeacher = curse.indexOf('docente') !== -1;
        setDisable(isTeacher);
        if (isTeacher) setDesign(-1); else setDesign(0);
    }, [props.curse]);

    function notChangeDesign() {
        props.controllerAlert(true, 'Acción no permitida', 'Los docentes no tienen permitido cambiar el diseño de su tarjeta de ingreso.');
    }

    function rightButtonTitle(hProps: { size: number; }) {
        return(<Tooltip title={'Cambiar diseño'}>
            <IconButton
                {...hProps}
                icon={'pencil-ruler'}
                onPress={(!disable)? props.openChangeDesign: notChangeDesign}
                iconColor={(disable)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): Theme.colors.secondary}
            />
        </Tooltip>);
    }
    useImperativeHandle(ref, ()=>({ setDesign }));
    
    function setOpacity(value: number) {
        Animated.timing(opacity, {
            toValue: value,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();
    }

    async function downloadNow() {
        try {
            if (!refViewShot.current?.capture) return;
            setOpacity(1);
            setLoading(true);
            const capture = await captureRef(refViewShot, { width: 1200, height: 779, format: 'png', quality: 1 });
            const newUri = `${RNFS.DownloadDirectoryPath}/credential-${getRandomInt(111111, 999999)}.png`;
            // ##### Permission #####
            const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: "Atención",
                message: "Para guardar la imagen se necesita acceder al almacenamiento de su dispositivo, por favor acepte los permisos que se requieren.",
                buttonNegative: "Cancelar",
                buttonPositive: "Aceptar"
            });
            if (permission == PermissionsAndroid.RESULTS.DENIED) return props.controllerAlert(true, 'Se denegó el acceso al almacenamiento', 'Para guardar la imagen se necesita acceder al almacenamiento de su dispositivo, por favor acepte los permisos que se requieren.');
            // ######################
            await RNFS.copyFile(capture, newUri);
            releaseCapture(capture);
            await waitTo(1000);
            setOpacity(0);
            setLoading(false);
            props.controllerAlert(true, 'Descarga completa', 'La imagen se guardo dentro de la carpeta de descargas del almacenamiento del dispositivo.');
        } catch (error) {
            setOpacity(0);
            setLoading(false);
            console.log(error);
        }
    }
    async function viewingNow() {
        try {
            if (!refViewShot.current?.capture) return;
            setOpacity(1);
            setLoading(true);
            const capture = await captureRef(refViewShot, { width: 1200, height: 779, format: 'png', quality: 1 });
            await waitTo(500);
            setOpacity(0);
            setLoading(false);
            props.openImageViewer(capture);
        } catch (error) {
            setOpacity(0);
            setLoading(false);
            console.log(error);
        }
    }
    async function shareNow() {
        try {
            if (!refViewShot.current?.capture) return;
            setOpacity(1);
            setLoading(true);
            const capture = await captureRef(refViewShot, { width: 1200, height: 779, format: 'png', result: 'base64', quality: 1 });
            const newName = `credential-${getRandomInt(111111, 999999)}.png`;
            await waitTo(1000);
            setOpacity(0);
            setLoading(false);
            await Share.open({
                url: `data:image/png;base64,${capture}`,
                filename: newName,
                type: 'png',
                showAppsToView: false,
                isNewTask: true
            });
        } catch (error) {
            setOpacity(0);
            setLoading(false);
            console.log(error);
        }
    }

    return(<Card style={styles.content}>
        <Card.Title
            title={'Tarjeta de ingreso:'}
            titleStyle={styles.title}
            titleVariant={'titleMedium'}
            right={rightButtonTitle}
        />
        <Card.Content onLayout={checkScale}>
            <CredentialTouchable disabled={loading} onPress={viewingNow} style={styles.buttonCard}>
                <View style={styles.contentCard}>
                    <CardComponent
                        ref={refCardComponent}
                        refShot={refViewShot}
                        dni={props.dni}
                        name={props.name}
                        image={props.image}
                        designID={design}
                    />
                    <Animated.View style={[styles.loadingContent, { opacity }]}>
                        <ActivityIndicator animating={true} size={'large'} />
                    </Animated.View>
                </View>
            </CredentialTouchable>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
            <Button
                icon={'cloud-download-outline'}
                onPress={(!loading)? downloadNow: undefined}
                textColor={(loading)? Color('#000000').alpha(0.5).rgb().string(): undefined}
            >Descargar</Button>
            <Button
                icon={'share-variant-outline'}
                onPress={(!loading)? shareNow: undefined}
                buttonColor={(loading)? Color('#000000').alpha(0.5).rgb().string(): undefined}
                textColor={(loading)? '#FFFFFF': undefined}
            >Compartir</Button>
        </Card.Actions>
    </Card>);
}));



const styles = StyleSheet.create({
    content: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10,
        overflow: 'hidden'
    },
    title: {
        fontWeight: '600',
        fontSize: 20
    },
    buttonCard: {
        borderRadius: 12,
        overflow: 'hidden'
    },
    contentCard: {
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 12
    },
    cardActions: {
        justifyContent: 'flex-end'
    },
    loadingContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center'
    }
});