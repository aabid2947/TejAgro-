import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import RightTickBackground from '../../svg/RightTickBackground';
import { BLACK } from '../../shared/common-styles/colors';

const MyRefferral = ({ data }: any) => {

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.memberItem}>
                    <Image
                        source={require('../../assets/Background_Referral.png')}
                        style={styles.memberImage}
                    />
                    <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{item.name}</Text>
                        <View style={styles.statusView}>
                            <RightTickBackground height={15} width={15} />
                            <Text style={styles.memberStatus}>{item.status}</Text>
                        </View>
                    </View>
                    <View style={styles.countView}>
                        <Text style={styles.orderCountStyle}>{item?.id}</Text>
                    </View>
                </View>
            )}
            ListHeaderComponent={() =>
                <Text style={styles.headerText}>Joined Members</Text>
            }

        />
    );
};

const styles = StyleSheet.create({
    memberItem: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    memberImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerText: {
        marginHorizontal: 20,
        marginVertical: 10,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '700',
        color: BLACK
    },
    memberInfo: {
        marginLeft: 10,
        justifyContent: 'center',
        flex: 1
    },
    orderCountStyle: {
        color: BLACK,
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'center'
    },
    countView: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    memberName: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 21,
        color: BLACK
    },
    memberStatus: {
        fontSize: 14,
        color: BLACK, // 'red' if not placed
        lineHeight: 18,
        fontWeight: '400'
    },
    statusView: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
})

export default MyRefferral;
