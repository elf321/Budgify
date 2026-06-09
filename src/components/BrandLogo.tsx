import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type BrandLogoProps = {
    size?: number;
};

const BrandLogo = ({ size = 56 }: BrandLogoProps) => {
    const scale = size / 56;

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: 18 * scale,
                },
            ]}
        >
            <View
                style={[
                    styles.wallet,
                    {
                        width: 34 * scale,
                        height: 24 * scale,
                        borderRadius: 8 * scale,
                        borderWidth: Math.max(2, 2.5 * scale),
                    },
                ]}
            >
                <View
                    style={[
                        styles.walletPocket,
                        {
                            width: 12 * scale,
                            height: 8 * scale,
                            borderRadius: 4 * scale,
                            right: -2 * scale,
                        },
                    ]}
                />
                <Text
                    style={[
                        styles.logoText,
                        {
                            fontSize: 18 * scale,
                            lineHeight: 22 * scale,
                        },
                    ]}
                >
                    B
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 4,
    },
    wallet: {
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    walletPocket: {
        position: 'absolute',
        backgroundColor: colors.primarySoft,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    logoText: {
        color: '#FFFFFF',
        fontWeight: '900',
    },
});

export default BrandLogo;
