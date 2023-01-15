import React, { PureComponent } from "react";
import CustomModal from "../Components/CustomModal";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { Theme, ThemeNavigation } from "../Scripts/Theme";
import { FamilyDataAssist } from "../Scripts/ApiTecnica/types";
import moment from "moment";
import { decode } from "base-64";
import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabBar from "../Scenes/Schedule/TabBar";
import ViewAssistPanel from "./ViewDetailsAssist/ViewAssistPanel";
import { NavigationContainer } from "@react-navigation/native";

type DataAssist = {
    label: string;
    key: string;
    dateInt: number;
    data: FamilyDataAssist[];
};

type IProps = {};
type IState = {
    visible: boolean;
    datas: DataAssist[];
};

const Tab = createMaterialTopTabNavigator();

export default class ViewDetailsAssist extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            datas: []
        };
        this.close = this.close.bind(this);
    }
    private after: FamilyDataAssist[] = [];
    
    open(assist: FamilyDataAssist[]) {
        let datas: DataAssist[] = [];
        if (this.after !== assist) {
            assist.forEach((value)=>{
                const tDate = moment(decode(value.date), 'DD/MM/YYYY').format('MMMM (YYYY)');
                const findIndex = datas.findIndex((v)=>v.label == tDate);
                if (findIndex !== -1) return datas[findIndex].data.push(value);
                const dateInt = moment(decode(value.date), 'DD/MM/YYYY').toDate().getTime();
                datas.push({
                    label: tDate,
                    key: tDate.replace(/\ /gi, '-').toLowerCase(),
                    dateInt,
                    data: [value]
                });
            });
            this.after = assist;
        } else datas = this.state.datas;
        this.setState({ visible: true, datas });
    }
    close() {
        this.setState({ visible: false });
    }
    _renderScreens(data: DataAssist) {
        return(<Tab.Screen key={data.key} name={data.label} children={()=><ViewAssistPanel datas={data.data} />} />);
    }
    _tabBar(props: MaterialTopTabBarProps) { return(<TabBar {...props} />); }
    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close} animationIn={'fadeInRight'} animationInTiming={200} animationOut={'fadeOutLeft'} animationOutTiming={200} backdropTransitionInTiming={0} backdropTransitionOutTiming={0} useBackdrop={false}>
            <View style={styles.content}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={this.close} />
                    <Appbar.Content title={'Ver detalles asistencia'} />
                </Appbar.Header>
                <View style={{ flex: 1 }}>
                    <NavigationContainer theme={ThemeNavigation}>
                        <Tab.Navigator tabBarPosition={'bottom'} tabBar={this._tabBar}>
                            {this.state.datas.map(this._renderScreens)}
                        </Tab.Navigator>
                    </NavigationContainer>
                </View>
            </View>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: Theme.colors.background
    }
});