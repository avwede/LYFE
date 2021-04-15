import React from 'react';
import ReactDOM from 'react-dom';
import { Space, Card} from 'antd';


class Classes extends React.Component {

    gridStyle = {
        width: '32%',
        textAlign: 'center',
        background: '#DBF3FA',
        marginBottom: '10px',
        marginRight: '5px',
        marginLeft: '8px',
        marginTop: '8px',
    };

    render() {
        return (
            <Card title="Classes">
                <a href='https://ucf.zoom.us/j/91549966557' target='_blank'>
                    <Card.Grid style={this.gridStyle}>
                        <h4>COP 4331 - Leinecker</h4>
                    </Card.Grid>
                </a>

                <Card.Grid style={this.gridStyle}><h4>COP 3503 - Szumlanski</h4></Card.Grid>
                <Card.Grid style={this.gridStyle}><h4>COP 4331 - Angell</h4></Card.Grid>
                <Card.Grid style={this.gridStyle}><h4>COP 4331 - Guha</h4></Card.Grid>
                <Card.Grid style={this.gridStyle}><h4>COP 4331 - Gerber</h4></Card.Grid>
                <Card.Grid style={this.gridStyle}><h4>COP 4331 - Montagne</h4></Card.Grid>
            </Card>
        );
    }
}

export default Classes;