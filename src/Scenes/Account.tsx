import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Divider, List, Text } from "react-native-paper";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import ImageLazyLoad from "../Components/ImageLazyLoad";
import { safeDecode } from "../Scripts/Utils";
import { urlBase } from "../Scripts/ApiTecnica";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type IProps = {
    datas: StudentsData;
    openImageViewer: (source: string)=>void;
};
type IState = {
    idStudent: string;
};

export default class Account extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            idStudent: '00000'
        };
    }
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.datas !== this.props.datas) this.setIdStudent();
    }
    componentDidMount(): void {
        this.setIdStudent();
        console.log(this.props.datas.email);
    }
    setIdStudent() {
        if (this.props.datas.id !== '-') {
            this.setState({ idStudent: Math.fround(100000 + parseInt(this.props.datas.id)).toString().slice(1) });
        }
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'Mi cuenta'} />
            </Appbar.Header>
            <ScrollView style={styles.content}>
                <View style={styles.imageContent}>
                    <ImageLazyLoad
                        source={{ uri: `${urlBase}/image/${safeDecode(this.props.datas.picture)}` }}
                        circle={true}
                        size={160}
                    />
                    <Text style={styles.textName}>{safeDecode(this.props.datas.name)}</Text>
                </View>
                <List.Item
                    title={'ID Estudiante'}
                    description={this.state.idStudent}
                    left={(props)=><Icon {...props} size={32} name={'pound'} />}
                />
                <Divider />
                <List.Item
                    title={'Curso'}
                    description={safeDecode(this.props.datas.curse)}
                    left={(props)=><Icon {...props} size={32} name={'google-classroom'} />}
                />
                <Divider />
                <List.Item
                    title={'Número de documento'}
                    description={safeDecode(this.props.datas.dni)}
                    left={(props)=><Icon {...props} size={32} name={'card-account-details-outline'} />}
                />
                <Divider />
                <List.Item
                    title={'Fecha de nacimiento'}
                    description={safeDecode(this.props.datas.date)}
                    left={(props)=><Icon {...props} size={32} name={'cake-variant-outline'} />}
                />
                <Divider />
                <List.Item
                    title={'Número de teléfono'}
                    description={safeDecode(this.props.datas.tel)}
                    left={(props)=><Icon {...props} size={32} name={'card-account-phone-outline'} />}
                />
                {(this.props.datas.email)&&<>
                    <Divider />
                    <List.Item
                        title={'Correo electronico'}
                        description={safeDecode(this.props.datas.email)}
                        left={(props)=><Icon {...props} size={32} name={'at'} />}
                    />
                </>}
            </ScrollView>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    imageContent: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 16,
        marginBottom: 24
    },
    textName: {
        marginTop: 24,
        fontSize: 26,
        marginLeft: 12,
        marginRight: 12,
        alignItems: 'center'
    }
});