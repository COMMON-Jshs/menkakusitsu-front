import { Permission, v1 } from "@common-jshs/menkakusitsu-lib";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Popup from "@/components/popup";
import { Api } from "@/utils";
import { TitleText } from "@/components/basics";

type UserBoxProps = {
  user: v1.UserInfo;
  setUsers: Dispatch<SetStateAction<v1.UserInfo[]>>;
};

function UserBox(props: UserBoxProps) {
  const { user, setUsers } = props;
  return (
    <Grid item xs={3}>
      <FormControlLabel
        label={user.name}
        control={
          <Checkbox
            color="secondary"
            onChange={(event) => {
              if (event.target.checked) {
                Popup.startLoading("처리 중입니다...");
                Api.deleteSecession({
                  name: user.name,
                }).then((result) => {
                  Popup.stopLoading();
                  Api.getSpecialroomStudentInfo({}).then((result) => {
                    setUsers(result.studentInfo);
                  });
                });
              }
            }}
          />
        }
      />
    </Grid>
  );
}

export default function UserManagementScreen() {
  const [users, setUsers] = useState<v1.UserInfo[]>([]);

  useEffect(() => {
    Api.getSpecialroomStudentInfo({}).then((result) => {
      setUsers(result.studentInfo);
    });
  }, []);

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
            <TitleText>유저 관리</TitleText>
            <Box sx={{ padding: "30px 30px 30px" }}>
              <TextField label="이름" name="name" />
              <Grid container spacing={2}>
                {users.map((user) => {
                  return (
                    <UserBox key={user.name} user={user} setUsers={setUsers} />
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

UserManagementScreen.permission = Permission.Dev;
