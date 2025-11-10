import { Box } from "@mui/material";

import { Typography } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const LexiconReport = ({
  helpedList,
  originalList,
}: {
  helpedList: string[] | [];
  originalList: string[] | [];
}) => {
  const helpedSize = helpedList.length;
  const originalSize = originalList.length;
  const recognizedSize = originalSize - helpedSize;

  return (
    <Box className="sm:w-[300px] md:w-[500px] lg:w-[500px]">
      {helpedSize === 0 ? (
        <Typography variant="body1">Congratulations!</Typography>
      ) : (
        <Box>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: "pie",
              },
              title: {
                text: `Your Score: ${(
                  (recognizedSize / originalSize) *
                  100
                ).toFixed(0)}`,
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: "pointer",
                  dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                  },
                },
              },
              series: [
                {
                  name: "Share",
                  colorByPoint: true,
                  type: "pie",
                  data: [
                    {
                      name: "Unfamiliar",
                      y: helpedSize,
                    },
                    {
                      name: "Familiar",
                      y: originalSize - helpedSize,
                    },
                  ],
                },
              ],
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default LexiconReport;
