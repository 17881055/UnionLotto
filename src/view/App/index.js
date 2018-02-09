import React, { Component } from "react";
import { Layout, Menu, Icon, Breadcrumb, Steps, Spin, notification, Radio, Button, Tag, Divider, Alert, Row, Col } from 'antd';
import './style.css';
import { ipcRenderer } from "electron";
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label } from "BizCharts";
import MESSAGE_TYPE from "../../../src-app/message";
import { DataView } from '@antv/data-set';
import ApiecePercen from '../components/ApiecePercen';
import ApieceApperars from '../components/ApieceApperars';
import LocationChances from '../components/LocationChances';
import ApicecRelation from '../components/ApicecRelation';


const openNotification = (msg) => {
    notification.open({
        message: 'Notification Title',
        description: msg,
        icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    });
};

const Step = Steps.Step;
const RadioGroup = Radio.Group;
const { Header, Sider, Content, Footer } = Layout;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateTime: null,
            result: null,
            canImportDB: false,
            loading: false,
            logStr: ""
        };
    }

    componentWillMount() {
        ipcRenderer.on('n2b_msg', function (event, type, message) {
            switch (type) {
                case MESSAGE_TYPE.RESPONSE_DATA:
                    console.log('收到数据!', JSON.parse(message));
                    let data = JSON.parse(message);
                    let t = new Date(data[0].reverse()[0]["date"]).getTime();
                    let r = this.formatData(data[1]);
                    this.setState({
                        result: r,
                        updateTime: t,
                        canImportDB: true,
                        loading: false,
                    });
                    break;
            }
        }.bind(this));
    }

    componentDidMount() {
        //数据库获取数据
        console.log('获取数据!');
        ipcRenderer.send('b2n_msg', MESSAGE_TYPE.REQUEST_DATA);
    }

    handleUpdate = () => {
        console.log('获取在线数据!');
        this.setState({
            loading: true,
        });
        fetch("http://www.17500.cn/getData/ssq.TXT")
            .then(res => {
                if (res.status == 404) return res.error();
                return res.text()
            })
            .then(
            (result) => {

                let r = this.formatData(result);
                let t = new Date().getTime();
                this.setState({
                    result: r,
                    updateTime: t,
                    canImportDB: true,
                    loading: false,
                });
            },
            (error) => {
                console.log("error", error);
                this.setState({
                    loading: false,
                    logStr: "错误"
                });
            }
            )
    }

    handleImportDB = () => {
        const {
            result,
            updateTime,
        } = this.state;

        ipcRenderer.send('b2n_msg', MESSAGE_TYPE.IMPORT_DB, {
            updateTime,
            result
        });

        this.setState({
            canImportDB: false,
        });
    }

    render() {
        const {
            result,
            updateTime,
            canImportDB,
            loading,
            logStr
        } = this.state;

        return (
            <div >
                <Layout>
                    <Header style={{ position: 'fixed', width: '100%', zIndex: 9 }}>
                    </Header>
                    <Content style={{ marginTop: 64, padding: "0 50px" }}>
                        <Spin size="small" spinning={loading} >
                            <div style={{ minHeight: 500 }}>
                                <div style={{ marginBottom: 30 }}>
                                </div>
                                <p>数据最后更新日期：<span>{this.formatTime(updateTime)}</span></p>
                                <Button type="primary"
                                    onClick={this.handleUpdate}>
                                    在线获取数据
                                </Button>
                                <Button
                                    disabled={!canImportDB}
                                    onClick={this.handleImportDB}
                                    style={{ marginLeft: 30 }} >
                                    保存入数据库
                                </Button>

                                <div>
                                    <Divider style={{ marginTop: 10 }}>统计图表</Divider>

                                    <ApieceApperars source={result} />

                                    <Divider style={{ marginTop: 10 }}>每个球出现过的百分比统计图表</Divider>

                                    <ApiecePercen source={result} />

                                    <Divider style={{ marginTop: 10 }}>每个位置出现的统计图表</Divider>

                                    <LocationChances source={result} />

                                    <Divider style={{ marginTop: 10 }}>球于球的关系图表</Divider>

                                    <ApicecRelation source={result} />

                                </div>
                                <Divider style={{ marginTop: 10 }}></Divider>
                                <Divider style={{ marginTop: 10 }}>日志</Divider>
                                <p>{logStr}</p>
                            </div>
                        </Spin>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Copyleft ©2017 Created by Ethan     version 0.1.0
                    </Footer>
                </Layout>
            </div>
        )
    }

    /**
    * 1 开奖期号
    * 2 开奖日期
    * 3 红1
    * 4 红2
    * 5 红3
    * 6 红4
    * 7 红5
    * 8 红6
    * 9 蓝
    */
    formatData(value) {
        let result;
        if (!value) return null;
        if (value instanceof Array) {  //数据库来的是数组
            result = value.map(
                (v, i) => {
                    return [
                        v.periods.toString(),
                        v.date.toString(),
                        v.red_num_1 <= 9 ? `0${v.red_num_1}` : `${v.red_num_1}`,
                        v.red_num_2 <= 9 ? `0${v.red_num_2}` : `${v.red_num_2}`,
                        v.red_num_3 <= 9 ? `0${v.red_num_3}` : `${v.red_num_3}`,
                        v.red_num_4 <= 9 ? `0${v.red_num_4}` : `${v.red_num_4}`,
                        v.red_num_5 <= 9 ? `0${v.red_num_5}` : `${v.red_num_5}`,
                        v.red_num_6 <= 9 ? `0${v.red_num_6}` : `${v.red_num_6}`,
                        v.blue_num <= 9 ? `0${v.blue_num}` : `${v.blue_num}`,
                    ]
                }
            )
        } else {
            result = value.split("\n").map(
                (v, i) => v.split(" ")
            );
        }

        return result;
    }

    formatTime(value) {
        if (!value) return null;
        let date = new Date(value);
        let now = "";
        now = date.getFullYear() + "-";
        now = now + (date.getMonth() + 1) + "-";
        now = now + date.getDate() + " ";
        now = now + date.getHours() + ":";
        now = now + date.getMinutes() + ":";
        now = now + date.getSeconds() + "";
        return now;
    }
}   