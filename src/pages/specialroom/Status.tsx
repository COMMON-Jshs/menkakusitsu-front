import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  Stepper,
  Typography,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  StepIconProps,
} from "@mui/material";
import { SpecialroomInfoPanel } from "../../components";
import {
  deleteSpecialroomApply,
  getSpecialroomApply,
  isSuccessed,
} from "../../utils/Api";
import PaperTitle from "../../components/PaperTitle";
import { styled } from "@mui/material/styles";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCallback } from "react";
import SubmitButton from "../../components/button/SubmitButton";
import { DialogTitle } from "../../utils/Constants";
import {
  openConfirmDialog,
  openYesNoDialog,
  closeWaitDialog,
  openWaitDialog,
} from "../../components/popup";
import { v1 } from "@common-jshs/menkakusitsu-lib";

const ColorlibConnector = styled(StepConnector)<{ isapproved: number }>(
  ({ theme, isapproved }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 27,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: `${
          isapproved >= 0
            ? theme.palette.success.light
            : theme.palette.error.light
        }`,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: `${
          isapproved >= 0
            ? theme.palette.success.light
            : theme.palette.error.light
        }`,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 10,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  })
);

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
  isApproved: number;
}>(({ theme, ownerState, isApproved }) => {
  return {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 64,
    height: 64,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundColor: `${
        isApproved >= 0
          ? theme.palette.success.light
          : theme.palette.error.light
      }`,
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundColor: `${
        isApproved >= 0
          ? theme.palette.success.light
          : theme.palette.error.light
      }`,
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
  };
});

interface ColorlibStepIconProps extends StepIconProps {
  isApproved: number;
}

function ColorlibStepIcon(props: ColorlibStepIconProps) {
  const { active, completed, className, isApproved } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <GroupAddIcon />,
    2: <HourglassTopIcon />,
    3: <CheckCircleIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
      isApproved={isApproved}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ["신청 완료", "승인 대기 중", "승인 완료"];

function Status() {
  const [applyStatus, setApplyStatus] = useState<v1.SpecialroomInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const [when, setWhen] = useState(1);

  const refresh = useCallback(() => {
    setIsLoading(true);
    getSpecialroomApply({ when: when }).then((result) => {
      setApplyStatus(result.specialroomInfo);
      setIsLoading(false);
    });
  }, [when]);

  const onCancelApply = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    openYesNoDialog(
      DialogTitle.Info,
      "정말 특별실 신청을 취소하시겠습니까?",
      () => {
        openWaitDialog(DialogTitle.Info, "특별실 신청을 취소 중입니다...");
        deleteSpecialroomApply({ when: when }).then((result) => {
          if (isSuccessed(result)) {
            closeWaitDialog();
            refresh();
          } else {
            closeWaitDialog();
            openConfirmDialog(DialogTitle.Info, result.message);
            refresh();
          }
        });
      },
      () => {}
    );
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  let activeStep = -1;

  if (applyStatus) {
    if (applyStatus.state === 0) {
      activeStep = 1;
    } else if (applyStatus.state === 1) {
      activeStep = 2;
    } else if (applyStatus.state === -1) {
      activeStep = 2;
    }
  }

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box component="form" sx={{ padding: "50px 30px 30px 30px" }}>
            <PaperTitle>특별실 신청 현황</PaperTitle>
            <Box sx={{ padding: "30px 90px 30px" }}>
              <Typography variant="h5">몇 차 면학으로 신청하셨나요?</Typography>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="select-when">사용 시간</InputLabel>
                <Select
                  labelId="select-when"
                  id="select-when"
                  value={when}
                  label="사용 시간"
                  onChange={(event) => {
                    setWhen(Number(event.target.value));
                  }}
                >
                  <MenuItem value={1}>1차 면학</MenuItem>
                  <MenuItem value={2}>2차 면학</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ padding: "16px 12px 0px" }}>
                {!isLoading ? (
                  applyStatus ? (
                    <Typography
                      noWrap
                      variant="h6"
                      sx={{
                        mr: 2,
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      선생님: {applyStatus.teacher.name}
                      <br />
                      신청자: {applyStatus.master.name}
                      <br />
                      장소: {applyStatus.location}
                      <br />
                      목적: {applyStatus.purpose}
                      {applyStatus.state === -1 && " - 거부됨"}
                      <br />
                      명단: {applyStatus.applicants} - 총
                      {applyStatus.applicants.split(",").length}
                      인
                      <br />
                      활동 시간: {applyStatus.when}차 면학
                    </Typography>
                  ) : (
                    <Typography
                      noWrap
                      sx={{
                        mr: 2,
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      신청 안 함
                    </Typography>
                  )
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Box>
            <Stack sx={{ width: "100%", paddingBottom: "32px" }} spacing={4}>
              <Stepper
                alternativeLabel
                activeStep={isLoading ? -1 : activeStep}
                connector={
                  <ColorlibConnector
                    isapproved={applyStatus ? applyStatus.state : 0}
                  />
                }
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={ColorlibStepIcon}
                      StepIconProps={
                        {
                          icon: index + 1,
                          isApproved: applyStatus ? applyStatus.state : 0,
                        } as ColorlibStepIconProps
                      }
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              {!isLoading && applyStatus && (
                <SubmitButton
                  width="25%"
                  color="error.main"
                  onClick={onCancelApply}
                >
                  신청 취소
                </SubmitButton>
              )}
            </Stack>
            <SpecialroomInfoPanel />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Status;
