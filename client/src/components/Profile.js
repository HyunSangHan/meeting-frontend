import React, { Component, Fragment } from "react"
import { getMyProfile, updateMyProfile, logout } from "../modules/my_profile"
import { sendEmail, validateEmail } from "../modules/validation"
import "../css/Profile.scss"
import "../App.css"
import Header from "./details/Header"
import Loading from "./details/Loading"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { isEmpty } from "../modules/utils"

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      genderValue: "default",
      ageValue: "default",
      companyValue: "default",
      emailValue: null,
      emailID: null,
      code: null,
      isValidationButtonClicked: false,
      companyArr: null
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { isLoginAlready, myProfile } = nextProps
    const { isMale, ageRange, company } = myProfile
    if (isLoginAlready && prevState.companyValue === "default") {
      let gender = "default"
      !isEmpty(isMale) && (gender = isMale)
      let age = "default"
      !isEmpty(ageRange) && (age = ageRange)
      let companyName = "default"
      !isEmpty(company) &&
        !isEmpty(company.name) &&
        (companyName = company.name)
      return {
        genderValue: gender,
        ageValue: age,
        companyValue: companyName
      }
    }
    return null
  }

  componentDidMount() {
    const { isLoginAlready, getMyProfile } = this.props
    isEmpty(isLoginAlready) && getMyProfile()

    fetch("/company_registration/")
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          companyArr: response
        })
      })
      .catch(err => console.log(err))
  }

  handleInputChange = event => {
    let { value, name } = event.target

    if (value === "남자") {
      value = true
    } else if (value === "여자") {
      value = false
    }

    this.setState({
      [name]: value
    })
  }

  onSend() {
    const { emailID, companyValue, companyArr } = this.state
    let emailDomain

    companyArr.forEach(company => {
      if (companyValue === company.name) emailDomain = company.domain
    })

    if (!isEmpty(emailID) && !isEmpty(emailDomain)) {
      this.props.sendEmail({
        email: emailID + emailDomain
      })
      console.log(emailID + emailDomain + "로 인증메일을 보냅니다.")
      this.setState({
        emailValue: emailID + emailDomain
      })
    } else {
      window.alert("이메일주소를 입력하세요.")
    }
  }

  onValidate() {
    const { code } = this.state
    this.setState({
      isValidationButtonClicked: true
    })
    this.props.validateEmail({
      code: code
    })
  }

  handleSubmit = event => {
    const { history, updateMyProfile } = this.props
    const { genderValue, ageValue, companyValue, emailValue } = this.state
    event.preventDefault()
    !isEmpty(genderValue) &&
      !isEmpty(ageValue) &&
      !isEmpty(companyValue) &&
      !isEmpty(emailValue) &&
      updateMyProfile({
        isMale: genderValue,
        ageRange: ageValue,
        company: companyValue,
        email: emailValue
      })
    window.alert("프로필 수정이 완료되었습니다.")
    history.push("/")
  }

  render() {
    const {
      history,
      myProfile,
      logout,
      isLoginAlready,
      isValidated
    } = this.props
    const {
      genderValue,
      ageValue,
      companyValue,
      isValidationButtonClicked,
      companyArr
    } = this.state

    isLoginAlready === false && history.push("/")

    const isStoreLoaded =
      !isEmpty(isLoginAlready) &&
      !isEmpty(myProfile) &&
      !isNaN(myProfile.ageRange)

    return (
      <div className="frame bg-init-color">
        <Header content={"프로필 수정"} />
        {isStoreLoaded ? (
          <div className="profile-form">
            <form
              className="form"
              onSubmit={this.handleSubmit}
              method="patch"
              encType="multipart/form-data"
            >
              <div className="title">성별</div>
              {isEmpty(myProfile.isMale) ? (
                <select
                  name="genderValue"
                  value={
                    genderValue === "default"
                      ? genderValue
                      : genderValue
                      ? "남자"
                      : "여자"
                  }
                  onChange={this.handleInputChange}
                >
                  <option value="default"> - 선택 - </option>
                  <option value="남자">남자</option>
                  <option value="여자">여자</option>
                </select>
              ) : (
                <div className="not-change Gender">
                  <p>{myProfile.isMale ? "남자" : "여자"}</p>
                </div>
              )}
              <div className="title">연령대</div>
              <select
                name="ageValue"
                value={ageValue}
                onChange={this.handleInputChange}
              >
                <option value="default"> - 선택 - </option>
                <option value={10}>10대</option>
                <option value={20}>20대</option>
                <option value={30}>30대</option>
                <option value={40}>40대</option>
                {/* <option>기타</option> */}
              </select>
              <div className="title">회사명</div>
              <select
                name="companyValue"
                value={companyValue}
                onChange={this.handleInputChange}
              >
                <option value="default"> - 선택 - </option>
                {companyArr &&
                  Array.from(companyArr).map(company => {
                    return (
                      <option value={company.name} key={company.id}>
                        {company.name}
                      </option>
                    )
                  })}
              </select>
              <div className="title">이메일</div>
              <div className="email-select">
                <input
                  onChange={e => {
                    this.setState({ emailID: e.target.value })
                  }}
                  placeholder="입력"
                ></input>
                <select
                  name="companyValue"
                  className="ml-2"
                  value={companyValue}
                  onChange={this.handleInputChange}
                >
                  <option value="default"> - </option>
                  {companyArr &&
                    Array.from(companyArr).map(company => {
                      return (
                        <option value={company.name} key={company.id}>
                          {company.domain}
                        </option>
                      )
                    })}
                </select>
              </div>
              {!this.props.isEmailSent ? (
                <Fragment>
                  <button
                    className="SendButton Send"
                    type="button"
                    onClick={e => this.onSend(e)}
                  >
                    {this.props.myProfile.isValidated
                      ? "재인증하기"
                      : "인증하기"}
                  </button>
                  {myProfile.isValidated && !isValidated && (
                    <div className="ErrorMessage font-blue font-notosan">
                      이미 {myProfile.company.name} 사내 메일계정으로 인증이
                      완료되었습니다.
                    </div>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <div className="EmailValidation">
                    <input
                      onChange={e => {
                        this.setState({ code: e.target.value })
                      }}
                      placeholder="인증번호 입력"
                    ></input>
                    <button
                      className="SendButton"
                      type="button"
                      onClick={e => this.onValidate(e)}
                    >
                      인증
                    </button>
                  </div>
                  {isValidated ? (
                    <div className="ErrorMessage font-blue font-notosan">
                      인증되었습니다
                    </div>
                  ) : (
                    <div className="ErrorMessage font-red font-notosan">
                      {isValidationButtonClicked
                        ? "인증에 실패했습니다"
                        : "이메일로 발송된 인증코드를 입력해주세요."}
                    </div>
                  )}
                </Fragment>
              )}
            </form>
            <div className="FixedButton mt-4">
              {!isEmpty(genderValue) && !isEmpty(ageValue) && isValidated ? (
                <button
                  className="SubmitButton WorkingButton"
                  onClick={this.handleSubmit}
                >
                  적용하기
                </button>
              ) : (
                <button
                  type="button"
                  className="SubmitButton NotWorkingButton"
                  onClick={() => alert("입력을 완료해주세요.")}
                >
                  적용하기
                </button>
              )}
              <div className="logout" onClick={logout}>
                로그아웃
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    getMyProfile: bindActionCreators(getMyProfile, dispatch),
    updateMyProfile: bindActionCreators(updateMyProfile, dispatch),
    logout: bindActionCreators(logout, dispatch),
    sendEmail: bindActionCreators(sendEmail, dispatch),
    validateEmail: bindActionCreators(validateEmail, dispatch)
  }
}

const mapStateToProps = state => ({
  isLoginAlready: state.my_profile.isLoginAlready,
  myProfile: state.my_profile.myProfile,
  isEmailSent: state.validation.isEmailSent,
  isValidated: state.validation.isValidated
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
