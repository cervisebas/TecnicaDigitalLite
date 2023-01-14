import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { StudentsData } from "../Scripts/ApiTecnica/types";
import ImageLazyLoad from "../Components/ImageLazyLoad";
import { safeDecode } from "../Scripts/Utils";
import { urlBase } from "../Scripts/ApiTecnica";

type IProps = {
    datas: StudentsData;
    openImageViewer: (source: string)=>void;
};
type IState = {};

export default class Account extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'Mi cuenta'} />
            </Appbar.Header>
            <View style={styles.content}>
                <View style={styles.imageContent}>
                    <ImageLazyLoad
                        source={{ uri: `${urlBase}/image/${safeDecode(this.props.datas.picture)}` }}
                        circle={true}
                        size={160}
                    />
                    <Text style={styles.textName}>{safeDecode(this.props.datas.name)}</Text>
                </View>
            </View>
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
        paddingTop: 16
    },
    textName: {
        marginTop: 24,
        fontSize: 28,
        marginLeft: 12,
        marginRight: 12,
        alignItems: 'center'
    }
});