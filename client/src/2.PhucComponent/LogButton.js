import React, { useContext, useState } from 'react'
import HeaderDefine from '../5.Share Component/Context'
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';
import { Switch, Redirect } from 'react-router';
import { Nav, NavItem, } from 'reactstrap';
import { useEffect } from 'react';
import axios from 'axios';

const LogButton = (props) => {
    const user = useContext(HeaderDefine);
    console.log(user);
    useEffect(() => {
        async function checkData() {
            const res = await axios.get('https://mysql-healthcare.herokuapp.com/api/get/session', {params: {session_id: sessionStorage.getItem('sessionId')}})
            console.log("done get session")
            console.log(res.data);
            if (res.data) {
                user.setPhone(res.data.phone);
                user.setName(res.data.firstname);
                // user.setRole(res.data.role);
                user.setImg(res.data.img);

                if (res.data.phone !== undefined)
                    if (res.data.phone !== '') {
                        const resp = await axios.get('https://mysql-healthcare.herokuapp.com/api/get/role', { params: { phonenum: res.data.phone } });
                        user.setRole(resp.data.role);
                    }

            }
        };
        checkData();
    }, []);


    const [swit, setSwit] = useState(<span></span>);
    const logOut = async () => {
        console.log("OUT")
        user.setPhone("");
        user.setRole("Guest");
        props.updatePage('home');
        setSwit(<Switch> <Redirect to='/home' /> </Switch>)

        await axios.get('https://mysql-healthcare.herokuapp.com/api/destroy/session', {params: {session_id: sessionStorage.getItem('sessionId')}});
        sessionStorage.setItem('sessionId', '')
        // sessionStorage.setItem('user', JSON.stringify({ phone: '', role: 'Guest' }));
    }

    // if (user.role === "Guest") {
    //     // var tempUser = sessionStorage.getItem('user');
    //     // if (tempUser) {
    //     //     var userSession = JSON.parse(tempUser)
    //     //     if (userSession.role !== "Guest") {
    //     //         user.setRole(userSession.role);
    //     //         user.setPhone(userSession.phone);
    //     //     }
    //     // }
    //     // else sessionStorage.setItem('user', JSON.stringify({ phone: '', role: "Guest" }));
    //     // axios.get('/api/get/session').then(
    //     //     res=>{
    //     //         const value=res.data;
    //     //         if(value.user){
    //     //             user.setPhone(value.user.phone);
    //     //             user.setRole(value.user.role);
    //     //         }
    //     //         // console.log(m);
    //     //     }
    //     // )
    // }
    // console.log(user.role)

    if (user.role !== "Patient" && user.role !== "Doctor" && user.role !== "Nurse")
        return (
            <>
                {swit}
                <Nav className="ms-auto" navbar>
                    <NavItem>
                        <NavLink className="nav-link" to='/signup' style={{ color: 'black' }} > <FaUserPlus /> Đăng ký </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" to='/login' style={{ color: 'black' }} > <FaSignInAlt /> Đăng nhập </NavLink>
                    </NavItem>
                </Nav>
                {/* <Switch>
                    <Redirect to='/home' />
                </Switch> */}
            </>
        );
    return (
        // <HeaderDefine.Consumer>
        <Nav className="ms-auto" navbar>
            <NavItem style={{ color: 'black' }} >
                <NavLink className="nav-link" to={`/profile/${JSON.stringify(user.phone)}`}>
                    <img src={user.img} className="mini-ava" alt="Mini-ava"
                        style={{ borderRadius: '55px' }} /> {user.name}
                </NavLink>
                {/* <img src={user.user.ava} /> {user.user.fullname} */}
            </NavItem>
            <NavItem style={{ color: 'black' }} >
                <Button
                    style={{
                        backgroundColor: '#5B9BF3',
                        border: '0px',
                        marginTop: '3px'
                    }}
                    onClick={logOut}>
                    Đăng xuất
                </Button>
                {/* <NavLink className="nav-link" to='/home'> <FaSignOutAlt /> Đăng xuất </NavLink> */}
            </NavItem>
            {/* <Switch>
                <Redirect to={'/' + user.role} />
            </Switch> */}
        </Nav>
        // </HeaderDefine.Consumer>
    );


}
export default LogButton;