import React from 'react';
import ReactDOM from 'react-dom';
import { Card } from 'antd';


class Classes extends React.Component {

    gridStyle = {
        width: '33.33%',
        textAlign: 'center',
        background: '#ACC1FF',
    };

    render() {
        return (
            <Card title="Classes">
                <Card.Grid style={this.gridStyle, {background: '#fff1f0', textAlign: 'center'}}>COP 4331 - Leiniker</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#f6ffed', textAlign: 'center'}}>COP 3402</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#e6f7ff', textAlign: 'center'}}>CDA 3103</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#f9f0ff', textAlign: 'center'}}>COP 3503</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#fff0f6', textAlign: 'center'}}>FIL 1000</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#feffe6', textAlign: 'center'}}>CHM 2500</Card.Grid>
            </Card>
        );
    }
}

export default Classes;

// Pastel Colors
// Light Purple #F0DEFD
// Light Blue #DEF3FD
// Light Green #DEFDE0
// Light Yellow #FCF7DE
// Light Red #FDDFDF


// #CCAAFF
// #CCBBFF
// #CCCCFF
// #CCDDFF
// #CCEEFF
// #CCFFFF
