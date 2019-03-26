import { AddressInfo } from "net";
import { ClientNode } from "../Client/ClientNode";

/** Keyboard Key Values Interface */
export interface ConstantKeys {
    ENTER: number;
    CTRL: number;
}

/** Server Data Values Interface */
export interface ServerData {
    address: AddressInfo;   // HOST/PORT/FAMILY(IPv4/IPv6)
    node?: any;             // Node Type Hooked to Data
}