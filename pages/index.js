import Head from 'next/head'
import React, { useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);

  const [arrivalTime, setArrivalTime] = useState(0);
  const [serviceTime, setServiceTime] = useState(0);
  const [priority, setPriority] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [turnAroundTime, setTurnAroundTime] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [responseTime, setResponseTime] = useState(0);


  const onEnterValue = () => {
    setData([
      ...data,
      {
        id: data.length + 1,
        arrivalTime: arrivalTime,
        serviceTime: serviceTime,
        priority: priority,
        startTime: startTime,
        endTime: endTime,
        turnAroundTime: turnAroundTime,
        waitingTime: waitingTime,
        responseTime: responseTime
      }
    ]);
  };

  return (
    <>
      <Head>
        <title>OR Simulator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
        {/* <link rel="stylesheet" href="../styles/bootstrap-5.3.0-alpha1-dist/css/bootstrap.min.css" crossOrigin="anonymous" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="text-center m-4">

        <div className='row'>
          <div className='col-4'>
            <h1 className='display-6'>User Info</h1>
            <hr />
            <form>
              <div className="row mb-4">
                <div className='col-4'>
                  <label className="form-label" htmlFor="arrivalTime">Arrival Time: </label>
                </div>
                <div className='col-8'>
                  <input type="number" id="arrivalTime" required className="form-control" onChange={(event) => { setArrivalTime(event.target.value) }} />
                </div>
              </div>

              <div className="row mb-4">
                <div className='col-4'>
                  <label className="form-label" htmlFor="serviceTime">Service Time:</label>
                </div>
                <div className='col-8'>
                  <input type="number" id="serviceTime" className="form-control" onChange={(event) => { setServiceTime(event.target.value) }} />
                </div>
              </div>

              <div className="row mb-4">
                <div className='col-4'>
                  <label className="form-label" htmlFor="priority">Priority:</label>
                </div>
                <div className='col-8'>
                  <input type="number" id="priority" className="form-control" onChange={(event) => { setPriority(event.target.value) }} />
                </div>
              </div>

              <div className='row mb-4'>
                <div className='col-12 d-grid gap-2'>
                  <button type="button" onClick={() => onEnterValue()} className="btn btn-success">Enter</button>
                </div>
              </div>
            </form>
          </div>

          <div className='col-8 d-flex align-items-center'>
            <h1 className='display-4'>Operation Research Simulator</h1>
          </div>
        </div>


        <table className="table table-bordered table-hover">
          <thead className=''>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Arrival Time</th>
              <th scope="col">Service Time</th>
              <th scope="col">Priority</th>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Turn Around Time</th>
              <th scope="col">Waiting Time</th>
              <th scope="col">Response Time</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {data.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.arrivalTime}</td>
                <td>{item.serviceTime}</td>
                <td>{item.priority}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
                <td>{item.turnAroundTime}</td>
                <td>{item.waitingTime}</td>
                <td>{item.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </main>
    </>
  )
}
