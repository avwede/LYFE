import React from 'react';
import ReactDOM from 'react-dom';
import { Space, Card} from 'antd';
import axios from 'axios';

    const storage = require('../tokenStorage.js');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2RiNTExNjExYWY4MTI3OWE4N2I4NSIsImlhdCI6MTYxOTEyMjkxOCwiZXhwIjoxNjE5MTI2NTE4fQ.m6I1VygPjNVmFgjcaYJ-hPFrYq3mCEa8tgT18yeZa1o';
    console.log(token);
    const config = {
        headers: {
           Authorization: "Bearer " + token
        }
     }
     
    var data = [];

class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = { courses: []};
    }

    componentDidMount() {
        axios.get('http://localhost:3001/api/courses/', { headers: {"Authorization" : `Bearer ${token}`} })
            .then(res => {
                console.log(res.data);
                this.setState({ courses: JSON.stringify(res.data) });
                data = res.data;
                console.log(data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
      
    gridStyle = {
        width: '32%',
        textAlign: 'center',
        background: '#DBF3FA',
        marginBottom: '10px',
        marginRight: '5px',
        marginLeft: '8px',
        marginTop: '8px',
    };

    render () {
        return (
            <Card title="Classes">



                <a href='https://ucf.zoom.us/j/91549966557' target='_blank'>
                    <Card.Grid style={this.gridStyle}>
                        <h5>COP 4331 - Leinecker</h5>
                    </Card.Grid>
                </a>

                <Card.Grid style={this.gridStyle}><h5>{this.state.courses}</h5></Card.Grid>
                <Card.Grid style={this.gridStyle}><h5>COP 4331 - Angell</h5></Card.Grid>
                <Card.Grid style={this.gridStyle}><h5>COP 4331 - Guha</h5></Card.Grid>
                <Card.Grid style={this.gridStyle}><h5>COP 4331 - Gerber</h5></Card.Grid>
                <Card.Grid style={this.gridStyle}><h5>COP 4331 - Montagne</h5></Card.Grid>
            </Card>
        );
    }
}

export default Classes;