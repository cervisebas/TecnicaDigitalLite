import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import React, { PureComponent, createRef } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import RNScreenshotPrevent from 'react-native-screenshot-prevent';
import { Theme, ThemeNavigation } from "../Scripts/Theme";
import TabBar from "./Schedule/TabBar";
import moment from "moment";
import "moment/locale/es";
import { waitTo } from "../Scripts/Utils";

type IProps = {};
type IState = {};

const Tab = createMaterialTopTabNavigator();

export default class Schedule extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    private refNavigationContainer = createRef<NavigationContainerRef<ReactNavigation.RootParamList>>();
    componentDidMount(): void {
        const today = moment();
        today.locale('es');
        let dayName = today.format('dddd');
        dayName = dayName.charAt(0).toUpperCase()+dayName.slice(1);
        if (dayName.indexOf('Sábado') == -1 && dayName.indexOf('Domingo') == -1) this.goToDay(dayName);
    }
    async goToDay(day: string) {
        try {
            let ready = this.refNavigationContainer.current?.isReady();
            while (!ready) {
                let newReady = this.refNavigationContainer.current?.isReady();
                ready = newReady;
                if (newReady) (this.refNavigationContainer.current?.navigate as any)({ name: day, merge: true }); else await waitTo(500);
            }
        } catch (error) {
            console.log(error);
        }
    }
    _tabBar(props: MaterialTopTabBarProps) {
        return(<TabBar {...props} />);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'Mi horario'} />
            </Appbar.Header>
            <View style={styles.content}>
                <NavigationContainer ref={this.refNavigationContainer} theme={ThemeNavigation}>
                    <Tab.Navigator tabBarPosition={'bottom'} tabBar={this._tabBar}>
                        <Tab.Screen name={'Lunes'} children={()=><></>} />
                        <Tab.Screen name={'Martes'} children={()=><></>} />
                        <Tab.Screen name={'Miercoles'} children={()=><></>} />
                        <Tab.Screen name={'Jueves'} children={()=><></>} />
                        <Tab.Screen name={'Viernes'} children={()=><></>} />
                    </Tab.Navigator>
                </NavigationContainer>
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    }
});