import { Divider, Stack } from "@mui/material";
import { IconLink, IconNavLink } from "./basic/Link";
import SchoolIcon from "@mui/icons-material/School";
import PolicyIcon from "@mui/icons-material/Policy";
import GitHubIcon from "@mui/icons-material/GitHub";
import { InstagramLogo } from "./images/Instagram";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

function Footer() {
  return (
    <>
      <br />
      <Divider variant="middle" />
      <br />
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" variant="middle" flexItem />}
          spacing={2}
        >
          <IconLink
            href="http://jeju-s.jje.hs.kr/jeju-s"
            icon={<SchoolIcon />}
            label="제주과학고 공식 홈페이지"
            newTab
          />
          <IconLink
            href="https://www.instagram.com/jejuscience1999/"
            icon={<InstagramLogo />}
            label="제주과학고 공식 인스타그램"
            newTab
          />
          <IconLink
            href="https://www.instagram.com/jshs_bamboo/"
            icon={<InstagramLogo />}
            label="제주과학고 대나무숲"
            newTab
          />
        </Stack>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" variant="middle" flexItem />}
          spacing={2}
        >
          <IconLink
            href="/policy.html"
            icon={<PolicyIcon />}
            label="개인정보처리방침"
            newTab
          />
          <IconLink
            href="https://github.com/COMMON-Jshs"
            icon={<GitHubIcon />}
            label="Made by 제주과학고 정보 동아리 COMMON"
            newTab
          />
          <IconNavLink
            to="/contributors"
            label="만든 사람들"
            icon={<PeopleAltIcon />}
          />
        </Stack>
      </Stack>
      <br />
    </>
  );
}

export default Footer;
