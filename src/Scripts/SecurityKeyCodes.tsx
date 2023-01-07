import { encode } from "base-64";
import deviceInfoModule from "react-native-device-info";
import { ApiHeader } from "./ApiTecnica/types";

const keyCodeAdmin = encode('71b0@SVeX!m5kZ3XCe@6Uqfwtqu684SAyDsokT6x6$$Ov$5&Tl');
const keyCodeFamily = encode('g3rckKhS7D5ss^071wZT15Nb14SVP1ve*1O^bt#&YtwCeuv$#t');

export const SecurityHeaderAdmin: ApiHeader = {
    headers: {
        Authorization: keyCodeAdmin,
        AppVersion: deviceInfoModule.getVersion()
    }
};
export const SecurityHeaderFamily: ApiHeader = {
    headers: {
        Authorization: keyCodeFamily,
        AppVersion: deviceInfoModule.getVersion()
    }
};