import { AddressInfo } from "net";

/** Keyboard Key Values Interface */
export interface ConstantKeys {
    ENTER: number;
    CTRL: number;
}

/** Server Data Values Interface */
export interface ServerData {
    address: AddressInfo;   // HOST/PORT/FAMILY(IPv4/IPv6)
}