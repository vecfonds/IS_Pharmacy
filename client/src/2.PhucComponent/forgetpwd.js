import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Input, Row, Col,Button } from 'reactstrap';
import Home from '../1.CatComponent/HomeComponent';
import axios from 'axios';
class SignPwd extends Component{
    subReg(){
        
        axios.get("/api/tests");
        axios.post('/regist');
    }
    constructor(props) {
        super(props);
        this.subreg=this.subReg.bind(this);
    }
    render(){
        const {phone,pwd}=this.props;
        return(
            <div classname="center">
                <Row>
                <Col xs={1}/>
                <Col>

                    <h1> Quên mật khẩu </h1>
                    Số điện thoại
                    <Input name="Phone" text={phone} type="number" required/>
                    Ngày sinh
                    <Input name="Date" type="date" required/>
                    Mật khẩu mới
                    <Input name="pwd" text={pwd} type="password" required/>
                    Xác nhận mật khẩu
                    <Input name="pwd" text={pwd} type="password" required/>
                    <Button color="primary">Đổi mật khẩu</Button>
                </Col>
                
                <Col xs={1}/>
                <Col>
                <h1> Đăng ký </h1>
                <form >
                Họ và tên
                <Input name="name" text={"Võ Hồng Phúc"} type="text" required/>
                    Ngày sinh
                    <Input name="Date" type="date" required/>
                Số điện thoại
                    <Input name="Phone" text={phone} type="number" required/>
                    Mật khẩu mới
                    <Input name="pwd" text={pwd} type="password" required/>
                    Xác nhận mật khẩu
                    <Input name="pwd" text={pwd} type="password" required/>
                    
                    <Button   color="primary">Đăng ký</Button>
                
            <Button onClick={this.subreg}className="exception">Bạn muốn đăng nhập</Button>
            </form>
            </Col>
                <Col xs={1}/>
                </Row>
                </div>
        )
    };
    
}
export default SignPwd;
