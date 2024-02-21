import { Permission } from "@common-jshs/menkakusitsu-lib";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { useEffect } from "react";

import { contributors } from "@/pages/contributors/members";
import { TitleText, IconLink, Router } from "@/components";
import { Utility } from "@/utils";

export function Contributors() {
  useEffect(() => {
    if (Utility.getPermissionLevel() <= Permission.Guest) {
      Router.setHeaderActive(false);
      return () => {
        Router.setHeaderActive(true);
      };
    }
  }, []);

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box sx={{ padding: "50px 30px 30px 30px" }}>
            <TitleText>만든 사람들</TitleText>
            <Stack spacing={2}>
              {contributors.map((contributor) => {
                return (
                  <Box
                    key={contributor.name}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    <img
                      src={contributor.profile}
                      style={{
                        width: "7.5em",
                        height: "7.5em",
                        marginRight: "1em",
                      }}
                    />
                    <Box sx={{ whiteSpace: "pre-wrap" }}>
                      <Box sx={{ display: "flex" }}>
                        <Typography variant="h5">{contributor.name}</Typography>
                        <Typography variant="h6">
                          {`(${contributor.period})`}
                        </Typography>
                      </Box>
                      {contributor.description}
                      <br />
                      <br />
                      <IconLink
                        href={contributor.homepage}
                        label={contributor.homepage}
                        icon={<GitHub />}
                        newTab
                      />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
