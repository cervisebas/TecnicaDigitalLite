import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import WelcomeCard from "./Home/WelcomeCard";
import AssistCard from "./Home/AssistCard";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import { safeDecode } from "../Scripts/Utils";
import CardCredential from "./Home/CardCredential";

type IProps = {
    datas: StudentsData;
    openChangeDesign: ()=>void;
};
type IState = {};

export default class Home extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    componentDidMount(): void {
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
                <CardCredential
                    dni={this.props.datas.dni}
                    name={this.props.datas.name}
                    curse={this.props.datas.curse}
                    image={this.props.datas.picture}
                    openChangeDesign={this.props.openChangeDesign}
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