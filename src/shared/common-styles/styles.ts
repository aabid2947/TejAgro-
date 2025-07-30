import { StyleSheet } from "react-native";
import { BLACK, ORANGE, WHITE } from "./colors";

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: WHITE,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: ORANGE,
        paddingVertical: 10,
        borderWidth: 1
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        color: WHITE,
        textAlign: 'center',
    },
    headerRow: {
        backgroundColor: ORANGE,
    },
    headerCell: {
        fontWeight: 'bold',
        color: WHITE,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: "center",
        paddingVertical: 10,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        color: BLACK,
        textTransform: "capitalize"
    },
    mainBody: {
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginHorizontal: 5,
        backgroundColor: WHITE,
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 6,
        paddingHorizontal: 15
    },
    dateTimeTxt: {
        fontSize: 14,
        color: BLACK
    },
    amountCredited: {
        fontSize: 16,
        marginHorizontal: 0,
        color: BLACK
    },
    rowView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5
    },
    rowContainer: {
        width: "60%"
    },
    flatlistRowView: {
        top: 10
    },
    mainSubBody: {
        marginHorizontal: 20,
        marginVertical: 10
    }
});
