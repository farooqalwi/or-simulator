import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import BarGraph from './bar';
import PieChart from './pie';

//Lambda
let arrivalTime = [];
//Mu
let serviceTime = [];
let temparrival = [];
let id = 0;
let interarrival = []
    
let cummulativeprop = []
let loopupprop = []
let classintervals = []

let numbetweeninterval = []
let idoltimeforserver1 = 0;
let idoltimeforserver2 = 0;

let CustomerInfo = []
let CustomerInfodup = []
let servername = []

let startTime = [];
let endTime = [];
let turnAroundTime = [];
let waitingTime = [];
let responseTime = [];
let priority = [];
let server1 = [];
let server2 = [];

let queueLength = 0;
let server1Utilization = 0;
let server2Utilization = 0;

//Table data
let data = [];

const Home = () => {



  //To show either Mu and Lambda or Arrival time and service time
  const [showArrSerTime, setShowArrSerTime] = useState(false);
  const [showMuLambda, setShowMuLambda] = useState(false);

  //Table data, it will be used to show data in table and on graphs
  const [tableData, setTableData] = useState([]);


  const [muValue, setMuValue] = useState("");
  const [lambdaValue, setLambdaValue] = useState("");
  const [customervalue, setcustomervalue] = useState("");

  const [arrivalTimevalue, setArrivalTimevalue] = useState("");
  const [serviceTimeValue, setServiceTimeValue] = useState("");
  const [priorityvalue, setpriorityvalue] = useState("");

  const [EnterButton, SetEnterButton] = useState(false);
  const [SimulateButton, SetSimulateButton] = useState(true);
  const [ResetButton, SetResetButton] = useState(true);

  // Reset all data
  const resetData = () => {
    arrivalTime = [];
    serviceTime = [];
    priority = [];
    startTime = [];
    endTime = [];
    turnAroundTime = [];
    waitingTime = [];
     id = 0;

    responseTime = [];
    server1 = [];
    server2 = [];
    queueLength = 0;
    server1Utilization = 0;
    server2Utilization = 0;
    data = [];
    CustomerInfo = [];
    CustomerInfodup=[];

    setTableData([]);

    // Enable enter button, simulate button and disable reset button
    SetEnterButton(false);
    SetSimulateButton(true);
    SetResetButton(true);
  }



  //Toggle Mu and Lambda or Arrival time and service time
  const toggleParameter = (parameter) => {
    // Reset all data
    resetData();

    if (parameter == "MuLambda") {
      setShowArrSerTime(false);
      setShowMuLambda(true);
    }
    else if (parameter == "ArrSerTime") {
      setShowArrSerTime(true);
      setShowMuLambda(false);
    }
  }






  // Retrieving Mu and Lambda from user
  const onMuLambdaEnter = () => {
    if (muValue == "" || lambdaValue == "" || customervalue == "") {
      alert("Please enter valid data");
      return;
    }

    let result = Calculateformuuandlambda(customervalue, muValue, lambdaValue)

    arrivalTime = result[0]
    serviceTime = result[1]
    priority= result[2]



    priority?.map((value, index) => {

      CustomerInfo.push({
        userId: ++id,
        ArrivalTimeofcustomer: arrivalTime[index],
        PriorityForCustomer: priority[index],
        ServiceTimeofcustomer: serviceTime[index]
      });
      CustomerInfodup.push({
        userId: id,
        ArrivalTimeofcustomer: arrivalTime[index],
        PriorityForCustomer: priority[index],
        ServiceTimeofcustomer: serviceTime[index]
      });
    })


    setMuValue("");
    setLambdaValue("");
    setcustomervalue("")
    // Enable simulate button and reset button

    SetSimulateButton(false);
    SetResetButton(false);

  }
  console.log(CustomerInfo)


  const onEntervalue = () => {




    if (arrivalTimevalue == "" || serviceTimeValue == "") {

      alert("Please enter valid data");
      return;
    }


    CustomerInfo.push({
      userId: ++id,
      ArrivalTimeofcustomer: arrivalTimevalue,
      PriorityForCustomer: priorityvalue,
      ServiceTimeofcustomer: serviceTimeValue
    });
    CustomerInfodup.push({
      userId: id,
      ArrivalTimeofcustomer: arrivalTimevalue,
      PriorityForCustomer: priorityvalue,
      ServiceTimeofcustomer: serviceTimeValue
    });

    setArrivalTimevalue("");
    setServiceTimeValue("");
    setpriorityvalue("");

    // Enable simulate button and reset button
    if (CustomerInfo.length >= 3) {
      SetSimulateButton(false);
      SetResetButton(false);
    }

  };

  function ServiceRandom(mu) {
    // find diff
    let min = 1;
    let max = 5;
    let difference = max - min;
    let rand = -mu * Math.log(1 - Math.random());
    // multiply with difference 
    rand = Math.floor(rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
  }
  function PriorityRandom() {
    let min = 1;
    let max = 90;
    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor(rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
  }
  function arrivalTimeSim(interarrivalArr,x,mu) {
    let priority = []
    let resultforservice = []
    let arrivalArr = [0];
    for (let i = 0; i < interarrivalArr.length; i++) {
      if (i != 0) {

        let temp =arrivalArr[i - 1] + interarrivalArr[i]
        if(temp<=x){

          arrivalArr.push(temp);
          //service time
      const sss = ServiceRandom(mu)
      resultforservice[i] = Math.round(sss)

      //calculating proirity
      priority[i] = PriorityRandom();


        }
        else{
          break
        }
  
      }
    }
  debugger
    return [arrivalArr,resultforservice,priority];
  } 
  function factorial(num) {
    if (num == 0 || num == 1) {
      return 1;
    }
    var f = num;
    while (num > 1) {
      num--;
      f *= num;
    }
    return f;
  }
  function Calculateformuuandlambda(x, lambda, mu) {
   

   
   
    const fact = factorial(x);
    let ita = 0;
    let serv = 0;
    let res = 0;

    for (let i = 0; i >-1; i++) {
      const aaa = Math.exp(-lambda) * Math.pow(lambda, i)
      const def = aaa / factorial(i);
      ita = ita + def;
      res = Number(res)+Number(ita) 
      if(res>=x){
        
        break
      }
      else{
      //cummulative probabability
      cummulativeprop[i] = ita.toFixed(4);
      //loopup
      loopupprop[i] = ita.toFixed(4);
 
      
      //number between intervals
      numbetweeninterval[i] = i;
      }
    }
    //loopup probability
  
    loopupprop.unshift("0.0000")


    cummulativeprop.map((value, index) => {

      if (index == 0) {
        classintervals.push({
          lowerbound: Number(0.0000),
          upperbound: Number(value)
        }
        )
      }
      else {

        let temp = Number(cummulativeprop[index - 1]) + Number(0.0001);
        let temp1 = temp.toFixed(4)
        
        classintervals.push({
          
          lowerbound: Number(temp1),
          upperbound: Number(value)
        }
        )
      }
    })

    numbetweeninterval.map((val, ind) => {

      let varible = Math.random();
      
     
      classintervals.map((value, index) => {
      
        let min = value.lowerbound;
        let max = value.upperbound;

        if (varible >= min && varible <= max) {
          interarrival[ind] = numbetweeninterval[index];
        }
      })
    })


     
    

    return arrivalTimeSim(interarrival,x,mu)
  }




  function sorting(Customerinfo, serverendtime = 0) {




    let customeri = []
    let readyuser = {}
    let ready111 = {}

    Customerinfo?.map((value, index) => {

      if (serverendtime == 0) {
        if (CustomerInfo[0].ArrivalTimeofcustomer == value.ArrivalTimeofcustomer) {
          customeri.push(value)

        }
      }
      else {
        if (serverendtime < CustomerInfo[0].ArrivalTimeofcustomer) {
          let idoltime = Number(CustomerInfo[0].ArrivalTimeofcustomer) - Number(serverendtime)
            let tempuserstart = serverendtime+idoltime
          if (value.ArrivalTimeofcustomer <= tempuserstart) {
            customeri.push(value)

          }


        }
        else {


          if (value.ArrivalTimeofcustomer <= serverendtime) {
            customeri.push(value)

          }
        }

      }
    })


    readyuser = customeri.filter(x => x.PriorityForCustomer > 60)
    ready111 = readyuser[0];

    if (ready111 == undefined) {
      ready111 = customeri[0]
    }
    
    const abc = CustomerInfo.findIndex(x => x.ArrivalTimeofcustomer == ready111.ArrivalTimeofcustomer &&
      x.ServiceTimeofcustomer == ready111.ServiceTimeofcustomer &&
      x.PriorityForCustomer == ready111.PriorityForCustomer);
    CustomerInfo.splice(abc, 1)

    return ready111;
  }
  const simulate = () => {


    // Disable enter button and simulator button
    SetEnterButton(true);
    SetSimulateButton(true);

    // Validating data
    if (CustomerInfo.lenght == 0) {
      alert("Please enter some valid data");
      return;
    }
    // Making queues for each server

    CustomerInfodup?.map((value, index) => {

      if (index == 0) {

        const readyforserver = sorting(CustomerInfo)

        server1.push(
          {
            userId: Number(readyforserver.userId),
            startTime: Number(readyforserver.ArrivalTimeofcustomer),
            endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(readyforserver.ServiceTimeofcustomer),
            arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
            server: "S1"
          }
        )
      }
      if (index == 1) {


        const readyforserver = sorting(CustomerInfo)

        if (readyforserver.ArrivalTimeofcustomer < server1[server1.length - 1].endTime) {

          server2.push(
            {
              userId: Number(readyforserver.userId),
              startTime: Number(readyforserver.ArrivalTimeofcustomer),
              endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(readyforserver.ServiceTimeofcustomer),
              arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
              server: "S2"
            }
          )

        }
        else {
          server1.push(
            {
              userId: Number(readyforserver.userId),
              startTime: Number(readyforserver.ArrivalTimeofcustomer),
              endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(readyforserver.ServiceTimeofcustomer),
              arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
              server: "S1"

            }
          )
        }

      }
      if (index > 1) {
        





        if (server2.length > 0 && (server1[server1.length - 1].endTime < server2[server2.length - 1].endTime || server1[server1.length - 1].endTime == server2[server2.length - 1].endTime)) {

          const readyforserver = sorting(CustomerInfo, server1[server1.length - 1].endTime)
          if (server1[server1.length - 1].endTime == readyforserver.ArrivalTimeofcustomer) {
            server1.push(
              {
                userId: Number(readyforserver.userId),
                startTime: Number(readyforserver.ArrivalTimeofcustomer),
                endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(readyforserver.ServiceTimeofcustomer),
                arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
                server: "S1"
              }
            )

          }
          else {
            const temp = 0;
            if (readyforserver.ArrivalTimeofcustomer > server1[server1.length - 1].endTime) {
              temp = Number(Number(readyforserver.ArrivalTimeofcustomer) - Number(server1[server1.length - 1].endTime))
            }
            else {
              temp = Number(Number(server1[server1.length - 1].endTime) - Number(readyforserver.ArrivalTimeofcustomer))
            }
            idoltimeforserver1 += temp
            server1.push(
              {
                userId: Number(readyforserver.userId),
                startTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(temp),
                endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(temp) + Number(readyforserver.ServiceTimeofcustomer),
                arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
                server: "S1"
              }
            )


          }

        }
        else {

          if (server2.length > 0) {
            const readyforserver = sorting(CustomerInfo, server2[server2.length - 1].endTime)

            if (server2[server2.length - 1].endTime == readyforserver.ArrivalTimeofcustomer) {
              server2.push(
                {
                  userId: Number(readyforserver.userId),
                  startTime: Number(readyforserver.ArrivalTimeofcustomer),
                  endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(readyforserver.ServiceTimeofcustomer),
                  arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
                  server: "S2"
                }
              )
            }
            else {
              const temp = 0;
              if (server2[server2.length - 1].endTime > readyforserver.ArrivalTimeofcustomer) {
                temp = Number(Number(server2[server2.length - 1].endTime) - Number(readyforserver.ArrivalTimeofcustomer))
              }
              else {
                temp = Number(Number(readyforserver.ArrivalTimeofcustomer) - Number(server2[server2.length - 1].endTime))

              }
              idoltimeforserver2 += temp
              server2.push(
                {
                  userId: Number(readyforserver.userId),
                  startTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(temp),
                  endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(temp) + Number(readyforserver.ServiceTimeofcustomer),
                  arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
                  server: "S2"
                }
              )



            }




          }
          else {
            const readyforserver = sorting(CustomerInfo)

            server2.push(
              {
                userId: Number(readyforserver.userId),
                startTime: Number(readyforserver.ArrivalTimeofcustomer),
                endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(readyforserver.ServiceTimeofcustomer),
                arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
                server: "S2"
              }
            )
          }


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
      servername.push(
        {
          userId: item.userId,
          servername1: item.server
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
      servername.push(
        {
          userId: item.userId,
          servername1: item.server
        }
      );
    })

    // Calculating turn around time
    server1?.map((item, index) => {
      turnAroundTime.push(
        {
          userId: item.userId,
          turnAroundTime: Number(item.endTime) - Number(item.arrrivaltime)
        }
      );
    })

    server2.map((item, index) => {
      turnAroundTime.push(
        {
          userId: item.userId,
          turnAroundTime: Number(item.endTime) - Number(item.arrrivaltime)
        }
      )
    })

    // Calculating waiting time
    server1?.map((item, index) => {
      waitingTime.push(
        {
          userId: item.userId,
          waitingTime: Number(item.startTime) - Number(item.arrrivaltime)
        }
      )
    })

    server2.map((item, index) => {
      waitingTime.push(
        {
          userId: item.userId,
          waitingTime: Number(item.startTime) - Number(item.arrrivaltime)
        }
      )
    })

    // Calculating response time
    server1?.map((item, index) => {
      responseTime.push(
        {
          userId: item.userId,
          responseTime: Number(item.startTime) - Number(item.arrrivaltime)
        }
      );
    })

    server2.map((item, index) => {
      responseTime.push(
        {
          userId: item.userId,
          responseTime: Number(item.startTime) - Number(item.arrrivaltime)
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
    CustomerInfodup.map((item, index) => {
      totalServiceTime = totalServiceTime + Number(item.ServiceTimeofcustomer);
    })

    server1Utilization = Math.round((((Number(server1[server1.length - 1].endTime)) - Number((server1[0].startTime))) / totalServiceTime) * 100);
    server2Utilization = Math.round((((Number(server2[server2.length - 1].endTime)) - Number((server2[0].startTime))) / totalServiceTime) * 100);
    console.log(startTime)
    console.log(endTime)


    // Sorting data
    startTime.sort((a, b) => a.userId - b.userId);
    endTime.sort((a, b) => a.userId - b.userId);
    servername.sort((a, b) => a.userId - b.userId);
    turnAroundTime.sort((a, b) => a.userId - b.userId);
    waitingTime.sort((a, b) => a.userId - b.userId);
    responseTime.sort((a, b) => a.userId - b.userId);

    // Extracting data for table
    CustomerInfodup?.map((item, index) => {
      data.push(
        {
          userId: item.userId,
          arrivalTime: item.ArrivalTimeofcustomer,
          serviceTime: item.ServiceTimeofcustomer,
          priority: item.PriorityForCustomer,
          startTime: startTime[index].startTime,
          endTime: endTime[index].endTime,
          Servername111: servername[index].servername1,
           
          turnAroundTime: turnAroundTime[index].turnAroundTime,
          waitingTime: waitingTime[index].waitingTime,
          responseTime: responseTime[index].responseTime,
          Cummulative_probability : cummulativeprop[index],
          Loopup_Probability: loopupprop[index],
          Number_Bw_Arrivals:numbetweeninterval[index],
          Upperbound:classintervals[index].upperbound,
          Lowerbound:classintervals[index].lowerbound,
          Interarrival:interarrival[index]
        }
      )
    })
debugger
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

      <main className=" m-4">

        <div className='row'>
          <div className='col-4'>
            <div className="form-check form-check-inline">
              <input onClick={() => toggleParameter("MuLambda")} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
              <label className="form-check-label" htmlFor="inlineRadio1">Mu and Lambda</label>
            </div>
            <div className="form-check form-check-inline">
              <input onClick={() => toggleParameter("ArrSerTime")} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
              <label className="form-check-label" htmlFor="inlineRadio2">Arrival and Service Time</label>
            </div>
          </div>

          <div className='col-8'>
            <h1 className='display-6'>Operation Research Simulator</h1>
          </div>
        </div>

        <hr />



        {/* Form for Mu and Lambda */}
        {showMuLambda &&
          <>
            <div className='row justify-content-cente'>
              <div className='col-4'>
                <h1 className='display-6'>Insert the value of Mu and Lambda</h1>
                <hr />
                <form>
                  <div className="row mb-4">
                    <div className='col-4'>
                      <label className="form-label" htmlFor="mu">Mu: </label>
                    </div>
                    <div className='col-8'>
                      <input type="number" id="mu" value={muValue} required className="form-control" onChange={(event) => { setMuValue(event.target.value) }} />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className='col-4'>
                      <label className="form-label" htmlFor="lambda">Lambda:</label>
                    </div>
                    <div className='col-8'>
                      <input type="number" id="lambda" value={lambdaValue} className="form-control" onChange={(event) => { setLambdaValue(event.target.value) }} />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className='col-4'>
                      <label className="form-label" htmlFor="lambda">Time Of Simulation:</label>
                    </div>
                    <div className='col-8'>
                      <input type="number" id="x" value={customervalue} className="form-control" onChange={(event) => { setcustomervalue(event.target.value) }} />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-4 d-grid gap-2'>
                      <button disabled={EnterButton} type="button" onClick={() => onMuLambdaEnter()} className="btn btn-success">Enter</button>
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
                                  backgroundColor={server1Utilization > server2Utilization ? ['#FF597B', '#82C3EC'] : ['#82C3EC', '#FF597B']}
                                  data={[server1Utilization, server2Utilization]}
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
          </>
        }

        {/* Form for Arrival and Service Time */}
        {showArrSerTime &&
          <>
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
                      <input type="number" id="arrivalTime" value={arrivalTimevalue} required className="form-control" onChange={(event) => { setArrivalTimevalue(event.target.value) }} />
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
                  <div className="row mb-4">
                    <div className='col-4'>
                      <label className="form-label" htmlFor="priority">Priority:</label>
                    </div>
                    <div className='col-8'>
                      <input type="number" id="priortyid" value={priorityvalue} className="form-control" onChange={(event) => { setpriorityvalue(event.target.value) }} />
                    </div>
                  </div>

                  <div className='row mb-4'>
                    <div className='col-4 d-grid gap-2'>
                      <button disabled={EnterButton} type="button" onClick={() => onEntervalue()} className="btn btn-success">Enter</button>
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

                        <div className='col-6 text-center'>
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
          </>

        }

        {tableData.length > 0 &&
          <>
           <table className="table table-bordered table-hover">
              <thead className=''>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Cummulative probability</th>
                  <th scope="col">Loopup probability</th>
                  <th scope="col">Number Between Arrivals</th>
                  <th scope="col">Range</th>
                  <th scope="col">Inter Arrival</th>
                  <th scope="col">Arrival Time</th>
                  <th scope="col">Service Time</th>
                  
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {tableData?.map((item) => (
                  <tr key={item.userId}>
                    <th scope="row">{item.userId}</th>
                    <td>{item.Cummulative_probability}</td>
                    <td>{item.Loopup_Probability}</td>
                    <td>{item.Number_Bw_Arrivals}</td>
                    <td>{item.Lowerbound} ----{item.Upperbound}</td>
                    <td>{item.Interarrival}</td>
                    <td>{item.arrivalTime}</td>
                    <td>{item.serviceTime}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>









            <table className="table table-bordered table-hover">
              <thead className=''>
                <tr>
                  <th scope="col">#</th>
                
                  <th scope="col">Age</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  <th scope="col">Turn Around Time</th>
                  <th scope="col">Waiting Time</th>
                  <th scope="col">Response Time</th>
                  <th scope="col">Server Name</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {tableData?.map((item) => (
                  <tr key={item.userId}>
                    <th scope="row">{item.userId}</th>
                 
                    <td>{item.priority}</td>
                    <td>{item.startTime}</td>
                    <td>{item.endTime}</td>
                    <td>{item.turnAroundTime}</td>
                    <td>{item.waitingTime}</td>
                    <td>{item.responseTime}</td>
                    <td>{item.Servername111}</td>
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