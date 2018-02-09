import React, { Component } from "react";
import { DataView, DataSet } from '@antv/data-set';
import { Tag, Row, Col, Checkbox, Radio } from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label, View } from "BizCharts";

const CheckboxGroup = Checkbox.Group;

const cols = {
    score: {
        min: 0,
        max: 100
    }
}
/**
 * 
 * 
 */
export default class ApicecRelation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            source: [],
            num: "01",
        };
    }

    handleChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            num: e.target.value,
        });
    }

    render() {
        const { source } = this.props;
        const { num } = this.state;

        console.log(this.format(source, num).red);

        const data = this.format(source, num).red;

        const dv = new DataView().source(data);

        dv.transform({
            type: 'fold',
            fields: [num], // 展开字段集
            key: 'user', // key字段
            value: 'score', // value字段
        });

        return (
            <div>
                <Row>
                    <Col span={15}>
                        <Tag style={{ marginLeft: 35 }} color="#f50">红球</Tag>

                        <Chart height={500}
                            data={dv}
                            scale={cols}
                            forceFit>
                            <Coord type="polar" radius={0.8} />
                            <Axis name="item" line={null} tickLine={null} grid={{
                                lineStyle: {
                                    lineDash: null
                                },
                                hideFirstLine: false
                            }} />
                            <Tooltip
                                showTitle={true}
                                itemTpl='<li><span style="background-color:{color};"></span>共 {value} 次</li>' />
                            <Axis name="score"
                                line={null}
                                tickLine={null}
                                grid={{
                                    type: 'polygon',
                                    lineStyle: {
                                        lineDash: null
                                    },
                                    alternateColor: 'rgba(0, 0, 0, 0.04)'
                                }} />
                            <Legend name="user" marker="circle" offset={30} />
                            <Geom type='area'
                                position="item*score"
                                color="user" />
                            <Geom type='line'
                                position="item*score"
                                color="user"
                                size={1} />
                            <Geom type='point'
                                position="item*score"
                                color="user"
                                shape="circle"
                                size={3} style={{
                                    stroke: '#fff',
                                    lineWidth: 1,
                                    fillOpacity: 1
                                }} />
                        </Chart>

                        <div>
                            <Radio.Group
                                defaultValue="01"
                                onChange={this.handleChange}>
                                {this.radioButton}
                            </Radio.Group>
                        </div>

                    </Col>
                    <Col span={9}>
                        <Tag style={{ marginLeft: 35 }} color="#108ee9">蓝球</Tag>

                    </Col>
                </Row>
            </div>
        )
    }


    get radioButton() {
        return this.createArr(33, "string").map(
            (v, i) =>
                (<Radio size="small" key={i} value={v} > {v}</Radio>)

        )
    }

    /**
     * 生成连续数组
     * @param {*} count
     * @param {String} type
     *
     */
    createArr(count, type = "number") {
        return new Array(++count).join('0').split('').map(function (v, i) {
            let num = ++i;
            if (type === "string") {
                return num <= 9 ? `0${num}` : `${num}`;
            }
            return num;
        })
    }

    format(result, num) {
        let red = [];
        let redMap = new Map();
        let blue = [];
        let blueMap = new Map();
        result && result.reverse().map(
            /**
             * {Array}
             * 0 期号
             * 1 时间
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
                    (v, i, arr) => {
                        if (i >= 2 && i < 8) {  //红球
                            let cu = v;
                            if (cu === num) {
                                for (let j = 2; j <= 7; j++) {
                                    let ne = arr[j];
                                    if (ne != num) {
                                        let oValue = redMap.get(ne) || 0;
                                        redMap.set(ne, ++oValue);
                                    }
                                }
                            }
                        }
                    }
                )
            }
        )

        for (let i = 1; i < redMap.size; i++) {
            let key = (i <= 9) ? '0' + (i) : (i) + '';
            let n = redMap.get(key);
            if (n)
                red.push({ item: key, [num]: n })
        }

        return {
            red,
            blue
        }
    }

}