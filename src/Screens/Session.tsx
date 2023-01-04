import React, { PureComponent } from "react";
import CustomModal from "../Components/CustomModal";
import { Dimensions, Keyboard, PixelRatio, StatusBar, StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Theme } from "../Scripts/Theme";
import { LinearGradient } from "../Components/LinearGradient";
import ParticleBackground from "../Components/ParticleBackground";
import { Text, MD2Colors, TextInput, Button } from "react-native-paper";
import SystemNavigationBar from "react-native-system-navigation-bar";

type IProps = {};
type IState = {
    visible: boolean;
    formDNI: string;
};

const onlyNumber = /^[0-9]+$/;

export default class Session extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            formDNI: ''
        };
        this._onChangeText = this._onChangeText.bind(this);
        this.close = this.close.bind(this);
    }
    private particleSize = PixelRatio.getPixelSizeForLayoutSize(8);
    private particleNumber = Math.floor(Dimensions.get('window').width / this.particleSize);
    private isColored = false;
    _onChangeText(text: string) {
        if (text.length == 0) return this.setState({ formDNI: text });
        if (onlyNumber.test(text)) this.setState({ formDNI: text });
    }


    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevState.visible !== this.state.visible) {
            if (this.state.visible) {
                if (!this.isColored) {
                    SystemNavigationBar.setNavigationColor("rgba(0, 163, 255, 1)", 'dark');
                    StatusBar.setBackgroundColor('rgba(0, 163, 255, 0.1)');
                    StatusBar.setBarStyle('dark-content');
                    this.isColored = true;
                    console.log('Show');
                }
            } else if (this.isColored) {
                SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
                StatusBar.setBackgroundColor('#FFFFFF');
                StatusBar.setBarStyle('dark-content');
                this.isColored = false;
                console.log('Hide');
            }
        }
    }

    // Controller
    open() {
        this.setState({ visible: true });
    }
    close() {
        this.setState({ visible: false });
    }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} removeAnimationIn animationOut={'fadeOut'} animationOutTiming={600}>
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    {(/*!this.state.visible*/ false !== false)&&<ParticleBackground
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
                                maxLength={8}
                                onChangeText={this._onChangeText}
                                returnKeyType={'send'}
                                keyboardType={'number-pad'}
                            />
                            <Button
                                mode={'contained'}
                                style={styles.button}
                                onPress={this.close}
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