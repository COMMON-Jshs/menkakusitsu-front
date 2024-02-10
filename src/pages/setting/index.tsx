import {
  Box,
  Container,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { ManageAccounts, MoreHoriz } from "@mui/icons-material";
import { ReactNode, useState } from "react";

import { AccountSetting, EtcSetting } from "@/pages/setting/sidebar";

type SidebarItem = {
  title: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  icon: ReactNode;
  item: ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    title: "계정",
    icon: <ManageAccounts />,
    item: <AccountSetting />,
  },
  {
    title: "기타",
    icon: <MoreHoriz />,
    item: <EtcSetting />,
  },
];

export function Setting() {
  const [currentSidebarItem, setCurrentSidebarItem] = useState<SidebarItem>(
    sidebarItems[0]
  );

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                width: 200,
              }}
            >
              <List>
                {sidebarItems.map((sidebarItem) => (
                  <ListItemButton
                    key={sidebarItem.title}
                    selected={sidebarItem.title === currentSidebarItem.title}
                    onClick={() => {
                      setCurrentSidebarItem(sidebarItem);
                    }}
                  >
                    <ListItemIcon>{sidebarItem.icon}</ListItemIcon>
                    <ListItemText primary={sidebarItem.title} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
            <Box
              sx={{
                padding: "50px 50px 30px 50px",
                width: "100%",
              }}
            >
              {currentSidebarItem.item}
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
