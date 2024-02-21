import { TokenPayload, v1 } from "@common-jshs/menkakusitsu-lib";
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
} from "@mui/material";
import { useState, useEffect } from "react";

import Popup from "@/components/popup";
import { Api, Utility } from "@/utils";
import { Text, TitleText } from "@/components/basics";
import { SpecialroomInfoPanel } from "@/components/panels/SpecialroomInfoPanel";

export default function ManagementScreen() {
  const [information, setInformation] = useState<v1.SpecialroomInfo[]>([]);
  const [payload] = useState<TokenPayload | null>(Utility.getTokenPayload());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Api.getSpecialroomInfo({}).then((result) => {
      setInformation(
        result.information.filter((info) => info.teacher.uid == payload?.uid)
      );
      setIsLoading(false);
    });
  }, [payload]);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box
            sx={{
              padding: "50px 30px 30px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TitleText color="secondary" variant="h2">
              특별실 신청 관리
            </TitleText>
            <SpecialroomInfoPanel
              filter={(info) => info.teacher.uid == payload?.uid}
            />
            <Stack
              spacing={2}
              direction="row"
              useFlexGap
              flexWrap="wrap"
              mt="32px"
              sx={{ width: "100%" }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  border: "1px dashed grey",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text variant="h4">특별실 신청 내역</Text>
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
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  border: "1px dashed grey",
                  flex: 1,
                }}
              >
                <Text variant="h5">승인된 신청</Text>
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
                  flex: 1,
                }}
              >
                <Text variant="h5">거부된 신청</Text>
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
          </Box>
        </Paper>
      </Container>
    </>
  );
}

type InfoCellProps = {
  state: number;
  information: v1.SpecialroomInfo[];
  setInformation: React.Dispatch<React.SetStateAction<v1.SpecialroomInfo[]>>;
};

function InfoCell(props: InfoCellProps) {
  const { state, information, setInformation } = props;

  const payload = Utility.getTokenPayload();

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
                placement="top-start"
                key={information.applyId}
                title={
                  <Box sx={{ textAlign: "left" }}>
                    <Text>{`신청자: ${information.master.name}`}</Text>
                    <Text>
                      {`신청 명단: ${information.applicants} - 총 ${
                        information.applicants.split(",").length
                      }인`}
                    </Text>
                    <Text>{`신청 장소: ${information.location}`}</Text>
                    <Text>{`신청 시간: ${information.when}차 면학`}</Text>
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
                          Utility.arrayRemove(final, information);
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
                Api.putSpecialroomInfo({
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
                Api.putSpecialroomInfo({
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
