import React, { PureComponent } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import ViewShot from "react-native-view-shot";
import WelcomeCard from "./Home/WelcomeCard";
import AssistCard from "./Home/AssistCard";

type IProps = {};
type IState = {};

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
                <WelcomeCard
                    namestudent={'Nombre del estudiante'}
                />
                <AssistCard
                    isLoading={false}
                    isError={false}
                    isDisableDetailAssist={true}
                    messageError={"Ocurrio un error..."}
                    assist={"1"}
                    notAssist={"2"}
                    total={"6"}
                    reloadAssist={()=>undefined}
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