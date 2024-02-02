import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import PaperTitle from "../../components/PaperTitle";
import { SubmitButton } from "../../components";
import { openInNewTab } from "../../utils/Utility";

const info = [
  "출석부 학생 배치는 면학실 자리 배치와 같습니다.",
  "출석부 최하단에 일일 특별실 신청 명단이 있습니다.",
  "학생이 특별실을 신청한 경우 학생 이름 아래에 번호가 적힙니다. 학생 이름 아래에 적힌 번호는 특별실 신청 번호이며, 출석부 최하단의 일일 특별실 신청 명단에서 세부 내용을 확인할 수 있습니다.",
  "학생이 특별실을 신청했으나 선생님이 신청을 거부했거나 승인하지 않은 경우, 학생 이름 아래에 '번호(X)'가 적힙니다.",
  "대부분의 경우 1차 면학 출석부를 다운받으시면 됩니다.",
];

function Info() {
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box sx={{ padding: "50px 30px 30px 30px" }}>
            <PaperTitle>출석부 다운로드 안내</PaperTitle>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {info.map((info, index) => {
                return (
                  <ListItem key={info}>
                    <ListItemText
                      primary={`${index + 1}. ${info}`}
                    ></ListItemText>
                  </ListItem>
                );
              })}
            </List>
            <SubmitButton
              color="primary.main"
              width="25%"
              style={{ margin: "20px" }}
              onClick={() => {
                openInNewTab("./download?when=1");
              }}
            >
              1차 면학 출석부 다운로드
            </SubmitButton>

            <SubmitButton
              color="primary.main"
              width="25%"
              onClick={() => {
                openInNewTab("./download?when=2");
              }}
            >
              2차 면학 출석부 다운로드
            </SubmitButton>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Info;
