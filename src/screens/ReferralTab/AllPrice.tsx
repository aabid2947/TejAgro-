import { ScrollView, View } from "react-native"
import { PressableB } from "../../shared/components/CommonUtilities"

const AllPrice = ({modalVisibleset}:any) => {

    const onPressAvail = () => {
        modalVisibleset(true)
    }
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, marginTop:60 }}>

            </ScrollView>
            {PressableB("AVAIL NOW", onPressAvail)}
        </View>
    )
}

export default AllPrice