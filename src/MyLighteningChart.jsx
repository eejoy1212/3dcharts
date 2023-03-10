import React, { useRef, useEffect, useState } from "react";

import {
  AxisScrollStrategies,
  AxisTickStrategies,
  ColorCSS,
  ColorHEX,
  emptyFill,
  emptyLine,
  LegendBoxBuilders,
  lightningChart,
  LUT,
  PalettedFill,
  regularColorSteps,
  SolidFill,
  SolidLine,
  synchronizeAxisIntervals,
  Themes,
} from "@arction/lcjs";
import { makeFlatTheme } from "@arction/lcjs-themes";  
let xxxx=0;
export default function MyLighteningChart(props) {
  const { data, id,started,col } = props;
  const chartRef = useRef(undefined);

  useEffect(() => {
    const flatDarkTheme = makeFlatTheme({
      backgroundColor: ColorHEX("#29282b"),
      textColor: ColorHEX("#5F5F5F"),
      dataColors: [ColorHEX("e24d42")],
      axisColor: ColorHEX("#262527"),
      gridLineColor: ColorHEX("#262527"),
      uiBackgroundColor: ColorHEX("#29282b"),
      uiBorderColor: ColorHEX("ffffff"),
      fontFamily: "Verdana",
      isDark: true,
    });
    const lc = lightningChart();
    const dash = lc
      .Dashboard({
        webgl: "webgl2",
        container: id,
        theme: flatDarkTheme,
        numberOfColumns: 2,
        numberOfRows: 2,
        disableAnimations: true,
        textPixelSnappingEnabled: false,
      })
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX("#2F2E30") }))
      .setColumnWidth(0, 1)
      .setColumnWidth(1, 0.2)
      .setRowHeight(0, 1)
      .setRowHeight(1, 0.3)
      .setSplitterStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX("#29282B") }),
        })
      );
    const chartSpectrogram = dash
      .createChartXY({
        columnIndex: 0,
        rowIndex: 0,
      })
      .setTitle("히트맵")
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX("#2F2E30") }))
      .setSeriesBackgroundFillStyle(
        new SolidFill({ color: ColorHEX("#2F2E30") })
      )
      .setSeriesBackgroundStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX("262527") }),
        })
      );
     
    const chartProjectionY = dash
      .createChartXY({
        columnIndex: 1,
        rowIndex: 0,
        disableAnimations: true,
      })
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX("#2F2E30") }))
      .setSeriesBackgroundFillStyle(
        new SolidFill({ color: ColorHEX("#2F2E30") })
      )
      .setSeriesBackgroundStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX("262527") }),
        })
      )
      .setTitleFillStyle(emptyFill)
      .setPadding({ top: 44 })
      .setMouseInteractions(false);
    chartProjectionY
      .getDefaultAxisY()
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
    synchronizeAxisIntervals(
      chartSpectrogram.getDefaultAxisY(AxisScrollStrategies.fitting),
      chartProjectionY.getDefaultAxisY(AxisScrollStrategies.fitting)
    );
    chartProjectionY
      .getDefaultAxisX()
      .setTickStrategy((tickStrategy) =>
        tickStrategy
          .setNumericUnits(true)
          .setMajorTickStyle((tickStyle) =>
            tickStyle.setLabelFont((font) => font.setColor(ColorCSS("white")))
          )
      )
      .setTitleFont((fontSettings) => fontSettings.setSize(50))
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval({ start: 0, end: 1, stopAxisAfter: 1 })
      .setMouseInteractions(false);
   
    
    const chartProjectionX = dash
      .createChartXY({
        columnIndex: 0,
        rowIndex: 1,
      })
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX("#2F2E30") }))
      .setSeriesBackgroundFillStyle(
        new SolidFill({ color: ColorHEX("#2F2E30") })
      )
      .setSeriesBackgroundStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX("262527") }),
        })
      )
      .setTitleFillStyle(emptyFill);
  
    chartProjectionX.getDefaultAxisX().setScrollStrategy(undefined).setMouseInteractions(false);
    chartProjectionX
      .getDefaultAxisY()
      .setScrollStrategy(AxisScrollStrategies.fitting)
      .setInterval({ start: 0, end: 1, stopAxisAfter: false })
      .setMouseInteractions(false);
    synchronizeAxisIntervals(
      chartSpectrogram
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.fitting),
      chartProjectionX
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.fitting)
    );

    //   const chart3d=dash.createChart3D({
    //     columnIndex: 1,
    //     rowIndex: 1,
    // })
    // .setTitle('3d')

    const chartY = chartProjectionY
      .addLineSeries({
        dataPattern: {
          pattern: "ProgressiveY",
          regularProgressiveStep: true,
          allowDataGrouping: true,
        },
      })
      .setName("차트 Y").setCursorSolveBasis('nearest-y');
    const chartX = chartProjectionX
      .addLineSeries({
        dataPattern: {
          pattern: "ProgressiveX",
          regularProgressiveStep: true,
          allowDataGrouping: true,
        },
      })
      .setName("차트 X").setCursorSolveBasis('nearest');
    // Store references to chart components.
   
  // chartSpectrogram.onSeriesBackgroundMouseMove((e) => {
  // // console.log('ee',e.pixelScale)
  // })
  // const theme = Themes.light;

  // chartRef.current = { chartSpectrogram,chartY, chartX };
 
  //  console.log('tempheat',tempHeat)\
//   const lut = new LUT({
//     interpolate: true,
//     steps: regularColorSteps(-120,-50,theme.examples.intensityColorPalette),
// })
  // const heat=   chartSpectrogram.addHeatmapGridSeries({

  //   columns:col,
  //   rows: 2048*4,
  // })
  // .setMouseInteractions(true)
  // .setWireframeStyle(emptyLine)
  // .setFillStyle(
  //   new PalettedFill({
  //     lookUpProperty: "value",
  
  //     lut:lut
  //   })
  // );
    chartRef.current = {  chartSpectrogram,chartY, chartX };
    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log("destroy chart");
      chartSpectrogram.dispose();
      dash.dispose();
      chartRef.current = undefined;
    };
  }, [id]);

  useEffect(() => {
   if (!started)return;
    const components = chartRef.current;
    if (!components) return;
    const { chartSpectrogram, chartY, chartX } = components;
    const tempHeat = [];
    for (let i = 0; i < data.length; i++) {
      const tempYvals = data[i].map((val) => val.y);
      tempHeat.push(tempYvals);
    }
    console.log('hhhhhhhh',tempHeat)
    // const theme = Themes.light;

  // chartRef.current = { chartSpectrogram,chartY, chartX };

  const theme = Themes.light;

  const lut = new LUT({
    interpolate: true,
    steps: regularColorSteps(-120,-50,theme.examples.intensityColorPalette),
})
 const heat=   chartSpectrogram.addHeatmapGridSeries({

     columns:col,
     rows: 2048*4,
   })
   .setMouseInteractions(true)
   .setWireframeStyle(emptyLine)
   .setFillStyle(
     new PalettedFill({
       lookUpProperty: "value",
   
       lut:lut
     })
   );
   console.log('tempheat',tempHeat)
// surfaceSeries3D.dispose();
// chart3d.dispose();
console.log('클리어안됨',tempHeat)
// heat.clear();
heat.invalidateIntensityValues(tempHeat);

    const yVals = [];
    const xVals = [];
    // for (let i = 0; i < tempHeat.length; i++) {
    if (tempHeat.length > 0) {
      const lastIdx = tempHeat.length - 1;//좌표값가져와서 넣어주면 됨...
      const lastYvalues = tempHeat[lastIdx];//호버하면 좌표값 받아와서 바뀜
      console.log('마지막 y', lastYvalues)
      for (let i = 0; i < lastYvalues.length; i++) {
        yVals.push({ x: lastYvalues[i], y: i });
      }
      console.log('yVals', yVals)
      const lastXIdx=3;
      for (let i = 0; i < tempHeat.length; i++) {
        // for (let j = 0; j < tempHeat[i].length; j++) {
          
          xVals[i] = { x: i, y: tempHeat[i][lastXIdx] };
        // }
      }
    }
console.log('xVals', xVals)
    console.log("yVals", yVals);
    chartY.clear();
    if (yVals.length > 0) {
      chartY.add(yVals);
    }
    chartX.clear();
    if (xVals.length > 0) {
      chartX.add(xVals);
    }
   
    console.log('xxxx',xxxx)
    xxxx=1;
   
      // chartRef.current={chartSpectrogram}

   
  //     // showProjection(locationAxis.x, locationAxis.y)
  // })  
  // chartRef.current = { chartSpectrogram };
  return () => {
    // Destroy chart.
    console.log("destroy chart");
  
  };
  }, [data, chartRef,started]);

  return (
    <div id={id} ref={chartRef}  style={{ width: "100%", height: "80%" }} ></div>
  );
}
