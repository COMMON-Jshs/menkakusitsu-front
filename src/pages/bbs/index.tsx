import { Navigate } from "@/router";

export default function IndexScreen() {
  return <Navigate to="/bbs/:board/list" params={{ board: "feedback" }} />;
}
