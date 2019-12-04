import React, { Component } from 'react';
import { Table } from 'reactstrap';

const lessons = [{
    id: 1,
    name: 'Flowchart and Pseudocode',
    length: '150min',
    page: 10
}, {
    id: 2,
    name: 'Data Type, Variable',
    length: '140min',
    page: 8
}, {
    id: 3,
    name: 'Boolean Data Type, Relational Operators, and Selection Basics',
    length: '160min',
    page: 13
}, {
    id: 4,
    name: 'Data Abstraction',
    length: '90min',
    page: 6
}, {
    id: 5,
    name: 'Decomposition',
    length: '100min',
    page: 7
}, {
    id: 6,
    name: 'Pattern Recognition',
    length: '130min',
    page: 12
}, {
    id: 7,
    name: 'Algorithm Design',
    length: '180min',
    page: 19
}];

class Lessons extends Component {
    render() {
        console.log('test');
        return (
            <div className="lessons">
                <div className="content-header">
                    Lessons
                </div>
                <div className="content-body">
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Duration</th>
                                <th>Pages</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((lesson, idx) => {
                                return (
                                    <tr>
                                        <th scope="row">{lesson.id}</th>
                                        <td>{lesson.name}</td>
                                        <td>{lesson.length}</td>
                                        <td>{lesson.page}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default Lessons;