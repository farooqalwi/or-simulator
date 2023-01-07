import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const bar = (props) => {
  const { title, label, labels, data, backgroundColor, borderColor, borderWidth, width, height } = props

  const graphData = {
    labels: labels,
    datasets: [{
      label: label,
      data: data,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth
    }]
  }

  return (
    <div className='container border rounded my-4'>
      <h2 className='display-4'>{title}</h2>
      <hr />
      <Bar
        data={graphData}
        width={width}
        height={height}
        options={{
          maintainAspectRatio: false
        }}
      />
    </div>
  )
}

export default bar;

