import React, { Component } from "react";
import { DataView, DataSet } from '@antv/data-set';
import { Tag, Row, Col, Checkbox, Radio } from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label, View } from "BizCharts";

const CheckboxGroup = Checkbox.Group;


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
        const ds = new DataSet();

        const dv = ds.createView().source(data, {
            type: 'graph',
            edges: d => d.links
        });

        dv.transform({
            type: 'diagram.arc',
            marginRatio: 0.5,
        });

        return (
            <div>
                <Row>
                    <Col span={15}>
                        <Tag style={{ marginLeft: 35 }} color="#f50">红球</Tag>

                        <Chart data={data} forceFit={true} height={500} padding={[50, 50, 50, 50]} >
                            <Tooltip showTitle={false} />
                            <View data={dv.edges} axis={false}>
                                <Coord type='polar' reflect='y' />
                                <Geom type='edge'
                                    position='x*y'
                                    shape='arc'
                                    color='source'
                                    opacity={0.5}
                                    tooltip={'source*target'} />
                            </View>
                            <View data={dv.nodes} axis={true}>
                                <Coord type='polar' reflect='y' />
                                <Geom type='point'
                                    position='x*y'
                                    shape='circle'
                                    size='value'
                                    color='id'
                                    opacity={0.1}
                                    style={{ stroke: 'grey' }} >
                                    <Label content='name' labelEmit={false} textStyle={{ fill: 'black' }} />
                                </Geom>
                            </View>
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
        let blue = [];
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
                if (i >= 20) return;
                v.map(
                    (v, i, arr) => {
                        if (i >= 2 && i < 8) {  //红球
                            let cu = v;
                            for (let j = i + 1; j < 8; j++) {
                                let ne = arr[j];
                                red.push({ "source": parseInt(cu), "target": parseInt(ne) });
                            }

                        }
                    }
                )
            }
        )

        const nodes = [
            { "id": 1, "name": "01" },
            { "id": 2, "name": "02" },
            { "id": 3, "name": "03" },
            { "id": 4, "name": "04" },
            { "id": 5, "name": "05" },
            { "id": 6, "name": "06" },
            { "id": 7, "name": "07" },
            { "id": 8, "name": "08" },
            { "id": 9, "name": "09" },
            { "id": 10, "name": "10" },
            { "id": 11, "name": "11" },
            { "id": 12, "name": "12" },
            { "id": 13, "name": "13" },
            { "id": 14, "name": "14" },
            { "id": 15, "name": "15" },
            { "id": 16, "name": "16" },
            { "id": 17, "name": "17" },
            { "id": 18, "name": "18" }
        ];
        const redNodes = [
            { "id": 19, "name": "19" },
            { "id": 20, "name": "20" },
            { "id": 21, "name": "21" },
            { "id": 22, "name": "22" },
            { "id": 23, "name": "23" },
            { "id": 24, "name": "24" },
            { "id": 25, "name": "25" },
            { "id": 26, "name": "26" },
            { "id": 27, "name": "27" },
            { "id": 28, "name": "28" },
            { "id": 29, "name": "29" },
            { "id": 30, "name": "30" },
            { "id": 31, "name": "31" },
            { "id": 32, "name": "32" },
            { "id": 33, "name": "33" }
        ];
        return {
            red: {
                nodes: [...nodes, ...redNodes],
                links: red
            },
            blue: {
                nodes,
                links: blue,
            }
        }
    }

}