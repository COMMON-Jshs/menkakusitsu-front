import { v1, Permission } from "@common-jshs/menkakusitsu-lib";
import {
  Box,
  Button,
  Container,
  Divider,
  Pagination,
  Paper,
  TextField,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";

import { Api, Utility, Constants } from "@/utils/";
import Popup from "@/components/popup";
import ListScreen from "@/pages/bbs/[board]/list";
import { IconLink, Text } from "@/components/basics";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "@/router";
import Spinner from "@/components/basics/Spinner";

export default function ViewScreen() {
  const { board, postId } = useParams("/bbs/:board/:postId/view");

  const navigate = useNavigate();
  const { payload } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<v1.BbsPost | null>(null);
  const [attachments, setAttachments] = useState<v1.FileInfo[] | undefined>();

  const refresh = useCallback(() => {
    setIsLoading(true);
    Api.getBbsPost({ board: board, postId: Number(postId) }).then((result) => {
      if (Api.isSuccessed(result)) {
        setIsLoading(false);
        setPost(result.post);
        setAttachments(result.attachments);
      } else {
        Popup.stopLoading();
        Popup.openConfirmDialog(
          Constants.DialogTitle.Info,
          result.message,
          () => {
            navigate("/bbs/:board/list", { params: { board: board } });
          }
        );
      }
    });
  }, [board, navigate, postId]);

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
            sx={{
              padding: "50px 30px 30px 30px",
            }}
          >
            {isLoading && <Spinner text="피드백을 불러오는 중입니다..." />}
            {!isLoading && post && (
              <>
                <Text variant="h5">
                  {post.header} {post.title}
                </Text>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{post.owner.name}</Text>
                  <Text color="gray">{post.createdDate}</Text>
                </Box>
                <Divider />
                <Text sx={{ whiteSpace: "pre-wrap" }}>{post.content}</Text>
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
                <Box sx={{ display: "flex", justifyContent: "right" }}>
                  <Stack spacing={2} direction="row">
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate("/bbs/:board/list", {
                          params: { board: board },
                        });
                      }}
                    >
                      목록
                    </Button>
                    {(payload.uid === post.owner.uid ||
                      payload.hasPermission(Permission.Dev)) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          navigate("/bbs/:board/:postId/edit", {
                            params: { board: board, postId: String(post.id) },
                          });
                        }}
                      >
                        수정
                      </Button>
                    )}
                    {post &&
                      (payload.uid === post.owner.uid ||
                        payload.hasPermission(Permission.Dev)) && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            Popup.openYesNoDialog(
                              Constants.DialogTitle.Alert,
                              "정말 피드백을 삭제하실 건가요?",
                              () => {
                                Api.deleteBbsPost({
                                  board: board,
                                  postId: post.id,
                                }).then((result) => {
                                  Popup.openConfirmDialog(
                                    Constants.DialogTitle.Info,
                                    "피드백이 삭제되었습니다.",
                                    () => {
                                      navigate("/bbs/:board/list", {
                                        params: { board: board },
                                      });
                                    }
                                  );
                                });
                              }
                            );
                          }}
                        >
                          삭제
                        </Button>
                      )}
                  </Stack>
                </Box>
              </>
            )}
            <CommentSection />
          </Box>
        </Paper>
      </Container>
      <ListScreen />
    </>
  );
}

function CommentSection() {
  const { board, postId } = useParams("/bbs/:board/:postId/view");
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();
  const { payload } = useAuth();

  const page = Number(Utility.getParameter("page", "1"));
  const commentPage = Number(Utility.getParameter("commentPage", "1"));

  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [commentList, setCommentList] = useState<v1.BbsComment[]>([]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    Api.getBbsCommentList({
      board: board,
      postId: Number(postId),
      commentPage: commentPage,
      commentListSize: Constants.COMMENT_LIST_SIZE,
    }).then((result) => {
      setIsLoading(false);
      setCommentCount(result.commentCount);
      setCommentList(result.list);
    });
  }, [commentPage, board, postId]);

  const onPostComment = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const comment = data.get("comment")?.toString();
    if (!comment) {
      return;
    }
    Popup.startLoading("작성 중입니다...");
    Api.postBbsComment({
      board: board,
      postId: Number(postId),
      content: comment,
    }).then((result) => {
      Popup.stopLoading();
      refresh();
      if (Api.isSuccessed(result)) {
        if (commentRef?.current) {
          commentRef.current.value = "";
        }
      } else {
        Popup.openConfirmDialog(Constants.DialogTitle.Info, result.message);
      }
    });
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Box component="form" onSubmit={onPostComment} mt="16px">
      <Text variant="h6">의견 {isLoading ? 0 : commentCount}개</Text>
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
      <Stack spacing={2} mt="16px">
        {isLoading && <Spinner text="댓글을 불러오는 중입니다..." />}
        {!isLoading &&
          commentList.map((comment) => (
            <Box key={comment.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    <Text noWrap sx={{ width: "100%" }}>
                      {comment.owner.name}
                    </Text>
                  </Grid>
                  <Grid item xs={3}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        color: "gray",
                      }}
                    >
                      <Text noWrap color="gray">
                        {comment.createdDate}
                      </Text>
                    </Box>
                  </Grid>
                  <Grid item xs={0.5}>
                    {(payload.uid === comment.owner.uid ||
                      payload.hasPermission(Permission.Dev)) && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          Popup.openYesNoDialog(
                            Constants.DialogTitle.Alert,
                            "정말 의견을 삭제하실 건가요?",
                            () => {
                              Api.deleteBbsComment({
                                board: board,
                                postId: Number(postId),
                                commentId: comment.id,
                              }).then((result) => {
                                Popup.openConfirmDialog(
                                  Constants.DialogTitle.Info,
                                  "의견이 삭제되었습니다.",
                                  () => {
                                    refresh();
                                  }
                                );
                              });
                            }
                          );
                        }}
                      >
                        <Close fontSize="inherit" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Text sx={{ whiteSpace: "pre-wrap" }}>{comment.content}</Text>
            </Box>
          ))}
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(commentCount / Constants.COMMENT_LIST_SIZE)}
          page={commentPage}
          onChange={(event: React.ChangeEvent<unknown>, value: number) => {
            navigate(
              {
                pathname: "/bbs/:board/:postId/view",
                search: `page=${page}&commentPage=${value}`,
              },
              { params: { board: board, postId: postId } }
            );
          }}
          variant="outlined"
          color="primary"
        />
      </Box>
    </Box>
  );
}
