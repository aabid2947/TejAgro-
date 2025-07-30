import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import { ProductListStyle } from '../productlist/ProductListStyle';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import TopHeaderFixed from '../../components/headerview/TopHeaderFixed';
import NoRecordFound from '../../components/noRecordFound/NoRecordFound';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import { DashboardStyle } from '../dashboard/DashboardStyle';
import { ReferralItem } from '../../components/commonComponent/ReferralItem';

const data = [
    { "id": 1, "name": "Referred Yogita", "price": "Earned ₹ 150" },
    { "id": 2, "name": "Referred Deep", "price": "Earned ₹ 150" },
    { "id": 3, "name": "Yash Used Your Referral", "price": "Earned ₹ 300" },
    { "id": 4, "name": "Referred Deepveer", "price": "Earned ₹ 150" }
]

const MyRewards = ({ navigation }: any) => {
    const { t } = useTranslation();
    const [isLoader, setLoader] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
        }, 1000)
    }

    return (
        <SafeAreaView style={ProductListStyle.main}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t('₹ 750 Rewards Earned')}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            <View style={ProductListStyle.container}>
                {isLoader ?
                    <LoaderScreen /> :
                    <FlatList
                        data={data}
                        numColumns={2}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item, index }: any) => <ReferralItem data={item} index={index} />}
                        ListEmptyComponent={<NoRecordFound style={ProductListStyle.noDataTxt} />}
                        refreshing={refresh}
                        ListHeaderComponent={() => {
                            return (
                                <TextPoppinsMediumBold style={ProductListStyle.headerText}>
                                    {t('My Rewards')}
                                </TextPoppinsMediumBold>
                            )
                        }}
                        onRefresh={onRefresh}
                        columnWrapperStyle={DashboardStyle.columnView}
                        showsVerticalScrollIndicator={false}
                    />
                }
            </View>
        </SafeAreaView >
    );
};

export default MyRewards;
