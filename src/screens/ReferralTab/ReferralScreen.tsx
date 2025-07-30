import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    Pressable,
    Text,
    View
} from 'react-native';
import AlertModal from '../../components/alertmodal/AlertModal';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import { MDBLUE } from '../../shared/common-styles/colors';
import { headerViewReferral } from '../../shared/components/CommonUtilities';
import AllPrice from './AllPrice';
import InviteFarmer from './InviteFarmer';
import MyRefferral from './MyReferral';
import { ReferralStyle } from './ReferralStyle';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';

type Member = {
    id: string;
    name: string;
    status: 'Order placed' | 'Order not placed';
};

const members: Member[] = [
    { id: '01', name: 'Kalpit Yash Ganesh', status: 'Order placed' },
    { id: '02', name: 'Kalpit Yash Ganesh', status: 'Order placed' },
    { id: '03', name: 'Kalpit Yash Ganesh', status: 'Order placed' },
    { id: '04', name: 'Kalpit Yash Ganesh', status: 'Order placed' },
];


const ReferralScreen = ({ navigation }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const [tabSelect, setTab] = useState(1)
    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN)
    }

    const onPressTab = (value: number) => {
        setTab(value)
    }

    const referCountView = (value: any, title: any, subTitle: any, imageName?: any) => {
        return (
            <>
                <View style={ReferralStyle.referralContainer}>
                    <Text style={ReferralStyle.referralText}>{title}</Text>
                    <Text style={ReferralStyle.referralCount}>{value}</Text>
                    <Text style={ReferralStyle.membersJoined}>{subTitle}</Text>
                </View>
                <View style={tabSelect == 1 ? ReferralStyle.overlayImageContainerAllPrice : ReferralStyle.overlayImageContainer}>
                    <Image
                        source={tabSelect == 3 ? require('../../assets/My_Referral.png') : tabSelect == 2 ? require('../../assets/Invite_Farmer.png') : require('../../assets/John_Deere.png')}
                        style={tabSelect == 1 ? ReferralStyle.overlayImageTractor : ReferralStyle.overlayImage}
                    />
                </View>
            </>
        )
    }
    const referAllPriceView = (value: any, firstTitle: any, title: any, subTitle: any, date: any) => {
        return (
            <>
                <View style={ReferralStyle.referralContainer}>
                    <Text style={ReferralStyle.referralFirstText}>{firstTitle}</Text>
                    <Text style={ReferralStyle.referralText}>{title}</Text>
                    <Text style={ReferralStyle.referralCount1}>{value}</Text>
                    <Text style={ReferralStyle.membersJoined}>{subTitle}</Text>
                    <Text style={ReferralStyle.datestyle}>{date}</Text>
                </View>
                <View style={ReferralStyle.overlayImageContainerAllPrice}>
                    <Image
                        source={require('../../assets/John_Deere.png')}
                        style={ReferralStyle.overlayImageTractor}
                    />
                </View>
            </>
        )
    }

    const tabView = () => {
        return (
            <View style={ReferralStyle.tabViewmain}>
                <Pressable style={({ pressed }) => [{ ...ReferralStyle.onPressTabFirst, backgroundColor: tabSelect == 1 ? MDBLUE : "transparent", opacity: pressed ? 0.2 : 1 }]} onPress={() => onPressTab(1)}>
                    <Text style={ReferralStyle.tabTextstyle}>All Prices</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [{ ...ReferralStyle.onPressTab, backgroundColor: tabSelect == 2 ? MDBLUE : "transparent", opacity: pressed ? 0.2 : 1 }]} onPress={() => onPressTab(2)}>
                    <Text style={ReferralStyle.tabTextstyle}>Invite Farmer</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [{ ...ReferralStyle.onPressViewLast, backgroundColor: tabSelect == 3 ? MDBLUE : "transparent", opacity: pressed ? 0.2 : 1 }]} onPress={() => onPressTab(3)}>
                    <Text style={ReferralStyle.tabTextstyle}>My Referral</Text>
                </Pressable>
            </View>
        )
    }

    const onCancel = () => {
        setModalVisible(false);
    };
    const onPressAvailNow = () => {
        setModalVisible(true)
    }
    return (
        <View style={ReferralStyle.container}>
            <ImageBackground
                source={require('../../assets/Background_Referral.png')}
                style={ReferralStyle.backgroundImage}
            >
                {headerViewReferral(`Hi, ${profileDetail?.client_name || ""}`, "Enjoy our services", onPressSide)}
                {tabView()}
                {tabSelect == 1 && referAllPriceView("TRACTOR", "Your Have a Chance to", "Win Brand New", "End date", "30 / 12 / 2026")}
                {tabSelect == 2 && referCountView("FARMER", "Invite", "& Win Big Prices")}
                {tabSelect == 3 && referCountView(50, "Total Referral", "Members joined")}
            </ImageBackground>
            {tabSelect == 2 && <InviteFarmer />}
            {tabSelect == 3 && <MyRefferral data={members} />}
            {tabSelect == 1 && <AllPrice modalVisibleset={setModalVisible} />}
            <AlertModal modalVisible={modalVisible} setModalVisible={setModalVisible}
                header={"Lorem Ipsum"}
                firstLineContent={"Are you sure you want to avail price?"}
                btn={"Avail Now"}
                no={"Cancel"}
                btnCancel={"Cancel"}
                onProceed={onPressAvailNow}
                onCancel={() => onCancel()}
                description={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
            />
        </View>
    );
};



export default ReferralScreen;
