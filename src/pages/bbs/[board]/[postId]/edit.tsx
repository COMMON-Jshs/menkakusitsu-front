import { v1 } from "@common-jshs/menkakusitsu-lib";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import Popup from "@/components/popup";
import { Api, Constants } from "@/utils";
import { TitleText } from "@/components/basics";
import { SubmitButton } from "@/components/basics/StyledButton";
import { useNavigate, useParams } from "@/router";

export default function EditScreen() {
  const { board, postId } = useParams("/bbs/:board/:postId/edit");
  const navigate = useNavigate();

  const [post, setPost] = useState<v1.BbsPost | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    Popup.startLoading("피드백을 불러오는 중입니다...");
    Api.getBbsPost({ board: board, postId: Number(postId) }).then(
      (response) => {
        Popup.stopLoading();
        if (Api.isSuccessed(response)) {
          setPost(response.post);
          Api.getBbsPostHeaders({ board: board }).then((result) => {
            setHeaders(result.headers);
          });
        } else {
          Popup.openConfirmDialog(
            Constants.DialogTitle.Alert,
            response.message,
            () => {
              navigate("/bbs/:board/list", { params: { board: board } });
            }
          );
        }
      }
    );
  }, [board, navigate, postId]);

  const onPostBbsPost = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = data.get("title")?.toString();
    const content = data.get("content")?.toString();
    const header = data.get("header")?.toString();
    const isPublic = data.get("isPrivate")?.toString() != "on";
    if (!title || !content || !header) {
      return;
    }
    Popup.startLoading("수정 중입니다...");
    Api.putBbsPost({
      postId: Number(postId),
      board: board,
      title: title,
      content: content,
      header: header,
      isPublic: isPublic,
    }).then((result) => {
      if (Api.isSuccessed(result)) {
        Popup.stopLoading();
        Popup.openConfirmDialog(
          Constants.DialogTitle.Info,
          "피드백 수정이 완료되었습니다.",
          () => {
            navigate("/bbs/:board/:postId/view", {
              params: { board: board, postId: postId },
            });
          }
        );
      } else {
        Popup.stopLoading();
        Popup.openConfirmDialog(Constants.DialogTitle.Info, result.message);
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
            onSubmit={onPostBbsPost}
            sx={{
              padding: "50px 30px 30px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <TitleText color="secondary" variant="h2">
              피드백 수정
            </TitleText>
            {post && (
              <>
                <Grid
                  container
                  spacing={2}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Grid item xs={10}>
                    <TextField
                      size="small"
                      label="제목"
                      name="title"
                      fullWidth
                      required
                      defaultValue={post.title}
                      inputProps={{ maxLength: 30 }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="title-header-label">말머리</InputLabel>
                      <Select
                        labelId="title-header-label"
                        id="title-header"
                        label="말머리"
                        name="header"
                        required
                        defaultValue={post.header}
                      >
                        {headers.map((header) => {
                          return (
                            <MenuItem key={header} value={header}>
                              {header}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <TextField
                  label="본문"
                  name="content"
                  fullWidth
                  multiline
                  rows={20}
                  required
                  defaultValue={post.content}
                  inputProps={{ maxLength: 500 }}
                />
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked={!post.isPublic} />}
                    label="비공개 피드백 작성"
                    name="isPrivate"
                  />
                </FormGroup>
              </>
            )}
            {post && (
              <SubmitButton backgroundColor="primary.main" width="192px">
                수정하기
              </SubmitButton>
            )}
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "right" }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/bbs/:board/list", { params: { board: board } });
                }}
              >
                목록
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
