import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink } from 'reactstrap';

class ViewCart extends Component {
    render(){
        let total = 0;
        const cart = this.props.cart;
        for (let i = 0; i < cart.length; i++) {
            console.log(cart[i].number);
            total += (cart[i].number)*(cart[i].item.price);
        }

        const list = this.props.cart.map(item => {
            return(
                <Col className="cart-item" md="12">
                    <img className="cart-item-img" width="150px" height="150px" src="/assets/images/drug_example.png" alt = "Ảnh thuốc"></img>
                    <div className="cart-item-name"> {item.item.drug_name}  </div>
                    <div className="cart-item-content"> {item.item.unit} </div>

                    <div className="cart-item-number"> {item.number} x {(item.item.price).toLocaleString('vi-VN')}đ</div>

                    <div className="cart-item-price"> {(item.item.price*item.number).toLocaleString('vi-VN')}đ </div>

                </Col>
            );
        })
        return(
        <Container>
            <Row>
                <Col md="12" className="cart-header"> Giỏ hàng của tôi </Col>
            </Row>
            <Row>
                {list}
            </Row>
            <Row>
                <LinkContainer to = {`/payment/${JSON.stringify(this.props.cart)}`}>
                <Button className="cart-button"> 
                    Thanh toán 
                    <div className="cart-total"> {(total).toLocaleString('vi-VN')}đ </div>
                </Button>
                </LinkContainer>
            </Row>
        </Container>
        )}
}

export default ViewCart;