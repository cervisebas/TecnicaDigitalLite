import React, { PureComponent, createRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import WelcomeCard from "./Home/WelcomeCard";
import AssistCard from "./Home/AssistCard";
import { FamilyDataAssist, StudentsData } from "../Scripts/ApiTecnica/types";
import { safeDecode } from "../Scripts/Utils";
import CardCredential, { CardCredentialRef } from "./Home/CardCredential";

type IProps = {
    datas: StudentsData;
    openChangeDesign: ()=>void;
    openImageViewer: (source: string)=>void;
    controllerAlert: (visible: boolean, title?: string, message?: string)=>void;
    openViewDetailsAssist: (datas: FamilyDataAssist[])=>void;
};
type IState = {};

export default class Home extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    public refCardCredential = createRef<CardCredentialRef>();
    
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'TecnicaDigital'} />
            </Appbar.Header>
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollView}>
                <WelcomeCard namestudent={safeDecode(this.props.datas.name)} />
                <AssistCard
                    id={this.props.datas.id}
                    openDetailsAssit={this.props.openViewDetailsAssist}
                />
                <CardCredential
                    ref={this.refCardCredential}
                    dni={this.props.datas.dni}
                    name={this.props.datas.name}
                    curse={this.props.datas.curse}
                    image={this.props.datas.picture}
                    openChangeDesign={this.props.openChangeDesign}
                    openImageViewer={this.props.openImageViewer}
                    controllerAlert={this.props.controllerAlert}
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