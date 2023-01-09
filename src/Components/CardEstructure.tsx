import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import { DesingsCardsType } from "../Scripts/DesingsCardsType";
import { urlBase } from "../Scripts/ApiTecnica";
import { getForScale, safeDecode } from "../Scripts/Utils";
import Barcode from "@kichiyaki/react-native-barcode-generator";

type IProps = {
    scale: number;
    dni: string;
    name: string;
    image: string;
    designEstructure: DesingsCardsType;
};

export default React.memo(function CardEstructure(props: IProps) {
    return(<>
        <Image
            source={props.designEstructure.background}
            style={style.background}
            resizeMethod={'auto'}
            resizeMode={'cover'}
        />
        {(props.designEstructure.image)&&<Image
            source={{ uri: `${urlBase}/image/${safeDecode(props.image)}` }}
            resizeMethod={'auto'}
            resizeMode={'cover'}
            style={{
                position: 'absolute',
                top: getForScale(props.scale, props.designEstructure.image.y),
                left: getForScale(props.scale, props.designEstructure.image.x),
                width: getForScale(props.scale, props.designEstructure.image.width),
                height: getForScale(props.scale, props.designEstructure.image.height),
                borderWidth: (props.designEstructure.image.borderWidth)? getForScale(props.scale, props.designEstructure.image.borderWidth): undefined,
                borderColor: props.designEstructure.image.borderColor,
                borderRadius: getForScale(props.scale, props.designEstructure.image.borderRadius)
            }}
        />}
        <Text
            style={{
                position: 'absolute',
                top: getForScale(props.scale, props.designEstructure.name.y),
                left: getForScale(props.scale, props.designEstructure.name.x),
                width: getForScale(props.scale, props.designEstructure.name.width),
                height: (props.designEstructure.name.height)? getForScale(props.scale, props.designEstructure.name.height): undefined,
                color: props.designEstructure.name.color,
                fontSize: getForScale(props.scale, props.designEstructure.name.fontSize),
                fontFamily: props.designEstructure.name.fontFamily,
                fontWeight: props.designEstructure.name.fontWeight,
                textAlign: props.designEstructure.name.textAlign,
                textShadowColor: props.designEstructure.name.textShadowColor,
                textShadowOffset: props.designEstructure.name.textShadowOffset,
                textShadowRadius: props.designEstructure.name.textShadowRadius
            }}
            numberOfLines={props.designEstructure.name.maxNumberLines}
        >{safeDecode(props.name)}</Text>
        <Barcode
            value={`eest${safeDecode(props.dni)}`}
            width={getForScale(props.scale, props.designEstructure.barcode.width)}
            maxWidth={getForScale(props.scale, props.designEstructure.barcode.width)}
            height={getForScale(props.scale, props.designEstructure.barcode.height)}
            style={{
                position: 'absolute',
                top: getForScale(props.scale, props.designEstructure.barcode.y),
                left: getForScale(props.scale, props.designEstructure.barcode.x)
            }}
        />
    </>);
});

const style = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%'
    }
});