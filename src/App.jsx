import React, { Suspense, useEffect, useState } from "react";
import "./App.css";
import MyLighteningChart from "./MyLighteningChart";
// import MyEchartsHeatmap from './MyEchartsHeatmap';
// const MyEchartsHeatmap = lazy(() => import("./MyEchartsHeatmap"));
let timer;
let idx = 0;
function App() {
  const [data, setData] = useState([]);
  const [started, setStarted] = useState(false);
  const [num, setNum] = useState(-120);
  const [col, setCol] = useState(0);
  // const []
  console.log("들어간 데이터", data);
  // console.log("num", num);
  // 확대했을때 x축 0.5단위
  // 빼고 다시 넣었을때 인텐시티가 0이된다. 색은 잘나온다. 
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <button
          type="button"
          onClick={() => {
            //  timer=  setInterval(() => {
            const temp = [];
            //  const val=100;
            if(num < -50){
              setNum((prev) => prev + 1);
            }
            else{
              setNum((prev) => prev - 1);
            }
             
            for (let i = 0; i < 2048 * 4; i++) {
              temp.push({ x: i, y: num });
            }
            console.log("num", num)

            if (temp.length > 0) {
              setData((prev) => [...prev, temp]);
            }
            // setNum(!num);
            setStarted(true);
            setCol((prev) => prev + 1);
      
          }}
        >
          데이터 넣기
        </button>
        <button
          type="button"
          onClick={() => {
            // setData((prev) => prev.slice(1));
            setData((prev) => prev.splice(1,data.length-1));
            // setData((prev)=>prev.filter((_,i)=>i!==0))
          }}
        >
          맨앞에거 뺴기
        </button>
        <button
          type="button"
          onClick={() => {
            timer = setInterval(() => {
              const temp = [];
              for (let i = 0; i < 2048 * 4; i++) {
                temp.push({ x: i, y: Math.random() * 100 });
              }
              if (temp.length > 0) {
                setData((prev) => [...prev, temp]);
              }
              setStarted(true);
            }, 1000);
          }}
        >
          연속해서 데이터 넣기
        </button>
        <button
          onClick={() => {
            setStarted(false);
            clearInterval(timer);
          }}
        >
          데이터 그만 넣기
        </button>
        <MyLighteningChart
          id="chart-1"
          data={data}
          started={started}
          col={col}
        />
      </Suspense>
    </div>
  );
}

export default App;
