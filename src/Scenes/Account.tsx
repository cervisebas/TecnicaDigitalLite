import React, { PureComponent } from "react";
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Divider, List, Text } from "react-native-paper";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import ImageLazyLoad from "../Components/ImageLazyLoad";
import { safeDecode } from "../Scripts/Utils";
import { urlBase } from "../Scripts/ApiTecnica";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNFS from "react-native-fs";
import ProfilePicture from "../Assets/profile.webp";
import Cog from "../Assets/Cog.svg";

type IProps = {
    datas: StudentsData;
    openImageViewer: (source: string)=>void;
    controllerLoading: (visible: boolean, message?: string)=>void;
    logOutAction: ()=>void;
};
type IState = {
    idStudent: string;
    cogRotate: Animated.Value;
};
const CacheDir = RNFS.CachesDirectoryPath;

export default class Account extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            idStudent: '00000',
            cogRotate: new Animated.Value(0)
        };
        this.openImage = this.openImage.bind(this);
    }
    componentDidUpdate(prevProps: Readonly<IProps>, _prevState: Readonly<IState>, _snapshot?: any): void {
        if (prevProps.datas !== this.props.datas) this.setIdStudent();
    }
    componentDidMount(): void {
        this.setIdStudent();
        Animated.loop(Animated.timing(this.state.cogRotate, { toValue: 360, duration: 3000, useNativeDriver: true, easing: Easing.linear })).start();
    }
    setIdStudent() {
        if (this.props.datas.id !== '-') {
            this.setState({ idStudent: Math.fround(100000 + parseInt(this.props.datas.id)).toString().slice(1) });
        }
    }
    openImage() {
        const uri = `${urlBase}/image/${safeDecode(this.props.datas.picture)}`;
        const fileName = uri.split('/').pop();
        RNFS.exists(`${CacheDir}/${fileName}`).then((val)=>{
            if (val) return this.props.openImageViewer(`file://${CacheDir}/${fileName}`);
            RNFS.downloadFile({ fromUrl: uri, toFile: `${CacheDir}/${fileName}` }).promise
            .then(()=>this.props.openImageViewer(`file://${CacheDir}/${fileName}`))
            .catch(()=>this.props.openImageViewer(Image.resolveAssetSource(ProfilePicture).uri));
        }).catch(()=>this.props.openImageViewer(Image.resolveAssetSource(ProfilePicture).uri));
    }
    render(): React.ReactNode {
        const cogRotation = this.state.cogRotate.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'Mi cuenta'} />
            </Appbar.Header>
            <ScrollView style={styles.content}>
                <View style={styles.imageContent}>
                    <Pressable style={styles.imagePressable} onPress={this.openImage}>
                        <ImageLazyLoad
                            source={{ uri: `${urlBase}/image/${safeDecode(this.props.datas.picture)}` }}
                            circle={true}
                            size={160}
                            noShadow={true}
                            style={{ zIndex: 2 }}
                        />
                        <Animated.View style={[styles.cogProfile, { transform: [{ rotate: cogRotation }] }]}>
                            <Cog width={240} height={240} />
                        </Animated.View>
                    </Pressable>
                    <Text style={styles.textName}>{safeDecode(this.props.datas.name)}</Text>
                </View>
                <List.Item
                    title={'ID Estudiante'}
                    description={this.state.idStudent}
                    left={(props)=><Icon {...props} size={32} name={'pound'} />}
                />
                <Divider />
                <List.Item
                    title={'Curso'}
                    description={safeDecode(this.props.datas.curse)}
                    left={(props)=><Icon {...props} size={32} name={'google-classroom'} />}
                />
                <Divider />
                <List.Item
                    title={'Número de documento'}
                    description={safeDecode(this.props.datas.dni)}
                    left={(props)=><Icon {...props} size={32} name={'card-account-details-outline'} />}
                />
                <Divider />
                <List.Item
                    title={'Fecha de nacimiento'}
                    description={safeDecode(this.props.datas.date)}
                    left={(props)=><Icon {...props} size={32} name={'cake-variant-outline'} />}
                />
                <Divider />
                <List.Item
                    title={'Número de teléfono'}
                    description={safeDecode(this.props.datas.tel)}
                    left={(props)=><Icon {...props} size={32} name={'card-account-phone-outline'} />}
                />
                {(this.props.datas.email)&&<>
                    <Divider />
                    <List.Item
                        title={'Correo electronico'}
                        description={safeDecode(this.props.datas.email)}
                        left={(props)=><Icon {...props} size={32} name={'at'} />}
                    />
                </>}
                <View style={styles.buttonLogOutContent}>
                    <Button mode={'contained'} style={styles.buttonLogOut} onPress={this.props.logOutAction}>Cerrar sesión</Button>
                </View>
            </ScrollView>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    imageContent: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 48,
        marginBottom: 24
    },
    imagePressable: {
        position: 'relative',
        width: 160,
        height: 160
    },
    cogProfile: {
        zIndex: 1,
        position: 'absolute',
        top: -40,
        left: -40
    },
    textName: {
        marginTop: 36,
        fontSize: 26,
        marginLeft: 12,
        marginRight: 12,
        alignItems: 'center',
        fontWeight: '600'
    },
    buttonLogOutContent: {
        width: '100%',
        alignItems: 'center',
        marginTop: 16,
        paddingBottom: 16
    },
    buttonLogOut: {
        width: '80%',
        maxWidth: 350
    }
});