import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import PaperTitle from "../../components/PaperTitle";
import { arrayRemove, getTokenPayload } from "../../utils/Utility";
import { Popup, SpecialroomInfoPanel } from "../../components";
import { getSpecialroomInfo, putSpecialroomInfo } from "../../utils/Api";
import { v1 } from "@common-jshs/menkakusitsu-lib";
import { DialogTitle } from "../../utils/Constants";

interface InfoCellProps {
  state: number;
  information: v1.SpecialroomInfo[];
  setInformation: React.Dispatch<React.SetStateAction<v1.SpecialroomInfo[]>>;
}

function InfoCell(props: InfoCellProps) {
  const { state, information, setInformation } = props;

  const payload = getTokenPayload();

  let count = 0;
  const final: v1.SpecialroomInfo[] = [];
  const result = (
    <>
      <Stack direction="column" justifyContent="center" alignItems="flex-start">
        {information.map((information) => {
          if (information.state === state) {
            count++;
            return (
              <Tooltip
                placement="left-start"
                key={information.applyId}
                title={
                  <Box sx={{ textAlign: "left" }}>
                    <Typography>
                      {`신청자: ${information.master.name}`}
                    </Typography>
                    <Typography>
                      {`신청 명단: ${information.applicants} - 총 ${
                        information.applicants.split(",").length
                      }인`}
                    </Typography>
                    <Typography>
                      {`신청 장소: ${information.location}`}
                    </Typography>
                    <Typography>
                      {`신청 시간: ${information.when}차 면학`}
                    </Typography>
                  </Box>
                }
                arrow
              >
                <FormControlLabel
                  label={information.purpose}
                  control={
                    <Checkbox
                      color="secondary"
                      onChange={(event) => {
                        if (event.target.checked) {
                          final.push(information);
                        } else {
                          arrayRemove(final, information);
                        }
                      }}
                    />
                  }
                />
              </Tooltip>
            );
          }
        })}
      </Stack>
      <Box sx={{ textAlign: "center" }}>
        <ButtonGroup variant="contained">
          {state !== 1 && (
            <Button
              color="success"
              onClick={() => {
                Popup.startLoading("처리 중입니다...");
                putSpecialroomInfo({
                  information: final.map((information) => {
                    information.state = 1;
                    return information;
                  }),
                }).then((result) => {
                  Popup.stopLoading();
                  setInformation(
                    result.information.filter(
                      (info) => info.teacher.uid == payload?.uid
                    )
                  );
                });
              }}
            >
              승인
            </Button>
          )}
          {state !== -1 && (
            <Button
              color="error"
              onClick={() => {
                Popup.startLoading("처리 중입니다...");
                putSpecialroomInfo({
                  information: final.map((information) => {
                    information.state = -1;
                    return information;
                  }),
                }).then((result) => {
                  Popup.stopLoading();
                  setInformation(
                    result.information.filter(
                      (info) => info.teacher.uid == payload?.uid
                    )
                  );
                });
              }}
            >
              거부
            </Button>
          )}
        </ButtonGroup>
      </Box>
    </>
  );
  if (count === 0) {
    return <Alert severity="info">남은 항목이 없습니다!</Alert>;
  }
  return result;
}
function Management() {
  const [information, setInformation] = useState<v1.SpecialroomInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const payload = getTokenPayload();

  useEffect(() => {
    getSpecialroomInfo({}).then((result) => {
      setInformation(
        result.information.filter((info) => info.teacher.uid == payload?.uid)
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box sx={{ padding: "50px 30px 30px 30px" }}>
            <PaperTitle>특별실 신청 관리</PaperTitle>
            <SpecialroomInfoPanel
              filter={(info) => info.teacher.uid == payload?.uid}
            />
            <Stack spacing={2} direction="row" sx={{ marginTop: "32px" }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  border: "1px dashed grey",
                  width: "50%",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">특별실 신청 내역</Typography>
                <br />
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <InfoCell
                    state={0}
                    information={information}
                    setInformation={setInformation}
                  />
                )}
              </Box>
              <Stack
                spacing={2}
                direction="column"
                sx={{
                  width: "50%",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    border: "1px dashed grey",
                    width: "100%",
                  }}
                >
                  <Typography variant="h5">승인된 신청</Typography>
                  <br />
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <InfoCell
                      state={1}
                      information={information}
                      setInformation={setInformation}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    border: "1px dashed grey",
                    width: "100%",
                  }}
                >
                  <Typography variant="h5">거부된 신청</Typography>
                  <br />
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <InfoCell
                      state={-1}
                      information={information}
                      setInformation={setInformation}
                    />
                  )}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Management;
