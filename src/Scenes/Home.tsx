import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import WelcomeCard from "./Home/WelcomeCard";
import AssistCard from "./Home/AssistCard";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import { decode } from "base-64";

type IProps = {
    datas: StudentsData;
};
type IState = {};

const safeDecode = (str: string)=>{
    try {
        return decode(str);
    } catch  {
        return str;
    }
}

export default class Home extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'TecnicaDigital'} />
            </Appbar.Header>
            <View style={styles.content}>
                <WelcomeCard namestudent={safeDecode(this.props.datas.name)} />
                <AssistCard
                    id={this.props.datas.id}
                    openDetailsAssit={()=>undefined}
                />
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column'
    }
});