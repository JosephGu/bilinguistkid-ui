"use client";

import { useEffect, useRef } from "react";
import { geoOrthographic, GeoPath, geoPath, GeoProjection } from "d3-geo";
import { select, Selection } from "d3-selection";
import { drag, DragBehavior } from "d3-drag";
import { zoom } from "d3-zoom";
import { Timer, timer } from "d3-timer";
import { Feature, FeatureCollection } from "geojson";

const RotatingEarth = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadGeoData = async () => {
    try {
      const response = await fetch("/countries.geo.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const geoJsonData: FeatureCollection = await response.json();
      return geoJsonData;
    } catch (error) {
      console.error("Failed to load geoJSON data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const COLOR_NO_DATA = "#1A73E8";
    const COLOR_HOVER = "#FFCB05";
    const COLOR_CONTINENT = "#34A853";
    const ROTATION_SENSITIVITY = 60;
    const ZOOM_SENSITIVITY = 0.5;

    // 获取容器尺寸
    const container = select(containerRef.current);
    const width = container?.node()?.getBoundingClientRect().width || 0;
    const height = container?.node()?.getBoundingClientRect().height || 0;
    const radius = height ? height / 2.8 : 0;
    const center: [number, number] = [width / 2, height / 2];

    // 投影设置
    const projection = geoOrthographic()
      .scale(radius)
      .center([0, 0])
      .rotate([0, -25])
      .translate(center);

    const path = geoPath().projection(projection);

    container.selectAll("*").remove();

    const svg = container
      .append("svg")
      .attr("width", width || 0)
      .attr("height", height || 0);

    svg
      .append("circle")
      .attr("id", "globe")
      .attr("cx", width ? width / 2 : 0)
      .attr("cy", height ? height / 2 : 0)
      .attr("r", projection.scale())
      .style("fill", COLOR_NO_DATA)
      .style("stroke", "#000")
      .style("stroke-width", 1);

    loadGeoData().then((geoData) => {
      if (!geoData) return;

      svg
        .append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", (d: Feature) => path(d as Feature))
        .style("fill", COLOR_CONTINENT)
        .style("stroke", "#000")
        .style("stroke-width", 2)
        .style("transform", "translateY(-2px)")
        .on("mouseover", function (event, d) {
          console.log(d);
          if (d && d.id) {
            select(this).style("fill", COLOR_HOVER);
          }
        })
        .on("mouseout", function () {
          select(this).style("fill", COLOR_CONTINENT);
        });

      initInteractions(svg, projection, path);
    });

    function initInteractions(
      svg: Selection<SVGSVGElement, unknown, null, undefined>,
      projection: GeoProjection,
      path: GeoPath
    ) {
      // let rotationTimer: Timer | null = null;
      const initialScale = projection.scale();

      const createDrag: () => DragBehavior<
        SVGSVGElement,
        unknown,
        unknown
      > = () => {
        return drag<SVGSVGElement, unknown>()
          // .on("start", () => {
            // if (rotationTimer) rotationTimer.stop();
          // })
          .on("drag", (event) => {
            const rotate = projection.rotate();
            const rotationAdjustmentFactor =
              ROTATION_SENSITIVITY / projection.scale();

            projection.rotate([
              rotate[0] + event.dx * rotationAdjustmentFactor,
              rotate[1] - event.dy * rotationAdjustmentFactor,
            ]);

            svg.selectAll("path").attr("d", (d: unknown) => path(d as Feature));
          })
          // .on("end", () => {
          //   rotateGlobe();
          // });
      };

      // const rotateGlobe = () => {
      //   if (rotationTimer) rotationTimer.stop();
      //   rotationTimer = timer(() => {
      //     const rotate = projection.rotate();
      //     const rotationAdjustmentFactor =
      //       ROTATION_SENSITIVITY / projection.scale();
      //     projection.rotate([
      //       rotate[0] - 1 * rotationAdjustmentFactor,
      //       rotate[1],
      //     ]);
      //     svg.selectAll("path").attr("d", (d: unknown) => path(d as Feature));
      //   });
      // };

      const configureZoom = () => {
        svg.call(
          zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
            if (event.transform.k > ZOOM_SENSITIVITY) {
              const newScale = initialScale * event.transform.k;
              projection.scale(newScale);
              svg
                .selectAll("path")
                .attr("d", (d: unknown) => path(d as Feature));
              svg.selectAll("#globe").attr("r", projection.scale());
            }
          })
        );
      };

      const handleResize = () => {
        const newWidth = container.node()?.getBoundingClientRect()?.width || 0;
        const newHeight =
          container.node()?.getBoundingClientRect()?.height || 0;
        const newRadius = newHeight ? newHeight / 2.8 : 0;
        const newCenter: [number, number] = [
          newWidth ? newWidth / 2 : 0,
          newHeight ? newHeight / 2 : 0,
        ];

        svg.attr("width", newWidth).attr("height", newHeight);

        projection.scale(newRadius).translate(newCenter);

        svg.selectAll("path").attr("d", (d: unknown) => path(d as Feature));
        svg
          .select("#globe")
          .attr("cx", newWidth / 2)
          .attr("cy", newHeight / 2)
          .attr("r", projection.scale());
      };

      svg.call(createDrag());
      configureZoom();
      // rotateGlobe();

      window.addEventListener("resize", handleResize);

      return () => {
        // if (rotationTimer) rotationTimer.stop();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div
      id="globe-container"
      ref={containerRef}
      style={{ width: "100%", height: "600px" }}
    />
  );
};

export default RotatingEarth;
