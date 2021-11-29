import React, { Component } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { Input, Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { FaSearch } from 'react-icons/fa';
import Pagination from "pagination-component";
import NurseSideBar from '../../../5.Share Component/SideBar/NurseSideBarComponent';
import { Link } from 'react-router-dom';
import './manage_order.css';
import { Switch, Redirect } from 'react-router';

import axios from 'axios';
import HeaderDefine from '../../../5.Share Component/Context';

class ViewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            orders_search: [],
            activePage: 1,
            nums_page: 1,
            sort: 1
        }
        this.onInputOrderID = this.onInputOrderID.bind(this);
        this.changePage = this.changePage.bind(this);
        this.sortByKey = this.sortByKey.bind(this);
        this.sortByDay = this.sortByDay.bind(this);
        this.onInputTime = this.onInputTime.bind(this);
    }

    onInputTime() {
        const start_time = this.convertDate2(this.start_time.value);
        const end_time = this.convertDate2(this.end_time.value);

        const data = this.state.orders.filter(order => {
            const day = this.convertDate(order.created_date)

            if (this.compareDay(day, start_time) === true && this.compareDay(end_time, day) === true) return true;
            else return false
        })
        this.setState({ orders_search: data })
    }

    compareDay(day1, day2) {
        day1 = day1.split("/").map(x => parseInt(x));
        day2 = day2.split("/").map(x => parseInt(x));

        if (parseInt(day1[2]) > parseInt(day2[2])) return true;
        else if (parseInt(day1[2]) < parseInt(day2[2])) return false;
        else if (parseInt(day1[1]) > parseInt(day2[1])) return true;
        else if (parseInt(day1[1]) < parseInt(day2[1])) return false;
        else if (parseInt(day1[0]) >= parseInt(day2[0])) return true;
        else return false;
    }

    convertDate(day) {
        let date = day.getDate();
        let month = day.getMonth() + 1;
        let year = day.getYear() + 1900;

        if (date < 10) date = "0" + date.toString();
        if (month < 10) month = "0" + month.toString();

        return date + "/" + month + "/" + year;
    }

    convertDate2(day) {
        day = day.split('-');
        return day[2] + "/" + day[1] + "/" + day[0];
    }

    sortByDay() {
        this.setState({
            sort: 2
        })
    }

    sortByKey() {
        this.setState({
            sort: 1
        })
    }

    componentDidMount() {
        axios.get('/api/get/orders')
            .then(res => {
                const orders = res.data.orders.map(order => {
                    const newOrder = order;
                    newOrder.created_date = new Date(order.created_date);
                    return newOrder;
                })
                this.setState({ orders: orders, orders_search: orders, orderOpen: orders[0] });
            })
            .catch(error => console.log(error));
    }

    changePage(page) {
        this.setState({ activePage: page });
    }

    onInputOrderID() {
        let id = this.state.orders.filter(order => {
            return order.id.toString().includes(this.search_item.value.toString())
        });
        let name = this.state.orders.filter(order => {
            return (order.full_name.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
                .replace(/Đ/g, 'D').toLowerCase()
                .includes(this.search_item.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase())) && !id.includes(order)
        });

        let search = [];

        if (id.length !== 0) {
            search = id;
            if (name.length !== 0) search.push(name);
        } else if (name.length !== 0) {
            search = name;
            if (id.length !== 0) search.push(id);
        }

        this.setState({ orders_search: search });
    }

    render() {
        if (this.state.orders_search.length !== 0) {
            let nums_page = Math.ceil(this.state.orders_search.length / 10);
            if (nums_page !== this.state.nums_page && nums_page !== 0)
                this.setState({ nums_page: nums_page });
        } else {
            if (this.state.nums_page !== 1)
                this.setState({ nums_page: 1 });
        }

        const display_order = this.state.orders_search.map((order) => {
            return (
                <tr>
                    <th scope="row">
                        {this.state.orders_search.indexOf(order) + 1}
                    </th>
                    <td>
                        {order.full_name}
                    </td>
                    <td>
                        {order.id}
                    </td>
                    <td>
                        {this.convertDate(order.created_date)}
                    </td>
                    <td>
                        {(order.total).toLocaleString('vi-VN')}đ
                    </td>
                    <td>
                        <Link to={`/view_order_details/${JSON.stringify(order.id)}`}>
                            <Button className='order-button' >
                                Xem
                            </Button>
                        </Link>
                    </td>
                </tr>
            )
        });

        let not_Found = <span></span>;
        if (display_order.length === 0) not_Found = <div className="not-found-search"> Không tìm thấy kết quả </div>
        else not_Found = <span></span>;

        const containerStyle = (count) => {
            if (count > 100) return { marginLeft: '25vh' }
            else if (count > 30) return { marginLeft: '34%' }
            else if (count > 20) return { marginLeft: '37.5%' }
            else return { marginLeft: '46.5%' }
        };

        const itemStyle = {
            float: "left",
            marginLeft: "5px",
            marginRight: "5px",
            backgroundColor: "#FFFAF7",
            color: "black",
            cursor: "pointer",
            width: "50px",
            textAlign: "center",
            borderRadius: "5px"
        };
        const sortByKey = <Row>
            <Col md="3">
                <Input className="search-box-sort" id="search" name="search-drugs" placeholder="Nhập đơn hàng"
                    innerRef={(input) => this.search_item = input} />
            </Col>
            <Button className="search-button" onClick={this.onInputOrderID}>
                <FaSearch /> Tìm <span style={{ textTransform: 'lowercase' }}> kiếm </span>
            </Button>
        </Row>
        const sortByDay = <Row>
            <Col md="3">
                <Input className="search-box-sort" id="startTime" name="date" placeholder="Bắt đầu" type="date"
                    innerRef={(input) => this.start_time = input} />
            </Col>
            <Col md="3">
                <Input className="search-box-sort" id="endTime" name="date" placeholder="Kết thúc" type="date"
                    innerRef={(input) => this.end_time = input} />
            </Col>
            <Col md="3">
                <Button className="search-statistic-button" style={{ marginTop: '0px' }} onClick={this.onInputTime}>
                    <FaSearch /> Tìm <span style={{ textTransform: 'lowercase' }}> kiếm </span>
                </Button>
            </Col>
        </Row>
        if (this.context.role !== "Nurse") return <Switch> <Redirect to={`/${this.context.role}`} /></Switch>
        return (
            <>
                <NurseSideBar />
                <Container>
                    <Row className="manage-order-heading">
                        <Col className='manage-order-header'> Danh sách đơn hàng </Col>
                    </Row>
                    <Row>
                        <Button className="search-button-sort" onClick={() => this.sortByKey()}>
                            Tìm theo từ khóa
                        </Button>
                        <Button className="search-button-sort" onClick={() => this.sortByDay()}>
                            Tìm theo ngày
                        </Button>
                    </Row>

                    <Row>
                        <Col>
                            {this.state.sort === 1 && sortByKey}
                            {this.state.sort === 2 && sortByDay}
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            {not_Found}
                            <Table responsive hover striped>
                                <thead>
                                    <tr>
                                        <th>
                                            #
                                        </th>
                                        <th>
                                            Tên khách hàng
                                        </th>
                                        <th>
                                            Mã đơn hàng
                                        </th>
                                        <th>
                                            Ngày tạo đơn
                                        </th>
                                        <th>
                                            Tổng tiền
                                        </th>
                                        <th>
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {display_order.slice((this.state.activePage - 1) * 10,
                                        (this.state.activePage * 10))}
                                </tbody>
                            </Table>
                            {this.state.orders_search.length === 0 && (() => { return <Spinner className="detail-spinner"> Loading... </Spinner> })()}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px', paddingBottom: '20px' }}>
                        <Col style={containerStyle(this.state.orders_search.length)}>
                            <Pagination className="health-panigation"
                                initialPage={1} show={10}
                                pageCount={this.state.nums_page}
                                onChange={page => this.changePage(page)}>
                                {({ setPage, page, index, currentPage, isPrev, isNext, isCurrentPage }) => {
                                    if (isPrev)
                                        return (
                                            <div style={itemStyle} onClick={() => setPage({ prev: true })}>
                                                {"<"}
                                            </div>
                                        );

                                    if (isNext)
                                        return (
                                            <div style={itemStyle} onClick={() => setPage({ next: true })}>
                                                {">"}
                                            </div>
                                        );

                                    return (
                                        <div className="healthcare-pagination-button"
                                            key={index}
                                            style={{ ...itemStyle, backgroundColor: isCurrentPage ? "#62AFFC" : "white" }}
                                            onClick={() => {
                                                console.log(`Navigating from page ${currentPage} to page ${page}`);
                                                setPage({ page });
                                            }}>
                                            <h1 className="healthcare-pagination-number">{page}</h1>
                                        </div>
                                    );
                                }}
                            </Pagination>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}
ViewOrder.contextType = HeaderDefine
export default ViewOrder;