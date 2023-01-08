import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import BarGraph from './bar';
import PieChart from './pie';

//Lambda
let arrivalTime = [];
//Mu
let serviceTime = [];


let startTime = [];
let endTime = [];
let turnAroundTime = [];
let waitingTime = [];
let responseTime = [];

let server1 = [];
let server2 = [];

let queueLength = 0;
let server1Utilization = 0;
let server2Utilization = 0;

//Table data
let data = [];

const Home = () => {

  //Table data, it will be used to show data in table and on graphs
  const [tableData, setTableData] = useState([]);

  const [arrivalTimeValue, setArrivalTimeValue] = useState("");
  const [serviceTimeValue, setServiceTimeValue] = useState("");

  const [EnterButton, SetEnterButton] = useState(false);
  const [SimulateButton, SetSimulateButton] = useState(true);
  const [ResetButton, SetResetButton] = useState(true);

  // Reset all data
  const resetData = () => {
    arrivalTime = [];
    serviceTime = [];
    startTime = [];
    endTime = [];
    turnAroundTime = [];
    waitingTime = [];
    responseTime = [];
    server1 = [];
    server2 = [];
    queueLength = 0;
    server1Utilization = 0;
    server2Utilization = 0;
    data = [];
    setTableData([]);

    // Enable enter button, simulate button and disable reset button
    SetEnterButton(false);
    SetSimulateButton(true);
    SetResetButton(true);
  }

  const onEnterValue = () => {
    if (arrivalTimeValue == "" || serviceTimeValue == "") {
      alert("Please enter valid data");
      return;
    }

    arrivalTime.push(arrivalTimeValue);
    serviceTime.push(serviceTimeValue);

    setArrivalTimeValue("");
    setServiceTimeValue("");

    // Enable simulate button and reset button
    if (arrivalTime.length >= 3 && serviceTime.length >= 3) {
      SetSimulateButton(false);
      SetResetButton(false);
    }

  };

  const simulate = () => {

    // Disable enter button and simulator button
    SetEnterButton(true);
    SetSimulateButton(true);

    // Validating data
    if (arrivalTime.length == 0 || serviceTime.length == 0) {
      alert("Please enter some valid data");
      return;
    }

    // Making queues for each server
    arrivalTime?.map((value, index) => {
      if (index == 0) {
        server1.push({
          userId: index + 1,
          startTime: value,
          endTime: Number(value) + Number(serviceTime[index]),
        })
      }

      if (index == 1) {
        if (value < server1[server1.length - 1].endTime) {
          server2.push(
            {
              userId: index + 1,
              startTime: value,
              endTime: Number(value) + Number(serviceTime[index]),
            }
          )
        }
        else if (value > server1[server1.length - 1].endTime) {
          server1.push(
            {
              userId: index + 1,
              startTime: server1[server1.length - 1].endTime,
              endTime: Number(server1[server1.length - 1].endTime) + Number(serviceTime[index]),
            }
          )
        }
      }

      if (index > 1) {
        if (server1[server1.length - 1].endTime < server2[server2.length - 1].endTime) {
          server1.push(
            {
              userId: index + 1,
              startTime: server1[server1.length - 1].endTime,
              endTime: Number(server1[server1.length - 1].endTime) + Number(serviceTime[index]),
            }
          )
        }
        else if (server1[server1.length - 1].endTime > server2[server2.length - 1].endTime) {
          server2.push(
            {
              userId: index + 1,
              startTime: server2[server2.length - 1].endTime,
              endTime: Number(server2[server2.length - 1].endTime) + Number(serviceTime[index]),
            }
          )
        }
      }


    })

    // Populating start and end time from each server
    server1?.map((item, index) => {
      startTime.push(
        {
          userId: item.userId,
          startTime: item.startTime
        }
      );

      endTime.push(
        {
          userId: item.userId,
          endTime: item.endTime
        }
      );
    })

    server2.map((item, index) => {
      startTime.push(
        {
          userId: item.userId,
          startTime: item.startTime
        }
      );

      endTime.push(
        {
          userId: item.userId,
          endTime: item.endTime
        }
      );
    })

    // Calculating turn around time
    server1?.map((item, index) => {
      turnAroundTime.push(
        {
          userId: item.userId,
          turnAroundTime: Number(item.endTime) - Number(arrivalTime[item.userId - 1])
        }
      );
    })

    server2.map((item, index) => {
      turnAroundTime.push(
        {
          userId: item.userId,
          turnAroundTime: Number(item.endTime) - Number(arrivalTime[item.userId - 1])
        }
      )
    })

    // Calculating waiting time
    server1?.map((item, index) => {
      waitingTime.push(
        {
          userId: item.userId,
          waitingTime: Number(item.startTime) - Number(arrivalTime[item.userId - 1])
        }
      )
    })

    server2.map((item, index) => {
      waitingTime.push(
        {
          userId: item.userId,
          waitingTime: Number(item.startTime) - Number(arrivalTime[item.userId - 1])
        }
      )
    })

    // Calculating response time
    server1?.map((item, index) => {
      responseTime.push(
        {
          userId: item.userId,
          responseTime: Number(item.startTime) - Number(arrivalTime[item.userId - 1])
        }
      );
    })

    server2.map((item, index) => {
      responseTime.push(
        {
          userId: item.userId,
          responseTime: Number(item.startTime) - Number(arrivalTime[item.userId - 1])
        }
      )
    })

    // Calculating queue length
    waitingTime.map((item, index) => {
      if (item.waitingTime > 0) {
        queueLength = queueLength + 1;
      }
    })

    // Calculating server utilization
    let totalServiceTime = 0;
    serviceTime.map((item, index) => {
      totalServiceTime = totalServiceTime + Number(item);
    })

    server1Utilization = Math.round((((Number(server1[server1.length - 1].endTime)) - Number((server1[0].startTime))) / totalServiceTime) * 100);
    server2Utilization = Math.round((((Number(server2[server2.length - 1].endTime)) - Number((server2[0].startTime))) / totalServiceTime) * 100);

    // Sorting data
    startTime.sort((a, b) => a.userId - b.userId);
    endTime.sort((a, b) => a.userId - b.userId);
    turnAroundTime.sort((a, b) => a.userId - b.userId);
    waitingTime.sort((a, b) => a.userId - b.userId);
    responseTime.sort((a, b) => a.userId - b.userId);

    // Extracting data for table
    arrivalTime?.map((item, index) => {
      data.push(
        {
          userId: index + 1,
          arrivalTime: item,
          serviceTime: serviceTime[index],
          startTime: startTime[index].startTime,
          endTime: endTime[index].endTime,
          turnAroundTime: turnAroundTime[index].turnAroundTime,
          waitingTime: waitingTime[index].waitingTime,
          responseTime: responseTime[index].responseTime,
        }
      )
    })

    if (data.length > 0 && tableData.length === 0) {
      setTableData(data);
      data = [];
    }

  }

  return (
    <>
      <Head>
        <title>OR Simulator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossOrigin="anonymous"></link>
        {/* <link rel="stylesheet" href="../styles/bootstrap-5.3.0-alpha1-dist/css/bootstrap.min.css" crossOrigin="anonymous" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center m-4">

        <div className='row'>
          <div className='col-4'>
            <h1 className='display-6'>Customer Info</h1>
            <hr />
            <form>
              <div className="row mb-4">
                <div className='col-4'>
                  <label className="form-label" htmlFor="arrivalTime">Arrival Time: </label>
                </div>
                <div className='col-8'>
                  <input type="number" id="arrivalTime" value={arrivalTimeValue} required className="form-control" onChange={(event) => { setArrivalTimeValue(event.target.value) }} />
                </div>
              </div>

              <div className="row mb-4">
                <div className='col-4'>
                  <label className="form-label" htmlFor="serviceTime">Service Time:</label>
                </div>
                <div className='col-8'>
                  <input type="number" id="serviceTime" value={serviceTimeValue} className="form-control" onChange={(event) => { setServiceTimeValue(event.target.value) }} />
                </div>
              </div>

              <div className='row mb-4'>
                <div className='col-4 d-grid gap-2'>
                  <button disabled={EnterButton} type="button" onClick={() => onEnterValue()} className="btn btn-success">Enter</button>
                </div>
                <div className='col-4 d-grid gap-2'>
                  <button disabled={SimulateButton} type="button" onClick={() => simulate()} className="btn btn-danger">Simulate</button>
                </div>
                <div className='col-4 d-grid gap-2'>
                  <button disabled={ResetButton} type="button" onClick={() => resetData()} className="btn btn-warning">Reset</button>
                </div>
              </div>
            </form>
          </div>

          <div className='col-8 d-flex justify-content-center'>
            <div className='row'>
              <div className='col-12'>
                <h1 className='display-4'>Operation Research Simulator</h1>
              </div>

              {tableData.length > 0 &&
                <div className='col-12'>
                  <div className='row'>
                    <div className='col-6'>
                      <div className='container my-4 d-flex justify-content-center' style={{ "height": "360px" }}>
                        <div className="card">
                          <div className="card-body">
                            <PieChart
                              title='Server Utilization'
                              labels={["Server 1", "Server 2"]}
                              data={[server1Utilization, server2Utilization]}
                              backgroundColor={server1Utilization > server2Utilization ? ['#FF597B', '#82C3EC'] : ['#82C3EC', '#FF597B']}
                              // hoverBackgroundColor=''
                              width={50}
                              height={50}
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className='col-6'>
                      <div className='container my-4 d-flex justify-content-center' style={{ "height": "360px" }}>
                        <div className="card">
                          <div className="card-body">
                            <h1 className='display-1' style={{ "fontSize": "120px", "marginTop": "50px" }}>{queueLength}</h1>
                            <p className='display-6' style={{ "fontSize": "25px", "marginTop": "70px" }}>Number of customers who wait</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

            </div>

          </div>
        </div>

        <hr />

        {tableData.length > 0 &&
          <>
            <table className="table table-bordered table-hover">
              <thead className=''>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Arrival Time</th>
                  <th scope="col">Service Time</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  <th scope="col">Turn Around Time</th>
                  <th scope="col">Waiting Time</th>
                  <th scope="col">Response Time</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {tableData?.map((item) => (
                  <tr key={item.userId}>
                    <th scope="row">{item.userId}</th>
                    <td>{item.arrivalTime}</td>
                    <td>{item.serviceTime}</td>
                    <td>{item.startTime}</td>
                    <td>{item.endTime}</td>
                    <td>{item.turnAroundTime}</td>
                    <td>{item.waitingTime}</td>
                    <td>{item.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='row'>
              <div className='col-6'>
                <BarGraph
                  title='Turn Around Time'
                  label='Turn Around Time'
                  labels={tableData?.map((item) => "User " + item.userId)}
                  data={tableData?.map((item) => item.turnAroundTime)}
                  backgroundColor='rgba(54, 162, 235, 0.2)'
                  borderColor='rgba(54, 162, 235, 1)'
                  borderWidth={1}
                  width={400}
                  height={100}
                />
              </div>

              <div className='col-6'>
                <BarGraph
                  title='Waiting Time'
                  label='Waiting Time'
                  labels={tableData?.map((item) => "User " + item.userId)}
                  data={tableData?.map((item) => item.waitingTime)}
                  backgroundColor='rgba(255, 99, 132, 0.2)'
                  borderColor='rgba(255, 99, 132, 1)'
                  borderWidth={1}
                  width={400}
                  height={100}
                />
              </div>

              <div className='col-6'>
                <BarGraph
                  title='Response Time'
                  label='Response Time'
                  labels={tableData?.map((item) => "User " + item.userId)}
                  data={tableData?.map((item) => item.responseTime)}
                  backgroundColor='rgba(153, 102, 255, 0.2)'
                  borderColor='rgba(153, 102, 255, 1)'
                  borderWidth={1}
                  width={400}
                  height={100}
                />
              </div>

              <div className='col-6'>
                <BarGraph
                  title='Service Time'
                  label='Service Time'
                  labels={tableData?.map((item) => "User " + item.userId)}
                  data={tableData?.map((item) => item.serviceTime)}
                  backgroundColor='rgba(255, 159, 64, 0.2)'
                  borderColor='rgba(255, 159, 64, 1)'
                  borderWidth={1}
                  width={400}
                  height={100}
                />
              </div>

            </div>

          </>
        }

      </main>
    </>
  )
}

export default Home;