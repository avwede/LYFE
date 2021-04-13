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
                <Card.Grid style={this.gridStyle, {background: '#CCAAFF', textAlign: 'center'}}>COP 4331 - Leiniker</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#CCCCFF', textAlign: 'center'}}>COP 3402</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#CCEEFF', textAlign: 'center'}}>CDA 3103</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#CCBBFF', textAlign: 'center'}}>COP 3503</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#CCDDFF', textAlign: 'center'}}>FIL 1000</Card.Grid>
                <Card.Grid style={this.gridStyle, {background: '#CCFFFF', textAlign: 'center'}}>CHM 2500</Card.Grid>
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
