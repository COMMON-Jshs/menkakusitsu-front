import { Permission } from "@common-jshs/menkakusitsu-lib";

import { Utility } from "@/utils";
import { Teacher } from "@/pages/main/teacher";
import { Student } from "@/pages/main/student";
import { Guest } from "@/pages/main/guest";

export function Main() {
  const permission = Utility.getPermissionLevel();
  switch (permission) {
    case Permission.Dev:
      return <Student />;
    case Permission.Teacher:
      return <Teacher />;
    case Permission.Student:
      return <Student />;
    case Permission.Guest:
      return <Guest />;
    default:
      return <Guest />;
  }
}
