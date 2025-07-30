import { Pressable, TextInput, View } from "react-native"
import SearchIcon from "../../svg/SearchIcon"
import { StyleSheet } from "react-native"
import FilterIconSvg from "../../svg/FilterIconSvg"
import { BLACK, GRAY_BORDER, MDBLUE, Poppins } from "../../shared/common-styles/colors"
import CrossIcon from "../../svg/CrossIcon"

const SearchInput = ({ placeholder, value, onChangeText, setSearchQuery, searchQuery }: any) => {
    return (
        <View style={styles.searchView}>
            <View style={styles.searchBarView}>
                <TextInput
                    style={styles.searchBar}
                    placeholder={placeholder}
                    placeholderTextColor={GRAY_BORDER}
                    value={value}
                    onChangeText={onChangeText}
                />
                {searchQuery ? <Pressable onPress={() => setSearchQuery('')}>
                    <CrossIcon width={16} height={16} />
                </Pressable> :
                    <SearchIcon height={24} width={24} color={GRAY_BORDER} />
                }
            </View>
            {/* <FilterIconSvg height={54} width={48} color={MDBLUE} /> */}
        </View>
    )
}

export default SearchInput

const styles = StyleSheet.create({
    searchBar: {
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 10,
        flex: 1,
        color: BLACK,
        fontFamily: Poppins
    },
    searchView: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginBottom: 20
    },
    searchBarView: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        flex: 1,
        borderColor: '#CFCFCF',
        flexDirection: 'row',
        alignItems: 'center'
    },
})
