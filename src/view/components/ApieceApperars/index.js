import React, { Component } from "react";
import { DataView } from '@antv/data-set';
import { Tag, Row, Col } from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label } from "BizCharts";

const cols = {
    value: {
        tickInterval: 30,//用于指定坐标轴各个标度点的间距，是原始数据之间的间距差值，tickCount 和 tickInterval 不可以同时声明。
    },
};


function format(result) {
    let red = [];
    let redMap = new Map();
    let blue = [];
    let blueMap = new Map();
    //console.log(result);
    result && result.map(
        /**
         * {Array}
         * 2 红1
         * 3 红2
         * 4 红3
         * 5 红4
         * 6 红5
         * 7 红6
         * 8 蓝
         */
        (v, i) => {
            v.map(
                (v, i) => {
                    if (i >= 2 && i < 8) {  //红球
                        let oValue = redMap.get(v) || 0;
                        redMap.set(v, ++oValue);
                    }

                    if (i == 8) {  //蓝球
                        let oValue = blueMap.get(v) || 0;
                        blueMap.set(v, ++oValue);
                    }
                }
            )
        }
    )

    for (let i = 0; i < redMap.size; i++) {
        let key = (i < 9) ? '0' + (i + 1) : (i + 1) + '';
        let num = redMap.get(key);
        red.push({
            num: key,
            value: num
        })
    }

    for (let i = 0; i < blueMap.size; i++) {
        let key = (i < 9) ? '0' + (i + 1) : (i + 1) + '';
        let num = blueMap.get(key);
        blue.push({
            num: key,
            value: num
        })

    }
    return {
        red,
        blue
    }
}
/**
 * 
 *  每个球出现的柱状图
 * 
 */
let view = (props) => {
    return (
        <div>
            <Row>
                <Col span={15}>
                    <Tag style={{ marginLeft: 35 }} color="#f50">红球</Tag>
                    <Chart height={380} data={format(props.source).red} scale={cols} forceFit>
                        <Axis name="num" />
                        <Axis name="value" />
                        <Tooltip crosshairs={{ type: "y" }} />
                        <Geom type="interval" position="num*value" />
                    </Chart>

                </Col>
                <Col span={9}>
                    <Tag style={{ marginLeft: 35 }} color="#108ee9">蓝球</Tag>
                    <Chart height={380} data={format(props.source).blue} scale={cols} forceFit>
                        <Axis name="num" />
                        <Axis name="value" />
                        <Tooltip crosshairs={{ type: "y" }} />
                        <Geom type="interval" position="num*value" />
                    </Chart>
                </Col>
            </Row>
        </div>
    )
}

export default view;