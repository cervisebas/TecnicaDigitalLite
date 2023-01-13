import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import React, { PureComponent, createRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Button, Text } from "react-native-paper";
//import RNScreenshotPrevent from 'react-native-screenshot-prevent';
import { ThemeNavigation } from "../Scripts/Theme";
import TabBar from "./Schedule/TabBar";
import moment from "moment";
import "moment/locale/es";
import { waitTo } from "../Scripts/Utils";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import scheduleProcess, { DayData } from "./Schedule/ScheduleProcess";
import { Family } from "../Scripts/ApiTecnica";
import SchedulePage from "./Schedule/SchedulePage";

type IProps = {
    datas: StudentsData;
};
type IState = {
    isLoading: boolean;
    isError: boolean;
    messageError: string;
    transformY: Animated.Value;
    opacity: Animated.Value;
    datas: DayData[] | undefined;
};

const Tab = createMaterialTopTabNavigator();

export default class Schedule extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false,
            messageError: 'Ocurrió un error inesperado.',
            transformY: new Animated.Value(0),
            opacity: new Animated.Value(1),
            datas: undefined
        };
        this.goToDay = this.goToDay.bind(this);
        this.goLoading = this.goLoading.bind(this);
        // Day's
        this._monday = this._monday.bind(this);
        this._tuesday = this._tuesday.bind(this);
        this._wednesday = this._wednesday.bind(this);
        this._thursday = this._thursday.bind(this);
        this._friday = this._friday.bind(this);
    }
    private refNavigationContainer = createRef<NavigationContainerRef<ReactNavigation.RootParamList>>();
    private actualId = '-1';
    componentDidMount(): void {
        this.goLoading();
    }
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.datas.id !== this.props.datas.id)
            if (this.actualId !== this.props.datas.id)
                this.goLoading();
    }
    setLoading(state: boolean): Promise<void> {
        return new Promise((resolve)=>{
            let op = (state)? 1: 0;
            let ty = (state)? 0: 30;
            let dr = (state)? 0: 250;
            Animated.parallel([
                Animated.timing(this.state.transformY, { toValue: ty, duration: dr, useNativeDriver: true }),
                Animated.timing(this.state.opacity, { toValue: op, duration: 250, useNativeDriver: true })
            ]).start(resolve as any);
        });
    }
    setStateSync(state: Parameters<typeof this.setState>[0]): Promise<void> {
        return new Promise((resolve)=>this.setState(state, resolve));
    }
    async goLoading() {
        try {
            if (this.props.datas.id == '-') return;
            this.actualId = this.props.datas.id;
            await this.setStateSync({ isLoading: true, isError: false } as any);
            await this.setLoading(true);
            const getData = await Family.getSchedule(this.props.datas.curse);
            const datas = await scheduleProcess(getData.data);
            await this.setLoading(false);
            await this.setStateSync({ datas, isLoading: false } as any);
        } catch (error) {
            let messageError = ((error as any).cause !== undefined)? (error as any).cause: 'Ocurrió un error inesperado.';
            await this.setLoading(false);
            this.setState({ isLoading: false, isError: true, messageError });
        }
    }
    async goToDay() {
        try {
            const today = moment();
            today.locale('es');
            let dayName = today.format('dddd');
            dayName = dayName.charAt(0).toUpperCase()+dayName.slice(1);
            if (dayName.indexOf('Sábado') == -1 && dayName.indexOf('Domingo') == -1) {
                await waitTo(1000);
                this.refNavigationContainer.current?.navigate(dayName as never);
            }
        } catch (error) {
            console.log(error);
        }
    }
    _tabBar(props: MaterialTopTabBarProps) {
        return(<TabBar {...props} />);
    }

    // Days
    _monday() { return(<SchedulePage datas={this.state.datas![0]} />); }
    _tuesday() { return(<SchedulePage datas={this.state.datas![1]} />); }
    _wednesday() { return(<SchedulePage datas={this.state.datas![2]} />); }
    _thursday() { return(<SchedulePage datas={this.state.datas![3]} />); }
    _friday() { return(<SchedulePage datas={this.state.datas![4]} />); }

    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'Mi horario'} />
            </Appbar.Header>
            <View style={styles.content}>
                {(this.state.isLoading)? <Animated.View style={[styles.contentLoading, { opacity: this.state.opacity, transform: [{ translateY: this.state.transformY }] }]}>
                    <ActivityIndicator animating={true} size={'large'} />
                    <Text style={styles.textLoading}>Obteniendo información...</Text>
                </Animated.View>:
                (this.state.isError)? <View style={styles.contentLoading}>
                    <Text style={styles.textError}>{this.state.messageError}</Text>
                    <Button icon={'reload'} mode={'contained'} style={styles.buttonError} onPress={this.goLoading}>Reintentar</Button>
                </View>:
                (this.state.datas)&&<NavigationContainer ref={this.refNavigationContainer} onReady={this.goToDay} theme={ThemeNavigation}>
                    <Tab.Navigator tabBarPosition={'bottom'} tabBar={this._tabBar}>
                        <Tab.Screen name={'Lunes'} children={this._monday} />
                        <Tab.Screen name={'Martes'} children={this._tuesday} />
                        <Tab.Screen name={'Miercoles'} children={this._wednesday} />
                        <Tab.Screen name={'Jueves'} children={this._thursday} />
                        <Tab.Screen name={'Viernes'} children={this._friday} />
                    </Tab.Navigator>
                </NavigationContainer>}
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    contentLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    textLoading: {
        marginTop: 24,
        fontSize: 16
    },
    textError: {
        fontSize: 15,
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        textAlign: 'center'
    },
    buttonError: {
        marginTop: 24
    }
});