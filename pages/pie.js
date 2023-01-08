import React from 'react';
import { Pie } from 'react-chartjs-2';

const pie = (props) => {
	const { title, labels, data, backgroundColor, hoverBackgroundColor, width, height } = props
	const graphData = {
		labels: labels,
		datasets: [{
			data: data,
			backgroundColor: backgroundColor,
			hoverBackgroundColor: hoverBackgroundColor
		}]
	}

	return (
		<>
			<h2 className='display-6'>{title}</h2>
			<Pie
				data={graphData}
				width={width}
				height={height}
			/>
		</>
	)
};

export default pie;