import { Box, Container, HStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { VictoryPie } from "victory";
import client from "../../utils/client";

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

  return (
    <Container>
      <HStack>
        <Box>
          <VictoryPie data={countryArray} colorScale="qualitative" />
        </Box>
      </HStack>
    </Container>
  );
};

export default VisitsHistogram;
