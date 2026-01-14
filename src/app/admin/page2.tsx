"use client";

import React from 'react';
import Highcharts from 'highcharts';
import HighChartsReact from 'highcharts-react-official';

const options = {
    title:{
        text: "User Login Per Day"
    },
    series: [{
        type: 'line',
        name: 'User Login',
        data: [1, 2, 3, 4, 5, 6, 7]
    }],
    xAxis:{
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    }
}

const AdminPage2 = () => {
  return (
    <div>
      <h1>Admin Page</h1>
      <HighChartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AdminPage2;