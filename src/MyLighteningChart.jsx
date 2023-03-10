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

const historyMs = 50;
const sampleRateHz = 35;

export default function MyLighteningChart(props) {
  const { data, id, viewLength, arrayLength } = props;
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
      .setColumnWidth(0, 0.5)
      .setColumnWidth(1, 0.5)
      .setRowHeight(0, 0.5)
      .setRowHeight(1, 0.5)
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
      .setPadding({ top: 44 });
    // .setMouseInteractions(false);
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
    const chart3d = dash
      .createChart3D({
        columnIndex: 1,
        rowIndex: 1,
      })
      .setTitle("3d");
    chart3d
      .getDefaultAxisX(AxisScrollStrategies.progressive)
      .setInterval({ start: 0, end: viewLength, stopAxisAfter: false });
    chart3d
      .getDefaultAxisY(AxisScrollStrategies.progressive)
      .setInterval({ start: 0, end: 8192, stopAxisAfter: false });
    chartProjectionY
      .getDefaultAxisY()
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
    // chartSpectrogram.getDefaultAxisY().setTitle("Frequency (Hz)");
    synchronizeAxisIntervals(
      chartSpectrogram
        .getDefaultAxisY(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: 8192, stopAxisAfter: false }),
      chartProjectionY
        .getDefaultAxisY(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: 8192, stopAxisAfter: false })
    );
    chartProjectionY
      .getDefaultAxisX()
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
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
      .setInterval({ start: 0, end: -120, stopAxisAfter: true })
      .setMouseInteractions(false);

    chartProjectionX
      .getDefaultAxisX()
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
    chartProjectionX
      .getDefaultAxisY()
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval({ start: -120, end: 0, stopAxisAfter: false })
      .setMouseInteractions(false);
    chartSpectrogram
      .getDefaultAxisX()
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval({ start: 0, end: viewLength, stopAxisAfter: false });
    synchronizeAxisIntervals(
      chartSpectrogram
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: viewLength, stopAxisAfter: false }),
      chartProjectionX
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: viewLength, stopAxisAfter: false })
    );
    const chartY = chartProjectionY
      .addLineSeries({
        dataPattern: {
          pattern: "ProgressiveY",
          regularProgressiveStep: true,
          allowDataGrouping: true,
        },
      })
      .setName("차트 Y")
      .setCursorSolveBasis("nearest-y");
    const chartX = chartProjectionX
      .addLineSeries({
        dataPattern: {
          pattern: "ProgressiveX",
          regularProgressiveStep: true,
          allowDataGrouping: true,
        },
      })
      .setName("차트 X")
      .setCursorSolveBasis("nearest");

    // chartSpectrogram.onBackgroundMouseClick();
    const theme = Themes.light;

    const lut = new LUT({
      interpolate: true,
      units: "dB",
      steps: regularColorSteps(-120, -50, theme.examples.intensityColorPalette),
    });
    chartSpectrogram
      .getDefaultAxisX()
      .setTickStrategy(AxisTickStrategies.Numeric, (strategy) =>
        strategy
          .setMinorFormattingFunction(
            (tickPosition) =>
              `${tickPosition
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}s`
          )
          .setMajorFormattingFunction(
            (tickPosition) =>
              `${tickPosition
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}s`
          )
          .setCursorFormatter((value) => {
            return `${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}s`;
          })
      );
    const surfaceSeries3D = chart3d
      .addSurfaceScrollingGridSeries({
        scrollDimension: "columns",
        columns: viewLength,
        rows: arrayLength,
        // step: { x: 1, z: 1 },
      })
      // .setMouseInteractions(true)
      .setWireframeStyle(emptyLine)
      .setFillStyle(
        new PalettedFill({
          lookUpProperty: "y",
          lut: lut,
        })
      );
    chartRef.current = {
      chartSpectrogram,
      lut,
      chartX,
      chartY,
      surfaceSeries3D,
    };

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
    const components = chartRef.current;
    if (!components) return;
    if (data.length === 0) return;
    const { chartSpectrogram, lut, chartX, chartY, surfaceSeries3D } =
      components;
    const heat = chartSpectrogram
      .addHeatmapGridSeries({
        columns: data.length,
        rows: arrayLength,
      })
      .setMouseInteractions(true)
      .setWireframeStyle(emptyLine)
      .setFillStyle(
        new PalettedFill({
          lookUpProperty: "value",
          lut: lut,
        })
      );
    heat.onMouseClick((t, ev) => {
      try {
        const m = chartSpectrogram.engine.clientLocation2Engine(
          ev.clientX,
          ev.clientY
        );
        const onScale = chartSpectrogram.solveNearest(m).location;
        const yValIndex = Math.round(onScale.x);
        const yVals = data[yValIndex].map((v, i) => {
          return { x: v, y: i };
        });
        chartY.clear().add(yVals);
        const xValIndex = Math.round(onScale.y);
        const xVals = data.map((v, i) => {
          return { x: i, y: v[xValIndex] };
        });
        chartX.clear().add(xVals);
      } catch {}
    });
    heat.invalidateIntensityValues(data);

    const yValIndex = data.length - 1;
    const yVals = data[yValIndex].map((v, i) => {
      return { x: v, y: i };
    });
    chartY.clear().add(yVals);
    const xValIndex = data[0].length - 1;
    const xVals = data.map((v, i) => {
      return { x: i, y: v[xValIndex] };
    });
    chartX.clear().add(xVals);

    surfaceSeries3D.addValues({ yValues: [data[yValIndex]] });
    console.log(data.length);
    return () => {
      // Destroy chart.
      // console.log("destroy chart");
    };
  }, [data, chartRef, viewLength]);

  return (
    <div
      id={id}
      ref={chartRef}
      style={{ width: "500px", height: "700px", display: "inline-block" }}
      // style={{ width: "300px", height: "300px", display: "inline-block" }}
    ></div>
  );
}
