import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { generateBaseCircles, BaseCircles } from "./utils";
import useRadarComponent from "./hooks/useRadarComponent";

function RadarComponent({ sections,targets, onClick, config }) {
  const {
    radius = 200,
    numCircles = 9,
    colorCircles = "green",
    numLines = 24,
    opacityLines = 0.3,
    strokeLines = 1,
    colorLines = "green",
    north = "N",
    northColor = "rgb(9, 115, 9)",
    northFontSize = (radius) => (radius*0.06),
    opacity = 0.4,

    sectionLabelFontSize = (radius) => radius * 0.06,
    sectionLabelFontWeight = "bold",
    sectionLabelDefaultColor = "rgb(100, 100, 100)",
    sectionLabelSelectedColor = "whitesmoke",
    selectedSectiondropShadowFilter = "drop-shadow(0px 1.5px 1.5px rgba(0, 0, 0, 0.6))",
    unSelectedSectiondropShadowFilter = "drop-shadow(0px 1.5px 1.5px rgba(0, 0, 0, 0.5))",
    sectionRectWidth = (radius) => radius * 0.08,
    sectionRectHeight = (radius) => radius * 0.08,
    sectionBorderStroke = (radius) => radius * 0.01,
    sectionStrokeColor = "white",
    sectionRecBorderSrtoke = (radius) => radius * 0.005,
    unselecteSectionRecColor = "white",
    selectedSectionRecBorderColor = "black",
    unselectedSectionRecBorderColor = "black",
    unSelectedSectionLabelShadow = "drop-shadow(0px 0px 0.7px rgba(0, 0, 0, 1))",

    pointLabelFontSize = (radius) => radius * 0.06,
    pointLabelFontWeight = "bold",
    pointLabelTextColor = "whitesmoke",
    pointLabelTextShadow = "0 0 1px black, 0 0 1px black",
    pointRectWidth = (radius) => radius * 0.04,
    pointRectHeight = (radius) => radius * 0.04,
    pointBorderStroke = 1.4,
    selectedPointRectborderShadow = (color) =>
      `drop-shadow(0px 0px 3px ${color})`,
    unSelectedPointRectborderShadow = "drop-shadow(0px 1.5px 1.5px rgba(0, 0, 0, 0.5))",
    selectedPointStrokeColor = "white",
    pointRectRx = (radius) => radius * 0.08,
    pointRectRy = (radius) => radius * 0.08,
  } = config;

  const baseCircles = generateBaseCircles(numCircles, colorCircles);
  const {
    handleSectionClick,
    handleTargetsClick,
    targetsData,
    sectionsData,
    width,
    height,
  } = useRadarComponent(sections,targets, onClick, radius);
  const svgRef = useRef(null);

  const styles = {
    body: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "calc(10px + 2vmin)",
    },
  };

  useEffect(() => {
    // Seleccionar el elemento SVG a través de la referencia y establecer sus atributos de ancho y alto
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Generar circulos
    BaseCircles({ svg, radius, baseCircles });

    // Definir ángulos para las líneas desde el centro hasta el radio máximo
    const lineAngles = d3
      .range(numLines)
      .map((i) => ((i * 360) / numLines) * (Math.PI / 180));

    // Dibujar líneas desde el centro hasta el radio especificado
    lineAngles.forEach((angle) => {
      const x2 = Math.cos(angle) * radius;
      const y2 = Math.sin(angle) * -radius+1.5;

      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", colorLines)
        .attr("stroke-width", strokeLines)
        .attr("opacity", opacityLines);
    });
    // Crear un generador de pie
    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    if (sectionsData) {
      // Seleccionar todos los grupos "arc" y enlazar los datos para las secciones
      const sections = svg
        .selectAll(".arc")
        .data(pie(sectionsData))
        .enter()
        .append("g");

      // Definir un generador de arco para las secciones
      const path = d3
        .arc()
        .outerRadius((d) => d.data.outerRadius * radius)
        .innerRadius((d) => d.data.innerRadius * radius)
        .startAngle((d) =>
          d.data.startAngle > d.data.endAngle
            ? (d.data.startAngle - 360) * (Math.PI / 180)
            : d.data.startAngle * (Math.PI / 180)
        )
        .endAngle((d) => d.data.endAngle * (Math.PI / 180));

      // Agregar elementos de tipo "path" para las secciones
      sections
        .append("path")
        .attr("d", path)
        .attr("fill", (d) => d.data.color)
        .attr("fill-opacity", opacity)
        .style("cursor", "pointer")
        .style("filter", (d) =>
          d.data.selected
            ? selectedSectiondropShadowFilter
            : unSelectedSectiondropShadowFilter
        )
        .attr("stroke", (d) =>
          d.data.selected ? sectionStrokeColor : d.data.color
        )
        .attr("stroke-width", sectionBorderStroke(radius));

      // Agregar rectángulos como fondo para las etiquetas de las secciones
      sections
        .append("rect")
        .attr("x", (d) => {
          const centroid = path.centroid(d);
          return centroid[0] - (radius * 0.058);
        })
        .attr("y", (d) => {
          const centroid = path.centroid(d);
          return centroid[1] - (radius * 0.054);
        })
        .attr("width", sectionRectWidth(radius))
        .attr("height", sectionRectHeight(radius))
        .attr("fill", (d) =>
          d.data.selected ? unselecteSectionRecColor : d.data.color
        )
        .attr("rx",(radius*0.02) )
        .attr("ry", (radius*0.02))
        .style("cursor", "pointer")
        .attr("stroke", (d) =>
          d.data.selected
            ? selectedSectionRecBorderColor
            : unselectedSectionRecBorderColor
        )
        .attr("stroke-width", sectionRecBorderSrtoke(radius));

      // Agregar elementos de texto para las etiquetas de las secciones
      sections
        .append("text")
        .attr("transform", (d) => {
          const centroid = path.centroid(d);
          return `translate(${centroid})`;
        })
        .attr("dy", "0.1em")
        .attr("dx", "-0.3em")
        .text((d) => d.data.label)
        .style("cursor", "pointer")
        .style("text-anchor", "middle")
        .style("font-size", sectionLabelFontSize(radius))
        .style("font-weight", sectionLabelFontWeight)
        .style("fill", (d, i) =>
          d.data.selected ? sectionLabelDefaultColor : sectionLabelSelectedColor
        )
        .style("filter", (d) =>
          d.data.selected ? "" : unSelectedSectionLabelShadow
        );

      // Establecer manejadores de eventos de clic para las secciones y los puntos
      sections.on("click", handleSectionClick);
    }
    if (targetsData) {
      // Definir un generador de arco para los puntos
      const pathPoint = d3
        .arc()
        .outerRadius((d) => d.data.radius * radius)
        .innerRadius((d) => d.data.radius * radius)
        .startAngle((d) => d.data.angle * (Math.PI / 180))
        .endAngle((d) => d.data.angle * (Math.PI / 180));

      // Seleccionar todos los grupos "arc" y enlazar los datos para los puntos
      const point = svg
        .selectAll(".arc")
        .data(pie(targetsData))
        .enter()
        .append("g");

      // Agregar elementos de tipo "path" para los puntos
      point
        .append("path")
        .attr("d", pathPoint)
        .attr("fill", (d) => (d.selected ? d.data.color : "transparent"))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      // Agregar rectángulos como fondo para las etiquetas de los puntos
      point
        .append("rect")
        .attr("x", (d) => {
          const centroid = pathPoint.centroid(d);
          return centroid[0] - 3;
        })
        .attr("y", (d) => {
          const centroid = pathPoint.centroid(d);
          return centroid[1] - 3;
        })
        .attr("width", pointRectWidth(radius))
        .attr("height", pointRectHeight(radius))
        .style("filter", (d) =>
          d.data.selected
            ? selectedPointRectborderShadow(d.data.color)
            : unSelectedPointRectborderShadow
        )
        .attr("fill-opacity", (d) => (d.data.selected ? "1" : "0.7"))
        .attr("fill", (d) => d.data.color)
        .attr("rx", pointRectRx(radius))
        .attr("ry", pointRectRy(radius))
        .style("cursor", "pointer")
        .attr("stroke", (d) =>
          d.data.selected ? selectedPointStrokeColor : d.data.color
        )
        .attr("stroke-width", pointBorderStroke);

      // Agregar elementos de texto para las etiquetas de los puntos
      point
        .append("text")
        .attr("transform", (d) => {
          const centroid = pathPoint.centroid(d);
          return `translate(${centroid})`;
        })
        .attr("dy", "0.34em")
        .attr("dx", (radius*0.05))
        .text((d) => d.data.label)
        .style("font-size", pointLabelFontSize(radius))
        .style("text-shadow", pointLabelTextShadow)
        .style("font-weight", pointLabelFontWeight)
        .style("cursor", "pointer")
        .style("fill", pointLabelTextColor);
      point.on("click", handleTargetsClick);
    }

    // Función de limpieza para eliminar todos los elementos del SVG al desmontar el componente
    return () => {
      svg.selectAll("*").remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetsData, sectionsData]);

  return (
    <>
      <div style={styles.body} id="chart">
        <span style={{ color: northColor, fontSize: northFontSize(radius) }}>
          {north}
        </span>
        <svg width="800px" ref={svgRef}></svg>
      </div>
    </>
  );
}
RadarComponent.defaultProps = {
  config: {},
};
export default RadarComponent;
