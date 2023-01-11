import React, { PureComponent, createRef } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import WelcomeCard from "./Home/WelcomeCard";
import AssistCard from "./Home/AssistCard";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import { safeDecode } from "../Scripts/Utils";
import CardCredential, { CardCredentialRef } from "./Home/CardCredential";

type IProps = {
    datas: StudentsData;
    openChangeDesign: ()=>void;
};
type IState = {};

export default class Home extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    public refCardCredential = createRef<CardCredentialRef>();

    componentDidMount(): void {

    }

    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'TecnicaDigital'} />
            </Appbar.Header>
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollView}>
                <WelcomeCard namestudent={safeDecode(this.props.datas.name)} />
                <AssistCard
                    id={this.props.datas.id}
                    openDetailsAssit={()=>undefined}
                />
                <CardCredential
                    ref={this.refCardCredential}
                    dni={this.props.datas.dni}
                    name={this.props.datas.name}
                    curse={this.props.datas.curse}
                    image={this.props.datas.picture}
                    openChangeDesign={this.props.openChangeDesign}
                />
            </ScrollView>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column'
    },
    scrollView: {
        paddingBottom: 12
    }
});