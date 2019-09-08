import React, { Component } from 'react';
import '../../css/Main.scss'; //부모컴포넌트의CSS(SCSS)
import '../../App.css'; //공통CSS
import { Link } from 'react-router-dom'; //다른 페이지로 링크 걸 때 필요
import CountDown from "./CountDown";
import GiftPopup from "./GiftPopup";
import MaterialIcon from 'material-icons-react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import * as currentMatchingActions from '../../modules/current_matching';
import * as playerActions from '../../modules/player';
import current_meeting from '../../modules/current_meeting';

class ControlTool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_greenlight_male_on: this.props.current_matching.is_greenlight_male,
            is_greenlight_female_on: this.props.current_matching.is_greenlight_female,
        };  

    }

    componentDidMount() {

    }

    handleGreenLight = () => {
        const { PlayerActions, counter_profile } = this.props;
        const { is_greenlight_male_on, is_greenlight_female_on } = this.state;

        if (!is_greenlight_male_on && !counter_profile.is_male) {
            PlayerActions.handleGreenLightOn({ male: true });
            this.setState({ is_greenlight_male_on: true });

        } else if (!is_greenlight_female_on && counter_profile.is_male) {
            PlayerActions.handleGreenLightOn({ female: true });
            this.setState({ is_greenlight_female_on: true });

        } else if (is_greenlight_male_on && !counter_profile.is_male) {
            PlayerActions.handleGreenLightOff({ male: false });
            this.setState({ is_greenlight_male_on: false });

        } else if (is_greenlight_female_on && counter_profile.is_male) {
            PlayerActions.handleGreenLightOff({ female: false });
            this.setState({ is_greenlight_female_on: false });
        }

    };


    handleGift = () => {
        const { PlayerActions, current_matching, counter_profile, CurrentMatchingActions } = this.props;

        if (!current_matching.is_gift_male && !counter_profile.is_male) {
            PlayerActions.handleGiftOn({ male: true });
        } else if (!current_matching.is_gift_female && counter_profile.is_male) {
            PlayerActions.handleGiftOn({ female: true });

        PlayerActions.deletePopup();
        CurrentMatchingActions.getCurrentMatching();
        }
    };

    handleGiftPopup = () => {
        const { PlayerActions } = this.props;
        PlayerActions.createPopup();
    }

    render() {
        const { PlayerActions, is_gift_popup, my_profile, counter_profile, current_matching, current_meeting } = this.props;  
        const { is_greenlight_male_on, is_greenlight_female_on } = this.state;

        let countDown = null;
        if (current_matching.trial_time === 1) {
            countDown = <CountDown time = {new Date(current_meeting.first_shuffle_time)} />;
        } else if (current_matching.trial_time === 2) {
            countDown = <CountDown time = {new Date(current_meeting.second_shuffle_time)} />;
        } else if (current_matching.trial_time === 3) {
            countDown = <CountDown time = {new Date(current_meeting.third_shuffle_time)} />;
        } else if (current_matching.trial_time === 4) {
            countDown = <CountDown time = {new Date(current_meeting.third_shuffle_time)} />; //수정필요
        }

        return (
            <div className="control-container">

                <div className="gift-pop">
                    {is_gift_popup
                        &&
                        <GiftPopup
                            PlayerActions={PlayerActions}
                            is_gift_popup={is_gift_popup}
                            counter_profile={counter_profile}
                            current_matching={current_matching}
                            handleGift={this.handleGift}
                        />
                    }
                </div>

                {/* 임시적으로 1분 미만의 시간 카운트  */}
                <div className="timer font-notosan font-13">
                    {countDown}
                </div>

                <div className="action-container">
                    <div className="column">
                        <Link to="/team_profile">
                            {/* 대표사진 */}
                            <img className="my-team" src={my_profile.image || require("../../images/noPhoto.jpg")} />
                        </Link> 
                    </div>


                    <div className="column">      
                        {my_profile.is_male ?
                        <div className="greenlight-back">
                            <div className="greenlight move-1" onClick={this.handleGreenLight}>
                                {is_greenlight_male_on &&
                                    <div className="call-button font-jua">
                                        콜!!
                                    </div> 
                                }
                                {!is_greenlight_male_on &&
                                    <div className="call-button font-jua">
                                        콜?
                                    </div> 
                                }
                            </div>
                        </div>
                        :
                        <div className="greenlight-back">
                            <div className="greenlight move-1" onClick={this.handleGreenLight}>
                                {is_greenlight_female_on &&
                                    <div className="call-button font-jua">
                                        콜!!
                                    </div> 
                                }
                                {!is_greenlight_female_on &&
                                    <div className="call-button font-jua">
                                        콜?
                                    </div> 
                                }
                            </div>
                        </div>
                        }
                    </div>

                        
                    <div className="column">
                        {my_profile.is_male ?
                        <div className="gift" onClick={this.handleGiftPopup}>
                            {current_matching.is_gift_male &&
                                <div className="gift-on font-jua">
                                    안주쏘기
                                </div> 
                            }
                            {!current_matching.is_gift_male &&
                                <div className="gift-off font-jua">
                                    안주쏘기
                                </div> 
                            }
                        </div>
                        :
                        <div className="gift" onClick={this.handleGiftPopup}>
                            {current_matching.is_gift_female &&
                                <div className="gift-on font-jua">
                                    안주쏘기
                                </div> 
                            }
                            {!current_matching.is_gift_female &&
                                <div className="gift-off font-jua">
                                    안주쏘기2
                                </div> 
                            }
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    PlayerActions: bindActionCreators(playerActions, dispatch),
    CurrentMatchingActions: bindActionCreators(currentMatchingActions, dispatch),
});

const mapStateToProps = (state) => ({
    counter_profile: state.player.get('counter_profile'),
    is_gift_popup : state.player.get('is_gift_popup'),
    current_matching: state.current_matching.get('current_matching'),
    is_current_matching: state.current_matching.get('is_current_matching'),
})

export default connect(mapStateToProps, mapDispatchToProps)(ControlTool);