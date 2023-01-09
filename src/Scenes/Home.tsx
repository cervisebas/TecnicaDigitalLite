import React, { PureComponent, createRef } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import WelcomeCard from "./Home/WelcomeCard";
import AssistCard from "./Home/AssistCard";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import { safeDecode } from "../Scripts/Utils";
import CardComponent, { CardComponentRef } from "../Components/CardComponent";

type IProps = {
    datas: StudentsData;
};
type IState = {};

export default class Home extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    private refCardComponent = createRef<CardComponentRef>();

    componentDidMount(): void {
        this.refCardComponent.current?.setScale(0.32);
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
                <CardComponent
                    ref={this.refCardComponent}
                    dni={this.props.datas.dni}
                    //name={this.props.datas.name}
                    name={'TGF1dGFybyBTZWLhc3RpYW4gQ2VydmnxbyBHYXJj7WE='}
                    image={this.props.datas.picture}
                    designID={12}
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