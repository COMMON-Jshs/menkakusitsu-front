import { v1 } from "@common-jshs/menkakusitsu-lib";
import { Box, Divider, Paper, Skeleton, Typography } from "@mui/material";
import { ReactNode, useState, useEffect } from "react";
import dayjs from "dayjs";

import { Api } from "@/utils";

type MealProps = {
  isHighlighted: boolean;
  children: ReactNode;
};

function Meal(props: MealProps) {
  const { isHighlighted, children } = props;

  if (isHighlighted) {
    return (
      <Box
        sx={{
          display: "block",
          padding: "34px 30px 30px 30px",
          borderRadius: "1px",
          borderStyle: "solid none none none",
          borderColor: "primary.main",
          borderWidth: "8px",
          flex: 1,
        }}
      >
        {children}
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: "block",
          padding: "50px 30px 30px 30px",
          flex: 1,
        }}
      >
        {children}
      </Box>
    );
  }
}

interface MealInfoProps {
  type: "breakfast" | "lunch" | "dinner";
  meals?: string[];
}

function MealInfo(props: MealInfoProps) {
  const { type, meals } = props;

  const currentHour = dayjs().hour();
  let mealName: string = "";
  let isHighlighted: boolean = false;
  switch (type) {
    case "breakfast":
      mealName = "아침";
      isHighlighted = currentHour >= 19;
      break;
    case "lunch":
      mealName = "점심";
      isHighlighted = currentHour < 13;
      break;
    case "dinner":
      mealName = "저녁";
      isHighlighted = currentHour >= 13 && currentHour < 19;
      break;
  }

  return (
    <Meal isHighlighted={isHighlighted}>
      <Typography variant="h5">{mealName}</Typography>
      {meals ? (
        meals.map((meal) => {
          return (
            <Typography key={meal} variant="h6">
              <div dangerouslySetInnerHTML={{ __html: `- ${meal}` }} />
            </Typography>
          );
        })
      ) : (
        <Box>
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
        </Box>
      )}
    </Meal>
  );
}

export function MealPanel() {
  const [mealInfo, setMealInfo] = useState<v1.GetMealResponse | null>(null);

  useEffect(() => {
    const today = dayjs();
    Api.getMeal({ when: today.startOf("day").format("YYYY-MM-DD") }).then(
      (result) => {
        setMealInfo(result);
      }
    );
  }, []);

  return (
    <>
      <Box>
        <Paper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <MealInfo type="lunch" meals={mealInfo?.lunch.meals} />
            <Divider orientation="vertical" flexItem />
            <MealInfo type="dinner" meals={mealInfo?.dinner.meals} />
            <Divider orientation="vertical" flexItem />
            <MealInfo type="breakfast" meals={mealInfo?.breakfast.meals} />
          </Box>
        </Paper>
      </Box>
    </>
  );
}
