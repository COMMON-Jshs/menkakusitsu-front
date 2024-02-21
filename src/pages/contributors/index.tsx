import { Permission } from "@common-jshs/menkakusitsu-lib";
import { Box, Container, Paper, Stack } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { useEffect } from "react";

import { contributors } from "@/pages/contributors/members";
import { IconLink, Text, TitleText } from "@/components/basics";
import { setHeaderActive } from "@/hooks/useNavbar";
import { useAuth } from "@/hooks/useAuth";

export default function ContributorsScreen() {
  const { payload } = useAuth();

  useEffect(() => {
    if (payload.permission <= Permission.Guest) {
      setHeaderActive(false);
      return () => {
        setHeaderActive(true);
      };
    }
  }, [payload]);

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
              만든 사람들
            </TitleText>
            <Stack spacing={2} alignItems="flex-start" sx={{ width: "100%" }}>
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
                        width: "96px",
                        height: "96px",
                        marginRight: "1em",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        whiteSpace: "pre-wrap",
                        gap: "4px",
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex" }}>
                          <Text variant="h5">{contributor.name}</Text>
                          <Text variant="h6">{`(${contributor.period})`}</Text>
                        </Box>
                        {contributor.description}
                      </Box>
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
