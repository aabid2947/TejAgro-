import { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import { LoaderScreen } from "../../components/loaderview/LoaderScreen";
import NoRecordFound from "../../components/noRecordFound/NoRecordFound";
import { NotifcationScreenStyle } from "./NotificationScreenStyle";


const data1 = [
    {
        id: 1,
        title: "Your order #123456789 has been confirmed",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        id: 2,
        title: "Your order #123456789 has been confirmed",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        id: 3,
        title: "Your order #123456789 has been confirmed",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        id: 4,
        title: "Your order #123456789 has been confirmed",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
]
const NotifcationScreen = ({ navigation }: any) => {
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setLoader(true)
        }, 1000)
    }, [])


    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
        }, 1000)
    }
    const renderItem = ({ item, index }: any) => {
        return (
            <View key={index} style={NotifcationScreenStyle.renderView}>
                <Image
                    source={require("../../assets/IconFertilizer.png")} // replace with actual logo URL
                    style={NotifcationScreenStyle.logo}
                />
                <View style={NotifcationScreenStyle.titleView}>
                    <Text style={NotifcationScreenStyle.titleStyle}>{item?.title}</Text>
                    <Text numberOfLines={10} style={NotifcationScreenStyle.messageStyle}>
                        {item?.message}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={NotifcationScreenStyle.mainView}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={"Notification"}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            {loader ?
                <FlatList
                    data={data1}
                    renderItem={renderItem}
                    keyExtractor={(item: any) => item?.id}
                    ListEmptyComponent={<NoRecordFound style={{ marginTop: heightPercentageToDP(30) }} />}
                    showsVerticalScrollIndicator={false}
                    refreshing={refresh}
                    onRefresh={onRefresh}
                />
                :
                <LoaderScreen />
            }
        </SafeAreaView>
    )
}

export default NotifcationScreen