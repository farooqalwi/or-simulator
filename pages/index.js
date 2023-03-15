import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import BarGraph from './bar';
import PieChart from './pie';
import Style from '../styles/responsive.module.css';
import * as XLSX from 'xlsx';

// Declaring Variables , Arrays 

// Excel Data
let ExcelData = []

//Lambda
let arrivalTime = [];
//Mu
let serviceTime = [];
let id = 0;

//Arryays Used in MU and Lambda Calculations
let interarrival = []
let cummulativeprop = []
let loopupprop = []
let classintervals = []
let numbetweeninterval = []

//Dictionaries Having All The Customers After Data Insertions From From Front end
//Later used For Populating Both Servers
let CustomerInfo = []
let CustomerInfodup = []


//Servers to Populate

let server1 = [];
let server2 = [];

//Arrays For Performance Measures From Server1 and Server2 Data
let servername = []
let startTime = [];
let endTime = [];
let turnAroundTime = [];
let waitingTime = [];
let responseTime = [];
let priority = [];
let queueLength = 0;
let server1Utilization = 0;
let server2Utilization = 0;

//saad variables
let L = 0;
let P = 0;
let W = 0;
let Wq = 0;
let Lq = 0;
let idle = 0;
let WqGGC = 0;
let LqGGC = 0;
//Table data
let data = [];
let distribution =  ""

const Home = () => {
  //To show either Mu and Lambda or Arrival time and service time
  const [showArrSerTime, setShowArrSerTime] = useState(false);
  const [showMuLambda, setShowMuLambda] = useState(false);
  const [showChiSquare, setShowChiSquare] = useState(false);
  const [showMM1, setShowMM1] = useState(false);
  const [showMG1, setShowMG1] = useState(false);
  const [showGG1, setShowGG1] = useState(false);
  const [showMM2, setShowMM2] = useState(false);
  const [showMG2, setShowMG2] = useState(false);
  const [showGG2, setShowGG2] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [showMeasures, setShowMeasures] = useState(false);
  const [showGGCMeasures, setShowGGCMeasures] = useState(false);
  //Table data, it will be used to show data in table and on graphs
  const [tableData, setTableData] = useState([]);

  //Hooks in case of Mu And Lambda  
  const [muValue, setMuValue] = useState("");
  const [lambdaValue, setLambdaValue] = useState("");
  const [distributionForMu, setDistributionForMu] = useState("");
  const [distributionForLambda, setDistributionForLambda] = useState("");
  const [numberofServerForMuLambda, setNumberofServerForMuLambda] = useState("");
  const [minValueForGG1Arr, setminValueForGG1Arr] = useState("");
  const [maxValueForGG1Arr, setmaxValueForGG1Arr] = useState("");
  const [minValueForGG1Ser, setminValueForGG1Ser] = useState("");
  const [maxValueForGG1Ser, setmaxValueForGG1Ser] = useState("");
  const [minValueForMG1, setminValueForMG1] = useState("");
  const [maxValueForMG1, setmaxValueForMG1] = useState("");


  // Hooks In Case of Manual Insertion of Arrival,ServiceTime and No of Customers
  const [arrivalTimevalue, setArrivalTimevalue] = useState("");
  const [serviceTimeValue, setServiceTimeValue] = useState("");
  const [ServercountValue, setServercountValue] = useState("")


  const [EnterButton, SetEnterButton] = useState(false);
  const [SimulateButton, SetSimulateButton] = useState(true);
  const [ResetButton, SetResetButton] = useState(true);
  const [dropDown, SetDropDown] = useState(false);

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
    classintervals = []
    servername = []
    responseTime = [];
    server1 = [];
    server2 = [];
    queueLength = 0;
    server1Utilization = 0;
    server2Utilization = 0;
    data = [];
    CustomerInfo = [];
    CustomerInfodup = [];
    setMuValue("");
    setLambdaValue("");
    setminValueForGG1Arr("");
    setminValueForGG1Ser("");
    setminValueForMG1("");
    setmaxValueForGG1Arr("");
    setmaxValueForGG1Ser("");
    setmaxValueForMG1("");
    
    distribution = ""
    L = 0;
    P = 0;
    W = 0;
    Wq = 0;
    WqGGC = 0;
    Lq = 0;
    LqGGC = 0;
    idle = 0;
    setShowMeasures(false);
    setShowGGCMeasures(false);

    setTableData([]);

    // Enable enter button, simulate button and disable reset button
    SetEnterButton(false);
    SetSimulateButton(true);
    SetResetButton(true);
  }

  const backBtn = () => {
    resetData();
    SetDropDown(false);
    setShowNextBtn(true);
    setShowBtn(false);
    setShowMM1(false);
    setShowMM2(false);
    setShowMG1(false);
    setShowMG2(false);
    setShowGG1(false);
    setShowGG2(false);
    setDistributionForLambda("");
    setDistributionForMu("");
    setNumberofServerForMuLambda("");
  }

  //Toggle Mu and Lambda or Arrival time and service time
  const toggleParameter = (parameter) => {
    selected.classList.remove("responsive_background__uLfrK");
    // Reset all data
    resetData();

    if (parameter == "MuLambda") {
      setShowArrSerTime(false);
      setShowChiSquare(false);
      setShowMuLambda(true);
    }
    else if (parameter == "ArrSerTime") {
      setShowMuLambda(false);
      setShowChiSquare(false);
      setShowArrSerTime(true);
    }
    else if (parameter == "ChiSquare") {
      setShowArrSerTime(false);
      setShowMuLambda(false);
      setShowChiSquare(true);
    }
  }

  const onNext = () => {
    // Select Any Poisson Exponential Distribution for Mu and Lambda
    if (distributionForLambda == "poisson-distribution" && distributionForMu == "poisson-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "poisson-distribution" && distributionForMu == "exponential-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "exponential-distribution" && distributionForMu == "poisson-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "exponential-distribution" && distributionForMu == "exponential-distribution" && numberofServerForMuLambda == "1") {
      setShowMM1(true);
      setShowBtn(true);
      setShowNextBtn(false);
      SetDropDown(true);
    } else if (distributionForLambda == "poisson-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "exponential-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "poisson-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "exponential-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "1") {
      setShowMG1(true);
      setShowBtn(true);
      setShowNextBtn(false);
      SetDropDown(true);
    } else if (distributionForLambda == "gamma-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "gamma-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "normal-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "1" || distributionForLambda == "normal-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "1") {
      setShowGG1(true);
      setShowBtn(true);
      setShowNextBtn(false);
      SetDropDown(true);
    }

    else if (distributionForLambda == "poisson-distribution" && distributionForMu == "poisson-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "poisson-distribution" && distributionForMu == "exponential-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "exponential-distribution" && distributionForMu == "poisson-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "exponential-distribution" && distributionForMu == "exponential-distribution" && numberofServerForMuLambda == "2") {
      setShowMM2(true);
      setShowBtn(true);
      setShowNextBtn(false);
      SetDropDown(true);
    } else if (distributionForLambda == "poisson-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "exponential-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "poisson-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "exponential-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "2") {
      setShowMG2(true);
      setShowBtn(true);
      setShowNextBtn(false);
      SetDropDown(true);
    } else if (distributionForLambda == "gamma-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "gamma-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "normal-distribution" && distributionForMu == "gamma-distribution" && numberofServerForMuLambda == "2" || distributionForLambda == "normal-distribution" && distributionForMu == "normal-distribution" && numberofServerForMuLambda == "2") {
      setShowGG2(true);
      setShowBtn(true);
      setShowNextBtn(false);
      SetDropDown(true);
    } else {
      alert("Select proper values")
    }
  }

  // Retrieving Mu and Lambda from user
  const onMuLambdaEnter = () => {
    if (muValue == "" || lambdaValue == "" || distributionForMu == "" || distributionForLambda == "" || numberofServerForMuLambda == "") {
      alert("Values cannot be empty");
      return;
    }
    else if (Number(muValue) < 0 || Number(lambdaValue) < 0) {
      alert("Values cannot be negative");
      return;
    }
    else if (Number(muValue) == 0 || Number(lambdaValue) == 0) {
      alert("Values cannot be zero");
      return;
    }

    // Enable simulate button and reset button
    SetSimulateButton(false);
    SetResetButton(false);
  }

  const onEntervalue = () => {
    if (arrivalTimevalue == "" || serviceTimeValue == "" || ServercountValue == null) {
      alert("Values cannot be empty");
      return;
    }
    else if (arrivalTimevalue == "-0" || serviceTimeValue == "-0" || ServercountValue == "-0") {
      alert("Remove - sign from 0");
      return;
    }
    else if (Number(arrivalTimevalue) < 0 || Number(serviceTimeValue) < 0 || ServercountValue < 0) {
      alert("Values cannot be negative");
      return;
    }
    else if (ServercountValue > 2) {
      alert("Sorry! server can't be more than 2")
    }
    else {

      // Getting Random Arrival ,Service and priority
      let result = Calculate_Initial_Columns(arrivalTimevalue, serviceTimeValue)
      arrivalTime = result[0]
      serviceTime = result[1]
      priority = result[2]

      //Populating Dictionaries having all the that we'll insert in Both Servers
      //By Using Customerinfo DIctionarty. we'll populate servers by passing customers one by one to servers on the basis of sorting.
      //After each Insertion,we'll splice inserted customer from Customer Info
      priority?.map((value, index) => {
        CustomerInfo.push({
          userId: ++id,
          ArrivalTimeofcustomer: arrivalTime[index],
          PriorityForCustomer: priority[index],
          ServiceTimeofcustomer: serviceTime[index]
        });

        //This is a duplicate of CustomerInfo to Keep all data till end.
        CustomerInfodup.push({
          userId: id,
          ArrivalTimeofcustomer: arrivalTime[index],
          PriorityForCustomer: priority[index],
          ServiceTimeofcustomer: serviceTime[index]
        });
      })

      setMuValue("");
      setLambdaValue("");

      // Enable simulate button and reset button
      SetSimulateButton(false);
      SetResetButton(false);
      // Enable simulate button and reset button
      if (CustomerInfo.length == 1) {
        SetSimulateButton(false);
        SetResetButton(false);

      }

    }
  };


  function calculateMM1ForMuLambda() {

    let lambda = 1 / lambdaValue
    let mu = 1 / muValue
    P = lambda / mu
    Lq = (Math.pow(P, 2)) / (1 - P);
    Wq = Lq / lambda
    W = Wq + 1 / mu
    L = lambda * W
    idle = 1 - P
    return [P, Wq, W, L, idle]
  };

  function calculateMG1ForMuLambda() {
    debugger
    let variance = Math.pow((maxValueForMG1 - minValueForMG1), 2) / 12
    let lambda = 1 / lambdaValue
    let mu = 1 / muValue
    P = lambda / mu
    Lq = (Math.pow(lambda, 2) * variance + Math.pow(P, 2)) / (2 * (1 - P));
    Wq = Lq / lambda
    W = Wq + 1 / mu
    L = lambda * W
    idle = 1 - P
    return [P, Wq, W, L, idle]
  };

  function calculateGG1ForMuLambda() {
    let varianceArr = Math.pow((maxValueForGG1Arr - minValueForGG1Arr), 2) / 12
    let varianceSer = Math.pow((maxValueForGG1Ser - minValueForGG1Ser), 2) / 12
    let lambda = 1 / lambdaValue
    let SqCofArr = varianceArr / Math.pow(lambdaValue, 2)
    let SqCofSer = varianceSer / Math.pow(muValue, 2)
    let mu = 1 / muValue
    P = lambda / mu
    Lq = (Math.pow(P, 2) * (1 + SqCofSer) * (SqCofArr + (Math.pow(P, 2)) * SqCofSer)) / (2 * (1 - P) * (1 + (Math.pow(P, 2)) * SqCofSer));
    Wq = Lq / lambda
    W = Wq + 1 / mu
    L = lambda * W
    idle = 1 - P
    return [P, Wq, W, L, idle]
  };

  function calculateMG2ForMuLambda() {
    debugger
    let lambda = 1 / lambdaValue
    let mu = 1 / muValue
    let CP = lambda / mu
    P = lambda / (2 * mu)
    let Po = 1 / (1 + CP + (Math.pow(CP, 2) / (2 * (1 - P))))
    Lq = (Po * Math.pow(CP, 2) * P) / (2 * (Math.pow((1 - P), 2)));
    Wq = Lq / lambda
    W = Wq + 1 / mu
    L = lambda * W
    idle = 1 - P
    return [P, Wq, W, L, idle]
  };

  function calculateMM2ForMuLambda() {
    let lambda = 1 / lambdaValue
    let mu = 1 / muValue
    let CP = lambda / mu
    P = lambda / (2 * mu)
    let Po = 1 / (1 + CP + (Math.pow(CP, 2) / (2 * (1 - P))))
    Lq = (Po * Math.pow(CP, 2) * P) / (2 * (Math.pow((1 - P), 2)));
    Wq = Lq / lambda
    W = Wq + 1 / mu
    L = lambda * W
    idle = 1 - P
    return [P, Wq, W, L, idle]
  };

  function calculateGG2ForMuLambda() {
    let varianceArr = Math.pow((maxValueForGG1Arr - minValueForGG1Arr), 2) / 12
    let varianceSer = Math.pow((maxValueForGG1Ser - minValueForGG1Ser), 2) / 12
    let SqCofArr = varianceArr / Math.pow(lambdaValue, 2)
    let SqCofSer = varianceSer / Math.pow(muValue, 2)
    let lambda = 1 / lambdaValue
    let mu = 1 / muValue
    let CP = lambda / mu
    P = lambda / (2 * mu)
    let Po = 1 / (1 + CP + (Math.pow(CP, 2) / (2 * (1 - P))))
    Lq = (Po * Math.pow(CP, 2) * P) / (2 * (Math.pow((1 - P), 2)));
    Wq = Lq / lambda
    WqGGC = Wq * ((SqCofArr + SqCofSer) / 2)
    LqGGC = WqGGC * lambda
    W = WqGGC + 1 / mu
    L = lambda * W
    idle = 1 - P
    return [P, W, L, idle, WqGGC, LqGGC]
  };

  //Function For Random servicetime calculation by Mu
  function ServiceRandom(mu) {

    //max and min is to limit service time , Must be greater Than 0
    let min = 1;
    let max = 5;
    let difference = max - min;
    //Formula For Random servicetime calculation by Mu
    let rand = -mu * Math.log(1 - Math.random());
    // multiply with difference 
    rand = Math.floor(rand * difference);
    // add with min value 
    rand = rand + min;
    return rand;
  }

  //Function For Random Priority calculation by Mu
  function PriorityRandom() {
    let min = 1;
    let max = 90;  //To Limit Priority, Must b'w  1 to 90
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

  ////Function For Random ArrivalTime calculation by Mu
  function ArrivalRandom(interarrivalArr, mu) {
    let priority = []
    let resultforservice = []
    let arrivalArr = [0];

    for (let i = 0; i < interarrivalArr.length; i++) {
      if (i != 0) {
        let temp = arrivalArr[i - 1] + interarrivalArr[i]
        // if (temp <= x) {
        arrivalArr.push(temp);
        //service time
        const sss = ServiceRandom(mu)
        resultforservice[i] = Math.round(sss)

        //calculating proirity
        priority[i] = PriorityRandom();
      }
      else {
        let temp = interarrivalArr[i]
        // if (temp <= x) {
        arrivalArr.push(temp);
        //service time
        const sss = ServiceRandom(mu)
        resultforservice[i] = Math.round(sss)

        //calculating proirity
        priority[i] = PriorityRandom();

      }
    }

    return [arrivalArr, resultforservice, priority];
  }

  //Function for getting factorial
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

  //This Function is basically For Calculation OF Initial Columns in Randomness
  //e.g-cummulative probabability,loopup,number b'w arrivals ,classintervals
  function Calculate_Initial_Columns(lambda, mu) {

    let ita = 0;
    for (let i = 0; i > -1; i++) {
      const aaa = Math.exp(-lambda) * Math.pow(lambda, i)
      const def = aaa / factorial(i);
      ita = ita + def;

      //If cummulative Probability is less than 1,continue pushing data
      if (ita < 0.9999) {
        //cummulative probabability
        cummulativeprop[i] = ita.toFixed(4);
        //loopup
        loopupprop[i] = ita.toFixed(4);

        //number between intervals
        numbetweeninterval[i] = i;
      }
      //If cummulative Probability is >= 1,Break 
      else {

        break
      }
    }

    //loopup probability
    loopupprop.unshift("0.0000")

    //populating class intervals
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

    //populating interarrival
    numbetweeninterval.map((val, ind) => {
      //on every iteration , there is a random no, which later we check in class intervals
      let varible = Math.random();
      classintervals.map((value, index) => {
        let min = value.lowerbound;
        let max = value.upperbound;
        //matching class interval's number(index) will be inter arrival for that customer
        if (varible >= min && varible <= max) {
          interarrival[ind] = numbetweeninterval[index];
        }
      })
    })

    //Calling ArrivalRandom, we'll return arrival,service and priority arrays
    return ArrivalRandom(interarrival, mu)
  }

  // This function is returning single customer every time on the basis of priority
  function sorting(Customerinfo, serverendtime = 0) {
    let customeri = []
    let readyuser = {}
    let ready = {}
    Customerinfo?.map((value, index) => {
      if (serverendtime == 0) {
        if (CustomerInfo[0].ArrivalTimeofcustomer == value.ArrivalTimeofcustomer) {
          customeri.push(value)
        }
      }
      else {
        if (serverendtime < CustomerInfo[0].ArrivalTimeofcustomer) {
          let idoltime = Number(CustomerInfo[0].ArrivalTimeofcustomer) - Number(serverendtime)
          let tempuserstart = serverendtime + idoltime
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
    ready = readyuser[0];

    if (ready == undefined) {
      ready = customeri[0]
    }

    //getting index of the customer to splice.
    const abc = CustomerInfo.findIndex(x => x.ArrivalTimeofcustomer == ready.ArrivalTimeofcustomer &&
      x.ServiceTimeofcustomer == ready.ServiceTimeofcustomer &&
      x.PriorityForCustomer == ready.PriorityForCustomer);
    CustomerInfo.splice(abc, 1)

    return ready;
  }

  function Pushing(Server, readyforserver, servername, temp = 0) {


    Server.push(
      {
        userId: Number(readyforserver.userId),
        startTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(temp),
        endTime: Number(readyforserver.ArrivalTimeofcustomer) + Number(temp) + Number(readyforserver.ServiceTimeofcustomer),
        arrrivaltime: Number(readyforserver.ArrivalTimeofcustomer),
        server: servername
      }
    )

  }

 
  function Multi_server_queue() {
    // Making queues for each server
    CustomerInfodup?.map((value, index) => {
      if (index == 0) {
        const readyforserver = sorting(CustomerInfo)
        Pushing(server1, readyforserver, "server 1")
      }

      if (index == 1) {
        const readyforserver = sorting(CustomerInfo)
        if (readyforserver.ArrivalTimeofcustomer < server1[server1.length - 1].endTime) {
          Pushing(server2, readyforserver, "server 2")
        }
        else {
          Pushing(server1, readyforserver, "server 1")
        }
      }
      if (index > 1) {

        if (server2.length > 0 && (server1[server1.length - 1].endTime <= server2[server2.length - 1].endTime)) {
          const readyforserver = sorting(CustomerInfo, server1[server1.length - 1].endTime)
          if (server1[server1.length - 1].endTime == readyforserver.ArrivalTimeofcustomer) {
            Pushing(server1, readyforserver, "server 1")
          }
          else {
            const temp = 0;
            if (readyforserver.ArrivalTimeofcustomer > server1[server1.length - 1].endTime) {
              Pushing(server1, readyforserver, "server 1")
            }
            else {
              temp = Number(Number(server1[server1.length - 1].endTime) - Number(readyforserver.ArrivalTimeofcustomer))
              Pushing(server1, readyforserver, "server 1", temp)
            }
          }
        }
        else {
          if (server2.length > 0 && (server1[server1.length - 1].endTime > CustomerInfo[0].ArrivalTimeofcustomer)) {
            const readyforserver = sorting(CustomerInfo, server2[server2.length - 1].endTime)
            if (server2[server2.length - 1].endTime == readyforserver.ArrivalTimeofcustomer) {
              Pushing(server2, readyforserver, "server 2")
            }
            else {
              const temp = 0;
              if (server2[server2.length - 1].endTime > readyforserver.ArrivalTimeofcustomer) {
                temp = Number(Number(server2[server2.length - 1].endTime) - Number(readyforserver.ArrivalTimeofcustomer))
                Pushing(server2, readyforserver, "server 2", temp)
              }
              else {
                Pushing(server2, readyforserver, "server 2")
              }
            }
          }
          else {
            const readyforserver = sorting(CustomerInfo, server1[server1.length - 1].endTime)
            if (server1[server1.length - 1].endTime > readyforserver.ArrivalTimeofcustomer) {
              Pushing(server2, readyforserver, "server 2")

            }
            else {

              Pushing(server1, readyforserver, "server 1")
            }

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

    //populating servername
    server1?.map((item, index) => {
      servername.push(
        {
          userId: item.userId,
          servernamekey: item.server
        }
      );
    })

    server2.map((item, index) => {
      servername.push(
        {
          userId: item.userId,
          servernamekey: item.server
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
    server2Utilization = 100 - server1Utilization;



  }


  function Single_ServerQueue() {
    CustomerInfodup?.map((value, index) => {

      if (index == 0) {
        const readyforserver = sorting(CustomerInfo)
        Pushing(server1, readyforserver, "server 1")
      }
      else {

        const readyforserver = sorting(CustomerInfo, server1[server1.length - 1].endTime)
        const temp = 0;
        if (server1[server1.length - 1].endTime > readyforserver.ArrivalTimeofcustomer) {
          temp = Number(Number(server1[server1.length - 1].endTime) - Number(readyforserver.ArrivalTimeofcustomer))
          Pushing(server1, readyforserver, "server 1", temp)


        }
        else {

          Pushing(server1, readyforserver, "server 1")
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



    //populating servername
    server1?.map((item, index) => {
      servername.push(
        {
          userId: item.userId,
          servernamekey: item.server
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



    // Calculating waiting time
    server1?.map((item, index) => {
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

  }



  const simulate = () => {
    // Disable enter button and simulator button
    SetEnterButton(true);
    SetSimulateButton(true);
    if (showArrSerTime) {
      CustomerInfo = CustomerInfo.sort((a, b) => a.ArrivalTimeofcustomer - b.ArrivalTimeofcustomer);

      CustomerInfodup = CustomerInfodup.sort((a, b) => a.ArrivalTimeofcustomer - b.ArrivalTimeofcustomer);

      // Validating data
      if (CustomerInfo.lenght == 0) {
        alert("Please enter some valid data");
        return;
      }




      // Making queues for each server
      if (ServercountValue == "1") {
        Single_ServerQueue()

        // chitest(arrivalTime)

      }

      else {
        Multi_server_queue()
      }
      setArrivalTimevalue("");
      setServiceTimeValue("");
      setServercountValue("");
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
            nameOfServer: servername[index].servernamekey,

            turnAroundTime: turnAroundTime[index].turnAroundTime,
            waitingTime: waitingTime[index].waitingTime,
            responseTime: responseTime[index].responseTime
          }
        )
      })

      if (data.length > 0 && tableData.length === 0) {
        setTableData(data);
        data = [];
      }

    }
    else if (showMuLambda) {
      if (showMM1 == true) {
         distribution = "M/M/1 Model"
        setShowMeasures(true);
        calculateMM1ForMuLambda()
      } else if (showMG1 == true) {
         distribution = "M/G/1 Model"
        setShowMeasures(true);
        calculateMG1ForMuLambda()
      } else if (showGG1 == true) {
         distribution = "G/G/1 Model"
        setShowMeasures(true);
        calculateGG1ForMuLambda()
      }
      else if (showMM2 == true) {
         distribution = "M/M/2 Model"
        setShowMeasures(true);
        calculateMM2ForMuLambda()
      }
      else if (showMG2 == true) {
         distribution = "M/G/2 Model"
        setShowMeasures(true);
        calculateMG2ForMuLambda()
      }
      else if (showGG2 == true) {
         distribution = "G/G/2 Model"
        setShowGGCMeasures(true);
        calculateGG2ForMuLambda()
      }
    }
  }

  function readExcelSheet(e) {

 

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref']);
      const rows = [];
      for (let rowNum = range.s.r + 2; rowNum <= range.e.r; rowNum++) {
        const row = [];
        for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const cell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
          if (cell !== undefined && cell.v !== undefined) {
            row.push(cell.v);
          } else {
            row.push('');
          }
        }
        rows.push(row);

        // Saving data to ExcelData Array
        ExcelData.push({
          ArrivalTimeExc: row[0],
          observedfre: row[1],
          AgeExc: row[2],
        })

      }
    

         
    let sum_df= 0
    let mle = []
    let sum_mle = 0

    let shisq = 0
    
    ExcelData.forEach(element => {
      sum_df+=element.observedfre
      mle.push(element.ArrivalTimeExc*element.observedfre)
      sum_mle+=(element.ArrivalTimeExc*element.observedfre)
    });

    let lambdaaa= sum_mle/sum_df
    let prob = 0
    debugger
    for (let i = 0;i<ExcelData.length;i++){
      
      let p = (Math.pow( Math.E,-lambdaaa)*Math.pow(lambdaaa,i))/factorial(i)
      let expectedfreq = p*sum_df
      // expectedfrequency.push(expectedfreq
      let sq = (ExcelData[i].observedfre-expectedfreq).toFixed(1)
      let she =Math.pow(sq,2)
      let sh111 = she/expectedfreq
         shisq+=sh111
    }
    console.log(shisq)
    let ftable_criticalvalue  = 18.307
    if(shisq<ftable_criticalvalue){
      alert("your dataset is accepting null hypothesis, so we can say thats the dataset is following poisson distribution")
    }
    else{
        alert("your dataset is not accepting null hypothesis, so we can say thats the dataset is following some other distribution")
    }

    };
    reader.readAsBinaryString(file);

   


  }


  return (
    <>
      <Head>
        <title>OR Simulator</title>
        <meta name="OR Simulator" content="A simulator based on queueing model M/M/2" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossOrigin="anonymous"></link>
        {/* <link rel="stylesheet" href="../styles/bootstrap-5.3.0-alpha1-dist/css/bootstrap.min.css" crossOrigin="anonymous" /> */}
        <link rel="icon" href="/favicon.ico" />


      </Head>

      <main className="m-4">

        {/* Simulator heading and Toggler */}
        <div className='row justify-content-center'>
          <div className='col-12 text-center mb-3'>
            <h1 className='display-6 fw-semibold'>Pakistan Passport Office (Saddar Branch)</h1>
          </div>
          <div className='col-12 text-center'>
            <div className="form-check form-check-inline">
              <input onClick={() => toggleParameter("MuLambda")} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
              <label className="form-check-label" htmlFor="inlineRadio1">Queueing Model</label>
            </div>
            <div className="form-check form-check-inline">
              <input onClick={() => toggleParameter("ArrSerTime")} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
              <label className="form-check-label" htmlFor="inlineRadio2">Random Simulation</label>
            </div>
          </div>
        </div>

        <hr />

        <div className="m-md-4">
          <div className={`row justify-content-center ${Style.background}`} id='selected'>
            {/* Form for Mu and Lambda */}
            {showMuLambda &&
              <div className='col-md-9 bg-light p-md-5 p-3 rounded-5'>
                <h1 className='display-6'>Make Your Model By Selecting proper distributions</h1>
                <hr />
                <form>

                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="d-flex justify-content-end ps-0">

                        <select onChange={(event) => { setDistributionForLambda(event.target.value) }} value={distributionForLambda} className={`col-12 ${Style.dropdown}`} disabled={dropDown} style={{
                          backgroundColor: "#f2f2f2",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          color: "#333",
                          padding: "12px 24px",

                          fontSize: "13px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          height: "45px"
                        }}>
                          <option value="">Select Arrival Time Distribution</option>
                          <option value="poisson-distribution">Poisson Distribution</option>
                          <option value="exponential-distribution">Exponential Distribution</option>
                          <option value="gamma-distribution">Gamma Distribution</option>
                          <option value="normal-distribution">Normal Distribution</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex justify-content-end ps-0">
                        <select onChange={(event) => { setDistributionForMu(event.target.value) }} value={distributionForMu} className={`col-9 col-md-12 ${Style.dropdown}`} disabled={dropDown} style={{
                          backgroundColor: "#f2f2f2",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          color: "#333",
                          padding: "12px 24px",

                          fontSize: "13px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          height: "45px"
                        }}>
                          <option value="">Select Service Time Distribution</option>
                          <option value="poisson-distribution">Poisson Distribution</option>
                          <option value="exponential-distribution">Exponential Distribution</option>
                          <option value="gamma-distribution">Gamma Distribution</option>
                          <option value="normal-distribution">Normal Distribution</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="ps-0">
                        <select onChange={(event) => { setNumberofServerForMuLambda(event.target.value) }} value={numberofServerForMuLambda} className={`col-12 ${Style.dropdown}`} disabled={dropDown} style={{
                          backgroundColor: "#f2f2f2",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          color: "#333",
                          padding: "12px 24px",

                          fontSize: "13px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          height: "45px"
                        }}>
                          <option value="">Select No. of Server</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* MM1 */}
                  {showMM1 &&
                    <div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="mu">Mu (ST): </label>
                        </div>
                        <div className='col-9 ps-0 mb-2 mb-md-0'>
                          <input type="number" id="mu" value={muValue} required className="form-control" onChange={(event) => { setMuValue(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="lambda">Lambda (AT):</label>
                        </div>
                        <div className="col-9 d-flex flex-wrap justify-content-between ps-0">
                          <input type="number" id="lambda" value={lambdaValue} className="form-control" onChange={(event) => { setLambdaValue(event.target.value) }} />
                        </div>

                      </div>
                    </div>
                  }

                  {/* GG1 */}
                  {showGG1 &&
                    <div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="mu">Mu (ST): </label>
                        </div>
                        <div className='col-9 ps-0 mb-2 mb-md-0'>
                          <input type="number" id="mu" value={muValue} required className="form-control" onChange={(event) => { setMuValue(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="lambda">Lambda (AT):</label>
                        </div>
                        <div className="col-9 d-flex flex-wrap justify-content-between ps-0">
                          <input type="number" id="lambda" value={lambdaValue} className="form-control" onChange={(event) => { setLambdaValue(event.target.value) }} />
                        </div>

                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="min-value">Minimum Value For Arrival:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="min-value" value={minValueForGG1Arr} required className="form-control" onChange={(event) => { setminValueForGG1Arr(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="max-value">Maximum Value For Arrival:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="max-value" value={maxValueForGG1Arr} required className="form-control" onChange={(event) => { setmaxValueForGG1Arr(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="min-value">Minimum Value For Service:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="min-value" value={minValueForGG1Ser} required className="form-control" onChange={(event) => { setminValueForGG1Ser(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="max-value">Maximum Value For Service:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="max-value" value={maxValueForGG1Ser} required className="form-control" onChange={(event) => { setmaxValueForGG1Ser(event.target.value) }} />
                        </div>
                      </div>
                    </div>
                  }

                  {/* MG1 */}
                  {showMG1 &&
                    <div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="mu">Mu (ST): </label>
                        </div>
                        <div className='col-9 ps-0 mb-2 mb-md-0'>
                          <input type="number" id="mu" value={muValue} required className="form-control" onChange={(event) => { setMuValue(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="lambda">Lambda (AT):</label>
                        </div>
                        <div className="col-9 d-flex flex-wrap justify-content-between ps-0">
                          <input type="number" id="lambda" value={lambdaValue} className="form-control" onChange={(event) => { setLambdaValue(event.target.value) }} />
                        </div>

                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="min-value-for-MG1">Minimum Value:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="min-value-for-MG1" value={minValueForMG1} required className="form-control" onChange={(event) => { setminValueForMG1(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="max-value-for-MG1">Maximum Value:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="max-value-for-MG1" value={maxValueForMG1} required className="form-control" onChange={(event) => { setmaxValueForMG1(event.target.value) }} />
                        </div>
                      </div>
                    </div>
                  }

                  {/* MG2 */}
                  {showMG2 &&
                    <div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="mu">Mu (ST): </label>
                        </div>
                        <div className='col-9 ps-0 mb-2 mb-md-0'>
                          <input type="number" id="mu" value={muValue} required className="form-control" onChange={(event) => { setMuValue(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="lambda">Lambda (AT):</label>
                        </div>
                        <div className="col-9 d-flex flex-wrap justify-content-between ps-0">
                          <input type="number" id="lambda" value={lambdaValue} className="form-control" onChange={(event) => { setLambdaValue(event.target.value) }} />
                        </div>

                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="min-value">Minimum Value For Service:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="min-value" value={minValueForGG1Ser} required className="form-control" onChange={(event) => { setminValueForGG1Ser(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="max-value">Maximum Value For Service:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="max-value" value={maxValueForGG1Ser} required className="form-control" onChange={(event) => { setmaxValueForGG1Ser(event.target.value) }} />
                        </div>
                      </div>
                    </div>
                  }

                  {/* MM2 */}
                  {showMM2 &&
                    <div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="mu">Mu (ST): </label>
                        </div>
                        <div className='col-9 ps-0 mb-2 mb-md-0'>
                          <input type="number" id="mu" value={muValue} required className="form-control" onChange={(event) => { setMuValue(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="lambda">Lambda (AT):</label>
                        </div>
                        <div className="col-9 d-flex flex-wrap justify-content-between ps-0">
                          <input type="number" id="lambda" value={lambdaValue} className="form-control" onChange={(event) => { setLambdaValue(event.target.value) }} />
                        </div>

                      </div>
                    </div>
                  }

                  {/* GG2 */}
                  {showGG2 &&
                    <div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="mu">Mu (ST): </label>
                        </div>
                        <div className='col-9 ps-0 mb-2 mb-md-0'>
                          <input type="number" id="mu" value={muValue} required className="form-control" onChange={(event) => { setMuValue(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="lambda">Lambda (AT):</label>
                        </div>
                        <div className="col-9 d-flex flex-wrap justify-content-between ps-0">
                          <input type="number" id="lambda" value={lambdaValue} className="form-control" onChange={(event) => { setLambdaValue(event.target.value) }} />
                        </div>

                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="min-value">Minimum Value For Arrival:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="min-value" value={minValueForGG1Arr} required className="form-control" onChange={(event) => { setminValueForGG1Arr(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="max-value">Maximum Value For Arrival:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="max-value" value={maxValueForGG1Arr} required className="form-control" onChange={(event) => { setmaxValueForGG1Arr(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="min-value">Minimum Value For Service:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="min-value" value={minValueForGG1Ser} required className="form-control" onChange={(event) => { setminValueForGG1Ser(event.target.value) }} />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className='col-3'>
                          <label className="form-label" htmlFor="max-value">Maximum Value For Service:</label>
                        </div>
                        <div className={`col-9 ps-0 mb-2 mb-md-0 ${Style.w54}`}>
                          <input type="number" id="max-value" value={maxValueForGG1Ser} required className="form-control" onChange={(event) => { setmaxValueForGG1Ser(event.target.value) }} />
                        </div>
                      </div>
                    </div>
                  }
                  {showNextBtn &&
                    <div className='row mb-4 px-lg-5 mb-4 p-md-3 p-2 justify-content-center'>
                      <button type="button" onClick={() => onNext()} className="col-3 col-md-3 btn btn-primary">Next</button>
                    </div>
                  }

                  {showBtn &&
                    <div className='row mb-4 px-lg-5 mb-4 p-md-3 p-2 justify-content-between'>
                      <button disabled={EnterButton} type="button" onClick={() => onMuLambdaEnter()} className="col-2 btn btn-primary">Enter</button>
                      <button disabled={SimulateButton} type="button" onClick={() => simulate()} className="col-2  btn btn-success">Simulate</button>
                      <button disabled={ResetButton} type="button" onClick={() => resetData()} className=" col-2 btn btn-danger">Reset</button>
                      <button type="button" onClick={() => backBtn()} className=" col-2 btn btn-danger">Back</button>
                    </div>
                  }
                </form>
              </div>
            }

            {/* Displaying Server Utilization, Idle Time and Number of Customers who wait */}
            {(showMuLambda) &&
              <>
                <hr className='mt-4' />
                {showMeasures == true &&
                  <div className="row justify-content-between align-items-center">
                     <div className="row mb-4">
                        <div className='col-12'>

                          <h1 className='text-center'>{distribution}</h1>
                        </div>
                        </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className="py-5 border rounded text-center" style={{ background: "rgba(54, 162, 235, 0.2)" }}>
                        <p className='fs-4 m-0'>Utilization of System:<br /> {P.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(255, 159, 64, 0.2)" }}>
                        <p className='fs-4 m-0'>Customers in Queue:<br /> {Math.round(Lq)} Customers</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(255, 99, 132, 0.2)" }}>
                        <p className='fs-4 m-0'>Waiting Time in Queue:<br /> {Wq.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(153, 102, 255, 0.2)" }}>
                        <p className='fs-4 m-0'>Customers in System:<br /> {Math.round(L)} Customers</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(54, 162, 235, 0.2)" }}>
                        <p className='fs-4 m-0'>Waiting Time in System:<br /> {W.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(255, 159, 64, 0.2)" }}>
                        <p className='fs-4 m-0'>Idle Time of System:<br /> {idle.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                  </div>
                }
                {showGGCMeasures == true &&
                  <div className="row justify-content-between align-items-center">
                     <div className="row mb-4">
                        <div className='col-12'>

                          <h1 className='text-center' >{distribution}</h1>
                        </div>
                        </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(54, 162, 235, 0.2)" }}>
                        <p className='fs-4 m-0'>Utilization of System:<br /> {P.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(255, 159, 64, 0.2)" }}>
                        <p className='fs-4 m-0'>Customers in Queue:<br /> {Math.round(LqGGC)} Customers</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(255, 99, 132, 0.2)" }}>
                        <p className='fs-4 m-0'>Waiting Time in Queue:<br /> {WqGGC.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(153, 102, 255, 0.2)" }}>
                        <p className='fs-4 m-0'>Customers in System:<br /> {Math.round(L)} Customers</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(54, 162, 235, 0.2)" }}>
                        <p className='fs-4 m-0'>Waiting Time in System:<br /> {W.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mt-3'>
                      <div className='py-5 border rounded text-center' style={{ background: "rgba(255, 159, 64, 0.2)" }}>
                        <p className='fs-4 m-0'>Idle Time of System:<br /> {idle.toFixed(2)} Minutes</p>
                      </div>
                    </div>
                  </div>
                }
              </>
            }

            {/* Form for Arrival and Service Time */}
            {showArrSerTime &&
              <div className='col-md-8 bg-light p-md-5 p-3 rounded-5'>
                <h1 className='display-6'>Perform Simulation with Random Numbers</h1>
                <hr />
                <form>
                  <div className="row mb-4">
                    <div className='col-4'>
                      <label className="form-label" htmlFor="arrivalTime">Avg Arrival Time: </label>
                    </div>
                    <div className='col-8'>
                      <input type="number" id="arrivalTime" value={arrivalTimevalue} required className="form-control" onChange={(event) => { setArrivalTimevalue(event.target.value) }} />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className='col-4'>
                      <label className="form-label" htmlFor="serviceTime">Avg Service Time:</label>
                    </div>
                    <div className='col-8'>
                      <input type="number" id="serviceTime" value={serviceTimeValue} className="form-control" onChange={(event) => { setServiceTimeValue(event.target.value) }} />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className='col-4'>
                      <label className="form-label" htmlFor="serviceTime">No of Servers:</label>
                    </div>

                    <div className='col-8'>
                      <select onChange={(event) => { setServercountValue(event.target.value) }} value={ServercountValue} className={`col-12 ${Style.dropdown}`} disabled={dropDown} style={{
                        backgroundColor: "#f2f2f2",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        color: "#333",
                        padding: "12px 24px",

                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        height: "45px"
                      }}>
                        <option value="">Select value</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </div>
                  </div>




                  <div className='row px-lg-5 mb-4 p-md-3 p-2 justify-content-between'>
                    <button disabled={EnterButton} type="button" onClick={() => onEntervalue()} className="col-3 col-md-3 btn btn-primary">Enter</button>

                    <button disabled={SimulateButton} type="button" onClick={() => simulate()} className="col-4 col-md-3 btn btn-success">Simulate</button>

                    <button disabled={ResetButton} type="button" onClick={() => resetData()} className="col-3 col-md-3 btn btn-danger">Reset</button>

                  </div>
                </form>
              </div>
            }

            {/* Displaying Server Utilization, Idle Time and Number of Customers who wait */}
            {(showArrSerTime) &&
              <>
                <div className='col-md-12 p-md-2 p-3'>
                  {tableData.length > 0 &&

                    <div className='row text-center'>



                      <div className='col-md-6 p-0 p-md-2'>
                        <div className='mb-4 justify-content-center'>
                          <div className="card">
                            <div className="card-body">
                              <PieChart
                                title='Server Utilization'
                                labels={["Server 1", "Server 2"]}
                                backgroundColor={server1Utilization > server2Utilization ? ['#FF597B', '#82C3EC'] : ['#82C3EC', '#FF597B']}
                                data={[server1Utilization, server2Utilization]}
                              // hoverBackgroundColor=''
                              // width={50}
                              // height={50}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='col-md-6 p-0 p-md-2'>
                        <div className='mb-4 justify-content-center'>
                          <div className="card">
                            <div className="card-body">
                              <PieChart
                                title='Idle Time'
                                labels={["Server 1", "Server 2"]}
                                backgroundColor={server1Utilization > server2Utilization ? ['#227C70', '#FF6E31'] : ['#FF6E31', '#227C70']}
                                data={[server2Utilization, server1Utilization]}
                              // hoverBackgroundColor=''
                              // width={50}
                              // height={50}
                              />
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className='col-12 p-0 p-md-2'>
                        <div className='justify-content-center'>
                          <div className="card">
                            <div className="card-body">
                              <h1 className='display-1' style={{ "fontSize": "100px" }}>{queueLength}</h1>
                              <p className='display-6' style={{ "fontSize": "50px" }}>{queueLength > 1 ? "Customers" : "Customer"} who wait</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <hr />
              </>
            }

            {/* Reading Excel File */}
            {(showChiSquare) &&
              <>
                <input type="file" id="file-input" onChange={readExcelSheet} />
              </>

            }


          </div>
        </div>

        {/* Displaying the table */}
        {tableData.length > 0 &&
          <div className=' row text-center justify-content-center'>
            <div className={Style.overflowHidden}>
              <table className="table table-bordered table-hover m-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Arrival Time</th>
                    <th scope="col">Service Time</th>
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
                      <td>{item.arrivalTime}</td>
                      <td>{item.serviceTime}</td>
                      <td>{item.priority}</td>
                      <td>{item.startTime}</td>
                      <td>{item.endTime}</td>
                      <td>{item.turnAroundTime}</td>
                      <td>{item.waitingTime}</td>
                      <td>{item.responseTime}</td>
                      <td>{item.nameOfServer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='row p-0'>
              <div className='col-sm-6 p-0 px-md-3'>
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



              <div className='col-sm-6 p-0 px-md-3'>
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
          </div>

        }

        {queueLength > 0 &&

          <div className=' row text-center justify-content-center'>
            <div className='row p-0'>
              <div className='col-sm-6 p-0 px-md-3'>
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


              <div className='col-sm-6 p-0 px-md-3'>
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
            </div>
          </div>
        }

      </main>
    </>
  )
}

export default Home;