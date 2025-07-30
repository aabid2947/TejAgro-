import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { DropdownStyle } from "./DropdownStyle";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
interface DropDownPickerprops {
    refRBSheet?: any;
    onSelect?: any;
    options?: any;
    propertyValue?: any;
    placeHolderText?: any
}

const DropdownPicker = ({ refRBSheet, onSelect, options, propertyValue, placeHolderText }: DropDownPickerprops) => {
    const [search, setSearch] = useState('');
    const [filterList, setFilterList]: any = useState();
    const renterItem = ({ item, index }: any) => {
        return (
            <Pressable key={index} accessible={true}
                onPress={() => onSelect(item)} style={DropdownStyle.pressbleView}
            >
                <TextPoppinsMediumBold style={DropdownStyle.productText}>{item?.name ? item?.name : item?.value}</TextPoppinsMediumBold>
            </Pressable>
        )
    }
    const updateSearch = (value: any) => {
        setSearch(value);
        const filter = options?.length > 0 ? options?.filter((item: any) =>
            String(item.name).toLowerCase().includes(value.toLowerCase())
        ) : [];
        if (filter.length > 0) {
            setFilterList(filter);
        } else {
            setFilterList([])
        }
    };

    return (
        <RBSheet
            ref={refRBSheet}
            height={heightPercentageToDP(50)}
            onOpen={() => setFilterList(options)}
            onClose={() => setSearch('')}
            openDuration={250}
            customStyles={{
                container: {
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5
                }
            }}
        >
            <View style={DropdownStyle.userTypeViewRbsheet1}>
                <TextInput style={DropdownStyle.searchPlace}
                    placeholder={`Select ${placeHolderText}`}
                    accessible={true}
                    editable={placeHolderText == "Test Type" ? true : false}
                    value={search}
                    onChangeText={(text: any) => updateSearch(text)}
                />
            </View>
            <FlatList
                keyboardShouldPersistTaps="handled"
                data={filterList}
                renderItem={renterItem}
                keyExtractor={(item) => propertyValue ? item.propertyId : item.name}
                ListEmptyComponent={() => <View>
                    <Text style={DropdownStyle.nodataText}>No Data Found</Text>
                </View>}
            />
        </RBSheet>
    )
}
export default DropdownPicker;