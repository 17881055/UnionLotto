import React, { Component } from "react";
import { DataView } from '@antv/data-set';
import { Tag, Row, Col } from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label } from "BizCharts";

const cols = {
    percent: {
        formatter: val => {
            val = (val * 100).toFixed(2) + '%';
            return val;
        }
    }
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
 *  每个球出现的百分比
 */
let view = (props) => {
    var redDv = new DataView();
    redDv.source(format(props.source).red).transform({
        type: 'percent',
        field: 'value',
        dimension: 'num',
        as: 'percent'
    });

    var blueDv = new DataView();
    blueDv.source(format(props.source).blue).transform({
        type: 'percent',
        field: 'value',
        dimension: 'num',
        as: 'percent'
    });

    return (
        <div>
            <Row>
                <Col span={15}>
                    <Tag style={{ marginLeft: 35 }} color="#f50">红球</Tag>
                    <Chart height={500} data={redDv} scale={cols} forceFit>
                        <Coord type={'theta'} radius={0.7} innerRadius={0.55} />
                        <Axis name="percent" />
                        <Tooltip
                            showTitle={false}
                            itemTpl='<li><span style="background-color:{color};"></span>{num}  : {value}</li>'
                        />
                        <Geom
                            type="intervalStack"
                            position="percent"
                            tooltip={['num*percent', (item, percent) => {
                                percent = (percent * 100).toFixed(2) + '% ';
                                return {
                                    num: item,
                                    value: percent
                                };
                            }]}
                            style={{ lineWidth: 1, stroke: '#f0f2f5' }}>
                            <Label labelLine={{
                                lineWidth: 1, // 线的粗细
                                stroke: '#888'
                            }}
                                content='percent' formatter={(val, item) => {
                                    return item.point.num + '     ' + val;
                                }} />
                        </Geom>
                    </Chart>
                </Col>
                <Col span={9}>
                    <Tag style={{ marginLeft: 35 }} color="#108ee9">蓝球</Tag>
                    <Chart height={500} data={blueDv} scale={cols} forceFit>
                        <Coord type={'theta'} radius={0.7} innerRadius={0.55} />
                        <Axis name="percent" />
                        <Tooltip
                            showTitle={false}
                            itemTpl='<li><span style="background-color:{color};"></span>{num}  : {value}</li>'
                        />
                        <Geom
                            type="intervalStack"
                            position="percent"
                            tooltip={['num*percent', (item, percent) => {
                                percent = (percent * 100).toFixed(2) + '% ';
                                return {
                                    num: item,
                                    value: percent
                                };
                            }]}
                            style={{ lineWidth: 1, stroke: '#f0f2f5' }}>
                            <Label labelLine={{
                                lineWidth: 1, // 线的粗细
                                stroke: '#888'
                            }}
                                content='percent' formatter={(val, item) => {
                                    return item.point.num + '     ' + val;
                                }} />
                        </Geom>
                    </Chart>
                </Col>
            </Row>
        </div>
    )
}

export default view;