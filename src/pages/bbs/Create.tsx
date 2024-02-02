import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import PaperTitle from "../../components/PaperTitle";
import {
  getBbsPostHeaders,
  isApiSuccessed,
  postBbsPost,
} from "../../utils/Api";
import { useNavigate, useParams } from "react-router-dom";
import {
  closeWaitDialog,
  openConfirmDialog,
  openWaitDialog,
  SubmitButton,
} from "../../components";
import { DialogTitle } from "../../utils/Constant";
import { DeleteOutline, UploadFile } from "@mui/icons-material";

function Create() {
  const navigate = useNavigate();
  const params = useParams();
  const [headers, setHeaders] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const board = params.board!;

  const onFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setFiles(Array.from(e.target.files));
  }, []);

  const removeFile = (file: File) => {
    setFiles(files.filter((_file) => _file != file));
  };

  useEffect(() => {
    getBbsPostHeaders({ board: board }).then((result) => {
      setHeaders(result.headers);
    });
  }, []);

  const onPostBbsPost = useCallback(
    (e: React.MouseEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const title = data.get("title")?.toString();
      const content = data.get("content")?.toString();
      const header = data.get("header")?.toString();
      const isPublic = data.get("isPrivate")?.toString() != "on";
      if (!title || !content || !header) {
        return;
      }
      openWaitDialog(DialogTitle.Info, "제출 중입니다...");
      postBbsPost(
        {
          title: title,
          content: content,
          header: header,
          board: board,
          isPublic: isPublic,
        },
        files
      ).then((result) => {
        if (isApiSuccessed(result)) {
          closeWaitDialog();
          openConfirmDialog(
            DialogTitle.Info,
            "피드백 제출이 완료되었습니다.",
            () => {
              navigate(`/bbs/${board}/list`);
            }
          );
        } else {
          closeWaitDialog();
          openConfirmDialog(DialogTitle.Info, result.message);
        }
      });
    },
    [files]
  );

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
            <PaperTitle>피드백 작성</PaperTitle>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <TextField
                  size="small"
                  label="제목"
                  name="title"
                  fullWidth
                  required
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
                    defaultValue=""
                  >
                    <MenuItem
                      disabled
                      value=""
                      sx={{
                        display: "none",
                      }}
                    >
                      <em>-</em>
                    </MenuItem>
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
              inputProps={{ maxLength: 500 }}
            />
            <br />
            <br />
            <Box
              sx={{
                textAlign: "center",
                borderStyle: "dotted",
                borderRadius: 1,
                borderColor: "lightgray",
                padding: "1em",
              }}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFile />}
                sx={{ padding: "1em" }}
              >
                파일 업로드
                <input
                  name="data"
                  type="file"
                  multiple
                  hidden
                  onChange={onFileUpload}
                />
              </Button>
              {files.map((file) => {
                return (
                  <Typography key={file.lastModified}>
                    {file.name}
                    <IconButton
                      onClick={() => {
                        removeFile(file);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Typography>
                );
              })}
            </Box>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="비공개 피드백 작성"
                name="isPrivate"
              />
            </FormGroup>
            {/* <Box 
                            sx={{
                                textAlign: "center",
                                p: 2,
                                border: "1px dashed grey",
                            }}
                        >
                            <Button variant="contained" component="label">
                                Upload File
                                <input
                                    type="file"
                                    name="data"
                                    multiple
                                    hidden
                                />
                            </Button>
                        </Box> */}
            <br />
            <SubmitButton color="primary.main" width="25%">
              작성하기
            </SubmitButton>
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

export default Create;
