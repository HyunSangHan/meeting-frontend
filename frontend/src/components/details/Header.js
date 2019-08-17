import React, { Component } from 'react';
import '../../css/Reuse.scss'; //도구성컴포넌트의CSS(SCSS)
import '../../App.css'; //공통CSS
import { Link } from "react-router-dom"; //다른 페이지로 링크 걸 때 필요
import MaterialIcon from 'material-icons-react'; //뒤로가기 아이콘을 위해 필요

class Header extends Component {
    render() {
        return (
            <div className="App">
                {/* 뒤로가기 버튼인데 혹시몰라 남겨둠. 그런데 우리 UX에서는 절대경로로 고정되면 안될 듯 */}
                {/* <Link to="/">
                    <MaterialIcon icon="arrow_back_ios" size="23x" color="white"/>
                </Link> */} 
            </div>
        );
    }
}

export default Header;
