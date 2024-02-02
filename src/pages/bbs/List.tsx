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
import { useCallback, useContext, useEffect, useState } from "react";
import PaperTitle from "../../components/PaperTitle";
import { getBbsPostList } from "../../utils/Api";
import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useNavigate, useParams } from "react-router-dom";
import { POST_LIST_SIZE } from "../../utils/Constant";
import { getParameter } from "../../utils/Utility";
import { ThemeContext } from "../../components/theme/ThemeContext";
interface ArticleProps {
  post: v1.BbsPost;
  isNotice?: boolean;
  isHighlighted?: boolean;
  page: number;
}

function Article(props: ArticleProps) {
  const { post, isNotice, isHighlighted, page } = props;

  const theme = useTheme();
  const { style } = useContext(ThemeContext);

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
        {isNotice ? (
          <CampaignIcon />
        ) : post.isPublic ? (
          <ArticleIcon />
        ) : (
          <LockIcon />
        )}
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

function List() {
  const [postCount, setPostCount] = useState(0);
  const [postList, setPostList] = useState<v1.BbsPost[] | null>(null);

  const params = useParams();
  const navigate = useNavigate();

  const page = Number(getParameter("page", "1"));
  const board = params.board!;
  const postId = params.postId;

  useEffect(() => {
    getBbsPostList({
      board: board,
      postPage: page,
      postListSize: POST_LIST_SIZE,
    }).then((result) => {
      setPostCount(result.postCount);
      setPostList(result.list);
    });
  }, [page]);

  const drawBbsPostList = useCallback(() => {
    if (postList !== null && postList.length > 0) {
      return postList.map((post) => {
        return (
          <Article
            key={post.id}
            post={post}
            page={page}
            isNotice={post.postType === 0}
            isHighlighted={Boolean(postId) && post.id == Number(postId!)}
          />
        );
      });
    } else {
      return <Typography>게시글이 없습니다.</Typography>;
    }
  }, [postList, postId]);

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
            <PaperTitle>피드백</PaperTitle>
            <Stack spacing={2}>{drawBbsPostList()}</Stack>
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
                count={Math.ceil(postCount / POST_LIST_SIZE)}
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

export default List;
