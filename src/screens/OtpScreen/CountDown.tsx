import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AppState
} from 'react-native';
import { BLACK, Black_Pearl } from '../../shared/common-styles/colors';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
let subscription: any = null;
class CountDown extends React.PureComponent {
    state = {
        until: Math.max(this.props.until, 0),
        lastUntil: null,
        wentBackgroundAt: null,
    };
    constructor(props: any) {
        super(props);
        this.timer = setInterval(this.updateTimer, 1000);
    }
    // const { t } = useTranslation();
    componentDidMount() {
        subscription = AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        subscription && subscription.remove();
    }
    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.props.until !== prevProps.until || this.props.id !== prevProps.id) {
            this.setState({
                lastUntil: prevState.until,
                until: Math.max(prevProps.until, 0)
            });
        }
    }
    _handleAppStateChange = (currentAppState: any) => {
        const { until, wentBackgroundAt } = this.state;
        if (currentAppState === 'active' && wentBackgroundAt && this.props.running) {
            const diff: any = (Date.now() - wentBackgroundAt) / 1000.0;
            this.setState({
                lastUntil: until,
                until: Math.max(0, parseInt(until - diff))
            });
        }
        if (currentAppState === 'background') {
            this.setState({ wentBackgroundAt: Date.now() });
        }
    }
    getTimeLeft = () => {
        const { until }: any = this.state;
        return {
            seconds: until <= 9 ? '0' + until % 60 : until % 60,
            minutes: '0' + parseInt(until / 60, 10) % 60,
            hours: parseInt(until / (60 * 60), 10) % 24,
            days: parseInt(until / (60 * 60 * 24), 10),
        };
    };
    updateTimer = () => {
        if (this.state.lastUntil === this.state.until || !this.props.running) {
            return;
        }
        if (this.state.until === 1 || (this.state.until === 0 && this.state.lastUntil !== 1)) {
            if (this.props?.onFinish) {
                this.props.onFinish();
            }
            if (this.props?.onChange) {
                this.props.onChange(this.state.until);
            }
        }
        if (this.state.until === 0) {
            this.setState({ lastUntil: 0, until: 0 });
        } else {
            if (this.props?.onChange) {
                this.props.onChange(this.state.until);
            }
            this.setState({
                lastUntil: this.state.until,
                until: Math.max(0, this.state.until - 1)
            });
        }
    };
    renderDigit = (d: any) => {
        const { size } = this.props;
        return (
            <TextPoppinsMediumBold style={[
                styles.digitTxt,
                { fontSize: 14, color: Black_Pearl },
            ]}>
                {d}
            </TextPoppinsMediumBold>
        );
    };
    renderSecondDigit = (minutes, d) => {
        const { size } = this.props;
        return (
            <TextPoppinsMediumBold style={{ fontSize: size, lineHeight: 22, color: BLACK }}>
                {d < 10 && minutes > 0 ? '0' + d : d}
            </TextPoppinsMediumBold>
        );
    };
    renderSeparator = () => {
        const { size } = this.props;
        return (
            <TextPoppinsMediumBold style={[
                styles.separatorTxt,
                { fontSize: size, color: BLACK },
            ]}>
                {':'}
            </TextPoppinsMediumBold>
        );
    };
    renderCountDown = () => {
        const { timeToShow, showSeparator, labelText }: any = this.props;
        const { minutes, seconds } = this.getTimeLeft();
        const Component: any = this.props.onPress ? TouchableOpacity : View;
        return (
            <Component
                style={[styles.timeCont]}
                onPress={this.props?.onPress}
            >
                <View style={{ flexDirection: "row" }}>
                    <TextPoppinsMediumBold style={styles.labelText}>
                        {labelText}
                    </TextPoppinsMediumBold>
                    <TextPoppinsMediumBold style={styles.time}>
                        {timeToShow.includes('M') ? this.renderDigit(minutes) : null}
                        {showSeparator && timeToShow.includes('M') && timeToShow.includes('S') ? this.renderSeparator() : null}
                        {timeToShow.includes('S') ? this.renderSecondDigit(minutes, seconds) : null}
                    </TextPoppinsMediumBold>
                    {/* <Text style={styles.secondsText}> {t('SECONDS_AGAIN')}</Text> */}
                    <TextPoppinsMediumBold style={styles.secondsText}> Seconds again</TextPoppinsMediumBold>
                </View>
            </Component>
        );
    };
    render() {
        return (

            !this.props.sessionTimeOut ? <View>
                {this.renderCountDown()}
            </View> : null


        );
    }
}
const styles = StyleSheet.create({
    timeCont: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 15,
    },
    separatorTxt: {
        backgroundColor: 'transparent',
    },
    labelText: {
        marginRight: 5,
        color: BLACK,
        fontSize: 14,
        lineHeight: 20,
    },
    secondsText: {
        marginRight: 5,
        color: BLACK,
        fontSize: 14,
        lineHeight: 20,
    },
    time: {
        fontSize: 16,
        lineHeight: 20,
        color: BLACK
    }
});
export default CountDown;
export { CountDown };