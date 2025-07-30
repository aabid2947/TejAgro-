import moment from 'moment';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendarstyle } from './CustomCalendarStyle';
import CalendarIcon from '../../svg/CalendarIcon';
import { GRAY } from '../../shared/common-styles/colors';


const Calendar = ({ placeTitle, id, title, value, onChange, errorMsg, minimumDate, maximumDate, titleText, disable, viewStyle, titleStyle, style,plceholderTextColor }: any) => {
    const [isVisible, setIsVisible] = useState(false);
    const onValueChange = (date: any) => {
        setIsVisible(false);
        onChange(id, date, title);
    };

    const onOpenCalendar = () => {
        setIsVisible(true);
    };

    const onCancel = () => {
        setIsVisible(false);
    };
    return (
        <>
            <Pressable style={viewStyle} onPress={onOpenCalendar}>
                <TextInput
                    placeholder={placeTitle}
                    value={value ? `${moment(value).format('DD MMM YYYY')}` : ""}
                    style={style}
                    editable={false}
                    placeholderTextColor={plceholderTextColor??GRAY}
                />
                <View style={Calendarstyle.viewIcon}>
                    <CalendarIcon height={25} width={25} />
                    {!disable && (<DateTimePickerModal
                        date={value ? new Date(value) : new Date()}
                        isVisible={isVisible}
                        mode="date"
                        style={Calendarstyle.inputText}
                        onConfirm={onValueChange}
                        onCancel={onCancel}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                    />)}
                </View>
            </Pressable>
            {errorMsg && (
                <Text style={Calendarstyle.erroFormTxt}>{errorMsg}</Text>
            )}
            {titleText && <Text style={titleStyle}>{titleText}</Text>}
        </>
    );
};

export default Calendar;