import { v1 } from "@common-jshs/menkakusitsu-lib";
import {
  Box,
  Button,
  Container,
  Pagination,
  Paper,
  Stack,
  Typography,
  useTheme,
  darken,
  lighten,
  Grid,
} from "@mui/material";
import { Article as ArticleIcon, Campaign, Lock } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@/router";

import { Api, Constants, Utility } from "@/utils";
import { Text, TitleText } from "@/components/basics";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ListScreen() {
  const [postCount, setPostCount] = useState(0);
  const [postList, setPostList] = useState<v1.BbsPost[] | null>(null);

  const { board, postId } = useParams("/bbs/:board/:postId/view");
  const navigate = useNavigate();

  const page = Number(Utility.getParameter("page", "1"));

  useEffect(() => {
    Api.getBbsPostList({
      board: board,
      postPage: page,
      postListSize: Constants.POST_LIST_SIZE,
    }).then((result) => {
      setPostCount(result.postCount);
      setPostList(result.list);
    });
  }, [page, board]);

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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <TitleText color="secondary" variant="h2">
              피드백
            </TitleText>
            <Stack spacing={2} width="100%">
              {postList !== null && postList.length > 0 ? (
                postList.map((post) => {
                  return (
                    <Article
                      key={post.id}
                      post={post}
                      page={page}
                      isNotice={post.postType === 0}
                      isHighlighted={
                        Boolean(postId) && post.id == Number(postId)
                      }
                    />
                  );
                })
              ) : (
                <Typography>게시글이 없습니다.</Typography>
              )}
            </Stack>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/bbs/:board/create", { params: { board: board } });
                }}
              >
                <Text variant="body1">피드백하기</Text>
              </Button>
            </Box>
            <Pagination
              count={Math.ceil(postCount / Constants.POST_LIST_SIZE)}
              page={page}
              onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                if (postId) {
                  navigate(
                    {
                      pathname: "/bbs/:board/:postId/view",
                      search: `page=${value}`,
                    },
                    { params: { board: board, postId: postId } }
                  );
                } else {
                  navigate(`/bbs/:board/create`, {
                    params: { board: board },
                  });
                  navigate(
                    {
                      pathname: "/bbs/:board/list",
                      search: `page=${value}`,
                    },
                    { params: { board: board } }
                  );
                }
              }}
              variant="outlined"
              color="primary"
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

type ArticleProps = {
  post: v1.BbsPost;
  isNotice?: boolean;
  isHighlighted?: boolean;
  page: number;
};

function Article(props: ArticleProps) {
  const { post, isNotice, isHighlighted, page } = props;

  const theme = useTheme();
  const { scheme } = useColorScheme();

  return (
    <Link
      to={{ pathname: `/bbs/:board/:postId/view`, search: `page=${page}` }}
      params={{ board: post.board, postId: String(post.id) }}
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        textDecoration: "none",
        padding: "4px",
        backgroundColor: isHighlighted
          ? scheme == "light"
            ? darken(theme.palette.background.paper, 0.2)
            : lighten(theme.palette.background.paper, 0.2)
          : undefined,
      }}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={8.5}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              color: isNotice ? "#FF4E59" : "primary.dark",
            }}
          >
            {isNotice ? (
              <Campaign />
            ) : post.isPublic ? (
              <ArticleIcon />
            ) : (
              <Lock />
            )}
            <Text noWrap>
              {post.header} {post.title} [{post.commentCount}]
            </Text>
          </Box>
        </Grid>
        <Grid item xs={3.5}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              color: "gray",
            }}
          >
            <Text noWrap>{post.owner.name}</Text>
          </Box>
        </Grid>
      </Grid>
    </Link>
  );
}
