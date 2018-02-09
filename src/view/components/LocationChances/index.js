import React, { Component } from "react";
import { DataView } from '@antv/data-set';
import { Tag, Row, Col } from 'antd';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from "BizCharts";

const redCols = {
    location: {
        type: 'cat',
        values: ['位置1', '位置2', '位置3', '位置4', '位置5', '位置6']
    },
    num: {
        type: 'cat',
        values: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33"]
    }
  
}

const blueCols = {
    location: {
        type: 'cat',
        values: ['位置1']
    },
    num: {
        type: 'cat',
        values: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16"]
    }
}

function format(result) {
    let red = [];
    let redP1Map = new Map();
    let redP2Map = new Map();
    let redP3Map = new Map();
    let redP4Map = new Map();
    let redP5Map = new Map();
    let redP6Map = new Map();
    let blue = [];
    let blueMap = new Map();
    result && result.map(
        /**
         * {Array}
         * 2 红位置1
         * 3 红位置2
         * 4 红位置3
         * 5 红位置4
         * 6 红位置5
         * 7 红位置6
         * 8 蓝
         */
        (v, i) => {
            v.map(
                (v, i) => {
                    if (i === 2) {  //红球 位置1
                        let oValue = redP1Map.get(v) || 0;
                        redP1Map.set(v, ++oValue);
                    }
                    if (i === 3) {  //红球 位置2
                        let oValue = redP2Map.get(v) || 0;
                        redP2Map.set(v, ++oValue);
                    }
                    if (i === 4) {  //红球 位置3
                        let oValue = redP3Map.get(v) || 0;
                        redP3Map.set(v, ++oValue);
                    }
                    if (i === 5) {  //红球 位置4
                        let oValue = redP4Map.get(v) || 0;
                        redP4Map.set(v, ++oValue);
                    }
                    if (i === 6) {  //红球 位置5
                        let oValue = redP5Map.get(v) || 0;
                        redP5Map.set(v, ++oValue);
                    }
                    if (i === 7) {  //红球 位置6
                        let oValue = redP6Map.get(v) || 0;
                        redP6Map.set(v, ++oValue);
                    }

                    if (i == 8) {  //蓝球
                        let oValue = blueMap.get(v) || 0;
                        blueMap.set(v, ++oValue);
                    }
                }
            )
        }
    )

    for (let i = 1; i <= 33; i++) {
        let key = (i <= 9) ? '0' + (i) : (i) + '';
        let num1 = redP1Map.get(key);
        let num2 = redP2Map.get(key);
        let num3 = redP3Map.get(key);
        let num4 = redP4Map.get(key);
        let num5 = redP5Map.get(key);
        let num6 = redP6Map.get(key);
        if (num1) {
            red.push({
                location: 0,
                num: key,
                commits: num1
            })
        }
        if (num2) {
            red.push({
                location: 1,
                num: key,
                commits: num2
            })
        }
        if (num3) {
            red.push({
                location: 2,
                num: key,
                commits: num3
            })
        }
        if (num4) {
            red.push({
                location: 3,
                num: key,
                commits: num4
            })
        }
        if (num5) {
            red.push({
                location: 4,
                num: key,
                commits: num5
            })
        }
        if (num6) {
            red.push({
                location: 5,
                num: key,
                commits: num6
            })
        }

    }

    for (let i = 1; i <= 16; i++) {
        let key = (i <= 9) ? '0' + (i) : (i) + '';
        let num = blueMap.get(key);
        blue.push({
            location: 0,
            num: key,
            commits: num
        })

    }

    return {
        red,
        blue
    }
}

/**
 *  每个位置出现的统计
 * 
 */
let view = (props) => {

    return (
        <div>
            <Row>
                <Col span={15}>

                    <Tag style={{ marginLeft: 35 }} color="#f50">红球</Tag>
                    <Chart height={400} data={format(props.source).red} padding={[20, 60, 40, 100]} scale={redCols} forceFit>
                        <Axis name="location" line={null}
                            tickLine={null}
                            grid={null} label={{
                                textStyle: {
                                    fontSize: 14,
                                    fill: '#555'
                                }
                            }}
                        />
                        <Axis name="num" line={{
                            stroke: '#eee',
                            lineWidth: 1
                        }} tickLine={{
                            length: -10
                        }} />

                        <Tooltip showTitle={true} />
                        <Geom type='point'
                            position="num*location"
                            color="#389ffe"
                            shape='circle'
                            size={['commits', [2, 18]]}
                            tooltip='x*y*z'
                            opacity={0.5} />
                    </Chart>

                </Col>
                <Col span={9}>
                    <Tag style={{ marginLeft: 35 }} color="#108ee9">蓝球</Tag>
                    <Chart height={400} data={format(props.source).blue} padding={[20, 60, 40, 100]} scale={blueCols} forceFit>
                        <Axis name="location" line={null}
                            tickLine={null}
                            grid={null} label={{
                                textStyle: {
                                    fontSize: 14,
                                    fill: '#555'
                                }
                            }}
                        />
                        <Axis name="num" line={{
                            stroke: '#eee',
                            lineWidth: 1
                        }} tickLine={{
                            length: -10
                        }} />

                        <Tooltip showTitle={true} />
                        <Geom type='point'
                            position="num*location"
                            color="#389ffe"
                            shape='circle'
                            size={['commits', [2, 18]]}
                            tooltip='x*y*z'
                            opacity={0.5} />
                    </Chart>


                </Col>
            </Row>
        </div>
    )
}


export default view;