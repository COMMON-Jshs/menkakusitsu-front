import { v1 } from "@common-jshs/menkakusitsu-lib";
import {
  Box,
  Button,
  Container,
  Divider,
  Pagination,
  Paper,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteBbsComment,
  deleteBbsPost,
  getBbsCommentList,
  getBbsPost,
  isSuccessed,
  postBbsComment,
} from "../../utils/Api";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTokenPayload,
  getParameter,
  hasPermissionLevel,
} from "../../utils/Utility";
import { Popup } from "../../components";
import { COMMENT_LIST_SIZE, DialogTitle } from "../../utils/Constants";
import List from "./List";
import { Permission } from "@common-jshs/menkakusitsu-lib";
import { IconLink } from "../../components/basic/Link";

function Post() {
  const params = useParams();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const board = params.board!;
  const postId = parseInt(params.postId!);
  const page = Number(getParameter("page", "1"));
  const commentPage = Number(getParameter("commentPage", "1"));
  const payload = getTokenPayload();

  const [post, setPost] = useState<v1.BbsPost | null>(null);
  const [attachments, setAttachments] = useState<v1.FileInfo[] | undefined>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentList, setCommentList] = useState<v1.BbsComment[] | null>(null);

  const refresh = useCallback(() => {
    getBbsPost({ board: board, postId: postId }).then((result) => {
      if (isSuccessed(result)) {
        setPost(result.post);
        setAttachments(result.attachments);
        getBbsCommentList({
          board: board,
          postId: postId,
          commentPage: commentPage,
          commentListSize: COMMENT_LIST_SIZE,
        }).then((result) => {
          setCommentCount(result.commentCount);
          setCommentList(result.list);
        });
      } else {
        Popup.stopLoading();
        Popup.openDialog(DialogTitle.Info, result.message, () => {
          navigate(`/bbs/${board}/list`);
        });
      }
    });
  }, [commentPage, params]);

  const onPostComment = useCallback(
    (event: React.MouseEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const comment = data.get("comment")?.toString();
      if (!post || !comment) {
        return;
      }
      Popup.startLoading("작성 중입니다...");
      postBbsComment({
        board: board,
        postId: post.id,
        content: comment,
      }).then((result) => {
        Popup.stopLoading();
        if (isSuccessed(result)) {
          if (commentRef?.current) {
            commentRef.current.value = "";
          }

          refresh();
        } else {
          Popup.openDialog(DialogTitle.Info, result.message);
        }
      });
    },
    [post, commentRef]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

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
            onSubmit={onPostComment}
            sx={{ padding: "50px 50px 30px 50px" }}
          >
            {post && (
              <Typography variant="h5">
                {post.header} {post.title}
              </Typography>
            )}
            {post && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>{post.owner.name}</Typography>
                <Typography color="gray">{post.createdDate}</Typography>
              </Box>
            )}
            <Divider />
            <br />
            {post && (
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {post.content}
              </Typography>
            )}
            {attachments &&
              attachments.map((attachment) => {
                if (attachment.mimeType.startsWith("image")) {
                  return (
                    <img
                      key={attachment.downloadLink}
                      src={attachment.downloadLink}
                      style={{ width: "100%" }}
                      crossOrigin="anonymous"
                    />
                  );
                } else {
                  return (
                    <IconLink
                      href={attachment.downloadLink}
                      label={attachment.fileName}
                    />
                  );
                }
              })}
            <br />
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(`/bbs/${board}/list`);
                  }}
                >
                  목록
                </Button>
                {post &&
                  (payload?.uid === post.owner.uid ||
                    hasPermissionLevel(Permission.Dev)) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        navigate(`/bbs/${post.board}/${post.id}/edit`);
                      }}
                    >
                      수정
                    </Button>
                  )}
                {post &&
                  (payload?.uid === post.owner.uid ||
                    hasPermissionLevel(Permission.Dev)) && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        Popup.openDialog(
                          DialogTitle.Alert,
                          "정말 피드백을 삭제하실 건가요?",
                          () => {
                            deleteBbsPost({
                              board: board,
                              postId: post.id,
                            }).then((result) => {
                              Popup.openDialog(
                                DialogTitle.Info,
                                "피드백이 삭제되었습니다.",
                                () => {
                                  navigate(`/bbs/${post.board}/list`);
                                }
                              );
                            });
                          },
                          () => {}
                        );
                      }}
                    >
                      삭제
                    </Button>
                  )}
              </Stack>
            </Box>
            <Typography variant="h6">의견 {commentCount}개</Typography>
            <Stack spacing={2} direction="row" display="flex">
              <TextField
                name="comment"
                inputRef={commentRef}
                fullWidth
                multiline
                placeholder="댓글"
                inputProps={{ maxLength: 300 }}
              />
              <Button type="submit" variant="contained">
                작성
              </Button>
            </Stack>
            <br />
            <Stack spacing={2}>
              {commentList &&
                commentList.map((comment) => (
                  <Box key={comment.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>{comment.owner.name}</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography color="gray">
                          {comment.createdDate}
                        </Typography>
                        {(payload?.uid === comment.owner.uid ||
                          hasPermissionLevel(Permission.Dev)) && (
                          <IconButton
                            size="small"
                            onClick={() => {
                              Popup.openDialog(
                                DialogTitle.Alert,
                                "정말 의견을 삭제하실 건가요?",
                                () => {
                                  deleteBbsComment({
                                    board: board,
                                    postId: postId,
                                    commentId: comment.id,
                                  }).then((result) => {
                                    Popup.openDialog(
                                      DialogTitle.Info,
                                      "의견이 삭제되었습니다.",
                                      () => {
                                        refresh();
                                      }
                                    );
                                  });
                                },
                                () => {}
                              );
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Divider />
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {comment.content}
                    </Typography>
                  </Box>
                ))}
            </Stack>
            <br />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(commentCount / COMMENT_LIST_SIZE)}
                page={commentPage}
                onChange={(
                  event: React.ChangeEvent<unknown>,
                  value: number
                ) => {
                  navigate(
                    `/bbs/${board}/${postId}?page=${page}&commentPage=${value}`
                  );
                }}
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
        </Paper>
      </Container>
      <List />
    </>
  );
}

export default Post;
