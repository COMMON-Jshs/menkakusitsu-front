import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { getDayInfo, getParameter } from "../../utils/Utility";
import { getAttendanceList, getSpecialroomInfo } from "../../utils/Api";
import { v1 } from "@common-jshs/menkakusitsu-lib";
import { InfoTable } from "../../components/panel/SpecialroomInfoPanel";
import {
  setFooterActive,
  setHeaderActive,
} from "../../components/router/RouteWrapper";
import { setParticleActive } from "../../components/particles";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Row(props: any) {}

const parseAttendanceList = (list: string[][]) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {list.map((row, i) => {
              return (
                <StyledTableRow key={i}>
                  {row.map((col, j) => {
                    if (col === "|") {
                      return <TableCell key={`${i}_${j}`}></TableCell>;
                    } else {
                      return (
                        <TableCell key={`${i}_${j}`} align="center">
                          {col}
                        </TableCell>
                      );
                    }
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

function Download() {
  const [attendanceInfo, setAttendanceInfo] =
    useState<v1.AttendanceList | null>(null);
  const [information, setInformation] = useState<v1.SpecialroomInfo[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const when = parseInt(getParameter("when", "1"));

  useEffect(() => {
    getAttendanceList({ when: when }).then((result) => {
      setAttendanceInfo(result.list);
      getSpecialroomInfo({}).then((result) => {
        setInformation(result.information);
        setIsLoading(false);
      });
    });

    setHeaderActive(false);
    setFooterActive(false);
    setParticleActive(false);
    return () => {
      setHeaderActive(true);
      setFooterActive(true);
      setParticleActive(true);
    };
  }, [when]);

  useEffect(() => {
    if (!isLoading) {
      window.print();
    }
  }, [isLoading]);

  const { year, month, date } = getDayInfo();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            paddingTop: "30px",
            fontSize: "32px",
            fontWeight: 200,
          }}
        >
          {`${year}년 ${month}월 ${date}일 ${when}차 면학 출석부`}
        </Typography>
        <Box sx={{ paddingBottom: "192px" }}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 50,
            }}
          >
            1~2학년 면학실(3학년은 2페이지에)
          </Typography>
          {attendanceInfo && parseAttendanceList(attendanceInfo.big)}
        </Box>
        <br />
        <Box sx={{ paddingBottom: "64px" }}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 50,
            }}
          >
            3학년 면학실
          </Typography>
          {attendanceInfo && parseAttendanceList(attendanceInfo.small)}
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 50,
            }}
          >
            특별실 신청 현황
          </Typography>
          <InfoTable
            information={information}
            isLoading={isLoading}
            filter={(specialroomInfo) => specialroomInfo.when === when}
          />
        </Box>
      </Box>
    </>
  );
}

export default Download;
