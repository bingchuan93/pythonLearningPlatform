import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';

class TestBase extends Component {
    render() {
        return (
            <BaseModal
                headerText="Test"
                body={
                    <div>
                        Test content
                    </div>
                }
            />
        );
    }
}

export default TestBase;