import ReactEcharts from "echarts-for-react";
import {  useEffect, useState } from "react";
import "echarts-gl";
import downsample from "downsample-lttb";



export default function MyEchart() {  
  const [data, setData] = useState([]);
  const forNum = 2000; // 버튼을 클릭할 때마다 데이터 업데이트
    
  
useEffect(()=>{
},[])

  async function handle3d() {
    let i=0;
    const tempData=[];
  while (i<forNum) {
    let j=0;
    while (j<forNum) {
      let y = i ;
      let z =j ;
    tempData.push([y, z]);
      j++;
    }
    i++;
  }
let k=0;
  while (k<tempData.length) {
      setData([k,...tempData[k]]);
      k++;
  }
    
  }
  
  
 async function handleUpdate()  {
   

  const temp1Data=[];
  const temp2Data=[];
  for (var i = 0; i < forNum; i++) {
    for (var j = 0; j < forNum; j++) {
      var y = i ;
      var z =j ;
      temp1Data.push([y, z]);
    }
  }
  for (let x = 0; x <temp1Data.length; x++) {
    temp2Data.push([x,...temp1Data[x]]);
  }
  ///
 
  // const downsampledData = downsample.processData(temp2Data, forNum*forNum / 10);
  setData(temp2Data);
  ///
  
  console.log("data", data);
 }
  const option = {
    grid3D: {
      // 차트의 크기 설정
      boxWidth: 100,
      boxHeight: 100,
      boxDepth: 80,
    },
    xAxis3D: {
      // x축 범위 설정
      min: 0,
      max: forNum*forNum,
    },
    yAxis3D: {
      // y축 범위 설정
      min: 0,
      max: forNum,
    },
    zAxis3D: {
      // z축 범위 설정
      min: 0,
      max:forNum,
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [
      {
        type: "surface",
        webGL: true,

        // large: true,
        // largeThreshold: forNum, // largeThreshold 옵션 설정

        // largeData: {
        //   dimensions: ["x", "y", "z"],
        //   encode: {
        //     x: 0,
        //     y: 1,
        //     z: 2,
        //   },
        // },
        // seriesLayoutBy: "row",
        progressive: true, // 일부씩 그려 나가는 방식 지정
        progressiveThreshold: forNum, // 기준값 설정
        // progressiveChunkMode: 'mod', // 그리는 방식 지정
        temporalSuperSampling: {
          // 활성화 옵션
          enable: true,
          quality: "low",
        },
        //z가 인덱스
    data : data,itemStyle: {
      color: "#dd4b39",
    },
    wireframe: {
      show: false
    },
      
      },
    ],
  };
  const handleSampling = () => {
    // 데이터 다운 샘플링
    const downsampledData = downsample.processData(data, forNum*forNum / 2);
    setData(downsampledData);
    console.log('downsampling',data)
  };
  const handleClear = () => {
    setData([]);
  };

  console.log("option", option);
  return (
    <>
      <button onClick={handleUpdate}> 데이터 업데이트 </button>
      <button onClick={handleSampling}> 데이터 다운샘플링 </button>
      <button onClick={handleClear}> 데이터 클리어 </button>
      {/* <div style={{width:"100vw",height:'80%',backgroundColor:'red'}}> */}
      <ReactEcharts option={option} style={{ width: "100%", height: "80%" }} />;
      {/* </div> */}
    </>
  );
}