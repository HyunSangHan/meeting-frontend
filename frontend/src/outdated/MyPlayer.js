import React, { Component } from "react";
// import "../css/info_styles.scss";
import { Link } from 'react-router-dom';
import * as myProfileActions from '../modules/my_profile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class MyPlayer extends Component {

    componentDidMount(){
        const { MyProfileActions } = this.props;
        MyProfileActions.getMyProfile();
    }

    render(){
        const { my_profile } = this.props;
        return ( 
            <div className="container">
                <span>
                    <div className="column">
                        <img src={my_profile.image || require("../images/noPhoto.jpg")}
                            alt={my_profile.user.username} 
                            className="main-profile"
                            width="100px"
                        />
                        <ul className="info-list">
                            <li className="list-item">이름 : {my_profile.user.username}</li>
                            <li className="list-item">성별 : {my_profile.is_male ? "남" : "여"}</li>
                            <li className="list-item">연령대 : {my_profile.age_range ? my_profile.age_range + "대" : "몰라요"}</li>
                            <li className="list-item">회사명 : {my_profile.company.name}</li>
                            <li className="list-item">팀소개 : {my_profile.team_introduce}</li>
                        </ul>
                    </div>
                    <br/>
                    <Link to="/profile" className="update">
                        프로필 수정하기
                    </Link>
                </span>
                <span>
                    <div className="column">
                    </div>
                </span> 
            </div>
        )
    }

};

// export default MyPlayer;
const mapDispatchToProps = (dispatch) => ({
    dispatch,
    MyProfileActions: bindActionCreators(myProfileActions, dispatch),

});

const mapStateToProps = (state) => ({
    my_profile: state.my_profile.get('my_profile'),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPlayer);