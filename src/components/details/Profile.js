import React, { Component } from 'react';
import '../../css/Body.css';
import '../../App.css';
import { Container, Row, Col } from 'reactstrap';
import Header from "./Header";

class Profile extends Component {

    render() {
        return (
            <div className={"App"}>
                <Header title="팀 프로필 수정"/>
                <div className="offset-down">
                    <Container>
                        <Row>
                            <Col>
                                <div className={"App"}>프로필 개발 필요</div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default Profile;