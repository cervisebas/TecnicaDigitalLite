import React from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Divider, List, MD2Colors, Text } from "react-native-paper";
import { FamilyDataAssist } from "../../Scripts/ApiTecnica/types";
import { decode } from "base-64";

type IProps = {
    datas: FamilyDataAssist[];
};

export default React.memo(function ViewAssistPanel(props: IProps) {
    function _renderItem({ item }: ListRenderItemInfo<FamilyDataAssist>) {
        return(<List.Item
            key={`detail-assist-${item.id}`}
            title={`${decode(item.date)}`}
            description={`${(item.status)? 'Presente': 'Ausente'} ${(item.credential)? ' (Accedió con credencial)': ''}`}
            right={()=><View style={styles.itemRight}><Text>{decode(item.hour)}</Text></View>}
            left={()=><List.Icon
                icon={(item.status)? 'radiobox-marked': 'radiobox-blank'}
                color={(item.status)? MD2Colors.blue500: MD2Colors.red500}
            />}
            style={styles.item}
        />);
    }
    function _keyExtractor({ id }: FamilyDataAssist) {
        return `detail-assist-${id}`;
    }
    function _getItemLayout(_data: FamilyDataAssist[] | null | undefined, index: number) {
        return {
            length: 70,
            offset: 70 * index,
            index
        };
    }
    function _ItemSeparatorComponent() {
        return(<Divider />);
    }
    return(<View style={{ flex: 3 }}>
        <FlatList
            data={props.datas}
            ItemSeparatorComponent={_ItemSeparatorComponent}
            keyExtractor={_keyExtractor}
            getItemLayout={_getItemLayout}
            renderItem={_renderItem}
        />
    </View>);
});

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 70,
        paddingLeft: 16
    },
    itemRight: {
        height: '100%',
        justifyContent: 'center'
    }
});