// utxo summary component

import React from 'react';
import { StyleSheet } from 'react-native';

import { Box, Text } from 'native-base';
import BtcInput from 'src/assets/images/btc_input.svg';
import WalletIcon from 'src/assets/images/wallet_color.svg';

export default function UtxoSummary({ utxoCount, totalAmount }) {
    return (
        <Box style={styles.utxo}>
            <WalletIcon />
            <Box style={styles.utxoSummary}>
                <Box style={styles.utxoTextDirection}>
                    <Text style={styles.noOfUtxo}>{utxoCount} </Text>
                    <Text color="light.secondaryText">Utxo's Selected</Text>
                </Box>
                <Box style={styles.sats}>
                    <BtcInput />
                    <Text color="light.secondaryText"> {totalAmount}</Text>
                </Box>
            </Box>
        </Box>
    )
}

const styles = StyleSheet.create({
    utxo: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        marginTop: 20,
        marginLeft: 20
    },
    utxoSummary: {
        marginTop: 10,
    },
    noOfUtxo: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    utxoTextDirection: {
        flexDirection: 'row',
    },
    sats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});