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
import { useCallback, useEffect, useState } from "react";
import PaperTitle from "../../components/PaperTitle";
import {
  getBbsPost,
  getBbsPostHeaders,
  isSuccessed,
  putBbsPost,
} from "../../utils/Api";
import { useNavigate, useParams } from "react-router-dom";
import { Popup, SubmitButton } from "../../components";
import { DialogTitle } from "../../utils/Constants";

function Edit() {
  const params = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<v1.BbsPost | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);

  const board = params.board!;
  const postId = parseInt(params.postId!);

  useEffect(() => {
    getBbsPost({ board: board, postId: postId }).then((result) => {
      if (isSuccessed(result)) {
        setPost(result.post);
        getBbsPostHeaders({ board: board }).then((result) => {
          setHeaders(result.headers);
        });
      } else {
        navigate(`/bbs/${board}/list`);
      }
    });
  }, []);

  const onPostBbsPost = useCallback((e: React.MouseEvent<HTMLFormElement>) => {
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
    putBbsPost({
      postId: parseInt(params.postId!),
      board: params.board!,
      title: title,
      content: content,
      header: header,
      isPublic: isPublic,
    }).then((result) => {
      if (isSuccessed(result)) {
        Popup.stopLoading();
        Popup.openConfirmDialog(
          DialogTitle.Info,
          "피드백 수정이 완료되었습니다.",
          () => {
            navigate(`/bbs/${board}/${params.postId}`);
          }
        );
      } else {
        Popup.stopLoading();
        Popup.openConfirmDialog(DialogTitle.Info, result.message);
      }
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
          <Box
            component="form"
            onSubmit={onPostBbsPost}
            sx={{ padding: "50px 50px 30px 50px" }}
          >
            <PaperTitle>피드백 수정</PaperTitle>
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
                <br />
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
            <br />
            {post && (
              <SubmitButton color="primary.main" width="25%">
                수정하기
              </SubmitButton>
            )}
            <br />
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/bbs/${board}/list`);
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

export default Edit;
