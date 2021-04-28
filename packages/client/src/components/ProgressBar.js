import React from 'react';
import 'antd/dist/antd.css';
import { Tooltip, Progress } from 'antd';

class ProgressBar extends React.Component {
    render () { 
        return(
        <Tooltip title="3 done / 4 to do">
            <Progress strokeColor={{
                    '0%': '#ACC1FF',
                    '100%': '#9CECFF',
                }} percent={60} />
        </Tooltip>
        );
    }
}

export default ProgressBar;
