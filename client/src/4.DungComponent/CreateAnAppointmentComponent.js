import React, { useContext, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { Container, Button, Row, Col } from 'reactstrap';
import { Link, Switch, Redirect } from 'react-router-dom';
import HeaderDefine from '../5.Share Component/Context';
import NurseSideBar from '../5.Share Component/SideBar/NurseSideBarComponent';

function CreateAnAppointment() {
    const ctx = useContext(HeaderDefine);
    const [show, setShow] = useState(false);

    const showModal = () => {
        setShow(true);
    };

    const hideModal = () => {
        setShow(false);
    };
    console.log(ctx)
    if (ctx.role !== "Nurse") return <Switch> <Redirect to={`/${this.context.role}`} /></Switch>
    return (
        <>
            <NurseSideBar />
            <Container>
                <Row>
                    <Col class='dung-title' style={{ textAlign: 'center' }}>
                        <h1>&nbsp;&nbsp;&nbsp; Tạo lịch khám</h1>
                        <hr />
                    </Col>
                </Row>
                <Row>
                    <Col>
                <div class='dung-button-createappointment'>
                    <Link to='/instant_appointment'>
                        <Button className="dung cart-button">
                            Lịch khám tức thời
                        </Button>
                    </Link>
                </div>
                </Col>
                </Row>
                <Row>
                    <Col>
                <div class='dung-button-createappointment aa'>
                    <Link to='/re-examination_schedule'>
                        <Button className="dung cart-button">
                            Lịch tái khám
                        </Button>
                    </Link>
                </div>
                </Col>
                </Row>
            </Container>
        </>
    );
}

export default CreateAnAppointment;