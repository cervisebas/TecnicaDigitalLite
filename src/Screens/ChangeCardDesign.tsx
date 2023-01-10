import React, { PureComponent } from "react";
import CustomModal from "../Components/CustomModal";
import { Dimensions, EmitterSubscription, FlatList, Image, ListRenderItemInfo, Pressable, ScaledSize, StyleSheet, View } from "react-native";
import { Theme } from "../Scripts/Theme";
import { Appbar, TouchableRipple } from "react-native-paper";
import ExampleCards from "../Scripts/ExampleCards";
import { getForScale } from "../Scripts/Utils";

type IProps = {};
type IState = {
    visible: boolean;
    scale: number;
};

export default class ChangeCardDesign extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: true,
            scale: 0
        };
        this.close = this.close.bind(this);
        this.changeScale = this.changeScale.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }
    private event: EmitterSubscription | undefined = undefined;

    componentDidMount(): void {
        this.event = Dimensions.addEventListener('change', this.changeScale);
        let window = Dimensions.get('window');
        this.changeScale({ window });
    }
    componentWillUnmount(): void {
        this.event?.remove();
    }
    changeScale({ window }: { window: ScaledSize; }) {
        let width = window.width - 16;
        let finding = true;
        let scaleImage = 1;
        while (finding) {
            if ((1200 * scaleImage) < width) {
                this.setState({ scale: scaleImage });
                finding = false;
            } else {
                scaleImage -= 0.001;
            }
        }
    }
    _renderItem({ item }: ListRenderItemInfo<{ id: number; image: any; }>) {
        return(<ItemImage
            id={item.id}
            image={item.image}
            scale={this.state.scale}
        />);
    }
    open() {
        this.setState({ visible: true });
    }
    close() {
        this.setState({ visible: false });
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close} animationIn={'fadeInRight'} animationOut={'fadeOutLeft'} backdropTransitionOutTiming={0} useBackdrop={false}>
            <View style={styles.content}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={this.close} />
                    <Appbar.Content title={'Lista de diseños'} />
                </Appbar.Header>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={ExampleCards}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        </CustomModal>);
    }
}

type IProps2 = {
    id: number;
    image: any;
    scale: number;
    onPress?: (id: number)=>void;
};
const ItemImage = React.memo(function (props: IProps2) {
    function onPress() {
        if (props.onPress) props.onPress(props.id);
    }
    return(<TouchableRipple style={[styles.itemTouch, { width: getForScale(props.scale, 1200), height: getForScale(props.scale, 779) }]} onPress={onPress}>
        <Image
            source={props.image}
            style={styles.itemImage}
            resizeMethod={'auto'}
            resizeMode={'cover'}
        />
    </TouchableRipple>);
});

const styles = StyleSheet.create({
    content: {
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: Theme.colors.background
    },
    itemTouch: {
        overflow: 'hidden',
        borderRadius: 12,
        borderColor: '#000000',
        borderWidth: 2,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
        marginBottom: 4
    },
    itemImage: {
        width: '100%',
        height: '100%'
    }
});