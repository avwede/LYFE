import React from 'react';
import ReactDOM from 'react-dom';
import { Space, Card} from 'antd';
import axios from 'axios';

const storage = require('../tokenStorage.js');
const token = storage.retrieveToken();
console.log(token);
     
class ClassesHome extends React.Component {
    data = [];

    constructor(props) {
        super(props);
        this.state = { 
            courses: [],
        };
    }


    componentDidMount() {
        axios.get('http://localhost:3001/api/courses/', {headers: {'Authorization' : `Bearer ${token}`, 'Content-Type': 'application/json'} })
            .then(res => {
                this.setState({ courses: res.data });
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

    render() {
      return (
        <Card title="Classes">
          {this.state.courses.map((course) => {
            return (

            <a href={course.location.location} target='_blank'>
              <Card.Grid key={course.courseCode} style={this.gridStyle}>
                <h5>
                  {course.courseCode} - {course.professor}
                </h5>
              </Card.Grid>
            </a>
            );
          })}
        </Card>
      );
    }
}

export default ClassesHome;