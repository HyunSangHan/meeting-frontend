import React, { Component, Fragment } from 'react';
import * as myProfileActions from "../modules/my_profile";
import * as emailActions from '../modules/email';
import "../css/Profile.scss";
import '../App.css';
import Header from './details/Header';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import { Link } from 'react-router-dom';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            age_value: this.props.my_profile_from_app.age_range,
            company_value: this.props.my_profile_from_app.company.name,
            emailFront: "",
            code: "",
            // changed: false,
        }
    }

    componentDidMount() {
        const { MyProfileActions } = this.props;
        MyProfileActions.getMyProfile()
        .then(() => {
            this.setState({
                age_value: this.props.my_profile.age_range,
                company_value: this.props.my_profile.company.name
            })
        })
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (!prevState.changed) {
    //         return {
    //             age_value: nextProps.my_profile.age_range,
    //             company_value: nextProps.my_profile.company.name
    //         };
    //     }
    // }

    handleInputChange = event => {
        const { target: { value, name } } = event;
        this.setState({
            [name]: value
            // changed: true
        });
    };

    onSend() {
        const { EmailActions } = this.props;
        const { emailFront, company_value } = this.state;
        let emailCompany;
        switch (company_value) {
            case "네이버":
                emailCompany = "@naver.com";
                break;
            case "삼성":
                emailCompany = "@samsung.com";
                break;
            case "멋쟁이사자처럼":
                emailCompany = "@likelion.org";
                break;
            case "구글":
                emailCompany = "@google.com";
                break;
            case "테슬라":
                emailCompany = "@tesla.com";
                break;
        }
        EmailActions.sendEmail({
            email: emailFront + emailCompany
        })
    }

    onValidate() {
        const { EmailActions } = this.props;
        const { code } = this.state;
        EmailActions.validateEmail({
            code: code
        })
    }

    handleSubmit = event => {
        const { MyProfileActions } = this.props;
        const { age_value, company_value } = this.state;
        console.log(this.state);
        event.preventDefault();
        MyProfileActions.ProfileUpdate({
            age_value: age_value,
        })
        MyProfileActions.CompanyUpdate({
            company_value: company_value,
        })
        MyProfileActions.getMyProfile();
    };

    render(){
        const { my_profile } = this.props;
        const { age_value, company_value } = this.state;
        return (
            <div className="form-component frame ProfileForm" >
                <Header></Header>
                <form
                    className="form"
                    onSubmit={this.handleSubmit}
                    method="patch"
                    encType="multipart/form-data"
                >
                    <div>
                        <div className="CategoryWrapper">
                            <div className="CategoryName">성별</div>
                            <div className="not-change Gender">
                                <p>{my_profile.is_male ? "남" : "여"}</p>
                            </div>
                        </div>
                        <div className="CategoryWrapper">
                            <div className="CategoryName">연령대</div>
                            <select name="age_value" value={age_value}  onChange={this.handleInputChange}>
                                <option>10</option>
                                <option>20</option>
                                <option>30</option>
                                <option>40</option>
                                <option>50</option>
                                <option>60</option>
                            </select>
                        </div>
                        <div className="CategoryWrapper">
                            <div className="CategoryName">회사명</div>
                            <select name="company_value" value={company_value}  onChange={this.handleInputChange}>
                                <option>네이버</option>
                                <option>삼성</option>
                                <option>멋쟁이사자처럼</option>
                                <option>구글</option>
                                <option>테슬라</option>
                            </select>
                        </div>
                        <div className="CategoryWrapper">
                            <div className="CategoryName">이메일</div>
                            <div className="EmailSelect">
                                <input onChange={(e)=> {this.setState({emailFront: e.target.value})}} placeholder="이메일 입력"></input>
                                <span id="EmailAt">@</span>
                                <select name="company_value" value={company_value} onChange={this.handleInputChange}>
                                    <option value="네이버">naver.com</option>
                                    <option value="삼성">samsung.com</option>
                                    <option value="멋쟁이사자처럼">likelion.org</option>
                                    <option value="구글">google.com</option>
                                    <option value="테슬라">tesla.com</option>
                                </select>
                            </div>
                            {(!this.props.sent) ?
                                (
                                    <Fragment>
                                        <button className="SendButton Send" type="submit" onClick={e => this.onSend(e)}>인증하기</button>
                                    </Fragment>
                                )
                                : (
                                    <Fragment>
                                        <div className="EmailValidation">
                                            <input onChange={(e)=> {this.setState({code: e.target.value})}} placeholder="인증번호 입력"></input>
                                            <button className="SendButton" type="submit" onClick={e => this.onValidate(e)}>인증</button>
                                        </div>
                                        {this.props.validated ?
                                            (<div className="ErrorMessage" style={{color: "blue"}}>인증되었습니다</div>)
                                            : (<div className="ErrorMessage" style={{color: "red"}}>인증되지 않았습니다</div>)
                                        }
                                    </Fragment>
                                )
                            }
                        </div>
                    </div>
                    <div className="FixedButton">
                        {(this.props.validated) ?
                        (
                            <button className="SubmitButton WorkingButton">적용하기</button>
                        ) : (
                            <button type="button" className="SubmitButton NotWorkingButton" onClick={() => alert("입력을 완료해주세요.")}>적용하기</button>
                        )
                        }
                    </div>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    MyProfileActions: bindActionCreators(myProfileActions, dispatch),
    EmailActions: bindActionCreators(emailActions, dispatch),
});

const mapStateToProps = (state) => ({
    is_login_already: state.my_profile.get('is_login_already'),
    my_profile: state.my_profile.get('my_profile'),
    sent: state.email.get('sent'),
    validated: state.email.get('validated'),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);