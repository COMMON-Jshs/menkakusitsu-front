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
} from "@mui/material";
import { Article as ArticleIcon, Campaign, Lock } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { TitleText, Theme } from "@/components";
import { Api, Constants, Utility } from "@/utils";

type ArticleProps = {
  post: v1.BbsPost;
  isNotice?: boolean;
  isHighlighted?: boolean;
  page: number;
};

function Article(props: ArticleProps) {
  const { post, isNotice, isHighlighted, page } = props;

  const theme = useTheme();
  const { style } = useContext(Theme.Context);

  return (
    <Link
      to={`/bbs/${post.board}/${post.id}?page=${page}`}
      style={{
        justifyContent: "space-between",
        textDecoration: "none",
        fontSize: "0.9em",
        padding: "0.4em",
        backgroundColor: isHighlighted
          ? style == "light"
            ? darken(theme.palette.background.paper, 0.2)
            : lighten(theme.palette.background.paper, 0.2)
          : "",
      }}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          float: "left",
          color: isNotice ? "#FF4E59" : "primary.dark",
        }}
      >
        {isNotice ? <Campaign /> : post.isPublic ? <ArticleIcon /> : <Lock />}
        {post.header} {post.title} [{post.commentCount}]
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          float: "right",
          color: "gray",
        }}
      >
        {post.owner.name}
      </Box>
    </Link>
  );
}

type PostListProps = {
  postList: v1.BbsPost[] | null;
  page: number;
  postId?: string;
};

function PostList(props: PostListProps) {
  const { postList, page, postId } = props;

  if (postList !== null && postList.length > 0) {
    return postList.map((post) => {
      return (
        <Article
          key={post.id}
          post={post}
          page={page}
          isNotice={post.postType === 0}
          isHighlighted={Boolean(postId) && post.id == Number(postId)}
        />
      );
    });
  } else {
    return <Typography>게시글이 없습니다.</Typography>;
  }
}

export function List() {
  const [postCount, setPostCount] = useState(0);
  const [postList, setPostList] = useState<v1.BbsPost[] | null>(null);

  const params = useParams();
  const navigate = useNavigate();

  const page = Number(Utility.getParameter("page", "1"));
  const board = params.board!;
  const postId = params.postId;

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
          <Box sx={{ padding: "50px 50px 30px 50px" }}>
            <TitleText>피드백</TitleText>
            <Stack spacing={2}>
              <PostList postList={postList} page={page} postId={postId} />
            </Stack>
            <br />
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/bbs/${board}/create`);
                }}
              >
                피드백하기
              </Button>
            </Box>
            <br />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(postCount / Constants.POST_LIST_SIZE)}
                page={page}
                onChange={(
                  event: React.ChangeEvent<unknown>,
                  value: number
                ) => {
                  if (postId) {
                    navigate(`/bbs/${board}/${postId}?page=${value}`);
                  } else {
                    navigate(`/bbs/${board}/list?page=${value}`);
                  }
                }}
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
