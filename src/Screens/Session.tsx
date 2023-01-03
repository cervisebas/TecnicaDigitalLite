import React, { PureComponent } from "react";
import CustomModal from "../Components/CustomModal";
import { Dimensions, Keyboard, PixelRatio, StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Theme } from "../Scripts/Theme";
import { LinearGradient } from "../Components/LinearGradient";
import ParticleBackground from "../Components/ParticleBackground";
import { Text, MD2Colors, TextInput, Button } from "react-native-paper";

type IProps = {};
type IState = {
    visible: boolean;
    formDNI: string;
};

export default class Session extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: true,
            formDNI: ''
        };
    }
    private particleSize = PixelRatio.getPixelSizeForLayoutSize(8);
    private particleNumber = Math.floor(Dimensions.get('window').width / this.particleSize);
    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible}>
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    {(!this.state.visible)&&<ParticleBackground
                        containerStyle={styles.backgroundParticles}
                        particleNumber={this.particleNumber}
                        particleSize={this.particleSize}
                        particleDispersion={32}
                        particleColor={"rgba(0, 163, 255, 1)"}
                        backgroundColor={"transparent"}
                    />}
                    <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 163, 255, 1)']} style={styles.gradient} />
                    <View style={styles.content0}>
                        <View style={styles.contentPrimary}>
                            <CustomTitle />
                            <TextInput
                                label={'D.N.I'}
                                value={this.state.formDNI}
                                style={styles.textinput}
                            />
                            <Button
                                mode={'contained'}
                                style={styles.button}
                                onPress={()=>console.log('Hello word!!!')}
                            >Iniciar Sesión</Button>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </CustomModal>);
    }
}

const CustomTitle = React.memo(function (props: { style?: StyleProp<ViewStyle>; }) {
    return(<View style={[props.style, { alignItems: 'center' }]}>
        <Text style={styles.titleContent}>Bienvenid@ a</Text>
        <Text>
            <Text style={styles.title1}>Tecnica</Text>
            <Text style={styles.title2}>Digital</Text>
        </Text>
    </View>);
})

const styles = StyleSheet.create({
    // ·········· Title ··········
    titleContent: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#000000"
    },
    title1: {
        fontSize: 36,
        fontWeight: 'bold',
        color: MD2Colors.red500,
        textShadowColor: 'rgba(244, 67, 54, 0.4)',
        textShadowOffset: {
            width: -1,
            height: 1
        },
        textShadowRadius: 2
    },
    title2: {
        fontSize: 36,
        fontWeight: 'bold',
        color: MD2Colors.blue800,
        textShadowColor: 'rgba(21, 101, 192, 0.4)',
        textShadowOffset: {
            width: -1,
            height: 1
        },
        textShadowRadius: 2
    },
    // ···························
    content: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        overflow: 'hidden'
    },
    content0: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundParticles: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    gradient: {
        width: '100%',
        height: '100%'
    },
    contentPrimary: {
        width: '100%',
        alignItems: 'center'
    },
    textinput: {
        width: '90%',
        marginTop: 26
    },
    button: {
        marginTop: 12
    }
});