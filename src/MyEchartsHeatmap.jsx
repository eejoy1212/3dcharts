import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import downsample from "downsample-lttb";
import { EChartsOption, } from "echarts";
import * as echarts from "echarts/core";
import { SVGRenderer,CanvasRenderer } from "echarts/renderers";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
function getNoiseHelper() {
  console.log("노이즈헬퍼 함수 호출");
  class Grad {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    dot2(x, y) {
      return this.x * x + this.y * y;
    }
    dot3(x, y, z) {
      return this.x * x + this.y * y + this.z * z;
    }
  }
  const grad3 = [
    new Grad(1, 1, 0),
    new Grad(-1, 1, 0),
    new Grad(1, -1, 0),
    new Grad(-1, -1, 0),
    new Grad(1, 0, 1),
    new Grad(-1, 0, 1),
    new Grad(1, 0, -1),
    new Grad(-1, 0, -1),
    new Grad(0, 1, 1),
    new Grad(0, -1, 1),
    new Grad(0, 1, -1),
    new Grad(0, -1, -1),
  ];
  const p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];
  // To remove the need for index wrapping, double the permutation table length
  const perm = new Array(512);
  const gradP = new Array(512);
  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  function seed(seed) {
    if (seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }
    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }
    for (let i = 0; i < 256; i++) {
      let v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed >> 8) & 255);
      }
      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  }
  seed(0);
  // ##### Perlin noise stuff
  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  function lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
  // 2D Perlin Noise
  function perlin2(x, y) {
    // Find unit grid cell containing point
    let X = Math.floor(x),
      Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X;
    y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255;
    Y = Y & 255;
    // Calculate noise contributions from each of the four corners
    const n00 = gradP[X + perm[Y]].dot2(x, y);
    const n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
    const n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
    const n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
    // Compute the fade curve value for x
    const u = fade(x);
    // Interpolate the four results
    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
  }
  return {
    seed,
    perlin2,
  };
}
// let xData = [];
// let yData = [];
const forNum = 2000; // 버튼을 클릭할 때마다 데이터 업데이트
const noise = getNoiseHelper();
const initalOption = {
  aria: {
    show: true
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "category",
    data: [],
  },
  visualMap: {
    min: 0,
    max: 1,
    calculable: true,
    realtime: false,
    inRange: {
      color: [
        "#313695",
        "#4575b4",
        "#74add1",
        "#abd9e9",
        "#e0f3f8",
        "#ffffbf",
        "#fee090",
        "#fdae61",
        "#f46d43",
        "#d73027",
        "#a50026",
      ],
    },
  },
  series: [
    {
      downsample: {
        threshold: 5 // 0 disables downsampling for this series.
      },
      name: "히트맵",
      type: "heatmap",
      heatmap: {
        gridSize: 10, // 각 셀의 크기를 줄임
        blurSize: 0, // 흐림 효과 제거
      },
      data: [],
      // emphasis: {
      //   itemStyle: {
      //     borderColor: "#333",
      //     borderWidth: 1,
      //   },
      // },

      webGL: true,
      progressive: forNum,
      progressiveChunkMode: 'mod',
      progressiveChunkSize: forNum,
      largeThreshold: 2000, // 데이터 개수가 이 값 이상일 때, large mode로 전환됩니다.
      largeHeatmapThreshold: 50, // large mode에서 히트맵 셀 하나를 그릴 때, 빈 셀 개수가 이 값 이하인 경우에만 셀을 그립니다.
      largeLimit: 100, // large mode에서 그릴 수 있는 셀의 최대 개수입니다. 이 값을 초과하면 그림이 그려지지 않습니다.
      progressiveThreshold: 300, // progressiveThreshold 옵션 추가
      animation: false,
    
    },
  ],
};
// async function generateData() {
//   console.log('제너레이트 함수 호출 시작');

//   const heatData = [];
//   const xData = [];
//   const yData = [];
//   for (let i = 0; i <= forNum; i++) {
//     for (let j = 0; j <= forNum; j++) {
//       const value = noise.perlin2(i / 40, j / 20) + 0.5;
//       heatData.push([i, j, value]);
//     }
//     xData.push(i);
//   }
//   for (let j = 0; j < xData.length; j++) {
//     yData.push(j);
//   }
//   console.log('제너레이트 함수 끝');
//   set
//   // return [xData, yData, heatData];
// }

echarts.use([
  SVGRenderer,
  // CanvasRenderer,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
]);
export default function MyEchartsHeatmap() {
  const option = {
    aria: {
      show: true
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "category",
      data: [],
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      realtime: false,
      inRange: {
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
    },
    series: [
      {
        // downsample: {
        //   threshold: 100 // 0 disables downsampling for this series.
        // },
        name: "히트맵",
        type: "heatmap",
        heatmap: {
          gridSize: 10, // 각 셀의 크기를 줄임
          blurSize: 0, // 흐림 효과 제거
        },
        data: [],
        // emphasis: {
        //   itemStyle: {
        //     borderColor: "#333",
        //     borderWidth: 1,
        //   },
        // },
  
        // webGL: true,
        progressive: 400000000,
        // progressiveChunkMode: 'mod',
        // progressiveChunkSize: 2000,
        
        // largeThreshold: 2000, // 데이터 개수가 이 값 이상일 때, large mode로 전환됩니다.
        // largeHeatmapThreshold: 50, // large mode에서 히트맵 셀 하나를 그릴 때, 빈 셀 개수가 이 값 이하인 경우에만 셀을 그립니다.
        // largeLimit: 100, // large mode에서 그릴 수 있는 셀의 최대 개수입니다. 이 값을 초과하면 그림이 그려지지 않습니다.
        // progressiveThreshold: 300, // progressiveThreshold 옵션 추가
        animation: false,
      
      },
    ],
  };
  // const [option, setOption] = useState(initalOption);
  const chartRef = useRef(null);

  const generateData = useCallback(async () => {
 
  
    const res = await Promise.all([
      createXdata(),
      createYdata(),
    ]);

   const heatD= createHeatData(res[0]);
    console.log("제너레이트 데이터 됐나??", res);
    return [res[0], res[1], heatD];
  }, []);

  return (
    <div>
      <button
        onClick={async () => {

          // generateData().then(async(data) => {
          //   const chartInstance = chartRef.current.getEchartsInstance();
          
          //   console.log('chartInstance',chartInstance);
          //   console.log("데이터 갯수 : ", data[2].length);
          //   const downsampledData = downsample.processData(
          //     data[2],
          //     Math.round(data[2].length / 3)
          //   );
          // chartInstance.setOption({
          //     ...option,
          //     xAxis: {
          //       type: "category",
          //       data: data[0],
          //     },
          //     yAxis: {
          //       type: "category",
          //       data: data[1],
          //     },
          //     series: [
          //       {
          //         ...option.series[0],
          //         data: downsampledData,
          //       },
          //     ],
          //   });
           
          //   console.log("차트 그리기 끝");
          // });
         const[x,y,z]=await generateData();
         const chartInstance = chartRef.current.getEchartsInstance();
          
         console.log('chartInstance',chartInstance);
         console.log("데이터 갯수 : ", z.length);
         const downsampledData = downsample.processData(
           z,
           Math.round(z.length / 5)
         );
       
        
       chartInstance.setOption({
           ...option,
           xAxis: {
             type: "category",
             data:x,
           },
           yAxis: {
             type: "category",
             data: y,
           },
           series: [
             {
               ...option.series[0],
               data: downsampledData,
             },
           ],
         });
        
         console.log("차트 그리기 끝");
        }}
      >
        데이터만들기
      </button>
      <ReactEChartsCore
        echarts={echarts}
        ref={(e)=>{chartRef.current=e}}
        onChartReady={(chart) => {
        
        }}
        onEvents={{
          click: (params) => {
            console.log("클릭한 데이터", params);
          },
        
        }}

        // ref={(e)=>{chartRef.current=e 
        // console.log('in ref',e,chartRef.current)
        // }}
        option={option}
        notMerge={true}
        theme={"my_theme"}
        // lazyUpdate={true}
        // key={Math.random()}
        // opts={{ renderer: "svg" }}
      />
    </div>
  );

  async function createXdata() {
    const xData=[];
    for (let i = 0; i <= forNum; i++) {
      // for (let j = 0; j <= forNum; j++) {
      //   const value = noise.perlin2(i / 40, j / 20) + 0.5;
      //   heatData.push([i, j, value]);
      // }
      xData.push(i);
    }
    return xData;
   
  }
}
function createHeatData(xData) {
  const heatData=[];
  for (let i = 0; i < xData.length; i++) {
    for (let j = 0; j <= forNum; j++) {
      const value = noise.perlin2(i / 40, j / 20) + 0.5;
      heatData.push([i, j, value]);
    }
  }
  return heatData;
}

async function createYdata(xData) {
  const yData = [];
  for (let j = 0; j < forNum; j++) {
    yData.push(j);
  }
  return yData;
}
