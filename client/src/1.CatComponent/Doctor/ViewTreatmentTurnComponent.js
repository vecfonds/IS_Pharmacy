import React, { Component } from 'react';
import { Container, Row, Col, Modal, Table, ModalBody, Badge, Spinner, ModalHeader, FormGroup, ModalFooter } from 'reactstrap';
import axios from 'axios';
import ToastServive from 'react-material-toast';

import { Input, Button, Form, Label } from 'reactstrap';
import HeaderDefine from '../../5.Share Component/Context';
import { LinkContainer } from 'react-router-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Switch, Redirect } from 'react-router';

const toast = ToastServive.new({
    place: 'bottomLeft',
    duration: 2,
    maxCount: 8
});


class ViewTreatmentTurn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: this.props.phone,// this.props.phone,
            treatment_turn: [{}],
            search: [{}],
            system_user: {},
            treatment_curr: {},
            is_open: false,
            orderDetailsOpen: [],
            is_edit: false,
            payment_detail: []
            // treatment_turns:[],
            // system_users:[],
        }
        this.toggleOpen = this.toggleOpen.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSubmitPayment = this.onSubmitPayment.bind(this);
        this.onInputTime = this.onInputTime.bind(this);
        this.sortToday = this.sortToday.bind(this);
        this.sortThisWeek = this.sortThisWeek.bind(this);
        this.sortThisMonth = this.sortThisMonth.bind(this);
        this.sortAll = this.sortAll.bind(this);
    }

    sortAll() {
        this.setState({search: this.state.treatment_turn})
    }

    sortToday() {
        const today = (new Date()).toLocaleDateString("vi")
        const treats = this.state.treatment_turn.filter(x => {
            const date = (new Date(x.turn_time)).toLocaleDateString("vi");
            return date === today;
        })
        this.setState({ search: treats })
    }

    sortThisWeek() {
        const today = new Date();
        const start_time = (new Date(today.getTime() - 86400000*(today.getDay()-1))).toLocaleDateString('vi');
        const end_time = (new Date(today.getTime() - 86400000*(today.getDay()-1-6))).toLocaleDateString('vi');
        console.log(start_time)
        console.log(end_time)
        const treats = this.state.treatment_turn.filter(x => {
            const date = (new Date(x.turn_time)).toLocaleDateString("vi");
            if (this.compareDay(date, start_time) && this.compareDay(end_time, date)) return true;
            else return false;
        })

        this.setState({ search: treats })
    }

    sortThisMonth() {
        const today = new Date();
        const start_time = (new Date(today.getTime() - 86400000*(today.getDate()-1))).toLocaleDateString('vi');
        const end_time = (new Date(today.getTime() - 86400000*(today.getDate()-1-30))).toLocaleDateString('vi');
        console.log(start_time)
        console.log(end_time)
        
        const treats = this.state.treatment_turn.filter(x => {
            const date = (new Date(x.turn_time)).toLocaleDateString("vi");
            if (this.compareDay(date, start_time) && this.compareDay(end_time, date)) return true;
            else return false;
        })

        this.setState({ search: treats })
    }

    onInputTime() {
        const start_time = this.start_time.value.split("-").reverse().join("/");
        const end_time = this.end_time.value.split("-").reverse().join("/");
        const treats = this.state.treatment_turn.filter(x => {
            const date = (new Date(x.turn_time)).toLocaleDateString("vi");
            if (this.compareDay(date, start_time) && this.compareDay(end_time, date)) return true;
            else return false;
        })

        this.setState({ search: treats })
    }

    compareDay(day1, day2) {
        day1 = day1.split("/").map(x => parseInt(x));
        day2 = day2.split("/").map(x => parseInt(x));

        if (parseInt(day1[2]) > parseInt(day2[2])) return true;
        else if (parseInt(day1[2]) < parseInt(day2[2])) return false;
        else if (parseInt(day1[1]) > parseInt(day2[1])) return true;
        else if (parseInt(day1[1]) < parseInt(day2[1])) return false;
        else if (parseInt(day1[0]) > parseInt(day2[0])) return true;
        else if (parseInt(day1[0]) < parseInt(day2[0])) return false;
        else return true;
    }

    onSubmitPayment() {
        let total = 0;
        this.state.orderDetailsOpen.map(detail => total += detail.quantity * detail.price)
        axios.post('https://mysql-healthcare.herokuapp.com/api/insert/momo_payment', { medicine_id: this.state.treatment_curr.prescribe_id })
        axios.post('https://mysql-healthcare.herokuapp.com/payment_momo', { total: total.toString() })
            .then(res => {
                window.location.href = res.data.payUrl
            });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const treatment = {
            treatment_id: this.state.treatment_curr.id,
            blood_pressure: this.blood_pressure.value,
            heart_beat: this.heart_beat.value,
            diagnose: this.diagnose.value,
            therapy: this.therapy.value
        }
        const idx = this.state.treatment_turn.indexOf(this.state.treatment_curr);
        const new_treat = {
            ...this.state.treatment_curr,
            blood_pressure: this.blood_pressure.value,
            heart_beat: this.heart_beat.value,
            diagnose: this.diagnose.value,
            therapy: this.therapy.value
        }
        this.setState({ treatment_curr: new_treat });
        this.state.treatment_turn[idx] = new_treat;

        alert('Chỉnh sửa thành công');
        this.toggleEdit();
        // console.log(treatment);
        await axios.post('https://mysql-healthcare.herokuapp.com/api/update/treatment_turn_doctor', treatment)
    }

    toggleEdit() {
        this.setState({ is_edit: !this.state.is_edit });
    }

    async toggleOpen(treatment, flag) {
        let res = [];
        let payment = [];
        let user = {};
        // console.log(treatment);

        if (flag) {
            this.setState({ treatment_curr: treatment })

            user = await axios.get('https://mysql-healthcare.herokuapp.com/api/get/info', { params: { phonenum: treatment.patient_phone } })
            this.setState({ system_user: user.data.user })
            console.log(user.data)

            if (treatment.prescribe_id !== null) {
                res = await axios.get('https://mysql-healthcare.herokuapp.com/api/get/order_details', { params: { orderID: treatment.prescribe_id } })
                this.setState({ orderDetailsOpen: res.data.order_details })
                console.log(res.data.order_details)

                payment = await axios.get('https://mysql-healthcare.herokuapp.com/api/get/payment', { params: { medicine_id: treatment.prescribe_id } })
                this.setState({ payment_detail: payment.data.payment })
                console.log(payment)
            }
        }
        this.setState({ is_open: !this.state.is_open })
    }

    async componentDidMount() {
        const res = await axios.get('https://mysql-healthcare.herokuapp.com/api/get/doctor_treatment', { params: { phone: this.state.phone } })

        const treatments = res.data.sort((a, b) => {
            let day1 = (new Date(b.turn_time)).toLocaleDateString('vi');
            let day2 = (new Date(a.turn_time)).toLocaleDateString('vi');

            day1 = day1.split("/").map(x => parseInt(x));
            day2 = day2.split("/").map(x => parseInt(x));

            if (parseInt(day1[2]) > parseInt(day2[2])) return 1;
            else if (parseInt(day1[2]) < parseInt(day2[2])) return -1;
            else if (parseInt(day1[1]) > parseInt(day2[1])) return 1;
            else if (parseInt(day1[1]) < parseInt(day2[1])) return -1;
            else if (parseInt(day1[0]) > parseInt(day2[0])) return 1;
            else if (parseInt(day1[0]) < parseInt(day2[0])) return -1;
            else return 0;
        });

        this.setState({ treatment_turn: treatments });
        this.setState({ search: treatments })
        console.log(this.state.treatment_turn)

    };

    render() {
        const treatment_turn = this.state.search.map((x) => {
            if (true) {
                const date = new Date(x.turn_time)
                // console.log(date.getMinutes())
                return (
                    <tr>
                        <th scope="row">
                            {this.state.treatment_turn.indexOf(x) + 1}
                        </th>
                        <td>
                            {x.id}
                        </td>
                        <td>
                            {date.getHours() + ":" +
                                (() => date.getMinutes() === 0 ? "00" : date.getMinutes())()
                                + " " + date.getDate() + "/" + (parseInt(date.getMonth()) + 1).toString()
                                + "/" + date.getFullYear()}
                        </td>
                        <td>
                            {x.fullname}
                        </td>
                        <td>
                            {x.doctor_phone}
                        </td>
                        <td>
                            {/* <Link to={`/view_medical_detail/${x.id}`}> */}
                            <Button style={{
                                backgroundColor: '#62AFFC',
                                marginTop: '-4px',
                                border: '0px',
                                color: 'white',
                                borderRadius: '10px',
                                height: '30px',
                                paddingTop: '2px'
                            }} disabled={!(this.context.phone === x.patient_phone || this.context.role === "Doctor")}
                                onClick={() => this.toggleOpen(x, true)}>
                                {this.context.role === "Patient" ? <span>Xem</span> : <span> Chỉnh sửa </span>}
                            </Button>
                            {/* </Link> */}
                        </td>
                    </tr>
                )
            }
        }
        )

        const sortByDay = <Row>
            <Col md="2">
                <Input className="search-box-sort" id="startTime" name="date" placeholder="Bắt đầu" type="date"
                    innerRef={(input) => this.start_time = input} style={{ width: '180px' }} />
            </Col>
            <Col md="2">
                <Input className="search-box-sort" id="endTime" name="date" placeholder="Kết thúc" type="date"
                    innerRef={(input) => this.end_time = input} style={{ width: '180px' }} />
            </Col>
            <Col md="2">
                <Button className="search-statistic-button" style={{ marginTop: '0px', width: '102px' }} onClick={this.onInputTime}>
                    <FaSearch /> Tìm <span style={{ textTransform: 'lowercase' }}> kiếm </span>
                </Button>
            </Col>
        </Row>
        if (this.context.role !== "Doctor") return <Switch> <Redirect to={`/${this.context.role}`} /></Switch>
        return (
            <Container id='dung-benhan'>
                <Row style={{ textAlign: 'center', marginTop: '50px', marginBottom: '20px' }}>
                    <Col class='dung-title'>
                        <h1>Lượt điều trị</h1>
                        <hr />
                    </Col>
                </Row>

                <Row>
                <Button className="search-button-sort" onClick={() => this.sortAll()}>
                        Tất cả
                    </Button>
                    <Button className="search-button-sort" onClick={() => this.sortToday()}>
                        Hôm nay
                    </Button>
                    <Button className="search-button-sort" onClick={() => this.sortThisWeek()}>
                        Trong tuần này
                    </Button>
                    <Button className="search-button-sort" onClick={() => this.sortThisMonth()}>
                        Trong tháng này
                    </Button>
                </Row>

                {sortByDay}

                <Row style={{ marginBottom: '50px', marginTop: '20px' }}>
                    <Col>
                        <Table hover >
                            <thead>
                                <tr>
                                    <th>
                                        #
                                    </th>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Ngày khám
                                    </th>
                                    <th>
                                        Bác sĩ phụ trách
                                    </th>
                                    <th>
                                        Số điện thoại
                                    </th>
                                    <th>

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatment_turn}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <Modal isOpen={this.state.is_open} toggle={this.toggleOpen} fullscreen>
                    <ModalBody style={{ overflowY: 'auto' }}>
                        <Container>
                            <Row>
                                <Col md="11">
                                    <img src="/assets/images/Logo.png" alt="Logo" width="50px" height="50px"></img>
                                </Col>
                                <Col md="1" style={{ float: 'right' }}>
                                    <Button style={{
                                        backgroundColor: '#62AFFC',
                                        border: '0px',
                                        height: '30px',
                                        marginTop: '10px',
                                        width: '30px',
                                        padding: '0'
                                    }}
                                        onClick={() => this.toggleOpen("", false)}> X </Button>
                                </Col>
                            </Row>
                            <Row style={{ textAlign: 'center' }}>
                                <Col>
                                    <span style={{ fontSize: '25px', fontWeight: 'bold' }}>
                                        Thông tin lượt điều trị
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '10px' }}>
                                <Col>
                                    <span style={{ fontWeight: 'bold' }}>
                                        Mã điều trị:&nbsp;
                                    </span>
                                    {this.state.treatment_curr.id}
                                </Col>
                                <Col>
                                    <span style={{ fontWeight: 'bold' }}> Bác sĩ khám bệnh: </span> {this.state.treatment_curr.fullname}
                                </Col>
                            </Row>
                            <Row style={{ border: '1px solid', borderRadius: '10px', padding: '10px 0px 5px 0px', marginBottom: '10px' }}>
                                <Col>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col >
                                            <span style={{ fontWeight: 'bold' }}> Bệnh nhân: </span> {this.state.system_user.lastname + " " + this.state.system_user.firstname}
                                        </Col>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}> Ngày sinh: </span> {(new Date(this.state.system_user.dateofbirth)).toLocaleDateString('vi')}
                                        </Col>
                                    </Row>

                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}>Vấn đề sức khỏe: </span> {this.state.treatment_curr.health_issue}
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}> Huyết áp: </span> {this.state.treatment_curr.blood_pressure}
                                        </Col>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}> Nhịp tim: </span> {this.state.treatment_curr.heart_beat}

                                            {/* <Input defaultValue={this.state.treatment_curr.diagnose} onChange={(e) => { this.state.treatment_curr.diagnose = e.target.value }} placeholder="Chẩn đoán" />
                                <Input defaultValue={this.state.treatment_curr.therapy} onChange={(e) => { this.state.treatment_curr.therapy = e.target.value }} placeholder="Điều trị" /> */}
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}> Chẩn đoán: </span>{this.state.treatment_curr.diagnose}
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}> Phương pháp điều trị: </span>{this.state.treatment_curr.therapy}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '10px' }}>
                                <Col>
                                    <span style={{ fontWeight: 'bold' }}> Lịch hẹn: </span> {(new Date(this.state.treatment_curr.turn_time)).toLocaleString('vi')}
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: '10px' }}>
                                {((+(new Date(this.state.treatment_curr.start_time))) > (+(new Date()))) ? <Col> <Badge color="danger" style={{ fontSize: '15px' }}> Chưa đến thời gian khám </Badge> </Col> :
                                    <>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}> Thời điểm bắt đầu: </span>{(new Date(this.state.treatment_curr.start_time)).toLocaleString('vi')}
                                        </Col>
                                        <Col>
                                            <span style={{ fontWeight: 'bold' }}>Thời điểm kết thúc: </span>{(new Date(this.state.treatment_curr.end_time)).toLocaleString('vi')}
                                        </Col> </>}
                            </Row>

                            <Row style={{ marginBottom: '10px' }}>
                                <Col md="2">
                                    <Button
                                        hidden={this.context.role === "Patient" || this.state.treatment_curr.doctor_phone !== this.context.phone || ((+(new Date(this.state.treatment_curr.start_time))) > (+(new Date())))}
                                        style={{
                                            backgroundColor: '#62AFFC',
                                            border: '0px',
                                            width: '100px'
                                        }}
                                        onClick={() => this.toggleEdit()}>
                                        Hiệu chỉnh
                                    </Button>
                                </Col>
                                <Col md="2">
                                    <LinkContainer to={`/prescribe/${this.state.treatment_curr.id}`}
                                        style={{ backgroundColor: '#62AFFC', border: '0px', width: '100px' }}>
                                        <Button
                                            hidden={this.context.role === "Patient" || (this.state.treatment_curr.doctor_phone !== this.context.phone) || ((+(new Date(this.state.treatment_curr.start_time))) > (+(new Date())))}
                                            disabled={this.state.treatment_curr.prescribe_id != null}
                                            style={{
                                                backgroundColor: '#62AFFC',
                                                border: '0px',
                                                width: '100px'
                                            }}>
                                            Kê đơn
                                        </Button>
                                    </LinkContainer>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '20px' }}>
                                <Col md="12" style={{ textAlign: 'center' }}>
                                    {(() => {
                                        if (this.state.treatment_curr.prescribe_id === null)
                                            return <Badge color="primary" style={{ fontSize: '15px' }}> Không có đơn thuốc kèm theo </Badge>
                                        else {
                                            let total = 0
                                            const details = this.state.orderDetailsOpen.map(detail => {
                                                total += detail.price * detail.quantity
                                                return (
                                                    <tr>
                                                        <th scope="row" style={{ textAlign: 'center' }}>
                                                            {this.state.orderDetailsOpen.indexOf(detail) + 1}
                                                        </th>
                                                        <td>
                                                            {detail.drug_name}
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {detail.unit}
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {(detail.price).toLocaleString('vi-VN')}đ
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {detail.quantity}
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>
                                                            {(detail.price * detail.quantity).toLocaleString('vi-VN')}đ
                                                        </td>
                                                    </tr>
                                                );
                                            });

                                            const payment = (() => {
                                                if (this.state.payment_detail.length === 0) return <Badge color="danger" style={{ fontSize: '15px', marginBottom: '20px' }}> Chưa thanh toán </Badge>
                                                else return <Badge color="success" style={{ fontSize: '15px', marginBottom: '20px' }}> Đã thanh toán </Badge>
                                            })()
                                            return <><Badge color="primary" style={{ fontSize: '15px', marginBottom: '20px', marginRight: '10px' }}> Đơn thuốc kèm theo </Badge>
                                                {payment}
                                                <Table responsive hover striped bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                #
                                                            </th>
                                                            <th>
                                                                Tên thuốc
                                                            </th>
                                                            <th style={{ textAlign: 'center' }}>
                                                                Đơn vị tính
                                                            </th>
                                                            <th style={{ textAlign: 'center' }}>
                                                                Đơn giá
                                                            </th>
                                                            <th style={{ textAlign: 'center' }}>
                                                                Số lượng
                                                            </th>
                                                            <th style={{ textAlign: 'right' }}>
                                                                Thành tiền
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(() => { if (this.state.orderDetailsOpen.length === 0) return <Spinner className="detail-spinner"> Loading... </Spinner> })()}
                                                        {details}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th colSpan="5" style={{ textAlign: 'center' }}>
                                                                Tổng cộng
                                                            </th>
                                                            <th style={{ textAlign: 'right' }}>
                                                                {total.toLocaleString('vi-VN')}đ
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                </Table></>
                                        }
                                    })()}
                                </Col>
                            </Row>
                            <Row style={{ textAlign: 'right' }}>
                                <Col>
                                    <Button style={{
                                        backgroundColor: '#62AFFC',
                                        border: '0px'
                                    }} hidden={this.context.role === "Doctor" || this.state.treatment_curr.prescribe_id === null}
                                        disabled={this.state.payment_detail.length !== 0}
                                        onClick={this.onSubmitPayment}>
                                        <span style={{ fontWeight: 'bold' }}> Thanh toán </span>
                                    </Button>
                                </Col>
                            </Row>
                            {/* <Link to={`/prescribe-med/${JSON.stringify(this.state.treatment_curr.prescribe_id)}/${JSON.stringify(this.state.system_user.phone)}`}>
                                    <Button className='order-button' >
                                        Đơn thuốc đã kê: {this.state.treatment_curr.prescribe_id}
                                    </Button>
                                </Link> */}

                        </Container>
                    </ModalBody>
                    {/* <Button >Thêm đơn thuốc</Button>
                    <Button onClick={(e) => {
                        if (this.state.treatment_curr.end_time === "") this.state.treatment_curr.end_time = new Date();
                        //submit gọi
                        this.toggleEdit();
                    }}           >Xác nhận </Button> */}

                </Modal>
                <Modal isOpen={this.state.is_edit} toggle={this.toggleEdit}>
                    <ModalHeader> Lượt điều trị cho bệnh nhân </ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col>
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup row>
                                            <Label
                                                for="exampleEmail"
                                                sm={3}
                                            >
                                                Huyết áp
                                            </Label>
                                            <Col sm={9}>
                                                <Input innerRef={input => this.blood_pressure = input}
                                                    required
                                                    id="exampleEmail"
                                                    name="email"
                                                    placeholder=""
                                                    type="number"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label
                                                for="examplePassword"
                                                sm={3}
                                            >
                                                Nhịp tim
                                            </Label>
                                            <Col sm={9}>
                                                <Input innerRef={input => this.heart_beat = input}
                                                    required
                                                    id="examplePassword"
                                                    name="password"
                                                    placeholder=""
                                                    type="number"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label
                                                for="examplePassword"
                                                sm={3}
                                            >
                                                Chẩn đoán
                                            </Label>
                                            <Col sm={9}>
                                                <Input innerRef={input => this.diagnose = input}
                                                    required
                                                    id="examplePassword"
                                                    name="password"
                                                    placeholder=""
                                                    type="textarea"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label
                                                for="examplePassword"
                                                sm={3}
                                            >
                                                Phương pháp điều trị
                                            </Label>
                                            <Col sm={9}>
                                                <Input innerRef={input => this.therapy = input}
                                                    required
                                                    id="examplePassword"
                                                    name="password"
                                                    placeholder=""
                                                    type="textarea"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <Row style={{ textAlign: 'right' }}>
                                            <Col>
                                                <Button
                                                    style={{
                                                        backgroundColor: '#62AFFC',
                                                        border: '0px'
                                                    }}>
                                                    Submit
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}
ViewTreatmentTurn.contextType = HeaderDefine;
export default ViewTreatmentTurn;
