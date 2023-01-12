import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import RNScreenshotPrevent from 'react-native-screenshot-prevent';
import { Theme, ThemeNavigation } from "../Scripts/Theme";
import TabBar from "./Schedule/TabBar";

type IProps = {};
type IState = {};

const Tab = createMaterialTopTabNavigator();

export default class Schedule extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'Mi horario'} />
            </Appbar.Header>
            <View style={styles.content}>
                <NavigationContainer theme={ThemeNavigation}>
                    <Tab.Navigator tabBarPosition={'bottom'} screenOptions={{ tabBarScrollEnabled: true }} tabBar={(props)=><TabBar {...props} />}>
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