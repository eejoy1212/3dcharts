import React, { Suspense, useCallback, useEffect, useState } from "react";
import "./App.css";
import MyLighteningChart from "./MyLighteningChart";
// import MyEchartsHeatmap from './MyEchartsHeatmap';
// const MyEchartsHeatmap = lazy(() => import("./MyEchartsHeatmap"));
let direction = true;
const arrayLength = 1024 * 8;
const viewLength = 30;
const interval = 500;
let timer;
function App() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [num, setNum] = useState(-120);

  const ucGenData = useCallback((data, setData, value, type) => {
    if (value >= -50) direction = false;
    else if (value <= -120) direction = true;

    const temp = [];
    for (let i = 0; i < arrayLength; i++) {
      switch (type) {
        case 0:
          temp.push(value);
          break;
        case 1:
          temp.push(Math.random() * -120);
          break;
        case 2:
          temp.push(Math.random() * (-30 - -90) - 90);
          break;
        case 3:
          temp.push(Math.random() * (-70 - -120) - 120);
          break;
      }
    }

    // console.log(direction, value);

    if (temp.length > 0) {
      setData((prev) => {
        if (data.length >= viewLength) return [...prev.slice(1), temp];
        else return [...prev, temp];
      });
    }
  }, []);
  // const []
  // console.log("들어간 데이터", data);
  // console.log("num", num);
  // 확대했을때 x축 0.5단위
  // 빼고 다시 넣었을때 인텐시티가 0이된다. 색은 잘나온다.
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          <button
            type="button"
            onClick={() => {
              // const temp = new Array(arrayLength);
              //  const val=100;
              setNum((prev) => {
                return direction ? prev + 3 : prev - 3;
              });
              ucGenData(data1, setData1, num, 0);
              ucGenData(data2, setData2, num, 1);
              ucGenData(data3, setData3, num, 2);
            }}
          >
            데이터 넣기
          </button>
          <button
            type="button"
            onClick={() => {
              // if (data1.length > 0) setData1((prev) => prev.slice(1));
              // if (data2.length > 0) setData2((prev) => prev.slice(1));
              // if (data3.length > 0) setData3((prev) => prev.slice(1));
              timer = setInterval(() => {
                setNum((prev) => {
                  return direction ? prev + 3 : prev - 3;
                });
                ucGenData(data1, setData1, num, 3);
                ucGenData(data2, setData2, num, 1);
                ucGenData(data3, setData3, num, 2);
              }, interval);
            }}
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => {
              // if (data1.length > 0) setData1((prev) => prev.slice(1));
              // if (data2.length > 0) setData2((prev) => prev.slice(1));
              // if (data3.length > 0) setData3((prev) => prev.slice(1));
              clearInterval(timer);
            }}
          >
            Stop
          </button>
        </div>
        <MyLighteningChart
          // style={{ height: "100%", display: "inline-block" }}
          data={data1}
          viewLength={viewLength}
          arrayLength={arrayLength}
          id="chart1"
        />
        <MyLighteningChart
          data={data2}
          viewLength={viewLength}
          arrayLength={arrayLength}
          id="chart2"
        />
        <MyLighteningChart
          data={data3}
          viewLength={viewLength}
          arrayLength={arrayLength}
          id="chart3"
        />
      </Suspense>
    </div>
  );
}

export default App;
