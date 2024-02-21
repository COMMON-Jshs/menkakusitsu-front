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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";

import { Api, Utility, Constants } from "@/utils/";
import Popup from "@/components/popup";
import ListScreen from "@/pages/bbs/[board]/list";
import { IconLink, Text } from "@/components/basics";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "@/router";

export default function ViewScreen() {
  const { board, postId } = useParams("/bbs/:board/:postId/view");

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { payload } = useAuth();

  const page = Number(Utility.getParameter("page", "1"));
  const commentPage = Number(Utility.getParameter("commentPage", "1"));

  const [post, setPost] = useState<v1.BbsPost | null>(null);
  const [attachments, setAttachments] = useState<v1.FileInfo[] | undefined>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentList, setCommentList] = useState<v1.BbsComment[] | null>(null);

  const refresh = useCallback(() => {
    Api.getBbsPost({ board: board, postId: Number(postId) }).then((result) => {
      if (Api.isSuccessed(result)) {
        setPost(result.post);
        setAttachments(result.attachments);
        Api.getBbsCommentList({
          board: board,
          postId: Number(postId),
          commentPage: commentPage,
          commentListSize: Constants.COMMENT_LIST_SIZE,
        }).then((result) => {
          setCommentCount(result.commentCount);
          setCommentList(result.list);
        });
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
  }, [commentPage, board, navigate, postId]);

  const onPostComment = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const comment = data.get("comment")?.toString();
    if (!post || !comment) {
      return;
    }
    Popup.startLoading("작성 중입니다...");
    Api.postBbsComment({
      board: board,
      postId: post.id,
      content: comment,
    }).then((result) => {
      Popup.stopLoading();
      if (Api.isSuccessed(result)) {
        if (commentRef?.current) {
          commentRef.current.value = "";
        }

        refresh();
      } else {
        Popup.openConfirmDialog(Constants.DialogTitle.Info, result.message);
      }
    });
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!post) {
    return null;
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
          <Box
            component="form"
            onSubmit={onPostComment}
            sx={{
              padding: "50px 30px 30px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
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
                    navigate("/bbs/:board/list", { params: { board: board } });
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
            <Text variant="h6">의견 {commentCount}개</Text>
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
                      <Text>{comment.owner.name}</Text>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Text color="gray">{comment.createdDate}</Text>
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
                      </Box>
                    </Box>
                    <Divider />
                    <Text sx={{ whiteSpace: "pre-wrap" }}>
                      {comment.content}
                    </Text>
                  </Box>
                ))}
            </Stack>
            <br />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(commentCount / Constants.COMMENT_LIST_SIZE)}
                page={commentPage}
                onChange={(
                  event: React.ChangeEvent<unknown>,
                  value: number
                ) => {
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
        </Paper>
      </Container>
      <ListScreen />
    </>
  );
}
