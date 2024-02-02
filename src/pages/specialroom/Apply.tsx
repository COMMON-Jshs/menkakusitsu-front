import { useEffect, useState } from "react";
import { v1 } from "@common-jshs/menkakusitsu-lib";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import {
  openConfirmDialog,
  closeWaitDialog,
  openWaitDialog,
  openYesNoDialog,
} from "../../components/popup";
import {
  getSpecialroomLocationInfo,
  getSpecialroomManagerInfo,
  getSpecialroomPurposeInfo,
  getSpecialroomStudentInfo,
  getSpecialroomTeacherInfo,
  isApiSuccessed,
  postSpecialroomApply,
  postUserPush,
} from "../../utils/Api";
import { DialogTitle } from "../../utils/Constant";
import { SpecialroomInfoPanel } from "../../components/panel";
import PaperTitle from "../../components/PaperTitle";
import { SubmitButton } from "../../components/button";
import { getDayInfo } from "../../utils/Utility";

function Apply() {
  const [managerInfo, setManagerInfo] = useState<v1.UserInfo | null>(null);
  const [locationInfos, setLocationInfos] = useState<v1.LocationInfo[]>([]);
  const [purposeInfos, setPurposeInfos] = useState<v1.PurposeInfo[]>([]);
  const [studentInfos, setStudentInfos] = useState<v1.UserInfo[]>([]);
  const [teacherInfos, setTeacherInfos] = useState<v1.UserInfo[]>([]);

  const [when, setWhen] = useState(1);
  const [applicants, setApplicants] = useState<v1.UserInfo[]>([]);
  const [teacher, setTeacher] = useState<v1.UserInfo | null>(null);

  const [activeStep, setActiveStep] = useState(0);

  const today = dayjs();
  const { year, month, date } = getDayInfo();
  const navigate = useNavigate();

  const steps = [
    {
      title: "사용 시간 선택",
      content: (
        <>
          <Typography>
            {year}년 {month}월 {date}일의 생활 지도 선생님은 &lt;
            {(managerInfo && managerInfo.value) || "???"}
            &gt;이십니다.
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="select-when">사용 시간</InputLabel>
            <Select
              labelId="select-when"
              id="select-when"
              value={when}
              onChange={(event) => {
                setWhen(parseInt(event.target.value.toString()));
              }}
              label="사용 시간"
              name="when"
            >
              <MenuItem value={1}>1차 면학</MenuItem>
              <MenuItem value={2}>2차 면학</MenuItem>
            </Select>
          </FormControl>
        </>
      ),
    },
    {
      title: "사용 장소 선택",
      content: (
        <>
          <Typography>
            신청 목적은 상관없지만 신청 장소는 바르게 선택해 주시기 바랍니다.
          </Typography>
          <FormControl>
            <FormLabel id="specialroom-location">사용 장소</FormLabel>
            <RadioGroup
              aria-labelledby="specialroom-location"
              name="specialroom-purpose"
            >
              {locationInfos.map((location) => {
                if (location.id >= 0) {
                  return (
                    <FormControlLabel
                      key={location.id}
                      id={`location${location.id}`}
                      name="location"
                      value={location.value}
                      control={<Radio />}
                      label={location.value}
                    />
                  );
                } else {
                  return (
                    <FormControlLabel
                      key={location.id}
                      value={location.value}
                      control={<Radio />}
                      label={
                        <TextField
                          id={`location${location.id}`}
                          name="location"
                          label={location.value}
                        />
                      }
                    />
                  );
                }
              })}
            </RadioGroup>
          </FormControl>
        </>
      ),
    },
    {
      title: "사용 목적 선택",
      content: (
        <>
          <FormControl>
            <FormLabel id="specialroom-purpose">사용 목적</FormLabel>
            <RadioGroup
              aria-labelledby="specialroom-purpose"
              name="specialroom-purpose"
            >
              {purposeInfos.map((purpose) => {
                if (purpose.id >= 0) {
                  return (
                    <FormControlLabel
                      key={purpose.id}
                      id={`purpose${purpose.id}`}
                      name="purpose"
                      value={purpose.value}
                      control={<Radio />}
                      label={purpose.value}
                    />
                  );
                } else {
                  return (
                    <FormControlLabel
                      key={purpose.id}
                      value={purpose.value}
                      control={<Radio />}
                      label={
                        <TextField
                          id={`purpose${purpose.id}`}
                          name="purpose"
                          label={purpose.value}
                        />
                      }
                    />
                  );
                }
              })}
            </RadioGroup>
          </FormControl>
        </>
      ),
    },
    {
      title: "학생 선택",
      content: (
        <>
          <Typography>
            학번 혹은 이름 입력 시 자동완성이 활성화됩니다.
          </Typography>
          <Autocomplete
            multiple
            id="autocomplete-students"
            onChange={(event, newValue) => {
              setApplicants(newValue);
            }}
            options={studentInfos}
            getOptionLabel={(option) => option.value}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="특별실 사용 학생 명단"
                placeholder="예시) 2202 고승한"
              />
            )}
          />
        </>
      ),
    },
    {
      title: "선생님 선택",
      content: (
        <>
          <Typography>선생님 성함 입력 시 자동완성이 활성화됩니다.</Typography>
          <Autocomplete
            id="autocomplete-teachers"
            onChange={(event, newValue) => {
              setTeacher(newValue);
            }}
            options={teacherInfos}
            getOptionLabel={(option) => option.value}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="선생님 선택"
                placeholder="예시) 강지현(지구과학) 선생님"
              />
            )}
          />
        </>
      ),
    },
  ];

  const onClickNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onClickBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onClickReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    getSpecialroomManagerInfo({ when: today.format("YYYY-MM-DD") }).then(
      (result) => {
        if (result.status >= 0) {
          setManagerInfo(result.manager);
        }
        getSpecialroomLocationInfo({}).then((result) => {
          setLocationInfos(result.locationInfo);
          getSpecialroomPurposeInfo({}).then((result) => {
            setPurposeInfos(result.purposeInfo);
            getSpecialroomStudentInfo({}).then((result) => {
              setStudentInfos(result.studentInfo);
              getSpecialroomTeacherInfo({}).then((result) => {
                setTeacherInfos(result.teacherInfo);
              });
            });
          });
        });
      }
    );
  }, []);

  const onPostApply = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const location = data.get("location")?.toString();
    if (!location) {
      openConfirmDialog(
        DialogTitle.Alert,
        "사용 장소 선택을 하지 않으셨습니다."
      );
      setActiveStep(1);
      return;
    }
    const purpose = data.get("purpose")?.toString();
    if (!purpose) {
      openConfirmDialog(
        DialogTitle.Alert,
        "사용 목적 선택을 하지 않으셨습니다."
      );
      setActiveStep(2);
      return;
    }
    if (applicants.length === 0) {
      openConfirmDialog(
        DialogTitle.Alert,
        "학생 명단 선택을 하지 않으셨습니다."
      );
      setActiveStep(3);
      return;
    }
    if (!teacher) {
      openConfirmDialog(DialogTitle.Alert, "선생님 선택을 하지 않으셨습니다.");
      setActiveStep(4);
      return;
    }
    openWaitDialog(DialogTitle.Info, "특별실을 신청하는 중입니다...");
    postSpecialroomApply({
      location: location,
      purpose: purpose,
      applicants: applicants,
      teacherUid: teacher.uid,
      when: when,
    }).then((result) => {
      if (isApiSuccessed(result)) {
        closeWaitDialog();
        openYesNoDialog(
          DialogTitle.Info,
          "특별실 신청에 성공했습니다. 신청 현황 페이지를 보시겠습니까?",
          () => {
            navigate("/specialroom/status");
          }
        );
        postUserPush({
          targetUid: teacher.uid,
          notification: {
            title: "학생들이 특별실을 신청했습니다.",
            body: purpose.toString(),
            link: `${import.meta.env.VITE_WEB_PREFIX}/specialroom/management`,
          },
        });
      } else {
        closeWaitDialog();
        openConfirmDialog(DialogTitle.Info, result.message);
      }
    });
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box
            component="form"
            onSubmit={onPostApply}
            sx={{ padding: "50px 30px 30px 30px" }}
          >
            <PaperTitle>특별실 신청하기</PaperTitle>
            <SpecialroomInfoPanel />
            <Box sx={{ padding: "30px 30px 30px" }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => {
                  return (
                    <Step key={step.title}>
                      <StepLabel
                        optional={
                          index === steps.length - 1 ? (
                            <Typography variant="caption">Last step</Typography>
                          ) : null
                        }
                      >
                        {step.title}
                      </StepLabel>
                      <StepContent
                        TransitionProps={{
                          unmountOnExit: false,
                        }}
                      >
                        {step.content}
                        <Box sx={{ mb: 2 }}>
                          {index !== steps.length - 1 && (
                            <Button
                              variant="contained"
                              onClick={onClickNext}
                              sx={{
                                mt: 1,
                                mr: 1,
                              }}
                            >
                              다음
                            </Button>
                          )}

                          <Button
                            disabled={index === 0}
                            onClick={onClickBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            뒤로가기
                          </Button>
                          <Button onClick={onClickReset} sx={{ mt: 1, mr: 1 }}>
                            처음으로
                          </Button>
                        </Box>
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
            <SubmitButton color="primary.main">신청하기</SubmitButton>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Apply;
