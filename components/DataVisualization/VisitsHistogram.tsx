import { Box, Container, HStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
// import { VictoryPie } from "victory";
import * as d3 from "d3";
import { arc, pie } from "d3";
import client from "../../client";

const VisitsHistogram = ({ idLink }) => {
  const { data, isLoading, isError } = useQuery(
    ["visitsByCountry", idLink],
    async () => await client.get(`/Visit/getVisitsByCountry?idLink=${idLink}`)
  );

  const [countryArray, setCountryArray] = useState([]);

  useEffect(() => {
    if (data) {
      const countries = data.data.map((visit) => {
        return {
          y: visit._count._all,
          x: visit.country,
          label: visit.country + ": " + visit._count._all,
        };
      });
      setCountryArray(countries);
    }
  }, [data]);

  useEffect(() => {
    // Function to render the d3 PieChart
    const renderPieChart = () => {
      const pieChartContainer = document.getElementById("pieChartContainer");
      const width = pieChartContainer.clientWidth;
      const height = 300;
      const radius = Math.min(width, height) / 2;

      const svg = d3
        .select(pieChartContainer)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      const pieData = pie().value((d) => d.y)(countryArray);
      const arcPath = arc()
        .innerRadius(0)
        .outerRadius(radius);

      const arcs = svg
        .selectAll("arc")
        .data(pieData)
        .enter()
        .append("g");

      arcs
        .append("path")
        .attr("d", arcPath)
        .attr("fill", (d, i) => colorScale(i));

      arcs
        .append("text")
        .attr("transform", (d) => `translate(${arcPath.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text((d) => d.data.label);
    };

    renderPieChart();

    return () => {
      // Cleanup function to remove the chart when the component is unmounted
      const pieChartContainer = document.getElementById("pieChartContainer");
      pieChartContainer.innerHTML = "";
    };
  }, [countryArray]);


  return (
    <Container>
      <HStack>
        <Box id="pieChartContainer" width="100%" height="300px"/>
        {/* <Box>
          {/* <VictoryPie data={countryArray} colorScale="qualitative" /> */}
        {/* </Box> */}
      </HStack>
    </Container>
  );
};

export default VisitsHistogram;
